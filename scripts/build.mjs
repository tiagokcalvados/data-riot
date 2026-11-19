import { mkdir, readdir, copyFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await mkdir(output, { recursive: true });
for (const file of await readdir(root)) {
  if (/\.(html|css|png|jpg|mp4)$/.test(file) || ['attic-preview.js', 'visitor-analytics.js', 'reactions.js'].includes(file)) {
    await copyFile(new URL(file, root), new URL(file, output));
  }
}
console.log('Built the public Data Riot files in dist/.');
