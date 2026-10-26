import { defineArrayMember, defineField, defineType } from 'sanity';
import { editorialText, safeString } from './shared';
import { SECTION_TYPES } from './sections';

const slugRule = (r: import('sanity').SlugRule) =>
  r.required().custom((v) =>
    !v?.current || /^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/.test(v.current) ? true : 'Slug ASCII, minuscules, commençant et finissant par « / ».',
  );

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Réglages' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Nom court (menus, fil d’Ariane)', group: 'settings', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'settings',
      description: 'Final et validé : ne jamais modifier un slug publié sans redirection.',
      validation: slugRule,
    }),
    defineField({
      name: 'template',
      type: 'string',
      group: 'settings',
      options: { list: ['home', 'hub', 'service', 'city', 'about', 'faq', 'quote', 'blog', 'legal', 'notFound'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'parent', type: 'reference', to: [{ type: 'page' }], group: 'settings', title: 'Page parente (fil d’Ariane)' }),
    defineField({
      name: 'zone',
      type: 'string',
      group: 'settings',
      title: 'Agence pré-remplie dans le devis',
      options: { list: [{ title: '—', value: '' }, 'paris', 'nice', 'marseille'] },
    }),
    defineField({ name: 'outdoor', type: 'boolean', group: 'settings', title: 'Page extérieur PACA (bandeau de zone)' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({ name: 'structuredData', type: 'structuredData', group: 'seo' }),
    defineField({ name: 'h1', type: 'string', title: 'H1', group: 'content', validation: (r) => r.required().custom(editorialText) }),
    defineField({
      name: 'answer',
      type: 'richText',
      title: 'Réponse directe / introduction',
      description: '130 à 170 mots, texte simple en tête de page : c’est le passage cité par les IA.',
      group: 'content',
    }),
    defineField({ name: 'microProof', type: 'richText', title: 'Micro-preuve (accueil)', group: 'content', hidden: ({ document }) => document?.template !== 'home' }),
    defineField({ name: 'heroImage', type: 'imageWithAlt', title: 'Photo du hero', group: 'content' }),
    defineField({ name: 'answerImage', type: 'imageWithAlt', title: 'Photo à côté de la réponse directe', group: 'content' }),
    defineField({
      name: 'sections',
      type: 'array',
      group: 'content',
      of: SECTION_TYPES.map((type) => defineArrayMember({ type })),
    }),
    defineField({
      name: 'related',
      type: 'object',
      title: 'Voir aussi',
      group: 'content',
      fields: [
        { name: 'hub', type: 'reference', to: [{ type: 'page' }] },
        { name: 'items', type: 'array', of: [{ type: 'cardItem' }] },
      ],
    }),
    defineField({ name: 'finalCta', type: 'string', title: 'Phrase du bandeau final', group: 'content', validation: safeString }),
  ],
  preview: { select: { title: 'name', subtitle: 'slug.current', media: 'heroImage' } },
  orderings: [{ title: 'Slug', name: 'slug', by: [{ field: 'slug.current', direction: 'asc' }] }],
});

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(60).custom(editorialText) }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Sans « / » : l’article est publié sous /blog/<slug>/.',
      validation: (r) => r.required().custom((v) => (!v?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.current) ? true : 'Slug ASCII en minuscules.')),
    }),
    defineField({
      name: 'pubDate',
      type: 'datetime',
      title: 'Date de publication',
      description: 'Un article daté dans le futur n’existe nulle part (page, liste, sitemap) avant cette date. Publication auto le lundi et le jeudi.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', type: 'seo' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: safeString }),
    defineField({ name: 'answer', type: 'richText', title: 'Réponse directe (130 à 170 mots)' }),
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'faq',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'faqItem', fields: [{ name: 'question', type: 'string' }, { name: 'answer', type: 'richText' }] })],
    }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'person' }], description: 'Vide : « L’équipe Flora Concept ».' }),
    defineField({ name: 'image', type: 'imageWithAlt' }),
  ],
  preview: {
    select: { title: 'title', date: 'pubDate', media: 'image' },
    prepare: ({ title, date, media }) => ({ title, media, subtitle: date ? new Date(date).toLocaleDateString('fr-FR') : 'Sans date' }),
  },
});

export const person = defineType({
  name: 'person',
  title: 'Membre de l’équipe',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Prénom', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', title: 'Fonction' }),
    defineField({ name: 'bio', type: 'text', rows: 2, title: 'Une ligne' }),
    defineField({ name: 'photo', type: 'imageWithAlt', title: 'Portrait (carré, avec accord)' }),
    defineField({ name: 'sameAs', type: 'array', of: [{ type: 'url' }], title: 'Profils (LinkedIn…)' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Réalisation',
  type: 'document',
  fields: [
    defineField({ name: 'client', type: 'string', description: 'Uniquement avec accord écrit du client.', validation: (r) => r.required() }),
    defineField({ name: 'city', type: 'string' }),
    defineField({ name: 'service', type: 'string' }),
    defineField({ name: 'since', type: 'string', title: 'Durée (« depuis 2020 »)' }),
    defineField({ name: 'image', type: 'imageWithAlt' }),
    defineField({ name: 'href', type: 'string', title: 'Lien vers le cas' }),
  ],
  preview: { select: { title: 'client', subtitle: 'city', media: 'image' } },
});

const link = defineArrayMember({
  type: 'object',
  name: 'navLink',
  fields: [
    { name: 'label', type: 'string' },
    { name: 'href', type: 'string' },
    { name: 'sub', type: 'string' },
    { name: 'image', type: 'imageWithAlt' },
    { name: 'badge', type: 'string' },
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'nav', title: 'Navigation' },
    { name: 'tech', title: 'Technique' },
  ],
  fields: [
    defineField({ name: 'siteUrl', type: 'url', group: 'tech', validation: (r) => r.required() }),
    defineField({ name: 'siteName', type: 'string', group: 'identity' }),
    defineField({
      name: 'entitySentence',
      type: 'text',
      group: 'identity',
      title: 'Phrase d’entité',
      description: 'Identique partout : site, fiche Google, LinkedIn.',
    }),
    defineField({
      name: 'legal',
      type: 'object',
      group: 'identity',
      fields: [{ name: 'legalName', type: 'string' }, { name: 'siren', type: 'string' }, { name: 'foundingDate', type: 'string' }],
    }),
    defineField({
      name: 'address',
      type: 'object',
      group: 'identity',
      title: 'Adresse (base de Gémenos, seule adresse réelle)',
      fields: ['streetAddress', 'postalCode', 'locality', 'region', 'country'].map((n) => ({ name: n, type: 'string' })),
    }),
    defineField({
      name: 'phones',
      type: 'object',
      group: 'identity',
      fields: ['default', 'paca', 'idf'].map((n) => ({
        name: n,
        type: 'object',
        fields: [
          { name: 'display', type: 'string', title: 'Affichage' },
          { name: 'e164', type: 'string', title: 'Format international (+33…)', validation: (r: import('sanity').Rule) => r.regex(/^\+\d{8,15}$/) },
        ],
      })),
    }),
    defineField({ name: 'areas', type: 'array', of: [{ type: 'string' }], group: 'identity' }),
    defineField({ name: 'sameAs', type: 'array', of: [{ type: 'url' }], group: 'identity' }),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'identity',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'url' }] }],
    }),
    defineField({ name: 'logo', type: 'imageWithAlt', group: 'identity' }),
    defineField({
      name: 'nav',
      type: 'object',
      group: 'nav',
      fields: [
        {
          name: 'groups',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'navGroup',
              fields: [
                { name: 'key', type: 'string', options: { list: ['services', 'outdoor', 'villes'] } },
                { name: 'label', type: 'string' },
                { name: 'caption', type: 'string' },
                { name: 'hub', type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] },
                { name: 'items', type: 'array', of: [link] },
              ],
            },
          ],
        },
        { name: 'links', type: 'array', of: [link] },
      ],
    }),
    defineField({
      name: 'footer',
      type: 'object',
      group: 'nav',
      fields: [
        { name: 'columns', type: 'array', of: [{ type: 'object', name: 'footerColumn', fields: [{ name: 'title', type: 'string' }, { name: 'links', type: 'array', of: [link] }] }] },
        { name: 'legal', type: 'array', of: [link] },
        { name: 'regionsLine', type: 'string' },
      ],
    }),
    defineField({
      name: 'seasonal',
      type: 'object',
      group: 'nav',
      title: 'Bandeau saisonnier (accueil)',
      fields: [
        { name: 'enabled', type: 'boolean' },
        { name: 'text', type: 'string' },
        { name: 'href', type: 'string' },
        { name: 'fromMonth', type: 'number', validation: (r: import('sanity').Rule) => r.min(1).max(12) },
        { name: 'toMonth', type: 'number', validation: (r: import('sanity').Rule) => r.min(1).max(12) },
      ],
    }),
    defineField({ name: 'marquee', type: 'array', of: [{ type: 'string' }], group: 'nav', title: 'Bandeau défilant' }),
    defineField({
      name: 'analytics',
      type: 'object',
      group: 'tech',
      fields: [{ name: 'gtmId', type: 'string', title: 'Google Tag Manager ID', validation: (r: import('sanity').Rule) => r.regex(/^(GTM-[A-Z0-9]+)?$/) }],
    }),
    defineField({ name: 'quoteEndpoint', type: 'string', group: 'tech', initialValue: '/api/devis.php' }),
  ],
  preview: { prepare: () => ({ title: 'Réglages du site' }) },
});
