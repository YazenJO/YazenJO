# Profile panel generator

Renders the panels in the profile README: React components → [Satori](https://github.com/vercel/satori) → SVG, one dark and one light file per panel, written to `../assets`.

```bash
npm ci
npm test                            # streak, language and month calculations
GH_TOKEN=... npm run render         # every panel, with live stats
npm run render                      # without a token: static panels only, stats panels left as committed
WRITE_PLACEHOLDERS=1 npm run render # write "renders on the next build" stats panels
```

- `src/components/` holds one component per panel. Satori only does flexbox, so every element with more than one child needs `display: flex`.
- `src/theme.ts` holds the dark and light tokens. The README picks between them with `<picture>` and `prefers-color-scheme`.
- Fonts come from `@fontsource` as WOFF (Satori can't read WOFF2) and are embedded as paths, so the SVGs don't depend on any font being installed.
- `.github/workflows/render-profile.yml` re-renders daily and on changes to this folder, then commits `assets/`.

## Stats

`src/data.ts` sends one GraphQL query to `api.github.com/graphql`. `src/stats.ts` turns the response into what the panels show: streaks, active days, language shares, monthly totals and stars. Those functions are pure and covered by `src/stats.test.ts`.

| Panel | Data |
| --- | --- |
| `activity` | `contributionsCollection.contributionCalendar`: total, per-day counts → heatmap, active days, current and longest streak |
| `footprint` | `repositories(privacy: PUBLIC, ownerAffiliations: OWNER)` → languages (by bytes, forks excluded), public repo count, stars; `contributionsCollection` → commits and PRs; `followers`, `following`; the calendar again → monthly rhythm |

Only public repositories are ever queried. The calendar includes private work as anonymous daily counts, and only if "Private contributions" is enabled on the profile. When the workflow token can't see private work, the commit and PR labels switch to "public commits" and "public PRs".

To design without a token, point `STATS_FIXTURE` at a JSON file shaped like `RawStats` in `src/data.ts`. You must also set `OUT_DIR`; the renderer refuses to write fixture numbers into `assets/`.

To add a panel, write a component, add it to the `panels` list in `src/render.tsx`, and reference `assets/<name>-dark.svg` / `-light.svg` from the README.
