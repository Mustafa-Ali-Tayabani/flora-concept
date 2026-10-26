# Flora Concept site map: document for the development team

> Version 06/10/2026. Structure **approved by the client on 06/10/2026**. This document replaces the "Arborescence" section of the 01/10/2026 delivery: 6 outdoor PACA pages were added. Technical requirements are unchanged, see `DEV-REQUIREMENTS.md` (EN) / `CAHIER-EXIGENCES-DEV.md` (FR). The site is in French: URLs, labels and all visitor-facing strings below are final and must be used exactly as written.

## 1. Full site map (27 pages)

```
/                                                   Home
│
├── /paysagisme-interieur/                          Indoor hub                [PACA + IDF]
│   ├── /location-plantes-bureau/                   Plant rental
│   ├── /entretien-plantes-entreprise/              Plant maintenance
│   ├── /mur-vegetal-interieur/                     Living walls
│   ├── /cadres-vegetaux-plantes-stabilisees/       Preserved plant frames
│   ├── /abonnement-fleurs-entreprise/              Flower subscription
│   ├── /location-plantes-evenementiel/             Event plant rental
│   └── /fleurs-sapins-noel/                        Christmas (seasonal)
│
├── /espaces-verts-entreprise/                      Outdoor hub               [PACA only]
│   ├── /entretien-espaces-verts-copropriete/       Co-owned buildings and property managers
│   ├── /creation-amenagement-espaces-verts/        Landscape design and creation
│   ├── /elagage-entreprise-marseille-aix/          Tree pruning and clearing
│   └── /terrasses-vegetalisees-entreprise/         Planted terraces
├── /ruches-entreprise/                             Corporate beehives        [PACA only]
│
├── /location-entretien-plantes-bureau-paris/       Paris and Île-de-France   [indoor only]
├── /entretien-location-plantes-nice/               Nice and Côte d'Azur      [indoor + outdoor]
├── /entretien-location-plantes-marseille/          Marseille and Provence    [indoor + outdoor]
├── /vegetalisation-bureaux-multisites-paris-paca/  Multi-site Paris + PACA   [indoor]
│
├── /qui-sommes-nous/                               About (entity page)
├── /faq/                                           Cross-site FAQ
├── /devis/                                         Quote request form
├── /blog/                                          Blog index (posts delivered later)
│
├── /mentions-legales/                              Legal notice
├── /politique-de-confidentialite/                  Privacy policy
├── /cookies/                                       Cookie policy
└── 404
```

Every URL ends with `/`. Slugs have no accents and are final as listed. Every legacy URL from floraconcept.com and vegetaloffice.fr gets a 301 to one of these pages (`REDIRECTIONS.md`).

## 2. Page by page

Status: **delivered** = full content available in `contenu/`. The 6 outdoor pages were delivered on 07/10/2026; their `{{A_FOURNIR}}` placeholders (client data) follow the same rule as the other pages.

### 2a. Home and hubs

| URL | Template | Content file | Area (`areaServed`) | Status |
|---|---|---|---|---|
| `/` | Home | `contenu/01-accueil.md` | PACA + IDF | delivered |
| `/paysagisme-interieur/` | Hub | `contenu/02-paysagisme-interieur.md` | PACA + IDF | delivered |
| `/espaces-verts-entreprise/` | Hub | `contenu/18-espaces-verts.md` | PACA | delivered |

### 2b. Indoor services (parent: `/paysagisme-interieur/`)

| URL | Template | Content file | Area | Status |
|---|---|---|---|---|
| `/location-plantes-bureau/` | Service | `contenu/03-location-plantes-bureau.md` | PACA + IDF | delivered |
| `/entretien-plantes-entreprise/` | Service | `contenu/04-entretien-plantes-entreprise.md` | PACA + IDF | delivered |
| `/mur-vegetal-interieur/` | Service | `contenu/05-mur-vegetal-interieur.md` | PACA + IDF | delivered |
| `/cadres-vegetaux-plantes-stabilisees/` | Service | `contenu/06-cadres-vegetaux-stabilises.md` | PACA + IDF | delivered |
| `/abonnement-fleurs-entreprise/` | Service | `contenu/07-abonnement-fleurs-entreprise.md` | PACA + IDF | delivered |
| `/location-plantes-evenementiel/` | Service | `contenu/08-location-plantes-evenementiel.md` | PACA + IDF | delivered |
| `/fleurs-sapins-noel/` | Service | `contenu/09-fleurs-sapins-noel.md` | PACA + IDF | delivered |

### 2c. Outdoor services (parent: `/espaces-verts-entreprise/`, PACA only)

| URL | Template | Content file | Area | Status |
|---|---|---|---|---|
| `/entretien-espaces-verts-copropriete/` | Service | `contenu/18a-espaces-verts-copropriete.md` | PACA | delivered |
| `/creation-amenagement-espaces-verts/` | Service | `contenu/18b-creation-espaces-verts.md` | PACA | delivered |
| `/elagage-entreprise-marseille-aix/` | Service | `contenu/18c-elagage.md` | PACA | delivered |
| `/terrasses-vegetalisees-entreprise/` | Service | `contenu/18d-terrasses-vegetalisees.md` | PACA | delivered |
| `/ruches-entreprise/` | Service | `contenu/19-ruches.md` | PACA | delivered |

These 6 pages (hub + 5) carry a **banner below the H1 reading « Interventions en Provence-Alpes-Côte d'Azur »** and a `Service` JSON-LD whose `areaServed` contains PACA only. They are **never linked from the Paris page** nor from the SEA landing page.

### 2d. City pages and multi-site

| URL | Template | Content file | Services shown | Status |
|---|---|---|---|---|
| `/location-entretien-plantes-bureau-paris/` | City | `contenu/10-agence-paris.md` | indoor only | delivered (block « Qui intervient à Paris » is blocking) |
| `/entretien-location-plantes-nice/` | City | `contenu/11-agence-nice.md` | indoor + links to the outdoor hub | delivered |
| `/entretien-location-plantes-marseille/` | City | `contenu/12-agence-marseille.md` | indoor + links to the outdoor hub | delivered |
| `/vegetalisation-bureaux-multisites-paris-paca/` | Service | `contenu/13-multisites.md` | indoor | delivered |

The word "zone" is an internal shorthand: **it never appears to visitors** (menus, titles, H1, anchors, breadcrumb). Visitor-facing labels combine the service and the city, as provided in the content files: « Plantes pour bureaux à Paris », « Paysagiste à Marseille et en Provence ».

### 2e. Trust, contact, blog, legal

| URL | Template | Content file | Status |
|---|---|---|---|
| `/qui-sommes-nous/` | Entity | `contenu/16-qui-sommes-nous.md` | delivered, updated 06/10 (commitments: electric transition, beehives) |
| `/faq/` | FAQ | `contenu/14-faq.md` | delivered |
| `/devis/` | Quote | `contenu/15-devis.md` | delivered |
| `/blog/` | Blog index | `contenu/blog/PLAN-EDITORIAL.md` | delivered (publishing mechanics: requirements §4) |
| `/mentions-legales/` | Legal | `contenu/90-mentions-legales.md` | delivered |
| `/politique-de-confidentialite/` | Legal | `contenu/91-confidentialite.md` | delivered |
| `/cookies/` | Legal | `contenu/92-cookies.md` | delivered |
| 404 | 404 | `contenu/93-404.md` | delivered |

## 3. Templates to build (10)

| Template | Pages | Specifics |
|---|---|---|
| Home | 1 | 9 sections (order in `01-accueil.md`); seasonal Christmas banner from October to December |
| Hub | 2 | Direct answer, cards to child pages, method, FAQ |
| Service | 13 | Direct answer (130-170 words, plain text at the top), sections, "Réalisations" block (hidden while it contains `{{A_FOURNIR}}`), FAQ, CTA |
| City | 3 | H2 sub-sections per city or district; Paris has no outdoor link at all |
| Entity | 1 | History, team (`Person`), commitments, key figures only if verified |
| FAQ | 1 | 13 questions in 3 groups, each answer linked to its service page |
| Quote | 1 | 3-field form + pre-filled area, honeypot, rate limit, confirmation email |
| Blog index | 1 | Reverse chronological, future-dated posts excluded (page, listing, sitemap) |
| Legal | 3 | Plain text |
| 404 | 1 | Links to the hubs and the quote page |

## 4. Navigation (labels in French, final)

**Header**: Accueil · Services (dropdown: Location de plantes, Entretien, Murs végétaux, Cadres stabilisés, Fleurs, Événementiel, Noël) · Extérieur PACA (dropdown: Espaces verts, Copropriétés, Création, Élagage, Terrasses, Ruches) · Nos villes (Paris, Nice, Marseille) · Multi-sites · Blog · FAQ · button **« Recevoir mon devis gratuit »**.

**Fixed mobile bar** (every page): [Devis] [Appeler].

**Footer**: entity sentence (identical everywhere, see `contenu/README.md`), Gémenos NAP, PACA and Île-de-France areas, service links, Qui sommes-nous, FAQ, Mentions légales, Politique de confidentialité, Cookies, Gestion des cookies.

**Breadcrumb**: Accueil › Hub › Service page. City, multi-site, entity, FAQ and quote pages: Accueil › Page.

## 5. Internal linking rules

- Every service page → its hub + 2 sibling pages + the relevant city pages (Paris excluded for outdoor pages).
- Every city page → the services it presents (Paris: indoor only; Nice and Marseille: indoor + outdoor hub).
- Every page → `/devis/` (button) and `tel:` (« Appeler » button).

## 6. What changed since the 01/10/2026 delivery

| Change | Detail |
|---|---|
| **+ 6 outdoor PACA pages** | Hub `/espaces-verts-entreprise/` + 4 services + `/ruches-entreprise/` (content files 18, 18a-d, 19 delivered 07/10) |
| **New header menu « Extérieur PACA »** | Between Services and Nos villes |
| **Nice and Marseille** | Now link to the outdoor hub; Paris stays indoor only |
| **Qui sommes-nous** | Commitments confirmed by the client: electric transition under way (all maintenance equipment is electric; never mention electric vehicles), corporate beehive sponsorship in PACA |
| **Phase 2, do not build now** | Dedicated city pages (Aix-en-Provence, Cannes, Toulon): decided after launch, on real data |

## 7. Out of scope for this delivery

**Blog posts** are not part of this delivery: the 35 posts (`contenu/blog/NN-*.md`) and the Post template come in a later batch. Only the `/blog/` index and its publishing mechanics (requirements §4) are in scope now.

The **SEA landing page** (`contenu/17-landing-sea.md`) lives on a separate domain under a neutral name, with a single page and the same quote form. It presents indoor landscaping only and has no link to this site.
