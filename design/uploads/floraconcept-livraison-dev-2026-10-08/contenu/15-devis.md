# Page : Contact / Devis

- **Slug** : `/devis/`
- **Mot-clé principal** : (navigationnelle : devis plantes bureau)
- **Intention** : conversion. C'est la page cible de tous les CTA « Demander un devis ».

## Metadata

- **Title** : Devis gratuit : plantes et végétalisation d'entreprise (55 car.)
- **Meta description** : Demandez votre devis gratuit en une minute : location et entretien de plantes, murs végétaux, décoration végétale. Réponse d'un paysagiste de votre région.

## H1

Votre devis gratuit en une minute

## Intro (50 mots environ)

Décrivez votre besoin en trois champs : un paysagiste de l'équipe de votre région vous recontacte pour affiner, visite vos locaux si nécessaire et vous envoie une proposition détaillée. Gratuit et sans engagement. Vous préférez parler tout de suite ? Appelez directement votre agence.

## Formulaire (3 champs visibles, règle PRD US-02)

1. **Nom** (champ texte, requis)
2. **Email ou téléphone** (champ texte, requis, validation l'un ou l'autre)
3. **Votre besoin** (textarea, requis, placeholder : « Ex. : location et entretien de plantes pour nos bureaux de 400 m² à Marseille »)

- Champ caché : agence pré-remplie selon la page d'origine (paris / nice / marseille), modifiable via un sélecteur discret.
- Honeypot invisible + rate limiting côté serveur (voir ARCHITECTURE, endpoint `devis.php`).
- RGPD : case ou mention sous le bouton (voir ci-dessous).
- Bouton : **« Recevoir mon devis gratuit »**
- **Sous le bouton, une ligne de rassurance** : « Réponse d'un paysagiste de votre région {{A_FOURNIR : délai, ex. sous 1 jour ouvré}} · Gratuit et sans engagement »
- Événements : `devis_start` (au premier focus d'un champ) et `devis_submit` (envoi réussi), avec source et zone.

**Mention RGPD sous le formulaire** :
Les informations saisies servent uniquement à traiter votre demande de devis. Elles sont transmises à l'agence Flora Concept concernée et ne sont jamais cédées à des tiers. En savoir plus : [politique de confidentialité](/politique-de-confidentialite/).

## Message de confirmation (après envoi)

**Merci, votre demande est bien partie.**
Un paysagiste de votre région ({{zone}}) vous recontacte rapidement. {{A_FOURNIR : délai de réponse à annoncer, ex. « sous 1 jour ouvré », à confirmer avant publication}} Vous recevez aussi un accusé de réception par email si vous avez indiqué une adresse.

## Messages d'erreur (par champ)

- Nom vide : « Indiquez votre nom pour que nous sachions à qui répondre. »
- Contact vide ou invalide : « Indiquez un email ou un numéro de téléphone pour que nous puissions vous répondre. »
- Besoin vide : « Décrivez votre besoin en une phrase, cela suffit. »
- Erreur serveur : « L'envoi a échoué. Réessayez, ou appelez-nous directement. »
- Rate limit : « Vous avez déjà envoyé plusieurs demandes. Patientez quelques minutes ou appelez-nous. »

## Bloc : Appeler directement (H2)

{{A_FOURNIR : un numéro unique ou un numéro par région ? À confirmer avant intégration}}
- **Provence-Alpes-Côte d'Azur (base de Gémenos)** : {{A_FOURNIR : téléphone}} ({{A_FOURNIR : horaires}})
- **Île-de-France** : {{A_FOURNIR : téléphone, ou le même numéro}}

Chaque numéro en lien `tel:` avec événement `call_click` et la zone en paramètre.

## Bloc : Ce qui se passe ensuite (3 étapes, rassurance)

1. **Échange** : un paysagiste vous rappelle pour préciser vos espaces et vos envies.
2. **Visite si nécessaire** : pour les projets d'aménagement, nous nous déplaçons gratuitement.
3. **Proposition détaillée** : végétaux, contenants, fréquence d'entretien et budget, sans engagement.

## Maillage interne

Footer standard. Pas de menu de distraction supplémentaire : cette page doit convertir.

## Données à fournir

- Numéro(s) de téléphone et horaires (unique ou par région)
- Délai de réponse à annoncer dans la confirmation
- Adresse(s) email de réception des devis (configuration serveur, hors page)
