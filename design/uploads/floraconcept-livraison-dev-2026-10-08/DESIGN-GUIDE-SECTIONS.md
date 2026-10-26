# Flora Concept: section guide for the designer

> Version 08/10/2026. Companion to `DESIGN-DIRECTION.md` (tokens, palette, type, bans: already in your hands, not repeated here) and to the page texts in `contenu/`. This document tells you **what each section is, what it contains and how it should behave**, so that every page of the site can be designed from a library of reusable sections. Part 2 (`DESIGN-PAGE-SHEETS.md`) lists, page by page, which sections appear in which order with the exact content.
>
> The site is in French. Every visitor-facing string quoted here (labels, button text, headings) is final and must appear exactly as written. Explanations are in English.

## 0. How to work with this guide

- **Design 10 templates, not 27 pages.** Each page is a template filled with its own content (Part 2). The same section looks the same everywhere.
- **Three frames per template**: 390 px (phone, primary), 768 px (tablet), 1440 px (desktop). Phone first: most quote requests come from phones, and the sticky bar lives there.
- **One primary action per view**: the lime button « Recevoir mon devis gratuit ». The secondary action « Appeler » is an outlined button. Never two lime buttons in the same viewport.
- **Text is king**: every page opens with a 130-170 word paragraph (the "direct answer") that must be plain, readable text. No accordion, no carousel, no text over a photo.
- **Hidden states exist**: client data (logos, case studies, figures) is still missing. Each section that depends on it needs a design for "present" and must disappear cleanly when "absent". No empty frames, no "coming soon".
- **No invented numbers** in mockups: use the real texts from `contenu/`, and for missing data use neutral placeholders (grey blocks labelled "logo client", "photo chantier"), never fake stats.

## 1. Global elements (every page)

| Element | Content | Behaviour |
|---|---|---|
| **G1 Header** | Logo · Accueil · Services ▾ · Extérieur PACA ▾ · Nos villes ▾ · Multi-sites · Blog · FAQ · [Recevoir mon devis gratuit] | Desktop: single row, dropdowns on hover and focus. Phone: logo + burger; the menu opens as a full-height panel with the three groups expanded as lists. The quote button stays visible in the open panel. Dropdown contents: Services = Location de plantes, Entretien, Murs végétaux, Cadres stabilisés, Fleurs, Événementiel, Noël · Extérieur PACA = Espaces verts, Copropriétés, Création, Élagage, Terrasses, Ruches · Nos villes = Paris, Nice, Marseille |
| **G2 Sticky mobile bar** | Two buttons, full width, 50/50: [Devis] (lime) [Appeler] (outlined) | Phone and tablet only, fixed at the bottom, always visible, 56-64 px tall. Content gets bottom padding so nothing hides behind it. Not shown on `/devis/` (the form is the page). |
| **G3 Breadcrumb** | Accueil › Espaces verts d'entreprise › Élagage et débroussaillage | Under the header, small muted text, on every page except Home. One level for city, multi-site, entity, FAQ, quote and legal pages. |
| **G4 Zone banner** | « Interventions en Provence-Alpes-Côte d'Azur » | Thin band directly under the H1, surface background, small pin icon allowed. Only on the 6 outdoor pages (hub, 4 services, beehives). |
| **G5 Final CTA band** | H2-size line + [Recevoir mon devis gratuit] + text link « ou appelez-nous » | Last section of every page before the footer. Ink background, white text, lime button: it is the one dark band of the page. |
| **G6 Footer** | Column 1: logo + entity sentence (full text in `contenu/README.md`) · Column 2: Services (7 links) · Column 3: Extérieur PACA (6 links) + Nos villes (3) · Column 4: Qui sommes-nous, FAQ, Blog, Devis · Bottom row: NAP Gémenos (address, phone), « Provence-Alpes-Côte d'Azur · Île-de-France », Mentions légales, Politique de confidentialité, Cookies, Gestion des cookies | Phone: columns stack, link groups collapse under their title. |
| **G7 Cookie consent** | Short banner at first visit: text + [Tout accepter] [Tout refuser] [Personnaliser] | Bottom of screen, above the sticky bar on phone. Nothing loads before a choice. Light design, no dark pattern: the three buttons have equal visual weight. |

## 2. Section library

Each section has an ID used in the templates and the page sheets. "Desktop" means 1440, "phone" means 390.

### S1 · Service hero
Purpose: the page's answer, readable in 30 seconds, and the two actions.
Content: H1 · the direct-answer paragraph (130-170 words, plain text) · [Recevoir mon devis gratuit] [Appeler] · one real photo.
Layout: desktop two columns, text 7/12 left, photo 5/12 right, photo top-aligned with the H1. Phone: H1, paragraph, buttons, then photo. The photo is an `<img>` (never a CSS background), real Flora Concept site photo, no stock office with a pot plant.
Note: on outdoor pages the zone banner G4 sits between H1 and paragraph.

### S2 · Home hero
Content: H1 « Des espaces de travail plus verts, sans vous en occuper » · subtitle = the entity sentence · [Recevoir mon devis gratuit] [Appeler] · micro-proof line under the buttons (three short facts separated by « · ») · full-width real photo.
Layout: the one "break" of the home page: photo full width under the text block on phone, or text over a 60/40 split on desktop. Keep the H1 at 2 lines max on phone.

### S3 · Profile entries (3)
Purpose: route the visitor by who they are, above the fold on phone.
Content: 3 entries: « Bureaux et sièges sociaux », « Hôtels, restaurants et résidences », « Syndics et gestionnaires », each with one sentence and an arrow link.
Layout: three horizontal rows on phone (full width, tappable, 72 px min), three columns on desktop. Not three identical icon cards: use a short label + sentence + arrow, with a thin lime left rule as the only accent.

### S4 · Service cards grid
Content: title + one sentence + link per card. Home: 6 indoor cards + 2 outdoor cards marked « PACA » (badge). Hubs: 6 (indoor) or 4 (outdoor) cards.
Layout: 2 columns on phone (or 1 if the sentence is long), 3 on tablet, 3 or 4 on desktop. Each card: small real photo (4:3), title, sentence, « Découvrir » link. Avoid the "3 identical icon cards" look: photos differ, no icons.

### S5 · Checklist
Purpose: "what the service includes".
Content: 5 to 8 bullet items, each « **Bold lead** : explanation ».
Layout: single column on phone; two columns on desktop when 6+ items. Lime square bullets (the lime accent). Optional short line under the list (frequency, note).

### S6 · Comparison table
Content: 2 compared columns + a criteria column, 5 to 7 rows (Location vs Achat; Naturel vs Stabilisé; Avant vs Avec Flora Concept).
Layout: desktop as a real table, header row ink background. Phone: the table becomes stacked cards, one per row, with the criterion as title and the two values labelled. Never a horizontally scrolling table.

### S7 · Steps
Content: 3 or 4 numbered steps, each « **Bold title** : one or two sentences ».
Layout: desktop horizontal (3-4 columns) with large numerals in lime; phone vertical with the numeral on the left. Seven-step variant (page Création) is vertical on every width.

### S8 · Audience blocks
Purpose: "for whom", one sub-block per audience.
Content: H2 + 2 to 4 H3 sub-blocks, each a short paragraph with inline links.
Layout: desktop 2 columns of text blocks, phone stacked. Optional small photo per block when real ones exist; otherwise text only, separated by thin lines.

### S9 · Area sub-sections
Purpose: city pages, "where we work": H3 per city or district (« Marseille et Aubagne », « Aix-en-Provence », « Toulon, le Var et le Vaucluse »).
Layout: like S8, text first. A simple outline map of the region with the named cities is welcome but optional; if used, it is an illustration, not a navigation.

### S10 · Argument block
Purpose: "why us" / commitments: 4 to 5 points.
Content: « **Bold lead** : sentence ».
Layout: desktop 2 × 2 grid, phone stacked. Surface background to alternate rhythm with white sections. No icons needed; the bold lead does the job.

### S11 · Case studies (Réalisations)
Content when present: 2 or 3 cards: photo (real, 3:2), client name, city, one-line service, « depuis 2020 »-type duration line, link to the case.
Hidden state: the whole section (title included) is removed while client approvals are missing. Design both states.
Layout: 1 column phone, 2-3 columns desktop. Later, each card opens a case page built on the 6-block pattern (direct answer, need, work, result over time, quote, fact sheet): design one case page frame as a bonus if time allows.

### S12 · FAQ
Content: 3 to 5 questions on service pages, 13 on `/faq/` grouped in 3 H2 blocks.
Layout: questions as H3, answers always visible under them (no accordion: the answers are the content Google and AI assistants read). Alternate surface background. On `/faq/`, a short in-page jump list to the 3 blocks at the top.

### S13 · Logos band
Content: « Ils nous font confiance » + 6 to 10 client logos, greyscale, equal height.
Hidden state: removed entirely until approvals exist. Phone: 2 rows of 3, no carousel.

### S14 · Region cards
Content: 2 cards: « Provence-Alpes-Côte d'Azur » (cities list, 2 links) and « Île-de-France » (cities list, 1 link). No Gémenos card (client decision 02/10).
Layout: 2 columns desktop, stacked phone. Text cards with the city list as a comma-separated line, link at the bottom.

### S15 · Quote form
Content: 3 visible fields: « Nom », « Email ou téléphone », « Votre besoin » (textarea with placeholder « Ex. : location et entretien de plantes pour nos bureaux de 400 m² à Marseille ») · hidden pre-filled zone · honeypot (invisible) · [Recevoir mon devis gratuit] · reassurance line under the button.
Layout: single column, max width ~560 px, label above field, error text under the field in the error colour, 2 px ink focus ring. Design: default, focus, error (per field), submitting, success message (replaces the form). Never a button labelled « Envoyer ».

### S16 · Phone block
Content: H2 « Appeler directement » + one phone number per region with hours (texts in `15-devis.md`).
Layout: large tappable number (tel: link), phone-first. On desktop, next to the form (form 7/12, phone block 5/12).

### S17 · Team grid
Content: H2 « L'équipe » + cards: photo (real portrait, square), first name, role, one line. 4 to 8 people.
Layout: 2 columns phone, 4 desktop. Portraits are real photos of the team; no illustrations, no silhouettes. Hidden state until photos arrive.

### S18 · Key figures
Content: 3 or 4 verified figures (year 1999 is the only confirmed one today). Big numeral + label.
Hidden state: entire section removed while figures are unverified. Never mock with fake numbers.

### S19 · Timeline
Content: « Notre histoire »: 4 to 6 dated milestones from 1999.
Layout: vertical on phone, horizontal on desktop. Hidden until the client's notes arrive.

### S20 · Seasonal banner
Content: « Sapins et décorations de Noël : réservez tôt » + link to `/fleurs-sapins-noel/`.
Layout: thin band above the home hero, October to December only, dismissable. Ink background, lime text is **not allowed** (contrast): white text, lime underline or lime chevron.

### S21 · Text section
Generic H2 + 1 to 3 paragraphs, max 70 characters per line, optional inline links. Used for explanations (climate, constraints, method). Alternate white and surface backgrounds along the page so that no two consecutive sections share a background.

### S22 · Legal text
H1 + H3 sub-sections + paragraphs, single column, narrow measure. One frame covers the 3 legal pages.

## 3. Templates

Order of sections is fixed; the page sheets give the exact content. Background rhythm: alternate white and surface; S10 and S12 default to surface; G5 is ink.

### T1 · Home (1 page)
S20 (seasonal, Oct-Dec) → S2 hero → S3 profile entries → S4 services (6 + 2 PACA) → S10 « Pourquoi Flora Concept » → S14 region cards → S13 logos (hidden state) → S7 « Comment ça se passe » (3 steps) → S12 FAQ (3) → G5.
The fold on phone must show: H1, buttons, and the first profile entry.

### T2 · Hub (2 pages: indoor, outdoor)
S1 hero → S4 child-page cards (6 or 4) → S21 « Pourquoi » text → S7 method (4 steps) or S5 checklist → S8 audiences → S10 (outdoor: « Notre engagement électrique ») → S11 case studies → S12 FAQ (4-5) → G5.

### T3 · Service (13 pages)
S1 hero → S5 checklist or S21 → S6 table **or** S7 steps (page-specific) → S8 / S21 (page-specific) → S11 case studies → S12 FAQ (4-5) → G5.
This is the workhorse: design it with the Location page content (03), then check it still works with the Élagage page (18c), which has more text sections.

### T4 · City (3 pages)
S1 hero → S9 area sub-sections (3-4 H3) → S21 (local angle: climate, Parisian constraints) → S5 « Nos services à … » as a linked list → S11 references → S12 FAQ (4-5) → G5.
Paris: an extra S21 block « Qui intervient à Paris » right after the hero (proof block, mandatory before publication).

### T5 · Entity (1 page: Qui sommes-nous)
S1 hero (no photo: a real team or site photo full width instead) → S19 timeline → S17 team → S10 « Notre façon de travailler » → S18 key figures → S10 « Nos engagements » → S12 FAQ (3) → G5 with the line « Envie de travailler avec nous ? ».

### T6 · FAQ (1 page)
S1 hero without photo (H1 + 60-word intro + buttons) → jump list → S12 × 3 blocks (4 + 4 + 5 questions) → G5.

### T7 · Quote (1 page)
H1 + 50-word intro → S15 form + S16 phone block side by side on desktop → S7 « Ce qui se passe ensuite » (3 steps) → footer. No G5 (the page is the CTA), no sticky bar.

### T8 · Blog index (1 page)
H1 + short intro → list of posts: date, title, 2-line excerpt, « Lire » link, optional thumbnail. Reverse chronological, no pagination under 20 posts, no categories at launch. (Post template comes in a later batch.)

### T9 · Legal (3 pages)
S22. Narrow column, no hero, no photos, G5 omitted; footer only.

### T10 · 404 (1 page)
H1 « Page introuvable », one paragraph, 4 links (the two hubs, FAQ, devis), [Recevoir mon devis gratuit] [Appeler]. One frame, phone and desktop.

## 4. States and components to deliver

- **Buttons**: primary (lime bg, ink text), secondary (ink outline), text link; states default, hover, focus, active, disabled. Height ≥ 48 px, hit area ≥ 44 px.
- **Fields**: default, focus, filled, error (message under the field), disabled. Textarea.
- **Cards**: service card (photo), case study card, team card, region card, blog list item.
- **Badges**: « PACA » (on home service cards and outdoor menu items), « Nouveau » is **not** used on the site.
- **Hidden-state rule**: S11, S13, S17, S18, S19 are removed as a whole when their data is missing. Show both states in the file.
- **Photos**: 16:9 hero, 4:3 cards, 3:2 case studies, 1:1 portraits. Real photos only; placeholders as flat grey blocks labelled in the mockup.
- **Accessibility**: contrast ≥ 4.5:1 on all text (lime never as text), visible focus, logical heading order (one H1, H2 per section, H3 inside), touch targets ≥ 44 px.

## 5. Deliverables checklist

1. Components: buttons, fields, cards, badges, header (desktop + open phone menu), sticky bar, footer, cookie banner.
2. Section library: S1 to S22, each at 390 and 1440 (768 where the layout changes).
3. Templates T1 to T10 assembled at 390 / 768 / 1440, with the real texts from `contenu/` (Part 2 says which file).
4. Hidden states for S11, S13, S17, S18, S19.
5. Form states (S15) and the success message.
6. Bonus: one case-study page frame (6 blocks) for the future Réalisations.
