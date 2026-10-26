# Redirections : floraconcept.com et vegetaloffice.fr vers le .fr

> **Brouillon.** Les slugs cibles sont provisoires : ils seront fixés en Phase 1 après la recherche de mots-clés (GATE 1 : plus aucune cible « à fixer »). `<FR>` = domaine .fr du site, confirmé par le client en Phase 0.
> Sources : `etude-2026-09/data/crawl-floraconcept.csv` (audit 05) et `crawl-vegetaloffice.csv` (audit 11).

## Règles
- 301 en un seul saut, vers la page **équivalente** (jamais tout vers l'accueil). Pas de blog sur le nouveau site : un article part vers la page de service la plus proche.
- `410 Gone` pour le contenu sans équivalent légitime : spam injecté par le piratage, article WordPress par défaut, archives.
- Implémentation : `.htaccess` sur l'hébergement de chaque ancien domaine (mod_rewrite, `R=301,L`). Règle finale : tout le reste du domaine vers `<FR>/` **uniquement après** les règles page par page.
- Vérification : `node scripts/check-redirects.mjs` (Phase 6) lit ce fichier et teste chaque ligne.

## floraconcept.com (12 URLs)
| Ancienne URL | Cible | Code |
|---|---|---|
| `/` | `<FR>/` | 301 |
| `/paysagisme/` | `<FR>/paysagisme-interieur/` (à fixer) | 301 |
| `/espaces-verts/` | `<FR>/espaces-verts-entreprise/` (hub extérieur PACA) | 301 |
| `/fleurs-sapins-noel/` | `<FR>/fleurs-sapins-noel/` | 301 |
| `/coordonnees-flora/` | `<FR>/contact/` | 301 |
| `/plante-verte-au-bureau-bienfaits-solutions-entreprise/` | `<FR>/location-plantes-bureaux/` (à fixer) | 301 |
| `/economiser-eau-espaces-verts-solutions-ecologiques/` | `<FR>/creation-amenagement-espaces-verts/` (section arrosage) | 301 |
| `/la-plante-alocasia-bienfaits-bureaux/` | `<FR>/location-plantes-bureaux/` (à fixer) | 301 |
| `/conditions-generales/` | `<FR>/mentions-legales/` | 301 |
| `/politique-de-confidentialite/` | `<FR>/confidentialite/` | 301 |
| `/category/non-classe/` | | 410 |
| `/author/flora/` | | 410 |

## vegetaloffice.fr (28 URLs légitimes)
| Ancienne URL | Cible | Code |
|---|---|---|
| `/` | `<FR>/` | 301 |
| `/a-propos/` | `<FR>/qui-sommes-nous/` | 301 |
| `/accueil/` | `<FR>/` | 301 |
| `/blog/` | `<FR>/` | 301 |
| `/bonjour-tout-le-monde/` | | 410 |
| `/bouquets-fleurs-naturelles-artificielles/` | `<FR>/fleurs-sapins-noel/` (à fixer) | 301 |
| `/cadres-stabilises-naturels/` | `<FR>/cadres-vegetaux-stabilises/` | 301 |
| `/category/non-classe/` | | 410 |
| `/category/valeurs-conseils/` | | 410 |
| `/conditions-generales/` | `<FR>/mentions-legales/` | 301 |
| `/contact/` | `<FR>/contact/` | 301 |
| `/devenir-une-entreprise-eco-responsable/` | `<FR>/entretien-plantes-entreprise/` (à fixer) | 301 |
| `/devis/` | `<FR>/contact/` | 301 |
| `/economiser-leau-espaces-verts-solutions-ecologiques/` | `<FR>/creation-amenagement-espaces-verts/` (section arrosage) | 301 |
| `/espaces-verts/` | `<FR>/espaces-verts-entreprise/` | 301 |
| `/formulaire-newsletter/` | | 410 |
| `/la-plante-alocasia-bienfaits-bureaux/` | `<FR>/location-plantes-bureaux/` (à fixer) | 301 |
| `/le-meilleur-paysagiste-dinterieur-a-paris/` | `<FR>/agences/paris/` | 301 |
| `/location-plantes/` | `<FR>/location-plantes-bureaux/` | 301 |
| `/mur-vegetal-interieur-bureau/` | `<FR>/mur-vegetal-interieur/` | 301 |
| `/paysage-interieur/` | `<FR>/paysagisme-interieur/` (à fixer) | 301 |
| `/paysagiste-dinterieur-paris/` | `<FR>/agences/paris/` | 301 |
| `/plante-verte-au-bureau-bienfaits/` | `<FR>/location-plantes-bureaux/` (à fixer) | 301 |
| `/plantes-interieur-faciles-entretien-bureau/` | `<FR>/entretien-plantes-entreprise/` | 301 |
| `/politique-de-confidentialite/` | `<FR>/confidentialite/` | 301 |
| `/politique-de-cookies-ue/` | `<FR>/cookies/` | 301 |
| `/pourquoi-faire-appel-paysagiste-dinterieur-paris/` | `<FR>/agences/paris/` | 301 |
| `/sapins-de-noel/` | `<FR>/fleurs-sapins-noel/` | 301 |

## vegetaloffice.fr : spam injecté (385 URLs)
Liste complète dans `crawl-vegetaloffice.csv` (`type_contenu` = « SPAM injecté (piratage) ») : slugs numériques `/NNNN-2/` et slugs encodés (grec, cyrillique). Toutes en **410**, avec une règle générique `^[0-9]+-2/?$` + la liste exacte des slugs encodés, puis demande de suppression dans Search Console si elles restent indexées.

## À vérifier en Phase 1
- Export Search Console des 2 anciens domaines (pages avec impressions sur 16 mois) : toute URL avec du trafic absente d'ici doit être ajoutée.
- Backlinks (Semrush/Ahrefs) vers des URLs absentes d'ici.
- Hébergement et accès DNS de vegetaloffice.fr pour poser le `.htaccess`.
