import { Page, Person, Post, SiteSettings } from '../content/content.models';
import { UI } from '../i18n/i18n';
import { floraImageLoader } from '../media/image-loader';

/*
 * Schema.org graphs, per the « JSON-LD » section of each content file:
 *  - Organization on every page (SIREN, foundingDate 1999, areaServed PACA + IDF)
 *  - one single LocalBusiness: the Gémenos base, only where `localBusiness` is set
 *    (never Paris or Nice: no real address there)
 *  - Service with per-page areaServed; AboutPage on the entity page;
 *    Article + author Person on blog posts. No FAQPage.
 */

const abs = (s: SiteSettings, path: string) => (path.startsWith('http') ? path : s.siteUrl + path);
const imageUrl = (s: SiteSettings, src: string, width = 1440) => abs(s, floraImageLoader({ src, width }));
const area = (name: string) => ({ '@type': name === 'France' ? 'Country' : 'AdministrativeArea', name });

function organization(s: SiteSettings, team: Person[] = []) {
  return {
    '@type': 'Organization',
    '@id': `${s.siteUrl}/#organization`,
    name: s.siteName,
    legalName: s.legal.legalName,
    url: `${s.siteUrl}/`,
    logo: imageUrl(s, s.logo.src, 480),
    description: s.entitySentence,
    foundingDate: s.legal.foundingDate,
    identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: s.legal.siren },
    areaServed: s.areas.map(area),
    ...(s.sameAs.length ? { sameAs: s.sameAs } : {}),
    ...(team.length ? { employee: team.map((p) => personNode(s, p)) } : {}),
  };
}

function personNode(s: SiteSettings, p: Person) {
  return {
    '@type': 'Person',
    '@id': `${s.siteUrl}/qui-sommes-nous/#${p._id}`,
    name: p.name,
    ...(p.role ? { jobTitle: p.role } : {}),
    ...(p.photo ? { image: imageUrl(s, p.photo.src, 480) } : {}),
    ...(p.sameAs?.length ? { sameAs: p.sameAs } : {}),
    worksFor: { '@id': `${s.siteUrl}/#organization` },
    url: `${s.siteUrl}/qui-sommes-nous/`,
  };
}

function localBusiness(s: SiteSettings) {
  const a = s.address;
  return {
    '@type': 'LocalBusiness',
    '@id': `${s.siteUrl}/#gemenos`,
    name: s.siteName,
    url: `${s.siteUrl}/`,
    image: imageUrl(s, s.logo.src, 480),
    telephone: s.phones.default.e164,
    address: {
      '@type': 'PostalAddress',
      ...(a.streetAddress ? { streetAddress: a.streetAddress } : {}),
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
      addressLocality: a.locality,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    parentOrganization: { '@id': `${s.siteUrl}/#organization` },
  };
}

function breadcrumb(s: SiteSettings, trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(s, trail[trail.length - 1].path)}#breadcrumb`,
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(s, t.path) })),
  };
}

export function pageTrail(page: Page): { name: string; path: string }[] {
  const ui = UI[page.lang ?? 'fr'];
  const home = { name: ui.breadcrumb.home, path: ui.routes.home };
  if (page.slug === home.path) return [home];
  return [
    home,
    ...(page.parent ? [{ name: page.parent.name, path: page.parent.slug }] : []),
    { name: page.name, path: page.slug },
  ];
}

export function buildPageGraph(page: Page, s: SiteSettings): object {
  const url = abs(s, page.slug);
  const sd = page.structuredData;
  const team = page.sections.flatMap((x) => (x._type === 'sectionTeam' ? x.members : []));
  const graph: object[] = [
    { '@type': 'WebSite', '@id': `${s.siteUrl}/#website`, url: `${s.siteUrl}/`, name: s.siteName, inLanguage: ['fr-FR', 'en-GB'], publisher: { '@id': `${s.siteUrl}/#organization` } },
    organization(s, team),
  ];
  if (sd.localBusiness) graph.push(localBusiness(s));
  const webPageType = sd.type === 'AboutPage' || sd.type === 'CollectionPage' ? sd.type : 'WebPage';
  graph.push({
    '@type': webPageType,
    '@id': `${url}#webpage`,
    url,
    name: page.seo.title,
    description: page.seo.description,
    inLanguage: page.lang === 'en' ? 'en-GB' : 'fr-FR',
    isPartOf: { '@id': `${s.siteUrl}/#website` },
    ...(pageTrail(page).length > 1 ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    ...(page.heroImage ? { primaryImageOfPage: imageUrl(s, page.heroImage.src) } : {}),
    ...(sd.type === 'AboutPage' ? { mainEntity: { '@id': `${s.siteUrl}/#organization` } } : {}),
    ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
  });
  if (sd.type === 'Service') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: page.h1,
      ...(sd.serviceType ? { serviceType: sd.serviceType } : {}),
      description: page.seo.description,
      url,
      provider: { '@id': `${s.siteUrl}/#organization` },
      areaServed: (sd.areaServed ?? s.areas).map(area),
    });
  }
  if (pageTrail(page).length > 1) graph.push(breadcrumb(s, pageTrail(page)));
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function buildPostGraph(post: Post, s: SiteSettings): object {
  const path = `/blog/${post.slug}/`;
  const url = abs(s, path);
  const author = post.author
    ? personNode(s, post.author)
    : { '@type': 'Organization', '@id': `${s.siteUrl}/#organization`, name: "L'équipe Flora Concept", url: `${s.siteUrl}/qui-sommes-nous/` };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(s),
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.seo.description,
        url,
        mainEntityOfPage: url,
        inLanguage: 'fr-FR',
        datePublished: post.pubDate,
        dateModified: post.updatedAt ?? post.pubDate,
        ...(post.image ? { image: imageUrl(s, post.image.src) } : {}),
        author,
        publisher: { '@id': `${s.siteUrl}/#organization` },
      },
      breadcrumb(s, [
        { name: 'Accueil', path: '/' },
        { name: 'Blog', path: '/blog/' },
        { name: post.title, path },
      ]),
    ],
  };
}
