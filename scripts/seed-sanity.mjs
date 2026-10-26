#!/usr/bin/env node
/**
 * One-off: loads content/seed (the delivered Markdown, imported verbatim) into a
 * Sanity dataset, so editors start from the exact approved copy.
 *
 *   SANITY_PROJECT_ID=xxx SANITY_DATASET=production SANITY_WRITE_TOKEN=sk... npm run studio:seed
 *
 * Images are uploaded once (content/media/originals) and referenced as assets.
 * Documents are created with createOrReplace: re-running overwrites the seed
 * documents (do not re-run once editors have started working).
 */
import { readFile, readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { SANITY_PROJECT_ID, SANITY_DATASET = 'production', SANITY_WRITE_TOKEN } = process.env;
if (!SANITY_PROJECT_ID || !SANITY_WRITE_TOKEN) {
  console.error('Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN (Editor token).');
  process.exit(1);
}
const client = createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, token: SANITY_WRITE_TOKEN, apiVersion: '2025-02-19', useCdn: false });

const originals = join(ROOT, 'content/media/originals');
const files = await readdir(originals);
const assetIds = new Map();
async function asset(name) {
  if (assetIds.has(name)) return assetIds.get(name);
  const file = files.find((f) => f.replace(/\.[^.]+$/, '') === name);
  if (!file) throw new Error(`No original for ${name}`);
  const doc = await client.assets.upload('image', createReadStream(join(originals, file)), { filename: file });
  assetIds.set(name, doc._id);
  return doc._id;
}

/** Array member types of the schema (studio/schemaTypes), by field name and parent type. */
function memberType(field, parent) {
  if (['cards', 'regions'].includes(field) || (field === 'items' && ['sectionProfiles', 'related'].includes(parent))) return 'cardItem';
  if (field === 'items' && parent === 'sectionFaq') return 'faqItem';
  if (field === 'items' && parent?.startsWith('navGroup')) return 'navLink';
  if (field === 'items' || field === 'steps') return 'leadItem';
  return { groups: parent === 'nav' ? 'navGroup' : 'group', rows: 'row', parts: 'legalPart', phones: 'phoneLine', figures: 'figure', milestones: 'milestone', columns: 'footerColumn', links: 'navLink', legal: 'navLink', faq: 'faqItem' }[field];
}

/** Converts the seed contract back to Sanity storage: images → assets, typed array members. */
async function toSanity(node, field = '', parent = '') {
  if (Array.isArray(node)) {
    const type = memberType(field, parent);
    return Promise.all(
      node.map(async (n) => {
        const v = await toSanity(n, field, type ?? parent);
        return v && typeof v === 'object' && !Array.isArray(v) && !v._type && type ? { _type: type, _key: v._key ?? Math.random().toString(36).slice(2, 14), ...v } : v;
      }),
    );
  }
  if (!node || typeof node !== 'object') return node;
  if (typeof node.src === 'string' && node.src.startsWith('/img/') && 'width' in node) {
    return { _type: 'imageWithAlt', alt: node.alt ?? '', asset: { _type: 'reference', _ref: await asset(node.src.slice(5)) } };
  }
  const own = node._type ?? (field === 'related' || field === 'nav' ? field : parent);
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = await toSanity(v, k, own);
  return out;
}

const seed = join(ROOT, 'content/seed');
const pages = await Promise.all((await readdir(join(seed, 'pages'))).map(async (f) => JSON.parse(await readFile(join(seed, 'pages', f), 'utf8'))));
const idBySlug = new Map(pages.map((p) => [p.slug, p._id]));

const tx = client.transaction();
const settings = await toSanity(JSON.parse(await readFile(join(seed, 'settings.json'), 'utf8')));
tx.createOrReplace({ ...settings, _id: 'siteSettings', _type: 'siteSettings' });
for (const p of pages) {
  const doc = await toSanity(p);
  delete doc.related?.hub;
  tx.createOrReplace({
    ...doc,
    _type: 'page',
    slug: { _type: 'slug', current: p.slug },
    parent: p.parent ? { _type: 'reference', _ref: idBySlug.get(p.parent.slug) } : undefined,
    related: p.related ? { ...doc.related, hub: { _type: 'reference', _ref: idBySlug.get(p.related.hub.slug) } } : undefined,
  });
}
await tx.commit();
console.log(`Seeded ${pages.length} pages, site settings and ${assetIds.size} images into ${SANITY_PROJECT_ID}/${SANITY_DATASET}.`);
