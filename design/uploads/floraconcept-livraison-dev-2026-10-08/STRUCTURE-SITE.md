# Structure complète du site Flora Concept

> Document de référence consolidé (01/10/2026). Sources : PRD §5, contenus rédigés (`docs/contenu/`), volumes Semrush FR du 01/10/2026 (`docs/phase1-mots-cles.md`), plan blog (`docs/contenu/blog/PLAN-EDITORIAL.md`).
> Vol. = recherches mensuelles France (Semrush). n.d. = volume sous le seuil de mesure : page justifiée par la conversion, le pack local ou le GEO, pas par le trafic.

## 1. Arborescence

```
/                                        Accueil
├── /paysagisme-interieur/               Hub services — végétalisation bureau
│   ├── /location-plantes-bureau/        Pilier 1 — location de plantes (210)
│   ├── /entretien-plantes-entreprise/   Pilier 2 — entretien (conversion/GEO)
│   ├── /mur-vegetal-interieur/          Produit — mur végétal intérieur (2 400)
│   ├── /cadres-vegetaux-plantes-stabilisees/  Produit — cadre/tableau stabilisé (3 660 cumulés)
│   ├── /abonnement-fleurs-entreprise/   Service — fleurs fraîches
│   ├── /location-plantes-evenementiel/  Service — événementiel (70)
│   └── /fleurs-sapins-noel/             Saisonnier — Noël (110 + 20)
├── /location-entretien-plantes-bureau-paris/   Zone Paris et IDF (70 + 50 + 20)
├── /entretien-location-plantes-nice/           Zone Nice et Côte d'Azur
├── /entretien-location-plantes-marseille/      Zone Marseille et Provence (20 + 20)
├── /vegetalisation-bureaux-multisites-paris-paca/  Multi-sites (GEO + preuve commerciale)
├── /espaces-verts-entreprise/           NOUVEAU — hub extérieur B2B. **PACA UNIQUEMENT**
│   ├── /entretien-espaces-verts-copropriete/   Copropriétés et syndics (110, KD 14)
│   ├── /creation-amenagement-espaces-verts/    Création et aménagement (110 + 110)
│   ├── /elagage-entreprise-marseille-aix/      Élagage et débroussaillage (210 + 140, KD 9)
│   └── /terrasses-vegetalisees-entreprise/     Terrasses et rooftops (390, KD 10)
├── /ruches-entreprise/                  NOUVEAU — parrainage de ruches (RSE, différenciant). **PACA UNIQUEMENT**
├── /qui-sommes-nous/                    Entité : histoire, équipe (E-E-A-T, GEO)
├── /faq/                                FAQ transverse (GEO)
├── /devis/                              Contact / devis (conversion)
├── /blog/                               Index du blog (35 articles, 2/semaine)
│   └── /blog/<slug>/                    Articles (voir §5)
└── /mentions-legales/  /politique-de-confidentialite/  /cookies/  404
```

> **Décision client du 02/10/2026 (J. Fargeme)** : les autres services (espaces verts, extérieur, ruches) sont poussés sur le site, **mais uniquement pour la zone PACA**. **Paris et l'Île-de-France : paysagisme d'intérieur exclusivement.** Conséquences : la page Paris ne mentionne jamais l'extérieur ; les pages Nice et Marseille renvoient vers le hub espaces verts ; les 2 nouvelles pages portent un bandeau de zone « Interventions en Provence-Alpes-Côte d'Azur » et un JSON-LD `areaServed` limité à la PACA. Mots-clés des 2 nouvelles pages à mesurer (Semrush) avant rédaction ; contenu à rédiger ensuite dans `docs/contenu/` (18-espaces-verts, 19-ruches).

**Navigation header** : Accueil · Services (menu déroulant : location, entretien, mur végétal, cadres, fleurs, événementiel, Noël) · Extérieur PACA (menu : espaces verts, copropriétés, création, élagage, terrasses, ruches) · Nos zones (Paris, Nice, Marseille) · Multi-sites · Blog · FAQ · **[Demander un devis]** (bouton).
**Barre fixe mobile** : [Devis] [Appeler].
**Footer** : phrase d'entité, base de Gémenos (NAP) + zones PACA et IDF, liens services, Qui sommes-nous, FAQ, mentions légales, confidentialité, cookies, gestion des cookies.

## 2. Page d'accueil `/` : sections dans l'ordre

| # | Section | Contenu |
|---|---|---|
| 0 | **Bandeau saisonnier** (octobre à décembre uniquement) | « Sapins et décorations de Noël : réservez tôt » → `/fleurs-sapins-noel/` |
| 1 | **Hero** | H1 « Des espaces de travail plus verts, sans vous en occuper » + phrase d'entité + [Devis] [Appeler] |
| 2 | **3 entrées par profil** (au-dessus de la ligne de flottaison à 390 px) | Bureaux et sièges → location · Hôtels/résidences → hub · Syndics/gestionnaires → multi-sites |
| 3 | **Nos services** (6 cartes) | Location · Entretien · Murs végétaux · Cadres stabilisés · Fleurs/événementiel · Noël |
| 4 | **Pourquoi Flora Concept** | Depuis 1999 · jardiniers salariés · équipes en PACA et IDF · remplacement compris |
| 5 | **Nos zones d'intervention** (2 cartes régions) | PACA (villes) · Île-de-France (Paris, La Défense, 92). Pas de carte « base de Gémenos » (décision 02/10/2026 : origine vague, zones appuyées) ; le NAP reste en footer, mentions légales et fiche Google |
| 6 | **Ils nous font confiance** | Logos clients `{{A_FOURNIR}}` |
| 7 | **Comment ça se passe** (3 étapes) | Visite-conseil → proposition → installation et suivi |
| 8 | **FAQ** (3 questions) | Villes couvertes · location ou vente · comment obtenir un devis |
| 9 | **CTA final** | [Demander un devis] |

Mot-clé : marque + entité (pas de mot-clé de tête). JSON-LD : `Organization` + 3 `LocalBusiness`.

## 3. Pages de service : mot-clé, volume, sections

Toutes les pages de service ouvrent sur une **réponse directe de 130-170 mots** (format citable par les IA) et se ferment sur un **CTA devis**. Contenu intégral déjà rédigé dans `docs/contenu/`.

| Page | Mot-clé principal (vol.) | Secondaires clés (vol.) | Sections dans l'ordre |
|---|---|---|---|
| **Hub paysagisme** `/paysagisme-interieur/` | végétalisation bureau (10) | paysagiste d'intérieur (170), jardinier intérieur (210), décoration végétale bureau | Réponse directe · Ce que recouvre le paysagisme d'intérieur (6 liens services) · Pourquoi végétaliser · Notre méthode (4 étapes) · Pour qui · FAQ (4) |
| **Location** `/location-plantes-bureau/` | location de plantes (210) | location plantes (210), location plantes bureau (20), location plantes vertes (40), location plante (140) | Réponse directe · Ce que comprend la location · Location ou achat (tableau) · Pour quels espaces · Réalisations · FAQ (5) |
| **Entretien** `/entretien-plantes-entreprise/` | entretien plantes entreprise (n.d. : page de conversion) | contrat entretien plantes, jardinier intérieur (210), entreprise d'entretien de plantes d'intérieur | Réponse directe · Ce que fait le jardinier à chaque passage · Reprise de parcs existants · Pour les services généraux · Réalisations · FAQ (5) |
| **Mur végétal** `/mur-vegetal-interieur/` | mur végétal intérieur entreprise (20) + tête mur végétal intérieur (2 400) | mur végétal entreprise (170), mur végétal stabilisé (320), mur végétal prix (110), prix m2 stabilisé (30) | Réponse directe · Naturel ou stabilisé (tableau comparatif) · Votre logo en végétal · Déroulé d'un projet (4 étapes) · Réalisations · FAQ (4) |
| **Cadres stabilisés** `/cadres-vegetaux-plantes-stabilisees/` | cadre végétal stabilisé (480) | tableau végétal (1 300), cadre végétal (1 000), tableau végétal stabilisé (880), mur végétal avec logo | Réponse directe · Qu'est-ce qu'un végétal stabilisé · Nos formats (tableau, XXL, logo) · Pourquoi le stabilisé · Réalisations · FAQ (4) |
| **Abonnement floral** `/abonnement-fleurs-entreprise/` | abonnement fleurs entreprise (faible, estimé) | livraison fleurs entreprise, fleuriste pour entreprise | Réponse directe · Comment fonctionne l'abonnement (4 étapes) · Pour qui · Réalisations · FAQ (4) |
| **Événementiel** `/location-plantes-evenementiel/` | location plantes événementiel (70) | + tarif (50), location palmier (70), bambou location (110), location plantes mariage (90) | Réponse directe · Pour quels événements · Comment ça marche (3 étapes) · Quelles plantes louer · Réalisations · FAQ (4) |
| **Noël** `/fleurs-sapins-noel/` | location sapin de noël entreprise (20) | décoration noël entreprise (110), sapin de noel entreprise (50) | Réponse directe · Nos prestations de fin d'année · Pourquoi réserver tôt · Réalisations · FAQ (4) |

## 4. Pages zones, multi-sites, FAQ, devis

| Page | Mot-clé (vol.) | Sections dans l'ordre | Spécificité |
|---|---|---|---|
| **Paris** `/location-entretien-plantes-bureau-paris/` | location plantes bureau paris (20) + location plantes paris (70 + 50) | Réponse directe · **Qui intervient à Paris** (bloc bloquant) · Services · Contraintes parisiennes (sous-sections La Défense, Hauts-de-Seine) · Multi-sites Paris+Sud · Références · FAQ (5) | Anti-doorway : ≥ 60 % de contenu propre à Paris. Pas de pages arrondissements |
| **Nice** `/entretien-location-plantes-nice/` | location plantes nice (n.d., pack local) + paysagiste nice (480, KD 19) en secondaire | Réponse directe · Côte d'Azur (sous-sections H2 formulées comme les requêtes : « Paysagiste à Nice », « Cannes et Antibes », « Sophia Antipolis », « Monaco ») · Services (intérieur + extérieur) · Références · FAQ (4) | mur vegetal nice (30), paysagiste cannes (260, KD 13), antibes (140, KD 12) en secondaires |
| **Marseille** `/entretien-location-plantes-marseille/` | location plantes marseille (20 + 20) + paysagiste marseille (1 300, KD 19) en secondaire | Réponse directe · Provence (sous-sections H2 formulées comme les requêtes : « Paysagiste à Marseille et Aubagne », « Aix-en-Provence », « Toulon et le Var », « Avignon ») · Climat provençal · Services (intérieur + extérieur) · Références · FAQ (4) | Site historique Gémenos (1999) ; paysagiste aix (390, KD 14), toulon (210), avignon (210), gémenos (90) en secondaires |

**Règle de libellé (02/10/2026)** : le mot « zone » est un raccourci interne de ce document. **Il n'apparaît jamais côté visiteur** : menus, titres, H1 et ancres utilisent le service + la ville (« Plantes pour bureaux à Paris », « Paysagiste à Marseille et en Provence »), jamais « Zone Paris ».

**Pages villes dédiées (Phase 2, après lancement)** : la mesure du 02/10 justifie des pages dédiées quand deux conditions sont réunies : demande prouvée ET références locales du client pour ≥ 60 % de contenu propre (anti-doorway). Candidate n° 1 : **Aix-en-Provence** (≈ 620 recherches/mois cumulées : paysagiste 390 KD 14 + élagage 140 KD 9 + jardinier 90 KD 16). Puis Cannes (260, KD 13) et Toulon (210). Décision sur données GSC + retours de références, jamais en avance.
| **Multi-sites** `/vegetalisation-bureaux-multisites-paris-paca/` | prestataire plantes bureaux multi-sites (n.d.) | Réponse directe · Ce que change un prestataire unique (tableau) · Comment nous couvrons vos sites · Pour les services généraux · Référence · FAQ (4) | Page de preuve + GEO (prompts IA multi-sites), cible AO/achats |
| **Qui sommes-nous** `/qui-sommes-nous/` | (page d'entité : marque « flora concept ») | Réponse directe (phrase d'entité + histoire) · Notre histoire · L'équipe (portraits, futurs signataires du blog) · Notre façon de travailler · Chiffres clés (si vérifiés) · Engagements · FAQ (3) | **Cœur E-E-A-T/GEO** : corrige l'entité auprès des IA ; `foundingDate` 1999, `Person` de l'équipe ; attend les éléments demandés au client le 01/10/2026. L'ancienne `/a-propos/` y redirige |
| **FAQ** `/faq/` | questions acheteurs (GEO) + plante bureau (880) en appui | Intro · Bloc Choisir sa formule (4 Q) · Bloc Plantes et espaces difficiles (4 Q) · Bloc Prestations et zones (5 Q) | Réponses autonomes 40-80 mots, chacune liée à sa page de service |
| **Devis** `/devis/` | (navigationnelle) | Intro · Formulaire 3 champs (nom, email/tél, besoin ; zone pré-remplie) · Appeler directement (numéro unique ou par région, à confirmer) · Ce qui se passe ensuite (3 étapes) | Événements `devis_submit` / `call_click` ; honeypot + rate limit |

## 5. Blog `/blog/` (en dernier dans la nav, publié en automatique)

**Index `/blog/`** : liste antéchronologique, pas de pagination avant 20 articles, pas de catégories au lancement (3 tags max ensuite : Conseils, Espèces, Projets).
**Mécanique** : 35 articles pré-rédigés, `pubDate` échelonnées, build quotidien planifié (lundi/jeudi) → 2 publications/semaine pendant ~4 mois, démarrage au jour de la mise en ligne du site. Détail et file complète : `docs/contenu/blog/PLAN-EDITORIAL.md`.

Têtes de file (lot 1 rédigé, en validation) : meilleures plantes bureau (880) · plantes bureau sans fenêtre · décoration Noël entreprise (110, avant mi-octobre) · louer ou acheter · zamioculcas (14 800). Puis en alternance : piliers informationnels (prix mur végétal, contrat d'entretien, RSE/QVT, flex office, biophilie…) et fiches espèces B2B (calathea 27 100, spathiphyllum 22 200, dracaena 18 100, sansevieria 14 800, monstera 12 100, kentia 3 600…), angle « au bureau » qu'aucun concurrent n'exploite.

## 5bis. Pages extérieur PACA (nouvelles, décision client 02/10/2026 ; cluster hub + 4 filles acté le 02/10)

| Page | Mot-clé principal (vol., KD) | Sections prévues | Statut |
|---|---|---|---|
| **Hub espaces verts** `/espaces-verts-entreprise/` | entretien espaces verts entreprise (320, KD 20) ; secondaires : entreprise espaces verts (1 300), entretien des espaces verts (2 400) | Réponse directe · Nos 4 prestations (cartes vers les pages filles) · Pour qui (syndics, hôtels, entreprises) · Engagement électrique (moins de bruit, RSE) · Réalisations · FAQ | Rédigé le 07/10/2026 (`18-espaces-verts.md`) |
| **Copropriétés** `/entretien-espaces-verts-copropriete/` | entretien espaces verts copropriété (110, KD 14) ; secondaires : entretien jardin copropriété, entretien copropriété marseille | Réponse directe · Ce que couvre le contrat annuel · Pour les syndics (interlocuteur unique, reporting AG) · Réalisations · FAQ | Rédigé le 07/10/2026 (`18a-espaces-verts-copropriete.md`) — plus forte valeur B2B (contrats récurrents) |
| **Création** `/creation-amenagement-espaces-verts/` | création espaces verts (110, KD 24) ; secondaires : aménagement espaces verts (110), aménagement jardin marseille | Réponse directe · De l'esquisse à la plantation (étapes) · Terrains d'entreprise, abords, parkings · Réalisations · FAQ | Rédigé le 07/10/2026 (`18b-creation-espaces-verts.md`) |
| **Élagage** `/elagage-entreprise-marseille-aix/` | élagage marseille (210, KD 20) + élagage aix en provence (140, KD 9) ; secondaires : entreprise élagage (320), débroussaillage marseille, taille de haies | Réponse directe · Élagage, taille, débroussaillage (obligations légales DFCI) · Sécurité et nacelle (preuve Insta Golden Tulip) · Réalisations · FAQ | Rédigé le 07/10/2026 (`18c-elagage.md`) — KD 9 sur Aix : opportunité immédiate |
| **Terrasses** `/terrasses-vegetalisees-entreprise/` | terrasse végétalisée (390, KD 10) ; secondaires : végétalisation terrasse (90), entretien terrasse (320), aménagement terrasse entreprise | Réponse directe · Terrasses de bureaux, rooftops, terrasses d'hôtels · Bacs, pergolas, mobilier (preuves Insta) · Réalisations · FAQ | Rédigé le 07/10/2026 (`18d-terrasses-vegetalisees.md`) — pont naturel avec l'offre hôtels |
| **Ruches** `/ruches-entreprise/` | Parrainage de ruches en entreprise (RSE). Différenciant en PACA : seul Gally le propose (depuis l'IDF), aucun acteur PACA étudié avec un rucher local (Luberon). **PACA uniquement**. **Service confirmé par le client le 06/10/2026** | Réponse directe · Comment fonctionne le parrainage · Ce que reçoit l'entreprise · Le rucher (Luberon) · FAQ | Mesuré le 02/10 : **parrainer une ruche (260, KD 19)** + parrainage ruche (210, KD 20) + ruche entreprise (70) : vraie demande. Rédigé le 07/10/2026 (`19-ruches.md`), fonctionnement du parrainage à valider par le client |

**Découverte de la mesure du 02/10/2026** (`data/semrush/espaces-verts-paca-fr-2026-10-02.csv`) : le pool extérieur PACA dépasse largement l'intérieur en volume — paysagiste marseille (1 300, KD 19), paysagiste nice (480), aix (390, KD 14), cannes (260), toulon/var/avignon (210 chacun), **paysagiste gémenos (90)**, entretien espaces verts (1 900-2 400). Conséquence : les pages zones Marseille et Nice prennent « paysagiste marseille / paysagiste nice » en mots-clés secondaires (intention mixte pro/particulier, pack local accessible avec la fiche Gémenos) ; une page élagage dédiée est une option Phase 2 si le client confirme la capacité (élagage aix KD 9 = quasi gratuit).

Règle de zone : bandeau « Interventions en Provence-Alpes-Côte d'Azur » sur ces 2 pages, `areaServed` PACA seul, maillage depuis Nice et Marseille uniquement (jamais depuis la page Paris).

## 6. Règles transverses (rappel)

- CTA « Demander un devis » + « Appeler » sur 100 % des pages ; barre fixe mobile.
- Aucun prix affiché (décision client 01/10/2026) ; zéro chiffre inventé : `{{A_FOURNIR}}` bloquant en production.
- Phrase d'entité identique partout ; aucune mention de Végétal Office.
- Title 50-60, meta description 150-160, uniques ; réponse directe en tête de chaque page de service et article.
- Maillage : chaque page de service ↔ hub + 2 pages sœurs + pages zones ; chaque article → 2+ pages de service.
- 301 : chaque ancienne URL de floraconcept.com et vegetaloffice.fr vers sa page équivalente (`docs/REDIRECTIONS.md`).
- **Périmètre géographique par service (décision client 02/10/2026)** : paysagisme d'intérieur = PACA + Île-de-France ; tous les autres services (espaces verts, extérieur, ruches) = **PACA uniquement**. Jamais d'extérieur sur la page Paris, ni sur la landing SEA.
