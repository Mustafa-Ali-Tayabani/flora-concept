# Arborescence du site Flora Concept : document pour l'équipe de développement

> Version du 06/10/2026. Structure **validée par le client le 06/10/2026**. Ce document remplace la section « Arborescence » de la livraison du 01/10/2026 : 6 pages extérieur PACA ont été ajoutées. Les exigences techniques restent celles du `CAHIER-EXIGENCES-DEV.md` (FR) / `DEV-REQUIREMENTS.md` (EN).

## 1. Arborescence complète (27 pages)

```
/                                                   Accueil
│
├── /paysagisme-interieur/                          Hub intérieur             [PACA + IDF]
│   ├── /location-plantes-bureau/                   Location de plantes
│   ├── /entretien-plantes-entreprise/              Entretien
│   ├── /mur-vegetal-interieur/                     Murs végétaux
│   ├── /cadres-vegetaux-plantes-stabilisees/       Cadres stabilisés
│   ├── /abonnement-fleurs-entreprise/              Abonnement fleurs
│   ├── /location-plantes-evenementiel/             Événementiel
│   └── /fleurs-sapins-noel/                        Noël (saisonnier)
│
├── /espaces-verts-entreprise/                      Hub extérieur             [PACA uniquement]
│   ├── /entretien-espaces-verts-copropriete/       Copropriétés et syndics
│   ├── /creation-amenagement-espaces-verts/        Création et aménagement
│   ├── /elagage-entreprise-marseille-aix/          Élagage et débroussaillage
│   └── /terrasses-vegetalisees-entreprise/         Terrasses végétalisées
├── /ruches-entreprise/                             Ruches en entreprise      [PACA uniquement]
│
├── /location-entretien-plantes-bureau-paris/       Paris et Île-de-France    [intérieur uniquement]
├── /entretien-location-plantes-nice/               Nice et Côte d'Azur       [intérieur + extérieur]
├── /entretien-location-plantes-marseille/          Marseille et Provence     [intérieur + extérieur]
├── /vegetalisation-bureaux-multisites-paris-paca/  Multi-sites Paris + PACA  [intérieur]
│
├── /qui-sommes-nous/                               Page d'entité
├── /faq/                                           FAQ transverse
├── /devis/                                         Formulaire de devis
├── /blog/                                          Index du blog (articles livrés plus tard)
│
├── /mentions-legales/
├── /politique-de-confidentialite/
├── /cookies/
└── 404
```

Toutes les URL se terminent par `/`. Slugs sans accents, tels que listés. Les anciennes URL de floraconcept.com et vegetaloffice.fr redirigent en 301 vers ces pages (`REDIRECTIONS.md`).

## 2. Les pages une à une

Statut : **livré** = contenu complet dans `contenu/`. Les 6 pages extérieur ont été livrées le 07/10/2026 ; leurs `{{A_FOURNIR}}` (données client) suivent la même règle que les autres pages.

### 2a. Accueil et hubs

| URL | Gabarit | Fichier contenu | Zone (`areaServed`) | Statut |
|---|---|---|---|---|
| `/` | Accueil | `contenu/01-accueil.md` | PACA + IDF | livré |
| `/paysagisme-interieur/` | Hub | `contenu/02-paysagisme-interieur.md` | PACA + IDF | livré |
| `/espaces-verts-entreprise/` | Hub | `contenu/18-espaces-verts.md` | PACA | livré |

### 2b. Services intérieur (parent : `/paysagisme-interieur/`)

| URL | Gabarit | Fichier contenu | Zone | Statut |
|---|---|---|---|---|
| `/location-plantes-bureau/` | Service | `contenu/03-location-plantes-bureau.md` | PACA + IDF | livré |
| `/entretien-plantes-entreprise/` | Service | `contenu/04-entretien-plantes-entreprise.md` | PACA + IDF | livré |
| `/mur-vegetal-interieur/` | Service | `contenu/05-mur-vegetal-interieur.md` | PACA + IDF | livré |
| `/cadres-vegetaux-plantes-stabilisees/` | Service | `contenu/06-cadres-vegetaux-stabilises.md` | PACA + IDF | livré |
| `/abonnement-fleurs-entreprise/` | Service | `contenu/07-abonnement-fleurs-entreprise.md` | PACA + IDF | livré |
| `/location-plantes-evenementiel/` | Service | `contenu/08-location-plantes-evenementiel.md` | PACA + IDF | livré |
| `/fleurs-sapins-noel/` | Service | `contenu/09-fleurs-sapins-noel.md` | PACA + IDF | livré |

### 2c. Services extérieur (parent : `/espaces-verts-entreprise/`, PACA uniquement)

| URL | Gabarit | Fichier contenu | Zone | Statut |
|---|---|---|---|---|
| `/entretien-espaces-verts-copropriete/` | Service | `contenu/18a-espaces-verts-copropriete.md` | PACA | livré |
| `/creation-amenagement-espaces-verts/` | Service | `contenu/18b-creation-espaces-verts.md` | PACA | livré |
| `/elagage-entreprise-marseille-aix/` | Service | `contenu/18c-elagage.md` | PACA | livré |
| `/terrasses-vegetalisees-entreprise/` | Service | `contenu/18d-terrasses-vegetalisees.md` | PACA | livré |
| `/ruches-entreprise/` | Service | `contenu/19-ruches.md` | PACA | livré |

Ces 6 pages (hub + 5) portent un **bandeau « Interventions en Provence-Alpes-Côte d'Azur »** sous le H1 et un JSON-LD `Service` dont `areaServed` ne contient que la PACA. Elles ne sont **jamais liées depuis la page Paris** ni depuis la landing SEA.

### 2d. Pages villes et multi-sites

| URL | Gabarit | Fichier contenu | Services présentés | Statut |
|---|---|---|---|---|
| `/location-entretien-plantes-bureau-paris/` | Ville | `contenu/10-agence-paris.md` | intérieur uniquement | livré (bloc « Qui intervient à Paris » bloquant) |
| `/entretien-location-plantes-nice/` | Ville | `contenu/11-agence-nice.md` | intérieur + liens vers le hub extérieur | livré |
| `/entretien-location-plantes-marseille/` | Ville | `contenu/12-agence-marseille.md` | intérieur + liens vers le hub extérieur | livré |
| `/vegetalisation-bureaux-multisites-paris-paca/` | Service | `contenu/13-multisites.md` | intérieur | livré |

Le mot « zone » est un raccourci interne : **il n'apparaît jamais côté visiteur** (menus, titres, H1, ancres, fil d'Ariane). On écrit « Plantes pour bureaux à Paris », « Paysagiste à Marseille et en Provence ».

### 2e. Confiance, contact, blog, légal

| URL | Gabarit | Fichier contenu | Statut |
|---|---|---|---|
| `/qui-sommes-nous/` | Entité | `contenu/16-qui-sommes-nous.md` | livré, mis à jour le 06/10 (engagements : transition électrique, ruches) |
| `/faq/` | FAQ | `contenu/14-faq.md` | livré |
| `/devis/` | Devis | `contenu/15-devis.md` | livré |
| `/blog/` | Index blog | `contenu/blog/PLAN-EDITORIAL.md` | livré (mécanique de publication : cahier §4) |
| `/mentions-legales/` | Légal | `contenu/90-mentions-legales.md` | livré |
| `/politique-de-confidentialite/` | Légal | `contenu/91-confidentialite.md` | livré |
| `/cookies/` | Légal | `contenu/92-cookies.md` | livré |
| 404 | 404 | `contenu/93-404.md` | livré |

## 3. Gabarits à développer (10)

| Gabarit | Pages | Particularités |
|---|---|---|
| Accueil | 1 | 9 sections (ordre dans `01-accueil.md`) ; bandeau saisonnier Noël d'octobre à décembre |
| Hub | 2 | Réponse directe, cartes vers les pages filles, méthode, FAQ |
| Service | 13 | Réponse directe (130-170 mots, texte brut en haut), sections, bloc Réalisations (masqué tant que `{{A_FOURNIR}}`), FAQ, CTA |
| Ville | 3 | Sous-sections H2 par ville ou quartier ; Paris sans aucun lien extérieur |
| Entité | 1 | Histoire, équipe (`Person`), engagements, chiffres clés si vérifiés |
| FAQ | 1 | 13 questions en 3 blocs, chaque réponse liée à sa page de service |
| Devis | 1 | Formulaire 3 champs + zone pré-remplie, honeypot, rate limit, accusé de réception |
| Index blog | 1 | Antéchronologique, articles à date future exclus (page, listing, sitemap) |
| Légal | 3 | Texte simple |
| 404 | 1 | Liens vers les hubs et le devis |

## 4. Navigation

**Header** : Accueil · Services (menu : location, entretien, mur végétal, cadres, fleurs, événementiel, Noël) · Extérieur PACA (menu : espaces verts, copropriétés, création, élagage, terrasses, ruches) · Nos villes (Paris, Nice, Marseille) · Multi-sites · Blog · FAQ · bouton **« Recevoir mon devis gratuit »**.

**Barre fixe mobile** (toutes les pages) : [Devis] [Appeler].

**Footer** : phrase d'entité (identique partout, voir `contenu/README.md`), NAP de Gémenos, zones PACA et Île-de-France, liens services, Qui sommes-nous, FAQ, mentions légales, confidentialité, cookies, gestion des cookies.

**Fil d'Ariane** : Accueil › Hub › Page de service. Pages villes, multi-sites, entité, FAQ, devis : Accueil › Page.

## 5. Maillage interne (règles)

- Chaque page de service → son hub + 2 pages sœurs + les pages villes concernées (Paris exclu pour les pages extérieur).
- Chaque page ville → les services qu'elle présente (Paris : intérieur uniquement ; Nice et Marseille : intérieur + hub extérieur).
- Toutes les pages → `/devis/` (bouton) et `tel:` (bouton Appeler).

## 6. Ce qui change par rapport à la livraison du 01/10/2026

| Changement | Détail |
|---|---|
| **+ 6 pages extérieur PACA** | Hub `/espaces-verts-entreprise/` + 4 services + `/ruches-entreprise/` (contenus 18, 18a-d, 19 livrés le 07/10) |
| **Nouveau menu « Extérieur PACA »** | Dans le header, entre Services et Nos villes |
| **Nice et Marseille** | Ajoutent des liens vers le hub extérieur ; Paris reste intérieur uniquement |
| **Qui sommes-nous** | Engagements confirmés par le client : transition électrique engagée (tout le matériel d'entretien est électrique ; ne pas évoquer de véhicules électriques), parrainage de ruches en PACA |
| **Phase 2, ne pas développer maintenant** | Pages villes dédiées (Aix-en-Provence, Cannes, Toulon) : décision après lancement, sur données réelles |

## 7. Hors de cette livraison

**Les articles de blog** ne font pas partie de cette livraison : les 35 articles (`contenu/blog/NN-*.md`) et le gabarit Article viendront dans un lot ultérieur. Seuls l'index `/blog/` et sa mécanique de publication (cahier §4) sont dans le périmètre.

La **landing page SEA** (`contenu/17-landing-sea.md`) vit sur un domaine séparé, sous un nom neutre, avec une seule page et le même formulaire de devis. Elle ne présente que le paysagisme d'intérieur et n'a aucun lien vers ce site.
