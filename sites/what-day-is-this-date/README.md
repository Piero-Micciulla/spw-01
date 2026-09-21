# What Day Is This Date?

A tiny, private utility: pick a calendar date and immediately get its weekday. The site is an independent static SPW with no runtime dependencies, backend, account, cookies, analytics, or advertising.

## Calendar behavior

- Supports the proleptic Gregorian calendar from **1600-01-01 through 9999-12-31**.
- Uses a pure integer implementation of Sakamoto’s weekday algorithm. Selected dates are never parsed as timestamps, so weekday results are timezone-independent.
- Gregorian leap-year rules apply: divisible by 4, except centuries unless divisible by 400.
- “Today” is constructed from the visitor’s local year, month, and day. A boundary-aware timer refreshes its meaning just after local midnight.
- Previous/next moves exactly one calendar day and disables at supported-range boundaries.
- A strict `?date=YYYY-MM-DD` parameter opens a shared date. Invalid values safely fall back to local Today; interactions use `history.replaceState`.
- Sharing uses Web Share where available and the Clipboard API otherwise.

## Development and verification

From the repository root:

```sh
./dev what-day-is-this-date
./check what-day-is-this-date
./build what-day-is-this-date
```

Tests cover calendar rules, boundaries, URL parsing, rendered state, navigation, and sharing under Madrid, New York, and Tokyo timezones. Production files are written to `dist/`.

## Production configuration

Set the real HTTPS origin in `site.config.json` (or `SITE_URL` during build) before deployment. This enables canonical, social, robots, and sitemap URLs. Then connect Search Console after deployment. Site-local analytics and AdSense fields exist but are intentionally blank and load nothing; update the privacy notice before enabling either.

## Limitations

Historical dates use Gregorian rules even where a region used another calendar at the time. Native date-picker presentation varies by browser. The site identifies weekdays only; it does not provide holidays, events, or timezone conversion.
