# Data Riot visitor tracker

Dashboard: https://vercel.com/data-riot/data-riot/analytics

The dashboard is private to the Vercel account that owns the Data Riot workspace. The desktop shortcut is named **Data Riot Visitor Tracker**. Use the dashboard date-range controls to inspect daily visitors and page views.

- Collection begins after Web Analytics is enabled and the analytics deployment is published. Earlier traffic cannot be reconstructed by this integration.
- **Visitors** are estimated unique visitors. **Page views** include repeat visits and reloads; these are different measures. Visitor identifiers are discarded after 24 hours, so longer periods do not represent a count of distinct individual people.
- `visitor-analytics.js` loads the Vercel tracking script only on the production Data Riot homepage. Local previews and deployment-preview addresses are excluded. `/index.html` is grouped into `/`; query parameters and fragments are removed before collection.
- Do Not Track and Global Privacy Control are respected. Privacy preferences, ad blockers, disabled JavaScript, and network failures can cause undercounting.
- No names, email addresses, video interactions, or custom events are collected by this integration. It does not add a public visitor counter or expose dashboard credentials.
- On the Hobby plan, the documented free allowance is 50,000 events per month shared across the team, with a one-month reporting window. Collection pauses at the limit rather than creating an extra charge. No paid analytics add-on is required for this setup.

References:
- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/using-web-analytics
- https://vercel.com/docs/analytics/privacy-policy
- https://vercel.com/docs/analytics/limits-and-pricing