import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { loadEnv } from 'vite';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const env = loadEnv('production', process.cwd());
const catalogueOrigin = new URL(env.VITE_CATALOG_PREVIEW_URL || 'https://apibe.betrufit.com');
if (catalogueOrigin.protocol !== 'https:' || catalogueOrigin.username || catalogueOrigin.password) {
  throw new Error('The catalogue preview must use a public HTTPS origin.');
}
const catalogueEndpoints = new Set(['coach-profiles', 'plans', 'couple-plans', 'tiers', 'site-settings', 'program-content', 'testimonials']);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const path = decodeURIComponent(url.pathname);
    if (path.startsWith('/backend/') || path.startsWith('/catalog-preview/')) {
      res.setHeader('Content-Type', 'application/json');
      const endpoint = path.match(/^\/(?:backend|catalog-preview)\/admin_functions\/([a-z-]+)\/$/)?.[1];
      if (req.method !== 'GET' || !catalogueEndpoints.has(endpoint)) {
        res.writeHead(405);
        res.end(JSON.stringify({ detail: 'Local preview is read-only. Use the local backend for enquiries, matching, and checkout.' }));
        return;
      }
      try {
        const response = await fetch(`${catalogueOrigin.origin}/admin_functions/${endpoint}/`, {
          signal: AbortSignal.timeout(10000), headers: { Accept: 'application/json' },
        });
        let data = await response.json();
        if (response.ok && endpoint === 'coach-profiles') {
          const markPreview = coach => ({ ...coach, preview: true, livePreview: true });
          data = Array.isArray(data) ? data.map(markPreview) : { ...data, results: (data.results || []).map(markPreview) };
        }
        res.writeHead(response.status);
        res.end(JSON.stringify(data));
      } catch {
        res.writeHead(502);
        res.end(JSON.stringify({ detail: 'Preview catalogue unavailable' }));
      }
      return;
    }
    const legacyCoach = path.match(/^\/start\/([^/]+)\/?$/);
    if (legacyCoach) {
      res.writeHead(308, { Location: `/lp/${encodeURIComponent(legacyCoach[1])}${url.search}` });
      res.end();
      return;
    }
    let file = resolve(root, '.' + path);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('path');
    let exists = await stat(file).catch(() => null);
    if (exists?.isDirectory()) { file = resolve(file, 'index.html'); exists = await stat(file).catch(() => null); }
    if (!exists && !extname(path)) { file = resolve(root, '.' + path + '.html'); exists = await stat(file).catch(() => null); }
    if (!exists && /^\/(?:coaches|refer)\/[a-z0-9_-]+$/i.test(path)) { file = resolve(root, 'index.html'); exists = await stat(file); }
    if (!exists) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Page not found'); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', ...(/^\/(payment|portal|refer|signin|team)(\/|$)/.test(path) || path === '/survey' ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}) });
    res.end(data);
  } catch { res.writeHead(400); res.end('Invalid request'); }
}).listen(port, '127.0.0.1', () => console.log(`Production preview: http://localhost:${port}`));
