import { createReactionHandler } from '../lib/reaction-core.mjs';
import { reactionStore } from '../lib/reaction-store.mjs';

export const config = { maxDuration: 30 };
export default async function handler(request, response) {
  const origins = ['https://data-riot.vercel.app', ...[process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).map(host => `https://${host}`)];
  try {
    return await createReactionHandler(reactionStore(), { secret: process.env.BLOB_READ_WRITE_TOKEN, origins })(request, response);
  } catch {
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 503;
    response.end(JSON.stringify({ message: 'Reactions are temporarily unavailable. Please try again later.' }));
  }
}
