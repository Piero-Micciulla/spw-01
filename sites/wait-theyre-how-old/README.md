# Wait, They're HOW Old?

SPW #8 is a local-first celebrity-age search engine. The static site ships a curated living-person dataset, computes ages from local calendar dates, and has no runtime API or third-party dependency.

```sh
npm test
npm run validate:data
npm run build
npm run check
```

Leap-day convention: in non-leap years, a February 29 birthday is observed on February 28 for age and next-birthday calculations. This is consistent, explicit, and covered by tests.

Birth dates were assembled from Wikidata records during development. Each item retains its Wikidata QID as a source key. Records without an English label, a single valid day-precision date, or a living-person signal were excluded.
