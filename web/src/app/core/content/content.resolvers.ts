import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { Page } from './content.models';
import { ContentService } from './content.service';

/** Resolves the page for the current URL; unknown slugs resolve to the 404 page. */
export const pageResolver: ResolveFn<Page> = (route) => {
  const content = inject(ContentService);
  const fixed = route.data['slug'] as string | undefined;
  const param = route.paramMap.get('slug');
  const slug = fixed ?? (param && /^[a-z0-9-]+$/.test(param) ? `/${param}/` : '/404/');
  return content.page(slug).pipe(
    switchMap((page) => (page ? of(page) : content.page('/404/'))),
    map((page) => page as Page),
  );
};
