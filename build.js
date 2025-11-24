const fs = require('fs');
const path = require('path');

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || '';
const root = __dirname;
const dist = path.join(root, 'dist');

if (!MAPBOX_TOKEN) {
  console.warn('⚠️  MAPBOX_TOKEN is empty. Set it before building for S3.');
}

const copy = (file) => {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
};

fs.mkdirSync(dist, { recursive: true });

const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const patchedHtml = indexHtml.replace('__MAPBOX_TOKEN__', JSON.stringify(MAPBOX_TOKEN));
fs.writeFileSync(path.join(dist, 'index.html'), patchedHtml, 'utf8');

['styles.css', 'app.js', 'logo.png', 'diavila.jpg', 'csar.jpg', 'mafer.jpg'].forEach(copy);

console.log('Dist ready at dist/. Deploy dist to S3 as static site.');
