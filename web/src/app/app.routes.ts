import { inject } from '@angular/core';
import { RedirectCommand, Router, Routes } from '@angular/router';
import { map } from 'rxjs';
import { pageResolver } from './core/content/content.resolvers';
import { ContentService } from './core/content/content.service';
import { ContentPage } from './pages/content-page/content-page';

/** All site pages are one segment deep (`/<slug>/`), blog posts are `/blog/<slug>/`. */
export const routes: Routes = [
  { path: '', component: ContentPage, data: { slug: '/' }, resolve: { page: pageResolver } },
  {
    path: 'blog/:post',
    loadComponent: () => import('./pages/blog/post-page').then((m) => m.PostPage),
    resolve: {
      post: (route: import('@angular/router').ActivatedRouteSnapshot) => {
        const router = inject(Router);
        return inject(ContentService)
          .post(route.paramMap.get('post') ?? '')
          .pipe(map((post) => post ?? new RedirectCommand(router.parseUrl('/404/'), { skipLocationChange: true })));
      },
    },
  },
  { path: ':slug', component: ContentPage, resolve: { page: pageResolver }, runGuardsAndResolvers: 'paramsChange' },
  { path: '**', component: ContentPage, data: { slug: '/404/' }, resolve: { page: pageResolver } },
];
