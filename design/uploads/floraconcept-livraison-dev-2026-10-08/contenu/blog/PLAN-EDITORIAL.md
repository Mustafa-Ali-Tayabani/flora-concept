# Plan éditorial blog : 35 articles SEO/GEO (ADR 0002)

> Décision du 01/10/2026 : pack complet (**38 articles** après ajout du cluster Noël), publication automatique **2 articles/semaine** (~4,5 mois), full auto après validation du lot 1 (articles 01-05) par l'utilisateur.
> **Exception saisonnière** : les articles 36-38 (Noël) ne suivent pas l'ordre : ils s'intercalent en octobre entre les positions 3 et 6 de la file, pour être indexés avant le pic de novembre-décembre.
> Objectif : couvrir la totalité des requêtes B2B détectées (volumes Semrush du 01/10/2026) + être la source que les IA citent (réponse directe, espèces nommées, conditions précises, zéro chiffre inventé).

## Mécanique de publication automatique (pour le développeur)

1. Chaque article = un fichier dans la Content Collection `blog` avec un frontmatter `pubDate` (date future selon l'ordre ci-dessous, à caler au jour de la mise en ligne du site : article 01 = J0, puis +3/4 jours en alternance lundi/jeudi).
2. Le build Astro **filtre `pubDate <= now`** : un article futur n'est ni rendu, ni présent dans le sitemap, ni listé.
3. Un workflow GitHub Actions planifié (`schedule: cron "0 5 * * 1,4"`, lundi et jeudi 5h UTC) reconstruit et déploie le site : les articles arrivés à échéance se publient seuls. Réutilise `scripts/deploy.sh` ; jamais de publication le week-end.
4. Chaque article embarque : title ≤ 60, meta description 150-160, réponse directe 130-170 mots en tête, FAQ, maillage vers 2+ pages de service, CTA devis, auteur = Flora Concept (entité), `datePublished`/`dateModified` dans le JSON-LD `Article`.
5. **Auteurs** : dès que la page Qui sommes-nous est alimentée (équipe avec accords), chaque article est signé par un membre réel de l'équipe (encadré auteur + JSON-LD `Person` lié à `/qui-sommes-nous/`). En attendant, signature « L'équipe Flora Concept ». {{A_FOURNIR : répartition des signataires}}
6. Interdits hérités du projet : aucun chiffre/prix/étude inventé (fourchettes de marché uniquement si sourcées publiquement), pas de tiret cadratin, pas de mention Végétal Office, `{{A_FOURNIR}}` bloquant en prod.

## File de publication (ordre = priorité volume × citabilité × saison)

| # | Slug | Mot-clé principal (volume FR) | Type |
|---|---|---|---|
| 01 | `meilleures-plantes-bureau` | plante bureau (880) | Pilier info |
| 02 | `plantes-bureau-sans-fenetre` | plante bureau sans lumière (moyen) | GEO fort |
| 03 | `decoration-noel-entreprise-guide` | décoration noël entreprise (110) | **Saisonnier : publier avant mi-octobre** |
| 04 | `louer-ou-acheter-plantes-bureau` | location plantes entreprise (30) + conversion | Conversion |
| 05 | `zamioculcas-bureau` | zamioculcas (14 800) / zamioculcas entretien (1 000) | Espèce |
| 06 | `prix-mur-vegetal-interieur` | combien coûte un mur végétal + mur végétal prix (110) | Pilier info |
| 07 | `kentia-bureau` | kentia (3 600) / kentia entretien (320) | Espèce |
| 08 | `plantes-bureau-sans-entretien` | plante bureau sans entretien (moyen) | Conversion |
| 09 | `sansevieria-bureau` | sansevieria (14 800) | Espèce |
| 10 | `contrat-entretien-plantes-que-comprend` | contrat entretien plantes | Conversion/GEO |
| 11 | `calathea-bureau` | calathea (27 100) | Espèce |
| 12 | `mur-vegetal-naturel-stabilise-artificiel` | mur végétal stabilisé (320) | Pilier info |
| 13 | `spathiphyllum-bureau` | spathiphyllum (22 200) | Espèce |
| 14 | `plantes-depolluantes-bureau-mythe` | plante dépolluante (260) | GEO fort |
| 15 | `dracaena-bureau` | dracaena (18 100) / dracaena massangeana (210) | Espèce |
| 16 | `bienfaits-plantes-bureau` | plantes au bureau (390) | Pilier info |
| 17 | `monstera-bureau` | monstera deliciosa (12 100) | Espèce |
| 18 | `plantes-stabilisees-definition-entretien` | plantes stabilisées (390) | Produit |
| 19 | `ficus-lyrata-benjamina-bureau` | ficus lyrata (5 400) + benjamina (5 400) | Espèce |
| 20 | `design-biophilique-bureau` | design biophilique | Pilier info |
| 21 | `pothos-philodendron-bureau` | pothos (18 100) + philodendron (18 100) | Espèce |
| 22 | `entretien-mur-vegetal` | comment entretenir un mur végétal | Produit |
| 23 | `strelitzia-nicolai-bureau` | strelitzia nicolai (6 600) | Espèce |
| 24 | `plantes-qvt-rse` | plante rse / qvt | Jargon B2B/GEO |
| 25 | `grande-plante-interieur-bureau` | grande plante d'intérieur (390) + plante haute (90) | Espèce roundup |
| 26 | `flex-office-vegetalisation` | plantes open space | Pilier info |
| 27 | `palmier-interieur-bureau` | palmier d'intérieur (320) + areca (720) | Espèce roundup |
| 28 | `plantes-bureau-vacances-ete` | arrosage plantes vacances | Angle PACA |
| 29 | `arbre-interieur-bureau` | arbre d'intérieur (320) + arbre d'ornement (720) | Espèce roundup |
| 30 | `plantes-bureau-climat-mediterraneen` | plantes bureau + climatisation (angle Sud) | GEO local |
| 31 | `pachira-bureau` | pachira (12 100) | Espèce |
| 32 | `vegetaliser-hotel-restaurant-cote-azur` | mur végétal hôtel | Secteur |
| 33 | `jardiniere-interieur-cloison-vegetale` | jardinière d'intérieur (390-480) + cloison végétale | Produit (gap Gally) |
| 34 | `cahier-des-charges-plantes-bureau` | services généraux plantes (lead magnet) | Conversion B2B |
| 35 | `plante-ombre-interieur-couloirs` | plante d'ombre intérieur + zones aveugles | GEO |
| 36 | `grand-sapin-noel-hall-entreprise` | grand sapin de noël (390, KD 11) + géant (90, KD 8) + location (210, KD 12) | **Saisonnier : s'intercale en octobre, après l'article 03** |
| 37 | `sapin-naturel-nordmann-entreprise` | sapin de noël naturel (1 600) + nordmann (720) + livraison (480) | **Saisonnier : octobre** |
| 38 | `noel-entreprise-rse-recyclage` | sapin écologique (140) + recyclage sapin (110) + calendrier de l'avent entreprise (320, KD 6) | **Saisonnier : fin octobre.** Le calendrier de l'avent entreprise (B2B pur, KD 6) est traité en section ; n'en faire une page d'offre que si le client vend la prestation |

**Gabarit espèce** (articles 05, 07, 09, 11, 13, 15, 17, 19, 21, 23, 27, 31) : « [Espèce] au bureau : lumière, entretien, pour quels espaces » : fiche d'identité (lumière, arrosage, croissance, toxicité éventuelle), pourquoi elle marche (ou pas) en entreprise, les erreurs classiques, l'alternative stabilisée si pertinent, CTA entretien/location. Angle B2B systématique : aucun concurrent ne le fait.

## Statuts

| Lot | Articles | Statut |
|---|---|---|
| 1 | 01-05 | **Rédigés le 01/10/2026, en validation utilisateur** |
| 2 | 06-15 | À rédiger |
| 3 | 16-25 | À rédiger |
| 4 | 26-35 | À rédiger |
