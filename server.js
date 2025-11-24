const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || '';

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return 'text/plain';
  }
};

const serveFile = (filePath, res) => {
  const isBinary = /\.(png|jpg|jpeg)$/i.test(filePath);
  fs.readFile(filePath, isBinary ? null : 'utf8', (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    let content = data;
    if (path.basename(filePath) === 'index.html') {
      content = data.toString().replace('__MAPBOX_TOKEN__', JSON.stringify(MAPBOX_TOKEN));
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(content);
  });
};

http
  .createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, urlPath.split('?')[0]);
    serveFile(filePath, res);
  })
  .listen(PORT, () => {
    console.log(`Rohan landing ready on http://localhost:${PORT}`);
    if (!MAPBOX_TOKEN) {
      console.warn('MAPBOX_TOKEN is not set. Map will not render.');
    }
  });
