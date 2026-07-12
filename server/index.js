const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const root = join(__dirname, '..');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const contents = await readFile(filePath);
    response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' });
    response.end(contents);
  } catch {
    response.writeHead(404).end();
  }
}).listen(Number(process.env.PORT) || 3000, '0.0.0.0');
