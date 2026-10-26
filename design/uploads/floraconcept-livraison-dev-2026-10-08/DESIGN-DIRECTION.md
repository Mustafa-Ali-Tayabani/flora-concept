# Design Direction : Flora Concept

> Source de vérité design. Consulter AVANT chaque composant ou page. Mode **AUDIT** : on garde l'identité Flora Concept et on la modernise, on ne la remplace pas.

## Identité
- **Personnalité** : professionnelle, fiable, végétale sans cliché, orientée B2B
- **Audience** : office managers, directeurs d'hôtels et de résidences, syndics et property managers, facility managers multi-sites
- **Source** : floraconcept.com relevé le 01.10.2026 (logo `wp-content/uploads/2024/07/cropped-flora-logo-.png`, vert lime + noir, Poppins / Montserrat)
- **Mode** : clair uniquement (site vitrine B2B)

## Paramètres
```
DESIGN_VARIANCE:  4   mises en page sobres, une rupture par page (photo pleine largeur ou bloc chiffré)
MOTION_INTENSITY: 3   transitions d'état 150-200 ms, pas d'animation au scroll
VISUAL_DENSITY:   4   aéré mais informatif : tableaux de prix, zones, fréquences
```

## Palette (OKLCH, convertie depuis la charte)
| Token | Valeur | Hex d'origine | Usage |
|---|---|---|---|
| `--color-lime` | `oklch(82.9% 0.188 115.1)` | `#c4d401` | fond du bouton principal, accents, soulignements, puces. **Jamais du texte sur fond clair** (1,65:1) |
| `--color-lime-hover` | `oklch(76% 0.18 115.1)` | à valider | survol du bouton principal |
| `--color-ink` | `oklch(24.8% 0 90)` | `#212121` | texte principal, fonds sombres, texte sur lime (9,8:1) |
| `--color-ink-muted` | `oklch(47% 0 90)` | `#5b5b5b` | texte secondaire (≥ 6:1 sur `surface`) |
| `--color-surface` | `oklch(96.7% 0 90)` | `#f4f4f4` | fonds de sections alternées (ink dessus : 14,6:1) |
| `--color-white` | `oklch(100% 0 0)` | `#ffffff` | fond principal, texte sur `ink` |
| `--color-line` | `oklch(89% 0 90)` | à valider | bordures, séparateurs |
| `--color-error` / `--color-success` | à fixer en Phase 2 | | messages de formulaire, contraste ≥ 4,5:1 |

Règle 60/30/10 : blanc et `surface` environ 60 %, `ink` environ 30 %, lime environ 10 %. Le vert des photos fait le reste.

## Typographie
- Actuel : Poppins (titres), Montserrat (texte). **Décision à prendre en Phase 1 sur maquette** : Poppins seule, ou Poppins + une police de texte plus lisible. Noter la décision ici.
- Auto-hébergées (`public/fonts/`, woff2, sous-ensemble latin), `font-display: swap`, une seule police préchargée.
- Échelle : 4 tailles et 2 graisses max par vue, corps ≥ 16 px, interligne 1,5 à 1,6, largeur de lecture ≤ 70 caractères, `tabular-nums` sur les prix.

## Références
- **Inspirations** : sites B2B de services qui montrent des preuves (photos de chantiers réels, chiffres, zones couvertes), tableaux de prix lisibles.
- **Anti-références** : sites « écolo » saturés de vert, banques d'images de bureaux génériques, landing pages à fausse urgence.

## Règles actives
- Hero : photo réelle d'un bureau ou hall végétalisé par Flora, en `<img>` préchargée (`fetchpriority="high"`), jamais en image de fond CSS.
- Bouton principal : fond lime, texte `ink`, hauteur ≥ 48 px, un seul par vue. Bouton secondaire : contour `ink`.
- Barre fixe en bas sur téléphone : « Demander un devis » + « Appeler ».
- Champs : label au-dessus, erreur sous le champ, focus visible (anneau `ink` 2 px).
- Cibles tactiles ≥ 44 px, contraste texte ≥ 4,5:1, focus visible partout.
- Composants attendus : voir `vitrine-design-flora/project-notes.md`.

## Anti-patterns spécifiques
- Plante en pot générique en hero, feuilles en filigrane partout, vert « écolo » saturé sur toute l'interface.
- Lime utilisé comme couleur de texte, de lien ou d'icône sur fond clair.
- Gradient violet-bleu, glassmorphisme, grilles de 3 cartes identiques à icônes partout, emojis décoratifs.
- Chiffres non sourcés (« +1 800 clients » tant que le client ne l'a pas confirmé).
- Toute mention de Végétal Office.
- La landing page n'utilise **ni** le logo **ni** la palette Flora : identité neutre propre, définie en Phase 4.
