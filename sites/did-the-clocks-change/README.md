# Did the Clocks Change?

A tiny static utility that answers whether clocks changed recently in the visitor’s timezone, shows the direction and amount, and counts down to the next known offset transition. It is dependency-free: semantic HTML, CSS, vanilla ES modules, and Node’s built-in test/build tools. There is no backend, database, API, account, geolocation request, or runtime network dependency.

## Run and build

Requires Node.js 20 or newer; no install step is needed.

```sh
./dev
npm test
npm run build
npm run check
```

The deployable static output is `dist/`. From the monorepo root, use `./dev did-the-clocks-change`, `./build did-the-clocks-change`, and `./check did-the-clocks-change`.

## Timezone and transition logic

The initial IANA timezone comes from `Intl.DateTimeFormat().resolvedOptions().timeZone`. The selector uses `Intl.supportedValuesOf('timeZone')` when available and a small practical fallback otherwise. A saved manual selection stays in local storage on that device.

UTC offsets come from the runtime’s IANA timezone data through `Intl.DateTimeFormat`. To find a transition, the engine probes in six-hour steps for up to three years in either direction. Once two probes straddle an offset change, binary search locates the first changed millisecond. This is efficient, supports Northern and Southern Hemisphere rules, and detects non-hour changes such as Australia/Lord_Howe’s 30-minute transition without hardcoded DST calendars.

“Recently” means the previous transition occurred no more than 72 hours ago, inclusive. This fixed window covers common “last night/weekend” intent without showing YES months later. At the exact transition the new offset and YES state apply. A countdown is clamped at zero and the page recomputes state at the boundary.

If no change is found within three years, the site explains that the timezone does not currently change its clocks. The primitive is deliberately called an offset change: political changes are not always semantically DST. Results depend on the browser/runtime’s installed IANA data, and future government decisions require that data to be updated.

## Production configuration

`site.config.json` is the only deployment configuration. Set `siteUrl` to the final HTTPS origin without a trailing slash, or set `SITE_URL` in CI. Until then, builds use root-relative metadata plus an empty sitemap and never invent a domain. Deploy the contents of `dist/` to a static host.

After launch, verify the domain in Google Search Console and submit `/sitemap.xml`. `analyticsId` and `adsenseClient` remain empty. `runtime-config.js` is the isolated future integration point; no tracking or ads load today. If enabled later, add the provider loader, populate/unhide the reserved site-local ad slots with fixed dimensions, implement any required consent handling, and update Privacy first.
