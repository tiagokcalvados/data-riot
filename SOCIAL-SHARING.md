# Approved sharing metadata

- Page and canonical URL: https://data-riot.vercel.app/
- Standard HTML, Open Graph and Twitter title: **Data Riot**
- Standard meta, Open Graph and Twitter description: **Experimental audiovisual explorations from a sound lab in an attic in Amsterdam West.**
- Open Graph and Twitter image: https://data-riot.vercel.app/data-riot-social-card-20261119.jpg
- Image: 1200 × 630 JPEG, using the existing Sound Lab logo and that exact original sentence. No new promotional copy.

## History audit

The current page's original Open Graph title and description are present before the reactions change, including commit `ab896f6`. The reaction implementation, `add8770`, preserved those tags. The later sharing-image commit `78bb748` introduced “Data Riot | Audiovisual films from Amsterdam” and the “Explore twelve…” description. Commit `8f027df` restored the original wording.

The earliest EP trial page (`8b68a19`) used `data-riot-ep.png`, a square cover showing a burning toaster, with the original EP-specific line “No rules, just noise.” The later portrait front-page image was also used as an Open Graph image, but social crops could show its empty sky. The subsequent full-page screenshot made the interface miniature. No dedicated readable card for the current introduction was present in that history. The new card reuses the existing current logo; `scripts/social-preview.html` is its layout source. Earlier image files remain available for cached cards.

## Verification

Run `npm run build` followed by `npm run check:social`. The check requires exactly one of each requested metadata tag, the original title/description, matching absolute image URLs, one canonical URL and one standard title in the initial HTML. It rejects the unapproved promotional wording. It checks source, generated homepage and versioned diagnostic HTML directly, without JavaScript execution.

For a live audit, fetch the raw initial document with WhatsApp, Facebook, Twitter, desktop and mobile user agents. Check both `https://data-riot.vercel.app/` and the authorized cache test `https://data-riot.vercel.app/?v=20261119`. The main address retains its original canonical URL and Open Graph URL. The versioned diagnostic response uses the versioned address for both identity tags, because `og:url` identifies the social graph object. Both return identical original copy, image and visible page content. The diagnostic is an internal rewrite on the same homepage path, not a new visitor-facing page address. This tests a cache-reuse hypothesis; it does not prove the cause of WhatsApp's behavior.

Verify the image returns HTTP 200, `image/jpeg` and 1200 × 630 dimensions. Requests carrying crawler user agents verify the server response; they do not prove that those platforms refreshed their own caches.

The visible body, gallery, styles, video player, reactions, counters and analytics must remain unchanged during this metadata audit. Before publishing, compare the body and existing working files with the previous commit.

## Platform refresh

Meta's Sharing Debugger: https://developers.facebook.com/tools/debug/?q=https%3A%2F%2Fdata-riot.vercel.app%2F

Use Debug / Scrape Again after deployment to ask Facebook to fetch the main URL. This requires an authenticated Facebook browser session. Do not report that a scrape occurred without seeing or receiving confirmation of its result. WhatsApp's actual preview needs a client-side check as well; a successful HTTP audit alone is not an in-app preview test. Retain the main URL rather than creating more sharing paths.
