import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

// These are the user's original words, recovered from Git history. Updating
// this approved copy requires an explicit user request, not promotional edits.
export const approved = Object.freeze({
  title: 'Data Riot',
  description: 'Experimental audiovisual explorations from a sound lab in an attic in Amsterdam West.',
  url: 'https://data-riot.vercel.app/',
  image: 'https://data-riot.vercel.app/data-riot-social-card-20261119.jpg',
});
export const cacheTestUrl = `${approved.url}?v=20261119`;

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(match => [match[1].toLowerCase(), match[3]]));
}

export function checkSocialMetadata(html, { url = approved.url } = {}) {
  const heads = [...html.matchAll(/<head\b[^>]*>([\s\S]*?)<\/head>/gi)];
  assert.equal(heads.length, 1, 'Exactly one initial HTML head is required');
  const head = heads[0][1];
  const meta = new Map();
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    const key = (attrs.property || attrs.name || '').toLowerCase();
    if (!key) continue;
    const values = meta.get(key) || [];
    values.push(attrs.content);
    meta.set(key, values);
  }
  for (const [key, expected] of Object.entries({
    description: approved.description,
    'og:title': approved.title, 'og:description': approved.description,
    'og:url': url, 'og:type': 'website',
    'og:image': approved.image, 'og:image:secure_url': approved.image,
    'og:image:type': 'image/jpeg', 'og:image:width': '1200', 'og:image:height': '630',
    'twitter:card': 'summary_large_image', 'twitter:title': approved.title,
    'twitter:description': approved.description, 'twitter:image': approved.image,
  })) {
    assert.equal(meta.get(key)?.length, 1, `${key} must occur exactly once in the initial HTML`);
    assert.equal(meta.get(key)[0], expected, `${key} must match the approved original copy or image`);
  }
  for (const key of ['og:image:alt', 'twitter:image:alt']) {
    assert.equal(meta.get(key)?.length, 1, `${key} must occur exactly once`);
    assert.ok(meta.get(key)[0].includes(approved.description), `${key} must describe the current image`);
  }
  const titles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(titles.length, 1, 'One standard HTML title required');
  assert.equal(titles[0][1], approved.title);
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter(attrs => attrs.rel?.toLowerCase() === 'canonical');
  assert.equal(canonicals.length, 1, 'One canonical URL required');
  assert.equal(canonicals[0].href, url);
  assert.ok(!head.includes('Audiovisual films from Amsterdam'), 'Unapproved promotional title must not return');
  assert.ok(!head.includes('Explore twelve experimental audiovisual films'), 'Unapproved promotional description must not return');
  return { ...approved, url };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const path of ['../index.html', '../dist/index.html']) {
    checkSocialMetadata(await readFile(new URL(path, import.meta.url), 'utf8'));
    console.log(`${path}: approved original text, initial HTML tags and duplicate checks passed`);
  }
  checkSocialMetadata(await readFile(new URL('../dist/share-v20261119.html', import.meta.url), 'utf8'), { url: cacheTestUrl });
  console.log('Versioned cache test: original copy and distinct sharing identity passed');
  console.log(JSON.stringify(approved, null, 2));
}
