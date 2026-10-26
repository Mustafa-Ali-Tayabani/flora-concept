#!/usr/bin/env node
/**
 * Post-build for the static site (web/dist/web/browser), ready to upload to the
 * web root (Hostinger: public_html/):
 *   - sitemap.xml (indexable pages + published posts only) and robots.txt
 *   - 404.html for ErrorDocument
 *   - Content-Security-Policy with the sha256 of every inline script
 *   - .htaccess: HTTPS + canonical host, trailing slash, caching, compression,
 *     security headers
 *   - /api/devis.php (quote endpoint)
 *   - dist/redirects/<legacy-domain>.htaccess for the old domains
 */
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htaccessFor, loadRedirects, loadSpamSlugs } from './lib/redirects.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'web/dist/web/browser');
const index = JSON.parse(await readFile(join(OUT, 'content/index.json'), 'utf8'));
const settings = JSON.parse(await readFile(join(OUT, 'content/settings.json'), 'utf8'));
const SITE = settings.siteUrl.replace(/\/$/, '');
/** Vercel: headers come from vercel.json, the CSP goes in each page (hashes change per build), no PHP. */
const VERCEL = !!process.env.VERCEL;
const host = new URL(SITE).host;

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

// --- 404 + cleanup -------------------------------------------------------------
// Idempotent: re-running on an already processed build is harmless.
await cp(join(OUT, '404/index.html'), join(OUT, '404.html')).catch(() => {});
await rm(join(OUT, '404'), { recursive: true, force: true });
// English 404 (served for /en/… on Apache; Vercel only supports the root 404.html).
await cp(join(OUT, 'en/404/index.html'), join(OUT, 'en/404.html')).catch(() => {});
await rm(join(OUT, 'en/404'), { recursive: true, force: true });
await rm(join(OUT, 'index.csr.html'), { force: true });

// --- Defer hydration until after `load` ------------------------------------------
// The HTML is complete without JS, and Angular's event-replay contract (inline)
// records early clicks, so the framework bundle does not need to compete with the
// hero image and fonts. Same SRI integrity, same CORS mode.
for await (const file of htmlFiles(OUT)) {
  let html = await readFile(file, 'utf8');
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');
  html = html.replace(
    /<script src="(main-[A-Za-z0-9_-]+\.js)" type="module" crossorigin="anonymous" integrity="([^"]+)"><\/script>/,
    (_, src, integrity) =>
      // After `load` AND the first contentful paint (on slow CPUs load can fire first), 4 s fallback.
      `<script>(function(){var d=0;function h(){if(d)return;d=1;var s=document.createElement('script');s.type='module';s.src='/${src}';s.crossOrigin='anonymous';s.integrity='${integrity}';document.head.appendChild(s)}function g(){requestAnimationFrame(function(){setTimeout(h,0)})}function r(){setTimeout(h,4000);try{if(performance.getEntriesByName('first-contentful-paint').length)return g();new PerformanceObserver(function(l,o){o.disconnect();g()}).observe({type:'paint'})}catch(e){g()}}if(document.readyState==='complete')r();else addEventListener('load',r,{once:true})})()</script>`,
  );
  await writeFile(file, html);
}

// --- CSP: hash every executable inline script --------------------------------
const hashes = new Set();
const handlerHashes = new Set();
for await (const file of htmlFiles(OUT)) {
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const type = (m[1].match(/type="([^"]+)"/) || [])[1];
    // JSON / JSON-LD are not executed; import maps (SRI of lazy chunks) are governed by script-src.
    if (type && !/^(text|application)\/javascript$|^module$|^importmap$/.test(type)) continue;
    if (!m[2].trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
  }
  // Inline handlers (the critical-CSS loader: onload="this.media='all'") need 'unsafe-hashes' + their hash.
  for (const m of html.matchAll(/\son(?:load|error)="([^"]+)"/g)) {
    handlerHashes.add(`'sha256-${createHash('sha256').update(m[1].replace(/&#39;|&apos;/g, "'"), 'utf8').digest('base64')}'`);
  }
}
if (handlerHashes.size) hashes.add("'unsafe-hashes'");
handlerHashes.forEach((h) => hashes.add(h));
const analyticsHosts = ['https://www.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.clarity.ms', 'https://c.bing.com'];
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')} https://www.googletagmanager.com https://*.clarity.ms`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://cdn.sanity.io ${analyticsHosts.join(' ')}`,
  "font-src 'self'",
  `connect-src 'self' ${analyticsHosts.join(' ')}`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

// Meta CSP (Vercel): frame-ancestors / upgrade-insecure-requests are ignored in <meta>,
// X-Frame-Options and HSTS cover them (vercel.json).
if (VERCEL) {
  const metaCsp = csp.split('; ').filter((d) => !/^(frame-ancestors|upgrade-insecure-requests)/.test(d)).join('; ');
  for await (const file of htmlFiles(OUT)) {
    const html = await readFile(file, 'utf8');
    await writeFile(file, html.replace('<meta charset="utf-8">', `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${metaCsp}">`));
  }
}

// --- .htaccess (site) --------------------------------------------------------------
const wwwRedirect = host.startsWith('www.')
  ? [`RewriteCond %{HTTP_HOST} !^${host.replace(/\./g, '\\.')}$ [NC]`, `RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L]`]
  : [];
const htaccess = `# Generated by scripts/postbuild.mjs: do not edit by hand.
AddDefaultCharset utf-8
AddCharset utf-8 .html .css .js .json .xml .txt .svg
DirectoryIndex index.html
Options -Indexes -MultiViews
ErrorDocument 404 /404.html
ErrorDocument 410 /404.html
<If "%{REQUEST_URI} =~ m#^/en/#">
  ErrorDocument 404 /en/404.html
</If>

<IfModule mod_rewrite.c>
  RewriteEngine On

  # HTTPS + canonical host, single hop
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !=https
  RewriteRule ^ https://${host}%{REQUEST_URI} [R=301,L]
  ${wwwRedirect.join('\n  ')}

  # Hidden files and build artefacts are never served
  RewriteRule (^|/)\\. - [F,L]
  RewriteRule \\.(map|md|ts|mjs)$ - [F,L]

  # Canonical URLs end with « / »: /slug → /slug/ when /slug/index.html exists
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !/$
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}/index.html -f
  RewriteRule ^(.*)$ /$1/ [R=301,L]
</IfModule>

<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header always set Content-Security-Policy "${csp}"
  Header unset X-Powered-By

  # HTML and content JSON change at every deploy; hashed assets never do.
  <FilesMatch "\\.(html|json|xml|txt)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <FilesMatch "-[A-Za-z0-9_-]{8}\\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(webp|png|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/ld+json application/xml image/svg+xml
</IfModule>
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml application/javascript application/json application/xml image/svg+xml
</IfModule>

<IfModule mod_mime.c>
  AddType image/webp .webp
  AddType font/woff2 .woff2
  AddType application/manifest+json .webmanifest
</IfModule>
`;
await writeFile(join(OUT, '.htaccess'), htaccess);

// --- Sitemap + robots ------------------------------------------------------------
const today = index.generatedAt.slice(0, 10);
const urls = [
  ...index.pages
    .filter((p) => !p.noindex && p.template !== 'notFound')
    .map((p) => ({ loc: SITE + p.slug, lastmod: (p.updatedAt ?? index.generatedAt).slice(0, 10), alternates: p.alternates?.fr && p.alternates?.en ? p.alternates : null })),
  ...index.posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}/`, lastmod: (p.updatedAt ?? p.pubDate).slice(0, 10) })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((u) => {
    const alt = u.alternates
      ? ['fr', 'en'].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${u.alternates[l]}"/>`).join('') +
        `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${u.alternates.fr}"/>`
      : '';
    return `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod>${alt}</url>`;
  })
  .join('\n')}
</urlset>
`;
await writeFile(join(OUT, 'sitemap.xml'), sitemap);

const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'Googlebot'];
await writeFile(
  join(OUT, 'robots.txt'),
  `# Search engines and AI assistants are welcome: the content is meant to be cited.
${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`,
);

// --- Quote endpoint ----------------------------------------------------------------
// On Vercel the endpoint is the function web/api/devis.mjs: never ship PHP source there.
if (!VERCEL) {
  await mkdir(join(OUT, 'api'), { recursive: true });
  await cp(join(ROOT, 'server/api'), join(OUT, 'api'), { recursive: true });
}

// --- Legacy domains ------------------------------------------------------------------
const rules = await loadRedirects(ROOT);
const spam = await loadSpamSlugs(ROOT);
const redirDir = join(ROOT, 'web/dist/redirects');
await mkdir(redirDir, { recursive: true });
for (const domain of ['floraconcept.com', 'vegetaloffice.fr']) {
  await writeFile(join(redirDir, `${domain}.htaccess`), htaccessFor(domain, rules, SITE, spam));
}

console.log(`Post-build: ${urls.length} sitemap URLs, CSP with ${hashes.size} inline-script hash(es), ${rules.length} legacy rules (+${spam.length} spam slugs).`);
