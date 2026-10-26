/**
 * Content contract shared by the Sanity schemas (studio/schemaTypes), the
 * content sync script (scripts/sync-content.mjs) and the Angular renderer.
 * Every page JSON file in public/content/pages/*.json conforms to `Page`.
 */

// ---------------------------------------------------------------------------
// Portable Text (subset used by the site)
// ---------------------------------------------------------------------------

export interface PtSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

/** Client data still missing (`{{A_FOURNIR : …}}`): never rendered in production. */
export interface PtPending {
  _type: 'pending';
  _key: string;
  note: string;
}

/** Runtime value substituted on the client (only `zone` on the quote confirmation). */
export interface PtVariable {
  _type: 'variable';
  _key: string;
  name: 'zone';
}

export type PtChild = PtSpan | PtPending | PtVariable;

export interface PtLinkDef {
  _type: 'link';
  _key: string;
  href: string;
}

/** Inline action (e.g. reopen the cookie banner). */
export interface PtActionDef {
  _type: 'action';
  _key: string;
  action: 'manageCookies';
}

export type PtMarkDef = PtLinkDef | PtActionDef;

export interface PtBlock {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h3';
  listItem?: 'bullet' | 'number';
  level?: number;
  markDefs: PtMarkDef[];
  children: PtChild[];
}

export type RichText = PtBlock[];

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface ImageRef {
  /** `/img/<name>` for local optimised images, or an absolute cdn.sanity.io URL. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional focal point, CSS object-position. */
  position?: string;
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

/** Lead + explanation item (« **Bold lead** : explanation »). */
export interface LeadItem {
  _key: string;
  lead?: string;
  /** Optional link on the lead. */
  href?: string;
  text: RichText;
}

export type SectionTone = 'auto' | 'surface' | 'dark';

interface SectionBase {
  _key: string;
  title?: string;
  /** Background hint; the renderer alternates `auto` sections. */
  tone?: SectionTone;
  /** Anchor id. */
  anchor?: string;
}

export interface CardItem {
  _key: string;
  title: string;
  text?: RichText;
  href?: string;
  /** Extra links (region cards). */
  links?: { _key: string; label: string; href: string }[];
  badge?: string;
  image?: ImageRef;
}

export interface ProfilesSection extends SectionBase {
  _type: 'sectionProfiles';
  items: (CardItem & { tag?: string })[];
}

export interface CardsSection extends SectionBase {
  _type: 'sectionCards';
  intro?: RichText;
  cards: CardItem[];
  outro?: RichText;
}

/** S5 checklist / S10 arguments: numbered bento cards. */
export interface BentoSection extends SectionBase {
  _type: 'sectionChecklist' | 'sectionArguments';
  intro?: RichText;
  items: LeadItem[];
  note?: RichText;
  image?: ImageRef;
}

/** S10 single-paragraph variant: photo with pills + text. */
export interface FeatureSection extends SectionBase {
  _type: 'sectionFeature';
  quote?: string;
  pills?: string[];
  body: RichText;
  image?: ImageRef;
}

/** S8 / S9: H3 sub-blocks. */
export interface GroupsSection extends SectionBase {
  _type: 'sectionGroups';
  intro?: RichText;
  groups: { _key: string; title: string; body: RichText }[];
  image?: ImageRef;
}

export interface TableSection extends SectionBase {
  _type: 'sectionTable';
  intro?: RichText;
  head: string[];
  rows: { _key: string; cells: RichText[] }[];
  note?: RichText;
  photos?: ImageRef[];
}

export interface StepsSection extends SectionBase {
  _type: 'sectionSteps';
  intro?: RichText;
  steps: LeadItem[];
  layout: 'horizontal' | 'vertical';
  image?: ImageRef;
}

/** S21 generic text. */
export interface TextSection extends SectionBase {
  _type: 'sectionText';
  body: RichText;
  variant: 'split' | 'highlight' | 'wide';
  image?: ImageRef;
}

export interface RegionsSection extends SectionBase {
  _type: 'sectionRegions';
  regions: (CardItem & { tag?: string; cities: string[] })[];
}

export interface FaqItem {
  _key: string;
  question: string;
  answer: RichText;
}

export interface FaqSection extends SectionBase {
  _type: 'sectionFaq';
  items: FaqItem[];
}

export interface CaseStudy {
  _key: string;
  client: string;
  city: string;
  service: string;
  since?: string;
  image?: ImageRef;
  href?: string;
}

export interface Person {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: ImageRef;
  sameAs?: string[];
}

/**
 * Data-dependent sections (S11, S13, S17, S18, S19): removed as a whole
 * while their data is missing.
 */
export interface CaseStudiesSection extends SectionBase {
  _type: 'sectionCaseStudies';
  cases: CaseStudy[];
}
export interface LogosSection extends SectionBase {
  _type: 'sectionLogos';
  logos: ImageRef[];
}
export interface TeamSection extends SectionBase {
  _type: 'sectionTeam';
  members: Person[];
}
export interface FiguresSection extends SectionBase {
  _type: 'sectionFigures';
  figures: { _key: string; value: string; label: string }[];
}
export interface TimelineSection extends SectionBase {
  _type: 'sectionTimeline';
  milestones: { _key: string; year: string; text: string }[];
}

export interface LegalSection extends SectionBase {
  _type: 'sectionLegal';
  parts: {
    _key: string;
    heading?: string;
    body: RichText;
    table?: { head: string[]; rows: { _key: string; cells: RichText[] }[] };
  }[];
  showConsentButton?: boolean;
}

export interface QuoteFormSection extends SectionBase {
  _type: 'sectionQuoteForm';
  placeholder: string;
  reassurance: RichText;
  privacy: RichText;
  confirmation: { title: string; body: RichText };
  errors: { nom: string; contact: string; besoin: string; server: string; rateLimit: string };
  phoneTitle: string;
  phoneImage?: ImageRef;
  phones: { _key: string; label: string; detail?: RichText; zone: Zone }[];
}

export type Section =
  | ProfilesSection
  | CardsSection
  | BentoSection
  | FeatureSection
  | GroupsSection
  | TableSection
  | StepsSection
  | TextSection
  | RegionsSection
  | FaqSection
  | CaseStudiesSection
  | LogosSection
  | TeamSection
  | FiguresSection
  | TimelineSection
  | LegalSection
  | QuoteFormSection;

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export type Template =
  | 'home'
  | 'hub'
  | 'service'
  | 'city'
  | 'about'
  | 'faq'
  | 'quote'
  | 'blog'
  | 'legal'
  | 'notFound';

export type Zone = 'paris' | 'nice' | 'marseille' | '';

export interface Seo {
  title: string;
  description: string;
  noindex?: boolean;
}

export interface StructuredData {
  /** Main entity type emitted for the page. */
  type: 'WebPage' | 'Service' | 'AboutPage' | 'CollectionPage';
  serviceType?: string;
  areaServed?: string[];
  /** Emit the single LocalBusiness (Gémenos). Only home and Marseille. */
  localBusiness?: boolean;
}

export interface Page {
  _id: string;
  slug: string;
  template: Template;
  /** Short label used in breadcrumbs, menus and cards. */
  name: string;
  parent?: { slug: string; name: string };
  seo: Seo;
  h1: string;
  /** Hero paragraph(s): the direct answer, subtitle or intro. Plain text, never collapsed. */
  answer: RichText;
  /** Home only: micro-proof line under the buttons. */
  microProof?: RichText;
  heroImage?: ImageRef;
  answerImage?: ImageRef;
  /** Outdoor PACA page: shows the zone banner. */
  outdoor?: boolean;
  zone: Zone;
  structuredData: StructuredData;
  sections: Section[];
  /** "Voir aussi" sibling cards (services and city pages). */
  related?: { hub: { slug: string; name: string }; items: CardItem[] };
  finalCta?: string;
  /** Pages with unresolved client data cannot be published (see scripts/content-guard.mjs). */
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  pubDate: string;
  image?: ImageRef;
}

export interface Post extends PostSummary {
  _id: string;
  seo: Seo;
  answer: RichText;
  body: RichText;
  faq?: FaqItem[];
  updatedAt?: string;
  author?: Person;
}

// ---------------------------------------------------------------------------
// Site-wide settings
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string;
  href: string;
  sub?: string;
  image?: ImageRef;
  badge?: string;
}

export interface NavGroup {
  key: 'services' | 'outdoor' | 'villes';
  label: string;
  hub?: NavLink;
  caption: string;
  items: NavLink[];
}

export interface Phone {
  display: string;
  /** E.164, used for tel: links. */
  e164: string;
}

export interface SiteSettings {
  siteUrl: string;
  siteName: string;
  entitySentence: string;
  legal: { siren: string; foundingDate: string; legalName: string };
  address: {
    streetAddress?: string;
    postalCode?: string;
    locality: string;
    region: string;
    country: string;
  };
  phones: { default: Phone; paca?: Phone; idf?: Phone };
  areas: string[];
  sameAs: string[];
  socials: { label: string; href: string }[];
  logo: ImageRef;
  nav: { groups: NavGroup[]; links: NavLink[] };
  footer: {
    columns: { title: string; links: NavLink[] }[];
    legal: NavLink[];
    regionsLine: string;
  };
  seasonal: { enabled: boolean; text: string; href: string; fromMonth: number; toMonth: number };
  marquee: string[];
  analytics: { gtmId?: string };
  quoteEndpoint: string;
}

export interface SiteIndex {
  generatedAt: string;
  pages: { slug: string; file: string; template: Template; noindex?: boolean; updatedAt?: string }[];
  posts: PostSummary[];
}
