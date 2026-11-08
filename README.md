# Data Riot

A responsive front page featuring the supplied Data Riot front-page artwork. Mobile displays the original portrait artwork unchanged at full screen width. Desktop uses a full-window landscape layout with the same wording, scene, logo, wordmark, and signature. SVG windows reuse parts of the original image without generating or modifying the image file. Short phone screens can scroll, and browser zoom remains available.

The main page currently shows the introduction and artwork only. Video tiles and preview windows are removed; videos will return later with a separate setup.

## Files

- `index.html`: the page.
- `styles.css`: responsive layout.
- `videos.js` and `video-layout-reference.png`: earlier video concept files, retained but not loaded by the main page.
- `data-riot-front-page.png`: the current supplied front-page artwork, unchanged.
- `data-riot-ep.png`: the previous EP artwork, retained as an archive.
- `vercel.json`: static hosting configuration.

## Vercel

Import this repository into the **Data Riot** Vercel team. Use the **Other** framework preset, the repository root, no build command, and `.` as the output directory. The production branch is `main`.

This project has no dependencies, database, Vercel Blob store, analytics, or connection to Project Stories. The supplied cover image is served with the website files.
