# Rohan landing

Landing page for Rohan, a startup that trains models for smart cities, agri-tech, and geospatial solutions. The hero banner includes an animated farming map using Mapbox GL JS.

## Requirements

- Node.js 18+
- `MAPBOX_TOKEN` environment variable with your public Mapbox token.

## Run locally

```bash
MAPBOX_TOKEN="pk.XXXX" node server.js
```

Open `http://localhost:3000` to see the landing and live map. If the token is missing, the banner shows a notice.

## Edit content efficiently

- `index.html`: all copy, sections, and anchor ids (`#services`, `#cases`, `#founders`, `#cta`). Update text directly here.
- Hero map labels: inside the `.map-legend` block in `index.html`.
- Recent work cards: under the `#cases` section; each card has text plus an embedded thumbnail (`case-thumb`) and link.
- Founders: update names, roles, and social links in `#founders`. Avatar sources are set to `diavila.jpg`, `csar.jpg`, `mafer.jpg`.
- `styles.css`: layout, colors, and sizing. Small, scoped class names (e.g., `.case-thumb`, `.avatar-img`).
- `app.js`: geospatial data (farm polygon, hotspots, drone route) and map style. Change coordinates or Mapbox style URL as needed.

## Project layout (for GitHub)

- Track: `index.html`, `styles.css`, `app.js`, `server.js`, `build.js`, `README.md`, `DEPLOY.md`, image assets, `package.json`.
- Ignore build artifacts: `dist/` is gitignored.
- Typical flow:
  ```bash
  git init
  git add .
  git commit -m "Init Rohan landing"
  git remote add origin git@github.com:your-org/rohan-landing.git
  git push -u origin main
  ```

## Build for static hosting (S3/CloudFront)

`build.js` injects `MAPBOX_TOKEN` and copies assets to `dist/`:

```bash
export MAPBOX_TOKEN="pk.XXXX"
npm run build
```

`dist/` can be uploaded to S3 as a static site. Do not commit the token.

## Deployment guide

See `DEPLOY.md` for step-by-step S3 + optional CloudFront setup and caching guidance.

### GitHub Actions deploy

- Workflow: `.github/workflows/deploy.yml`
- Secrets needed: `MAPBOX_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`.
- Trigger: push to `main` builds `dist/` and syncs to S3 (long cache for assets, short for `index.html`). Adjust branch/headers as needed.

## Customization notes

- Adjust `farmPolygon`, `hotspots`, or `droneRoute` in `app.js` to match your datasets.
- Swap the map style (`mapbox://styles/mapbox/satellite-streets-v12`) with your own Mapbox Studio style.
