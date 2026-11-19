import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReactionHandler } from '../lib/reaction-core.mjs';

let snapshot = null;
let revision = 0;
const store = {
  async read() { return structuredClone(snapshot); },
  async write(data, etag) {
    if (snapshot?.etag !== etag) throw Object.assign(new Error('Conflict'), { conflict: true });
    snapshot = { data: structuredClone(data), etag: String(++revision) };
  },
  isConflict: error => error.conflict,
};
const origin = 'http://127.0.0.1:8771';
const reactions = createReactionHandler(store, { secret: 'local-preview-only', origins: [origin], preview: true });
const root = new URL('../dist/', import.meta.url);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4' };
createServer(async (request, response) => {
  const url = new URL(request.url, origin);
  if (url.pathname === '/api/reactions') return reactions(request, response);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  if (!/^\/[\w.-]+$/.test(pathname)) { response.writeHead(404).end(); return; }
  try {
    const data = await readFile(new URL(pathname.slice(1), root));
    const extension = pathname.slice(pathname.lastIndexOf('.'));
    response.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch { response.writeHead(404).end(); }
}).listen(8771, '127.0.0.1', () => console.log(`Data Riot preview: ${origin} (test reactions only)`));
