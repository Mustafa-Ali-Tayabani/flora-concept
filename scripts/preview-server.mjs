#!/usr/bin/env node
/**
 * Local preview of the production build with the same behaviour as the Apache
 * .htaccess: /slug → /slug/ (301), 404.html, gzip, cache and security headers
 * (CSP read from the generated .htaccess). POST /api/devis.php is mocked with
 * the same validation rules as server/api/devis.php.
 *
 *   npm run preview            → http://localhost:4300
 *   PORT=8080 npm run preview
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'web/dist/web/browser');
const PORT = Number(process.env.PORT || 4300);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };

/** CSP from the generated .htaccess, re-read on each request (hashes change at every build). */
async function localCsp() {
  const htaccess = await readFile(join(ROOT, '.htaccess'), 'utf8').catch(() => '');
  const csp = (htaccess.match(/Content-Security-Policy "([^"]+)"/) || [])[1];
  // Local http: drop the https upgrade so the preview works on localhost.
  return csp?.replace(/;\s*upgrade-insecure-requests/, '');
}

const hits = new Map();
function mockDevis(req, res, body) {
  const json = (status, b) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(b)); };
  let d;
  try { d = JSON.parse(body); } catch { return json(400, { ok: false }); }
  const ip = req.socket.remoteAddress;
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => t > now - 600_000);
  if (d.website || (d.elapsed ?? 0) < 2500) return json(200, { ok: true });
  const errors = {};
  if (!String(d.nom || '').trim()) errors.nom = true;
  const c = String(d.contact || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c) && c.replace(/\D/g, '').length < 10) errors.contact = true;
  if (!String(d.besoin || '').trim()) errors.besoin = true;
  if (Object.keys(errors).length) return json(422, { ok: false, errors });
  if (list.length >= 5) return json(429, { ok: false });
  hits.set(ip, [...list, now]);
  console.log('[devis] mock submission', { ...d, besoin: String(d.besoin).slice(0, 60) });
  return json(200, { ok: true });
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/devis.php' || url.pathname === '/api/devis') {
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => mockDevis(req, res, body));
    return;
  }
  const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, path);
  let status = 200;
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: url.pathname + '/' + url.search });
        return res.end();
      }
      file = join(file, 'index.html');
      await stat(file);
    }
  } catch {
    file = join(ROOT, '404.html');
    status = 404;
  }
  const ext = extname(file);
  let data = await readFile(file);
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': /\.(html|json|xml|txt)$/.test(ext) ? 'no-cache' : 'public, max-age=31536000, immutable',
  };
  const csp = ext === '.html' ? await localCsp() : null;
  if (csp) headers['Content-Security-Policy'] = csp;
  if (/gzip/.test(req.headers['accept-encoding'] || '') && /\.(html|js|css|json|xml|txt|svg)$/.test(ext)) {
    data = gzipSync(data);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(data);
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
