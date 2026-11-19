import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const REACTIONS = Object.freeze(['heart', 'fire', 'laugh', 'cry', 'wow', 'maze', 'question', 'mindblown']);
const COOKIE = 'data_riot_reactor';
export const emptyState = () => ({ version: 1, counts: Object.fromEntries(REACTIONS.map(key => [key, 0])), votes: {} });

export function validateState(data) {
  if (data?.version !== 1 || !data.votes || typeof data.votes !== 'object' || Array.isArray(data.votes)) throw new Error('Invalid reaction data');
  for (const key of REACTIONS) {
    if (!Number.isSafeInteger(data.counts?.[key]) || data.counts[key] < 0) throw new Error('Invalid reaction counts');
  }
  return data;
}

export async function recordReaction(store, identity, choice, { now = Date.now(), wait = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  if (!REACTIONS.includes(choice)) return { status: 400, message: 'Please choose one of the reactions.' };
  for (let attempt = 0; attempt < 4; attempt++) {
    const snapshot = await store.read();
    const data = snapshot ? structuredClone(validateState(snapshot.data)) : emptyState();
    const previous = data.votes[identity];
    if (previous?.choice === choice) return { status: 200, counts: data.counts, selected: choice };
    if (previous && now - previous.updated < 3000) return { status: 429, message: 'Please wait a moment before changing your reaction.' };
    if (previous && !REACTIONS.includes(previous.choice)) throw new Error('Invalid saved reaction');
    if (previous) data.counts[previous.choice]--;
    data.counts[choice]++;
    data.votes[identity] = { choice, updated: now };
    try {
      await store.write(data, snapshot?.etag);
      return { status: 200, counts: data.counts, selected: choice };
    } catch (error) {
      if (!store.isConflict(error)) throw error;
      if (attempt < 3) await wait(60 + Math.random() * 120);
    }
  }
  return { status: 409, message: 'Another reaction arrived at the same time. Please tap again.' };
}

function sign(value, secret) { return createHmac('sha256', secret).update(value).digest('base64url'); }
function identityFor(request, secret) {
  const cookie = (request.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const match = /^([a-f0-9-]{36})\.([A-Za-z0-9_-]{43})$/.exec(cookie || '');
  if (match) {
    const expected = sign(match[1], secret);
    if (timingSafeEqual(Buffer.from(match[2]), Buffer.from(expected))) {
      return { identity: createHash('sha256').update(match[1]).digest('hex') };
    }
  }
  const id = randomUUID();
  return { identity: createHash('sha256').update(id).digest('hex'), cookie: `${COOKIE}=${id}.${sign(id, secret)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${process.env.VERCEL ? '; Secure' : ''}` };
}

async function readBody(request) {
  if (Number(request.headers['content-length'] || 0) > 256) throw new Error('Large body');
  let body = request.body;
  if (body === undefined) {
    let text = '';
    for await (const chunk of request) {
      text += chunk;
      if (Buffer.byteLength(text) > 256) throw new Error('Large body');
    }
    body = text;
  }
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    if (Buffer.byteLength(body) > 256) throw new Error('Large body');
    body = JSON.parse(body.toString());
  }
  if (!body || Object.keys(body).length !== 1 || !REACTIONS.includes(body.choice)) throw new Error('Invalid choice');
  return body;
}

export function createReactionHandler(store, { secret, origins = ['https://data-riot.vercel.app'], preview = false } = {}) {
  return async (request, response) => {
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, value) => { response.statusCode = status; response.end(JSON.stringify(value)); };
    if (!['GET', 'POST'].includes(request.method)) {
      response.setHeader('Allow', 'GET, POST');
      return send(405, { message: 'Please use the reactions on Data Riot.' });
    }
    // Reject cross-site writes before issuing an identity or touching storage.
    if (request.method === 'POST' && (!origins.includes(request.headers.origin) || request.headers['sec-fetch-site'] === 'cross-site')) return send(403, { message: 'Please react from the Data Riot page.' });
    if (request.method === 'POST' && !/^application\/json\b/i.test(request.headers['content-type'] || '')) return send(415, { message: 'Please use the reaction buttons.' });
    try {
      if (!secret) throw new Error('Missing reaction secret');
      const visitor = identityFor(request, secret);
      if (visitor.cookie) response.setHeader('Set-Cookie', visitor.cookie);
      if (request.method === 'GET') {
        const snapshot = await store.read();
        const data = snapshot ? validateState(snapshot.data) : emptyState();
        return send(200, { counts: data.counts, selected: data.votes[visitor.identity]?.choice || null, ...(preview ? { preview: true } : {}) });
      }
      // A prior GET must have established the browser cookie. Without cookies,
      // fail visibly instead of allowing every tap to create another visitor.
      if (visitor.cookie) return send(409, { message: 'Please allow cookies for Data Riot, reload the page and try again.' });
      let body;
      try { body = await readBody(request); }
      catch { return send(400, { message: 'Please choose one of the reactions.' }); }
      const { status, ...result } = await recordReaction(store, visitor.identity, body.choice);
      if (status === 429) response.setHeader('Retry-After', '3');
      return send(status, { ...result, ...(preview ? { preview: true } : {}) });
    } catch {
      return send(503, { message: 'Reactions are temporarily unavailable. Please try again later.' });
    }
  };
}
