import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const build = spawn(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
await new Promise((resolve, reject) => build.on('exit', code => code === 0 ? resolve() : reject(new Error('Build failed'))));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.webmanifest':'application/manifest+json' };
const port = Number(process.env.PORT || 4175);

createServer(async (request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let path = normalize(join(root, urlPath));
  if (!path.startsWith(root)) { response.writeHead(403).end('Forbidden'); return; }
  try {
    const info = await stat(path);
    if (info.isDirectory()) path = join(path, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache' });
    createReadStream(join(root, '404.html')).pipe(response);
  }
}).listen(port, '127.0.0.1', () => console.log(`\nJust Pick a Movie → http://localhost:${port}\n`));
