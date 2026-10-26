import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaqSection } from '../core/content/content.models';
import { AccentTitle } from '../shared/accent-title';
import { BranchArt, LeafIcon } from '../shared/icons';
import { RichTextComponent } from '../shared/rich-text/rich-text';
import { SectionHead } from '../shared/section-head';

/**
 * S12 · FAQ. Answers are in the served HTML and rendered open: the brief requires
 * them to be readable without interaction (they are what search engines and AI
 * assistants quote). Visitors can still fold them.
 */
@Component({
  selector: 'fc-faq-section',
  imports: [SectionHead, RichTextComponent, LeafIcon, BranchArt, RouterLink, AccentTitle, NgTemplateOutlet],
  template: `
    @let s = section();
    @if (standalone()) {
      <div class="split">
        <div class="stack" style="--gap: 14px">
          <span class="big-n" aria-hidden="true">{{ num().toString().padStart(2, '0') }}</span>
          <h2 class="h2" [id]="s.anchor + '-title'"><fc-accent [text]="s.title!" /></h2>
        </div>
        <ng-container *ngTemplateOutlet="list" />
      </div>
    } @else {
      <div class="split" data-faqwrap>
        <div class="sticky side">
          <fc-section-head [title]="s.title!" [num]="num()" [side]="true" />
          <div class="promo">
            <fc-branch class="promo__art" color="#3d5a40" />
            <div class="promo__bar" aria-hidden="true"><span data-faqbar></span><span class="promo__count" data-faqcount>01 / {{ s.items.length.toString().padStart(2, '0') }}</span></div>
            <p class="promo__title">Votre devis gratuit en une <em class="accent">minute</em></p>
            <a class="btn btn--primary btn--sm" routerLink="/devis/">Recevoir mon devis <fc-leaf /></a>
          </div>
        </div>
        <ng-container *ngTemplateOutlet="list" />
      </div>
    }

    <ng-template #list>
      <div class="list">
        @for (f of s.items; track f._key; let i = $index) {
          <details open>
            <summary>
              <span class="q-n" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <h3 class="q">{{ f.question }}</h3>
              <span class="leaf-dot" aria-hidden="true"><fc-leaf /></span>
            </summary>
            <div class="a prose prose--muted"><fc-rich-text [value]="f.answer" /></div>
          </details>
        }
      </div>
    </ng-template>
  `,
  styleUrl: './faq-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  readonly section = input.required<FaqSection>();
  readonly num = input(0);
  /** FAQ page layout (big number, no side promo card). */
  readonly standalone = input(false);
}
