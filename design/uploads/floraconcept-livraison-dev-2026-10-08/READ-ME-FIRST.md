# READ ME FIRST — before writing any code

> Delivery of 2026-10-08 (replaces the 2026-10-01 package): structure approved by the client on 2026-10-06, complete content for the 27 pages, site map for developers, section guide for the designer.
> This site is built for one purpose: to be found on Google and cited by AI assistants (ChatGPT, Perplexity…), then convert visitors into quote requests. **Every detail in this package serves that goal.** A "close enough" integration destroys weeks of research work that is invisible in the final rendering.

## 🇫🇷 The content is in FRENCH — and that changes how you work

The site targets the French market. All page copy, metadata, URLs and blog articles are **in French, written and calibrated by us**. You do not need to understand them; you need to preserve them perfectly:

1. **Copy-paste only, character for character.** Never retype, never "fix", never run any text through a translator or spell-checker. French uses accents (é è à ç ô), curly apostrophes ('), French quotes (« ») and specific spacing. All of it is intentional.
2. **UTF-8 everywhere** : files, database, HTTP headers (`charset=utf-8`), templates. If you ever see `Ã©` or `�` on a rendered page, encoding is broken — stop and fix it.
3. **Slugs are ASCII and final** (e.g. `/location-plantes-bureau/`). Use them exactly as given; never re-slugify from the French titles.
4. **`lang="fr"`** on the HTML root; French locale for dates on the blog.
5. If a French string seems odd, too long, or broken to you: **ask us, never edit**. What looks like a typo may be a calibrated keyword.

## ⏰ Hard deadline

**The Christmas page (`/fleurs-sapins-noel/`) must be live before mid-October.** Peak demand is November-December and quotes are requested from October. If needed, ship that page and the homepage before everything else.

## 🆕 What changed since the 2026-10-01 package

- **6 new outdoor pages, PACA only** (hub `/espaces-verts-entreprise/`, 4 services, `/ruches-entreprise/`): content files `18`, `18a` to `18d`, `19`. New header menu « Extérieur PACA ». Never linked from the Paris page.
- `16-qui-sommes-nous.md` updated (client commitments: electric transition, beehives).
- `REDIRECTIONS.md`: `/espaces-verts/` now targets the outdoor hub; the water-saving article targets the création page.
- **Blog posts are not in this package**: only the `/blog/` index and its publishing mechanics (§4 of the requirements). The 35 posts come in a later batch.
- New: `SITE-MAP-DEV.md` + PDF (every URL, template, content file) and `DESIGN-GUIDE-SECTIONS.md` + `DESIGN-PAGE-SHEETS.md` + PDF (section by section, for the designer and for you).

## 📖 Reading order

1. **This file** (5 minutes)
2. `DEV-REQUIREMENTS.md` (English): the technical contract — **every point will be tested at acceptance**
3. `SITE-MAP-DEV.md` (English, PDF included): the 27 URLs, templates, content file per page, navigation, internal linking
4. `DESIGN-GUIDE-SECTIONS.md` + `DESIGN-PAGE-SHEETS.md` (English, one PDF): what each section is and how it behaves, page by page
5. `contenu/README.md` then the page files (French): the copy to integrate **verbatim**
6. `REDIRECTIONS.md`: old-domain migration table (301/410)
7. `STRUCTURE-SITE.md` (French): keyword map and section rationale, for reference
8. `DESIGN-DIRECTION.md` (French): brand and design rules

French originals of the two instruction documents are included (`LISEZ-MOI-DABORD.md`, `CAHIER-EXIGENCES-DEV.md`); the English versions are authoritative for you.

## ⛔ The 10 mistakes that wipe out all the value

1. **Rewriting or shortening any text.** Titles, metas and paragraphs are calibrated (length, keywords, AI-citable format). Integrate them to the character.
2. **Rendering text with JavaScript.** All content must be in the served HTML. If text only appears after JS runs, AI crawlers and part of Google never see it.
3. **Putting the opening "direct answer" paragraph in an accordion or slider.** That first paragraph of every service page and article is what AI assistants quote: plain visible text at the top.
4. **Publishing a page containing `{{A_FOURNIR : …}}`.** It means "data pending from client": the page waits, nothing is ever invented. The Paris page has a block marked BLOQUANT (blocking).
5. **Redirecting old URLs "all to the homepage".** Every line of `REDIRECTIONS.md` has an exact 301 target, single hop; the hack spam URLs return 410. An automated script will test 100% of the lines.
6. **Displaying any price, anywhere.** Client decision: no prices on the site. Every CTA leads to the quote form.
7. **Adding a `LocalBusiness` schema for Paris or Nice.** Only one real address exists (Gémenos). Schema is specified per page; inventing offices exposes the client to a Google suspension.
8. **Breaking the blog mechanics.** Articles carry future `pubDate`s: a future-dated article must not exist anywhere (no listing, no sitemap). A scheduled deploy on Mondays and Thursdays publishes them automatically. Without this, 35 articles go live at once = Google scaled-content penalty risk.
9. **Loading GA4/GTM/Clarity before consent.** Strict Consent Mode v2: zero measurement requests before the user agrees.
10. **Using the lime `#c4d401` as text color on light backgrounds.** 1.65:1 contrast, unreadable. Lime = button backgrounds with `#212121` text.

## ✅ What will be verified at acceptance (with tools, not by eye)

- Every page returns 200; titles/descriptions unique and identical to the files
- Valid JSON-LD (Schema.org validator) matching the per-page specs
- 100% of `REDIRECTIONS.md` lines tested automatically
- Mobile Lighthouse: Performance ≥ 95, SEO = 100, Accessibility ≥ 95, LCP < 2.5s
- Zero console errors, zero horizontal scroll at 390px
- "Demander un devis" + "Appeler" buttons on 100% of pages, fixed mobile bar
- Form: per-field validation, honeypot, rate limiting, `devis_submit`/`call_click` events
- Control greps: no prices, no `{{A_FOURNIR}}`, no occurrence of "Végétal Office", no `Ã©`-style encoding artifacts

## 💬 Any question, doubt, or slug that needs adapting?

Ask us **before** improvising. An answer takes an hour; undoing an improvisation takes a week.
