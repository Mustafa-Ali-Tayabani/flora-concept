import { defineArrayMember, defineField, defineType } from 'sanity';
import { safeString } from './shared';

const title = defineField({ name: 'title', type: 'string', title: 'Titre (H2)', validation: safeString });
const tone = defineField({
  name: 'tone',
  type: 'string',
  title: 'Fond',
  options: { list: [{ title: 'Automatique (alterné)', value: 'auto' }, { title: 'Crème', value: 'surface' }, { title: 'Sombre', value: 'dark' }] },
  initialValue: 'auto',
});
const anchor = defineField({ name: 'anchor', type: 'string', title: 'Ancre', description: 'Identifiant pour les liens « sur cette page ».' });
const image = defineField({ name: 'image', type: 'imageWithAlt', title: 'Photo' });
const intro = defineField({ name: 'intro', type: 'richText', title: 'Introduction' });
const note = defineField({ name: 'note', type: 'richText', title: 'Note sous la liste' });
const items = defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'leadItem' })] });
const tableRows = defineField({
  name: 'rows',
  type: 'array',
  title: 'Lignes',
  of: [defineArrayMember({ type: 'object', name: 'row', fields: [{ name: 'cells', type: 'array', of: [{ type: 'richText' }] }] })],
});

const preview = (label: string) => ({ select: { title: 'title' }, prepare: ({ title: t }: { title?: string }) => ({ title: t ?? label, subtitle: label }) });

const section = (name: string, label: string, fields: ReturnType<typeof defineField>[], withTitle = true) =>
  defineType({ name, title: label, type: 'object', fields: [...(withTitle ? [title] : []), ...fields, tone, anchor], preview: preview(label) });

/**
 * Data-dependent sections (S11, S13, S17, S18, S19) are removed from the page as a
 * whole while they are empty: the hidden state described in the design guide.
 */
export const sections = [
  section('sectionProfiles', 'S3 · Entrées par profil', [defineField({ name: 'items', type: 'array', of: [{ type: 'cardItem' }] })], false),
  section('sectionCards', 'S4 · Cartes de services', [intro, defineField({ name: 'cards', type: 'array', of: [{ type: 'cardItem' }] }), defineField({ name: 'outro', type: 'richText' })]),
  section('sectionChecklist', 'S5 · Liste (ce que comprend…)', [intro, items, note, image]),
  section('sectionArguments', 'S10 · Arguments', [intro, items, note, image]),
  section('sectionFeature', 'S10 · Engagement (paragraphe + photo)', [
    defineField({ name: 'quote', type: 'string', title: 'Accroche' }),
    defineField({ name: 'pills', type: 'array', of: [{ type: 'string' }], title: 'Pastilles' }),
    defineField({ name: 'body', type: 'richText' }),
    image,
  ]),
  section('sectionGroups', 'S8/S9 · Sous-blocs (H3)', [
    intro,
    defineField({
      name: 'groups',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'group', fields: [{ name: 'title', type: 'string', title: 'Titre (H3)' }, { name: 'body', type: 'richText' }] })],
    }),
    image,
  ]),
  section('sectionTable', 'S6 · Tableau comparatif', [
    intro,
    defineField({ name: 'head', type: 'array', of: [{ type: 'string' }], title: 'En-têtes' }),
    tableRows,
    note,
    defineField({ name: 'photos', type: 'array', of: [{ type: 'imageWithAlt' }] }),
  ]),
  section('sectionSteps', 'S7 · Étapes', [
    intro,
    defineField({ name: 'steps', type: 'array', of: [{ type: 'leadItem' }] }),
    defineField({ name: 'layout', type: 'string', options: { list: ['horizontal', 'vertical'] }, initialValue: 'horizontal' }),
    image,
  ]),
  section('sectionText', 'S21 · Texte', [
    defineField({ name: 'body', type: 'richText' }),
    defineField({
      name: 'variant',
      type: 'string',
      options: { list: [{ title: 'Texte + photo', value: 'split' }, { title: 'Bloc mis en avant', value: 'highlight' }, { title: 'Photo pleine largeur', value: 'wide' }] },
      initialValue: 'split',
    }),
    image,
  ]),
  section('sectionRegions', 'S14 · Cartes régions', [defineField({ name: 'regions', type: 'array', of: [{ type: 'cardItem' }] })]),
  section('sectionFaq', 'S12 · FAQ', [
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            { name: 'question', type: 'string', validation: (r) => r.required() },
            { name: 'answer', type: 'richText' },
          ],
          preview: { select: { title: 'question' } },
        }),
      ],
    }),
  ]),
  section('sectionCaseStudies', 'S11 · Réalisations', [defineField({ name: 'cases', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] })]),
  section('sectionLogos', 'S13 · Logos clients', [defineField({ name: 'logos', type: 'array', of: [{ type: 'imageWithAlt' }] })]),
  section('sectionTeam', 'S17 · Équipe', [defineField({ name: 'members', type: 'array', of: [{ type: 'reference', to: [{ type: 'person' }] }] })]),
  section('sectionFigures', 'S18 · Chiffres clés (vérifiés uniquement)', [
    defineField({
      name: 'figures',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'figure', fields: [{ name: 'value', type: 'string' }, { name: 'label', type: 'string' }] })],
    }),
  ]),
  section('sectionTimeline', 'S19 · Notre histoire', [
    defineField({
      name: 'milestones',
      type: 'array',
      of: [defineArrayMember({ type: 'object', name: 'milestone', fields: [{ name: 'year', type: 'string' }, { name: 'text', type: 'text' }] })],
    }),
  ]),
  section('sectionLegal', 'S22 · Texte légal', [
    defineField({
      name: 'parts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'legalPart',
          fields: [
            { name: 'heading', type: 'string', title: 'Intertitre (H3)' },
            { name: 'body', type: 'richText' },
            { name: 'table', type: 'object', fields: [{ name: 'head', type: 'array', of: [{ type: 'string' }] }, tableRows] },
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({ name: 'showConsentButton', type: 'boolean', title: 'Bouton « Gérer mes cookies »' }),
  ], false),
  section('sectionQuoteForm', 'S15/S16 · Formulaire de devis', [
    defineField({ name: 'placeholder', type: 'string', title: 'Placeholder « Votre besoin »' }),
    defineField({ name: 'reassurance', type: 'richText', title: 'Ligne de rassurance' }),
    defineField({ name: 'privacy', type: 'richText', title: 'Mention RGPD' }),
    defineField({ name: 'confirmation', type: 'object', fields: [{ name: 'title', type: 'string' }, { name: 'body', type: 'richText' }] }),
    defineField({
      name: 'errors',
      type: 'object',
      title: 'Messages d’erreur',
      fields: ['nom', 'contact', 'besoin', 'server', 'rateLimit'].map((n) => defineField({ name: n, type: 'string' })),
    }),
    defineField({ name: 'phoneTitle', type: 'string', title: 'Titre bloc téléphone' }),
    defineField({ name: 'phoneImage', type: 'imageWithAlt', title: 'Photo bloc téléphone' }),
    defineField({
      name: 'phones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phoneLine',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'detail', type: 'richText' },
            { name: 'zone', type: 'string', options: { list: ['marseille', 'nice', 'paris'] } },
          ],
        }),
      ],
    }),
  ], false),
];

export const SECTION_TYPES = sections.map((s) => s.name);
