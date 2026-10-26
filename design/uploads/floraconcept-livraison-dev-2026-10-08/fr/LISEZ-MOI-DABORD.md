# LISEZ-MOI D'ABORD — avant toute ligne de code

> Livraison du 08/10/2026 (remplace celle du 01/10/2026) : structure validée par le client le 06/10/2026, contenus complets des 27 pages, arborescence pour le dev, guide des sections pour le designer.
> Ce site est construit pour une chose : être trouvé sur Google et cité par les IA (ChatGPT, Perplexity…), puis convertir en demandes de devis. **Chaque détail de cette archive sert cet objectif.** Une intégration « à peu près » détruit des semaines de travail de recherche invisible dans le rendu.

## ⏰ Échéance ferme

**La page Sapins et Noël (`/fleurs-sapins-noel/`) doit être en ligne avant la mi-octobre.** Le pic de demande est en novembre-décembre et les devis se prennent dès octobre. Si besoin, mettez cette page et l'accueil en ligne avant le reste.

## 📖 Ordre de lecture

1. **Ce fichier** (5 minutes)
2. `CAHIER-EXIGENCES-DEV.md` : le contrat technique, **chaque point sera testé à la recette**
3. `ARBORESCENCE-DEV.md` (PDF inclus) : les 27 URL, gabarits, fichier de contenu par page, navigation, maillage
4. `DESIGN-GUIDE-SECTIONS.md` + `DESIGN-PAGE-SHEETS.md` (anglais, un PDF) : chaque section, page par page
5. `contenu/README.md` puis les fichiers de pages : les textes à intégrer **tels quels**
6. `REDIRECTIONS.md` : la migration des anciens domaines
7. `STRUCTURE-SITE.md` : la carte des mots-clés, pour référence
8. `DESIGN-DIRECTION.md` : la charte graphique

Nouveautés depuis le 01/10 : 6 pages extérieur PACA (`18`, `18a` à `18d`, `19`), menu « Extérieur PACA », `16-qui-sommes-nous.md` mis à jour, redirection `/espaces-verts/` vers le hub extérieur. Les 35 articles de blog ne sont pas dans ce lot (index `/blog/` et mécanique de publication seulement).

## ⛔ Les 10 erreurs qui annulent tout le travail (vues sur d'autres projets)

1. **Réécrire ou raccourcir les textes.** Les titres, metas et paragraphes sont calibrés (longueurs, mots-clés, format citable par les IA). Intégrez-les au caractère près.
2. **Charger le texte en JavaScript.** Tout le contenu doit être dans le HTML servi. Si le texte n'apparaît qu'après exécution de JS, les IA et une partie de Google ne le voient pas.
3. **Mettre la « réponse directe » dans un accordéon ou un slider.** Ce premier paragraphe de chaque page est ce que citent les IA : texte simple, visible, en haut.
4. **Publier une page avec un `{{A_FOURNIR}}`.** C'est une donnée client manquante : la page attend, on n'invente jamais. La page Paris a un bloc marqué BLOQUANT.
5. **Rediriger les anciennes URLs « toutes vers l'accueil ».** Chaque ligne de `REDIRECTIONS.md` a sa cible exacte en 301, un seul saut ; le spam du piratage part en 410. Un script de test vérifiera 100 % des lignes.
6. **Afficher un prix, quelque part.** Décision client : aucun prix sur le site. Les CTA renvoient au devis.
7. **Ajouter un `LocalBusiness` pour Paris ou Nice.** Une seule adresse réelle existe (Gémenos). Le balisage est spécifié page par page ; inventer des agences expose le client à une suspension Google.
8. **Oublier la mécanique du blog.** Les articles ont des dates futures : un article à date future n'existe nulle part (ni listing, ni sitemap), et un déploiement planifié lundi/jeudi publie automatiquement. Sans ça, 35 articles partent en ligne d'un coup = risque de pénalité Google.
9. **Charger GA4/GTM/Clarity avant le consentement.** Consent Mode v2 strict : zéro requête de mesure avant accord.
10. **Utiliser le lime `#c4d401` comme couleur de texte sur fond clair.** Contraste 1,65:1, illisible. Lime = fonds de boutons avec texte `#212121`.

## ✅ Ce qui sera vérifié à la recette (avec outils, pas à l'œil)

- Toutes les pages en 200, title/description uniques conformes aux fichiers
- JSON-LD valide (validateur Schema.org) conforme aux specs par page
- 100 % des redirections de `REDIRECTIONS.md` testées automatiquement
- Lighthouse mobile : Performance ≥ 95, SEO = 100, Accessibilité ≥ 95, LCP < 2,5 s
- Zéro erreur console, zéro défilement horizontal à 390 px
- Boutons Devis + Appeler présents sur 100 % des pages, barre fixe mobile
- Formulaire : validation par champ, honeypot, limite de débit, événements `devis_submit`/`call_click`
- Grep de contrôle : aucun prix, aucun `{{A_FOURNIR}}`, aucune mention « Végétal Office »

## 💬 Une question, un doute, un slug à adapter ?

Demandez-nous **avant** d'improviser. Une réponse prend une heure ; défaire une improvisation prend une semaine.
