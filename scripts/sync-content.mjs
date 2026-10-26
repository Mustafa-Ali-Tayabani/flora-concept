#!/usr/bin/env node
/**
 * Build-time content sync: Sanity (or the local seed) → web/public/content/*.json
 *
 *  - SANITY_PROJECT_ID set  → reads published documents from Sanity
 *  - otherwise              → reads content/seed (generated from the delivered Markdown)
 *
 * Publication rules enforced here, so that nothing downstream can leak them:
 *  - `{{A_FOURNIR}}` placeholders (Portable Text `pending` nodes) are removed, and
 *    blocks / items / sections left empty are dropped. CONTENT_PREVIEW=1 keeps
 *    them (rendered as « À fournir » chips) for client review builds.
 *  - Blog posts with a future `pubDate` do not exist: not written, not listed,
 *    not in the sitemap. `BUILD_NOW` (ISO date) overrides "now" for tests.
 *  - A pending-data report is written to .cache/pending-report.json for
 *    scripts/content-guard.mjs.
 */
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'web/public/content');
const PREVIEW = process.env.CONTENT_PREVIEW === '1';
const NOW = process.env.BUILD_NOW ? new Date(process.env.BUILD_NOW) : new Date();

export const fileForSlug = (slug) => (slug === '/' ? 'index' : slug.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
async function fromSeed() {
  const dir = join(ROOT, 'content/seed');
  const read = async (f) => JSON.parse(await readFile(f, 'utf8'));
  const pages = await Promise.all((await readdir(join(dir, 'pages'))).filter((f) => f.endsWith('.json')).map((f) => read(join(dir, 'pages', f))));
  const posts = await Promise.all((await readdir(join(dir, 'posts'))).filter((f) => f.endsWith('.json')).map((f) => read(join(dir, 'posts', f))));
  return { settings: await read(join(dir, 'settings.json')), pages, posts };
}

async function fromSanity() {
  const { createClient } = await import('@sanity/client');
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2025-02-19',
    useCdn: false,
    perspective: 'published',
    token: process.env.SANITY_READ_TOKEN || undefined,
  });
  const [docs, assets] = await Promise.all([
    client.fetch(`*[_type in ["page", "post", "person", "caseStudy", "siteSettings"] && !(_id in path("drafts.**"))]`),
    client.fetch(`*[_type == "sanity.imageAsset"]{_id, url, "w": metadata.dimensions.width, "h": metadata.dimensions.height}`),
  ]);
  const byId = new Map(docs.map((d) => [d._id, d]));
  const assetById = new Map(assets.map((a) => [a._id, a]));

  /** Resolves image assets, references and slugs into the web content contract. */
  const resolve = (node, depth = 0) => {
    if (Array.isArray(node)) return node.map((n) => resolve(n, depth));
    if (!node || typeof node !== 'object') return node;
    if (node.asset?._ref) {
      const a = assetById.get(node.asset._ref);
      if (!a) return undefined;
      const h = node.hotspot;
      return { src: a.url, alt: node.alt ?? '', width: a.w, height: a.h, ...(h ? { position: `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%` } : {}) };
    }
    if (node._type === 'reference' && node._ref) {
      const d = byId.get(node._ref);
      if (!d || depth > 3) return undefined;
      if (d._type === 'page') return { slug: d.slug?.current, name: d.name };
      return resolve({ ...d }, depth + 1);
    }
    if (node._type === 'slug') return node.current;
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('_') && !['_type', '_key', '_id'].includes(k)) continue;
      const r = resolve(v, depth);
      if (r !== undefined && r !== null) out[k] = r;
    }
    return out;
  };

  const settings = resolve(byId.get('siteSettings') ?? docs.find((d) => d._type === 'siteSettings'));
  if (!settings) throw new Error('Sanity: siteSettings document missing (run npm run studio:seed).');
  const pages = docs.filter((d) => d._type === 'page').map((d) => {
    const p = resolve(d);
    return { ...p, updatedAt: d._updatedAt, sections: (p.sections ?? []).map((s) => (s._type === 'sectionCaseStudies' ? { ...s, cases: (s.cases ?? []).filter(Boolean) } : s)) };
  });
  const posts = docs.filter((d) => d._type === 'post').map((d) => ({ ...resolve(d), updatedAt: d._updatedAt }));
  return { settings, pages, posts };
}

// ---------------------------------------------------------------------------
// Pending-data stripping
// ---------------------------------------------------------------------------
const pendingNotes = [];
const blockText = (b) => (b.children ?? []).filter((c) => c._type === 'span').map((c) => c.text).join('');

function cleanBlocks(blocks, where) {
  if (!Array.isArray(blocks)) return blocks;
  return blocks
    .map((b) => {
      if (b?._type !== 'block') return b;
      const pend = b.children.filter((c) => c._type === 'pending');
      pend.forEach((p) => pendingNotes.push({ where, note: p.note }));
      if (PREVIEW || !pend.length) return b;
      const children = b.children.filter((c) => c._type !== 'pending');
      // Tidy whitespace and separators left around the removed placeholder.
      children.forEach((c, i) => {
        if (c._type !== 'span') return;
        c.text = c.text.replace(/\s{2,}/g, ' ');
        const prev = children[i - 1];
        if (prev?._type === 'span' && /\s$/.test(prev.text)) c.text = c.text.replace(/^\s+/, '');
        if (i === children.length - 1) c.text = c.text.replace(/[\s·(]+$/, '');
      });
      return { ...b, children };
    })
    .filter((b) => b?._type !== 'block' || /[\p{L}\p{N}]/u.test(blockText(b)) || b.children.some((c) => c._type === 'variable'));
}

const isEmptyRich = (r) => !Array.isArray(r) || r.length === 0;

/** Walks any content node, cleaning every Portable Text array found. */
function clean(node, where) {
  if (Array.isArray(node)) {
    if (node.length && node.every((n) => n?._type === 'block')) return cleanBlocks(node, where);
    return node.map((n) => clean(n, where));
  }
  if (!node || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = clean(v, where);
  return out;
}

/** Drops list items and sections whose content was only client placeholders. */
function prune(page) {
  const keepItem = (it) => it.lead || !isEmptyRich(it.text);
  page.sections = (page.sections ?? [])
    .map((s) => {
      const t = { ...s };
      if (t.items && t._type !== 'sectionFaq' && t._type !== 'sectionProfiles') t.items = t.items.filter(keepItem);
      if (t._type === 'sectionFaq') t.items = t.items.filter((f) => !isEmptyRich(f.answer));
      if (t.steps) t.steps = t.steps.filter(keepItem);
      return t;
    })
    .filter((s) => {
      switch (s._type) {
        case 'sectionText': return !isEmptyRich(s.body);
        case 'sectionFaq': return s.items.length > 0;
        case 'sectionChecklist': case 'sectionArguments': return s.items.length > 0;
        case 'sectionCaseStudies': return s.cases?.length > 0;
        case 'sectionLogos': return s.logos?.length > 0;
        case 'sectionTeam': return s.members?.length > 0;
        case 'sectionFigures': return s.figures?.length > 0;
        case 'sectionTimeline': return s.milestones?.length > 0;
        default: return true;
      }
    });
  return page;
}

// ---------------------------------------------------------------------------
const source = process.env.SANITY_PROJECT_ID ? 'sanity' : 'seed';
const { settings, pages, posts } = source === 'sanity' ? await fromSanity() : await fromSeed();

// Environment overrides (deployment-specific values never live in content).
if (process.env.SITE_URL) settings.siteUrl = process.env.SITE_URL.replace(/\/$/, '');
if (process.env.VERCEL) settings.quoteEndpoint = '/api/devis';
if (process.env.GTM_ID !== undefined) settings.analytics = { ...settings.analytics, gtmId: process.env.GTM_ID };

const publishedPosts = posts
  .filter((p) => p.pubDate && new Date(p.pubDate) <= NOW)
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'pages'), { recursive: true });
await mkdir(join(OUT, 'posts'), { recursive: true });

const index = { generatedAt: NOW.toISOString(), pages: [], posts: [] };
const slugs = new Set();
for (const raw of pages) {
  if (!raw.slug) continue;
  if (slugs.has(raw.slug)) throw new Error(`Duplicate slug ${raw.slug}`);
  slugs.add(raw.slug);
  const page = prune(clean(raw, raw.slug));
  const file = fileForSlug(page.slug);
  await writeFile(join(OUT, 'pages', `${file}.json`), JSON.stringify(page));
  index.pages.push({ slug: page.slug, file, template: page.template, ...(page.seo?.noindex ? { noindex: true } : {}), ...(page.updatedAt ? { updatedAt: page.updatedAt } : {}) });
}
for (const raw of publishedPosts) {
  const post = clean(raw, `/blog/${raw.slug}/`);
  await writeFile(join(OUT, 'posts', `${post.slug}.json`), JSON.stringify(post));
  index.posts.push({ slug: post.slug, title: post.title, excerpt: post.excerpt ?? '', pubDate: post.pubDate, ...(post.image ? { image: post.image } : {}), ...(post.updatedAt ? { updatedAt: post.updatedAt } : {}) });
}
await writeFile(join(OUT, 'settings.json'), JSON.stringify(clean(settings, 'settings')));
await writeFile(join(OUT, 'index.json'), JSON.stringify(index));

await mkdir(join(ROOT, '.cache'), { recursive: true });
await writeFile(join(ROOT, '.cache/pending-report.json'), JSON.stringify({ source, preview: PREVIEW, pending: pendingNotes }, null, 2));

console.log(
  `Content synced from ${source}: ${index.pages.length} pages, ${index.posts.length}/${posts.length} posts published` +
    ` (now = ${NOW.toISOString()}), ${pendingNotes.length} client placeholders ${PREVIEW ? 'kept (preview)' : 'removed'}.`,
);
