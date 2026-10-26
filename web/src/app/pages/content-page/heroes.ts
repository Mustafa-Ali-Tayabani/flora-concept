import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Page } from '../../core/content/content.models';
import { pageTrail } from '../../core/seo/json-ld';
import { AccentTitle } from '../../shared/accent-title';
import { CtaButtons } from '../../shared/cta-buttons';
import { BranchArt } from '../../shared/icons';
import { Photo } from '../../shared/photo';
import { plainText } from '../../shared/rich-text/portable-text';
import { RichTextComponent } from '../../shared/rich-text/rich-text';

/**
 * Splits the direct answer into the design's « quote + two columns » layout.
 * Characters are untouched: the text is only cut at « : » or a sentence end.
 */
export function splitAnswer(all: string): { quote: string; columns: string[] } {
  let quote = '';
  let rest = all;
  const ci = all.indexOf(' : ');
  if (ci > 30 && ci < 150) {
    quote = all.slice(0, ci + 2);
    rest = all.slice(ci + 3);
  } else {
    const fs = all.match(/^.{30,170}?[.!?](?=\s)/);
    if (fs) {
      quote = fs[0];
      rest = all.slice(fs[0].length).trim();
    }
  }
  const sents = rest.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÝÉ])/);
  let acc = 0;
  let half = 0;
  for (let k = 0; k < sents.length; k++) {
    acc += sents[k].length;
    if (acc >= rest.length / 2) {
      half = k + 1;
      break;
    }
  }
  const columns = sents.length > 1 ? [sents.slice(0, half).join(' '), sents.slice(half).join(' ')].filter(Boolean) : [rest];
  return { quote, columns };
}

/* G3 · breadcrumb ----------------------------------------------------------- */
@Component({
  selector: 'fc-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav aria-label="Fil d'Ariane">
      <ol>
        @for (t of trail(); track t.path; let last = $last) {
          <li>
            @if (last) { <span class="current" aria-current="page">{{ t.name }}</span> }
            @else { <a [routerLink]="t.path">{{ t.name }}</a><span class="sep" aria-hidden="true">/</span> }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
      font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; }
    li { display: flex; align-items: center; gap: 10px; }
    a { color: rgba(241, 236, 225, 0.75); display: inline-flex; align-items: center; min-height: 32px; }
    a:hover { color: var(--cream); }
    .sep { color: rgba(241, 236, 225, 0.4); }
    .current { display: flex; align-items: center; padding: 8px 14px; border-radius: 999px; background: rgba(241, 236, 225, 0.1);
      border: 1px solid rgba(241, 236, 225, 0.2); color: var(--cream); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumb {
  readonly page = input.required<Page>();
  protected readonly trail = computed(() => pageTrail(this.page()));
}

/* S1 · page hero: banner + direct answer ------------------------------------ */
@Component({
  selector: 'fc-page-hero',
  imports: [Photo, Breadcrumb, AccentTitle, CtaButtons, BranchArt, RichTextComponent],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHero {
  readonly page = input.required<Page>();
  protected readonly withButtons = computed(() => !['quote', 'legal', 'blog'].includes(this.page().template));
  /** FAQ and quote pages show their intro as plain paragraphs. */
  protected readonly plain = computed(() => ['faq', 'quote'].includes(this.page().template));
  protected readonly split = computed(() => {
    const a = this.page().answer;
    const simple = a.every((b) => !b.listItem && b.markDefs.length === 0 && b.children.every((c) => c._type === 'span' && !c.marks.length));
    return simple && a.length ? splitAnswer(plainText(a)) : null;
  });
}

/* S2 · home hero ------------------------------------------------------------- */
@Component({
  selector: 'fc-home-hero',
  imports: [Photo, AccentTitle, CtaButtons, RichTextComponent],
  template: `
    @let p = page();
    <section class="home-hero" aria-labelledby="page-title">
      <div class="home-hero__media" data-parallax>
        <!-- Full-viewport photo: never the LCP element (Chrome ignores it, the H1 is), so no fetchpriority competing with fonts. -->
        <fc-photo class="home-hero__img" [image]="p.heroImage" loading="eager" sizes="100vw" position="60% 50%" />
      </div>
      <div class="home-hero__shade" aria-hidden="true"></div>
      <div class="home-hero__inner">
        <div class="home-hero__grid">
          <div class="home-hero__left">
            <span class="pill">PACA · Île-de-France</span>
            <h1 class="h1 home-hero__h1" id="page-title"><fc-accent [text]="p.h1" /></h1>
          </div>
          <div class="glass">
            <div class="glass__text"><fc-rich-text [value]="p.answer" /></div>
            <fc-cta-buttons />
            @if (p.microProof?.length) {
              <p class="glass__proof"><fc-rich-text [value]="p.microProof" [inline]="true" /></p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrl: './home-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHero {
  readonly page = input.required<Page>();
}
