# Just Pick a Movie

A deliberately decisive movie picker: one click, one local recommendation, no ranked list. It is an independent static SPW with no runtime network dependency.

## Architecture

- `src/index.html` contains the picker and concise search-supporting content.
- `src/js/catalog.js` is the curated local catalog.
- `src/js/picker.js` contains pure filtering, fallback, history, query, and validation logic.
- `src/js/app.js` handles accessible DOM updates, session history, URL state, and sharing.
- `src/styles.css` and local SVG assets create the cinema-ticket identity.
- `scripts/` provides the dependency-free build, development server, and production checks.
- `dist/` is generated deployable output and must not be hand-edited.

## Catalog and recommendation model

Each movie has `id`, `title`, `year`, `runtimeMinutes`, `moods`, and `genres`. IDs are stable URL-safe slugs. Titles, release years, and standard theatrical runtimes were entered conservatively from high-confidence factual knowledge; no descriptions, reviews, ratings, posters, stills, or copied editorial text are included. Before adding a film, verify its release year and theatrical runtime against reliable references.

Time filters are inclusive: **95 minutes or less**, **96–135 minutes** (“About 2 hours”), or unrestricted. Mood uses the small vocabulary `funny`, `scary`, `exciting`, `chill`, and `serious`; “Surprise me” is unrestricted. Mood tags are editorial signals, not objective genre claims.

The picker uniformly selects from the eligible pool. Session storage retains enough recent movie IDs to exhaust the complete catalog before a repeat. It prefers unseen eligible movies and avoids an immediate repeat when another choice exists. When an exact time-and-mood combination is empty, it preserves mood and relaxes time, with a visible explanation. Invalid inputs become unrestricted defaults.

Selected movies use `?movie=<id>` so links can be shared. IDs are accepted only when they exactly match the local catalog. Native Web Share is used when available; copy-to-clipboard has a legacy fallback.

## Work locally

From the repository root:

```sh
./dev just-pick-a-movie
./check just-pick-a-movie
./build just-pick-a-movie
```

Or from this directory: `npm test`, `npm run build`, `npm run check`, and `npm run dev`. The test suite checks catalog integrity, coverage, filters, fallback, random eligibility, repeat avoidance, history, URL validation, and malformed inputs.

## Production setup

Set the future HTTPS origin in `site.config.json` (`siteUrl`) or provide `SITE_URL` during the build. Until then, the build intentionally emits relative canonical/social metadata and an empty sitemap. Configure the real domain before deployment, then submit `/sitemap.xml` in Search Console.

`analyticsId` and `adsenseClient` are disabled site-local integration points. No analytics, ads, cookies, or affiliate links currently load. Hidden ad slots collapse completely; a future implementation can reveal them with reserved dimensions. A future streaming/affiliate feature should use current regional availability data and add clear disclosure rather than guessing providers.

## Adding a movie safely

1. Verify title, release year, and theatrical runtime with reliable factual sources.
2. Add a unique lowercase slug and one or more allowed mood tags.
3. Use broad factual genres only; do not copy summaries, reviews, artwork, or promotional copy.
4. Run `npm test` and `npm run check`.
