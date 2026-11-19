import { mkdir, readdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
import { approved, cacheTestUrl, checkSocialMetadata } from './check-social-metadata.mjs';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const homepage = await readFile(new URL('index.html', root), 'utf8');
checkSocialMetadata(homepage);
await mkdir(output, { recursive: true });
for (const file of await readdir(root)) {
  if (/\.(html|css|png|jpg|mp4)$/.test(file) || ['attic-preview.js', 'visitor-analytics.js', 'reactions.js'].includes(file)) {
    // Keep the public root free of a physical index file so Vercel can apply
    // the query-specific metadata rewrite before serving the same homepage.
    await copyFile(new URL(file, root), new URL(file === 'index.html' ? 'homepage.html' : file, output));
  }
}
// The user-authorized ?v=20261119 test needs its own metadata identity rather
// than pointing social crawlers back at the previously cached root object.
// Only these two head values change; the main URL and visible body stay intact.
const versioned = homepage
  .replace(`<link rel="canonical" href="${approved.url}">`, `<link rel="canonical" href="${cacheTestUrl}">`)
  .replace(`<meta property="og:url" content="${approved.url}">`, `<meta property="og:url" content="${cacheTestUrl}">`);
checkSocialMetadata(versioned, { url: cacheTestUrl });
await writeFile(new URL('share-v20261119.html', output), versioned);
// The homepage is the sole sharing destination. Remove only the two obsolete
// generated pages when rebuilding an existing dist/ directory.
for (const file of ['index.html', 'watch.html', 'sound-lab.html']) await rm(new URL(file, output), { force: true });
// Preserve the already-published image URL for existing social cards.
await copyFile(new URL('social-preview-20261119.jpg', root), new URL('sound-lab-preview.jpg', output));
console.log('Built the public Data Riot files in dist/.');
