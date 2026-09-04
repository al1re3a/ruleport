#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const relative = url.pathname === '/' ? 'app/index.html' : url.pathname.replace(/^\//, '');
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root)) { response.writeHead(403).end('Forbidden'); return; }
  try {
    const data = await readFile(absolute);
    response.writeHead(200, { 'content-type': types[path.extname(absolute)] ?? 'application/octet-stream' }).end(data);
  } catch { response.writeHead(404).end('Not found'); }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => console.log(`RulePort Studio: http://127.0.0.1:${port}`));
