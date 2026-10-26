import { defineArrayMember, defineField, defineType } from 'sanity';

/** Editorial bans from the brief, applied to every free-text field. */
const BANNED: [RegExp, string][] = [
  [/v[ée]g[ée]tal\s*office/i, 'Aucune mention de « Végétal Office ».'],
  [/\d\s*(€|euros?\b|EUR\b)|€\s*\d/i, 'Aucun prix sur le site (décision client).'],
  [/—/, 'Jamais de tiret cadratin comme connecteur.'],
  [/\{\{\s*A_FOURNIR/i, 'Utiliser le bloc « Donnée à fournir » plutôt que le texte {{A_FOURNIR}}.'],
];

export function editorialText(value: unknown): true | string {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  for (const [re, msg] of BANNED) if (re.test(text)) return msg;
  return true;
}

/** Editorial check for any string-like field (string, text). */
export const safeString = <R extends { custom: (fn: (value: unknown) => true | string) => R }>(rule: R): R => rule.custom(editorialText);

export const richText = defineType({
  name: 'richText',
  title: 'Texte',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraphe', value: 'normal' },
        { title: 'Intertitre (H3)', value: 'h3' },
      ],
      lists: [
        { title: 'Puces', value: 'bullet' },
        { title: 'Numérotée', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Lien',
            fields: [
              defineField({
                name: 'href',
                type: 'string',
                title: 'URL',
                description: 'Lien interne (/slug/), tel:, mailto: ou https://',
                validation: (r) =>
                  r.required().custom((v) =>
                    !v || /^(\/[a-z0-9\-/]*(#[\w-]+)?|tel:\+?\d+|mailto:\S+|https:\/\/\S+)$/.test(v)
                      ? true
                      : 'Format de lien non valide (les slugs se terminent par « / »).',
                  ),
              }),
            ],
          },
          {
            name: 'action',
            type: 'object',
            title: 'Action',
            fields: [
              defineField({
                name: 'action',
                type: 'string',
                options: { list: [{ title: 'Rouvrir le bandeau cookies', value: 'manageCookies' }] },
                validation: (r) => r.required(),
              }),
            ],
          },
        ],
      },
      of: [
        {
          name: 'pending',
          type: 'object',
          title: 'Donnée à fournir',
          description: 'Donnée client manquante : jamais affichée en production, bloque la publication stricte.',
          fields: [defineField({ name: 'note', type: 'string', title: 'Ce qui manque' })],
          preview: { select: { title: 'note' }, prepare: ({ title }) => ({ title: `À FOURNIR : ${title}` }) },
        },
        {
          name: 'variable',
          type: 'object',
          title: 'Variable',
          fields: [defineField({ name: 'name', type: 'string', options: { list: ['zone'] } })],
        },
      ],
    }),
  ],
  validation: (r) => r.custom(editorialText),
});

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Texte alternatif',
      description: 'Vide si l’image est décorative (le titre voisin la décrit déjà).',
    }),
  ],
});

export const leadItem = defineType({
  name: 'leadItem',
  title: 'Élément',
  type: 'object',
  fields: [
    defineField({ name: 'lead', type: 'string', title: 'Accroche (en gras)', validation: safeString }),
    defineField({ name: 'href', type: 'string', title: 'Lien de l’accroche' }),
    defineField({ name: 'text', type: 'richText', title: 'Texte' }),
  ],
  preview: { select: { title: 'lead', text: 'text' }, prepare: ({ title, text }) => ({ title: title ?? text?.[0]?.children?.[0]?.text }) },
});

export const cardItem = defineType({
  name: 'cardItem',
  title: 'Carte',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().custom(editorialText) }),
    defineField({ name: 'text', type: 'richText' }),
    defineField({ name: 'href', type: 'string', title: 'Lien' }),
    defineField({ name: 'tag', type: 'string', title: 'Étiquette' }),
    defineField({ name: 'badge', type: 'string', title: 'Badge', options: { list: ['PACA'] } }),
    defineField({ name: 'cities', type: 'array', of: [{ type: 'string' }], title: 'Villes (cartes régions)' }),
    defineField({
      name: 'links',
      type: 'array',
      title: 'Liens supplémentaires',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }],
    }),
    defineField({ name: 'image', type: 'imageWithAlt' }),
  ],
  preview: { select: { title: 'title', media: 'image' } },
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => [
        r.required().custom(editorialText),
        r.min(50).max(60).warning('Title : 50 à 60 caractères.'),
      ],
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (r) => [r.custom(editorialText), r.min(150).max(160).warning('Meta description : 150 à 160 caractères.')],
    }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ],
});

export const structuredData = defineType({
  name: 'structuredData',
  title: 'Données structurées (JSON-LD)',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: { list: ['WebPage', 'Service', 'AboutPage', 'CollectionPage'] },
      initialValue: 'WebPage',
    }),
    defineField({ name: 'serviceType', type: 'string' }),
    defineField({ name: 'areaServed', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'localBusiness',
      type: 'boolean',
      description: 'Uniquement la base de Gémenos (accueil, Marseille). Jamais pour Paris ou Nice.',
      initialValue: false,
    }),
  ],
});
