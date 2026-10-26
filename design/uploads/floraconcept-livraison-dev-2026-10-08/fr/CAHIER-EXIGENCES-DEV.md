# Cahier des exigences pour l'équipe de développement

> Flora Concept — site .fr. Nous livrons la structure et les contenus ; l'équipe de développement réalise le site. Ce document liste ce qui est **non négociable** pour que le travail SEO/GEO produise ses effets. Tout écart est à discuter avant intégration.
> Livré avec : `STRUCTURE-SITE.md` (la carte), `contenu/` (un fichier par page, + `contenu/blog/`), `REDIRECTIONS.md`, le PDF de validation client.

## 1. Contenus : intégration fidèle

1. Chaque page suit **l'ordre exact des sections** de son fichier `contenu/NN-*.md`. Les textes sont intégrés tels quels (pas de réécriture, pas de coupe).
2. **`{{A_FOURNIR : …}}`** = donnée manquante côté client. Aucune page ne part en production avec un placeholder visible ; ne jamais inventer la valeur. La page Paris a un bloc marqué **bloquant** : sans lui, elle n'est pas publiée.
3. **Aucun prix** sur le site. Aucune mention de « Végétal Office ». Jamais de tiret cadratin comme connecteur. Français avec accents corrects partout (y compris URLs : slugs sans accents, tels que fournis).
4. La **phrase d'entité** (dans `contenu/README.md`) est reprise à l'identique partout où elle apparaît.

## 2. Metadata et balisage (par page, fournis dans chaque fichier)

1. `<title>` (50-60 caractères) et meta description (150-160) **uniques**, tels que fournis.
2. Un seul `<h1>` par page, hiérarchie H2/H3 respectée telle que fournie.
3. **JSON-LD** selon la section « JSON-LD » de chaque fichier : `Organization` (SIREN 423 977 305, `foundingDate` 1999, `areaServed` PACA + Île-de-France) ; **un seul `LocalBusiness`** (Gémenos) ; `Service` avec `areaServed` par page ; `AboutPage` + `Person` (équipe) sur Qui sommes-nous ; `Article` + `author` → `Person` sur le blog. Pas de `FAQPage`.
4. Canonical autoréférent sur chaque page ; sitemap XML ; `robots.txt` autorisant les crawlers IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
5. La **réponse directe** (130-170 mots) en ouverture de chaque page de service et article est un paragraphe de texte simple en haut de page, jamais dans un accordéon ni chargée en JavaScript.

## 3. Conversion (raison d'être du site)

1. Boutons « Demander un devis » + « Appeler » sur **100 % des pages** ; **barre fixe en bas sur mobile** avec ces deux actions.
2. Formulaire devis : 3 champs (nom, email ou téléphone, besoin) + champ zone pré-rempli selon la page d'origine ; honeypot invisible ; limitation de débit côté serveur ; messages d'erreur par champ (textes fournis dans `contenu/15-devis.md`) ; accusé de réception email.
3. Événements de mesure : `devis_submit` (avec source et zone) et `call_click` (avec zone) — prévus pour GA4/GTM avec Consent Mode v2 : **aucun script de mesure chargé avant consentement**.

## 4. Blog : publication automatique (mécanique exigée)

1. Chaque article a une date de publication future (`pubDate`). Le site **ne rend pas** un article à date future : ni page, ni listing, ni sitemap.
2. Une reconstruction/déploiement planifié **lundi et jeudi** publie les articles arrivés à échéance (2/semaine, calendrier dans `contenu/blog/PLAN-EDITORIAL.md`, démarrage à la mise en ligne).
3. Encadré auteur sur chaque article (signataire réel dès que la page Qui sommes-nous est alimentée ; sinon « L'équipe Flora Concept »), lié à `/qui-sommes-nous/` en JSON-LD.

## 5. Redirections (migration, à ne pas rater)

1. **Chaque URL** de `REDIRECTIONS.md` (floraconcept.com et vegetaloffice.fr) redirige en **301, un seul saut**, vers sa cible exacte. Jamais « tout vers l'accueil ».
2. Les 385 URLs de spam listées (site piraté) renvoient **410 Gone**.
3. Un test automatisé vérifie 100 % des lignes avant la mise en ligne (nous pouvons fournir le script).

## 6. Performance et qualité (seuils de recette)

1. Lighthouse mobile sur accueil + une page service + une page zone : **Performance ≥ 95, SEO = 100, Accessibilité ≥ 95**, LCP < 2,5 s sur téléphone.
2. JavaScript minimal : aucune page de contenu ne doit dépendre de JS pour afficher son texte (SSG/HTML servi). Images optimisées (formats modernes, lazy loading hors hero), polices auto-hébergées.
3. Zéro erreur console ; pas de défilement horizontal à 390 px ; contraste : le lime `#c4d401` n'est **jamais une couleur de texte sur fond clair** (bouton lime = texte `#212121`).
4. Recette : toutes les pages en 200, metas uniques vérifiées, JSON-LD valide (validateur Schema.org), redirections testées.

## 7. Points ouverts (ne pas décider seuls)

- Choix de stack : une base **Astro statique** était prévue (ADR 0001) ; si l'équipe retient autre chose, les exigences §4 (publication planifiée) et §6 (SSG, budgets) restent dues.
- Hébergement prévu : Hostinger mutualisé (PHP disponible pour l'endpoint devis). À confirmer avec l'équipe.
- Toute question sur un contenu, un slug ou une donnée manquante : nous revenir, ne pas improviser.
