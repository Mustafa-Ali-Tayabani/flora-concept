import type { StructureResolver } from 'sanity/structure';

export const SINGLETONS = new Set(['siteSettings']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Réglages du site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
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
