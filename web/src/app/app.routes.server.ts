import { RenderMode, ServerRoute } from '@angular/ssr';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SiteIndex } from './core/content/content.models';

/** Written by scripts/sync-content.mjs before every build. */
async function siteIndex(): Promise<SiteIndex> {
  return JSON.parse(await readFile(join(process.cwd(), 'public/content/index.json'), 'utf8'));
}

/** Pages one level below `base` (`/realisations/<slug>/`) → route params. */
async function childParams(base: string): Promise<Record<string, string>[]> {
  return (await siteIndex()).pages
    .filter((p) => p.slug.startsWith(base) && p.slug !== base)
    .map((p) => ({ slug: p.slug.slice(base.length).replace(/\/$/, '') }));
}

/**
 * Static site generation: every page (and every post whose pubDate has passed)
 * is prerendered to HTML at build time. No server runtime is needed.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'realisations/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: () => childParams('/realisations/') },
  { path: 'en/projects/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: () => childParams('/en/projects/') },
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'en', renderMode: RenderMode.Prerender },
  {
    path: 'en/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return (await siteIndex()).pages
        .filter((p) => p.lang === 'en' && /^\/en\/[a-z0-9-]+\/$/.test(p.slug))
        .map((p) => ({ slug: p.slug.replace(/^\/en\/|\/$/g, '') }));
    },
  },
  {
    path: 'blog/:post',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return (await siteIndex()).posts.map((p) => ({ post: p.slug }));
    },
  },
  {
    path: ':slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return (await siteIndex()).pages
        .filter((p) => p.lang !== 'en' && /^\/[a-z0-9-]+\/$/.test(p.slug))
        .map((p) => ({ slug: p.slug.replace(/^\/|\/$/g, '') }));
    },
  },
  { path: '**', renderMode: RenderMode.Client },
];
