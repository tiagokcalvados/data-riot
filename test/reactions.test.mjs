import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReactionHandler, emptyState, recordReaction } from '../lib/reaction-core.mjs';
import { reactionStore } from '../lib/reaction-store.mjs';
import { BlobError, BlobPreconditionFailedError } from '@vercel/blob';

test('storage adapter recognizes both ETag conflicts and simultaneous first creation', () => {
  const store = reactionStore('test-only');
  assert.equal(store.isConflict(new BlobPreconditionFailedError()), true);
  assert.equal(store.isConflict(new BlobError('This blob already exists, use `allowOverwrite: true` if you want to overwrite it.')), true);
  assert.equal(store.isConflict(new BlobError('Access denied')), false);
});

function memoryStore() {
  let state = null;
  let version = 0;
  return {
    writes: 0,
    async read() { return structuredClone(state); },
    async write(data, etag) {
      if (state?.etag !== etag) throw Object.assign(new Error('Conflict'), { conflict: true });
      this.writes++;
      state = { data: structuredClone(data), etag: String(++version) };
    },
    isConflict: error => error.conflict,
  };
}
test('distinct visitors count once; repeats are idempotent; changing moves the vote', async () => {
  const store = memoryStore();
  assert.equal((await recordReaction(store, 'a', 'heart', { now: 10000 })).counts.heart, 1);
  assert.equal((await recordReaction(store, 'a', 'heart', { now: 10001 })).counts.heart, 1);
  assert.equal(store.writes, 1);
  assert.equal((await recordReaction(store, 'b', 'heart', { now: 10001 })).counts.heart, 2);
  assert.equal((await recordReaction(store, 'a', 'fire', { now: 10002 })).status, 429);
  const changed = await recordReaction(store, 'a', 'fire', { now: 14000 });
  assert.equal(changed.counts.heart, 1);
  assert.equal(changed.counts.fire, 1);
});
test('simultaneous creation and updates do not lose other visitors or duplicate the same browser', async () => {
  const store = memoryStore();
  const results = await Promise.all(['a', 'b', 'c', 'c'].map(id => recordReaction(store, id, 'wow', { wait: async () => {} })));
  assert.ok(results.every(result => result.status === 200));
  assert.equal((await store.read()).data.counts.wow, 3);
  assert.equal(store.writes, 3);
});
test('storage failure, exhausted conflicts and malformed choices never report success', async () => {
  assert.equal((await recordReaction(memoryStore(), 'a', 'fake')).status, 400);
  const conflict = { read: async () => null, write: async () => { throw new Error(); }, isConflict: () => true };
  assert.equal((await recordReaction(conflict, 'a', 'cry', { wait: async () => {} })).status, 409);
  await assert.rejects(recordReaction({ ...conflict, isConflict: () => false }, 'a', 'cry'));
});
async function call(handler, method, headers = {}, body) {
  const response = { headers: {}, setHeader(key, value) { this.headers[key.toLowerCase()] = value; }, end(value) { this.data = JSON.parse(value); } };
  await handler({ method, headers, body }, response);
  return response;
}
test('HTTP API sets a private signed cookie, enforces same origin and never exposes receipts', async () => {
  const store = memoryStore();
  const api = createReactionHandler(store, { secret: 'test-only' });
  const initial = await call(api, 'GET');
  assert.equal(initial.statusCode, 200);
  assert.deepEqual(initial.data.counts, emptyState().counts);
  assert.match(initial.headers['set-cookie'], /HttpOnly; SameSite=Lax/);
  assert.match(initial.headers['cache-control'], /no-store/);
  const headers = { origin: 'https://data-riot.vercel.app', cookie: initial.headers['set-cookie'].split(';')[0], 'content-type': 'application/json' };
  assert.equal((await call(api, 'POST', { ...headers, origin: 'https://other.example' }, { choice: 'heart' })).statusCode, 403);
  assert.equal((await call(api, 'POST', { ...headers, 'content-type': 'text/plain' }, { choice: 'heart' })).statusCode, 415);
  assert.equal((await call(api, 'POST', headers, { choice: 'heart', counts: { heart: 999 } })).statusCode, 400);
  assert.equal((await call(api, 'POST', { ...headers, cookie: '' }, { choice: 'heart' })).statusCode, 409);
  const saved = await call(api, 'POST', headers, { choice: 'heart' });
  assert.equal(saved.data.counts.heart, 1);
  assert.equal(saved.data.selected, 'heart');
  assert.equal(saved.data.votes, undefined);
  const reload = await call(api, 'GET', headers);
  assert.equal(reload.data.selected, 'heart');
  assert.equal((await call(api, 'DELETE')).statusCode, 405);
  const failed = await call(createReactionHandler({ read: async () => { throw new Error('private details'); } }, { secret: 'test-only' }), 'GET');
  assert.equal(failed.statusCode, 503);
  assert.doesNotMatch(JSON.stringify(failed.data), /private details/);
});
