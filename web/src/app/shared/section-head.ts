import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AccentTitle } from './accent-title';

/** Numbered eyebrow (« 01 —— ») + H2 with serif accent; projected intro below. */
@Component({
  selector: 'fc-section-head',
  imports: [AccentTitle],
  host: { '[class.is-side]': 'side()' },
  template: `
    @if (num()) {
      <span class="num" aria-hidden="true"><span class="num__n">{{ label() }}</span><span class="num__rule"></span></span>
    }
    <h2 class="h2" [attr.id]="headingId()"><fc-accent [text]="title()" /></h2>
    <ng-content />
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 16px; margin-bottom: clamp(28px, 3.4vw, 44px); max-width: 960px; }
    :host(.is-side) { margin-bottom: 0; }
    .num { display: flex; align-items: center; gap: 12px; color: var(--ac); }
    .num__n { font-family: var(--font-serif); font-style: italic; font-size: 26px; line-height: 1; }
    .num__rule { width: 36px; height: 1px; background: currentColor; opacity: 0.6; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHead {
  readonly title = input.required<string>();
  readonly num = input<number>(0);
  readonly side = input(false);
  readonly headingId = input<string | null>(null);
  protected readonly label = computed(() => String(this.num()).padStart(2, '0'));
}
