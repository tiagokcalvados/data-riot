import { mkdir, readdir, copyFile, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
for (const file of await readdir(root)) {
  if (/\.(html|css|png|jpg|mp4)$/.test(file) || ['attic-preview.js', 'visitor-analytics.js', 'reactions.js'].includes(file)) {
    await copyFile(new URL(file, root), new URL(file, output));
  }
}
// The homepage is the sole sharing destination. Remove only the two obsolete
// generated pages when rebuilding an existing dist/ directory.
for (const file of ['watch.html', 'sound-lab.html']) await rm(new URL(file, output), { force: true });
// Preserve the already-published image URL for existing social cards.
await copyFile(new URL('social-preview-20261119.jpg', root), new URL('sound-lab-preview.jpg', output));
console.log('Built the public Data Riot files in dist/.');
