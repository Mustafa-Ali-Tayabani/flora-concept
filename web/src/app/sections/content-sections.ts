import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SiteStore } from '../core/site/site.store';
import { RouterLink } from '@angular/router';
import {
  BentoSection,
  CardItem,
  CardsSection,
  FeatureSection,
  GroupsSection,
  ProfilesSection,
  RegionsSection,
  StepsSection,
  TableSection,
  TextSection,
} from '../core/content/content.models';
import { AccentTitle } from '../shared/accent-title';
import { LeafIcon } from '../shared/icons';
import { Photo } from '../shared/photo';
import { RichTextComponent } from '../shared/rich-text/rich-text';
import { SectionHead } from '../shared/section-head';
import { Bento, BentoItem } from './bento';

/* S3 · Profile entries (home) ------------------------------------------------ */
@Component({
  selector: 'fc-profiles',
  imports: [RouterLink, Photo, LeafIcon, RichTextComponent],
  template: `
    <div class="grid">
      @for (it of section().items; track it._key; let i = $index) {
        <a class="profile" [routerLink]="it.href" data-reveal>
          <fc-photo class="profile__bg" [image]="it.image" alt="" sizes="(max-width: 860px) 100vw, 33vw" />
          <span class="profile__shade" aria-hidden="true"></span>
          <span class="profile__top">
            <span class="profile__n" aria-hidden="true">0{{ i + 1 }}</span>
            @if (it.tag) { <span class="profile__tag">{{ it.tag }}</span> }
          </span>
          <span class="profile__bottom">
            <span class="profile__body">
              <span class="profile__title">{{ it.title }}</span>
              <span class="profile__text"><fc-rich-text [value]="it.text" [inline]="true" /></span>
            </span>
            <span class="leaf-dot leaf-dot--lg" aria-hidden="true"><fc-leaf /></span>
          </span>
        </a>
      }
    </div>
  `,
  styleUrl: './profiles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesSectionComponent {
  readonly section = input.required<ProfilesSection>();
}

/* Card grid: S4 services and « Voir aussi » ----------------------------------- */
@Component({
  selector: 'fc-card-grid',
  imports: [RouterLink, Photo, RichTextComponent],
  template: `
    <div class="cards" [style.--min.px]="min()">
      @for (c of cards(); track c._key) {
        <div class="svc tone-surface" data-reveal>
          <fc-photo class="svc__img" ratio="4/3" [image]="c.image" alt="" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw" />
          <div class="svc__body">
            <div class="svc__head">
              <h3 class="h3 svc__title">
                @if (c.href) { <a [routerLink]="c.href">{{ c.title }}</a> } @else { {{ c.title }} }
              </h3>
              @if (c.badge) { <span class="badge">{{ c.badge }}</span> }
            </div>
            @if (c.text?.length) {
              <div class="svc__text"><fc-rich-text [value]="c.text" /></div>
            }
            @if (c.links?.length || c.href) {
              <div class="svc__links">
                @if (c.links?.length) {
                  @for (l of c.links; track l._key) { <a class="link" [routerLink]="l.href">{{ l.label }}</a> }
                } @else {
                  <a class="link" [routerLink]="c.href" [attr.aria-label]="t().sections.discoverLabel + c.title">{{ t().sections.discover }}</a>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './card-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGrid {
  protected readonly t = inject(SiteStore).t;
  readonly cards = input.required<CardItem[]>();
  readonly min = input(260);
}

@Component({
  selector: 'fc-cards-section',
  imports: [SectionHead, CardGrid, RichTextComponent],
  template: `
    @let s = section();
    @if (s.title) {
      <fc-section-head [title]="s.title" [num]="num()">
        @if (s.intro?.length) { <div class="prose"><fc-rich-text [value]="s.intro" /></div> }
      </fc-section-head>
    }
    <fc-card-grid [cards]="s.cards" [min]="s.cards.length > 6 ? 240 : outdoor() ? 250 : 300" />
    @if (s.outro?.length) { <div class="prose outro"><fc-rich-text [value]="s.outro" /></div> }
  `,
  styles: `:host { display: block; } .outro { margin-top: 32px; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsSectionComponent {
  readonly section = input.required<CardsSection>();
  readonly num = input(0);
  readonly outdoor = input(false);
}

/* S5 checklist / S10 arguments ------------------------------------------------ */
@Component({
  selector: 'fc-bento-section',
  imports: [SectionHead, Bento, RichTextComponent, LeafIcon],
  template: `
    @let s = section();
    <fc-section-head [title]="s.title!" [num]="num()">
      @if (s.intro?.length) { <div class="prose"><fc-rich-text [value]="s.intro" /></div> }
    </fc-section-head>
    <fc-bento [items]="items()" [image]="s.image" />
    @if (s.note?.length) {
      @if (boxedNote()) {
        <div class="note"><span class="leaf-dot" aria-hidden="true"><fc-leaf /></span><div class="prose"><fc-rich-text [value]="s.note" /></div></div>
      } @else {
        <div class="prose after"><fc-rich-text [value]="s.note" /></div>
      }
    }
  `,
  styleUrl: './note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BentoSectionComponent {
  readonly section = input.required<BentoSection>();
  readonly num = input(0);
  protected readonly items = computed<BentoItem[]>(() =>
    this.section().items.map((it) => ({ key: it._key, lead: it.lead, href: it.href, text: it.text })),
  );
  protected readonly boxedNote = computed(() => this.section()._type === 'sectionChecklist' && this.section().items.some((i) => !i.lead));
}

/* S8 / S9 · H3 sub-blocks ----------------------------------------------------- */
@Component({
  selector: 'fc-groups-section',
  imports: [SectionHead, Bento, RichTextComponent],
  template: `
    @let s = section();
    <fc-section-head [title]="s.title!" [num]="num()">
      @if (s.intro?.length) { <div class="prose"><fc-rich-text [value]="s.intro" /></div> }
    </fc-section-head>
    <fc-bento [items]="items()" [image]="s.image" />
  `,
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsSectionComponent {
  readonly section = input.required<GroupsSection>();
  readonly num = input(0);
  protected readonly items = computed<BentoItem[]>(() => this.section().groups.map((g) => ({ key: g._key, lead: g.title, text: g.body })));
}

/* S10 · single-paragraph commitment (photo + pills) ------------------------------ */
@Component({
  selector: 'fc-feature-section',
  imports: [SectionHead, Photo, RichTextComponent],
  template: `
    @let s = section();
    <div class="feature">
      <div class="split split--center" style="--l: 5fr; --r: 6fr">
        <fc-photo class="feature__img" [image]="s.image" alt="" sizes="(max-width: 860px) 100vw, 45vw">
          <span class="feature__shade" aria-hidden="true"></span>
          @if (s.pills?.length) {
            <ul class="feature__pills">
              @for (p of s.pills; track $index) { <li>{{ p }}</li> }
            </ul>
          }
        </fc-photo>
        <div class="feature__txt">
          <fc-section-head [title]="s.title!" [num]="num()" [side]="true" />
          @if (s.quote) { <p class="feature__quote">{{ s.quote }}</p> }
          <div class="prose prose--muted"><fc-rich-text [value]="s.body" /></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './feature.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureSectionComponent {
  readonly section = input.required<FeatureSection>();
  readonly num = input(0);
}

/* S6 · comparison table (stacked cards on phones, never horizontal scroll) ------ */
@Component({
  selector: 'fc-table-section',
  imports: [SectionHead, Photo, RichTextComponent, LeafIcon],
  template: `
    @let s = section();
    <fc-section-head [title]="s.title!" [num]="num()">
      @if (s.intro?.length) { <div class="prose"><fc-rich-text [value]="s.intro" /></div> }
    </fc-section-head>
    @if (s.photos?.length) {
      <div class="photos">
        @for (p of s.photos; track $index) { <fc-photo class="photos__img" ratio="3/2" [image]="p" sizes="(max-width: 640px) 100vw, 50vw" /> }
      </div>
    }
    <div class="tdesk">
      <table>
        <thead><tr>@for (h of s.head; track $index) { <th scope="col">{{ h }}</th> }</tr></thead>
        <tbody>
          @for (r of s.rows; track r._key) {
            <tr>
              @for (c of r.cells; track $index; let first = $first) {
                @if (first) { <th scope="row"><fc-rich-text [value]="c" [inline]="true" /></th> }
                @else { <td><fc-rich-text [value]="c" [inline]="true" /></td> }
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="tmob">
      @for (r of s.rows; track r._key) {
        <div class="tcard">
          <div class="tcard__title"><fc-rich-text [value]="r.cells[0]" [inline]="true" /></div>
          @for (c of r.cells.slice(1); track $index; let j = $index) {
            <div class="tcard__row"><span class="small">{{ s.head[j + 1] }}</span><fc-rich-text [value]="c" [inline]="true" /></div>
          }
        </div>
      }
    </div>
    @if (s.note?.length) {
      <div class="note"><span class="leaf-dot" aria-hidden="true"><fc-leaf /></span><div class="prose"><fc-rich-text [value]="s.note" /></div></div>
    }
  `,
  styleUrls: ['./table.scss', './note.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSectionComponent {
  readonly section = input.required<TableSection>();
  readonly num = input(0);
}

/* S7 · steps ----------------------------------------------------------------- */
@Component({
  selector: 'fc-steps-section',
  imports: [SectionHead, Photo, RichTextComponent],
  template: `
    @let s = section();
    @if (s.layout === 'vertical') {
      <div class="split">
        <div class="sticky side">
          <fc-section-head [title]="s.title!" [num]="num()" [side]="true" />
          @if (s.intro?.length) { <div class="prose prose--sm"><fc-rich-text [value]="s.intro" /></div> }
          @if (s.image) { <fc-photo class="tall" ratio="5/4" [image]="s.image" alt="" sizes="(max-width: 860px) 100vw, 40vw" /> }
        </div>
        <ol class="timeline">
          @for (st of s.steps; track st._key; let i = $index, last = $last) {
            <li class="timeline__item" data-reveal>
              @if (!last) { <span class="timeline__rail" aria-hidden="true"></span> }
              <span class="timeline__n" [class.is-first]="i === 0" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
              <div class="timeline__card">
                @if (st.lead) { <h3 class="h3">{{ st.lead }}</h3> }
                <div class="prose prose--sm prose--muted"><fc-rich-text [value]="st.text" /></div>
              </div>
            </li>
          }
        </ol>
      </div>
    } @else {
      <fc-section-head [title]="s.title!" [num]="num()" />
      <ol class="steps">
        @for (st of s.steps; track st._key; let i = $index) {
          <li class="steps__item" data-reveal>
            <span class="steps__n" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
            @if (st.lead) { <h3 class="h3">{{ st.lead }}</h3> }
            <div class="prose prose--steps"><fc-rich-text [value]="st.text" /></div>
          </li>
        }
      </ol>
      @if (s.intro?.length) { <div class="prose after"><fc-rich-text [value]="s.intro" /></div> }
    }
  `,
  styleUrl: './steps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepsSectionComponent {
  readonly section = input.required<StepsSection>();
  readonly num = input(0);
}

/* S21 · text ------------------------------------------------------------------ */
@Component({
  selector: 'fc-text-section',
  imports: [SectionHead, Photo, RichTextComponent],
  template: `
    @let s = section();
    @switch (s.variant) {
      @case ('wide') {
        <fc-section-head [title]="s.title!" [num]="num()" />
        @if (s.image) { <fc-photo class="wide" ratio="21/9" [image]="s.image" sizes="100vw" /> }
        <div class="prose"><fc-rich-text [value]="s.body" /></div>
      }
      @case ('highlight') {
        <div class="highlight">
          <div class="split" style="--l: 7fr; --r: 5fr">
            <div class="stack">
              <fc-section-head [title]="s.title!" [num]="num()" [side]="true" />
              <div class="prose"><fc-rich-text [value]="s.body" /></div>
            </div>
            @if (s.image) { <fc-photo ratio="4/3" class="rounded" [image]="s.image" sizes="(max-width: 860px) 100vw, 40vw" /> }
          </div>
        </div>
      }
      @default {
        <div class="split" [class.flip]="flip()" [style.--l]="flip() ? '5fr' : '7fr'" [style.--r]="flip() ? '7fr' : '5fr'">
          <div class="sticky stack" style="--gap: 22px">
            <fc-section-head [title]="s.title!" [num]="num()" [side]="true" />
            <div class="prose"><fc-rich-text [value]="s.body" /></div>
          </div>
          @if (s.image) { <fc-photo class="tall" [image]="s.image" alt="" sizes="(max-width: 860px) 100vw, 40vw" /> }
        </div>
      }
    }
  `,
  styleUrl: './text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextSectionComponent {
  readonly section = input.required<TextSection>();
  readonly num = input(0);
  /** Alternates photo side along the page, as in the design. */
  protected readonly flip = computed(() => this.num() % 2 === 1);
}

/* S14 · region cards (home) --------------------------------------------------- */
@Component({
  selector: 'fc-regions-section',
  imports: [SectionHead, Photo, RouterLink, LeafIcon, AccentTitle],
  template: `
    @let s = section();
    <fc-section-head [title]="s.title!" [num]="num()" />
    <div class="regions">
      @for (r of s.regions; track r._key) {
        <div class="region" [class.region--photo]="!!r.image" data-reveal>
          @if (r.image) {
            <fc-photo class="region__bg" [image]="r.image" alt="" sizes="(max-width: 860px) 100vw, 50vw" />
            <span class="region__shade" aria-hidden="true"></span>
          }
          @if (r.tag) { <span class="region__tag">{{ r.tag }}</span> }
          <h3 class="region__title"><fc-accent [text]="r.title" /></h3>
          <ul class="region__cities">
            @for (c of r.cities; track $index) { <li>{{ c }}</li> }
          </ul>
          <div class="region__links">
            @for (l of r.links; track l._key) {
              <a class="btn btn--sm region__btn" [routerLink]="l.href">{{ l.label }} <fc-leaf /></a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './regions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionsSectionComponent {
  readonly section = input.required<RegionsSection>();
  readonly num = input(0);
}
