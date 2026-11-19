# Data Riot

A responsive front page featuring the supplied Data Riot front-page artwork. Mobile displays the original portrait artwork at full screen width, with all twelve tappable film tiles arranged in two rows of six in the open sky below the introduction and above the trees and houses. The artwork itself is unchanged. Desktop uses a full-window landscape layout with the same wording, scene, logo, wordmark, and signature. SVG windows reuse parts of the original image without generating or modifying the image file. Short phone screens can scroll, and browser zoom remains available.

Desktop includes all twelve numbered films from the supplied Data Riot folder, in order: **M83 Attic Lights**, **New Dimension**, **Two Cities One Sun**, **Broken Toaster**, **Liquid Sun**, **Friendly Fires Boat**, **Rothko vs Pollock**, **Sound Sphere**, **Hydraulic Quantum Flow**, **Cosmic Spiral**, **Something Went Wrong**, and **Lego Wormhole**. The small portrait tiles sit side by side below the header and wrap onto another row when needed. Click/tap any frame to open a larger modal player with audio. The player automatically closes when the film ends, returning focus to that film's small tile. Close or Escape returns early and stops playback. Text-only Pause/Play and a seek bar are below the video; the thumbnails have no play icons. Playback preserves each full video's proportions and loads only after interaction.

The larger window fits the video's original aspect ratio, without black side spaces, stretching, or cropping. Its size is limited by the browser width and height; it does not fill the desktop. Each film's dimensions set the shared player's proportions when metadata loads. Close, Escape, and automatic return at the end still work.

The same buttons and shared player work on touchscreens and desktop. On phones the player uses nearly the screen's full width when height allows, limits its height to the phone's visible screen, and keeps the original film proportions. Close, Pause/Play, and the seek control have touch-friendly targets. Tapping a tile opens playback directly; completion returns to that tile. Only one film can play at a time.

On desktop the wordmark, introduction, and logo sit next to each other across the top. The logo uses a transparent cutout, and the bottom credit is slightly larger. Mobile retains the original portrait artwork.

## Files

Social sharing uses `data-riot-social-card-20261119.jpg`, a readable 1200 × 630 card made from the existing Sound Lab logo and the recovered original introduction. Its layout source is `scripts/social-preview.html`. Open Graph and Twitter metadata point to its absolute production URL; the interactive page layout is unchanged. Previous image URLs remain available for existing shares. Run `npm run check:social` to check the approved text, duplicate tags, initial HTML and matching image metadata. See `SOCIAL-SHARING.md` for history and verification details.

Share the main address, **https://data-riot.vercel.app/**. Its canonical URL and Open Graph URL both identify the homepage. The original sharing wording is title **Data Riot** and description **Experimental audiovisual explorations from a sound lab in an attic in Amsterdam West.** The earlier `/watch` and `/sound-lab` links, including their `.html` forms, permanently redirect to the homepage. They no longer generate separate sharing pages. The already-published `sound-lab-preview.jpg` image remains available for existing social cards.

The user-authorized cache diagnostic `https://data-riot.vercel.app/?v=20261119` has a matching versioned canonical/Open Graph identity. It uses the exact same introduction, image, page body and working features. The main address remains unchanged. See `SOCIAL-SHARING.md` for the distinction between server verification and a confirmed WhatsApp refresh.

- `index.html`: the page.
- `styles.css`: responsive layout.
- `attic-preview.js`: Attic Lights play/pause interaction.
- `attic-lights.mp4`: complete H.264 web copy of the supplied Attic Lights film, with its original AAC audio.
- `attic-lights-poster.jpg`: still from the supplied film.
- `new-dimension.mp4`: complete H.264 web copy of video 2, with its original AAC audio.
- `new-dimension-poster.jpg`: still from video 2.
- `two-cities-one-sun.mp4`: complete video 3, with original H.264 video and AAC audio copied without re-encoding and optimized for web playback.
- `two-cities-one-sun-poster.jpg`: still from video 3.
- `broken-toaster.mp4`: complete video 4 converted from MPEG-4 Part 2 to browser-compatible H.264, preserving the original AAC audio.
- `liquid-sun.mp4`, `rothko-vs-pollock.mp4`, `hydraulic-quantum-flow.mp4`, and `cosmic-spiral.mp4`: complete videos 5, 7, 9, and 10, with their original H.264 video and AAC audio copied without re-encoding.
- `friendly-fires-boat.mp4` and `sound-sphere.mp4`: complete videos 6 and 8, compressed as H.264 web copies to fit GitHub's browser upload limit, preserving their original dimensions and AAC audio.
- `something-went-wrong.mp4`: complete video 11, from `11Data Riot - Something is wrong.mp4`, with the original H.264 video and AAC audio copied without re-encoding and optimized for web playback. Its matching poster is `something-went-wrong-poster.jpg`.
- `lego-wormhole.mp4`: complete video 12, from `12Data Riot - Lego Wornhole.mp4`, with its original H.264 video and AAC audio copied without re-encoding and optimized for web playback. Its matching poster is `lego-wormhole-poster.jpg`. The same gallery tile and player serve desktop and mobile.
- Each film has a matching `-poster.jpg` extracted from that film. All new MP4 files are optimized for web playback; source files remain untouched.
- `videos.js` and `video-layout-reference.png`: earlier video concept files, retained but not loaded by the main page.
- `data-riot-front-page.png`: the current supplied front-page artwork, unchanged.
- `data-riot-logo-transparent.png`: transparent logo cutout made with the built-in image-editing tool.
- `data-riot-ep.png`: the previous EP artwork, retained as an archive.
- `reactions.js`, `api/reactions.js` and `lib/`: shared anonymous reaction buttons and their private counter; see `REACTIONS.md`.
- `vercel.json`: static hosting and Node function configuration.

## Vercel

Import this repository into the **Data Riot** Vercel team. Use the **Other** framework preset, the repository root, `npm run build`, and `dist` as the output directory (also specified in `vercel.json`). The production branch is `main`. Vercel builds the Node function at `/api/reactions` separately from the public files.

The official `@vercel/blob` dependency saves reactions in the private `data-riot-reactions` store. Connect `BLOB_READ_WRITE_TOKEN` on Vercel for production and preview. The supplied cover image is served with the website files. Both Home links return to Project Stories. Visitor counts use the private Vercel Web Analytics dashboard; see `ANALYTICS.md`.
