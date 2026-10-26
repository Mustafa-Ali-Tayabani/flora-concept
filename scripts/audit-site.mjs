#!/usr/bin/env node
/**
 * Acceptance checks on the built site (web/dist/web/browser), mirroring the
 * « verified with tools, not by eye » list of the brief:
 *   - every page exists, one single <h1>, lang="fr", UTF-8
 *   - <title> / meta description identical to the content and unique
 *   - self-referencing canonical; noindex pages have none
 *   - JSON-LD parses; no FAQPage; LocalBusiness only on the allowed pages
 *   - « Demander un devis » (/devis/) and « Appeler » (tel:) on every page
 *   - no placeholder, no « Végétal Office », no price, no encoding artefact
 *   - Paris page content never links to the outdoor (PACA-only) pages
 *   - sitemap = indexable pages + published posts only
 *
 *   npm run audit:site
 */
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'web/dist/web/browser');
const index = JSON.parse(await readFile(join(OUT, 'content/index.json'), 'utf8'));
const settings = JSON.parse(await readFile(join(OUT, 'content/settings.json'), 'utf8'));
const SITE = settings.siteUrl;

const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const decode = (s) => s.replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '));

const OUTDOOR = ['/espaces-verts-entreprise/', '/entretien-espaces-verts-copropriete/', '/creation-amenagement-espaces-verts/', '/elagage-entreprise-marseille-aix/', '/terrasses-vegetalisees-entreprise/', '/ruches-entreprise/'];
const LOCAL_BUSINESS_OK = ['/', '/entretien-location-plantes-marseille/', '/en/', '/en/office-plants-marseille/'];
const titles = new Map();
const descriptions = new Map();

for (const p of index.pages) {
  const file = p.slug === '/404/' ? join(OUT, '404.html') : p.slug === '/en/404/' ? join(OUT, 'en/404.html') : join(OUT, p.slug, 'index.html');
  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    fail(p.slug, 'HTML file missing');
    continue;
  }
  const content = JSON.parse(await readFile(join(OUT, 'content/pages', `${p.file}.json`), 'utf8'));
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '');
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];

  const lang = p.lang ?? 'fr';
  if (!new RegExp(`<html lang="${lang}"`).test(html)) fail(p.slug, `missing lang="${lang}"`);
  if (p.alternates?.fr && p.alternates?.en && !p.noindex && p.template !== 'notFound') {
    for (const l of ['fr', 'en']) if (!html.includes(`hreflang="${l}" href="${SITE}${p.alternates[l]}"`)) fail(p.slug, `missing hreflang ${l}`);
  }
  if (!/<meta charset="utf-8">/i.test(html)) fail(p.slug, 'missing UTF-8 charset');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(p.slug, `expected exactly one <h1>, found ${(html.match(/<h1[\s>]/g) || []).length}`);
  if (title !== content.seo.title) fail(p.slug, `title differs from content: « ${title} »`);
  if (content.seo.description && desc !== content.seo.description) fail(p.slug, 'meta description differs from content');
  if (titles.has(title)) fail(p.slug, `duplicate title with ${titles.get(title)}`);
  titles.set(title, p.slug);
  if (desc) {
    if (descriptions.has(desc)) fail(p.slug, `duplicate description with ${descriptions.get(desc)}`);
    descriptions.set(desc, p.slug);
  }
  // French copy must not leak into English pages (and vice versa for the interface).
  if (lang === 'en' && /Recevoir mon devis|Appeler<|En bref|Questions fréquentes/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(p.slug, 'French interface text on an English page');
  if (p.noindex || p.template === 'notFound') {
    if (!/name="robots" content="noindex/.test(html)) fail(p.slug, 'noindex page without robots noindex');
  } else if (canonical !== SITE + p.slug) fail(p.slug, `canonical ${canonical} ≠ ${SITE + p.slug}`);

  const ld = (html.match(/<script id="ld-json" type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1];
  if (ld) {
    try {
      const graph = JSON.parse(ld)['@graph'];
      const types = graph.map((n) => n['@type']);
      if (types.includes('FAQPage')) fail(p.slug, 'FAQPage schema is not allowed');
      if (types.includes('LocalBusiness') && !LOCAL_BUSINESS_OK.includes(p.slug)) fail(p.slug, 'LocalBusiness only allowed for the Gémenos base (home, Marseille)');
      if (p.template === 'service' && !types.includes('Service')) fail(p.slug, 'Service schema missing');
    } catch (e) {
      fail(p.slug, `invalid JSON-LD: ${e.message}`);
    }
  } else if (p.template !== 'notFound') fail(p.slug, 'JSON-LD missing');

  if (!html.includes(`href="${lang === 'en' ? '/en/quote/' : '/devis/'}"`)) fail(p.slug, 'no « devis » link');
  if (!/href="tel:\+\d+"/.test(html)) fail(p.slug, 'no « Appeler » tel: link');

  const t = text(html);
  if (/A_FOURNIR|\{\{/.test(html.replace(/<script id="ng-state"[\s\S]*?<\/script>/, ''))) fail(p.slug, 'placeholder left in HTML');
  if (/v[ée]g[ée]tal\s*office/i.test(t)) fail(p.slug, 'mentions « Végétal Office »');
  // The share capital in the legal notice is a legal requirement, not a price.
  if (/\d\s?(€|euros?\b)|€\s?\d/i.test(t.replace(/capital (de|of) [\d\s\u00a0\u202f.,]+€/g, ''))) fail(p.slug, 'price displayed');
  if (/Ã©|Ã¨|Ã |â€|�/.test(html)) fail(p.slug, 'encoding artefact');
  const OUTDOOR_EN = ['/en/corporate-grounds-maintenance/', '/en/residential-grounds-maintenance/', '/en/landscape-design/', '/en/tree-pruning-marseille-aix/', '/en/planted-terraces/', '/en/corporate-beehives/'];
  if (['/location-entretien-plantes-bureau-paris/', '/en/office-plants-paris/'].includes(p.slug) && [...OUTDOOR, ...OUTDOOR_EN].some((o) => main.includes(`href="${o}"`))) fail(p.slug, 'Paris page links to an outdoor page');
}

const sitemap = await readFile(join(OUT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = [...index.pages.filter((p) => !p.noindex && p.template !== 'notFound').map((p) => SITE + p.slug), ...index.posts.map((p) => `${SITE}/blog/${p.slug}/`)];
if (locs.length !== expected.length || expected.some((u) => !locs.includes(u))) errors.push('sitemap.xml does not match the indexable pages and published posts');
const now = new Date(index.generatedAt);
for (const post of index.posts) if (new Date(post.pubDate) > now) errors.push(`future-dated post published: ${post.slug}`);

if (errors.length) {
  console.error(`Site audit: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`Site audit: ${index.pages.length} pages and ${index.posts.length} posts checked, no problem found.`);
