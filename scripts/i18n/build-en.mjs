#!/usr/bin/env node
/**
 * Builds the English seed (content/seed/en/) from the French seed and the
 * translations in content/i18n/en/*.json:
 *   - every translatable French string is replaced by its English translation
 *     (fails if a translation is missing, or stale because the French changed:
 *     run scripts/i18n/extract.mjs then translate the empty entries)
 *   - every internal link, slug, parent and nav entry is remapped to its English
 *     URL (content/i18n/slugs.json)
 *
 *   node scripts/i18n/build-en.mjs
 */
import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { translatable, pathKey, setAt } from './strings.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SEED = join(ROOT, 'content/seed');
const OUT = join(SEED, 'en');
const SLUGS = JSON.parse(await readFile(join(ROOT, 'content/i18n/slugs.json'), 'utf8'));

/** French internal URL → English URL (fragment kept). Unknown internal paths are an error. */
function mapHref(href, where, errors) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return href;
  const [path, frag] = href.split('#');
  const en = SLUGS[path];
  if (!en) {
    errors.push(`${where}: no English URL for ${path}`);
    return href;
  }
  return frag ? `${en}#${frag}` : en;
}

function remapLinks(node, where, errors) {
  if (Array.isArray(node)) return node.forEach((n) => remapLinks(n, where, errors));
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if ((k === 'href' || k === 'slug') && typeof v === 'string') node[k] = mapHref(v, where, errors);
    else remapLinks(v, where, errors);
  }
}

async function translateDoc(doc, id, errors) {
  const t = JSON.parse(await readFile(join(ROOT, 'content/i18n/en', `${id}.json`), 'utf8').catch(() => '{}'));
  const en = structuredClone(doc);
  for (const [path, fr] of translatable(doc)) {
    const k = pathKey(path);
    const entry = t[k];
    if (!entry || !entry.en?.trim()) errors.push(`${id}: missing translation for ${k}`);
    else if (entry.fr !== fr) errors.push(`${id}: stale translation for ${k} (French changed)`);
    else setAt(en, path, entry.en);
  }
  remapLinks(en, id, errors);
  return en;
}

const errors = [];
await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'pages'), { recursive: true });
const built = [];
for (const f of await readdir(join(SEED, 'pages'))) {
  const id = f.replace('.json', '');
  const fr = JSON.parse(await readFile(join(SEED, 'pages', f), 'utf8'));
  const en = await translateDoc(fr, id, errors);
  en._id = `${fr._id}-en`;
  en.lang = 'en';
  built.push([f, en]);
}
// References to other pages carry their (English) name: breadcrumb parent, « See also » hub.
const nameBySlug = Object.fromEntries(built.map(([, p]) => [p.slug, p.name]));
for (const [f, en] of built) {
  for (const ref of [en.parent, en.related?.hub]) if (ref) ref.name = nameBySlug[ref.slug] ?? ref.name;
  await writeFile(join(OUT, 'pages', f), JSON.stringify(en, null, 2) + '\n');
}
const settings = await translateDoc(JSON.parse(await readFile(join(SEED, 'settings.json'), 'utf8')), 'settings', errors);
settings._id = 'siteSettingsEn';
settings.lang = 'en';
await writeFile(join(OUT, 'settings.json'), JSON.stringify(settings, null, 2) + '\n');

if (errors.length) {
  console.error(`English seed: ${errors.length} problem(s)\n` + errors.slice(0, 40).map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`English seed built → ${OUT}`);
