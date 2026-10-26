#!/usr/bin/env node
/**
 * Tests 100 % of REDIRECTIONS.md against the live (or staging) legacy domains:
 *   - 301, single hop, Location = exact target, and the target answers 200
 *   - 410 for the listed dead URLs and the hack-spam pattern
 *
 *   npm run test:redirects
 *   SITE_URL=https://www.floraconcept.fr \
 *   FLORACONCEPT_COM=https://www.floraconcept.com VEGETALOFFICE_FR=https://vegetaloffice.fr \
 *   npm run test:redirects
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRedirects, loadSpamSlugs } from './lib/redirects.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.SITE_URL || 'https://www.floraconcept.fr').replace(/\/$/, '');
const ORIGINS = {
  'floraconcept.com': (process.env.FLORACONCEPT_COM || 'https://www.floraconcept.com').replace(/\/$/, ''),
  'vegetaloffice.fr': (process.env.VEGETALOFFICE_FR || 'https://vegetaloffice.fr').replace(/\/$/, ''),
};

const rules = await loadRedirects(ROOT);
const spam = (await loadSpamSlugs(ROOT)).map((s) => ({ domain: 'vegetaloffice.fr', from: `/${s.replace(/^\/|\/$/g, '')}/`, code: 410 }));
// Pattern rules are tested with representative samples.
const samples = [
  { domain: 'vegetaloffice.fr', from: '/1234-2/', code: 410 },
  { domain: 'vegetaloffice.fr', from: '/%CE%B1%CE%B3%CE%BF%CF%81%CE%AC/', code: 410 },
  { domain: 'vegetaloffice.fr', from: '/%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C/', code: 410 },
];
const all = [...rules, ...spam, ...samples];

// Local Apache test containers serve plain HTTP: tell the site's HTTPS rule the request came through TLS.
const local = /^http:\/\/localhost/.test(SITE);
const head = (url) =>
  fetch(url, { method: 'GET', redirect: 'manual', headers: { 'User-Agent': 'flora-redirect-check', ...(local ? { 'X-Forwarded-Proto': 'https' } : {}) } });
let failures = 0;
for (const r of all) {
  const url = ORIGINS[r.domain] + r.from;
  try {
    const res = await head(url);
    if (r.code === 410) {
      if (res.status !== 410) throw new Error(`expected 410, got ${res.status}`);
    } else {
      const loc = res.headers.get('location');
      const expected = SITE + r.target;
      if (res.status !== 301) throw new Error(`expected 301, got ${res.status}`);
      if (loc !== expected) throw new Error(`Location ${loc} ≠ ${expected}`);
      const final = await head(loc);
      if (final.status !== 200) throw new Error(`target answers ${final.status} (must be 200, single hop)`);
    }
    console.log(`  ✓ ${url} → ${r.code === 410 ? '410' : SITE + r.target}`);
  } catch (e) {
    failures++;
    console.error(`  ✗ ${url}: ${e.message}`);
  }
}
console.log(`\n${all.length - failures}/${all.length} redirect lines OK`);
process.exit(failures ? 1 : 0);
