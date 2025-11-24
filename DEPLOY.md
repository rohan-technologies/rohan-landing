# Deployment & hosting

Guide to ship the landing as a static site on S3 (optionally behind CloudFront) without exposing secrets in the repo.

## 1) Build static assets with the Mapbox token

```bash
# set your public Mapbox token (do not commit it)
export MAPBOX_TOKEN="pk.YOUR_TOKEN"
npm run build
```

This generates `dist/` with `index.html` containing the injected token plus assets (CSS, JS, images).

## 2) Create and configure the S3 bucket

```bash
aws s3 mb s3://rohan-landing-example
aws s3 website s3://rohan-landing-example/ --index-document index.html --error-document index.html
```

In the S3 console, enable “Block all public access” = off (for a static site) or keep it private and front with CloudFront.

## 3) Upload the build

```bash
aws s3 sync dist/ s3://rohan-landing-example/ \
  --delete \
  --cache-control "public, max-age=604800" \
  --exclude "index.html"

# ship index.html with shorter cache
aws s3 cp dist/index.html s3://rohan-landing-example/index.html \
  --cache-control "public, max-age=300"
```

## 4) Optional: CloudFront for HTTPS + caching

- Create a CloudFront distribution with the S3 bucket as origin (Origin Access Control recommended).
- Default root object: `index.html`.
- Behaviors: long cache for assets (`*.css, *.js, *.png, *.jpg`) and short cache for `index.html`.
- Attach ACM certificate for your domain and add the CNAME.

## 5) Updates

Repeat the build and sync steps; CloudFront invalidation for `index.html` only is usually enough:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/index.html"
```

## Notes

- Keep `MAPBOX_TOKEN` in environment variables only; never commit it.
- `dist/` stays gitignored; CI/CD (GitHub Actions) can run `npm run build` then `aws s3 sync dist/ ...`.
- For CI, pass `MAPBOX_TOKEN` as a secret and avoid logging it.***
