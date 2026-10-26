import { cardItem, imageWithAlt, leadItem, richText, seo, structuredData } from './shared';
import { sections } from './sections';
import { caseStudy, page, person, post, siteSettings } from './documents';

export const schemaTypes = [
  richText,
  imageWithAlt,
  leadItem,
  cardItem,
  seo,
  structuredData,
  ...sections,
  page,
  post,
  person,
  caseStudy,
  siteSettings,
];
