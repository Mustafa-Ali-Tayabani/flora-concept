# Landing page SEA (site séparé, domaine neutre)

- **Hébergement** : domaine .fr **séparé et neutre** {{A_FOURNIR : nom et domaine choisis}}, design **neutre** (pas la charte Flora), **aucun lien vers le site principal**, aucune mention de Végétal Office.
- **Rôle** : recevoir le trafic Google Ads (géré par l'agence SEA du client) et le convertir en devis. Une seule page, pas de menu, un seul objectif.
- **Règle de coordination** : le titre et l'accroche doivent reprendre les mots-clés achetés. {{A_FOURNIR : liste des mots-clés achetés, à demander à l'agence SEA}} Toute modification ultérieure de titre, d'offre ou de formulaire se coordonne avec l'agence SEA (un test peut être en cours).
- **Mesure** : mêmes événements que le site (`devis_start`, `devis_submit`, `call_click`) avec la propriété `site=landing` ; Consent Mode v2, rien avant consentement.
- **Mentions légales au nom de FLORACONCEPT** (obligation Google Ads), en bas de page, lien discret.

## Metadata

- **Title** : Location et entretien de plantes pour bureaux | Devis gratuit (59 car.) {{A_FOURNIR : ajuster au mot-clé principal acheté}}
- **Meta robots** : `noindex, nofollow` (page publicitaire, ne doit pas concurrencer le site en organique)

## Structure (une page, dans l'ordre, pas de navigation)

### 1. Hero (au-dessus de la ligne de flottaison, y compris à 390 px)

- **H1** : Des plantes impeccables dans vos bureaux, sans vous en occuper
  - Variante A (si mot-clé acheté = location) : Location de plantes pour bureaux, entretien compris
  - Variante B (si mot-clé acheté = entretien) : L'entretien de vos plantes de bureau, pris en charge de A à Z
- **Sous-titre** : Installation, entretien régulier par des jardiniers professionnels et remplacement des plantes fatiguées, en Provence-Alpes-Côte d'Azur et en Île-de-France. Devis gratuit sous {{A_FOURNIR : délai}}.
- **CTA** : [Recevoir mon devis gratuit] (ancre vers le formulaire) + numéro cliquable `tel:`
- **Micro-preuve sous le CTA** : Spécialiste des entreprises depuis 1999 · plantes remplacées sans supplément {{A_FOURNIR : confirmer}}
- Visuel : photo réelle d'un bureau végétalisé {{A_FOURNIR}}

### 2. La promesse en 3 bénéfices (pas de jargon)

1. **Vous ne faites rien** : installation, arrosage, taille et remplacement sont pris en charge à chaque passage.
2. **Un budget mensuel clair** : la location couvre les plantes, les bacs et l'entretien, sans investissement de départ.
3. **Des locaux toujours impeccables** : une plante qui faiblit est remplacée, votre accueil reste parfait toute l'année.

### 3. Comment ça marche (3 étapes)

1. Vous décrivez vos espaces (1 minute).
2. Un paysagiste vous rappelle et se déplace si besoin : proposition détaillée et gratuite.
3. Nos jardiniers installent, puis entretiennent à chaque passage.

### 4. Preuve

- Logos clients {{A_FOURNIR : avec accords}} ou, à défaut, 2 photos avant/après de réalisations réelles {{A_FOURNIR}}
- 1 témoignage nominatif avec fonction et entreprise {{A_FOURNIR : accord écrit}} : sans témoignage réel, masquer le bloc.

### 5. Formulaire (ancre du CTA, une colonne, 3 champs)

- Titre du bloc : **Recevez votre devis gratuit**
- Champs : nom · email ou téléphone · votre besoin (mêmes libellés, erreurs et validations que `15-devis.md`)
- Champ caché : `site=landing` + mot-clé/campagne via UTM
- Bouton : **« Recevoir mon devis gratuit »**
- Sous le bouton : « Réponse d'un paysagiste de votre région {{A_FOURNIR : délai}} · Gratuit et sans engagement » + lien confidentialité
- Honeypot + limite de débit, accusé de réception email, page ou message de succès avec les 3 étapes suivantes.

### 6. FAQ courte (4 questions, objections principales)

**Combien ça coûte ?** Le budget dépend du nombre de plantes, des bacs et de la fréquence d'entretien : c'est l'objet du devis, gratuit et sans engagement. La location lisse tout en un loyer mensuel prévisible, sans investissement de départ.

**Et si une plante dépérit ?** Elle est remplacée par nos jardiniers dans le cadre du contrat. {{A_FOURNIR : conditions exactes}}

**Où intervenez-vous ?** En Provence-Alpes-Côte d'Azur (Marseille, Aix, Toulon, Nice, Avignon) et en Île-de-France (Paris, La Défense, Hauts-de-Seine).

**Sommes-nous engagés longtemps ?** {{A_FOURNIR : durée d'engagement et conditions de sortie}}

### 7. Pied de page minimal

Raison sociale FLORACONCEPT, SIREN 423 977 305, lien mentions légales et confidentialité. **Aucun autre lien.**

## Interdits spécifiques à cette page

- Pas de menu, pas de lien vers le site principal, pas de maillage.
- Pas de prix affiché, pas de compte à rebours, pas de popup.
- Indexation bloquée (`noindex`) : cette page vit par la publicité, pas par Google organique.
