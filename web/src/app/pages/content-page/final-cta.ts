import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { LeafIcon } from '../../shared/icons';

/** G5 · final call to action, last band before the footer. */
@Component({
  selector: 'fc-final-cta',
  imports: [RouterLink, LeafIcon, AccentTitle],
  template: `
    <section class="g5" aria-labelledby="final-cta">
      <div class="wrap">
        <div class="g5__inner">
          <h2 class="h2 g5__title" id="final-cta"><fc-accent [text]="line()" /></h2>
          <div class="g5__actions">
            <a class="btn btn--primary g5__btn" routerLink="/devis/">Recevoir mon devis gratuit <fc-leaf /></a>
            <a class="link g5__call" [href]="'tel:' + phone().e164" [attr.data-zone]="site.zone()">ou appelez-nous</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .g5 { padding: clamp(72px, 10vw, 120px) 0; }
    .g5__inner {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 32px;
      padding-top: clamp(48px, 6vw, 80px); border-top: 1px solid var(--ln);
    }
    .g5__title { font-size: clamp(36px, 4.4vw, 64px); line-height: 0.95; max-width: 820px; }
    .g5__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
    .g5__btn { min-height: 60px; padding: 0 30px; }
    .g5__call { font-size: 15px; color: var(--fg); min-height: 44px; display: inline-flex; align-items: center; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCta {
  protected readonly site = inject(SiteStore);
  readonly line = input.required<string>();
  protected readonly phone = computed(() => this.site.phone());
}
