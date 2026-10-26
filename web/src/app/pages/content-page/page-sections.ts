import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Page, Section } from '../../core/content/content.models';
import { LeafIcon } from '../../shared/icons';
import {
  BentoSectionComponent,
  CardsSectionComponent,
  FeatureSectionComponent,
  GroupsSectionComponent,
  ProfilesSectionComponent,
  RegionsSectionComponent,
  StepsSectionComponent,
  TableSectionComponent,
  TextSectionComponent,
} from '../../sections/content-sections';
import {
  CaseStudiesSectionComponent,
  FiguresSectionComponent,
  LegalSectionComponent,
  LogosSectionComponent,
  TeamSectionComponent,
  TimelineSectionComponent,
} from '../../sections/data-sections';
import { FaqSectionComponent } from '../../sections/faq-section';
import { QuoteForm } from '../../sections/quote-form/quote-form';

export interface SectionRow {
  section: Section;
  surface: boolean;
  /** Dark section following a dark section: separated by the leaf divider instead of padding. */
  tight: boolean;
  num: number;
}

const UNNUMBERED = new Set<Section['_type']>(['sectionProfiles', 'sectionLegal', 'sectionQuoteForm']);

/**
 * Background rhythm of the design (`rhythm()` in design/build/gen-v5.js):
 * cream bands alternate with dark ones; `tone` forces a background; two
 * consecutive dark sections get a leaf divider.
 */
export function sectionRows(sections: Section[], startDark: boolean): SectionRow[] {
  let prev = false;
  let lastDark = startDark;
  let num = 0;
  return sections.map((section, i) => {
    let surface: boolean;
    if (section.tone === 'surface') surface = true;
    else if (section.tone === 'dark') surface = false;
    else {
      surface = !prev;
      if (surface && sections[i + 1]?.tone === 'surface') surface = false;
    }
    const tight = !surface && lastDark;
    prev = surface;
    lastDark = !surface;
    const hasHead = !UNNUMBERED.has(section._type) && !!section.title;
    return { section, surface, tight, num: hasHead ? ++num : 0 };
  });
}

@Component({
  selector: 'fc-page-sections',
  imports: [
    LeafIcon,
    ProfilesSectionComponent,
    CardsSectionComponent,
    BentoSectionComponent,
    FeatureSectionComponent,
    GroupsSectionComponent,
    TableSectionComponent,
    StepsSectionComponent,
    TextSectionComponent,
    RegionsSectionComponent,
    FaqSectionComponent,
    CaseStudiesSectionComponent,
    LogosSectionComponent,
    TeamSectionComponent,
    FiguresSectionComponent,
    TimelineSectionComponent,
    LegalSectionComponent,
    QuoteForm,
  ],
  templateUrl: './page-sections.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSections {
  readonly page = input.required<Page>();
  protected readonly rows = computed(() => {
    const p = this.page();
    // The direct-answer band is dark; plain intros (FAQ, quote) have no band of their own.
    const startDark = !['home', 'about', 'faq', 'quote'].includes(p.template) && p.answer.length > 0;
    return sectionRows(p.sections, startDark);
  });
  protected readonly faqPage = computed(() => this.page().template === 'faq');
  protected readonly outdoor = computed(() => !!this.page().outdoor);
}
