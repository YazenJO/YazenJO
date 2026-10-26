# Profile panel generator

Renders the panels in the profile README: React components → [Satori](https://github.com/vercel/satori) → SVG, one dark and one light file per panel, written to `../assets`.

```bash
npm ci
npm run render                      # all panels; activity only if a token is set
GH_TOKEN=... npm run render         # include the live activity panel
WRITE_PLACEHOLDERS=1 npm run render # write the activity placeholder without a token
```

- `src/components/` holds one component per panel. Satori only does flexbox, so every element with more than one child needs `display: flex`.
- `src/theme.ts` holds the dark and light tokens. The README picks between them with `<picture>` and `prefers-color-scheme`.
- Fonts come from `@fontsource` as WOFF (Satori can't read WOFF2) and are embedded as paths, so the SVGs don't depend on any font being installed.
- `.github/workflows/render-profile.yml` re-renders daily and on changes to this folder, then commits `assets/`.

To add a panel, write a component, add it to the `panels` list in `src/render.tsx`, and reference `assets/<name>-dark.svg` / `-light.svg` from the README.
