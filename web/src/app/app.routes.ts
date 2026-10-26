import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Router, Routes } from '@angular/router';
import { map } from 'rxjs';
import { pageResolver } from './core/content/content.resolvers';
import { ContentService } from './core/content/content.service';
import { ContentPage } from './pages/content-page/content-page';

const postResolver = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  return inject(ContentService)
    .post(route.paramMap.get('post') ?? '')
    .pipe(map((post) => post ?? new RedirectCommand(router.parseUrl('/404/'), { skipLocationChange: true })));
};

/**
 * French pages at the root (`/<slug>/`, final slugs from the brief), English
 * pages under `/en/<slug>/`, blog posts under `/blog/<slug>/`.
 */
export const routes: Routes = [
  { path: '', component: ContentPage, data: { slug: '/', lang: 'fr' }, resolve: { page: pageResolver } },
  { path: 'en', component: ContentPage, data: { slug: '/en/', lang: 'en' }, resolve: { page: pageResolver } },
  { path: 'en/:slug', component: ContentPage, data: { lang: 'en' }, resolve: { page: pageResolver }, runGuardsAndResolvers: 'paramsChange' },
  { path: 'blog/:post', loadComponent: () => import('./pages/blog/post-page').then((m) => m.PostPage), resolve: { post: postResolver } },
  { path: ':slug', component: ContentPage, data: { lang: 'fr' }, resolve: { page: pageResolver }, runGuardsAndResolvers: 'paramsChange' },
  { path: '**', component: ContentPage, data: { slug: '/404/', lang: 'fr' }, resolve: { page: pageResolver } },
];
