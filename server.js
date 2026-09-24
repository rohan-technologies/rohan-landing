const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'text/plain';
  }
};

const serveFile = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
};

http
  .createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, path.normalize(urlPath.split('?')[0]));
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    serveFile(filePath, res);
  })
  .listen(PORT, () => {
    console.log(`Rohan landing ready on http://localhost:${PORT}`);
  });
