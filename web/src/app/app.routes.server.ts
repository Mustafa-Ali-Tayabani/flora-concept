import { RenderMode, ServerRoute } from '@angular/ssr';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { SiteIndex } from './core/content/content.models';

/** Written by scripts/sync-content.mjs before every build. */
async function siteIndex(): Promise<SiteIndex> {
  return JSON.parse(await readFile(join(process.cwd(), 'public/content/index.json'), 'utf8'));
}

/**
 * Static site generation: every page (and every post whose pubDate has passed)
 * is prerendered to HTML at build time. No server runtime is needed.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
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
        .filter((p) => p.slug !== '/')
        .map((p) => ({ slug: p.slug.replace(/^\/|\/$/g, '') }));
    },
  },
  { path: '**', renderMode: RenderMode.Client },
];
