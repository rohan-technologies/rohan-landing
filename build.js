const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

const copy = (file) => {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
};

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const assets = ['styles.css', 'app.js', 'logo.png'];
assets.forEach(copy);

// Cache-bust: assets ship with a 7-day cache, index.html with 5 min.
const hash = (file) =>
  crypto.createHash('sha1').update(fs.readFileSync(path.join(root, file))).digest('hex').slice(0, 8);

let indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assets.forEach((file) => {
  indexHtml = indexHtml.split(`"./${file}"`).join(`"./${file}?v=${hash(file)}"`);
});
fs.writeFileSync(path.join(dist, 'index.html'), indexHtml, 'utf8');

console.log('Dist ready at dist/. Deploy dist to S3 as static site.');
