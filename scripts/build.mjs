import { mkdir, readdir, copyFile, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
for (const file of await readdir(root)) {
  if (/\.(html|css|png|jpg|mp4)$/.test(file) || ['attic-preview.js', 'visitor-analytics.js', 'reactions.js'].includes(file)) {
    await copyFile(new URL(file, root), new URL(file, output));
  }
}
// A separate, stable sharing URL lets social networks fetch a fresh preview
// without redirecting back to the cached homepage object. Both pages are
// generated from one source, including all films and shared reactions.
const homepage = await readFile(new URL('index.html', root), 'utf8');
const watch = homepage
  .replace('<link rel="canonical" href="https://data-riot.vercel.app/">', '<link rel="canonical" href="https://data-riot.vercel.app/watch">')
  .replace('<meta property="og:url" content="https://data-riot.vercel.app/">', '<meta property="og:url" content="https://data-riot.vercel.app/watch">');
await writeFile(new URL('watch.html', output), watch);
console.log('Built the public Data Riot files in dist/.');
