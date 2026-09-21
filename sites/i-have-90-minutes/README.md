# I Have 90 Minutes

A decisive static activity picker for a finite block of free time. It gives one locally curated suggestion rather than a list.

## Product and data

Budgets are 30, 45, 60, 90 (default), and 120 minutes. Categories are Anything, Move, Make, Watch, Learn, Reset, Outside, and Connect. Each catalog item has `id`, `title`, `category`, `minMinutes`, `idealMinutes`, `maxMinutes`, and a short `note`. An item fits when the selected budget is inclusively between its useful minimum and sensible maximum; the recommendation may use less than the full budget.

Selection is pure, random-injectable logic. It chooses from eligible unseen items, cycles through the pool before repeating, and avoids an immediate repeat at cycle boundaries. Changing either filter clears the in-memory history. No state is persisted.

Validated URL state uses `minutes`, `category`, and `activity` query parameters. Unknown or incompatible values safely fall back. Sharing uses Web Share when available and clipboard otherwise; shared activity text is generated from validated local data.

## Development

From the repository root:

```sh
./dev i-have-90-minutes
./check i-have-90-minutes
./build i-have-90-minutes
```

Tests cover catalog validation, all budgets/categories, duration and category filtering, repeat cycles, filter-key behavior, URL parsing, sharing text, safe DOM rendering conventions, and production artifacts. Output is written to `dist/`.

Set the final HTTPS origin in `site.config.json` (or `SITE_URL` during build) before deployment. Until then canonical, sitemap, and social URL output intentionally remain relative or empty. Search Console setup waits for that domain.

Analytics and AdSense have isolated, disabled configuration fields and load no third-party code. If either is implemented later, update the privacy notice first. The catalog is intentionally general, location-free, non-personalized, and does not account for weather, equipment, accessibility needs, or individual health constraints.
