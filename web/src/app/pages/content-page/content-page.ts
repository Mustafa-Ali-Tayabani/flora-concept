import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, effect, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Page } from '../../core/content/content.models';
import { FxService } from '../../core/fx/fx.service';
import { SeoService } from '../../core/seo/seo.service';
import { rememberOrigin } from '../../core/site/origin';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { CtaButtons } from '../../shared/cta-buttons';
import { LeafIcon } from '../../shared/icons';
import { RichTextComponent } from '../../shared/rich-text/rich-text';
import { CardGrid } from '../../sections/content-sections';
import { BlogList } from '../blog/blog-list';
import { FinalCta } from './final-cta';
import { HomeHero, PageHero } from './heroes';
import { Marquee } from './marquee';
import { PageSections } from './page-sections';
import { SeasonalBanner } from './seasonal-banner';

/** Renders any CMS page; the template (home, hub, service, …) picks the layout. */
@Component({
  selector: 'fc-content-page',
  imports: [
    HomeHero,
    PageHero,
    PageSections,
    Marquee,
    SeasonalBanner,
    FinalCta,
    CardGrid,
    RouterLink,
    LeafIcon,
    AccentTitle,
    CtaButtons,
    RichTextComponent,
    BlogList,
  ],
  templateUrl: './content-page.html',
  styleUrl: './content-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPage {
  private readonly site = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly fx = inject(FxService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Bound from the route resolver (withComponentInputBinding). */
  readonly page = input.required<Page>();

  protected readonly settings = this.site.settings;
  protected readonly t = this.site.t;
  protected readonly template = computed(() => this.page().template);
  /** G5 is the last band of every page except quote, legal and 404. */
  protected readonly finalCta = computed(() => !['quote', 'legal', 'notFound'].includes(this.template()));
  protected readonly faqJump = computed(() =>
    this.template() === 'faq' ? this.page().sections.filter((s) => s.anchor && s.title).map((s) => ({ id: s.anchor!, title: s.title! })) : [],
  );

  constructor() {
    effect(() => {
      const page = this.page();
      this.site.page.set(page);
      this.seo.forPage(page, this.site.settings());
      if (this.browser) {
        if (page.template !== 'quote') rememberOrigin({ slug: page.slug, zone: page.zone });
        this.fx.scan();
      }
    });
  }
}
