# Rohan landing (v2)

Landing page for **Rohan Technologies** — geospatial intelligence for the age of AI. Presents the three product surfaces (Orbital, Datos Abiertos, Labs), the animated "capas de información" component, and the company mission/values. Site copy is in Spanish.

v2 is a full rebuild of the v1 Mapbox-based landing. It keeps the same architecture (static files → `build.js` → `dist/` → S3 via GitHub Actions) but no longer needs a Mapbox token.

## Requirements

- Node.js 18+ (no dependencies to install)

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Edit content efficiently

- `index.html`: all copy and sections. Anchor ids: `#productos`, `#como-funciona`, `#diferenciador`, `#empresa`.
  - Logo: inline SVG `<defs>` at the top of `<body>` (`#rohan-full`, `#rohan-mark`, `#rohan-mountains-only`), reused via `<use href="…">`.
  - Products: `.product` cards inside `#productos` (domain, status badge, description, bullets).
  - How it works: the 4 layers (`.layer`) and 3 steps (`.how-step`) inside `#como-funciona`.
  - Coordination lanes: `.diff-lane` blocks inside `#diferenciador` (position with `left`/`width` %).
  - Mission, vision, values: `#empresa`.
  - Contact email: `mailto:` links in the status band and footer.
- `styles.css`: design tokens at the top (`:root`, `[data-theme="dark"]`, `[data-theme="light"]`), then one block per section.
- `app.js`: theme toggle (dark by default, in memory only), the layers merge/separate animation, and the canvas painters for each layer (`paint('lf-…')`).
- `logo.png`: favicon.

## Project layout

- Track: `index.html`, `styles.css`, `app.js`, `logo.png`, `server.js`, `build.js`, `package.json`, docs, workflow.
- `dist/` is a build artifact and is gitignored.

## Build for static hosting (S3/CloudFront)

```bash
npm run build
```

`build.js` copies the site into `dist/` and appends a content hash to asset URLs in `index.html` (`styles.css?v=…`), so the 7-day asset cache never serves stale CSS/JS after a deploy.

## Deployment

See `DEPLOY.md`. Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and syncs `dist/` to S3.

Secrets needed: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`. (`MAPBOX_TOKEN` is no longer used and can be deleted.)
