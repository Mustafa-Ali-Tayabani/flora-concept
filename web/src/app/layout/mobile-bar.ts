import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '../core/site/site.store';

/** G2 · fixed bottom bar on phone and tablet: [Devis] [Appeler]. Hidden on /devis/. */
@Component({
  selector: 'fc-mobile-bar',
  imports: [RouterLink],
  template: `
    @if (visible()) {
      <nav class="bar" [attr.aria-label]="site.t().cta.quickActions">
        <a class="btn btn--primary" [routerLink]="site.t().routes.quote">{{ site.t().cta.shortQuote }}</a>
        <a class="btn btn--outline" [href]="'tel:' + site.phone().e164" [attr.data-zone]="site.zone()">{{ site.t().cta.call }}</a>
      </nav>
    }
  `,
  styles: `
    .bar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 55; display: none; grid-template-columns: 1fr 1fr; gap: 8px;
      padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); background: rgba(18, 32, 26, 0.9);
      backdrop-filter: blur(20px); border-top: 1px solid rgba(241, 236, 225, 0.12);
    }
    .btn { min-height: 48px; padding: 0 12px; }
    .btn--outline { color: var(--cream); border-color: rgba(241, 236, 225, 0.5); }
    @media (max-width: 1240px) { .bar { display: grid; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBar {
  protected readonly site = inject(SiteStore);
  private readonly doc = inject(DOCUMENT);
  protected readonly visible = computed(() => this.site.page()?.template !== 'quote');

  constructor() {
    effect(() => this.doc.body.classList.toggle('has-mobile-bar', this.visible()));
  }
}
