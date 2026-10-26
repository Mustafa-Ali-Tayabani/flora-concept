import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { from, map, of, switchMap } from 'rxjs';
import { Lang, UI } from '../i18n/i18n';
import { SiteStore } from '../site/site.store';
import { Page } from './content.models';
import { ContentService } from './content.service';

/**
 * Resolves the page for the current URL (unknown slugs → the 404 page of that
 * language) and switches the site language before the page renders.
 */
export const pageResolver: ResolveFn<Page> = (route) => {
  const content = inject(ContentService);
  const site = inject(SiteStore);
  const lang: Lang = route.data['lang'] ?? 'fr';
  const prefix = lang === 'en' ? '/en' : '';
  const fixed = route.data['slug'] as string | undefined;
  const param = route.paramMap.get('slug');
  const slug = fixed ?? (param && /^[a-z0-9-]+$/.test(param) ? `${prefix}/${param}/` : UI[lang].routes.notFound);
  return content.page(slug).pipe(
    switchMap((page) => (page ? of(page) : content.page(UI[lang].routes.notFound))),
    switchMap((page) => from(site.useLang((page as Page).lang ?? lang)).pipe(map(() => page as Page))),
  );
};
