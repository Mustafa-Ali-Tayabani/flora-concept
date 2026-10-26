// Generates "Flora Concept v4.dc.html" from contenu/*.md (verbatim copy)
const DIR = 'uploads/floraconcept-livraison-dev-2026-10-08/contenu/';
const INK = '#212121', MUTED = '#5b5b5b', SURF = '#f4f4f4', LINE = '#dedede', LIME = '#c4d401';
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
const HERO_IMG = { p01: 'assets/hero-cover.png', p02: 'assets/banner-paysagisme.png', p08: 'assets/banner-evenementiel.png', p16: 'assets/hero-equipe.png', p18: 'assets/banner-espaces-verts.png', p18a: 'assets/equipe-espaces-verts.png' };
const HERO_SHOT = { p03: 'plantes de bureau', p04: 'jardinier en intervention', p05: 'mur végétal naturel', p06: 'cadre ou logo stabilisé', p07: "composition florale à l'accueil", p09: 'hall décoré pour Noël', p10: 'site parisien', p11: "hôtel de la Côte d'Azur", p12: 'bureau à Marseille ou Aix', p13: 'site client multi-sites', p18b: 'jardin créé (avant / après)', p18c: 'élagage à la nacelle', p18d: 'terrasse végétalisée', p19: 'rucher du Luberon' };
const CARD_IMG = { '/abonnement-fleurs-entreprise/': U + '2024/08/bouquet-de-fleur.jpg', '/espaces-verts-entreprise/': U + '2024/07/entretien-flora.jpg', '/creation-amenagement-espaces-verts/': U + '2024/08/amenagement.jpg', '/elagage-entreprise-marseille-aix/': U + '2024/10/taille-de-vegetaux.jpg', '/location-plantes-bureau/': U + '2024/07/plante-grasse.jpg' };
const ZONE = { p10: 'paris', p11: 'nice', p12: 'marseille', p18: 'marseille', p18a: 'marseille', p18b: 'marseille', p18c: 'marseille', p18d: 'marseille', p19: 'marseille' };

// ---------- style atoms ----------
const FH = "font-family:Poppins,sans-serif";
const WRAP = 'max-width:1200px;margin:0 auto;padding:0 clamp(20px,4vw,40px)';
const H1S = `margin:0;${FH};font-weight:600;font-size:clamp(30px,4vw,48px);line-height:1.12;letter-spacing:-.02em;color:${INK};text-wrap:balance`;
const H2S = `margin:0;${FH};font-weight:600;font-size:clamp(24px,2.6vw,34px);line-height:1.2;letter-spacing:-.015em;color:${INK};text-wrap:balance`;
const H3S = `margin:0;${FH};font-weight:600;font-size:19px;line-height:1.35;color:${INK};text-wrap:balance`;
const PS = `margin:0;font-size:17px;line-height:1.6;color:${INK};max-width:68ch;text-wrap:pretty`;
const SMALL = `font-size:14px;line-height:1.5;color:${MUTED}`;
const BTN1 = `display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 26px;border-radius:8px;background:${LIME};color:${INK};${FH};font-weight:600;font-size:16px;text-decoration:none;border:0;cursor:pointer;transition:background .18s`;
const BTN1H = `background:#b0bf00;color:${INK}`;
const BTN2 = `display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 26px;border-radius:8px;background:transparent;color:${INK};border:2px solid ${INK};${FH};font-weight:600;font-size:16px;text-decoration:none;cursor:pointer;transition:background .18s,color .18s`;
const BTN2H = `background:${INK};color:#ffffff`;
const SEC = (bg, inner, extra = '') => `<section style="background:${bg};padding:clamp(56px,7vw,88px) 0${extra}"><div style="${WRAP}">${inner}</div></section>`;

// ---------- inline markdown ----------
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const chip = note => `<sc-if value="{{ showPending }}" hint-placeholder-val="{{ true }}"><span style="display:inline-block;vertical-align:middle;margin:2px 0;font-family:Poppins,sans-serif;font-size:12px;font-weight:500;line-height:1.45;padding:3px 9px;border-radius:4px;background:#fff6cc;color:#4d4000;border:1px dashed #a08a00;max-width:100%">À FOURNIR${note ? ' · ' + note : ''}</span></sc-if>`;
const link = (slug, label) => `<a href="#${slug}">${label}</a>`;
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
const photo = (label, ratio = '4/3', src) => src
  ? `<img src="${src}" alt="${esc(label)}" loading="lazy" style="display:block;width:100%;aspect-ratio:${ratio};object-fit:cover;border-radius:8px;background:#e6e6e6">`
  : `<div style="width:100%;aspect-ratio:${ratio};border-radius:8px;background:#e4e4e4;display:flex;align-items:center;justify-content:center;padding:12px;text-align:center;${SMALL}">Photo : ${esc(label)}</div>`;
const sq = `<span style="flex-shrink:0;width:9px;height:9px;margin-top:9px;background:${LIME}"></span>`;
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
  const desk = `<div data-tdesk style="overflow:hidden;border-radius:8px;border:1px solid ${LINE}"><table style="width:100%;border-collapse:collapse;font-size:16px;line-height:1.5"><thead><tr>${head.map(h => `<th style="text-align:left;padding:14px 18px;background:${INK};color:#ffffff;${FH};font-weight:600;font-size:15px">${inl(h)}</th>`).join('')}</tr></thead><tbody>${body.map((r, i) => `<tr style="background:${i % 2 ? SURF : '#ffffff'}">${r.map((c, j) => `<td style="padding:14px 18px;vertical-align:top;border-top:1px solid ${LINE};${j === 0 ? 'font-weight:600' : ''}">${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const firstIsCriterion = head.length > 2;
  const mob = `<div data-tmob style="display:none;flex-direction:column;gap:12px">${body.map(r => `<div style="border:1px solid ${LINE};border-radius:8px;padding:16px 18px;background:#ffffff;display:flex;flex-direction:column;gap:10px">${firstIsCriterion ? `<div style="${FH};font-weight:600;font-size:17px">${inl(r[0])}</div>` : ''}${r.slice(firstIsCriterion ? 1 : 0).map((c, j) => `<div style="display:flex;flex-direction:column;gap:2px"><span style="${SMALL}">${inl(head[j + (firstIsCriterion ? 1 : 0)])}</span><span style="font-size:16px;line-height:1.5">${inl(c)}</span></div>`).join('')}</div>`).join('')}</div>`;
  return desk + mob;
}
function steps(items, vertical) {
  const it = items.map((x, i) => ({ ...leadSplit(x), n: i + 1 }));
  const num = n => `<span style="flex-shrink:0;width:48px;height:48px;border-radius:50%;background:${LIME};color:${INK};${FH};font-weight:600;font-size:20px;display:flex;align-items:center;justify-content:center">${n}</span>`;
  if (vertical) return `<ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;max-width:820px">${it.map((s, i) => `<li style="display:flex;gap:20px;padding:20px 0;${i ? `border-top:1px solid ${LINE}` : ''}">${num(s.n)}<div style="display:flex;flex-direction:column;gap:6px;padding-top:10px">${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS}">${inl(s.text)}</p></div></li>`).join('')}</ol>`;
  return `<ol style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:32px">${it.map(s => `<li style="display:flex;flex-direction:column;gap:14px">${num(s.n)}${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS};font-size:16px">${inl(s.text)}</p></li>`).join('')}</ol>`;
}
function args(items) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:32px 56px">${items.map(x => { const s = leadSplit(x); return `<div style="display:flex;flex-direction:column;gap:8px;padding-top:20px;border-top:2px solid ${INK}">${s.lead ? `<h3 style="${H3S}">${inl(s.lead)}</h3>` : ''}<p style="${PS};font-size:16px">${inl(s.text)}</p></div>`; }).join('')}</div>`;
}
function cards(items, opts = {}) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,${opts.min || 250}px),1fr));gap:28px 24px">${items.map(c => `<div style="display:flex;flex-direction:column;gap:12px">${photo(c.shot || c.titleText, '4/3', c.img)}<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><h3 style="${H3S}">${c.titleHtml}</h3>${c.paca ? `<span style="${FH};font-size:11px;font-weight:600;letter-spacing:.08em;padding:3px 8px;border-radius:4px;background:${INK};color:#ffffff">PACA</span>` : ''}</div>${c.text ? `<p style="margin:0;font-size:16px;line-height:1.55;color:${INK}">${c.text}</p>` : ''}${c.links && c.links.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:auto;${FH};font-weight:600;font-size:15px">${c.links.map(l => link(l[0], l[1])).join('')}</div>` : ''}</div>`).join('')}</div>`;
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
  return `<div style="display:flex;flex-direction:column;max-width:820px">${items.map((f, i) => `<div style="padding:22px 0;${i ? `border-top:1px solid ${LINE}` : ''};display:flex;flex-direction:column;gap:8px"><h3 style="${H3S}">${inl(f.q)}</h3>${f.a.map(a => `<p style="${PS};font-size:16px">${inl(a)}</p>`).join('')}</div>`).join('')}</div>`;
}
const head2 = (t, sub) => `<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:36px"><h2 style="${H2S}">${inl(t)}</h2>${sub || ''}</div>`;
function hiddenBlock(title, kind, note) {
  const n = { logos: 6, team: 4, figures: 3, timeline: 4 }[kind] || 3;
  const lab = { logos: 'logo client', team: 'portrait', figures: 'chiffre vérifié', timeline: 'étape datée' }[kind] || 'photo chantier';
  const ratio = { logos: '3/1', team: '1/1', figures: '2/1', timeline: '2/1' }[kind] || '3/2';
  const grid = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,${kind === 'logos' ? 150 : 240}px),1fr));gap:20px">${Array.from({ length: n }, () => `<div style="display:flex;flex-direction:column;gap:10px"><div style="aspect-ratio:${ratio};border-radius:8px;background:#e4e4e4;display:flex;align-items:center;justify-content:center;${SMALL}">${lab}</div>${kind === 'logos' || kind === 'figures' ? '' : `<div style="height:12px;width:70%;background:#e4e4e4;border-radius:3px"></div><div style="height:12px;width:45%;background:#ececec;border-radius:3px"></div>`}</div>`).join('')}</div>`;
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
    if (/^FAQ/.test(s.raw)) { out.push({ surface: true, html: head2('Questions fréquentes') + faqList(faqItems(s.lines)) }); continue; }
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
        const regions = bl[0].items.filter(x => !/Notre base/.test(x)).map(x => { const ls = leadSplit(x); const sl = [...x.matchAll(/`(\/[^`]*)`/g)].map(m => m[1]); return `<div style="display:flex;flex-direction:column;gap:14px;padding:28px;border-radius:8px;border:1px solid ${LINE};background:#ffffff"><h3 style="${H3S};font-size:22px">${inl(ls.lead)}</h3><p style="${PS};font-size:16px">${inl(ls.text.replace(/\s*→[\s\S]*$/, ''))}</p><div style="margin-top:auto;display:flex;flex-wrap:wrap;gap:8px 20px;${FH};font-weight:600;font-size:15px">${sl.map(h => link(h, NAME[h])).join('')}</div></div>`; });
        out.push({ surface: false, html: head2(t) + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:24px">${regions.join('')}</div>` }); continue;
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
      out.push({ surface: true, html: head2(t) + (items ? args(items) : '') + (rest.length ? `<div style="display:flex;flex-direction:column;gap:16px;${items ? 'margin-top:28px' : ''}">${renderGeneric(rest)}</div>` : '') }); continue;
    }
    if (tbl) {
      const pre = /Naturel ou stabilisé/.test(t) ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:20px;margin-bottom:28px">${photo('mur végétal naturel', '3/2')}${photo('mur végétal stabilisé', '3/2')}</div>` : '';
      out.push({ surface: null, html: head2(t) + pre + `<div style="display:flex;flex-direction:column;gap:24px">${renderGeneric(bl)}</div>` }); continue;
    }
    if (ol) {
      const vertical = ol.items.length > 4 || /^Comment nous couvrons/.test(t);
      const others = bl.filter(b => b !== ol);
      out.push({ surface: null, html: head2(t) + steps(ol.items, vertical) + (others.length ? `<div style="display:flex;flex-direction:column;gap:16px;margin-top:28px">${renderGeneric(others)}</div>` : '') }); continue;
    }
    if (hasH3) {
      const intro = []; const subs = []; let cur = null;
      for (const b of bl) { if (b.t === 'h3') { cur = { h: b.text, bl: [] }; subs.push(cur); } else if (cur) cur.bl.push(b); else intro.push(b); }
      out.push({ surface: null, html: head2(t, intro.length ? `<div style="display:flex;flex-direction:column;gap:14px">${renderGeneric(intro)}</div>` : '') + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:0 56px">${subs.map(x => `<div style="display:flex;flex-direction:column;gap:10px;padding:24px 0;border-top:1px solid ${LINE}"><h3 style="${H3S}">${inl(x.h)}</h3>${renderGeneric(x.bl)}</div>`).join('')}</div>` }); continue;
    }
    if (ul && !bl.some(b => b.t === 'p' && bl.indexOf(b) < bl.indexOf(ul))) {
      const others = bl.filter(b => b !== ul);
      out.push({ surface: null, html: head2(t) + checklist(ul.items) + (others.length ? `<div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">${renderGeneric(others)}</div>` : '') }); continue;
    }
    // S21 text
    const special = SURF_TXT_RE.test(t);
    const paris = /^Qui intervient à Paris/.test(t);
    const luberon = /^Le rucher du Luberon/.test(t);
    let inner = head2(t) + `<div style="display:flex;flex-direction:column;gap:16px">${renderGeneric(bl)}</div>`;
    if (paris) inner = `<div data-split style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:40px;align-items:start;padding:clamp(24px,4vw,48px);background:#ffffff;border-radius:8px;border-left:6px solid ${LIME}">${`<div>${inner}</div>`}${photo("équipe parisienne", '4/3')}</div>`;
    if (luberon) inner = head2(t) + `<div style="margin-bottom:28px">${photo('rucher du Luberon (pleine largeur)', '21/9')}</div><div style="display:flex;flex-direction:column;gap:16px">${renderGeneric(bl)}</div>`;
    out.push({ surface: special ? true : null, html: inner });
  }
  return out;
}
function HERO_IMG_BY_SLUG(c) { return undefined; }
function profile(items) {
  return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px 32px">${items.map(x => { const sl = (x.match(/`(\/[^`]*)`/) || [])[1]; const ls = leadSplit(x.replace(/\s*→\s*`[^`]*`\s*$/, '')); return `<a href="#${sl}" style="display:flex;align-items:center;gap:16px;min-height:72px;padding:16px 4px 16px 18px;border-left:3px solid ${LIME};color:${INK};text-decoration:none" style-hover="background:${SURF}"><span style="flex:1;display:flex;flex-direction:column;gap:4px"><span style="${FH};font-weight:600;font-size:17px">${inl(ls.lead)}</span><span style="font-size:15px;line-height:1.5;color:${MUTED}">${inl(ls.text)}</span></span><span aria-hidden="true" style="${FH};font-size:20px;padding-right:8px">→</span></a>`; }).join('')}</div>`;
}
function rhythm(sections) {
  // alternate backgrounds, forced surface sections keep surface
  let prev = true; // hero is white -> first section should be surface? hero white => start alternate
  prev = false;
  const res = [];
  sections.forEach((s, i) => {
    if (s.hidden) { res.push(s.html.replace('@@SEC@@', `<section style="background:#ffffff;padding:clamp(40px,5vw,64px) 0"><div style="${WRAP}">`).replace('@@END@@', '</div></section>')); return; }
    let surf;
    if (s.surface === true) surf = true;
    else if (s.surface === false) surf = false;
    else { const next = sections.slice(i + 1).find(x => !x.hidden); surf = !prev; if (surf && next && next.surface === true) surf = false; }
    if (surf && prev && s.surface !== true) surf = false;
    prev = surf;
    res.push(SEC(surf ? SURF : '#ffffff', s.html));
  });
  return res.join('\n');
}
const crumb = page => {
  if (page.kind === 'home') return '';
  const parts = [link('/', 'Accueil')];
  if (page.parent) parts.push(link(BY[page.parent].slug, BY[page.parent].name));
  parts.push(`<span aria-current="page" style="color:${INK}">${esc(page.name)}</span>`);
  return `<nav aria-label="Fil d'Ariane" style="${WRAP};padding-top:20px;padding-bottom:4px"><div style="display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;${SMALL}">${parts.join(`<span aria-hidden="true">›</span>`)}</div></nav>`;
};
const ZONE_BAND = `<div style="display:inline-flex;align-items:center;gap:10px;align-self:flex-start;padding:8px 14px;border-radius:6px;background:${SURF};${FH};font-weight:500;font-size:14px;color:${INK}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>Interventions en Provence-Alpes-Côte d'Azur</div>`;
const BTNS = (primary = 'Recevoir mon devis gratuit') => `<div style="display:flex;flex-wrap:wrap;gap:12px"><a href="#/devis/" style="${BTN1}" style-hover="${BTN1H}">${primary}</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="${BTN2}" style-hover="${BTN2H}">Appeler</a></div>`;
function hero(page, h1, answer, opts = {}) {
  const img = HERO_IMG[page.id];
  const ph = img ? `<img src="${img}" alt="${esc(page.name)}" fetchpriority="high" style="display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;background:#e6e6e6">` : photo(HERO_SHOT[page.id] || page.name, '4/3');
  const text = `<div style="display:flex;flex-direction:column;gap:22px"><h1 style="${H1S}">${inl(h1)}</h1>${page.outdoor ? ZONE_BAND : ''}<div style="display:flex;flex-direction:column;gap:14px">${answer.map(p => `<p style="${PS}">${inl(p)}</p>`).join('')}</div>${opts.noBtns ? '' : BTNS()}</div>`;
  if (opts.noPhoto) return `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(48px,6vw,72px)"><div style="${WRAP}"><div style="max-width:820px">${text}</div></div></section>`;
  return `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(48px,6vw,72px)"><div style="${WRAP}"><div data-hero style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,4vw,56px);align-items:start">${text}${ph}</div></div></section>`;
}
const G5 = (line = 'Votre devis gratuit en une minute') => `<section style="background:${INK};color:#ffffff;padding:clamp(56px,7vw,88px) 0"><div style="${WRAP};display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:28px"><h2 style="${H2S};color:#ffffff;max-width:640px">${line}</h2><div style="display:flex;flex-wrap:wrap;align-items:center;gap:20px"><a href="#/devis/" style="${BTN1}" style-hover="${BTN1H}">Recevoir mon devis gratuit</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="color:#ffffff;font-size:16px;text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px;text-underline-offset:4px">ou appelez-nous</a></div></div></section>`;
const sec = (secs, re) => secs.find(s => re.test(s.raw));
const paras = s => s ? blocks(s.lines).filter(b => b.t === 'p').map(b => b.text) : [];
const h1Of = secs => { const s = sec(secs, /^H1$/); return s.lines.map(l => l.trim()).find(l => l && !l.startsWith('**')); };
const titleOf = secs => { const s = sec(secs, /^Metadata/); if (!s) return null; const l = s.lines.find(x => /\*\*Title\*\*/.test(x)); return l ? l.replace(/^.*\*\*Title\*\*\s*:\s*/, '').replace(/\s*\(\d+ car\.\)\s*$/, '').trim() : null; };

const TITLES = {};
async function buildPage(page) {
  if (page.kind === 'blog') { TITLES[page.id] = 'Blog | Flora Concept'; return blogPage(page); }
  const md = await readFile(DIR + page.file);
  const secs = parseFile(md);
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
    top = `<sc-if value="{{ seasonal }}" hint-placeholder-val="{{ true }}"><div style="background:${INK};color:#ffffff"><div style="${WRAP};display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px"><a href="#/fleurs-sapins-noel/" style="color:#ffffff;text-decoration:none;display:flex;align-items:center;gap:10px;font-size:15px;padding:12px 0">Sapins et décorations de Noël : réservez tôt <span aria-hidden="true" style="width:22px;height:22px;border-radius:50%;background:${LIME};color:${INK};display:inline-flex;align-items:center;justify-content:center;font-size:13px">›</span></a><button onClick="{{ closeSeason }}" aria-label="Fermer" style="flex-shrink:0;width:44px;height:44px;background:transparent;border:0;color:#ffffff;font-size:18px;cursor:pointer">✕</button></div></div></sc-if>
<section style="background:#ffffff;padding:clamp(32px,5vw,64px) 0 0"><div style="${WRAP}"><div data-hero style="display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(28px,4vw,56px);align-items:center"><div style="display:flex;flex-direction:column;gap:22px"><h1 style="${H1S};font-size:clamp(32px,4.6vw,56px)">${inl(h1)}</h1><p style="${PS};font-size:18px">${inl(ans[0])}</p>${BTNS()}<p style="margin:0;${SMALL}">${inl(micro)}</p></div><img src="${HERO_IMG.p01}" alt="Espace de travail végétalisé par Flora Concept" fetchpriority="high" style="display:block;width:100%;aspect-ratio:4/5;max-height:620px;object-fit:cover;border-radius:8px;background:#e6e6e6"></div></div></section>`;
  } else if (page.kind === 'about') {
    top = `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(48px,6vw,72px)"><div style="${WRAP};display:flex;flex-direction:column;gap:22px"><h1 style="${H1S};max-width:900px">${inl(h1)}</h1><div style="display:flex;flex-direction:column;gap:14px">${ans.map(p => `<p style="${PS}">${inl(p)}</p>`).join('')}</div>${BTNS()}<img src="${HERO_IMG.p16}" alt="L'équipe Flora Concept" fetchpriority="high" style="display:block;width:100%;aspect-ratio:21/9;object-fit:cover;border-radius:8px;margin-top:20px;background:#e6e6e6"></div></section>`;
  } else top = hero(page, h1, ans);
  const body = rhythm(buildSections(page, secs));
  const finalLine = page.kind === 'about' ? 'Envie de travailler avec nous ?' : undefined;
  return top + '\n' + body + '\n' + G5(finalLine);
}
function faqPage(page, secs, h1) {
  const intro = paras(sec(secs, /^Intro/));
  const blocksF = secs.filter(s => /^Bloc \d/.test(s.raw));
  const ids = blocksF.map((s, i) => 'bloc-' + (i + 1));
  const jump = `<nav aria-label="Sur cette page" style="${WRAP};padding-bottom:40px"><div style="display:flex;flex-wrap:wrap;gap:10px">${blocksF.map((s, i) => `<a href="#/faq/#${ids[i]}" style="display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid ${INK};color:${INK};text-decoration:none;${FH};font-weight:500;font-size:15px" style-hover="background:${SURF}">${inl(s.title)}</a>`).join('')}</div></nav>`;
  const body = blocksF.map((s, i) => `<section id="${ids[i]}" style="background:${i % 2 ? '#ffffff' : SURF};padding:clamp(56px,7vw,88px) 0"><div style="${WRAP}">${head2(s.title)}${faqList(faqItems(s.lines))}</div></section>`).join('\n');
  return hero(page, h1, intro, { noPhoto: true }) + jump + body + G5();
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
  const field = (key, label, input) => `<div style="display:flex;flex-direction:column;gap:8px"><label for="f-${key}" style="${FH};font-weight:500;font-size:15px;color:${INK}">${label}</label>${input}<sc-if value="{{ err.${key} }}" hint-placeholder-val="{{ false }}"><p id="e-${key}" style="margin:0;font-size:14px;line-height:1.45;color:#b3261e">{{ err.${key} }}</p></sc-if></div>`;
  const inputS = k => `width:100%;min-height:52px;padding:12px 14px;font-size:16px;border-radius:8px;border:1px solid {{ errB.${k} }};background:#ffffff;color:${INK}`;
  const formHtml = `<sc-if value="{{ notSent }}" hint-placeholder-val="{{ true }}"><form onSubmit="{{ submitDevis }}" onFocus="{{ devisStart }}" noValidate style="display:flex;flex-direction:column;gap:22px;max-width:560px">
${field('nom', 'Nom', `<input id="f-nom" name="nom" autoComplete="name" style="${inputS('nom')}">`)}
${field('contact', 'Email ou téléphone', `<input id="f-contact" name="contact" autoComplete="email" style="${inputS('contact')}">`)}
${field('besoin', 'Votre besoin', `<textarea id="f-besoin" name="besoin" rows="5" placeholder="${esc(ph)}" style="${inputS('besoin')};resize:vertical;line-height:1.5"></textarea>`)}
<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;${SMALL}"><label for="f-zone">Équipe qui vous répond :</label><select id="f-zone" name="zone" value="{{ zone }}" onChange="{{ setZone }}" style="min-height:44px;padding:0 10px;border-radius:6px;border:1px solid ${LINE};background:#ffffff;font-size:14px;color:${INK}"><option value="">Choisir</option><option value="marseille">Marseille et Provence</option><option value="nice">Nice et Côte d'Azur</option><option value="paris">Paris et Île-de-France</option></select></div>
<input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
<sc-if value="{{ err.server }}" hint-placeholder-val="{{ false }}"><p style="margin:0;font-size:15px;color:#b3261e">{{ err.server }}</p></sc-if>
<div style="display:flex;flex-direction:column;gap:10px"><button type="submit" style="${BTN1};align-self:flex-start;opacity:{{ sendOpacity }}" style-hover="${BTN1H}">{{ submitLabel }}</button><p style="margin:0;${SMALL}">${inl(reass)}</p></div>
<p style="margin:0;font-size:13px;line-height:1.5;color:${MUTED}">${inl(rgpd)}</p>
</form></sc-if>
<sc-if value="{{ sent }}" hint-placeholder-val="{{ false }}"><div role="status" style="max-width:560px;padding:28px;border-radius:8px;background:${SURF};border-left:6px solid ${LIME};display:flex;flex-direction:column;gap:10px">${conf.map((l, i) => `<p style="margin:0;font-size:${i ? 16 : 20}px;line-height:1.55;${i ? '' : FH + ';font-weight:600'}">${inl(l.replace(/^\*\*|\*\*$/g, ''))}</p>`).join('')}</div></sc-if>`;
  const callHtml = `<div style="display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:8px;background:${SURF}"><h2 style="${H2S};font-size:26px">${inl(call.title.replace(/^Bloc : /, ''))}</h2>${callBl.map(b => b.t === 'p' ? `<p style="margin:0;font-size:15px">${inl(b.text)}</p>` : b.items.map(it => { const s = leadSplit(it); return `<a href="tel:+33413121380" onClick="{{ callClick }}" style="display:flex;flex-direction:column;gap:4px;padding:16px 18px;border-radius:8px;background:#ffffff;border:1px solid ${LINE};color:${INK};text-decoration:none;min-height:44px" style-hover="border-color:${INK}"><span style="${FH};font-weight:600;font-size:16px">${inl(s.lead)}</span><span style="font-size:16px">${inl(s.text)}</span></a>`; }).join('')).join('')}</div>`;
  return `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(56px,7vw,88px)"><div style="${WRAP}"><div style="display:flex;flex-direction:column;gap:18px;max-width:760px;margin-bottom:40px"><h1 style="${H1S}">${inl(h1)}</h1>${intro.map(p => `<p style="${PS}">${inl(p)}</p>`).join('')}</div><div data-split style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,5vw,64px);align-items:start"><div>${formHtml}</div>${callHtml}</div></div></section>
${SEC(SURF, head2(next.title.replace(/^Bloc : /, '')) + steps(nextOl.items, false))}`;
}
function legalPage(page, secs, h1) {
  const c = sec(secs, /^Contenu/);
  const bl = blocks(c.lines);
  const parts = []; let cur = { h: null, bl: [] }; parts.push(cur);
  for (const b of bl) { if (b.t === 'h3') { cur = { h: b.text, bl: [] }; parts.push(cur); } else cur.bl.push(b); }
  const manage = page.id === 'p92' ? `<div><button onClick="{{ manageCookies }}" style="${BTN2}" style-hover="${BTN2H}">Gérer mes cookies</button></div>` : '';
  return `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(64px,8vw,104px)"><div style="${WRAP}"><div style="max-width:760px;display:flex;flex-direction:column;gap:28px"><h1 style="${H1S}">${inl(h1)}</h1>${parts.map(p => (p.h || p.bl.length) ? `<div style="display:flex;flex-direction:column;gap:12px">${p.h ? `<h3 style="${H3S};font-size:21px">${inl(p.h)}</h3>` : ''}${renderGeneric(p.bl).replace(/max-width:68ch;/g, '')}</div>` : '').join('')}${manage}</div></div></section>`;
}
function e404Page(page, secs, h1) {
  const bl = blocks(sec(secs, /^Contenu/).lines);
  const html = bl.map(b => b.t === 'p' ? `<p style="${PS}">${inl(b.text)}</p>` : b.t === 'ul' ? `<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px">${b.items.map(i => `<li style="display:flex;gap:14px;font-size:17px;line-height:1.7">${sq}<span>${inl(i)}</span></li>`).join('')}</ul>` : b.t === 'cta' ? BTNS() : '').join('');
  return `<section style="background:#ffffff;padding:clamp(48px,7vw,96px) 0"><div style="${WRAP}"><div style="max-width:760px;display:flex;flex-direction:column;gap:24px"><h1 style="${H1S}">${inl(h1)}</h1>${html}</div></div></section>`;
}
function blogPage(page) {
  const rows = Array.from({ length: 6 }, (_, i) => `<li style="display:grid;grid-template-columns:minmax(0,1fr) 160px;gap:24px;align-items:start;padding:28px 0;border-top:1px solid ${LINE}"><div style="display:flex;flex-direction:column;gap:10px"><span style="${SMALL}">Date de publication</span><div style="height:22px;width:${70 - i * 4}%;background:#e0e0e0;border-radius:4px"></div><div style="height:12px;width:92%;background:#ececec;border-radius:3px"></div><div style="height:12px;width:64%;background:#ececec;border-radius:3px"></div><span style="${FH};font-weight:600;font-size:15px;text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px;text-underline-offset:3px">Lire</span></div><div style="aspect-ratio:4/3;border-radius:8px;background:#e4e4e4;display:flex;align-items:center;justify-content:center;${SMALL}">vignette</div></li>`).join('');
  return `<section style="background:#ffffff;padding:clamp(28px,4vw,48px) 0 clamp(64px,8vw,104px)"><div style="${WRAP}"><div style="max-width:820px;display:flex;flex-direction:column;gap:18px"><h1 style="${H1S}">Blog</h1><p style="${PS}">${chip('H1 et introduction de la page Blog')}</p><p style="margin:0;${SMALL}">Aperçu de mise en page : articles du plus récent au plus ancien, les articles datés dans le futur ne sont pas listés. Les articles arrivent dans un lot ultérieur.</p><ul style="list-style:none;margin:16px 0 0;padding:0">${rows}</ul></div></div></section>` + G5();
}

// ---------- globals ----------
const IN_MENU = [['/location-plantes-bureau/', 'Location de plantes'], ['/entretien-plantes-entreprise/', 'Entretien'], ['/mur-vegetal-interieur/', 'Murs végétaux'], ['/cadres-vegetaux-plantes-stabilisees/', 'Cadres stabilisés'], ['/abonnement-fleurs-entreprise/', 'Fleurs'], ['/location-plantes-evenementiel/', 'Événementiel'], ['/fleurs-sapins-noel/', 'Noël']];
const OUT_MENU = [['/espaces-verts-entreprise/', 'Espaces verts'], ['/entretien-espaces-verts-copropriete/', 'Copropriétés'], ['/creation-amenagement-espaces-verts/', 'Création'], ['/elagage-entreprise-marseille-aix/', 'Élagage'], ['/terrasses-vegetalisees-entreprise/', 'Terrasses'], ['/ruches-entreprise/', 'Ruches']];
const CITY_MENU = [['/location-entretien-plantes-bureau-paris/', 'Paris'], ['/entretien-location-plantes-nice/', 'Nice'], ['/entretien-location-plantes-marseille/', 'Marseille']];
const PACA_BADGE = `<span style="${FH};font-size:10px;font-weight:600;letter-spacing:.08em;padding:2px 6px;border-radius:3px;background:${INK};color:#ffffff">PACA</span>`;
const NAVLINK = `display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 10px;${FH};font-weight:500;font-size:15px;color:${INK};text-decoration:none;background:transparent;border:0;cursor:pointer;white-space:nowrap`;
const ddMenu = (key, label, items, badge) => `<div onMouseEnter="{{ dd.${key}On }}" onMouseLeave="{{ ddOff }}" onFocus="{{ dd.${key}On }}" style="position:relative"><button aria-haspopup="true" aria-expanded="{{ dd.${key} }}" onClick="{{ dd.${key}Toggle }}" style="${NAVLINK}" style-hover="background:${SURF}">${label}<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="${INK}" stroke-width="1.6" aria-hidden="true"><path d="M2 3.5l3 3 3-3"></path></svg></button><sc-if value="{{ dd.${key} }}" hint-placeholder-val="{{ false }}"><div style="position:absolute;top:100%;left:0;padding-top:6px;z-index:60"><div style="min-width:240px;padding:8px;background:#ffffff;border:1px solid ${LINE};border-radius:8px;box-shadow:0 12px 32px rgba(0,0,0,.08);display:flex;flex-direction:column">${items.map(([h, l]) => `<a href="#${h}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;padding:0 12px;border-radius:6px;color:${INK};text-decoration:none;font-size:15px" style-hover="background:${SURF}">${l}${badge ? PACA_BADGE : ''}</a>`).join('')}</div></div></sc-if></div>`;
const HEADER = `<header style="position:sticky;top:0;z-index:50;background:#ffffff;border-bottom:1px solid ${LINE}">
<div style="${WRAP};display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:76px">
<a href="#/" aria-label="Flora Concept, accueil" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:${INK}"><img src="assets/flora-logo.png" alt="Flora Concept" style="width:48px;height:48px;border-radius:50%;object-fit:cover;display:block"><span style="${FH};font-weight:600;font-size:18px;white-space:nowrap">Flora Concept</span></a>
<nav data-desk aria-label="Menu principal" style="display:flex;align-items:center;gap:2px">
<a href="#/" style="${NAVLINK}" style-hover="background:${SURF}">Accueil</a>
${ddMenu('services', 'Services', IN_MENU)}
${ddMenu('outdoor', 'Extérieur PACA', OUT_MENU, true)}
${ddMenu('villes', 'Nos villes', CITY_MENU)}
<a href="#/vegetalisation-bureaux-multisites-paris-paca/" style="${NAVLINK}" style-hover="background:${SURF}">Multi-sites</a>
<a href="#/blog/" style="${NAVLINK}" style-hover="background:${SURF}">Blog</a>
<a href="#/faq/" style="${NAVLINK}" style-hover="background:${SURF}">FAQ</a>
<a href="#/devis/" style="${BTN1};min-height:48px;padding:0 18px;font-size:15px;margin-left:10px;white-space:nowrap" style-hover="${BTN1H}">Recevoir mon devis gratuit</a>
</nav>
<button data-mob onClick="{{ toggleMenu }}" aria-expanded="{{ menuOpen }}" aria-label="Menu" style="display:none;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 16px;border-radius:8px;border:2px solid ${INK};background:#ffffff;${FH};font-weight:600;font-size:15px;color:${INK};cursor:pointer"><svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="${INK}" stroke-width="2" aria-hidden="true"><path d="M1 1h16M1 7h16M1 13h16"></path></svg>Menu</button>
</div>
</header>
<sc-if value="{{ menuOpen }}" hint-placeholder-val="{{ false }}"><div role="dialog" aria-label="Menu" style="position:fixed;inset:0;z-index:80;background:#ffffff;overflow:auto;display:flex;flex-direction:column">
<div style="${WRAP};width:100%;display:flex;align-items:center;justify-content:space-between;min-height:76px;border-bottom:1px solid ${LINE}"><span style="${FH};font-weight:600;font-size:18px">Flora Concept</span><button onClick="{{ toggleMenu }}" aria-label="Fermer le menu" style="width:48px;height:48px;border-radius:8px;border:2px solid ${INK};background:#ffffff;font-size:18px;cursor:pointer;color:${INK}">✕</button></div>
<div style="${WRAP};width:100%;display:flex;flex-direction:column;gap:28px;padding-top:24px;padding-bottom:40px">
<a href="#/devis/" style="${BTN1};width:100%" style-hover="${BTN1H}">Recevoir mon devis gratuit</a>
<a href="#/" style="${FH};font-weight:600;font-size:20px;color:${INK};text-decoration:none">Accueil</a>
${[['Services', IN_MENU], ['Extérieur PACA', OUT_MENU], ['Nos villes', CITY_MENU]].map(([g, items]) => `<div style="display:flex;flex-direction:column"><span style="${FH};font-weight:600;font-size:20px;margin-bottom:6px">${g}</span>${items.map(([h, l]) => `<a href="#${h}" style="display:flex;align-items:center;min-height:44px;font-size:17px;color:${INK};text-decoration:none;border-bottom:1px solid ${LINE}">${l}</a>`).join('')}</div>`).join('')}
${[['/vegetalisation-bureaux-multisites-paris-paca/', 'Multi-sites'], ['/blog/', 'Blog'], ['/faq/', 'FAQ']].map(([h, l]) => `<a href="#${h}" style="${FH};font-weight:600;font-size:20px;color:${INK};text-decoration:none">${l}</a>`).join('')}
</div></div></sc-if>`;
async function footer() {
  const readme = await readFile(DIR + 'README.md');
  const entity = readme.match(/> (Flora Concept est un spécialiste[^\n]+)/)[1];
  const col = (title, items) => `<div style="display:flex;flex-direction:column;gap:4px"><span style="${FH};font-weight:600;font-size:15px;margin-bottom:6px">${title}</span>${items.map(([h, l]) => `<a href="#${h}" style="display:flex;align-items:center;min-height:36px;font-size:15px;color:${INK};text-decoration:none" style-hover="text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px">${l}</a>`).join('')}</div>`;
  const svc7 = IN_MENU.map(([h]) => [h, NAME[h]]);
  return `<footer style="background:#ffffff;border-top:1px solid ${LINE}">
<div style="${WRAP};display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:40px;padding-top:56px;padding-bottom:40px">
<div style="display:flex;flex-direction:column;gap:14px"><img src="assets/flora-logo.png" alt="Flora Concept" style="width:64px;height:64px;border-radius:50%;object-fit:cover"><p style="margin:0;font-size:14px;line-height:1.6;color:${INK}">${inl(entity)}</p></div>
${col('Services', svc7)}
<div style="display:flex;flex-direction:column;gap:20px">${col('Extérieur PACA', OUT_MENU.map(([h]) => [h, NAME[h]]))}${col('Nos villes', CITY_MENU.map(([h]) => [h, NAME[h]]))}</div>
${col('Flora Concept', [['/qui-sommes-nous/', 'Qui sommes-nous'], ['/faq/', 'FAQ'], ['/blog/', 'Blog'], ['/devis/', 'Devis']])}
</div>
<div style="border-top:1px solid ${LINE}"><div style="${WRAP};display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 28px;padding-top:20px;padding-bottom:24px;${SMALL}">
<span>Flora Concept · Gémenos (13) · ${chip('adresse exacte')} · ${chip('téléphone')}</span>
<span>Provence-Alpes-Côte d'Azur · Île-de-France</span>
<span style="display:flex;flex-wrap:wrap;gap:6px 18px"><a href="#/mentions-legales/" style="color:${MUTED}">Mentions légales</a><a href="#/politique-de-confidentialite/" style="color:${MUTED}">Politique de confidentialité</a><a href="#/cookies/" style="color:${MUTED}">Cookies</a><button onClick="{{ manageCookies }}" style="background:none;border:0;padding:0;font:inherit;color:${MUTED};text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px;text-underline-offset:3px;cursor:pointer">Gestion des cookies</button></span>
</div></div>
</footer>`;
}
const BAR = `<sc-if value="{{ notDevis }}" hint-placeholder-val="{{ true }}"><div data-bar style="position:fixed;left:0;right:0;bottom:0;z-index:55;display:none;grid-template-columns:1fr 1fr;gap:10px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:#ffffff;border-top:1px solid ${LINE}"><a href="#/devis/" style="${BTN1};min-height:48px;padding:0 12px" style-hover="${BTN1H}">Devis</a><a href="tel:+33413121380" onClick="{{ callClick }}" style="${BTN2};min-height:48px;padding:0 12px" style-hover="${BTN2H}">Appeler</a></div></sc-if>`;
const CBTN = `flex:1;min-width:140px;min-height:48px;padding:0 16px;border-radius:8px;border:2px solid ${INK};background:#ffffff;color:${INK};${FH};font-weight:600;font-size:15px;cursor:pointer`;
const COOKIE = `<sc-if value="{{ showCookie }}" hint-placeholder-val="{{ false }}"><div data-cookie role="dialog" aria-label="Cookies" style="position:fixed;left:12px;right:12px;bottom:12px;z-index:70;max-width:640px;margin:0 auto;padding:20px;background:#ffffff;border:1px solid ${LINE};border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.12);display:flex;flex-direction:column;gap:14px">
<p style="margin:0;font-size:15px;line-height:1.55">Nous mesurons l'audience du site uniquement avec votre accord. <a href="#/cookies/">Politique cookies</a></p>
<sc-if value="{{ cpanel }}" hint-placeholder-val="{{ false }}"><div style="display:flex;flex-direction:column;gap:6px;font-size:15px"><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked disabled style="width:20px;height:20px">Strictement nécessaires</label><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked="{{ c1 }}" onChange="{{ toggleC1 }}" style="width:20px;height:20px">Mesure d'audience</label><label style="display:flex;align-items:center;gap:10px;min-height:44px"><input type="checkbox" checked="{{ c2 }}" onChange="{{ toggleC2 }}" style="width:20px;height:20px">Analyse d'ergonomie</label></div></sc-if>
<div style="display:flex;flex-wrap:wrap;gap:10px"><button onClick="{{ cookieAll }}" style="${CBTN}" style-hover="background:${SURF}">Tout accepter</button><button onClick="{{ cookieNone }}" style="${CBTN}" style-hover="background:${SURF}">Tout refuser</button><button onClick="{{ cookieCustom }}" style="${CBTN}" style-hover="background:${SURF}">{{ customLabel }}</button></div>
</div></sc-if>`;

const TITLES_PLACEHOLDER = '__TITLES__';
// ---------- logic ----------
const LOGIC_FN = () => `class Component extends DCLogic {
  state = { page: null, dd: null, menu: false, season: true, cookie: undefined, cpanel: false, c1: false, c2: false, err: {}, sent: false, sending: false, zone: '', started: false };
  componentDidMount() {
    this.onHash = () => this.route(false);
    window.addEventListener('hashchange', this.onHash);
    let c = null; try { c = localStorage.getItem('fc_consent'); } catch (e) {}
    this.setState({ cookie: c });
    this.route(true);
  }
  componentWillUnmount() { window.removeEventListener('hashchange', this.onHash); }
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
      pg, dd, ddOff: () => this.setState({ dd: null }),
      notDevis: page !== 'p15',
      menuOpen: this.state.menu, toggleMenu: () => this.setState(s => ({ menu: !s.menu })),
      seasonal: page === 'p01' && m >= 9 && this.state.season, closeSeason: () => this.setState({ season: false }),
      showPending: this.props.showPending ?? true,
      showHidden: this.props.showHidden ?? false,
      bodyFont: this.props.bodyFont ?? "'Source Sans 3'",
      showCookie: this.state.cookie === null,
      cpanel: this.state.cpanel, c1: this.state.c1, c2: this.state.c2,
      toggleC1: () => this.setState(s => ({ c1: !s.c1 })), toggleC2: () => this.setState(s => ({ c2: !s.c2 })),
      customLabel: this.state.cpanel ? 'Enregistrer' : 'Personnaliser',
      cookieAll: () => this.saveConsent('all'), cookieNone: () => this.saveConsent('none'),
      cookieCustom: () => this.state.cpanel ? this.saveConsent((this.state.c1 ? 'a' : '') + (this.state.c2 ? 'c' : '') || 'none') : this.setState({ cpanel: true }),
      manageCookies: () => this.setState({ cookie: null, cpanel: true }),
      callClick: () => this.push('call_click', { zone: ZONE_OF(page) }),
      zone: this.state.zone, setZone: e => this.setState({ zone: e.target.value }),
      zoneLabel: ZL[this.state.zone] || "Provence-Alpes-Côte d'Azur ou Île-de-France",
      err, errB: { nom: err.nom ? '#b3261e' : '#8a8a8a', contact: err.contact ? '#b3261e' : '#8a8a8a', besoin: err.besoin ? '#b3261e' : '#8a8a8a' },
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
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&family=Source+Sans+3:wght@400;600&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
<style>
html{scroll-behavior:auto}
body{margin:0;background:#ffffff;color:${INK};-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
a{color:${INK};text-decoration:underline;text-decoration-color:${LIME};text-decoration-thickness:2px;text-underline-offset:3px;transition:color .15s}
a:hover{color:#000000;text-decoration-color:${INK}}
:focus-visible{outline:2px solid ${INK};outline-offset:2px}
input:focus,textarea:focus,select:focus{outline:2px solid ${INK};outline-offset:1px}
input,select,textarea,button{font-family:inherit}
::placeholder{color:#767676}
@media (max-width:1100px){[data-desk]{display:none!important}[data-mob]{display:flex!important}[data-bar]{display:grid!important}[data-root]{padding-bottom:72px}[data-cookie]{bottom:80px!important}}
@media (max-width:860px){[data-hero]{grid-template-columns:1fr!important}[data-split]{grid-template-columns:1fr!important}[data-tdesk]{display:none!important}[data-tmob]{display:flex!important}}
</style>
</helmet>`;
const BODY = `${HELMET}
<div data-root lang="fr" style="font-family:{{ bodyFont }},sans-serif;min-height:100vh;display:flex;flex-direction:column">
${HEADER}
${pagesHtml.join('\n')}
${await footer()}
${BAR}
${COOKIE}
</div>`;
const logic = LOGIC_FN().replace(JSON.stringify(TITLES_PLACEHOLDER), JSON.stringify(TITLES));
const props = { startPage: { editor: 'enum', options: PAGES.map(p => p.slug), default: '/', tsType: 'string' }, showPending: { editor: 'boolean', default: true, tsType: 'boolean' }, showHidden: { editor: 'boolean', default: false, tsType: 'boolean' }, bodyFont: { editor: 'enum', options: ["'Source Sans 3'", 'Poppins', 'Montserrat'], default: "'Source Sans 3'", tsType: 'string' } };
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
await saveFile('Flora Concept v4.dc.html', file);
log('ok', file.length, Object.keys(TITLES).length);
