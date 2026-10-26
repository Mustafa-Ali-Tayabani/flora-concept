import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '../core/site/site.store';
import { LeafIcon } from './icons';

/** The two actions present on every page: quote (primary) + call (outlined). */
@Component({
  selector: 'fc-cta-buttons',
  imports: [RouterLink, LeafIcon],
  template: `
    <div class="btn-row">
      <a class="btn btn--primary" routerLink="/devis/">{{ label() }} <fc-leaf /></a>
      <a class="btn btn--outline" [href]="'tel:' + phone().e164" [attr.data-zone]="site.zone()" [attr.aria-label]="'Appeler le ' + phone().display">Appeler</a>
    </div>
  `,
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaButtons {
  protected readonly site = inject(SiteStore);
  readonly label = input('Recevoir mon devis gratuit');
  protected readonly phone = computed(() => this.site.phone());
}
