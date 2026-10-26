import type { StructureResolver } from 'sanity/structure';

export const SINGLETONS = new Set(['siteSettings']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Réglages du site (FR)')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Site settings (EN)')
        .id('siteSettingsEn')
        .child(S.document().schemaType('siteSettings').documentId('siteSettingsEn')),
      S.divider(),
      S.listItem()
        .title('Pages (FR)')
        .schemaType('page')
        .child(S.documentList().title('Pages (FR)').filter('_type == "page" && (language == "fr" || !defined(language))')),
      S.listItem()
        .title('Pages (EN)')
        .schemaType('page')
        .child(S.documentList().title('Pages (EN)').filter('_type == "page" && language == "en"')),
      S.listItem()
        .title('Articles du blog')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Articles (par date de publication)')
            .defaultOrdering([{ field: 'pubDate', direction: 'desc' }]),
        ),
      S.documentTypeListItem('person').title('Équipe'),
      S.documentTypeListItem('caseStudy').title('Réalisations'),
    ]);
