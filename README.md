# Data Riot

A responsive front page featuring the supplied Data Riot front-page artwork. Mobile displays the original portrait artwork unchanged at full screen width. Desktop uses a full-window landscape layout with the same wording, scene, logo, wordmark, and signature. SVG windows reuse parts of the original image without generating or modifying the image file. Short phone screens can scroll, and browser zoom remains available.

Desktop includes three small portrait film tiles, **Data Riot – M83 Attic Lights**, **Data Riot – New Dimension**, and **Data Riot – Two Cities One Sun**, side by side below the header. Click/tap any frame to open a larger modal player with audio. The player automatically closes when the film ends, returning focus to that film's small tile. Close or Escape returns early and stops playback. Text-only Pause/Play and a seek bar are below the video; the thumbnails have no play icons. Playback preserves each full video's proportions and loads only after interaction. Other films are not connected yet.

The larger window fits the video's original aspect ratio, without black side spaces, stretching, or cropping. Its size is limited by the browser width and height; it does not fill the desktop. Each film's dimensions set the shared player's proportions when metadata loads. Close, Escape, and automatic return at the end still work.

Future film buttons can use `data-film-src` and `data-film-title` to open the same shared player. Only one film can play in this window at a time.

On desktop the wordmark, introduction, and logo sit next to each other across the top. The logo uses a transparent cutout, and the bottom credit is slightly larger. Mobile retains the original portrait artwork.

## Files

- `index.html`: the page.
- `styles.css`: responsive layout.
- `attic-preview.js`: Attic Lights play/pause interaction.
- `attic-lights.mp4`: complete H.264 web copy of the supplied Attic Lights film, with its original AAC audio.
- `attic-lights-poster.jpg`: still from the supplied film.
- `new-dimension.mp4`: complete H.264 web copy of video 2, with its original AAC audio.
- `new-dimension-poster.jpg`: still from video 2.
- `two-cities-one-sun.mp4`: complete video 3, with original H.264 video and AAC audio copied without re-encoding and optimized for web playback.
- `two-cities-one-sun-poster.jpg`: still from video 3.
- `videos.js` and `video-layout-reference.png`: earlier video concept files, retained but not loaded by the main page.
- `data-riot-front-page.png`: the current supplied front-page artwork, unchanged.
- `data-riot-logo-transparent.png`: transparent logo cutout made with the built-in image-editing tool.
- `data-riot-ep.png`: the previous EP artwork, retained as an archive.
- `vercel.json`: static hosting configuration.

## Vercel

Import this repository into the **Data Riot** Vercel team. Use the **Other** framework preset, the repository root, no build command, and `.` as the output directory. The production branch is `main`.

This project has no dependencies, database, Vercel Blob store, analytics, or connection to Project Stories. The supplied cover image is served with the website files.
