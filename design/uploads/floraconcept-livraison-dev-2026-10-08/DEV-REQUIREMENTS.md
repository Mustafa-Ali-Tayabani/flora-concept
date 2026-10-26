# Development Requirements — Flora Concept website

> We deliver structure and content; your team builds the site. This document lists what is **non-negotiable** for the SEO/AI-visibility work to pay off. Any deviation must be discussed before integration.
> Delivered with: `SITE-MAP-DEV.md` (the map), `DESIGN-GUIDE-SECTIONS.md` + `DESIGN-PAGE-SHEETS.md` (sections), `contenu/` (one French file per page), `REDIRECTIONS.md`, `STRUCTURE-SITE.md` (French, keywords), `READ-ME-FIRST.md`.

## 1. Content: faithful integration

1. Each page follows **the exact section order** of its `contenu/NN-*.md` file. Copy is integrated verbatim (no rewriting, no trimming, no translation).
2. **`{{A_FOURNIR : …}}`** = data pending from the client. No page ships to production with a visible placeholder; never invent a value. The Paris page contains a block marked **BLOQUANT**: without it, the page is not published.
3. **No prices** anywhere on the site. No mention of "Végétal Office". French typography preserved (accents, apostrophes, « » quotes); UTF-8 end to end; `lang="fr"`.
4. The **entity sentence** (in `contenu/README.md`) is reproduced identically everywhere it appears.

## 2. Metadata and markup (provided per page in each file)

1. `<title>` (50-60 chars) and meta description (150-160), **unique**, exactly as provided.
2. One single `<h1>` per page; H2/H3 hierarchy as provided.
3. **JSON-LD** per the "JSON-LD" section of each file: `Organization` (SIREN 423 977 305, `foundingDate` 1999, `areaServed` PACA + Île-de-France); **one single `LocalBusiness`** (Gémenos); `Service` with per-page `areaServed`; `AboutPage` + `Person` (team) on the About page; `Article` + `author` → `Person` on blog posts. No `FAQPage` schema.
4. Self-referencing canonical on every page; XML sitemap; `robots.txt` allowing AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
5. The **direct answer** (130-170 French words) opening every service page and article is a plain text paragraph at the top of the page — never inside an accordion, tab, or JS-rendered block.

## 3. Conversion (the site's reason to exist)

1. "Demander un devis" (request a quote) + "Appeler" (call) buttons on **100% of pages**; **fixed bottom bar on mobile** with both actions.
2. Quote form: 3 fields (name, email or phone, need) + a zone field pre-filled from the originating page; invisible honeypot; server-side rate limiting; per-field error messages (copy provided in `contenu/15-devis.md`); email acknowledgement to the requester.
3. Measurement events: `devis_submit` (with source and zone) and `call_click` (with zone), wired for GA4/GTM with Consent Mode v2: **no measurement script loads before consent**.

## 4. Blog: automated publishing (required mechanics)

1. Every article has a future publication date (`pubDate`). The site **must not render** a future-dated article: no page, no listing, no sitemap entry.
2. A scheduled rebuild/deploy on **Mondays and Thursdays** publishes articles whose date has arrived (2/week; calendar in `contenu/blog/PLAN-EDITORIAL.md`; clock starts at site launch).
3. Author box on every article (a real team member once the About page is populated; "L'équipe Flora Concept" until then), linked to `/qui-sommes-nous/` in JSON-LD.

## 5. Redirects (the migration — do not get this wrong)

1. **Every URL** in `REDIRECTIONS.md` (floraconcept.com and vegetaloffice.fr) 301-redirects, **single hop**, to its exact target. Never "everything to the homepage".
2. The listed hack-spam URLs (385, from the old site compromise) return **410 Gone**.
3. An automated test verifies 100% of the lines before go-live (we can provide the script).

## 6. Performance and quality (acceptance thresholds)

1. Mobile Lighthouse on homepage + one service page + one zone page: **Performance ≥ 95, SEO = 100, Accessibility ≥ 95**, LCP < 2.5s on phone.
2. Minimal JavaScript: no content page may depend on JS to display its text (static HTML served). Optimized images (modern formats, lazy loading except hero), self-hosted fonts.
3. Zero console errors; no horizontal scroll at 390px; contrast: lime `#c4d401` is **never a text color on light backgrounds** (lime buttons use `#212121` text).
4. Acceptance: all pages 200, unique metas verified, JSON-LD valid (Schema.org validator), redirects tested, no encoding artifacts (`Ã©`, `�`).

## 7. Open points (do not decide alone)

- Stack: a static **Astro** build was planned (ADR 0001); if your team picks something else, requirements §4 (scheduled publishing) and §6 (static HTML, budgets) still apply in full.
- Planned hosting: Hostinger shared (PHP available for the quote endpoint). To be confirmed with you.
- Any question about a text, a slug, or missing data: come back to us — never improvise.
