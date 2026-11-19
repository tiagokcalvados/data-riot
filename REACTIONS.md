# Data Riot reactions

The eight reaction buttons work with touch, mouse and keyboard. Each browser has one reaction and may change it. Clicking the same reaction again is a no-op; changing it moves the vote between counts. A three-second pause prevents rapid changes. Totals refresh every 30 seconds while the reaction row is visible, and immediately after saving.

The fourth reaction is now a standard thumbs up (👍). Its internal ID remains `cry` to preserve the original slot's saved counts and browser selections.

`/api/reactions` stores counts and hashed anonymous browser receipts in the separate private `data-riot-reactions` Vercel Blob store. The API returns only totals and that browser's selected reaction. It does not store names, IP addresses or account information. A signed first-party HttpOnly cookie remembers the browser for one year. Clearing cookies, using another browser or device, or cookie expiry allows another vote; this does not verify distinct people.

Writes use ETag conditions with bounded conflict retries; simultaneous reactions cannot silently overwrite each other. Reads bypass Blob caching. An unavailable store shows an error instead of a fake successful vote or fabricated zeros. Production and Vercel preview use separate counter files. Keep `BLOB_READ_WRITE_TOKEN` server-side; never commit environment files. Only the generated `dist/` directory is served as static files.

The service uses the existing Vercel Hobby allowances. Each changed reaction uses a small private read and conditional write; loading or refreshing uses a read. Repeated identical votes do not write. Vercel quotas still apply, and the page reports when reactions cannot be saved. No paid plan was enabled.

Run `npm test` and `npm run build`. Run `npm run preview` at http://127.0.0.1:8771/ for local checks. Preview reactions are held in memory and reset when the server stops. They never affect production counts.
