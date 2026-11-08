# Data Riot

A responsive front page featuring the supplied Data Riot front-page artwork, unchanged. Desktop fits the entire portrait image to the available screen height; mobile uses the full screen width with the original proportions. Short phone screens can scroll, and browser zoom remains available.

## Files

- `index.html`: the page.
- `styles.css`: responsive layout.
- `data-riot-front-page.png`: the current supplied front-page artwork, unchanged.
- `data-riot-ep.png`: the previous EP artwork, retained as an archive.
- `vercel.json`: static hosting configuration.

## Vercel

Import this repository into the **Data Riot** Vercel team. Use the **Other** framework preset, the repository root, no build command, and `.` as the output directory. The production branch is `main`.

This project has no dependencies, database, Vercel Blob store, analytics, or connection to Project Stories. The supplied cover image is served with the website files.
