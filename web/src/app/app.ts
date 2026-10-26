import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AnalyticsService } from './core/analytics/analytics.service';
import { ConsentService } from './core/consent/consent.service';
import { FxService } from './core/fx/fx.service';
import { SiteStore } from './core/site/site.store';
import { CookieBanner } from './layout/cookie-banner';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { MobileBar } from './layout/mobile-bar';

@Component({
  selector: 'fc-root',
  imports: [RouterOutlet, Header, Footer, MobileBar, CookieBanner],
  template: `
    <a class="skip-link" href="#main">{{ t().skipLink }}</a>
    <div class="scroll-progress" aria-hidden="true"></div>
    <fc-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <fc-footer />
    <fc-mobile-bar />
    <fc-cookie-banner />
  `,
  styles: `main { display: block; outline: none; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly t = inject(SiteStore).t;

  constructor() {
    const consent = inject(ConsentService);
    const analytics = inject(AnalyticsService);
    const fx = inject(FxService);
    const router = inject(Router);
    afterNextRender(() => {
      consent.init();
      analytics.init();
      fx.init();
      fx.scan();
      // Move focus to the new content after client-side navigation (a11y).
      let first = true;
      router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        if (first) {
          first = false;
          return;
        }
        document.getElementById('main')?.focus({ preventScroll: true });
      });
    });
  }
}
