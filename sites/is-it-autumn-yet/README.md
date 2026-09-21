# Is It Autumn Yet?

A tiny, production-ready static site that answers one question immediately, then explains the dates without bloat. It uses semantic HTML, one CSS file, and dependency-free ES modules. There is no backend, database, API key, runtime service, or required tracking.

## Run it

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
./dev
```

Open the URL printed in the terminal (normally `http://localhost:4173`).

```sh
npm test       # focused season/date tests
npm run build  # production static output in dist/
npm run check  # tests, build, and SEO artifact checks
```

Deploy the contents of `dist/` to any static host (Cloudflare Pages, Netlify, GitHub Pages, S3, etc.). The build has no production server requirement.

## Production configuration

All deployment settings live in **`site.config.json`**:

- Set `siteUrl` to the final HTTPS origin, without a trailing slash, then rebuild. You may instead provide `SITE_URL=https://your-domain.example npm run build` in CI. This sets canonical, social, sitemap, and robots URLs in one place. Until configured, builds deliberately use root-relative metadata and an empty valid sitemap rather than publishing an invented domain; configure it before deployment.
- `analyticsId` and `adsenseClient` intentionally remain empty. `runtime-config.js` is generated as the isolated future integration point; no tracking scripts load today.

After the domain is live, add it as a Google Search Console domain property (DNS verification is recommended), then submit `https://your-domain/sitemap.xml`. Alternatively, a Search Console HTML verification file can be placed in `src/` before building.

For analytics, add the provider loader to `src/index.html` only after a real ID and any region-appropriate consent handling are ready; read the ID from `window.SITE_CONFIG`. For AdSense, add its script the same way and unhide/populate the reserved `[data-ad-slot]` elements. Their integration remains optional and isolated. Update the privacy page before enabling either service.

## Season calculations

Meteorological seasons use local midnight on 1 September/1 December in the north and 1 March/1 June in the south. Astronomical equinoxes and solstices use the polynomial and periodic correction from Jean Meeus, *Astronomical Algorithms*, chapter 27, converted from Terrestrial Time to UTC with Espenak/Meeus ΔT estimates. The supported range is 1000–3000; the UI uses current and upcoming years. Expected precision is within a few minutes—more than sufficient for this live minute-level display. Tests cover boundaries, hemispheres, definitions, and year rollover.
