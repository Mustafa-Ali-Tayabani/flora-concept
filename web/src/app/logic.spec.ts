import { describe, expect, it } from 'vitest';
import { Section } from './core/content/content.models';
import { floraImageLoader } from './core/media/image-loader';
import { splitAccent } from './shared/accent-title';
import { toNodes } from './shared/rich-text/portable-text';
import { bentoLayout } from './sections/bento';
import { contactIsValid } from './sections/quote-form/quote-form';
import { splitAnswer } from './pages/content-page/heroes';
import { sectionRows } from './pages/content-page/page-sections';
import { inSeason } from './pages/content-page/seasonal-banner';

describe('splitAccent', () => {
  it('puts the last word in the accent and keeps punctuation upright', () => {
    expect(splitAccent('Location ou achat : que choisir ?')).toEqual({ pre: 'Location ou achat : que', last: 'choisir', punct: ' ?' });
  });
  it('keeps short last words with the previous one', () => {
    expect(splitAccent('Votre devis gratuit en une minute').last).toBe('minute');
    expect(splitAccent('Des plantes pour le bar').last).toBe('le bar');
  });
});

describe('splitAnswer', () => {
  it('cuts the direct answer at « : » without changing any character', () => {
    const text = "La location de plantes pour bureau est la façon la plus simple de végétaliser une entreprise : Flora Concept sélectionne les plantes. Vous ne portez ni l'investissement. Ensuite, nos jardiniers passent.";
    const { quote, columns } = splitAnswer(text);
    expect(quote.endsWith(' :')).toBe(true);
    expect(`${quote} ${columns.join(' ')}`).toBe(text);
    expect(columns.length).toBe(2);
  });
});

describe('sectionRows', () => {
  const s = (tone?: 'surface' | 'dark'): Section => ({ _key: Math.random().toString(), _type: 'sectionText', title: 'T', body: [], variant: 'split', tone });
  it('alternates backgrounds and honours forced tones', () => {
    const rows = sectionRows([s(), s(), s('surface'), s('dark')], true);
    expect(rows.map((r) => r.surface)).toEqual([true, false, true, false]);
  });
  it('separates two consecutive dark sections with the divider', () => {
    const rows = sectionRows([s('dark'), s('dark')], false);
    expect(rows.map((r) => r.tight)).toEqual([false, true]);
  });
  it('numbers only sections with a heading', () => {
    const rows = sectionRows([{ _key: 'p', _type: 'sectionProfiles', items: [] }, s(), s()], false);
    expect(rows.map((r) => r.num)).toEqual([0, 1, 2]);
  });
});

describe('bentoLayout', () => {
  it('packs items + photo without holes', () => {
    for (let n = 2; n <= 8; n++) {
      const { cols, tall } = bentoLayout(n, true);
      const cells = n + (tall ? 2 : 1);
      expect(cells % cols === 0 || cells < cols).toBe(true);
    }
  });
});

describe('contactIsValid', () => {
  it('accepts an email or a phone number', () => {
    expect(contactIsValid('nom@entreprise.fr')).toBe(true);
    expect(contactIsValid('04 13 12 13 80')).toBe(true);
    expect(contactIsValid('+33 6 12 34 56 78')).toBe(true);
    expect(contactIsValid('demain')).toBe(false);
    expect(contactIsValid('nom@entreprise')).toBe(false);
  });
});

describe('floraImageLoader', () => {
  it('maps local images to the nearest generated width', () => {
    expect(floraImageLoader({ src: '/img/hero', width: 700 })).toBe('/img/hero-768.webp');
    expect(floraImageLoader({ src: '/img/hero', width: 5000 })).toBe('/img/hero-1920.webp');
  });
  it('uses the Sanity CDN for Sanity images', () => {
    expect(floraImageLoader({ src: 'https://cdn.sanity.io/images/p/d/a.jpg', width: 480 })).toContain('w=480&auto=format');
  });
});

describe('inSeason', () => {
  it('handles ranges inside and across the year end', () => {
    expect(inSeason(11, 10, 12)).toBe(true);
    expect(inSeason(1, 10, 12)).toBe(false);
    expect(inSeason(1, 11, 1)).toBe(true);
  });
});

describe('portable text', () => {
  it('groups list items into one list', () => {
    const b = (k: string, listItem?: 'bullet') => ({ _type: 'block' as const, _key: k, style: 'normal' as const, markDefs: [], listItem, children: [{ _type: 'span' as const, _key: k + 's', text: k, marks: [] }] });
    const nodes = toNodes([b('a'), b('b', 'bullet'), b('c', 'bullet'), b('d')]);
    expect(nodes.map((n) => n.kind)).toEqual(['p', 'ul', 'p']);
  });
});
