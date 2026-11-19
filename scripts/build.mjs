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
for (const path of ['watch', 'sound-lab']) {
  let sharingPage = homepage
    .replace('<link rel="canonical" href="https://data-riot.vercel.app/">', `<link rel="canonical" href="https://data-riot.vercel.app/${path}">`)
    .replace('<meta property="og:url" content="https://data-riot.vercel.app/">', `<meta property="og:url" content="https://data-riot.vercel.app/${path}">`);
  if (path === 'sound-lab') {
    sharingPage = sharingPage.replaceAll('https://data-riot.vercel.app/social-preview-20261119.jpg', 'https://data-riot.vercel.app/sound-lab-preview.jpg');
    await copyFile(new URL('social-preview-20261119.jpg', root), new URL('sound-lab-preview.jpg', output));
  }
  await writeFile(new URL(`${path}.html`, output), sharingPage);
}
console.log('Built the public Data Riot files in dist/.');
