import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SiteStore } from '../core/site/site.store';
import { RouterLink } from '@angular/router';
import {
  CaseStudiesSection,
  FiguresSection,
  LegalSection,
  LogosSection,
  TeamSection,
  TimelineSection,
} from '../core/content/content.models';
import { Photo } from '../shared/photo';
import { RichTextComponent } from '../shared/rich-text/rich-text';
import { SectionHead } from '../shared/section-head';

/*
 * S11, S13, S17, S18, S19 depend on client data (approvals, portraits, verified
 * figures). scripts/sync-content.mjs removes them while empty, so these components
 * only ever render the « present » state.
 */

@Component({
  selector: 'fc-cases-section',
  imports: [SectionHead, Photo, RouterLink],
  template: `
    <fc-section-head [title]="section().title!" [num]="num()" />
    <div class="grid">
      @for (c of section().cases; track c._key) {
        <article class="case" data-reveal>
          <fc-photo class="case__img" ratio="3/2" [image]="c.image" alt="" sizes="(max-width: 860px) 100vw, 33vw" />
          <h3 class="h3">@if (c.href) { <a class="link" [routerLink]="c.href">{{ c.client }}</a> } @else { {{ c.client }} }</h3>
          <p class="small">{{ c.city }} · {{ c.service }}</p>
          @if (c.since) { <p class="small">{{ c.since }}</p> }
        </article>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 24px; }
    .case { display: flex; flex-direction: column; gap: 10px; }
    .case__img { border-radius: 22px; margin-bottom: 8px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseStudiesSectionComponent {
  readonly section = input.required<CaseStudiesSection>();
  readonly num = input(0);
}

@Component({
  selector: 'fc-logos-section',
  imports: [SectionHead, Photo],
  template: `
    <fc-section-head [title]="section().title!" [num]="num()" />
    <ul class="logos">
      @for (l of section().logos; track $index) {
        <li><fc-photo class="logo" ratio="3/1" [image]="l" sizes="20vw" position="50% 50%" /></li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; }
    .logos { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
    .logo { background: transparent; filter: grayscale(1); opacity: 0.85; }
    .logo ::ng-deep img { object-fit: contain; }
    @media (max-width: 640px) { .logos { grid-template-columns: repeat(3, 1fr); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogosSectionComponent {
  readonly section = input.required<LogosSection>();
  readonly num = input(0);
}

@Component({
  selector: 'fc-team-section',
  imports: [SectionHead, Photo],
  template: `
    <fc-section-head [title]="section().title!" [num]="num()" />
    <ul class="team">
      @for (p of section().members; track p._id) {
        <li class="member" [id]="p._id" data-reveal>
          <fc-photo class="member__img" ratio="1/1" [image]="p.photo" sizes="(max-width: 640px) 50vw, 25vw" />
          <h3 class="h3">{{ p.name }}</h3>
          <p class="small">{{ p.role }}</p>
          @if (p.bio) { <p class="small">{{ p.bio }}</p> }
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; }
    .team { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
    .member { display: flex; flex-direction: column; gap: 6px; }
    .member__img { border-radius: 22px; margin-bottom: 8px; }
    @media (max-width: 860px) { .team { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamSectionComponent {
  readonly section = input.required<TeamSection>();
  readonly num = input(0);
}

@Component({
  selector: 'fc-figures-section',
  imports: [SectionHead],
  template: `
    <fc-section-head [title]="section().title!" [num]="num()" />
    <dl class="figures">
      @for (f of section().figures; track f._key) {
        <div class="figure"><dt class="small">{{ f.label }}</dt><dd>{{ f.value }}</dd></div>
      }
    </dl>
  `,
  styles: `
    :host { display: block; }
    .figures { margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; }
    .figure { display: flex; flex-direction: column-reverse; gap: 8px; padding-top: 20px; border-top: 1px solid var(--ln); }
    dd { margin: 0; font-family: var(--font-display); font-weight: 500; font-size: clamp(48px, 6vw, 88px); line-height: 1; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiguresSectionComponent {
  readonly section = input.required<FiguresSection>();
  readonly num = input(0);
}

@Component({
  selector: 'fc-timeline-section',
  imports: [SectionHead],
  template: `
    <fc-section-head [title]="section().title!" [num]="num()" />
    <ol class="tl">
      @for (m of section().milestones; track m._key) {
        <li data-reveal><span class="tl__y">{{ m.year }}</span><p>{{ m.text }}</p></li>
      }
    </ol>
  `,
  styles: `
    :host { display: block; }
    .tl { list-style: none; margin: 0; padding: 0; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 24px; }
    li { display: flex; flex-direction: column; gap: 10px; padding-top: 18px; border-top: 2px solid var(--ac); }
    .tl__y { font-family: var(--font-serif); font-style: italic; font-size: 34px; line-height: 1; color: var(--ac); }
    @media (max-width: 860px) { .tl { grid-auto-flow: row; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineSectionComponent {
  readonly section = input.required<TimelineSection>();
  readonly num = input(0);
}

/* S22 · legal text ---------------------------------------------------------- */
@Component({
  selector: 'fc-legal-section',
  imports: [RichTextComponent],
  template: `
    <div class="legal">
      @for (p of section().parts; track p._key) {
        <div class="part">
          @if (p.heading) { <h2 class="h3 part__h">{{ p.heading }}</h2> }
          <div class="prose"><fc-rich-text [value]="p.body" /></div>
          @if (p.table; as t) {
            <div class="ltable">
              @for (r of t.rows; track r._key) {
                <dl class="lrow">
                  @for (c of r.cells; track $index; let j = $index) {
                    <div><dt class="small">{{ t.head[j] }}</dt><dd><fc-rich-text [value]="c" [inline]="true" /></dd></div>
                  }
                </dl>
              }
            </div>
          }
        </div>
      }
      @if (section().showConsentButton) {
        <div><button type="button" class="btn btn--outline" data-action="manage-cookies">{{ t().sections.manageCookies }}</button></div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .legal { max-width: 820px; display: flex; flex-direction: column; gap: 32px; }
    .part { display: flex; flex-direction: column; gap: 12px; }
    .part__h { font-size: 24px; }
    .prose ::ng-deep p { max-width: none; }
    .ltable { display: flex; flex-direction: column; gap: 12px; }
    .lrow { margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px 20px; padding: 18px 20px; border-radius: 20px; border: 1px solid var(--ln); background: var(--card); }
    dd { margin: 2px 0 0; font-size: 15px; line-height: 1.5; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalSectionComponent {
  protected readonly t = inject(SiteStore).t;
  readonly section = input.required<LegalSection>();
}
