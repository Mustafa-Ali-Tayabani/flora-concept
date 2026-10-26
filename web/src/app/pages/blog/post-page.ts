import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../core/content/content.models';
import { FxService } from '../../core/fx/fx.service';
import { SeoService } from '../../core/seo/seo.service';
import { rememberOrigin } from '../../core/site/origin';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { CtaButtons } from '../../shared/cta-buttons';
import { Photo } from '../../shared/photo';
import { RichTextComponent } from '../../shared/rich-text/rich-text';
import { FinalCta } from '../content-page/final-cta';

/**
 * Article template (posts are delivered in a later batch). Direct answer as plain
 * text at the top, visible FAQ, author box linked to /qui-sommes-nous/.
 */
@Component({
  selector: 'fc-post-page',
  imports: [RouterLink, DatePipe, AccentTitle, CtaButtons, Photo, RichTextComponent, FinalCta],
  template: `
    @let p = post();
    <article>
      <header class="head">
        <div class="wrap head__inner">
          <nav aria-label="Fil d'Ariane" class="crumb">
            <a routerLink="/">Accueil</a> <span aria-hidden="true">/</span> <a routerLink="/blog/">Blog</a>
          </nav>
          <h1 class="h1" id="page-title"><fc-accent [text]="p.title" /></h1>
          <p class="small">
            Publié le <time [attr.datetime]="p.pubDate">{{ p.pubDate | date: 'd MMMM y' : undefined : 'fr' }}</time>
            · par <a class="link" routerLink="/qui-sommes-nous/">{{ p.author?.name ?? "L'équipe Flora Concept" }}</a>
          </p>
        </div>
      </header>
      <div class="wrap body">
        <div class="prose answer"><fc-rich-text [value]="p.answer" /></div>
        <fc-cta-buttons />
        @if (p.image) { <fc-photo class="cover" ratio="16/9" [image]="p.image" [priority]="true" sizes="(max-width: 860px) 100vw, 60vw" /> }
        <div class="prose"><fc-rich-text [value]="p.body" /></div>
        @if (p.faq?.length) {
          <section class="faq" aria-labelledby="post-faq">
            <h2 class="h2" id="post-faq">Questions <em class="accent">fréquentes</em></h2>
            @for (f of p.faq; track f._key) {
              <div class="faq__item"><h3 class="h3">{{ f.question }}</h3><div class="prose prose--muted"><fc-rich-text [value]="f.answer" /></div></div>
            }
          </section>
        }
        <aside class="author" aria-label="Auteur">
          @if (p.author?.photo) { <fc-photo class="author__img" ratio="1/1" [image]="p.author!.photo" sizes="20vw" /> }
          <div>
            <p class="author__name">{{ p.author?.name ?? "L'équipe Flora Concept" }}</p>
            @if (p.author?.role) { <p class="small">{{ p.author!.role }}</p> }
            <a class="link small" routerLink="/qui-sommes-nous/">Qui sommes-nous</a>
          </div>
        </aside>
      </div>
    </article>
    <fc-final-cta line="Votre devis gratuit en une minute" />
  `,
  styles: `
    .head { padding: calc(var(--header-h) + 48px) 0 32px; }
    .head__inner { display: flex; flex-direction: column; gap: 20px; max-width: 980px; --ac: var(--lime); }
    .crumb { display: flex; gap: 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; }
    .crumb a { color: rgba(241, 236, 225, 0.75); }
    .body { max-width: 860px; display: flex; flex-direction: column; gap: 32px; padding-bottom: 48px; }
    .answer { font-size: 19px; }
    .cover { border-radius: 28px; }
    .faq { display: flex; flex-direction: column; gap: 24px; }
    .faq__item { display: flex; flex-direction: column; gap: 10px; }
    .author { display: flex; align-items: center; gap: 18px; padding: 22px; border-radius: 24px; background: var(--sf); border: 1px solid var(--ln); }
    .author__img { width: 72px; border-radius: 50%; flex-shrink: 0; }
    .author__name { font-family: var(--font-display); font-weight: 500; font-size: 19px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPage {
  private readonly site = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly fx = inject(FxService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly post = input.required<Post>();

  constructor() {
    effect(() => {
      const post = this.post();
      this.site.page.set(null);
      this.seo.forPost(post, this.site.settings());
      if (this.browser) {
        rememberOrigin({ slug: `/blog/${post.slug}/`, zone: '' });
        this.fx.scan();
      }
    });
  }
}
