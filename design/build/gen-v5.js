// Generates "Flora Concept v4.dc.html" from contenu/*.md (verbatim copy)
const DIR = 'uploads/floraconcept-livraison-dev-2026-10-08/contenu/';
const INK = '@@FG@@', MUTED = '@@MU@@', SURF = '@@SF@@', LINE = '@@LN@@', LIME = '#d6e26b';
const U = 'https://www.floraconcept.com/wp-content/uploads/';
const PAGES = [
  ['p01', '01-accueil.md', '/', 'home'],
  ['p02', '02-paysagisme-interieur.md', '/paysagisme-interieur/', 'hub', null, "Paysagisme d'intérieur"],
  ['p03', '03-location-plantes-bureau.md', '/location-plantes-bureau/', 'svc', 'p02', 'Location de plantes'],
  ['p04', '04-entretien-plantes-entreprise.md', '/entretien-plantes-entreprise/', 'svc', 'p02', 'Entretien de plantes'],
  ['p05', '05-mur-vegetal-interieur.md', '/mur-vegetal-interieur/', 'svc', 'p02', 'Murs végétaux'],
  ['p06', '06-cadres-vegetaux-stabilises.md', '/cadres-vegetaux-plantes-stabilisees/', 'svc', 'p02', 'Cadres végétaux stabilisés'],
  ['p07', '07-abonnement-fleurs-entreprise.md', '/abonnement-fleurs-entreprise/', 'svc', 'p02', 'Abonnement fleurs'],
  ['p08', '08-location-plantes-evenementiel.md', '/location-plantes-evenementiel/', 'svc', 'p02', 'Événementiel'],
  ['p09', '09-fleurs-sapins-noel.md', '/fleurs-sapins-noel/', 'svc', 'p02', 'Fleurs et sapins de Noël'],
  ['p10', '10-agence-paris.md', '/location-entretien-plantes-bureau-paris/', 'city', null, 'Paris et Île-de-France'],
  ['p11', '11-agence-nice.md', '/entretien-location-plantes-nice/', 'city', null, "Nice et Côte d'Azur"],
  ['p12', '12-agence-marseille.md', '/entretien-location-plantes-marseille/', 'city', null, 'Marseille et Provence'],
  ['p13', '13-multisites.md', '/vegetalisation-bureaux-multisites-paris-paca/', 'svc', null, 'Multi-sites'],
  ['p14', '14-faq.md', '/faq/', 'faq', null, 'FAQ'],
  ['p15', '15-devis.md', '/devis/', 'devis', null, 'Devis'],
  ['p16', '16-qui-sommes-nous.md', '/qui-sommes-nous/', 'about', null, 'Qui sommes-nous'],
  ['p18', '18-espaces-verts.md', '/espaces-verts-entreprise/', 'hub', null, "Espaces verts d'entreprise", true],
  ['p18a', '18a-espaces-verts-copropriete.md', '/entretien-espaces-verts-copropriete/', 'svc', 'p18', 'Copropriétés et syndics', true],
  ['p18b', '18b-creation-espaces-verts.md', '/creation-amenagement-espaces-verts/', 'svc', 'p18', 'Création et aménagement', true],
  ['p18c', '18c-elagage.md', '/elagage-entreprise-marseille-aix/', 'svc', 'p18', 'Élagage et débroussaillage', true],
  ['p18d', '18d-terrasses-vegetalisees.md', '/terrasses-vegetalisees-entreprise/', 'svc', 'p18', 'Terrasses végétalisées', true],
  ['p19', '19-ruches.md', '/ruches-entreprise/', 'svc', 'p18', 'Ruches en entreprise', true],
  ['pblog', null, '/blog/', 'blog', null, 'Blog'],
  ['p90', '90-mentions-legales.md', '/mentions-legales/', 'legal', null, 'Mentions légales'],
  ['p91', '91-confidentialite.md', '/politique-de-confidentialite/', 'legal', null, 'Politique de confidentialité'],
  ['p92', '92-cookies.md', '/cookies/', 'legal', null, 'Cookies'],
  ['p404', '93-404.md', '/404/', 'e404', null, 'Page introuvable']
].map(([id, file, slug, kind, parent, name, outdoor]) => ({ id, file, slug, kind, parent, name, outdoor: !!outdoor }));
const BY = Object.fromEntries(PAGES.map(p => [p.id, p]));
const NAME = Object.fromEntries(PAGES.map(p => [p.slug, p.name || 'Accueil']));

const HERO_SHOT = { p03: 'plantes de bureau', p04: 'jardinier en intervention', p05: 'mur végétal naturel', p06: 'cadre ou logo stabilisé', p07: "composition florale à l'accueil", p09: 'hall décoré pour Noël', p10: 'site parisien', p11: "hôtel de la Côte d'Azur", p12: 'bureau à Marseille ou Aix', p13: 'site client multi-sites', p18b: 'jardin créé (avant / après)', p18c: 'élagage à la nacelle', p18d: 'terrasse végétalisée', p19: 'rucher du Luberon' };

const WM = n => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(n) + '?width=1600';
const IMG = {
  plantes: U + '2024/07/plante-grasse.jpg', entretien: U + '2024/07/articleplante-verte.jpg', mur: U + '2024/08/vegetaux-mur.jpg', cadre: U + '2024/08/cadre-vegetal.jpg', cadre2: U + '2024/08/cadre.jpg',
  fleurs: U + '2024/08/bouquet-de-fleur.jpg', noel: U + '2024/08/sapin-de-noel.jpg', evt: 'assets/banner-evenementiel.png', ev: U + '2024/07/entretien-flora.jpg', copro: 'assets/equipe-espaces-verts.png',
  creation: U + '2024/08/amenagement.jpg', elagage: U + '2024/10/taille-de-vegetaux.jpg', terrasse: U + '2024/08/terrassement.jpg', ruches: U + '2024/07/entretien-flora.jpg',
  paris: U + '2024/08/2.jpg', nice: U + '2024/08/6.jpg', marseille: 'assets/banner-espaces-verts.png', multi: 'assets/banner-paysagisme.png',
  mur2: U + '2024/08/vegetaux-mur.jpg', arrosage: U + '2024/08/arrosage-automatique.jpg', terrassement: U + '2024/08/terrassement.jpg', alocasia: U + '2024/07/article-alocasia.jpg'
};
const HERO_IMG = { p01: 'assets/hero-equipe.png', p02: 'assets/banner-paysagisme.png', p03: IMG.plantes, p04: IMG.entretien, p05: IMG.mur, p06: IMG.cadre, p07: IMG.fleurs, p08: IMG.evt, p09: IMG.noel, p10: IMG.paris, p11: IMG.nice, p12: IMG.marseille, p13: IMG.multi, p15: 'assets/banner-contact.png', p16: 'assets/hero-cover.png', p18: 'assets/banner-espaces-verts.png', p18a: IMG.copro, p18b: IMG.creation, p18c: IMG.elagage, p18d: IMG.terrasse, p19: IMG.ruches, pblog: IMG.alocasia, p14: 'assets/hero-cover.png' };
const CARD_IMG = { '/location-plantes-bureau/': IMG.plantes, '/entretien-plantes-entreprise/': IMG.entretien, '/mur-vegetal-interieur/': IMG.mur, '/cadres-vegetaux-plantes-stabilisees/': IMG.cadre, '/abonnement-fleurs-entreprise/': IMG.fleurs, '/location-plantes-evenementiel/': IMG.evt, '/fleurs-sapins-noel/': IMG.noel, '/espaces-verts-entreprise/': IMG.ev, '/entretien-espaces-verts-copropriete/': IMG.copro, '/creation-amenagement-espaces-verts/': IMG.creation, '/elagage-entreprise-marseille-aix/': IMG.elagage, '/terrasses-vegetalisees-entreprise/': IMG.terrasse, '/ruches-entreprise/': IMG.ruches, '/location-entretien-plantes-bureau-paris/': IMG.paris, '/entretien-location-plantes-nice/': IMG.nice, '/entretien-location-plantes-marseille/': IMG.marseille, '/vegetalisation-bureaux-multisites-paris-paca/': IMG.multi };
const INPOOL = [IMG.alocasia, IMG.plantes, IMG.entretien, IMG.mur, 'assets/banner-paysagisme.png', IMG.fleurs, IMG.cadre];
const OUTPOOL = [IMG.creation, IMG.arrosage, IMG.ev, IMG.terrassement, 'assets/banner-espaces-verts.png', IMG.elagage, IMG.copro];
let SN = 0, PIX = 0, POOL = INPOOL;
const nextPic = () => POOL[PIX++ % POOL.length];
const numTag = () => `<span style="display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:@@AC@@"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:26px;letter-spacing:0;line-height:1">${String(++SN).padStart(2, '0')}</span><span style="width:36px;height:1px;background:@@AC@@;opacity:.6"></span></span>`;
const LEAFDOT = `<span aria-hidden="true" style="flex-shrink:0;width:40px;height:40px;border-radius:50%;background:#d6e26b;color:#12201a;display:flex;align-items:center;justify-content:center">${'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20C4 11 10 4.5 20 4c.2 9.5-6 15.5-14.5 15.5"></path><path d="M4 20l9.5-9.5"></path><path d="M10 14h4.5M13.5 10.5V7"></path></svg>'}</span>`;
const tall = (src, ratio = '4/5') => `<div data-tall style="position:relative;overflow:hidden;border-radius:28px;aspect-ratio:${ratio};max-height:620px;background:@@PH@@"><img src="${src}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`;
function bento(items, opts = {}) {
  const cardsH = items.map((x, k) => `<div style="display:flex;flex-direction:column;gap:14px;padding:clamp(22px,2.2vw,28px);border-radius:26px;background:${k === 0 ? '@@FB@@' : '@@CARD@@'};color:${k === 0 ? '@@FF@@' : '@@FG@@'};border:1px solid ${k === 0 ? '@@FB@@' : '@@LN@@'};transition:transform .5s cubic-bezier(.16,1,.3,1)" style-hover="transform:translateY(-4px)"><div style="display:flex;align-items:center;justify-content:space-between"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:34px;line-height:1;color:${k === 0 ? '@@FA@@' : '@@AC@@'}">${String(k + 1).padStart(2, '0')}</span>${k === 0 ? LEAFDOT.replace('background:#d6e26b;color:#12201a', 'background:@@FF@@;color:@@FB@@') : LEAFDOT}</div><h3 style="margin:0;${FH};font-weight:500;font-size:${x.html === '' ? 'clamp(18px,1.5vw,21px);line-height:1.3;margin-top:auto' : 'clamp(21px,1.8vw,26px);line-height:1.1'};letter-spacing:-.02em;color:inherit">${x.leadHtml || inl(x.lead)}</h3>${x.html === '' ? '' : `<div style="display:flex;flex-direction:column;gap:10px;font-size:15px;line-height:1.6;color:${k === 0 ? '@@FM@@' : '@@MU@@'}">${x.html || `<p style="margin:0">${inl(x.text)}</p>`}</div>`}</div>`);
  const n = items.length;
  let tallImg = false, cols = 3, cells = n + 1;
  if (opts.noImg) { cells = n; cols = [4, 3, 2].find(c => n % c === 0) || 3; }
  else {
    const opt = [];
    for (const c of [4, 3, 2]) for (const tall of [true, false]) { const cc = n + (tall ? 2 : 1); if (cc % c === 0 && (!tall || cc / c >= 2) && cc / c <= 4) opt.push({ c, tall, cc }); }
    const pick = opt[0] || { c: Math.min(4, n + 1), tall: false, cc: n + 1 };
    if (n + 1 <= 4 && !opt.length) { pick.c = n + 1; }
    tallImg = pick.tall; cols = pick.c; cells = pick.cc;
  }
  const oddTab = (tallImg ? cells : cells) % 2 === 1;
  const imgCell = opts.noImg ? '' : `<div data-bento-img style="${tallImg ? 'grid-row:span 2;' : ''}min-height:280px;position:relative;overflow:hidden;border-radius:26px;background:@@PH@@"><img src="${nextPic()}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>`;
  return `<div data-bento${oddTab ? ' data-bento-odd' : ''} style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-auto-flow:dense;gap:clamp(12px,1.4vw,18px)">${imgCell}${cardsH.join('')}</div>`;
}
const PHOTO_BY_LABEL = { 'mur végétal naturel': IMG.mur, 'mur végétal stabilisé': IMG.cadre2, 'équipe parisienne': IMG.paris, 'rucher du Luberon (pleine largeur)': IMG.ruches, "Cloisons végétales et plantes d'open space": IMG.alocasia };

const ZONE = { p10: 'paris', p11: 'nice', p12: 'marseille', p18: 'marseille', p18a: 'marseille', p18b: 'marseille', p18c: 'marseille', p18d: 'marseille', p19: 'marseille' };

// ---------- style atoms ----------
const V3 = await readFile('Flora Concept v3.dc.html');
const V3X = V3.slice(V3.indexOf('<x-dc>'));
const _mi = V3X.indexOf('data-marquee'); const _ms = V3X.lastIndexOf('<div style="background:#d6e26b', _mi);
const MARQUEE = V3X.slice(_ms, V3X.indexOf('</span></div></div>', _mi) + 19);
const _di = V3X.indexOf('<svg data-draw viewBox="0 0 320 600"'); const DRAW = V3X.slice(_di, V3X.indexOf('</svg>', _di) + 6);
const DRAW_BANNER = DRAW.replace(/style="[^"]*"/, 'style="position:absolute;pointer-events:none;right:clamp(10px,4vw,60px);bottom:0;height:92%;width:auto;opacity:.5;transform-origin:10% 100%"');
const FH = "font-family:'Bricolage Grotesque',sans-serif";
const WRAP = 'max-width:1360px;margin:0 auto;padding:0 clamp(20px,4vw,56px)';
const EMS = c => `font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-.02em;color:${c}`;
const H1S = `margin:0;${FH};font-weight:500;font-size:clamp(36px,4.6vw,72px);line-height:.98;letter-spacing:-.045em;color:#f1ece1;text-wrap:balance`;
const H2S = `margin:0;${FH};font-weight:500;font-size:clamp(30px,3.4vw,52px);line-height:1.02;letter-spacing:-.04em;color:${INK};text-wrap:balance`;
const H3S = `margin:0;${FH};font-weight:500;font-size:21px;line-height:1.25;letter-spacing:-.01em;color:${INK};text-wrap:balance`;
const PS = `margin:0;font-size:17px;line-height:1.65;color:${INK};max-width:68ch;text-wrap:pretty`;
const SMALL = `font-size:14px;line-height:1.5;color:${MUTED}`;
const EYEBROW = `font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:@@AC@@`;
const LEAF = '<svg data-ico width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;transform-origin:20% 80%"><path d="M4 20C4 11 10 4.5 20 4c.2 9.5-6 15.5-14.5 15.5"></path><path d="M4 20l9.5-9.5"></path><path d="M10 14h4.5M13.5 10.5V7"></path></svg>';
const BTN1 = `display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:52px;padding:0 26px;border-radius:999px;background:${LIME};color:#12201a;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border:0;cursor:pointer;transition:background .3s,color .3s,transform .3s`;
const BTN1H = `background:@@FG@@;color:@@BG@@;transform:scale(1.04)`;
const BTN2 = `display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;background:transparent;color:@@FG@@;border:1px solid @@FG@@;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:background .3s,color .3s`;
const BTN2H = `background:@@FG@@;color:@@BG@@`;
const THEMES = {
  dark: { FB: '#d6e26b', FF: '#12201a', FA: '#12201a', FM: 'rgba(18,32,26,.78)', FG: '#f1ece1', MU: 'rgba(241,236,225,.74)', LN: 'rgba(241,236,225,.15)', SF: 'rgba(241,236,225,.07)', CARD: 'rgba(241,236,225,.05)', AC: '#d6e26b', BG: '#12201a', PH: 'rgba(241,236,225,.08)' },
  cream: { FB: '#12201a', FF: '#f1ece1', FA: '#d6e26b', FM: 'rgba(241,236,225,.78)', FG: '#12201a', MU: '#3f4f45', LN: 'rgba(18,32,26,.16)', SF: 'rgba(18,32,26,.05)', CARD: '#faf7f0', AC: '#3d5a40', BG: '#f1ece1', PH: '#e3dccb' }
};
const theme = (h, m) => h.replace(/@@(FB|FF|FA|FM|FG|MU|LN|SF|CARD|AC|BG|PH)@@/g, (_, k) => THEMES[m][k]);
const SEC = (bg, inner, extra = '', id = '') => bg === SURF
  ? `<section${id ? ` id="${id}"` : ''} style="position:relative;overflow:clip;background:#f1ece1;color:#12201a;border-radius:clamp(28px,3.5vw,56px);margin:clamp(8px,1vw,16px);padding:clamp(48px,6vw,88px) 0"><div style="${WRAP}">${theme(inner, 'cream')}</div></section>`
  : `<section${id ? ` id="${id}"` : ''} style="padding:clamp(48px,6vw,88px) 0"><div style="${WRAP}">${inner}</div></section>`;

// ---------- inline markdown ----------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const chip = note => `<sc-if value="{{ showPending }}" hint-placeholder-val="{{ true }}"><span style="display:inline-flex;align-items:center;gap:8px;vertical-align:middle;margin:2px 0;padding:5px 12px 5px 6px;border-radius:999px;border:1px dashed @@AC@@;background:transparent;color:@@AC@@;font-size:13px;line-height:1.4;max-width:100%"><span style="flex-shrink:0;font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:@@AC@@;color:@@BG@@">À fournir</span>${note ? '<span>' + note + '</span>' : ''}</span></sc-if>`;
const link = (slug, label) => `<a href="#${slug}" style="color:@@AC@@;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px" style-hover="color:@@FG@@">${label}</a>`;
function inl(s) {
  const chips = [];
  s = s.replace(/\{\{A_FOURNIR\s*:?\s*([\s\S]*?)\}\}/g, (_, n) => { chips.push(n.trim()); return '\u0001' + (chips.length - 1) + '\u0002'; });
  s = s.replace(/\{\{zone\}\}/g, '\u0003');
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(#\)/g, (_, t) => `<button onClick="{{ manageCookies }}" style="background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-decoration-color:#c4d401;text-decoration-thickness:2px;text-underline-offset:3px">${t}</button>`);
  s = s.replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_, t, h) => link(h, t));
  s = s.replace(/→\s*((?:`\/[^`]*`(?:\s*(?:et|,)\s*)?)+)/g, (_, grp) => '→ ' + [...grp.matchAll(/`(\/[^`]*)`/g)].map(m => link(m[1], NAME[m[1]] || m[1])).join(' · '));
  s = s.replace(/`(\/[^`]*)`/g, (_, h) => link(h, NAME[h] || h));
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600">$1</strong>');
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => chip(esc(chips[+i])));
  s = s.replace(/\u0003/g, '{{ zoneLabel }}');
  return s;
}
const stripTitle = t => t.replace(/^(Section|Bloc(?: \d+)?)\s*:\s*/, '').replace(/\s*\([^)]*\)\s*$/, '').trim();

// ---------- md parsing ----------
function parseFile(t) {
  const secs = []; let cur = { raw: '_top', lines: [] };
  for (const l of t.split('\n')) {
    if (l.startsWith('## ')) { secs.push(cur); cur = { raw: l.slice(3).trim(), lines: [] }; } else cur.lines.push(l);
  }
  secs.push(cur);
  secs.forEach(s => s.title = stripTitle(s.raw));
  return secs;
}
function blocks(lines) {
  const out = []; let para = null;
  const flush = () => { if (para) { out.push({ t: 'p', text: para.join(' ') }); para = null; } };
  for (let raw of lines) {
    const l = raw.trimEnd();
    if (!l.trim()) { flush(); continue; }
    if (l.startsWith('>')) { flush(); continue; }
    if (/^\*\*CTA/.test(l)) { flush(); out.push({ t: 'cta', text: l }); continue; }
    if (/^### /.test(l)) { flush(); out.push({ t: 'h3', text: l.slice(4).replace(/\s*\(H3\)\s*$/, '') }); continue; }
    if (/^\|/.test(l)) { flush(); const last = out[out.length - 1]; const cells = l.split('|').slice(1, -1).map(c => c.trim()); if (/^-+$/.test(cells[0].replace(/:/g, ''))) continue; if (last && last.t === 'table') last.rows.push(cells); else out.push({ t: 'table', rows: [cells] }); continue; }
    let m;
    if ((m = l.match(/^- (.*)$/))) { flush(); const last = out[out.length - 1]; if (last && last.t === 'ul') last.items.push(m[1]); else out.push({ t: 'ul', items: [m[1]] }); continue; }
    if ((m = l.match(/^\d+\. (.*)$/))) { flush(); const last = out[out.length - 1]; if (last && last.t === 'ol') last.items.push(m[1]); else out.push({ t: 'ol', items: [m[1]] }); continue; }
    if (!para) para = []; para.push(l.trim());
  }
  flush();
  return out;
}
// "**Lead** : text" -> {lead, text}
function leadSplit(item) {
  const m = item.match(/^\*\*(.+?)\*\*\s*(?::\s*)?([\s\S]*)$/);
  return m ? { lead: m[1], text: m[2] } : { lead: null, text: item };
}
function faqItems(lines) {
  const items = []; let cur = null;
  for (const l of lines) {
    const m = l.trim().match(/^\*\*(.+\?)\*\*$/);
    if (m) { cur = { q: m[1], a: [] }; items.push(cur); continue; }
    if (/^\*\*CTA/.test(l.trim())) { cur = null; continue; }
    if (cur && l.trim()) cur.a.push(l.trim());
  }
  return items;
}

// ---------- section renderers ----------
const photo = (label, ratio = '4/3', src0) => { const src = src0 || PHOTO_BY_LABEL[label]; return src0 || PHOTO_BY_LABEL[label]
  ? `<div style="overflow:hidden;border-radius:22px;aspect-ratio:${ratio};background:@@PH@@"><img src="${src}" alt="${esc(label)}" loading="lazy" style="display:block;width:100%;height:100%;object-fit:cover"></div>`
  : `<div style="width:100%;aspect-ratio:${ratio};border-radius:22px;background:@@PH@@;display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;${SMALL}">Photo : ${esc(label)}</div>`; };
const sq = `<span style="flex-shrink:0;width:8px;height:8px;margin-top:10px;border-radius:50%;background:@@AC@@"></span>`;
function renderGeneric(bl) {
  return bl.map(b => {
    if (b.t === 'p') return `<p style="${PS}">${inl(b.text)}</p>`;
    if (b.t === 'h3') return `<h3 style="${H3S};margin-top:12px">${inl(b.text)}</h3>`;
    if (b.t === 'ul' || b.t === 'ol') return checklist(b.items);
    if (b.t === 'table') return table(b.rows);
    return '';
  }).join('\n');
}
function checklist(items) {
  const two = items.length >= 6;
  return `<ul style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:${two ? 'repeat(auto-fit,minmax(min(100%,420px),1fr))' : '1fr'};gap:16px 48px;max-width:${two ? '100%' : '760px'}">${items.map(it => `<li style="display:flex;gap:14px;font-size:17px;line-height:1.6">${sq}<span>${inl(it)}</span></li>`).join('')}</ul>`;
}
function table(rows) {
  const [head, ...body] = rows;
  const desk = `<div data-tdesk style="overflow:hidden;border-radius:22px;border:1px solid ${LINE}"><table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.5"><thead><tr>${head.map(h => `<th style="text-align:left;padding:14px 18px;background:#d6e26b;color:#12201a;${FH};font-weight:500;font-size:16px">${inl(h)}</th>`).join('')}</tr></thead><tbody>${body.map((r, i) => `<tr style="background:${i % 2 ? SURF : '@@CARD@@'}">${r.map((c, j) => `<td style="padding:14px 18px;vertical-align:top;border-top:1px solid ${LINE};${j === 0 ? 'font-weight:600' : ''}">${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const firstIsCriterion = head.length > 2;
  const mob = `<div data-tmob style="display:none;flex-direction:column;gap:12px">${body.map(r => `<div style="border:1px solid ${LINE};border-radius:22px;padding:16px 18px;background:@@CARD@@;display:flex;flex-direction:column;gap:10px">${firstIsCriterion ? `<div style="${FH};font-weight:500;font-size:17px">${inl(r[0])}</div>` : ''}${r.slice(firstIsCriterion ? 1 : 0).map((c, j) => `<div style="display:flex;flex-direction:column;gap:2px"><span style="${SMALL}">${inl(head[j + (firstIsCriterion ? 1 : 0)])}</span><span style="font-size:16px;line-height:1.5">${inl(c)}</span></div>`).join('')}</div>`).join('')}</div>`;
  return desk + mob;
}
function steps(items, vertical) {
  const it = items.map((x, i) => ({ ...leadSplit(x), n: i + 1 }));
  const num = n => `<span style="flex-shrink:0;min-width:56px;font-family:'Instrument Serif',serif;font-style:italic;font-size:44px;line-height:1;color:@@AC@@">${String(n).padStart(2, '0')}</span>`;
  if (vertical) return `<ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;max-width:820px">${it.map((s, i) => `<li style="display:flex;gap:20px;padding:20px 0;${i ? `border-top:1px solid ${LINE}` : ''}">${num(s.n)}<div style="display:flex;flex-direction:column;gap:6px;padding-top:10px">${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS}">${inl(s.text)}</p></div></li>`).join('')}</ol>`;
  return `<ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:32px">${it.map(s => `<li style="display:flex;flex-direction:column;gap:14px">${num(s.n)}${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS};font-size:16px">${inl(s.text)}</p></li>`).join('')}</ol>`;
}
function args(items) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:32px 56px">${items.map(x => { const s = leadSplit(x); return `<div style="display:flex;flex-direction:column;gap:8px;padding-top:20px;border-top:2px solid ${INK}">${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS};font-size:16px">${inl(s.text)}</p></div>`; }).join('')}</div>`;
}
function cards(items, opts = {}) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,${opts.min || 260}px),1fr));gap:clamp(16px,2vw,24px)">${items.map(c => theme(`<div style="display:flex;flex-direction:column;background:#faf7f0;color:#12201a;border:1px solid rgba(18,32,26,.08);border-radius:28px;padding:10px;transition:transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s" style-hover="transform:translateY(-6px);box-shadow:0 24px 50px rgba(0,0,0,.25)">${photo(c.shot || c.titleText, '4/3', c.img || (c.links && c.links[0] && CARD_IMG[c.links[0][0]]))}<div style="flex:1;display:flex;flex-direction:column;gap:12px;padding:20px 14px 14px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><h3 style="${H3S};font-size:23px">${c.titleHtml}</h3>${c.paca ? PACA_BADGE : ''}</div>${c.text ? `<p style="margin:0;font-size:15px;line-height:1.55;color:@@MU@@">${c.text}</p>` : ''}${c.links && c.links.length ? `<div style="margin-top:auto;padding-top:16px;border-top:1px solid @@LN@@;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase">${c.links.map(l => link(l[0], l[1])).join('')}</div>` : ''}</div></div>`, 'cream')).join('')}</div>`;
}
function cardFromBullet(item) {
  const slugs = [...item.matchAll(/`(\/[^`]*)`/g)].map(m => m[1]);
  const inner = [...item.matchAll(/\]\((\/[^)]*)\)/g)].map(m => m[1]);
  let body = item.replace(/\s*→\s*(`[^`]*`(\s*et\s*)?)+\s*$/, '');
  const ls = leadSplit(body);
  let titleText = ls.lead || body, text = ls.text;
  const lm = titleText.match(/^\[([^\]]+)\]\((\/[^)]*)\)$/);
  let href = slugs[0] || (lm && lm[2]);
  if (lm) titleText = lm[1];
  const links = slugs.length > 1 ? slugs.map(s => [s, NAME[s]]) : href ? [[href, 'Découvrir']] : [];
  return { titleText, titleHtml: inl(titleText), text: text ? inl(text) : '', links, img: CARD_IMG[href] };
}
function faqList(items, idAttr) {
  return `<div style="display:flex;flex-direction:column;gap:10px">${items.map((f, i) => `<details ${i === 0 ? 'open="{{ true }}"' : ''} style="border-radius:24px;background:@@SF@@;border:1px solid @@LN@@;padding:0 clamp(18px,2vw,26px)"><summary style="list-style:none;cursor:pointer;display:flex;align-items:center;gap:16px;padding:20px 0"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:22px;color:@@AC@@;min-width:30px">${String(i + 1).padStart(2, '0')}</span><span style="flex:1;${FH};font-weight:500;font-size:clamp(17px,1.4vw,20px);line-height:1.3;letter-spacing:-.01em;color:@@FG@@">${inl(f.q)}</span>${LEAFDOT}</summary><div data-faqa style="display:flex;flex-direction:column;gap:10px;padding:0 0 22px 46px">${f.a.map(a => `<p style="${PS};font-size:16px;color:@@MU@@">${inl(a)}</p>`).join('')}</div></details>`).join('')}</div>`;
}
const head2 = (t, sub) => `<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:clamp(28px,3.4vw,44px);max-width:960px">${numTag()}<h2 style="${H2S}">${accent(t)}</h2>${sub || ''}</div>`;
const headSide = t => `<div style="display:flex;flex-direction:column;gap:16px">${numTag()}<h2 style="${H2S}">${accent(t)}</h2></div>`;
const split = (left, right, cols = '5fr 7fr', align = 'start') => `<div data-split style="display:grid;grid-template-columns:${cols.split(' ').map(c => `minmax(0,${c})`).join(' ')};gap:clamp(28px,5vw,80px);align-items:${align}">${left}${right}</div>`;
function accent(t, color = '@@AC@@') {
  if (/[`\[{*]/.test(t)) return inl(t);
  const pm = t.match(/^(.*?)(\s*[?!.:]+)$/);
  const body = pm ? pm[1] : t, punct = pm ? pm[2] : '';
  const m = body.match(/^(.*\S)\s+(\S+)$/);
  if (!m) return inl(t);
  let pre = m[1], last = m[2];
  if (last.length <= 3) { const m2 = pre.match(/^(.*\S)\s+(\S+)$/); if (m2) { pre = m2[1]; last = m2[2] + ' ' + last; } }
  return `${inl(pre)} <em style="${EMS(color)}">${inl(last)}</em>${esc(punct)}`;
}
function hiddenBlock(title, kind, note) {
  const n = { logos: 6, team: 4, figures: 3, timeline: 4 }[kind] || 3;
  const lab = { logos: 'logo client', team: 'portrait', figures: 'chiffre vérifié', timeline: 'étape datée' }[kind] || 'photo chantier';
  const ratio = { logos: '3/1', team: '1/1', figures: '2/1', timeline: '2/1' }[kind] || '3/2';
  const grid = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,${kind === 'logos' ? 150 : 240}px),1fr));gap:20px">${Array.from({ length: n }, () => `<div style="display:flex;flex-direction:column;gap:10px"><div style="aspect-ratio:${ratio};border-radius:22px;background:@@PH@@;display:flex;align-items:center;justify-content:center;${SMALL}">${lab}</div>${kind === 'logos' || kind === 'figures' ? '' : `<div style="height:12px;width:70%;background:@@PH@@;border-radius:3px"></div><div style="height:12px;width:45%;background:@@PH@@;border-radius:3px"></div>`}</div>`).join('')}</div>`;
  return { hidden: true, html: `<sc-if value="{{ showHidden }}" hint-placeholder-val="{{ false }}">\n<div style="${WRAP}"><div style="display:flex;align-items:center;gap:10px;margin:8px 0 -8px;${SMALL}"><span style="padding:3px 8px;border:1px dashed ${MUTED};border-radius:4px">État « présent » · masqué à la mise en ligne</span></div></div>\n@@SEC@@${head2(title)}${note ? `<div style="margin:-20px 0 24px">${note}</div>` : ''}${grid}@@END@@\n</sc-if>` };
}

// ---------- page assembly ----------
const HIDDEN_RE = /^(Réalisations|Références|Référence|Ils nous font confiance|Notre histoire|L'équipe|Chiffres clés)/;
const SKIP_RE = /^(_top|Metadata|H1|Maillage interne|JSON-LD|Données à fournir|À valider|Note de rédaction|Formulaire|Message de confirmation|Messages d'erreur|Contenu$)/;
const ARG_RE = /^(Pourquoi Flora Concept|Pourquoi choisir le stabilisé|Pour les syndics et les gestionnaires|Notre façon de travailler|Nos engagements|Notre engagement électrique)/;
const SURF_TXT_RE = /^(Débroussaillage et obligation|Qui intervient à Paris)/;

function buildSections(page, secs) {
  const out = []; // {surface:bool|null, html}
  for (const s of secs) {
    if (SKIP_RE.test(s.raw) || /^(Réponse directe|Sous-titre|Intro)/.test(s.raw)) continue;
    const t = s.title, bl = blocks(s.lines);
    if (HIDDEN_RE.test(t)) {
      const kind = /confiance/.test(t) ? 'logos' : /équipe/.test(t) ? 'team' : /Chiffres/.test(t) ? 'figures' : /histoire/.test(t) ? 'timeline' : 'cases';
      out.push({ ...hiddenBlock(t, kind, renderGeneric(bl.filter(b => b.t === 'p'))), surface: null });
      continue;
    }
    if (/^FAQ/.test(s.raw)) { out.push({ surface: true, html: `<div data-faqwrap>` + split(`<div data-sticky style="position:sticky;top:120px;display:flex;flex-direction:column;gap:22px">${headSide('Questions fréquentes')}<div style="position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;gap:18px;min-height:340px;justify-content:flex-end;padding:28px;border-radius:28px;background:#12201a;color:#f1ece1">${DRAW.replace(/style="[^"]*"/, 'style="position:absolute;pointer-events:none;right:-20px;top:-10px;height:115%;width:auto;opacity:.6;z-index:-1;transform-origin:10% 100%"').replace('stroke="#3d5a40"', 'stroke="#d6e26b"')}<div style="display:flex;align-items:center;gap:12px"><span style="flex:1;height:3px;border-radius:3px;background:rgba(241,236,225,.15);overflow:hidden"><span data-faqbar style="display:block;height:100%;width:100%;background:#d6e26b;transform-origin:0 50%;transform:scaleX(0)"></span></span><span data-faqcount style="font-family:'Instrument Serif',serif;font-style:italic;font-size:20px;color:#d6e26b;min-width:56px;text-align:right">01</span></div><span style="${FH};font-weight:500;font-size:clamp(24px,2.2vw,30px);line-height:1.08;letter-spacing:-.03em">Votre devis gratuit en une <em style="${EMS('#d6e26b')}">minute</em></span><a href="#/devis/" style="${BTN1};align-self:flex-start;min-height:48px;padding:0 22px" style-hover="background:#f1ece1;color:#12201a">Recevoir mon devis ${LEAF}</a></div></div>`, faqList(faqItems(s.lines))) + `</div>` }); continue; }
    // home specials
    if (page.kind === 'home') {
      if (/^Entrées par profil/.test(s.raw)) { out.push({ surface: false, profile: true, html: profile(bl[0].items) }); continue; }
      if (/^Nos services/.test(t)) {
        const c = bl[0].items.map(cardFromBullet);
        c.push({ titleText: "Espaces verts d'entreprise", titleHtml: link('/espaces-verts-entreprise/', "Espaces verts d'entreprise"), paca: true, links: [['/espaces-verts-entreprise/', 'Découvrir']], img: CARD_IMG['/espaces-verts-entreprise/'] });
        c.push({ titleText: 'Ruches en entreprise', titleHtml: link('/ruches-entreprise/', 'Ruches en entreprise'), paca: true, links: [['/ruches-entreprise/', 'Découvrir']] });
        out.push({ surface: false, html: head2(t) + cards(c, { min: 240 }) }); continue;
      }
      if (/^Nos zones/.test(t)) {
        const regions = bl[0].items.filter(x => !/Notre base/.test(x)).map(x => { const ls = leadSplit(x); const sl = [...x.matchAll(/`(\/[^`]*)`/g)].map(m => m[1]); const idf = /Île/.test(ls.lead); const cities = ls.text.replace(/\s*→[\s\S]*$/, '').replace(/\.$/, '').split(/,\s*/); return `<div style="position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;justify-content:flex-end;gap:22px;min-height:clamp(420px,40vw,540px);padding:clamp(24px,3vw,44px);border-radius:clamp(28px,3vw,40px);color:#f1ece1"><img src="${idf ? IMG.paris : IMG.marseille}" alt="${esc(ls.lead)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2"><span style="position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(18,32,26,.15) 0%,rgba(18,32,26,.45) 45%,rgba(18,32,26,.95) 100%)"></span><span style="align-self:flex-start;display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding:8px 14px;border-radius:999px;background:#d6e26b;color:#12201a"><span style="width:7px;height:7px;border-radius:50%;background:#12201a"></span>${idf ? "Paysagisme d'intérieur" : 'Intérieur et extérieur'}</span><h3 style="margin:0;${FH};font-weight:500;font-size:clamp(32px,3.4vw,52px);line-height:.98;letter-spacing:-.04em;color:#f1ece1">${accent(ls.lead, '#d6e26b')}</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${cities.map(c => `<span style="font-size:14px;padding:7px 13px;border-radius:999px;border:1px solid rgba(241,236,225,.28);background:rgba(18,32,26,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)">${inl(c)}</span>`).join('')}</div><div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:18px;border-top:1px solid rgba(241,236,225,.2)">${sl.map(h => `<a href="#${h}" style="display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 20px;border-radius:999px;background:#f1ece1;color:#12201a;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;transition:background .3s" style-hover="background:#d6e26b;color:#12201a">${esc(NAME[h])} ${LEAF}</a>`).join('')}</div></div>`; });
        out.push({ surface: false, html: head2(t) + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(12px,1.6vw,20px)">${regions.join('')}</div>` }); continue;
      }
    }
    // hub cards
    if (/^(Ce que recouvre|Nos prestations extérieur)/.test(t)) {
      const intro = bl.filter(b => b.t === 'p'); const ul = bl.find(b => b.t === 'ul');
      const lead = intro.filter(p => !/^Quatre cartes/.test(p.text));
      const before = lead.length && bl.indexOf(lead[0]) < bl.indexOf(ul) ? lead[0] : null;
      const after = lead.filter(p => p !== before);
      const c = ul.items.map(cardFromBullet).map(x => ({ ...x, img: x.img || HERO_IMG_BY_SLUG(x) }));
      out.push({ surface: false, html: head2(t, before ? `<p style="${PS}">${inl(before.text)}</p>` : '') + cards(c, { min: page.outdoor ? 250 : 300 }) + after.map(p => `<p style="${PS};margin-top:32px">${inl(p.text)}</p>`).join('') }); continue;
    }
    const tbl = bl.find(b => b.t === 'table');
    const ol = bl.find(b => b.t === 'ol');
    const ul = bl.find(b => b.t === 'ul');
    const hasH3 = bl.some(b => b.t === 'h3');
    if (ARG_RE.test(t)) {
      let items = ul ? ul.items : null;
      if (items && /engagements/.test(t)) items = items.map(x => x.replace(/\s*\(confirmé par le client[^)]*\)/, '').replace(/\.\s*Bénéfice client à mettre en avant\s*:[^.]*\.?/, '.').replace(/\.\s*Lien vers `(\/[^`]*)`\.?/, (_, h) => `. [En savoir plus](${h})`));
      const rest = bl.filter(b => b !== ul);
      if (!items) {
        const ps = rest.filter(b => b.t === 'p');
        const first = ps.length ? ps[0].text : '';
        const m = first.match(/^([^:]{10,120}?)\s*:\s*([^.]+)\.\s*([\s\S]*)$/);
        const pills = m ? m[2].split(/,\s*/) : [];
        const body = m ? [m[3], ...ps.slice(1).map(p => p.text)].filter(Boolean) : ps.map(p => p.text);
        const featImg = `<div style="position:relative;overflow:hidden;isolation:isolate;min-height:clamp(360px,36vw,520px);border-radius:clamp(24px,2.6vw,36px);display:flex;align-items:flex-end;padding:24px"><img src="${nextPic()}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2"><span style="position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(18,32,26,0) 40%,rgba(18,32,26,.85) 100%)"></span>${pills.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px">${pills.map(p => `<span style="display:inline-flex;align-items:center;gap:8px;font-size:13px;padding:8px 14px;border-radius:999px;background:rgba(18,32,26,.55);border:1px solid rgba(241,236,225,.25);color:#f1ece1;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)"><span style="width:6px;height:6px;border-radius:50%;background:#d6e26b"></span>${inl(p)}</span>`).join('')}</div>` : ''}</div>`;
        const featTxt = `<div style="display:flex;flex-direction:column;gap:22px;justify-content:center">${headSide(t)}${m ? `<p style="margin:0;font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(26px,2.4vw,36px);line-height:1.15;color:@@FG@@">${inl(m[1])}</p>` : ''}${body.map(p => `<p style="margin:0;font-size:16.5px;line-height:1.7;color:@@MU@@">${inl(p)}</p>`).join('')}</div>`;
        out.push({ surface: false, html: `<div style="padding:clamp(12px,1.2vw,16px);border-radius:clamp(28px,3vw,44px);background:@@SF@@;border:1px solid @@LN@@">${split(featImg, `<div style="padding:clamp(12px,2.4vw,36px) clamp(8px,2vw,28px)">${featTxt}</div>`, '5fr 6fr', 'center')}</div>` }); continue;
      }
      const argItems = items ? items.map(leadSplit) : null; const argOk = argItems && argItems.every(x => x.lead);
      out.push({ surface: true, html: head2(t) + (items ? (argOk ? bento(argItems) : args(items)) : '') + (rest.length ? `<div style="display:flex;flex-direction:column;gap:16px;${items ? 'margin-top:28px' : ''}">${renderGeneric(rest)}</div>` : '') }); continue;
    }
    if (tbl) {
      const pre = /Naturel ou stabilisé/.test(t) ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:20px;margin-bottom:28px">${photo('mur végétal naturel', '3/2')}${photo('mur végétal stabilisé', '3/2')}</div>` : '';
      const tb = bl.find(b => b.t === 'table'); const before = bl.slice(0, bl.indexOf(tb)); const after = bl.slice(bl.indexOf(tb) + 1);
      out.push({ surface: null, html: head2(t, before.length ? `<div style="display:flex;flex-direction:column;gap:14px">${renderGeneric(before)}</div>` : '') + pre + table(tb.rows) + (after.length ? `<div style="margin-top:20px;display:flex;align-items:flex-start;gap:18px;padding:22px 26px;border-radius:24px;background:@@SF@@;border:1px solid @@LN@@">${LEAFDOT}<div style="display:flex;flex-direction:column;gap:12px">${renderGeneric(after)}</div></div>` : '') }); continue;
    }
    if (ol) {
      const vertical = ol.items.length > 4 || /^Comment nous couvrons/.test(t);
      const others = bl.filter(b => b !== ol);
      if (vertical) {
        const tl = ol.items.map(leadSplit).map((x, k, arr) => `<li style="position:relative;display:grid;grid-template-columns:56px minmax(0,1fr);gap:18px;padding-bottom:${k < arr.length - 1 ? 'clamp(14px,1.6vw,20px)' : '0'}">${k < arr.length - 1 ? '<span aria-hidden="true" style="position:absolute;left:27px;top:56px;bottom:0;width:2px;background:linear-gradient(@@AC@@,@@LN@@)"></span>' : ''}<span style="position:relative;z-index:1;width:56px;height:56px;border-radius:50%;background:${k === 0 ? '#d6e26b' : '@@BG@@'};border:1px solid ${k === 0 ? '#d6e26b' : '@@AC@@'};display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-style:italic;font-size:24px;color:${k === 0 ? '#12201a' : '@@AC@@'}">${String(k + 1).padStart(2, '0')}</span><div style="display:flex;flex-direction:column;gap:10px;padding:clamp(20px,2vw,26px) clamp(20px,2.2vw,28px);border-radius:24px;background:@@SF@@;border:1px solid @@LN@@;transition:border-color .3s,transform .5s cubic-bezier(.16,1,.3,1)" style-hover="border-color:@@AC@@;transform:translateX(4px)">${x.lead ? `<h3 style="margin:0;${FH};font-weight:500;font-size:clamp(20px,1.7vw,24px);line-height:1.15;letter-spacing:-.02em;color:@@FG@@">${inl(x.lead)}</h3>` : ''}<div style="font-size:15.5px;line-height:1.65;color:@@MU@@">${inl(x.text)}</div></div></li>`).join('');
        const left = `<div data-sticky style="position:sticky;top:120px;display:flex;flex-direction:column;gap:24px">${headSide(t)}${others.length ? `<div style="display:flex;flex-direction:column;gap:14px">${renderGeneric(others).replace(/font-size:17px/g, 'font-size:16px')}</div>` : ''}${tall(nextPic(), '5/4')}</div>`;
        out.push({ surface: null, html: split(left, `<ol style="list-style:none;margin:0;padding:0">${tl}</ol>`, '5fr 7fr', 'start') }); continue;
      }
      out.push({ surface: null, html: head2(t) + steps(ol.items, vertical) + (others.length ? `<div style="display:flex;flex-direction:column;gap:16px;margin-top:28px">${renderGeneric(others)}</div>` : '') }); continue;
    }
    if (hasH3) {
      const intro = []; const subs = []; let cur = null;
      for (const b of bl) { if (b.t === 'h3') { cur = { h: b.text, bl: [] }; subs.push(cur); } else if (cur) cur.bl.push(b); else intro.push(b); }
      out.push({ surface: null, html: head2(t, intro.length ? `<div style="display:flex;flex-direction:column;gap:14px">${renderGeneric(intro)}</div>` : '') + bento(subs.map(x => ({ leadHtml: inl(x.h), html: renderGeneric(x.bl).replace(/max-width:68ch;/g, '').replace(/font-size:17px;line-height:1.65;color:@@FG@@/g, 'font-size:15px;line-height:1.6;color:inherit').replace(/font-size:17px/g, 'font-size:15px') }))) }); continue;
    }
    if (ul && !bl.some(b => b.t === 'p' && bl.indexOf(b) < bl.indexOf(ul))) {
      const others = bl.filter(b => b !== ul);
      const leads = ul.items.map(leadSplit); const allLead = leads.every(x => x.lead);
      if (allLead) { out.push({ surface: null, html: head2(t) + bento(leads) + (others.length ? `<div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">${renderGeneric(others)}</div>` : '') }); continue; }
      out.push({ surface: null, html: head2(t) + bento(ul.items.map(x => ({ leadHtml: inl(x), html: '' }))) + (others.length ? `<div style="margin-top:clamp(12px,1.4vw,18px);display:flex;align-items:flex-start;gap:18px;padding:22px 26px;border-radius:24px;background:@@SF@@;border:1px solid @@LN@@">${LEAFDOT}<div style="display:flex;flex-direction:column;gap:12px">${renderGeneric(others)}</div></div>` : '') }); continue;
    }
    // S21 text
    const special = SURF_TXT_RE.test(t);
    const paris = /^Qui intervient à Paris/.test(t);
    const luberon = /^Le rucher du Luberon/.test(t);
    if (ul && ul.items.length >= 3 && ul.items.every(x => leadSplit(x).lead) && !SURF_TXT_RE.test(t) && !/^Qui intervient à Paris|^Le rucher du Luberon/.test(t)) { const pre = bl.slice(0, bl.indexOf(ul)), post = bl.slice(bl.indexOf(ul) + 1); out.push({ surface: null, html: head2(t, pre.length ? `<div style="display:flex;flex-direction:column;gap:14px">${renderGeneric(pre)}</div>` : '') + bento(ul.items.map(leadSplit)) + (post.length ? `<div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">${renderGeneric(post)}</div>` : '') }); continue; }
    const flip = SN % 2 === 1; const pic = tall(nextPic(), '4/5');
    const txt = `<div data-sticky style="position:sticky;top:120px;display:flex;flex-direction:column;gap:22px">${headSide(t)}<div style="display:flex;flex-direction:column;gap:16px">${renderGeneric(bl)}</div></div>`;
    let inner = flip ? split(pic, txt, '5fr 7fr', 'start') : split(txt, pic, '7fr 5fr', 'start');
    if (paris) inner = `<div data-split style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:40px;align-items:start;padding:clamp(24px,4vw,48px);background:@@CARD@@;border-radius:22px">${`<div>${inner}</div>`}${photo("équipe parisienne", '4/3')}</div>`;
    if (luberon) inner = head2(t) + `<div style="margin-bottom:28px">${photo('rucher du Luberon (pleine largeur)', '21/9')}</div><div style="display:flex;flex-direction:column;gap:16px">${renderGeneric(bl)}</div>`;
    out.push({ surface: special ? true : null, html: inner });
  }
  return out;
}
function HERO_IMG_BY_SLUG(c) { return undefined; }
function profile(items) {
  const leafBtn = `<span aria-hidden="true" style="flex-shrink:0;width:48px;height:48px;border-radius:50%;background:#d6e26b;color:#12201a;display:flex;align-items:center;justify-content:center">${LEAF}</span>`;
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(12px,1.6vw,20px)">${items.map((x, i) => { const sl = (x.match(/`(\/[^`]*)`/) || [])[1]; const ls = leadSplit(x.replace(/\s*→\s*`[^`]*`\s*$/, '')); const img = CARD_IMG[sl] || [IMG.plantes, IMG.alocasia, IMG.copro][i % 3]; return `<a href="#${sl}" style="position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:clamp(340px,32vw,440px);padding:clamp(22px,2.4vw,32px);border-radius:28px;color:#f1ece1;text-decoration:none;isolation:isolate;transition:transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s" style-hover="color:#f1ece1;transform:translateY(-6px);box-shadow:0 24px 50px rgba(0,0,0,.35)"><img src="${img}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2"><span style="position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(18,32,26,.25) 0%,rgba(18,32,26,.35) 40%,rgba(18,32,26,.94) 100%)"></span><span style="display:flex;justify-content:space-between;align-items:flex-start"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:44px;line-height:1;color:#d6e26b">0${i + 1}</span><span style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:7px 12px;border-radius:999px;background:rgba(241,236,225,.12);border:1px solid rgba(241,236,225,.22);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)">${esc(NAME[sl] || '')}</span></span><span style="display:flex;align-items:flex-end;gap:18px"><span style="flex:1;display:flex;flex-direction:column;gap:10px"><span style="${FH};font-weight:500;font-size:clamp(24px,2.2vw,30px);line-height:1.05;letter-spacing:-.03em">${inl(ls.lead)}</span><span style="font-size:15px;line-height:1.55;color:rgba(241,236,225,.82)">${inl(ls.text)}</span></span>${leafBtn}</span></a>`; }).join('')}</div>`;
}
function rhythm(sections, startDark) {
  // alternate backgrounds, forced surface sections keep surface
  let prev = true; // hero is white -> first section should be surface? hero white => start alternate
  prev = false;
  const res = [];
  res.lastDark = !!startDark;
  sections.forEach((s, i) => {
    if (s.hidden) { res.push(s.html.replace('@@SEC@@', `<section style="padding:clamp(40px,5vw,64px) 0"><div style="${WRAP}">`).replace('@@END@@', '</div></section>')); return; }
    let surf;
    if (s.surface === true) surf = true;
    else if (s.surface === false) surf = false;
    else { const next = sections.slice(i + 1).find(x => !x.hidden); surf = !prev; if (surf && next && next.surface === true) surf = false; }
    if (surf && prev && s.surface !== true) surf = false;
    const tight = !surf && res.lastDark;
    prev = surf;
    if (tight) res.push(`<div aria-hidden="true" style="${WRAP};padding-bottom:clamp(48px,6vw,88px)"><div style="display:flex;align-items:center;gap:18px;color:#d6e26b"><span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(241,236,225,0),rgba(241,236,225,.22))"></span><span style="width:7px;height:7px;border-radius:50%;background:rgba(214,226,107,.5)"></span>${LEAF.replace('data-ico ', '')}<span style="width:7px;height:7px;border-radius:50%;background:rgba(214,226,107,.5)"></span><span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(241,236,225,.22),rgba(241,236,225,0))"></span></div></div>`);
    res.push(tight ? SEC('@@CARD@@', s.html).replace('style="padding:clamp(48px,6vw,88px) 0"', 'style="padding:0 0 clamp(48px,6vw,88px)"') : SEC(surf ? SURF : '@@CARD@@', s.html));
    res.lastDark = !surf;
  });
  return res.join('\n');
}
const crumb = page => '';
const crumbIn = page => {
  if (page.kind === 'home') return '';
  const C = 'color:rgba(241,236,225,.75);text-decoration:none';
  const parts = [`<a href="#/" style="${C}" style-hover="color:#f1ece1">Accueil</a>`];
  if (page.parent) parts.push(`<a href="#${BY[page.parent].slug}" style="${C}" style-hover="color:#f1ece1">${esc(BY[page.parent].name)}</a>`);
  parts.push(`<span aria-current="page" style="display:flex;align-items:center;padding:8px 14px;border-radius:999px;background:rgba(241,236,225,.1);border:1px solid rgba(241,236,225,.2);color:#f1ece1">${esc(page.name)}</span>`);
  return `<nav aria-label="Fil d'Ariane" style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase">${parts.join('<span aria-hidden="true" style="color:rgba(241,236,225,.4)">/</span>')}</nav>`;
};
const ZONE_BAND = `<span style="align-self:flex-start;display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:9px 16px;border-radius:999px;background:#d6e26b;color:#12201a"><span style="width:7px;height:7px;border-radius:50%;background:#12201a"></span>Interventions en Provence-Alpes-Côte d'Azur</span>`;
const BTNS = (primary = 'Recevoir mon devis gratuit') => `<div style="display:flex;flex-wrap:wrap;gap:10px"><a href="#/devis/" style="${BTN1}" style-hover="${BTN1H}">${primary} ${LEAF}</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="${BTN2}" style-hover="${BTN2H}">Appeler</a></div>`;
function hero(page, h1, answer, opts = {}) {
  const img = HERO_IMG[page.id];
  const media = img ? `<img src="${img}" alt="${esc(page.name)}" fetchpriority="high" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,32,26,.4) 0%,rgba(18,32,26,.2) 40%,rgba(18,32,26,.94) 100%)"></div>` : DRAW_BANNER;
  const banner = `<section style="padding:92px clamp(8px,1vw,16px) 0"><div style="position:relative;min-height:${img ? 'min(68vh,620px)' : 'min(48vh,460px)'};border-radius:clamp(28px,3.5vw,56px);overflow:hidden;display:flex;align-items:flex-end;background:radial-gradient(120% 90% at 85% 20%,#2c4a36 0%,#12201a 60%)">${media}<div style="position:relative;z-index:2;width:100%;padding:clamp(48px,7vh,80px) clamp(20px,4vw,56px) clamp(28px,3vw,44px);display:flex;flex-direction:column;gap:20px">${crumbIn(page)}<h1 style="${H1S};max-width:1100px">${accent(h1, '#d6e26b')}</h1>${page.outdoor ? ZONE_BAND : ''}${opts.noBtns ? '' : BTNS()}</div></div></section>`;
  const allTxt = answer.join(' ');
  let quote = '', rest = allTxt;
  const ci = allTxt.indexOf(' : ');
  if (ci > 30 && ci < 150) { quote = allTxt.slice(0, ci + 2); rest = allTxt.slice(ci + 3); }
  else { const fs = allTxt.match(/^.{30,170}?[.!?](?=\s)/); if (fs) { quote = fs[0]; rest = allTxt.slice(fs[0].length).trim(); } }
  const sents = rest.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝÉ])/);
  let acc = 0, half = 0; const tot = rest.length; for (let k = 0; k < sents.length; k++) { acc += sents[k].length; if (acc >= tot / 2) { half = k + 1; break; } }
  const paras2 = sents.length > 1 ? [sents.slice(0, half).join(' '), sents.slice(half).join(' ')].filter(Boolean) : [rest];
  const ansText = (quote ? `<p style="margin:0;font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:clamp(28px,2.7vw,42px);line-height:1.12;letter-spacing:-.01em;color:#f1ece1;text-wrap:balance">${inl(quote)}</p><span style="width:56px;height:2px;background:#d6e26b;border-radius:2px"></span>` : '') + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:20px 36px">${paras2.map(p => `<p style="margin:0;font-size:16.5px;line-height:1.7;color:rgba(241,236,225,.78);text-wrap:pretty">${inl(p)}</p>`).join('')}</div>`;
  const plainTxt = answer.map(p => `<p style="margin:0;font-size:18px;line-height:1.65;color:rgba(241,236,225,.85)">${inl(p)}</p>`).join('');
  const ans = answer.length ? (opts.plain || page.kind === 'devis' || page.kind === 'faq' ? `<section style="padding:clamp(40px,5vw,64px) 0 0"><div style="${WRAP}"><div style="max-width:900px;display:flex;flex-direction:column;gap:18px">${plainTxt}</div></div></section>` : `<section style="padding:clamp(48px,6vw,88px) 0"><div style="${WRAP}">${split(`<div style="display:flex;flex-direction:column;gap:26px;padding-top:8px"><span style="display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#d6e26b"><span style="width:8px;height:8px;border-radius:50%;background:#d6e26b"></span>En bref</span>${ansText}</div>`, `<div data-sticky style="position:sticky;top:110px">${tall(nextPic(), '4/5')}</div>`, '7fr 5fr', 'start')}</div></section>`) : '';
  return banner + ans;
}
const G5 = (line = 'Votre devis gratuit en une minute') => `<section style="padding:clamp(72px,10vw,120px) 0"><div style="${WRAP}"><div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:32px;padding-top:clamp(48px,6vw,80px);border-top:1px solid @@LN@@"><h2 style="${H2S};font-size:clamp(36px,4.4vw,64px);line-height:.95;max-width:820px">${accent(line)}</h2><div style="display:flex;flex-wrap:wrap;align-items:center;gap:20px"><a href="#/devis/" style="${BTN1};padding:0 30px;min-height:58px" style-hover="${BTN1H}">Recevoir mon devis gratuit ${LEAF}</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="color:@@FG@@;font-size:15px;text-decoration:underline;text-decoration-color:#d6e26b;text-underline-offset:4px" style-hover="color:#d6e26b">ou appelez-nous</a></div></div></div></section>`;
const sec = (secs, re) => secs.find(s => re.test(s.raw));
const paras = s => s ? blocks(s.lines).filter(b => b.t === 'p').map(b => b.text) : [];
const h1Of = secs => { const s = sec(secs, /^H1$/); return s.lines.map(l => l.trim()).find(l => l && !l.startsWith('**')); };
const titleOf = secs => { const s = sec(secs, /^Metadata/); if (!s) return null; const l = s.lines.find(x => /\*\*Title\*\*/.test(x)); return l ? l.replace(/^.*\*\*Title\*\*\s*:\s*/, '').replace(/\s*\(\d+ car\.\)\s*$/, '').trim() : null; };

const TITLES = {};
async function buildPage(page) {
  if (page.kind === 'blog') { TITLES[page.id] = 'Blog | Flora Concept'; return blogPage(page); }
  const md = await readFile(DIR + page.file);
  const secs = parseFile(md);
  SN = 0; PIX = 0; POOL = (page.outdoor ? OUTPOOL : INPOOL).filter(x => x !== HERO_IMG[page.id]);
  TITLES[page.id] = titleOf(secs) || (page.kind === 'e404' ? 'Page introuvable | Flora Concept' : page.name + ' | Flora Concept');
  const h1 = h1Of(secs);
  if (page.kind === 'legal') return legalPage(page, secs, h1);
  if (page.kind === 'e404') return e404Page(page, secs, h1);
  if (page.kind === 'devis') return devisPage(page, secs, h1);
  if (page.kind === 'faq') return faqPage(page, secs, h1);
  const ans = paras(sec(secs, /^(Réponse directe|Sous-titre)/));
  let top = '';
  if (page.kind === 'home') {
    const sub = sec(secs, /^Sous-titre/);
    const micro = sub.lines.find(l => /Micro-preuve/.test(l)).replace(/^.*?\)\s*:\s*/, '');
    top = `<section style="position:relative;min-height:100vh;display:flex;align-items:flex-end;overflow:hidden"><div data-parallax style="position:absolute;inset:0;transform:scale(1.12)"><img src="${HERO_IMG.p01}" alt="L'équipe Flora Concept" fetchpriority="high" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% 50%"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,32,26,.5) 0%,rgba(18,32,26,.2) 30%,rgba(18,32,26,.75) 62%,rgba(18,32,26,.97) 100%),linear-gradient(90deg,rgba(18,32,26,.55) 0%,rgba(18,32,26,0) 55%)"></div><div style="position:relative;z-index:2;width:100%;max-width:1440px;margin:0 auto;padding:clamp(120px,16vh,160px) clamp(20px,4vw,56px) clamp(28px,4vw,48px)"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(32px,5vw,80px);align-items:end"><div style="display:flex;flex-direction:column;gap:28px"><span style="align-self:flex-start;display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;padding:9px 16px;border-radius:999px;background:rgba(241,236,225,.1);border:1px solid rgba(241,236,225,.2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)"><span style="width:7px;height:7px;border-radius:50%;background:#d6e26b"></span>PACA · Île-de-France</span><h1 style="${H1S};font-size:clamp(40px,5.6vw,92px);line-height:.92;letter-spacing:-.05em;text-shadow:0 2px 30px rgba(0,0,0,.35)">${accent(h1, '#d6e26b')}</h1></div><div style="display:flex;flex-direction:column;gap:22px;max-width:580px;padding:clamp(22px,2.4vw,32px);border-radius:28px;background:rgba(18,32,26,.62);backdrop-filter:blur(18px) saturate(1.3);-webkit-backdrop-filter:blur(18px) saturate(1.3);border:1px solid rgba(241,236,225,.14);box-shadow:0 20px 60px rgba(0,0,0,.3)"><p style="margin:0;font-size:clamp(16px,1.25vw,19px);line-height:1.6;color:#f1ece1">${inl(ans[0])}</p>${BTNS()}<p style="margin:0;padding-top:16px;border-top:1px solid rgba(241,236,225,.14);font-size:14px;line-height:1.5;color:rgba(241,236,225,.85)">${inl(micro)}</p></div></div></div></section>
<sc-if value="{{ seasonal }}" hint-placeholder-val="{{ true }}"><div style="margin:clamp(8px,1vw,16px) clamp(8px,1vw,16px) 0;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:8px 8px 8px clamp(20px,3vw,32px);border-radius:999px;background:#1b2e24;border:1px solid rgba(214,226,107,.35)"><a href="#/fleurs-sapins-noel/" style="display:flex;align-items:center;gap:12px;color:#f1ece1;text-decoration:none;font-size:15px;min-height:44px" style-hover="color:#d6e26b"><span style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;background:#d6e26b;color:#12201a;padding:6px 10px;border-radius:999px">Saison</span>Sapins et décorations de Noël : réservez tôt →</a><button onClick="{{ closeSeason }}" aria-label="Fermer" style="flex-shrink:0;width:44px;height:44px;border-radius:50%;border:1px solid rgba(241,236,225,.3);background:transparent;color:#f1ece1;cursor:pointer">✕</button></div></sc-if>
${MARQUEE}`;
  } else top = hero(page, h1, ans);
  const body = rhythm(buildSections(page, secs), page.kind !== 'home' && page.kind !== 'about' && ans.length > 0);
  const finalLine = page.kind === 'about' ? 'Envie de travailler avec nous ?' : undefined;
  let related = '';
  if (page.kind === 'svc' || page.kind === 'city') {
    const pool = page.parent === 'p18' ? OUT_MENU.slice(1) : IN_MENU;
    const sib = pool.filter(([h]) => h !== page.slug).slice(0, 3);
    related = `<section style="padding:clamp(48px,6vw,88px) 0 0"><div style="${WRAP}"><div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:clamp(24px,3vw,36px)"><h2 style="${H2S}">Voir <em style="${EMS('@@AC@@')}">aussi</em></h2><a href="#${page.parent ? BY[page.parent].slug : '/paysagisme-interieur/'}" style="${BTN2};min-height:46px;padding:0 20px" style-hover="${BTN2H}">${esc(page.parent ? BY[page.parent].name : "Paysagisme d'intérieur")} ${LEAF}</a></div>${cards(sib.map(([h]) => ({ titleText: NAME[h], titleHtml: link(h, NAME[h]), img: CARD_IMG[h], paca: page.parent === 'p18', links: [[h, 'Découvrir']] })), { min: 280 })}</div></section>`;
  }
  return top + '\n' + body + '\n' + related + '\n' + G5(finalLine);
}
function faqPage(page, secs, h1) {
  const intro = paras(sec(secs, /^Intro/));
  const blocksF = secs.filter(s => /^Bloc \d/.test(s.raw));
  const ids = blocksF.map((s, i) => 'bloc-' + (i + 1));
  const jump = `<div style="${WRAP};padding-top:36px"><nav aria-label="Sur cette page" style="display:flex;flex-wrap:wrap;gap:10px">${blocksF.map((s, i) => `<a href="#/faq/#${ids[i]}" style="display:inline-flex;align-items:center;min-height:44px;padding:0 20px;border-radius:999px;border:1px solid @@LN@@;color:@@FG@@;text-decoration:none;font-size:15px" style-hover="background:@@SF@@;color:@@FG@@">${inl(s.title)}</a>`).join('')}</nav></div>`;
  const body = blocksF.map((s, i) => SEC(i % 2 ? '@@CARD@@' : SURF, `<div data-split style="display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(24px,5vw,80px);align-items:start"><div style="display:flex;flex-direction:column;gap:14px"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:48px;line-height:1;color:@@AC@@">0${i + 1}</span><h2 style="${H2S}">${accent(s.title)}</h2></div>${faqList(faqItems(s.lines))}</div>`, '', ids[i])).join('\n');
  return hero(page, h1, intro) + jump + body + G5();
}
function devisPage(page, secs, h1) {
  const intro = paras(sec(secs, /^Intro/));
  const form = sec(secs, /^Formulaire/);
  const reass = form.lines.find(l => /ligne de rassurance/.test(l)).replace(/^.*?:\s*«\s*/, '').replace(/\s*»\s*$/, '');
  const ph = form.lines.find(l => /placeholder/.test(l)).match(/«\s*(.+?)\s*»/)[1];
  const rgpdIdx = form.lines.findIndex(l => /Mention RGPD/.test(l));
  const rgpd = form.lines.slice(rgpdIdx + 1).map(l => l.trim()).filter(Boolean).join(' ');
  const conf = sec(secs, /^Message de confirmation/).lines.map(l => l.trim()).filter(Boolean);
  const call = sec(secs, /^Bloc : Appeler/);
  const callBl = blocks(call.lines).filter(b => b.t !== 'p' || !/Chaque numéro/.test(b.text));
  const next = sec(secs, /^Bloc : Ce qui se passe/);
  const nextOl = blocks(next.lines).find(b => b.t === 'ol');
  const NUM = n => `<span style="flex-shrink:0;width:40px;font-family:'Instrument Serif',serif;font-style:italic;font-size:30px;line-height:1;color:#3d5a40">${n}</span>`;
  const LBL = 'font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#12201a';
  const field = (n, key, label, input) => `<div style="display:flex;gap:18px;padding:22px 0;border-top:1px solid rgba(18,32,26,.14)">${NUM(n)}<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px"><label for="f-${key}" style="${LBL}">${label}</label>${input}<sc-if value="{{ err.${key} }}" hint-placeholder-val="{{ false }}"><p id="e-${key}" style="margin:0;font-size:14px;line-height:1.45;color:#b3261e">{{ err.${key} }}</p></sc-if></div></div>`;
  const inputS = k => `width:100%;font-size:19px;padding:8px 0 10px;border:0;border-bottom:1px solid {{ errB.${k} }};border-radius:0;background:transparent;color:#12201a;outline:none`;
  const zoneBtn = (v, l) => `<button type="button" value="${v}" onClick="{{ setZone }}" style="display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid #12201a;background:{{ zoneBg.${v} }};color:{{ zoneFg.${v} }};font-size:14px;cursor:pointer;transition:background .25s,color .25s">${l}</button>`;
  const formHtml = `<sc-if value="{{ notSent }}" hint-placeholder-val="{{ true }}"><form onSubmit="{{ submitDevis }}" onFocus="{{ devisStart }}" noValidate style="display:flex;flex-direction:column">
<div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px;padding-bottom:26px"><h2 style="margin:0;${FH};font-weight:500;font-size:clamp(30px,3vw,44px);line-height:1;letter-spacing:-.04em;color:#12201a">Demande de <em style="${EMS('#3d5a40')}">devis</em></h2><span style="display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:8px 14px;border-radius:999px;background:#d6e26b;color:#12201a">${LEAF}3 champs</span></div>
${field('01', 'nom', 'Nom', `<input id="f-nom" name="nom" autoComplete="name" style="${inputS('nom')}">`)}
${field('02', 'contact', 'Email ou téléphone', `<input id="f-contact" name="contact" autoComplete="email" style="${inputS('contact')}">`)}
${field('03', 'besoin', 'Votre besoin', `<textarea id="f-besoin" name="besoin" rows="3" placeholder="${esc(ph)}" style="${inputS('besoin')};resize:vertical;line-height:1.5"></textarea>`)}
<div style="display:flex;gap:18px;padding:22px 0;border-top:1px solid rgba(18,32,26,.14)">${NUM('04')}<div style="flex:1;display:flex;flex-direction:column;gap:12px"><span style="${LBL}">Équipe qui vous répond</span><div style="display:flex;flex-wrap:wrap;gap:8px">${zoneBtn('marseille', 'Marseille et Provence')}${zoneBtn('nice', "Nice et Côte d'Azur")}${zoneBtn('paris', 'Paris et Île-de-France')}</div></div></div>
<input type="hidden" name="zone" value="{{ zone }}">
<input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
<sc-if value="{{ err.server }}" hint-placeholder-val="{{ false }}"><p style="margin:0;font-size:15px;color:#b3261e">{{ err.server }}</p></sc-if>
<div style="display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px;padding:26px 0 22px;border-top:1px solid rgba(18,32,26,.14)"><button type="submit" style="${BTN1};background:#12201a;color:#f1ece1;padding:0 30px;min-height:60px;opacity:{{ sendOpacity }}" style-hover="background:#3d5a40;color:#f1ece1">{{ submitLabel }} ${LEAF}</button><p style="flex:1;min-width:220px;margin:0;font-size:14px;line-height:1.55;color:#3f4f45">${inl(reass)}</p></div>
<p style="margin:0;padding:16px 18px;border-radius:16px;background:rgba(18,32,26,.05);font-size:12px;line-height:1.6;color:#4a5a50">${inl(rgpd)}</p>
</form></sc-if>
<sc-if value="{{ sent }}" hint-placeholder-val="{{ false }}"><div role="status" style="display:flex;flex-direction:column;gap:14px;min-height:360px;justify-content:center"><span style="width:64px;height:64px;border-radius:50%;background:#d6e26b;color:#12201a;display:flex;align-items:center;justify-content:center">${LEAF}</span>${conf.map((l, i) => `<p style="margin:0;${i ? 'font-size:16px;line-height:1.6;color:#2a3a30' : `${FH};font-weight:500;font-size:clamp(26px,2.6vw,38px);line-height:1.05;letter-spacing:-.03em;color:#12201a`}">${inl(l.replace(/^\*\*|\*\*$/g, ''))}</p>`).join('')}</div></sc-if>`;
  const card = theme(`<div style="background:#f1ece1;color:#12201a;border-radius:clamp(28px,3vw,40px);padding:clamp(28px,4vw,52px)">${formHtml}</div>`, 'cream');
  const PHONE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"></path></svg>';
  const notes = callBl.filter(b => b.t === 'p');
  const items = callBl.filter(b => b.t !== 'p').flatMap(b => b.items);
  const callHtml = `<div data-sticky style="position:sticky;top:110px;display:flex;flex-direction:column;gap:12px">
<div style="position:relative;overflow:hidden;isolation:isolate;min-height:220px;border-radius:clamp(28px,3vw,40px);padding:clamp(24px,3vw,36px);display:flex;flex-direction:column;justify-content:flex-end;gap:10px"><img src="assets/hero-equipe.png" alt="L'équipe Flora Concept" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2"><span style="position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(18,32,26,.1) 0%,rgba(18,32,26,.92) 100%)"></span><h2 style="margin:0;${FH};font-weight:500;font-size:clamp(30px,3vw,44px);line-height:1;letter-spacing:-.04em;color:#f1ece1">${accent(call.title.replace(/^Bloc : /, ''), '#d6e26b')}</h2>${notes.map(b => `<div style="font-size:14px;color:rgba(241,236,225,.85)">${inl(b.text)}</div>`).join('')}</div>
${items.map(it => { const s = leadSplit(it); return `<a href="tel:+33413121380" onClick="{{ callClick }}" style="display:flex;align-items:center;gap:18px;padding:20px 22px;border-radius:24px;border:1px solid @@LN@@;background:@@SF@@;color:@@FG@@;text-decoration:none;transition:background .3s,border-color .3s" style-hover="background:rgba(241,236,225,.12);border-color:#d6e26b;color:@@FG@@"><span style="flex-shrink:0;width:52px;height:52px;border-radius:50%;background:#d6e26b;color:#12201a;display:flex;align-items:center;justify-content:center">${PHONE}</span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px"><span style="${FH};font-weight:500;font-size:19px;line-height:1.2">${inl(s.lead)}</span><span style="font-size:15px;color:@@MU@@;line-height:1.5">${inl(s.text)}</span></span></a>`; }).join('')}
</div>`;
  return hero(page, h1, intro, { noBtns: true }) + `<section style="padding:clamp(48px,6vw,80px) 0"><div style="${WRAP}"><div data-split style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(20px,3vw,40px);align-items:start">${card}${callHtml}</div></div></section>
${SEC(SURF, head2(next.title.replace(/^Bloc : /, '')) + steps(nextOl.items, false))}`;
}
function legalPage(page, secs, h1) {
  const c = sec(secs, /^Contenu/);
  const bl = blocks(c.lines);
  const parts = []; let cur = { h: null, bl: [] }; parts.push(cur);
  for (const b of bl) { if (b.t === 'h3') { cur = { h: b.text, bl: [] }; parts.push(cur); } else cur.bl.push(b); }
  const manage = page.id === 'p92' ? `<div><button onClick="{{ manageCookies }}" style="${BTN2}" style-hover="${BTN2H}">Gérer mes cookies</button></div>` : '';
  return hero(page, h1, [], { noBtns: true }) + `<section style="padding:clamp(56px,7vw,96px) 0"><div style="${WRAP}"><div style="max-width:820px;display:flex;flex-direction:column;gap:32px">${parts.map(p => (p.h || p.bl.length) ? `<div style="display:flex;flex-direction:column;gap:12px">${p.h ? `<h3 style="${H3S};font-size:24px">${inl(p.h)}</h3>` : ''}${renderGeneric(p.bl).replace(/max-width:68ch;/g, '')}</div>` : '').join('')}${manage}</div></div></section>`;
}
function e404Page(page, secs, h1) {
  const bl = blocks(sec(secs, /^Contenu/).lines);
  const html = bl.map(b => b.t === 'p' ? `<p style="${PS}">${inl(b.text)}</p>` : b.t === 'ul' ? `<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px">${b.items.map(i => `<li style="display:flex;gap:14px;font-size:17px;line-height:1.7">${sq}<span>${inl(i)}</span></li>`).join('')}</ul>` : b.t === 'cta' ? BTNS() : '').join('');
  return `<section style="min-height:100vh;display:flex;align-items:center;padding:140px 0 80px"><div style="${WRAP};width:100%"><div style="max-width:820px;display:flex;flex-direction:column;gap:24px"><span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:clamp(96px,18vw,220px);line-height:.8;color:#d6e26b">404</span><h1 style="${H1S}">${accent(h1, '#d6e26b')}</h1>${html}</div></div></section>`;
}
function blogPage(page) {
  const cardsB = Array.from({ length: 6 }, (_, i) => theme(`<div style="display:flex;flex-direction:column;background:#faf7f0;border-radius:28px;padding:10px"><div style="position:relative;aspect-ratio:4/3;border-radius:20px;overflow:hidden;background:@@PH@@"><img src="${[IMG.alocasia, IMG.entretien, IMG.arrosage, IMG.fleurs, IMG.mur, IMG.terrassement][i]}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"><span style="position:absolute;top:14px;left:14px;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;background:#f1ece1;color:#12201a;padding:8px 12px;border-radius:999px">Date</span></div><div style="display:flex;flex-direction:column;gap:12px;padding:22px 14px 14px"><div style="height:22px;width:${80 - i * 5}%;background:#e3dccb;border-radius:5px"></div><div style="height:12px;width:92%;background:#ece6d8;border-radius:4px"></div><div style="height:12px;width:60%;background:#ece6d8;border-radius:4px"></div><div style="margin-top:12px;padding-top:16px;border-top:1px solid @@LN@@;display:flex;justify-content:space-between;align-items:center"><span style="font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#3d5a40">Lire</span><span style="width:38px;height:38px;border-radius:50%;background:#12201a;color:#d6e26b;display:flex;align-items:center;justify-content:center">↗</span></div></div></div>`, 'cream')).join('');
  return hero(page, 'Blog', [], { noBtns: true }) + `<section style="padding:clamp(56px,7vw,96px) 0"><div style="${WRAP}"><div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px;max-width:820px"><p style="${PS}">${chip('H1 et introduction de la page Blog')}</p><p style="margin:0;${SMALL}">Aperçu de mise en page : articles du plus récent au plus ancien, les articles datés dans le futur ne sont pas listés. Les articles arrivent dans un lot ultérieur.</p></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:clamp(16px,2vw,24px)">${cardsB}</div></div></section>` + G5();
}
// ---------- globals ----------
const IN_MENU = [['/location-plantes-bureau/', 'Location de plantes'], ['/entretien-plantes-entreprise/', 'Entretien'], ['/mur-vegetal-interieur/', 'Murs végétaux'], ['/cadres-vegetaux-plantes-stabilisees/', 'Cadres stabilisés'], ['/abonnement-fleurs-entreprise/', 'Fleurs'], ['/location-plantes-evenementiel/', 'Événementiel'], ['/fleurs-sapins-noel/', 'Noël']];
const OUT_MENU = [['/espaces-verts-entreprise/', 'Espaces verts'], ['/entretien-espaces-verts-copropriete/', 'Copropriétés'], ['/creation-amenagement-espaces-verts/', 'Création'], ['/elagage-entreprise-marseille-aix/', 'Élagage'], ['/terrasses-vegetalisees-entreprise/', 'Terrasses'], ['/ruches-entreprise/', 'Ruches']];
const CITY_MENU = [['/location-entretien-plantes-bureau-paris/', 'Paris'], ['/entretien-location-plantes-nice/', 'Nice'], ['/entretien-location-plantes-marseille/', 'Marseille']];
const PACA_BADGE = `<span style="font-size:10px;font-weight:600;letter-spacing:.12em;padding:4px 9px;border-radius:999px;background:#d6e26b;color:#12201a">PACA</span>`;
const NAVLINK = `display:inline-flex;align-items:center;gap:5px;min-height:44px;padding:0 4px;font-size:clamp(13px,1.05vw,14px);letter-spacing:.02em;color:rgba(241,236,225,.8);text-decoration:none;background:transparent;border:0;cursor:pointer;white-space:nowrap`;
const NAVH = 'color:#f1ece1';
const MEGA_INFO = { services: ["Paysagisme d'intérieur", '/paysagisme-interieur/', "PACA et Île-de-France"], outdoor: ["Espaces verts d'entreprise", '/espaces-verts-entreprise/', "Provence-Alpes-Côte d'Azur uniquement"], villes: ['Nos villes', null, 'Des équipes locales'] };
const ddMenu = (key, label, items, badge) => {
  const [hub, hubHref, sub] = MEGA_INFO[key];
  const city = key === 'villes';
  const tiles = items.map(([h, l]) => city
    ? `<a href="#${h}" style="position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;min-height:200px;padding:18px;border-radius:20px;color:#f1ece1;text-decoration:none" style-hover="color:#f1ece1"><img src="${CARD_IMG[h]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform .6s"><span style="position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(18,32,26,0) 30%,rgba(18,32,26,.92) 100%)"></span><span style="${FH};font-weight:500;font-size:24px;letter-spacing:-.03em">${l}</span><span style="font-size:13px;color:rgba(241,236,225,.78)">${esc(NAME[h])}</span></a>`
    : `<a href="#${h}" style="display:flex;align-items:center;gap:14px;padding:8px;border-radius:16px;color:#f1ece1;text-decoration:none;transition:background .25s" style-hover="background:rgba(241,236,225,.08);color:#f1ece1"><span style="flex-shrink:0;width:56px;height:56px;border-radius:12px;overflow:hidden;background:rgba(241,236,225,.08)"><img src="${CARD_IMG[h] || IMG.plantes}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-size:15px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l}</span><span style="font-size:12px;color:rgba(241,236,225,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(NAME[h])}</span></span></a>`).join('');
  return `<div onMouseEnter="{{ dd.${key}On }}" onMouseLeave="{{ ddOff }}" onFocus="{{ dd.${key}On }}" style="position:static"><button aria-haspopup="true" aria-expanded="{{ dd.${key} }}" onClick="{{ dd.${key}Toggle }}" style="${NAVLINK}" style-hover="${NAVH}">${label}<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 3.5l3 3 3-3"></path></svg></button><sc-if value="{{ dd.${key} }}" hint-placeholder-val="{{ false }}"><div style="position:absolute;top:100%;left:0;right:0;padding-top:10px;z-index:60"><div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:12px;padding:12px;border-radius:32px;background:rgba(18,32,26,.96);backdrop-filter:blur(24px) saturate(1.4);-webkit-backdrop-filter:blur(24px) saturate(1.4);border:1px solid rgba(241,236,225,.14);box-shadow:0 30px 70px rgba(0,0,0,.45)">
<div style="padding:16px 16px 12px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 20px;padding:0 8px 12px;border-bottom:1px solid rgba(241,236,225,.12)"><span style="${FH};font-weight:500;font-size:26px;letter-spacing:-.03em;color:#f1ece1">${hubHref ? `<a href="#${hubHref}" style="color:#f1ece1;text-decoration:none" style-hover="color:#d6e26b">${hub}</a>` : hub}</span><span style="display:flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#d6e26b"><span style="width:6px;height:6px;border-radius:50%;background:#d6e26b"></span>${sub}</span></div><div style="display:grid;grid-template-columns:repeat(${city ? 3 : 2},minmax(0,1fr));gap:4px ${city ? '12px' : '8px'}">${tiles}</div></div>
<a href="#/devis/" style="position:relative;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;justify-content:flex-end;gap:14px;min-height:260px;padding:22px;border-radius:24px;color:#12201a;text-decoration:none;background:#d6e26b" style-hover="color:#12201a"><span style="position:absolute;right:-30px;top:-30px;width:180px;height:180px;border-radius:50%;background:rgba(18,32,26,.08);z-index:-1"></span><span style="font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase">Devis gratuit</span><span style="${FH};font-weight:500;font-size:28px;line-height:1;letter-spacing:-.03em">Votre devis gratuit en une <em style="${EMS('#12201a')}">minute</em></span><span style="display:inline-flex;align-items:center;gap:10px;align-self:flex-start;min-height:44px;padding:0 18px;border-radius:999px;background:#12201a;color:#f1ece1;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase">Recevoir mon devis ${LEAF}</span></a>
</div></div></sc-if></div>`;
};
const BIG = `${FH};font-weight:500;font-size:32px;letter-spacing:-.03em;color:#f1ece1;text-decoration:none`;
const MCHIP = 'display:inline-flex;align-items:center;min-height:44px;font-size:14px;padding:0 16px;border-radius:999px;border:1px solid rgba(241,236,225,.25);color:rgba(241,236,225,.88);text-decoration:none';
const HEADER = `<header style="position:fixed;top:14px;left:clamp(10px,2.5vw,32px);right:clamp(10px,2.5vw,32px);z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 8px 8px 8px;background:rgba(18,32,26,.62);backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);border:1px solid rgba(241,236,225,.12);border-radius:999px;box-shadow:0 10px 40px rgba(0,0,0,.25)">
<a href="#/" aria-label="Flora Concept, accueil" style="display:flex;align-items:center;text-decoration:none"><span style="width:48px;height:48px;border-radius:50%;overflow:hidden;background:#c5d300;flex-shrink:0;display:flex;align-items:center;justify-content:center"><img src="assets/flora-logo.png" alt="Flora Concept" style="width:112%;height:112%;object-fit:cover;display:block;max-width:none"></span></a>
<nav data-desk aria-label="Menu principal" style="display:flex;align-items:center;gap:clamp(8px,1.4vw,22px)">
<a href="#/" style="${NAVLINK}" style-hover="${NAVH}">Accueil</a>
${ddMenu('services', 'Services', IN_MENU)}
${ddMenu('outdoor', 'Extérieur PACA', OUT_MENU, true)}
${ddMenu('villes', 'Nos villes', CITY_MENU)}
<a href="#/vegetalisation-bureaux-multisites-paris-paca/" style="${NAVLINK}" style-hover="${NAVH}">Multi-sites</a>
<a href="#/blog/" style="${NAVLINK}" style-hover="${NAVH}">Blog</a>
<a href="#/faq/" style="${NAVLINK}" style-hover="${NAVH}">FAQ</a>
<a href="#/devis/" style="${BTN1};min-height:46px;padding:0 20px;letter-spacing:.06em;white-space:nowrap" style-hover="background:#f1ece1;color:#12201a;transform:scale(1.04)">${LEAF}Recevoir mon devis gratuit</a>
</nav>
<button data-mob onClick="{{ toggleMenu }}" aria-expanded="{{ menuOpen }}" aria-label="Menu" style="display:none;cursor:pointer;align-items:center;gap:10px;min-height:46px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding:0 20px;border-radius:999px;border:1px solid rgba(241,236,225,.3);background:transparent;color:#f1ece1">Menu</button>
</header>
<sc-if value="{{ menuOpen }}" hint-placeholder-val="{{ false }}"><div role="dialog" aria-label="Menu" style="position:fixed;inset:0;z-index:80;background:rgba(11,20,15,.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);overflow:auto;padding:96px clamp(20px,6vw,56px) 120px;display:flex;flex-direction:column;gap:28px">
<button onClick="{{ toggleMenu }}" aria-label="Fermer le menu" style="position:absolute;top:20px;right:20px;cursor:pointer;width:48px;height:48px;border-radius:50%;border:1px solid rgba(241,236,225,.3);background:transparent;color:#f1ece1;font-size:18px">✕</button>
<a href="#/devis/" style="${BTN1};align-self:flex-start">${LEAF}Recevoir mon devis gratuit</a>
<a href="#/" style="${BIG}">Accueil</a>
${[['Services', IN_MENU], ['Extérieur PACA', OUT_MENU], ['Nos villes', CITY_MENU]].map(([g, items]) => `<div style="display:flex;flex-direction:column;gap:12px"><span style="${BIG}">${g}</span><div style="display:flex;flex-wrap:wrap;gap:8px">${items.map(([h, l]) => `<a href="#${h}" style="${MCHIP}">${l}</a>`).join('')}</div></div>`).join('')}
${[['/vegetalisation-bureaux-multisites-paris-paca/', 'Multi-sites'], ['/blog/', 'Blog'], ['/faq/', 'FAQ']].map(([h, l]) => `<a href="#${h}" style="${BIG}">${l}</a>`).join('')}
</div></sc-if>`;
async function footer() {
  const readme = await readFile(DIR + 'README.md');
  const entity = readme.match(/> (Flora Concept est un spécialiste[^\n]+)/)[1];
  const col = (title, items) => `<div style="display:flex;flex-direction:column;gap:10px"><span style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(241,236,225,.55);margin-bottom:4px">${title}</span>${items.map(([h, l]) => `<a href="#${h}" style="font-size:15px;color:#f1ece1;text-decoration:none;min-height:30px;display:flex;align-items:center" style-hover="color:#d6e26b">${l}</a>`).join('')}</div>`;
  const svc7 = IN_MENU.map(([h]) => [h, NAME[h]]);
  const LEG = 'color:rgba(241,236,225,.7);text-decoration:none';
  return `<footer style="position:relative;overflow:hidden;background:#0b140f;color:#f1ece1;border-radius:clamp(28px,3.5vw,56px) clamp(28px,3.5vw,56px) 0 0;margin:clamp(8px,1vw,16px) clamp(8px,1vw,16px) 0;padding:clamp(64px,8vw,110px) clamp(20px,4vw,56px) 32px">
<div style="position:relative;z-index:1;max-width:1360px;margin:0 auto">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:40px;align-items:end;padding-bottom:clamp(48px,6vw,80px);border-bottom:1px solid rgba(241,236,225,.12)">
<h2 style="margin:0;${FH};font-weight:500;font-size:clamp(40px,5vw,72px);line-height:.95;letter-spacing:-.045em">Inscrivez-vous à la <em style="${EMS('#d6e26b')}">Newsletter</em></h2>
<sc-if value="{{ subscribed }}" hint-placeholder-val="{{ false }}"><p style="margin:0;font-size:18px;color:#d6e26b">Merci, vous êtes inscrit·e.</p></sc-if>
<sc-if value="{{ notSubscribed }}" hint-placeholder-val="{{ true }}"><form onSubmit="{{ subscribe }}" style="display:flex;gap:12px;border-bottom:1px solid #f1ece1;padding-bottom:10px"><input type="email" required placeholder="Email *" aria-label="Email" style="flex:1;min-width:0;font-size:18px;background:transparent;border:0;color:#f1ece1;outline:none;padding:10px 0"><button type="submit" style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:transparent;color:#d6e26b;border:0;min-height:44px" style-hover="color:#f1ece1">Envoyer ${LEAF}</button></form></sc-if>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:40px;padding:48px 0">
<div style="display:flex;flex-direction:column;gap:16px"><span style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:#c5d300;display:flex;align-items:center;justify-content:center"><img src="assets/flora-logo.png" alt="Flora Concept" style="width:112%;height:112%;object-fit:cover;max-width:none"></span><p style="margin:0;font-size:14px;line-height:1.6;color:rgba(241,236,225,.75)">${inl(entity)}</p><div style="display:flex;gap:14px"><a href="https://www.facebook.com/FloraConceptFR" target="_blank" style="font-size:14px;color:#f1ece1" style-hover="color:#d6e26b">Facebook</a><a href="https://www.instagram.com/flora_concept_france/" target="_blank" style="font-size:14px;color:#f1ece1" style-hover="color:#d6e26b">Instagram</a><a href="https://www.linkedin.com/company/flora-concept" target="_blank" style="font-size:14px;color:#f1ece1" style-hover="color:#d6e26b">LinkedIn</a></div></div>
${col('Services', svc7)}
<div style="display:flex;flex-direction:column;gap:28px">${col('Extérieur PACA', OUT_MENU.map(([h]) => [h, NAME[h]]))}${col('Nos villes', CITY_MENU.map(([h]) => [h, NAME[h]]))}</div>
${col('Flora Concept', [['/qui-sommes-nous/', 'Qui sommes-nous'], ['/faq/', 'FAQ'], ['/blog/', 'Blog'], ['/devis/', 'Devis']])}
</div>
<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 28px;padding:20px 0 40px;border-top:1px solid rgba(241,236,225,.12);font-size:14px;color:rgba(241,236,225,.7)">
<span>Flora Concept · Gémenos (13) · ${chip('adresse exacte')} · ${chip('téléphone')}</span>
<span>Provence-Alpes-Côte d'Azur · Île-de-France</span>
<span style="display:flex;flex-wrap:wrap;gap:6px 18px"><a href="#/mentions-legales/" style="${LEG}" style-hover="color:#d6e26b">Mentions légales</a><a href="#/politique-de-confidentialite/" style="${LEG}" style-hover="color:#d6e26b">Politique de confidentialité</a><a href="#/cookies/" style="${LEG}" style-hover="color:#d6e26b">Cookies</a><button onClick="{{ manageCookies }}" style="background:none;border:0;padding:0;font:inherit;color:rgba(241,236,225,.7);cursor:pointer;text-decoration:underline;text-underline-offset:3px">Gestion des cookies</button></span>
</div>
<div style="${FH};font-weight:500;font-size:clamp(72px,19vw,300px);line-height:.8;letter-spacing:-.04em;color:#1b2e24;white-space:nowrap;overflow:hidden">Flora <em style="font-family:'Instrument Serif',serif;font-weight:400">concept</em></div>
</div>
${DRAW}
</footer>`;
}
const BAR = `<sc-if value="{{ notDevis }}" hint-placeholder-val="{{ true }}"><div data-bar style="position:fixed;left:0;right:0;bottom:0;z-index:55;display:none;grid-template-columns:1fr 1fr;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(18,32,26,.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(241,236,225,.12)"><a href="#/devis/" style="${BTN1};min-height:48px;padding:0 12px">Devis</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="${BTN2};min-height:48px;padding:0 12px;color:#f1ece1;border-color:rgba(241,236,225,.5)">Appeler</a></div></sc-if>`;
const CBTN = `flex:1;min-width:140px;min-height:48px;padding:0 16px;border-radius:999px;border:1px solid rgba(241,236,225,.4);background:transparent;color:#f1ece1;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer`;
const COOKIE = `<sc-if value="{{ showCookie }}" hint-placeholder-val="{{ false }}"><div data-cookie role="dialog" aria-label="Cookies" style="position:fixed;left:12px;right:12px;bottom:12px;z-index:70;max-width:640px;margin:0 auto;padding:22px;background:rgba(18,32,26,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#f1ece1;border:1px solid rgba(241,236,225,.14);border-radius:28px;box-shadow:0 20px 50px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:14px">
<p style="margin:0;font-size:15px;line-height:1.55">Nous mesurons l'audience du site uniquement avec votre accord. <a href="#/cookies/" style="color:#d6e26b;text-decoration:underline">Politique cookies</a></p>
<sc-if value="{{ cpanel }}" hint-placeholder-val="{{ false }}"><div style="display:flex;flex-direction:column;gap:4px;font-size:15px"><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked disabled style="width:20px;height:20px;accent-color:#d6e26b">Strictement nécessaires</label><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked="{{ c1 }}" onChange="{{ toggleC1 }}" style="width:20px;height:20px;accent-color:#d6e26b">Mesure d'audience</label><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked="{{ c2 }}" onChange="{{ toggleC2 }}" style="width:20px;height:20px;accent-color:#d6e26b">Analyse d'ergonomie</label></div></sc-if>
<div style="display:flex;flex-wrap:wrap;gap:8px"><button onClick="{{ cookieAll }}" style="${CBTN};background:#d6e26b;color:#12201a;border-color:#d6e26b" style-hover="background:#f1ece1;border-color:#f1ece1">Tout accepter</button><button onClick="{{ cookieNone }}" style="${CBTN}" style-hover="background:rgba(241,236,225,.1)">Tout refuser</button><button onClick="{{ cookieCustom }}" style="${CBTN}" style-hover="background:rgba(241,236,225,.1)">{{ customLabel }}</button></div>
</div></sc-if>`;
const TITLES_PLACEHOLDER = '__TITLES__';
// ---------- logic ----------
const LOGIC_FN = () => `class Component extends DCLogic {
  state = { page: null, dd: null, menu: false, season: true, cookie: undefined, cpanel: false, c1: false, c2: false, err: {}, sent: false, sending: false, zone: '', started: false };
  componentDidMount() {
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.io = new IntersectionObserver(es => { let i = 0; es.forEach(e => { if (e.isIntersecting) { this.io.unobserve(e.target); this.reveal(e.target, i++ * 90); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    this.onScroll = () => {
      const d = document.documentElement, y = window.scrollY;
      const bar = document.querySelector('[data-progress]');
      if (bar) bar.style.width = (100 * y / Math.max(1, d.scrollHeight - innerHeight)) + '%';
      const p = document.querySelector('[data-parallax]');
      if (p && !this.reduce) p.style.transform = 'translateY(' + (y * 0.35) + 'px) scale(' + (1.12 + y * 0.0002) + ')';
      document.querySelectorAll('[data-faqwrap]').forEach(w => { const r = w.getBoundingClientRect(); const k = Math.min(1, Math.max(0, (innerHeight * 0.55 - r.top) / Math.max(1, r.height - innerHeight * 0.3))); const b = w.querySelector('[data-faqbar]'); if (b) b.style.transform = 'scaleX(' + k + ')'; const n = w.querySelectorAll('details').length; const c = w.querySelector('[data-faqcount]'); if (c && n) c.textContent = String(Math.max(1, Math.ceil(k * n))).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'); });
    };
    addEventListener('scroll', this.onScroll, { passive: true });
    if (matchMedia('(pointer:fine)').matches && !this.reduce) this.cursor();
    this.onIco = e => {
      const b = e.target.closest && e.target.closest('a,span,button'); if (!b || this.reduce) return;
      const ic = b.querySelector(':scope > svg[data-ico]'); if (!ic || ic.dataset.busy) return;
      ic.dataset.busy = 1; ic.style.animation = (ic.querySelector('circle') ? 'floraSpin .9s' : 'floraWiggle .7s') + ' cubic-bezier(.2,.8,.2,1)';
      setTimeout(() => { ic.style.animation = ic.dataset.idle || ''; delete ic.dataset.busy; }, 950);
    };
    addEventListener('mouseover', this.onIco);
    this.onImgErr = e => { if (e.target && e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; };
    addEventListener('error', this.onImgErr, true);
    this.fx(); this.onScroll();
    this.onHash = () => this.route(false);
    window.addEventListener('hashchange', this.onHash);
    let c = null; try { c = localStorage.getItem('fc_consent'); } catch (e) {}
    this.setState({ cookie: c });
    this.route(true);
  }
  componentDidUpdate() { requestAnimationFrame(() => { this.fx(); this.onScroll(); }); }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHash); removeEventListener('scroll', this.onScroll); removeEventListener('mouseover', this.onIco);
    this.io && this.io.disconnect(); cancelAnimationFrame(this.raf); this.dot && this.dot.remove();
    removeEventListener('mousemove', this.onMove); removeEventListener('mouseover', this.onOver);
  }
  route(first) {
    const SLUGS = ${JSON.stringify(Object.fromEntries(PAGES.map(p => [p.slug, p.id])))};
    const TITLES = ${JSON.stringify(TITLES_PLACEHOLDER)};
    const ZONE = ${JSON.stringify(ZONE)};
    let h = location.hash || '';
    if (!h.startsWith('#/') && first && this.props.startPage) h = '#' + this.props.startPage;
    let path = '/', anchor = null;
    if (h.startsWith('#/')) { const r = h.slice(1); const i = r.indexOf('#'); path = i >= 0 ? r.slice(0, i) : r; anchor = i >= 0 ? r.slice(i + 1) : null; }
    if (path && !path.endsWith('/')) path += '/';
    const id = SLUGS[path] || 'p404';
    const prev = this.state.page;
    const zone = id === 'p15' ? (ZONE[prev] || this.state.zone) : this.state.zone;
    this.setState({ page: id, dd: null, menu: false, zone, sent: id === 'p15' ? false : this.state.sent, err: {} }, () => {
      document.title = TITLES[id] || 'Flora Concept';
      if (anchor) { const el = document.getElementById(anchor); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90); }
      else if (!first) window.scrollTo(0, 0);
    });
  }
  push(ev, extra) { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: ev, source: this.state.page }, extra || {})); }
  saveConsent(v) { try { localStorage.setItem('fc_consent', v); } catch (e) {} this.setState({ cookie: v, cpanel: false }); }
  renderVals() {
    const page = this.state.page || 'p01';
    const ids = ${JSON.stringify(PAGES.map(p => p.id))};
    const pg = {}; ids.forEach(i => pg[i] = page === i);
    const dd = {};
    ['services', 'outdoor', 'villes'].forEach(k => { dd[k] = this.state.dd === k; dd[k + 'On'] = () => this.setState({ dd: k }); dd[k + 'Toggle'] = () => this.setState(s => ({ dd: s.dd === k ? null : k })); });
    const ZL = { paris: 'Paris et Île-de-France', nice: "Nice et Côte d'Azur", marseille: 'Marseille et Provence' };
    const err = this.state.err || {};
    const m = new Date().getMonth();
    return {
      subscribed: !!this.state.subscribed, notSubscribed: !this.state.subscribed, subscribe: e => { e.preventDefault(); this.setState({ subscribed: true }); },
      pg, dd, ddOff: () => this.setState({ dd: null }),
      notDevis: page !== 'p15',
      menuOpen: this.state.menu, toggleMenu: () => this.setState(s => ({ menu: !s.menu })),
      seasonal: page === 'p01' && m >= 9 && this.state.season, closeSeason: () => this.setState({ season: false }),
      showPending: this.props.showPending ?? true,
      showHidden: this.props.showHidden ?? false,
      bodyFont: this.props.bodyFont ?? "'Familjen Grotesk'",
      showCookie: this.state.cookie === null,
      cpanel: this.state.cpanel, c1: this.state.c1, c2: this.state.c2,
      toggleC1: () => this.setState(s => ({ c1: !s.c1 })), toggleC2: () => this.setState(s => ({ c2: !s.c2 })),
      customLabel: this.state.cpanel ? 'Enregistrer' : 'Personnaliser',
      cookieAll: () => this.saveConsent('all'), cookieNone: () => this.saveConsent('none'),
      cookieCustom: () => this.state.cpanel ? this.saveConsent((this.state.c1 ? 'a' : '') + (this.state.c2 ? 'c' : '') || 'none') : this.setState({ cpanel: true }),
      manageCookies: () => this.setState({ cookie: null, cpanel: true }),
      callClick: () => this.push('call_click', { zone: ZONE_OF(page) }),
      zone: this.state.zone, setZone: e => this.setState({ zone: e.currentTarget.value }),
      zoneBg: { marseille: this.state.zone === 'marseille' ? '#12201a' : 'transparent', nice: this.state.zone === 'nice' ? '#12201a' : 'transparent', paris: this.state.zone === 'paris' ? '#12201a' : 'transparent' },
      zoneFg: { marseille: this.state.zone === 'marseille' ? '#f1ece1' : '#12201a', nice: this.state.zone === 'nice' ? '#f1ece1' : '#12201a', paris: this.state.zone === 'paris' ? '#f1ece1' : '#12201a' },
      zoneLabel: ZL[this.state.zone] || "Provence-Alpes-Côte d'Azur ou Île-de-France",
      err, errB: { nom: err.nom ? '#b3261e' : '#12201a', contact: err.contact ? '#b3261e' : '#12201a', besoin: err.besoin ? '#b3261e' : '#12201a' },
      sent: this.state.sent, notSent: !this.state.sent,
      submitLabel: this.state.sending ? 'Envoi en cours…' : 'Recevoir mon devis gratuit',
      sendOpacity: this.state.sending ? '.6' : '1',
      devisStart: () => { if (!this.state.started) { this.setState({ started: true }); this.push('devis_start', { zone: this.state.zone }); } },
      submitDevis: e => {
        e.preventDefault();
        if (this.state.sending) return;
        const f = e.target.elements;
        if (f.website && f.website.value) { this.setState({ sent: true }); return; }
        const nom = f.nom.value.trim(), contact = f.contact.value.trim(), besoin = f.besoin.value.trim();
        const okContact = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(contact) || contact.replace(/[^0-9]/g, '').length >= 10;
        const er = {};
        if (!nom) er.nom = 'Indiquez votre nom pour que nous sachions à qui répondre.';
        if (!okContact) er.contact = 'Indiquez un email ou un numéro de téléphone pour que nous puissions vous répondre.';
        if (!besoin) er.besoin = 'Décrivez votre besoin en une phrase, cela suffit.';
        if (Object.keys(er).length) { this.setState({ err: er }); const k = Object.keys(er)[0]; const el = document.getElementById('f-' + k); if (el) el.focus(); return; }
        this.setState({ err: {}, sending: true });
        setTimeout(() => { this.setState({ sending: false, sent: true }); this.push('devis_submit', { zone: this.state.zone }); window.scrollTo(0, 0); }, 700);
      }
    };
  }
}
function ZONE_OF(p) { return (${JSON.stringify(ZONE)})[p] || ''; }`;

// ---------- assemble ----------
const pagesHtml = [];
for (const p of PAGES) {
  const html = await buildPage(p);
  pagesHtml.push(`<sc-if value="{{ pg.${p.id} }}" hint-placeholder-val="{{ ${p.id === 'p01' ? 'true' : 'false'} }}">\n<main data-screen-label="${esc(p.name || 'Accueil')}">\n${crumb(p)}\n${html}\n</main>\n</sc-if>`);
}
const HELMET = `<helmet>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..700&family=Instrument+Serif:ital@0;1&family=Familjen+Grotesk:wght@400;500;600&family=Hanken+Grotesk:wght@400;600&display=swap" rel="stylesheet">
<style>
body{margin:0;background:#12201a;color:#f1ece1;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
a{color:#d6e26b;text-decoration:none}
a:hover{color:#f1ece1}
@keyframes floraBob{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes floraSpin{0%{transform:rotate(0) scale(1)}60%{transform:rotate(220deg) scale(1.3)}100%{transform:rotate(360deg) scale(1)}}
@keyframes floraWiggle{0%{transform:rotate(0) scale(1)}30%{transform:rotate(-24deg) scale(1.25)}60%{transform:rotate(14deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}
@keyframes floraSway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.8deg)}}
@keyframes floraMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
:focus-visible{outline:2px solid #d6e26b;outline-offset:2px}
input,select,textarea,button{font-family:inherit}
::placeholder{color:rgba(18,32,26,.45)}
summary::-webkit-details-marker{display:none}
details[open]>summary>span:last-child{transform:rotate(-35deg)}
details>summary>span:last-child{transition:transform .4s cubic-bezier(.2,.8,.2,1)}
@media (max-width:1240px){[data-desk]{display:none!important}[data-mob]{display:flex!important}[data-bar]{display:grid!important}[data-root]{padding-bottom:72px}[data-cookie]{bottom:84px!important}}
@media (max-width:1100px){[data-bento]{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-bento-odd] [data-bento-img]{grid-column:span 2;grid-row:auto!important;aspect-ratio:16/7}}
@media (max-width:640px){[data-bento]{grid-template-columns:1fr!important}[data-bento-odd] [data-bento-img]{grid-column:auto!important;aspect-ratio:4/3}[data-faqa]{padding-left:0!important}details summary{gap:12px!important}}
@media (max-width:860px){[data-tall]{aspect-ratio:4/3!important;max-height:440px}}
h1,h2,h3{overflow-wrap:break-word;hyphens:auto;-webkit-hyphens:auto}
img{max-width:100%}
@media (max-width:860px){[data-bento-img]{grid-row:auto!important;aspect-ratio:4/3}[data-sticky]{position:static!important}[data-hero]{grid-template-columns:1fr!important}[data-split]{grid-template-columns:1fr!important}[data-tdesk]{display:none!important}[data-tmob]{display:flex!important}}
</style>
</helmet>`;
const BODY = theme(`${HELMET}
<div data-root data-flora-root lang="fr" style="font-family:{{ bodyFont }},sans-serif;min-height:100vh;background:#12201a;color:#f1ece1;overflow-x:clip">
<div data-progress style="position:fixed;top:0;left:0;height:3px;width:0;background:#d6e26b;z-index:60"></div>
${HEADER}
${pagesHtml.join('\n')}
${await footer()}
${BAR}
${COOKIE}
</div>`, 'dark');
const logic0 = LOGIC_FN().replace(JSON.stringify(TITLES_PLACEHOLDER), JSON.stringify(TITLES));
const V3M = V3.slice(V3.indexOf('  fx() {'), V3.indexOf('  go(p) {'));
const logic = logic0.replace('  push(ev, extra)', () => V3M + '  push(ev, extra)');
const props = { startPage: { editor: 'enum', options: PAGES.map(p => p.slug), default: '/', tsType: 'string' }, showPending: { editor: 'boolean', default: true, tsType: 'boolean' }, showHidden: { editor: 'boolean', default: false, tsType: 'boolean' }, bodyFont: { editor: 'enum', options: ["'Familjen Grotesk'", "'Hanken Grotesk'"], default: "'Familjen Grotesk'", tsType: 'string' } };
const file = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
${BODY}
</x-dc>
<template id="__bundler_thumbnail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c4d401"/><text x="50" y="62" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="600" font-size="34" fill="#212121">FC</text></svg></template>
<script type="text/x-dc" data-dc-script data-props="${esc(JSON.stringify(props))}">
${logic}
</script>
</body>
</html>
`;
await saveFile('Flora Concept v5.dc.html', file);
log('ok', file.length, Object.keys(TITLES).length);
