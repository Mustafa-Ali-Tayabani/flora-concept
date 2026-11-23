import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../core/content/content.models';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { Photo } from '../../shared/photo';
import { RichTextComponent } from '../../shared/rich-text/rich-text';

/**
 * « Retour de chantier »: the client's story (need, answer, result), told in
 * the client's words, with the project photos. Static: never hydrated.
 */
@Component({
  selector: 'fc-project-story',
  imports: [RouterLink, Photo, AccentTitle, RichTextComponent],
  template: `
    @let p = project();
    <section class="band intro" aria-labelledby="project-lead">
      <div class="wrap">
        <div class="split" style="--l: 7fr; --r: 5fr">
          <div class="stack" style="--gap: 22px">
            <span class="eyebrow">{{ t().project.eyebrow }}</span>
            <p class="lead" id="project-lead"><fc-accent [text]="p.subtitle" /></p>
          </div>
          <dl class="facts">
            <div><dt>{{ t().project.client }}</dt><dd>{{ p.client }}</dd></div>
            @if (p.place) { <div><dt>{{ t().project.place }}</dt><dd>{{ p.place }}</dd></div> }
            <div><dt>{{ t().project.type }}</dt><dd>{{ p.category }}</dd></div>
            <div>
              <dt>{{ t().project.services }}</dt>
              <dd class="facts__links">
                @for (s of p.services; track s.slug) { <a class="link" [routerLink]="s.slug">{{ s.name }}</a> }
              </dd>
            </div>
          </dl>
        </div>

        <div class="story">
          @for (part of p.story; track part._key; let i = $index) {
            <article class="part" [class.part--flip]="i % 2 === 1" [class.part--solo]="!storyPhotos()[i]" data-reveal>
              <div class="part__txt">
                <span class="part__n" aria-hidden="true">{{ i + 1 < 10 ? '0' : '' }}{{ i + 1 }}</span>
                <h2 class="h2">{{ part.title }}</h2>
                <div class="prose"><fc-rich-text [value]="part.body" /></div>
              </div>
              @if (storyPhotos()[i]; as img) {
                <fc-photo class="part__img" [ratio]="img.width + '/' + img.height" [image]="img" sizes="(max-width: 860px) 100vw, 45vw" />
              }
            </article>
          }
        </div>
      </div>
    </section>

    @if (galleryPhotos().length) {
      <section class="band band--surface tone-surface" aria-labelledby="gallery-title">
        <div class="wrap">
          <h2 class="h2 gallery__title" id="gallery-title">{{ t().project.gallery[0] }} <em class="accent">{{ t().project.gallery[1] }}</em></h2>
          <ul class="gallery">
            @for (img of galleryPhotos(); track img.src) {
              <li data-reveal>
                <fc-photo [ratio]="img.width + '/' + img.height" [image]="img" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              </li>
            }
          </ul>
        </div>
      </section>
    }
  `,
  styles: `
    :host { display: block; }
    .intro { padding-bottom: 0; }
    .lead {
      font-family: var(--font-display); font-weight: 500; font-size: clamp(28px, 3vw, 44px);
      line-height: 1.08; letter-spacing: -0.035em; color: var(--fg); text-wrap: balance; max-width: 24ch;
    }
    .facts { margin: 0; display: grid; gap: 0; border-top: 1px solid var(--ln); }
    .facts > div { display: grid; grid-template-columns: minmax(110px, 1fr) 2fr; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--ln); }
    dt { font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mu); padding-top: 3px; }
    dd { margin: 0; font-size: 17px; line-height: 1.45; }
    .facts__links { display: flex; flex-direction: column; gap: 6px; }

    .story { display: flex; flex-direction: column; gap: clamp(48px, 7vw, 104px); padding: clamp(56px, 7vw, 104px) 0 var(--section-pad); }
    .part { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: clamp(28px, 5vw, 80px); align-items: center; }
    .part--flip .part__txt { order: 2; }
    .part--solo { grid-template-columns: minmax(0, 1fr); max-width: 820px; }
    .part--solo .part__txt { order: 0; }
    .part__txt { display: flex; flex-direction: column; gap: 18px; }
    .part__n { font-family: var(--font-serif); font-style: italic; font-size: 26px; line-height: 1; color: var(--ac); }
    .part__img { border-radius: 28px; max-height: 640px; }
    @media (max-width: 860px) {
      .part { grid-template-columns: 1fr; }
      .part--flip .part__txt { order: 0; }
      .part__img { max-height: 460px; }
    }

    .gallery__title { margin-bottom: clamp(28px, 3.4vw, 44px); }
    .gallery { list-style: none; margin: 0; padding: 0; columns: 3 280px; column-gap: 16px; }
    .gallery li { break-inside: avoid; margin-bottom: 16px; }
    .gallery fc-photo { border-radius: 20px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStory {
  protected readonly t = inject(SiteStore).t;
  readonly project = input.required<Project>();
  /** Cover = hero; the next photos illustrate the story, the rest form the gallery. */
  protected readonly storyPhotos = computed(() => this.project().gallery.slice(1, 1 + this.project().story.length));
  protected readonly galleryPhotos = computed(() => this.project().gallery.slice(1 + this.project().story.length));
}
