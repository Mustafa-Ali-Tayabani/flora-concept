/**
 * Interface strings (everything that is not CMS content) and language routing.
 * French is the default language and lives at the root; English lives under /en/.
 */
export type Lang = 'fr' | 'en';
export const LANGS: Lang[] = ['fr', 'en'];
export const DEFAULT_LANG: Lang = 'fr';

export const langFromPath = (path: string): Lang => (/^\/en(\/|$)/.test(path) ? 'en' : 'fr');

const fr = {
  locale: 'fr',
  ogLocale: 'fr_FR',
  routes: { home: '/', quote: '/devis/', about: '/qui-sommes-nous/', blog: '/blog/', cookies: '/cookies/', notFound: '/404/' },
  skipLink: 'Aller au contenu',
  langSwitch: { label: 'Langue', fr: 'Français', en: 'English' },
  header: { home: 'Accueil', logo: 'Flora Concept, accueil', mainNav: 'Menu principal', mobileNav: 'Menu mobile', menu: 'Menu', closeMenu: 'Fermer le menu', megaEyebrow: 'Devis gratuit', megaCta: 'Recevoir mon devis' },
  cta: { quote: 'Recevoir mon devis gratuit', call: 'Appeler', callNumber: 'Appeler le ', orCall: 'ou appelez-nous', finalLine: 'Votre devis gratuit en une minute', shortQuote: 'Devis', quickActions: 'Actions rapides' },
  breadcrumb: { label: "Fil d'Ariane", home: 'Accueil' },
  hero: { regions: 'PACA · Île-de-France', inShort: 'En bref', zoneBand: "Interventions en Provence-Alpes-Côte d'Azur" },
  sections: { discover: 'Découvrir', discoverLabel: 'Découvrir : ', seeAlso: ['Voir', 'aussi'], onThisPage: 'Sur cette page', faqTitle: 'Questions fréquentes', manageCookies: 'Gérer mes cookies' },
  season: { tag: 'Saison', close: 'Fermer le bandeau saisonnier' },
  footer: { manageCookies: 'Gestion des cookies' },
  cookies: {
    text: "Nous mesurons l'audience du site uniquement avec votre accord.",
    policy: 'Politique cookies',
    choices: 'Choix des traceurs',
    necessary: 'Strictement nécessaires',
    analytics: "Mesure d'audience",
    ergonomics: "Analyse d'ergonomie",
    acceptAll: 'Tout accepter',
    refuseAll: 'Tout refuser',
    customize: 'Personnaliser',
    save: 'Enregistrer',
  },
  quote: {
    title: ['Demande de', 'devis'],
    fields: '3 champs',
    name: 'Nom',
    contact: 'Email ou téléphone',
    need: 'Votre besoin',
    team: 'Équipe qui vous répond',
    honeypot: 'Site web',
    sending: 'Envoi en cours…',
  },
  zones: { marseille: 'Marseille et Provence', nice: "Nice et Côte d'Azur", paris: 'Paris et Île-de-France', none: "Provence-Alpes-Côte d'Azur ou Île-de-France" },
  blog: { published: 'Publié le', by: 'par', team: "L'équipe Flora Concept", read: 'Lire', about: 'Qui sommes-nous', author: 'Auteur', faq: ['Questions', 'fréquentes'], blog: 'Blog' },
};

export type Ui = typeof fr;

const en: Ui = {
  locale: 'en-GB',
  ogLocale: 'en_GB',
  routes: { home: '/en/', quote: '/en/quote/', about: '/en/about-us/', blog: '/en/blog/', cookies: '/en/cookies/', notFound: '/en/404/' },
  skipLink: 'Skip to content',
  langSwitch: { label: 'Language', fr: 'Français', en: 'English' },
  header: { home: 'Home', logo: 'Flora Concept, home', mainNav: 'Main menu', mobileNav: 'Mobile menu', menu: 'Menu', closeMenu: 'Close menu', megaEyebrow: 'Free quote', megaCta: 'Get my quote' },
  cta: { quote: 'Get my free quote', call: 'Call us', callNumber: 'Call ', orCall: 'or call us', finalLine: 'Your free quote in one minute', shortQuote: 'Quote', quickActions: 'Quick actions' },
  breadcrumb: { label: 'Breadcrumb', home: 'Home' },
  hero: { regions: 'PACA · Île-de-France', inShort: 'In short', zoneBand: "Services in Provence-Alpes-Côte d'Azur" },
  sections: { discover: 'Discover', discoverLabel: 'Discover: ', seeAlso: ['See', 'also'], onThisPage: 'On this page', faqTitle: 'Frequently asked questions', manageCookies: 'Manage my cookies' },
  season: { tag: 'Season', close: 'Close the seasonal banner' },
  footer: { manageCookies: 'Cookie settings' },
  cookies: {
    text: 'We only measure site traffic with your consent.',
    policy: 'Cookie policy',
    choices: 'Tracker choices',
    necessary: 'Strictly necessary',
    analytics: 'Audience measurement',
    ergonomics: 'Usability analysis',
    acceptAll: 'Accept all',
    refuseAll: 'Refuse all',
    customize: 'Customise',
    save: 'Save',
  },
  quote: {
    title: ['Quote', 'request'],
    fields: '3 fields',
    name: 'Name',
    contact: 'Email or phone',
    need: 'Your needs',
    team: 'Team that will reply',
    honeypot: 'Website',
    sending: 'Sending…',
  },
  zones: { marseille: 'Marseille and Provence', nice: "Nice and the Côte d'Azur", paris: 'Paris and Île-de-France', none: "Provence-Alpes-Côte d'Azur or Île-de-France" },
  blog: { published: 'Published on', by: 'by', team: 'The Flora Concept team', read: 'Read', about: 'About us', author: 'Author', faq: ['Frequently asked', 'questions'], blog: 'Blog' },
};

export const UI: Record<Lang, Ui> = { fr, en };
