#!/usr/bin/env node
/**
 * Converts the delivered French content files (design/uploads/…/contenu/*.md)
 * into structured JSON documents (content/seed/) that follow the content
 * contract in web/src/app/core/content/content.models.ts.
 *
 * Copy is never rewritten: strings are moved character for character into
 * Portable Text. The section mapping mirrors the approved design generator
 * (design/build/gen-v5.js).
 *
 *   node scripts/import-markdown.mjs
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'design/uploads/floraconcept-livraison-dev-2026-10-08/contenu');
const OUT = join(ROOT, 'content/seed');
const MEDIA = JSON.parse(await readFile(join(ROOT, 'content/media/manifest.json'), 'utf8'));
// Verified values for {{A_FOURNIR}} placeholders (with their sources), see content/client-data.json.
const CLIENT_DATA = JSON.parse(await readFile(join(ROOT, 'content/client-data.json'), 'utf8')).replacements;

/** Reads a content file and applies the client data; fails if a replacement no longer matches. */
async function readContent(file) {
  let md = await readFile(join(DIR, file), 'utf8');
  for (const r of CLIENT_DATA.filter((x) => x.file === file)) {
    if (!md.includes(r.find)) throw new Error(`client-data: « ${r.find} » not found in ${file}`);
    md = md.split(r.find).join(r.replace);
  }
  return md;
}

// ---------------------------------------------------------------------------
// Page registry (slugs, templates and hierarchy from SITE-MAP-DEV.md)
// ---------------------------------------------------------------------------
const IDF = 'Île-de-France';
const PACA = "Provence-Alpes-Côte d'Azur";
const PAGES = [
  { id: 'p01', file: '01-accueil.md', slug: '/', template: 'home', name: 'Accueil', sd: { type: 'WebPage', localBusiness: true } },
  { id: 'p02', file: '02-paysagisme-interieur.md', slug: '/paysagisme-interieur/', template: 'hub', name: "Paysagisme d'intérieur", sd: { type: 'Service', serviceType: "paysagisme d'intérieur / végétalisation de bureaux", areaServed: [IDF, PACA] } },
  { id: 'p03', file: '03-location-plantes-bureau.md', slug: '/location-plantes-bureau/', template: 'service', parent: 'p02', name: 'Location de plantes', sd: { type: 'Service', serviceType: 'location de plantes pour entreprises', areaServed: [IDF, PACA] } },
  { id: 'p04', file: '04-entretien-plantes-entreprise.md', slug: '/entretien-plantes-entreprise/', template: 'service', parent: 'p02', name: 'Entretien de plantes', sd: { type: 'Service', serviceType: "entretien de plantes d'intérieur pour entreprises", areaServed: [IDF, PACA] } },
  { id: 'p05', file: '05-mur-vegetal-interieur.md', slug: '/mur-vegetal-interieur/', template: 'service', parent: 'p02', name: 'Murs végétaux', sd: { type: 'Service', serviceType: 'conception et pose de murs végétaux intérieurs', areaServed: ['France', IDF, PACA] } },
  { id: 'p06', file: '06-cadres-vegetaux-stabilises.md', slug: '/cadres-vegetaux-plantes-stabilisees/', template: 'service', parent: 'p02', name: 'Cadres végétaux stabilisés', sd: { type: 'Service', serviceType: 'cadres végétaux stabilisés sur mesure', areaServed: ['France'] } },
  { id: 'p07', file: '07-abonnement-fleurs-entreprise.md', slug: '/abonnement-fleurs-entreprise/', template: 'service', parent: 'p02', name: 'Abonnement fleurs', sd: { type: 'Service', serviceType: 'abonnement floral pour entreprises', areaServed: [IDF, PACA] } },
  { id: 'p08', file: '08-location-plantes-evenementiel.md', slug: '/location-plantes-evenementiel/', template: 'service', parent: 'p02', name: 'Événementiel', sd: { type: 'Service', serviceType: 'location de plantes pour événements', areaServed: [IDF, PACA] } },
  { id: 'p09', file: '09-fleurs-sapins-noel.md', slug: '/fleurs-sapins-noel/', template: 'service', parent: 'p02', name: 'Fleurs et sapins de Noël', sd: { type: 'Service', serviceType: 'location et décoration de sapins de Noël pour entreprises', areaServed: [IDF, PACA] } },
  { id: 'p10', file: '10-agence-paris.md', slug: '/location-entretien-plantes-bureau-paris/', template: 'city', name: 'Paris et Île-de-France', zone: 'paris', sd: { type: 'Service', areaServed: ['Paris', 'Hauts-de-Seine'] } },
  { id: 'p11', file: '11-agence-nice.md', slug: '/entretien-location-plantes-nice/', template: 'city', name: "Nice et Côte d'Azur", zone: 'nice', sd: { type: 'Service', areaServed: ['Alpes-Maritimes', 'Monaco'] } },
  { id: 'p12', file: '12-agence-marseille.md', slug: '/entretien-location-plantes-marseille/', template: 'city', name: 'Marseille et Provence', zone: 'marseille', sd: { type: 'Service', areaServed: ['Bouches-du-Rhône', 'Var', 'Vaucluse'], localBusiness: true } },
  { id: 'p13', file: '13-multisites.md', slug: '/vegetalisation-bureaux-multisites-paris-paca/', template: 'service', name: 'Multi-sites', sd: { type: 'Service', serviceType: 'végétalisation et entretien de plantes multi-sites', areaServed: ['France'] } },
  { id: 'p14', file: '14-faq.md', slug: '/faq/', template: 'faq', name: 'FAQ', sd: { type: 'WebPage' } },
  { id: 'p15', file: '15-devis.md', slug: '/devis/', template: 'quote', name: 'Devis', sd: { type: 'WebPage' } },
  { id: 'p16', file: '16-qui-sommes-nous.md', slug: '/qui-sommes-nous/', template: 'about', name: 'Qui sommes-nous', sd: { type: 'AboutPage' } },
  { id: 'p18', file: '18-espaces-verts.md', slug: '/espaces-verts-entreprise/', template: 'hub', name: "Espaces verts d'entreprise", outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: "entretien et aménagement d'espaces verts pour entreprises", areaServed: [PACA, 'Bouches-du-Rhône', 'Var', 'Vaucluse', 'Alpes-Maritimes'] } },
  { id: 'p18a', file: '18a-espaces-verts-copropriete.md', slug: '/entretien-espaces-verts-copropriete/', template: 'service', parent: 'p18', name: 'Copropriétés et syndics', outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: 'entretien des espaces verts de copropriété', areaServed: [PACA] } },
  { id: 'p18b', file: '18b-creation-espaces-verts.md', slug: '/creation-amenagement-espaces-verts/', template: 'service', parent: 'p18', name: 'Création et aménagement', outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: "création et aménagement d'espaces verts pour entreprises", areaServed: [PACA] } },
  { id: 'p18c', file: '18c-elagage.md', slug: '/elagage-entreprise-marseille-aix/', template: 'service', parent: 'p18', name: 'Élagage et débroussaillage', outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: 'élagage, taille et débroussaillage pour entreprises', areaServed: ['Bouches-du-Rhône', 'Var', 'Vaucluse', 'Alpes-Maritimes'] } },
  { id: 'p18d', file: '18d-terrasses-vegetalisees.md', slug: '/terrasses-vegetalisees-entreprise/', template: 'service', parent: 'p18', name: 'Terrasses végétalisées', outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: 'aménagement et entretien de terrasses végétalisées pour entreprises et hôtels', areaServed: [PACA] } },
  // Breadcrumb per its JSON-LD spec is « Accueil › Ruches en entreprise » (no parent).
  { id: 'p19', file: '19-ruches.md', slug: '/ruches-entreprise/', template: 'service', name: 'Ruches en entreprise', outdoor: true, zone: 'marseille', sd: { type: 'Service', serviceType: 'parrainage de ruches en entreprise', areaServed: [PACA] } },
  { id: 'pblog', file: null, slug: '/blog/', template: 'blog', name: 'Blog', sd: { type: 'CollectionPage' } },
  { id: 'p90', file: '90-mentions-legales.md', slug: '/mentions-legales/', template: 'legal', name: 'Mentions légales', sd: { type: 'WebPage' } },
  { id: 'p91', file: '91-confidentialite.md', slug: '/politique-de-confidentialite/', template: 'legal', name: 'Politique de confidentialité', sd: { type: 'WebPage' } },
  { id: 'p92', file: '92-cookies.md', slug: '/cookies/', template: 'legal', name: 'Cookies', sd: { type: 'WebPage' }, noindex: true },
  { id: 'p404', file: '93-404.md', slug: '/404/', template: 'notFound', name: 'Page introuvable', sd: { type: 'WebPage' }, noindex: true },
];
const BY = Object.fromEntries(PAGES.map((p) => [p.id, p]));
const NAME = Object.fromEntries(PAGES.map((p) => [p.slug, p.name]));

// Images (see content/media/manifest.json, produced by scripts/optimize-images.mjs)
const img = (name, alt = '') => {
  const m = MEDIA[name];
  if (!m) throw new Error(`Unknown image ${name}`);
  return { src: `/img/${name}`, alt, width: m.width, height: m.height };
};
const HERO_IMG = { p01: 'hero-equipe', p02: 'banner-paysagisme', p03: 'plante-grasse', p04: 'entretien-plantes', p05: 'mur-vegetal', p06: 'cadre-vegetal', p07: 'bouquet-fleurs', p08: 'banner-evenementiel', p09: 'sapin-de-noel', p10: 'paris-bureaux', p11: 'nice-hotel', p12: 'banner-espaces-verts', p13: 'banner-paysagisme', p14: 'hero-cover', p15: 'banner-contact', p16: 'hero-cover', p18: 'banner-espaces-verts', p18a: 'equipe-espaces-verts', p18b: 'amenagement', p18c: 'elagage', p18d: 'terrasse', p19: 'entretien-exterieur', pblog: 'alocasia' };
const CARD_IMG = { '/location-plantes-bureau/': 'plante-grasse', '/entretien-plantes-entreprise/': 'entretien-plantes', '/mur-vegetal-interieur/': 'mur-vegetal', '/cadres-vegetaux-plantes-stabilisees/': 'cadre-vegetal', '/abonnement-fleurs-entreprise/': 'bouquet-fleurs', '/location-plantes-evenementiel/': 'banner-evenementiel', '/fleurs-sapins-noel/': 'sapin-de-noel', '/espaces-verts-entreprise/': 'entretien-exterieur', '/entretien-espaces-verts-copropriete/': 'equipe-espaces-verts', '/creation-amenagement-espaces-verts/': 'amenagement', '/elagage-entreprise-marseille-aix/': 'elagage', '/terrasses-vegetalisees-entreprise/': 'terrasse', '/ruches-entreprise/': 'entretien-exterieur', '/location-entretien-plantes-bureau-paris/': 'paris-bureaux', '/entretien-location-plantes-nice/': 'nice-hotel', '/entretien-location-plantes-marseille/': 'banner-espaces-verts', '/vegetalisation-bureaux-multisites-paris-paca/': 'banner-paysagisme' };
const INPOOL = ['alocasia', 'plante-grasse', 'entretien-plantes', 'mur-vegetal', 'banner-paysagisme', 'bouquet-fleurs', 'cadre-vegetal'];
const OUTPOOL = ['amenagement', 'arrosage-automatique', 'entretien-exterieur', 'terrasse', 'banner-espaces-verts', 'elagage', 'equipe-espaces-verts'];
let pool = INPOOL, pix = 0;
const nextPic = () => img(pool[pix++ % pool.length]);

// ---------------------------------------------------------------------------
// Portable Text helpers
// ---------------------------------------------------------------------------
let keySeq = 0;
const key = () => createHash('sha1').update(String(++keySeq)).digest('hex').slice(0, 12);

/** Inline markdown → Portable Text children + markDefs. */
function inline(src, marks = [], defs = []) {
  const children = [];
  const RX = [
    ['pending', /\{\{A_FOURNIR\s*:?\s*([\s\S]*?)\}\}/],
    ['zone', /\{\{zone\}\}/],
    ['arrow', /→\s*((?:`\/[^`]*`(?:\s*(?:et|,)\s*)?)+)/],
    ['link', /\[([^\]]+)\]\(([^)]*)\)/],
    ['slug', /`(\/[^`]*)`/],
    ['bold', /\*\*(.+?)\*\*/],
  ];
  const span = (text, m = marks) => text && children.push({ _type: 'span', _key: key(), text, marks: [...m] });
  let rest = src;
  while (rest) {
    let best = null;
    for (const [kind, re] of RX) {
      const m = re.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { kind, m };
    }
    if (!best) { span(rest); break; }
    span(rest.slice(0, best.m.index));
    const { kind, m } = best;
    const linkTo = (href, label) => {
      const d = { _type: 'link', _key: key(), href };
      defs.push(d);
      children.push(...inline(label, [...marks, d._key], defs).children);
    };
    if (kind === 'pending') children.push({ _type: 'pending', _key: key(), note: m[1].trim() });
    else if (kind === 'zone') children.push({ _type: 'variable', _key: key(), name: 'zone' });
    else if (kind === 'arrow') {
      span('→ ');
      const hrefs = [...m[1].matchAll(/`(\/[^`]*)`/g)].map((x) => x[1]);
      hrefs.forEach((h, i) => { if (i) span(' · '); linkTo(h, NAME[h] || h); });
    } else if (kind === 'link') {
      if (m[2] === '#') {
        const d = { _type: 'action', _key: key(), action: 'manageCookies' };
        defs.push(d);
        span(m[1], [...marks, d._key]);
      } else linkTo(m[2], m[1]);
    } else if (kind === 'slug') linkTo(m[1], NAME[m[1]] || m[1]);
    else if (kind === 'bold') children.push(...inline(m[1], [...marks, 'strong'], defs).children);
    rest = rest.slice(m.index + m[0].length);
  }
  return { children, defs };
}
const block = (text, extra = {}) => {
  const defs = [];
  const { children } = inline(text, [], defs);
  return { _type: 'block', _key: key(), style: 'normal', markDefs: defs, children, ...extra };
};
const rich = (...texts) => texts.flat().filter((t) => t && t.trim()).map((t) => block(t));
const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

// ---------------------------------------------------------------------------
// Markdown parsing (same rules as the design generator)
// ---------------------------------------------------------------------------
const stripTitle = (t) => t.replace(/^(Section|Bloc(?: \d+)?)\s*:\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
function parseFile(t) {
  const secs = [];
  let cur = { raw: '_top', lines: [] };
  for (const l of t.split('\n')) {
    if (l.startsWith('## ')) { secs.push(cur); cur = { raw: l.slice(3).trim(), lines: [] }; } else cur.lines.push(l);
  }
  secs.push(cur);
  secs.forEach((s) => (s.title = stripTitle(s.raw)));
  return secs;
}
function blocks(lines) {
  const out = [];
  let para = null;
  const flush = () => { if (para) { out.push({ t: 'p', text: para.join(' ') }); para = null; } };
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (!l.trim()) { flush(); continue; }
    if (l.startsWith('>')) { flush(); continue; } // editorial notes
    if (/^\*\*CTA/.test(l)) { flush(); out.push({ t: 'cta', text: l }); continue; }
    if (/^### /.test(l)) { flush(); out.push({ t: 'h3', text: l.slice(4).replace(/\s*\(H3\)\s*$/, '') }); continue; }
    if (/^\|/.test(l)) {
      flush();
      const last = out[out.length - 1];
      const cells = l.split('|').slice(1, -1).map((c) => c.trim());
      if (/^-+$/.test(cells[0].replace(/:/g, ''))) continue;
      if (last && last.t === 'table') last.rows.push(cells); else out.push({ t: 'table', rows: [cells] });
      continue;
    }
    let m;
    if ((m = l.match(/^- (.*)$/))) { flush(); const last = out[out.length - 1]; if (last && last.t === 'ul') last.items.push(m[1]); else out.push({ t: 'ul', items: [m[1]] }); continue; }
    if ((m = l.match(/^\d+\. (.*)$/))) { flush(); const last = out[out.length - 1]; if (last && last.t === 'ol') last.items.push(m[1]); else out.push({ t: 'ol', items: [m[1]] }); continue; }
    if (!para) para = [];
    para.push(l.trim());
  }
  flush();
  return out;
}
/** Generic blocks → Portable Text (paragraphs, h3, bullet lists). */
function toRich(bl) {
  const out = [];
  for (const b of bl) {
    if (b.t === 'p') out.push(block(b.text));
    else if (b.t === 'h3') out.push(block(b.text, { style: 'h3' }));
    else if (b.t === 'ul' || b.t === 'ol') b.items.forEach((it) => out.push(block(it, { listItem: b.t === 'ul' ? 'bullet' : 'number', level: 1 })));
  }
  return out;
}
function leadSplit(item) {
  const m = item.match(/^\*\*(.+?)\*\*\s*(?::\s*)?([\s\S]*)$/);
  return m ? { lead: m[1], text: m[2] } : { lead: null, text: item };
}
function leadItem(item) {
  const { lead, text } = leadSplit(item);
  if (!lead) return { _key: key(), text: rich(text) };
  const lm = lead.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
  return { _key: key(), lead: lm ? lm[1] : lead, ...(lm ? { href: lm[2] } : {}), text: rich(text) };
}
function faqItems(lines) {
  const items = [];
  let cur = null;
  for (const l of lines) {
    const m = l.trim().match(/^\*\*(.+\?)\*\*$/);
    if (m) { cur = { q: m[1], a: [] }; items.push(cur); continue; }
    if (/^\*\*CTA/.test(l.trim())) { cur = null; continue; }
    if (cur && l.trim()) cur.a.push(l.trim());
  }
  return items.map((f) => ({ _key: key(), question: f.q, answer: rich(f.a) }));
}
function cardFromBullet(item) {
  const slugs = [...item.matchAll(/`(\/[^`]*)`/g)].map((m) => m[1]);
  const body = item.replace(/\s*→\s*(`[^`]*`(\s*et\s*)?)+\s*$/, '');
  const ls = leadSplit(body);
  let title = ls.lead || body;
  const lm = title.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
  const href = slugs[0] || (lm && lm[2]);
  if (lm) title = lm[1];
  const card = { _key: key(), title, href };
  if (ls.text) card.text = rich(ls.text);
  if (slugs.length > 1) card.links = slugs.map((s) => ({ _key: key(), label: NAME[s], href: s }));
  if (CARD_IMG[href]) card.image = img(CARD_IMG[href]);
  return card;
}

// ---------------------------------------------------------------------------
// Section mapping
// ---------------------------------------------------------------------------
const HIDDEN_RE = /^(Réalisations|Références|Référence|Ils nous font confiance|Notre histoire|L'équipe|Chiffres clés)/;
const SKIP_RE = /^(_top|Metadata|H1|Maillage interne|JSON-LD|Données à fournir|À valider|Note de rédaction|Formulaire|Message de confirmation|Messages d'erreur|Contenu$|Réponse directe|Sous-titre|Intro)/;
const ARG_RE = /^(Pourquoi Flora Concept|Pourquoi choisir le stabilisé|Pour les syndics et les gestionnaires|Notre façon de travailler|Nos engagements|Notre engagement électrique)/;
const SURF_TXT_RE = /^(Débroussaillage et obligation|Qui intervient à Paris)/;

function buildSections(page, secs) {
  const out = [];
  for (const s of secs) {
    if (SKIP_RE.test(s.raw)) continue;
    const t = s.title;
    const bl = blocks(s.lines);
    const base = { _key: key(), title: t };
    if (HIDDEN_RE.test(t)) {
      if (/confiance/.test(t)) out.push({ ...base, _type: 'sectionLogos', logos: [] });
      else if (/équipe/.test(t)) out.push({ ...base, _type: 'sectionTeam', members: [] });
      else if (/Chiffres/.test(t)) out.push({ ...base, _type: 'sectionFigures', figures: [] });
      else if (/histoire/.test(t)) out.push({ ...base, _type: 'sectionTimeline', milestones: [] });
      else out.push({ ...base, _type: 'sectionCaseStudies', cases: [] });
      continue;
    }
    if (/^FAQ/.test(s.raw)) { out.push({ ...base, title: 'Questions fréquentes', _type: 'sectionFaq', tone: 'surface', items: faqItems(s.lines) }); continue; }
    if (page.template === 'home') {
      if (/^Entrées par profil/.test(s.raw)) {
        const tags = ['Location de plantes', "Paysagisme d'intérieur", 'Multi-sites'];
        const fallback = ['plante-grasse', 'alocasia', 'equipe-espaces-verts'];
        out.push({
          _key: key(), _type: 'sectionProfiles', tone: 'dark',
          items: bl[0].items.map((x, i) => {
            const href = (x.match(/`(\/[^`]*)`/) || [])[1];
            const ls = leadSplit(x.replace(/\s*→\s*`[^`]*`\s*$/, ''));
            return { _key: key(), title: ls.lead, text: rich(ls.text), href, tag: tags[i], image: img(CARD_IMG[href] || fallback[i]) };
          }),
        });
        continue;
      }
      if (/^Nos services/.test(t)) {
        const cards = bl[0].items.map(cardFromBullet);
        cards.push({ _key: key(), title: "Espaces verts d'entreprise", href: '/espaces-verts-entreprise/', badge: 'PACA', image: img(CARD_IMG['/espaces-verts-entreprise/']) });
        cards.push({ _key: key(), title: 'Ruches en entreprise', href: '/ruches-entreprise/', badge: 'PACA' });
        out.push({ ...base, _type: 'sectionCards', tone: 'dark', cards });
        continue;
      }
      if (/^Nos zones/.test(t)) {
        const regions = bl[0].items.filter((x) => !/Notre base/.test(x)).map((x) => {
          const ls = leadSplit(x);
          const idf = /Île/.test(ls.lead);
          const slugs = [...x.matchAll(/`(\/[^`]*)`/g)].map((m) => m[1]);
          return {
            _key: key(), title: ls.lead, tag: idf ? "Paysagisme d'intérieur" : 'Intérieur et extérieur',
            cities: ls.text.replace(/\s*→[\s\S]*$/, '').replace(/\.$/, '').split(/,\s*/),
            links: slugs.map((h) => ({ _key: key(), label: NAME[h], href: h })),
            ...(idf ? {} : { image: img('banner-espaces-verts') }),
          };
        });
        out.push({ ...base, _type: 'sectionRegions', tone: 'dark', regions });
        continue;
      }
    }
    if (/^(Ce que recouvre|Nos prestations extérieur)/.test(t)) {
      const ul = bl.find((b) => b.t === 'ul');
      const paras = bl.filter((b) => b.t === 'p' && !/^Quatre cartes/.test(b.text));
      const before = paras.length && bl.indexOf(paras[0]) < bl.indexOf(ul) ? paras[0] : null;
      out.push({
        ...base, _type: 'sectionCards', tone: 'dark',
        ...(before ? { intro: rich(before.text) } : {}),
        cards: ul.items.map(cardFromBullet),
        outro: rich(paras.filter((p) => p !== before).map((p) => p.text)),
      });
      continue;
    }
    const tbl = bl.find((b) => b.t === 'table');
    const ol = bl.find((b) => b.t === 'ol');
    const ul = bl.find((b) => b.t === 'ul');
    if (ARG_RE.test(t)) {
      if (ul) {
        let items = ul.items;
        // Editorial annotations inside the list are instructions, not copy.
        if (/engagements/.test(t)) {
          items = items.map((x) => x
            .replace(/\s*\(confirmé par le client[^)]*\)/, '')
            .replace(/\.\s*Bénéfice client à mettre en avant\s*:[^.]*\.?/, '.')
            .replace(/\.\s*Lien vers `(\/[^`]*)`\.?/, (_, h) => `. [En savoir plus](${h})`));
        }
        out.push({ ...base, _type: 'sectionArguments', tone: 'surface', items: items.map(leadItem), note: toRich(bl.filter((b) => b !== ul)), image: nextPic() });
      } else {
        const ps = bl.filter((b) => b.t === 'p');
        const first = ps.length ? ps[0].text : '';
        const m = first.match(/^([^:]{10,120}?)\s*:\s*([^.]+)\.\s*([\s\S]*)$/);
        out.push({
          ...base, _type: 'sectionFeature', tone: 'dark',
          ...(m ? { quote: m[1], pills: m[2].split(/,\s*/) } : {}),
          body: rich(m ? [m[3], ...ps.slice(1).map((p) => p.text)] : ps.map((p) => p.text)),
          image: nextPic(),
        });
      }
      continue;
    }
    if (tbl) {
      const i = bl.indexOf(tbl);
      const [head, ...rows] = tbl.rows;
      out.push({
        ...base, _type: 'sectionTable',
        intro: toRich(bl.slice(0, i)),
        head,
        rows: rows.map((r) => ({ _key: key(), cells: r.map((c) => rich(c)) })),
        note: toRich(bl.slice(i + 1)),
        ...(/Naturel ou stabilisé/.test(t) ? { photos: [img('mur-vegetal'), img('cadre-stabilise')] } : {}),
      });
      continue;
    }
    if (ol) {
      const vertical = ol.items.length > 4 || /^Comment nous couvrons/.test(t);
      out.push({
        ...base, _type: 'sectionSteps', layout: vertical ? 'vertical' : 'horizontal',
        intro: toRich(bl.filter((b) => b !== ol)),
        steps: ol.items.map(leadItem),
        ...(vertical ? { image: nextPic() } : {}),
      });
      continue;
    }
    if (bl.some((b) => b.t === 'h3')) {
      const intro = [], groups = [];
      let cur = null;
      for (const b of bl) {
        if (b.t === 'h3') { cur = { _key: key(), title: b.text, bl: [] }; groups.push(cur); } else if (cur) cur.bl.push(b); else intro.push(b);
      }
      out.push({ ...base, _type: 'sectionGroups', intro: toRich(intro), groups: groups.map((g) => ({ _key: g._key, title: g.title, body: toRich(g.bl) })), image: nextPic() });
      continue;
    }
    const special = SURF_TXT_RE.test(t) || /^Le rucher du Luberon/.test(t);
    if (ul && !bl.some((b) => b.t === 'p' && bl.indexOf(b) < bl.indexOf(ul))) {
      out.push({ ...base, _type: 'sectionChecklist', items: ul.items.map(leadItem), note: toRich(bl.filter((b) => b !== ul)), image: nextPic() });
      continue;
    }
    if (ul && ul.items.length >= 3 && ul.items.every((x) => leadSplit(x).lead) && !special) {
      const i = bl.indexOf(ul);
      out.push({ ...base, _type: 'sectionChecklist', intro: toRich(bl.slice(0, i)), items: ul.items.map(leadItem), note: toRich(bl.slice(i + 1)), image: nextPic() });
      continue;
    }
    // S21 text
    if (/^Qui intervient à Paris/.test(t)) out.push({ ...base, _type: 'sectionText', variant: 'highlight', tone: 'surface', body: toRich(bl), image: img('paris-bureaux') });
    else if (/^Le rucher du Luberon/.test(t)) out.push({ ...base, _type: 'sectionText', variant: 'wide', body: toRich(bl), image: img('entretien-exterieur') });
    else out.push({ ...base, _type: 'sectionText', variant: 'split', ...(SURF_TXT_RE.test(t) ? { tone: 'surface' } : {}), body: toRich(bl), image: nextPic() });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Page builders
// ---------------------------------------------------------------------------
const sec = (secs, re) => secs.find((s) => re.test(s.raw));
const paras = (s) => (s ? blocks(s.lines).filter((b) => b.t === 'p').map((b) => b.text) : []);
const h1Of = (secs) => sec(secs, /^H1$/).lines.map((l) => l.trim()).find((l) => l && !l.startsWith('**'));
function metaOf(secs, top) {
  const s = sec(secs, /^Metadata/);
  const pick = (re) => {
    const l = s && s.lines.find((x) => re.test(x));
    return l ? l.replace(/^.*?\*\*[^*]+\*\*\s*:\s*/, '').replace(/\s*\(\d+ car\.\)\s*$/, '').trim() : null;
  };
  let title = pick(/\*\*Title\*\*/);
  let description = pick(/\*\*Meta description\*\*/);
  if (!title) {
    // Legal pages: « - **Metadata** : Title « … » · meta robots … »
    const l = top.lines.find((x) => /\*\*Metadata\*\*/.test(x));
    const m = l && l.match(/Title «\s*(.+?)\s*»/);
    if (m) title = m[1];
  }
  return { title, description };
}

function basePage(p, secs) {
  const meta = secs ? metaOf(secs, secs[0]) : {};
  const parent = p.parent ? { slug: BY[p.parent].slug, name: BY[p.parent].name } : undefined;
  const page = {
    _id: `page-${p.id}`,
    slug: p.slug,
    template: p.template,
    name: p.name,
    ...(parent ? { parent } : {}),
    seo: { title: meta.title || `${p.name} | Flora Concept`, description: meta.description || '', ...(p.noindex ? { noindex: true } : {}) },
    h1: secs ? h1Of(secs) : p.name,
    answer: [],
    zone: p.zone || '',
    ...(p.outdoor ? { outdoor: true } : {}),
    structuredData: p.sd,
    sections: [],
  };
  if (HERO_IMG[p.id]) page.heroImage = img(HERO_IMG[p.id], p.id === 'p01' ? "L'équipe Flora Concept" : p.name);
  return page;
}

const IN_MENU = ['/location-plantes-bureau/', '/entretien-plantes-entreprise/', '/mur-vegetal-interieur/', '/cadres-vegetaux-plantes-stabilisees/', '/abonnement-fleurs-entreprise/', '/location-plantes-evenementiel/', '/fleurs-sapins-noel/'];
const OUT_MENU = ['/entretien-espaces-verts-copropriete/', '/creation-amenagement-espaces-verts/', '/elagage-entreprise-marseille-aix/', '/terrasses-vegetalisees-entreprise/', '/ruches-entreprise/'];

async function buildPage(p) {
  if (p.template === 'blog') {
    const page = basePage(p, null);
    page.seo.title = 'Blog | Flora Concept';
    // The blog index H1/intro copy is still to be delivered.
    page.answer = rich('{{A_FOURNIR : H1 et introduction de la page Blog}}');
    return page;
  }
  const md = await readContent(p.file);
  const secs = parseFile(md);
  pool = (p.outdoor ? OUTPOOL : INPOOL).filter((x) => x !== HERO_IMG[p.id]);
  pix = 0;
  const page = basePage(p, secs);

  if (p.template === 'legal' || p.template === 'notFound') {
    const bl = blocks(sec(secs, /^Contenu/).lines);
    if (p.template === 'notFound') {
      page.answer = toRich(bl.filter((b) => b.t !== 'cta'));
      return page;
    }
    const parts = [];
    let cur = { _key: key(), bl: [] };
    parts.push(cur);
    for (const b of bl) {
      if (b.t === 'h3') { cur = { _key: key(), heading: b.text, bl: [] }; parts.push(cur); } else cur.bl.push(b);
    }
    page.sections.push({
      _key: key(), _type: 'sectionLegal', tone: 'dark', showConsentButton: p.id === 'p92',
      parts: parts.filter((x) => x.heading || x.bl.length).map((x) => {
        const tb = x.bl.find((b) => b.t === 'table');
        return {
          _key: x._key, ...(x.heading ? { heading: x.heading } : {}),
          body: toRich(x.bl.filter((b) => b !== tb)),
          ...(tb ? { table: { head: tb.rows[0], rows: tb.rows.slice(1).map((r) => ({ _key: key(), cells: r.map((c) => rich(c)) })) } } : {}),
        };
      }),
    });
    return page;
  }

  if (p.template === 'faq') {
    page.answer = rich(paras(sec(secs, /^Intro/)));
    secs.filter((s) => /^Bloc \d/.test(s.raw)).forEach((s, i) => {
      page.sections.push({ _key: key(), _type: 'sectionFaq', title: s.title, anchor: `bloc-${i + 1}`, tone: i % 2 ? 'dark' : 'surface', items: faqItems(s.lines) });
    });
    return page;
  }

  if (p.template === 'quote') {
    page.answer = rich(paras(sec(secs, /^Intro/)));
    const form = sec(secs, /^Formulaire/);
    const reass = form.lines.find((l) => /ligne de rassurance/.test(l)).replace(/^.*?:\s*«\s*/, '').replace(/\s*»\s*$/, '');
    const ph = form.lines.find((l) => /placeholder/.test(l)).match(/«\s*(.+?)\s*»/)[1];
    const rgpdIdx = form.lines.findIndex((l) => /Mention RGPD/.test(l));
    const rgpd = form.lines.slice(rgpdIdx + 1).map((l) => l.trim()).filter(Boolean).join(' ');
    const conf = sec(secs, /^Message de confirmation/).lines.map((l) => l.trim()).filter(Boolean);
    const errs = Object.fromEntries(sec(secs, /^Messages d'erreur/).lines.filter((l) => /«/.test(l)).map((l) => [l.replace(/^- /, '').split(' :')[0], l.match(/«\s*(.+?)\s*»/)[1]]));
    const call = sec(secs, /^Bloc : Appeler/);
    const callUl = blocks(call.lines).find((b) => b.t === 'ul');
    const next = sec(secs, /^Bloc : Ce qui se passe/);
    page.sections.push({
      _key: key(), _type: 'sectionQuoteForm', tone: 'dark',
      placeholder: ph,
      reassurance: rich(reass),
      privacy: rich(rgpd),
      confirmation: { title: conf[0].replace(/^\*\*|\*\*$/g, ''), body: rich(conf.slice(1).join(' ')) },
      errors: { nom: errs['Nom vide'], contact: errs['Contact vide ou invalide'], besoin: errs['Besoin vide'], server: errs['Erreur serveur'], rateLimit: errs['Rate limit'] },
      phoneTitle: stripTitle(call.raw).replace(/^Bloc : /, ''),
      phoneImage: img('hero-equipe'),
      phones: callUl.items.map((it, i) => {
        const ls = leadSplit(it);
        return { _key: key(), label: ls.lead, detail: rich(ls.text), zone: i === 0 ? 'marseille' : 'paris' };
      }),
    });
    page.sections.push({ _key: key(), _type: 'sectionSteps', tone: 'surface', title: next.title.replace(/^Bloc : /, ''), layout: 'horizontal', steps: blocks(next.lines).find((b) => b.t === 'ol').items.map(leadItem) });
    return page;
  }

  if (p.template === 'home') {
    const sub = sec(secs, /^Sous-titre/);
    page.answer = rich(paras(sub).filter((x) => !/^\*\*/.test(x)));
    const micro = sub.lines.find((l) => /Micro-preuve/.test(l)).replace(/^.*?\)\s*:\s*/, '');
    page.microProof = rich(micro);
  } else {
    page.answer = rich(paras(sec(secs, /^Réponse directe/)));
    page.answerImage = nextPic();
  }
  page.sections = buildSections(p, secs);
  if (p.template === 'about') page.finalCta = 'Envie de travailler avec nous ?';

  if (p.template === 'service' || p.template === 'city') {
    const outdoor = !!p.outdoor;
    const hub = outdoor ? BY.p18 : BY.p02;
    const siblings = (outdoor ? OUT_MENU : IN_MENU).filter((h) => h !== p.slug).slice(0, 3);
    page.related = {
      hub: { slug: hub.slug, name: hub.name },
      items: siblings.map((h) => ({ _key: key(), title: NAME[h], href: h, ...(outdoor ? { badge: 'PACA' } : {}), image: img(CARD_IMG[h]) })),
    };
  }
  return page;
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------
async function buildSettings() {
  const readme = await readFile(join(DIR, 'README.md'), 'utf8');
  const entity = readme.match(/> (Flora Concept est un spécialiste[^\n]+)/)[1];
  const link = (href, label, extra = {}) => ({ href, label, ...extra });
  const sub = (h) => ({ sub: NAME[h], image: img(CARD_IMG[h]) });
  return {
    _id: 'siteSettings',
    siteUrl: 'https://www.floraconcept.fr',
    siteName: 'Flora Concept',
    entitySentence: entity,
    legal: { siren: '423977305', foundingDate: '1999', legalName: 'Flora Concept' },
    // Address published on floraconcept.com; to be confirmed by the client (« adresse exacte »).
    address: { streetAddress: "1118 Rte. d'Aubagne", postalCode: '13420', locality: 'Gémenos', region: PACA, country: 'FR' },
    // Number used by the approved design; to be confirmed by the client (« téléphone »).
    phones: { default: { display: '04 13 12 13 80', e164: '+33413121380' } },
    areas: [PACA, IDF],
    sameAs: ['https://www.linkedin.com/company/flora-concept', 'https://www.facebook.com/FloraConceptFR', 'https://www.instagram.com/flora_concept_france/'],
    socials: [
      link('https://www.facebook.com/FloraConceptFR', 'Facebook'),
      link('https://www.instagram.com/flora_concept_france/', 'Instagram'),
      link('https://www.linkedin.com/company/flora-concept', 'LinkedIn'),
    ],
    logo: img('flora-logo', 'Flora Concept'),
    nav: {
      groups: [
        {
          key: 'services', label: 'Services', caption: 'PACA et Île-de-France',
          hub: link('/paysagisme-interieur/', "Paysagisme d'intérieur"),
          items: [['Location de plantes', 0], ['Entretien', 1], ['Murs végétaux', 2], ['Cadres stabilisés', 3], ['Fleurs', 4], ['Événementiel', 5], ['Noël', 6]].map(([l, i]) => link(IN_MENU[i], l, sub(IN_MENU[i]))),
        },
        {
          key: 'outdoor', label: 'Extérieur PACA', caption: "Provence-Alpes-Côte d'Azur uniquement",
          hub: link('/espaces-verts-entreprise/', "Espaces verts d'entreprise"),
          items: [['/espaces-verts-entreprise/', 'Espaces verts'], ['/entretien-espaces-verts-copropriete/', 'Copropriétés'], ['/creation-amenagement-espaces-verts/', 'Création'], ['/elagage-entreprise-marseille-aix/', 'Élagage'], ['/terrasses-vegetalisees-entreprise/', 'Terrasses'], ['/ruches-entreprise/', 'Ruches']].map(([h, l]) => link(h, l, sub(h))),
        },
        {
          key: 'villes', label: 'Nos villes', caption: 'Des équipes locales',
          items: [['/location-entretien-plantes-bureau-paris/', 'Paris'], ['/entretien-location-plantes-nice/', 'Nice'], ['/entretien-location-plantes-marseille/', 'Marseille']].map(([h, l]) => link(h, l, sub(h))),
        },
      ],
      links: [link('/vegetalisation-bureaux-multisites-paris-paca/', 'Multi-sites'), link('/blog/', 'Blog'), link('/faq/', 'FAQ')],
    },
    footer: {
      columns: [
        { title: 'Services', links: IN_MENU.map((h) => link(h, NAME[h])) },
        { title: 'Extérieur PACA', links: ['/espaces-verts-entreprise/', ...OUT_MENU].map((h) => link(h, NAME[h])) },
        { title: 'Nos villes', links: ['/location-entretien-plantes-bureau-paris/', '/entretien-location-plantes-nice/', '/entretien-location-plantes-marseille/'].map((h) => link(h, NAME[h])) },
        { title: 'Flora Concept', links: [link('/qui-sommes-nous/', 'Qui sommes-nous'), link('/faq/', 'FAQ'), link('/blog/', 'Blog'), link('/devis/', 'Devis')] },
      ],
      legal: [link('/mentions-legales/', 'Mentions légales'), link('/politique-de-confidentialite/', 'Politique de confidentialité'), link('/cookies/', 'Cookies')],
      regionsLine: "Provence-Alpes-Côte d'Azur · Île-de-France",
    },
    seasonal: { enabled: true, text: 'Sapins et décorations de Noël : réservez tôt', href: '/fleurs-sapins-noel/', fromMonth: 10, toMonth: 12 },
    marquee: ['Espaces verts', 'Paysagisme d’intérieur', 'Événementiel', 'Cadres végétaux', 'Marseille', 'Nice'],
    analytics: { gtmId: '' },
    quoteEndpoint: '/api/devis.php',
  };
}

// ---------------------------------------------------------------------------
await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'pages'), { recursive: true });
await mkdir(join(OUT, 'posts'), { recursive: true });
for (const p of PAGES) {
  const page = await buildPage(p);
  await writeFile(join(OUT, 'pages', `${p.id}.json`), JSON.stringify(page, null, 2) + '\n');
}
await writeFile(join(OUT, 'settings.json'), JSON.stringify(await buildSettings(), null, 2) + '\n');
console.log(`Imported ${PAGES.length} pages into ${OUT}`);
