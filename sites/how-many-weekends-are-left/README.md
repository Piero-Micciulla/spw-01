# How Many Weekends Are Left?

A tiny, shareable static site that shows the weekends and weekend calendar days remaining in the visitor's current local year. The paired-ticket visualization makes the year's finite supply visible at a glance.

## Calendar rules

- A weekend is Saturday plus Sunday in the visitor's local calendar. V1 does not vary this by locale and knows nothing about holidays, long weekends, work schedules, or PTO.
- A weekend is **left** while any part of its Saturday/Sunday period remains. It counts before it starts, throughout Saturday, and throughout Sunday; it becomes completed at local Monday 00:00.
- A cross-year weekend belongs to the year containing its Saturday. This deterministically assigns each weekend to exactly one year.
- Weekend days remaining are counted independently: each Saturday/Sunday calendar date that is today or later and inside the current year counts. Thus a Saturday today counts, a Sunday today counts but its past Saturday does not, and a Dec 31 Saturday contributes one day even though its Sunday is in January.
- During a weekend the UI acknowledges the current weekend and counts down to local Monday. Outside one it counts down to the next local Saturday 00:00.
- Native local `Date` constructors create every calendar boundary. Nothing assumes a weekend is a fixed 48 hours, so DST weekends behave correctly. The once-per-second render also regenerates the entire experience at New Year without a reload.

## Development and verification

From the repository root:

```sh
./dev how-many-weekends-are-left
./check how-many-weekends-are-left
./build how-many-weekends-are-left
```

Or run `npm test`, `npm run build`, and `npm run check` inside this directory. Tests run under `Europe/Madrid` and `America/New_York` and cover calendar boundaries, crossover years, leap years, DST, countdowns, rendering, state transitions, and sharing.

## Production configuration

Set the single `siteUrl` value in `site.config.json` to the final HTTPS origin (or provide `SITE_URL` while building), then rebuild. Until it is set, builds intentionally emit relative/no canonical metadata plus an empty sitemap. `scripts/check-build.mjs` rejects placeholder URLs, unresolved tokens, accidental IDs, and missing production artifacts.

After launch, submit the generated sitemap in Search Console. `runtime-config.js` is the isolated future integration point for site-local analytics and AdSense; both values are empty and no tracking, ad scripts, storage, or consent UI exists today. Hidden ad slots collapse completely; any future implementation should reserve dimensions only when enabled. Update the privacy page before enabling either integration.
