import { LocationStrategy, TrailingSlashPathLocationStrategy, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  inject,
} from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideFloraImages } from './core/media/image-loader';
import { SiteStore } from './core/site/site.store';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    // Every URL of the site ends with « / » (canonical form, no redirect hop).
    { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
    // Incremental hydration: static sections are never hydrated (`hydrate never`).
    provideClientHydration(withEventReplay(), withIncrementalHydration(), withNoHttpTransferCache()),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'fr' },
    provideFloraImages(),
    provideAppInitializer(() => inject(SiteStore).load()),
  ],
};
