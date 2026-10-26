import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageRef, RichText } from '../core/content/content.models';
import { LeafIcon } from '../shared/icons';
import { Photo } from '../shared/photo';
import { RichTextComponent } from '../shared/rich-text/rich-text';

export interface BentoItem {
  key: string;
  lead?: string;
  href?: string;
  text?: RichText;
}

/**
 * Numbered card grid with one photo cell (S5 checklist, S10 arguments, S8/S9 groups).
 * The column count and tall-photo choice follow the design's packing rule so the
 * grid never leaves a hole.
 */
export function bentoLayout(n: number, withImage: boolean): { cols: number; tall: boolean; odd: boolean } {
  if (!withImage) return { cols: [4, 3, 2].find((c) => n % c === 0) ?? 3, tall: false, odd: n % 2 === 1 };
  const options: { c: number; tall: boolean; cc: number }[] = [];
  for (const c of [4, 3, 2]) {
    for (const tall of [true, false]) {
      const cc = n + (tall ? 2 : 1);
      if (cc % c === 0 && (!tall || cc / c >= 2) && cc / c <= 4) options.push({ c, tall, cc });
    }
  }
  const pick = options[0] ?? { c: Math.min(4, n + 1), tall: false, cc: n + 1 };
  return { cols: pick.c, tall: pick.tall, odd: pick.cc % 2 === 1 };
}

@Component({
  selector: 'fc-bento',
  imports: [LeafIcon, Photo, RichTextComponent, RouterLink],
  template: `
    @let l = layout();
    <div class="bento" [class.bento--odd]="l.odd" [style.--cols]="l.cols">
      @if (image()) {
        <fc-photo class="bento__img" [class.bento__img--tall]="l.tall" [image]="image()" alt="" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
      }
      @for (it of items(); track it.key; let i = $index) {
        <div class="card" [class.card--feat]="i === 0" data-reveal>
          <div class="card__top">
            <span class="card__n">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <span class="leaf-dot" aria-hidden="true"><fc-leaf /></span>
          </div>
          @if (it.lead) {
            <h3 class="card__title">
              @if (it.href) { <a [routerLink]="it.href">{{ it.lead }}</a> } @else { {{ it.lead }} }
            </h3>
            <div class="card__text prose prose--sm"><fc-rich-text [value]="it.text" /></div>
          } @else {
            <h3 class="card__title card__title--only"><fc-rich-text [value]="it.text" [inline]="true" /></h3>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './bento.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bento {
  readonly items = input.required<BentoItem[]>();
  readonly image = input<ImageRef | undefined>();
  protected readonly layout = computed(() => bentoLayout(this.items().length, !!this.image()));
}
