# Data Riot

A responsive front page featuring the supplied Data Riot front-page artwork. Mobile displays the original portrait artwork unchanged at full screen width. Desktop uses a full-window landscape layout with the same wording, scene, logo, wordmark, and signature. SVG windows reuse parts of the original image without generating or modifying the image file. Short phone screens can scroll, and browser zoom remains available.

Desktop includes eight square video-preview tiles in two rows. The supplied concept image provides the temporary thumbnail artwork. Videos are not uploaded yet; each tile opens a clearly labelled coming-soon dialog. Close with the Close button, Escape, or the backdrop. To connect a future upload, set the corresponding button's `data-video-src` to the hosted video URL and remove its coming-soon badge and wording. The player loads only when opened, and stops when closed.

## Files

- `index.html`: the page.
- `styles.css`: responsive layout.
- `videos.js`: video-preview dialog interaction.
- `video-layout-reference.png`: supplied concept artwork used for the temporary tile thumbnails.
- `data-riot-front-page.png`: the current supplied front-page artwork, unchanged.
- `data-riot-ep.png`: the previous EP artwork, retained as an archive.
- `vercel.json`: static hosting configuration.

## Vercel

Import this repository into the **Data Riot** Vercel team. Use the **Other** framework preset, the repository root, no build command, and `.` as the output directory. The production branch is `main`.

This project has no dependencies, database, Vercel Blob store, analytics, or connection to Project Stories. The supplied cover image is served with the website files.
