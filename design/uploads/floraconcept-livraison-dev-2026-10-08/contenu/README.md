# Contenu du site Flora Concept (livraison développeur)

> Rédigé le 01/10/2026. Un fichier Markdown par page. Chaque fichier contient : metadata (title, meta description), H1, réponse directe, sections dans l'ordre, FAQ, maillage interne et liste des données à fournir par le client.

## Règles d'intégration (à respecter telles quelles)

1. **`{{A_FOURNIR}}`** : donnée manquante à obtenir du client (adresse, téléphone, nom de client, chiffre, photo). **Aucune page ne part en production avec un `{{A_FOURNIR}}` visible.** Ne jamais inventer la valeur.
2. **Phrase d'entité** (identique partout : site, fiche Google, LinkedIn) :
   > Flora Concept est un spécialiste du paysagisme d'intérieur pour les entreprises depuis 1999 : location et entretien de plantes, murs végétaux et cadres végétaux stabilisés, basé dans le sud de la France près d'Aix-en-Provence, avec des équipes en Provence-Alpes-Côte d'Azur et en Île-de-France.
3. **CTA sur chaque page** : bouton principal libellé **« Recevoir mon devis gratuit »** (vers la page Devis, zone pré-remplie selon la page ; les mentions `[Demander un devis]` dans les fichiers désignent ce bouton) + bouton « Appeler » (`tel:` : numéro unique ou par région, à confirmer). Barre fixe « Devis / Appeler » sur mobile. Jamais de bouton « Envoyer ».
4. **Aucun prix affiché** (décision client du 01/10/2026). Aucune mention de Végétal Office. Jamais de tiret cadratin comme connecteur.
5. Title 50-60 caractères, meta description 150-160, uniques par page.
6. Les sections « Réalisations » attendent les cas clients réels : intégrer la structure, masquer le bloc tant que `{{A_FOURNIR}}`.

## Liste des pages

| Fichier | Slug | Mot-clé principal |
|---|---|---|
| `01-accueil.md` | `/` | (marque + entité) |
| `02-paysagisme-interieur.md` | `/paysagisme-interieur/` | végétalisation bureau |
| `03-location-plantes-bureau.md` | `/location-plantes-bureau/` | location plantes bureau |
| `04-entretien-plantes-entreprise.md` | `/entretien-plantes-entreprise/` | entretien plantes entreprise |
| `05-mur-vegetal-interieur.md` | `/mur-vegetal-interieur/` | mur végétal intérieur entreprise |
| `06-cadres-vegetaux-stabilises.md` | `/cadres-vegetaux-plantes-stabilisees/` | cadre végétal stabilisé |
| `07-abonnement-fleurs-entreprise.md` | `/abonnement-fleurs-entreprise/` | abonnement fleurs entreprise |
| `08-location-plantes-evenementiel.md` | `/location-plantes-evenementiel/` | location plantes événementiel |
| `09-fleurs-sapins-noel.md` | `/fleurs-sapins-noel/` | location sapin de noël entreprise |
| `10-agence-paris.md` | `/location-entretien-plantes-bureau-paris/` | location plantes bureau paris |
| `11-agence-nice.md` | `/entretien-location-plantes-nice/` | location plantes nice |
| `12-agence-marseille.md` | `/entretien-location-plantes-marseille/` | location plantes marseille |
| `13-multisites.md` | `/vegetalisation-bureaux-multisites-paris-paca/` | prestataire plantes bureaux multi-sites |
| `14-faq.md` | `/faq/` | (questions des acheteurs, GEO) |
| `15-devis.md` | `/devis/` | (navigationnelle) |
| `16-qui-sommes-nous.md` | `/qui-sommes-nous/` | (page d'entité : marque, histoire, équipe) |
| `18-espaces-verts.md` | `/espaces-verts-entreprise/` | entretien espaces verts entreprise (PACA uniquement) |
| `18a-espaces-verts-copropriete.md` | `/entretien-espaces-verts-copropriete/` | entretien espaces verts copropriété (PACA uniquement) |
| `18b-creation-espaces-verts.md` | `/creation-amenagement-espaces-verts/` | création espaces verts (PACA uniquement) |
| `18c-elagage.md` | `/elagage-entreprise-marseille-aix/` | élagage marseille, élagage aix en provence (PACA uniquement) |
| `18d-terrasses-vegetalisees.md` | `/terrasses-vegetalisees-entreprise/` | terrasse végétalisée (PACA uniquement) |
| `19-ruches.md` | `/ruches-entreprise/` | parrainer une ruche (PACA uniquement) |
| `90-mentions-legales.md` | `/mentions-legales/` | — |
| `91-confidentialite.md` | `/politique-de-confidentialite/` | — |
| `92-cookies.md` | `/cookies/` | — |
| `93-404.md` | page 404 | — |

## Données à fournir par le client (récapitulatif global)

- Adresse, téléphone et horaires de la base de Gémenos (seule adresse réelle) + numéro à afficher pour l'Île-de-France
- Fréquence standard des passages d'entretien et délai type d'installation
- 6 à 10 cas clients avec accord écrit (nom, lieu, prestation, photo)
- Logos clients utilisables + autorisations
- Services exacts : contenu des formules, zones précises desservies par région
- Forme juridique, capital, adresse du siège, directeur de la publication (mentions légales)
- Photos de réalisations (par service et par région)
