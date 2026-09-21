# How Much of the Year Is Gone?

A dependency-free static site that shows the live percentage of the visitor's current local calendar year that has elapsed, a 365/366-mark year portrait, concise live facts, and exact year milestones.

## Time model

The percentage is `(now - local Jan 1 00:00) / (next local Jan 1 00:00 - local Jan 1 00:00)`. Both boundaries are native local `Date` values, so leap years, time-zone offset rules, DST, and New Year rollover are handled by the same model. It updates once per second and displays six decimals so the value visibly moves without high-frequency work.

Calendar-day labels use civil-date arithmetic independently of elapsed milliseconds. “Full days down” means completed calendar days before today; “days after today” excludes the current partial day. The grid has one decorative mark per calendar day: elapsed full days, today, and future days have distinct states. A single textual summary describes it to assistive technology.

Live facts show the ordinal day, days beginning after today, current-month progress, and whether this is a 365- or 366-day year. Milestones at 25%, 50%, 75%, and 90% are interpolated between the same local year boundaries, so they may occur mid-day. Sharing uses the native Web Share API with a clipboard fallback. The site stores nothing.

## Work locally

From the repository root:

```sh
./dev how-much-of-the-year-is-gone
./check how-much-of-the-year-is-gone
./build how-much-of-the-year-is-gone
```

Focused tests run in both `Europe/Madrid` and `America/New_York` and cover normal/leap years, February boundaries, DST-safe day numbering, day-grid states, milestones, percentage bounds, and New Year rollover. Production files are written to `dist/`.

## Production configuration

Set the one production origin in `site.config.json` as an HTTPS origin, or supply `SITE_URL` during a build. Until then, canonical/social URL values remain relative and the generated sitemap is intentionally empty. After a domain is chosen, add the site to Search Console and submit `/sitemap.xml`.

`analyticsId` and `adsenseClient` are intentionally blank. `runtime-config.js` is the isolated future analytics/advertising configuration point; no tracking or ad code is loaded. Hidden site-local ad slots collapse completely and can later reserve dimensions when enabled. Update the privacy page and implement consent where required before enabling either integration.

## Limitations

The answer follows the browser/device clock and local time-zone configuration. It does not independently verify either, and it does not offer alternate-zone controls. Native sharing availability varies by browser; clipboard sharing requires a secure context in production.
