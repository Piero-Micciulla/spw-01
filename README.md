# SPW — Single Page Websites

SPW is a portfolio of small, independent, traffic-driven website experiments. Each site is a self-contained static project under `sites/<site-slug>/` with its own source, configuration, tests, build, and deployable output.

The architectural rule is simple: **sites are independent, root tooling is shared, and application code is not shared by default.** A site can be built, deployed, or removed without creating runtime dependencies on another site.

## Commands

From the repository root:

```sh
./dev is-it-autumn-yet
./build is-it-autumn-yet
./check is-it-autumn-yet

./build all
./check all
```

The batch commands discover site directories containing a `package.json`, run each independently, print `PASS` or `FAIL`, and return a failing status if any site fails.

## Adding a site

Create `sites/<new-site-slug>/` as an independent project. It should provide a `package.json` with `dev`, `build`, and `check` scripts, keep its own README and site-level configuration, and write deployable static files to its own ignored `dist/` directory. Root commands discover it automatically; no registry needs updating.

Do not introduce shared UI, styles, runtime code, domains, advertising, or analytics at the repository level. Reusable developer tooling may live in root `scripts/` when multiple sites genuinely need it.
