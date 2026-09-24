# Deployment & hosting

Guide to ship the landing as a static site on S3 (optionally behind CloudFront) without exposing secrets in the repo.

## 1) Build static assets

```bash
npm run build
```

This generates `dist/` with `index.html` (asset URLs cache-busted with a content hash) plus `styles.css`, `app.js` and `logo.png`.

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
- Behaviors: long cache for assets (`*.css, *.js, *.png`) and short cache for `index.html`. Forward query strings to the cache key (asset URLs use `?v=<hash>`).
- Attach ACM certificate for your domain and add the CNAME.

## 5) Updates

Repeat the build and sync steps; CloudFront invalidation for `index.html` only is usually enough:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/index.html"
```

## Notes

- `dist/` stays gitignored; CI/CD (GitHub Actions) runs `npm run build` then `aws s3 sync dist/ ...`.
- v2 no longer uses Mapbox; the `MAPBOX_TOKEN` secret can be removed from the repo settings.

## GitHub Actions: automatic deploy to S3

Use the provided workflow at `.github/workflows/deploy.yml` to deploy on every push to `main`.

### Required GitHub secrets

- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — IAM user with S3 write permissions.
- `AWS_REGION` — region of the target bucket (e.g., `us-east-1`).
- `AWS_S3_BUCKET` — bucket name (e.g., `rohan-landing-example`).

### How it works

1) Checks out the repo, sets up Node 18.  
2) Runs `npm run build` (writes `dist/` with cache-busted asset URLs).  
3) Configures AWS credentials via `aws-actions/configure-aws-credentials`.  
4) Syncs `dist/` to S3 with long cache for assets and short cache for `index.html`.

### Customize

- Change the branch trigger in `deploy.yml` if needed.  
- Adjust cache headers in the sync commands.  
- If fronting with CloudFront, add an invalidation step for `/index.html` after upload.
