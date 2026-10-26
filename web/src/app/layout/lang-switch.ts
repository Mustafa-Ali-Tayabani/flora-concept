import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANGS, Lang, UI } from '../core/i18n/i18n';
import { SiteStore } from '../core/site/site.store';

/**
 * FR | EN switch. Links to the same page in the other language (hreflang
 * alternates), or to that language's home page when there is no counterpart.
 */
@Component({
  selector: 'fc-lang-switch',
  imports: [RouterLink],
  template: `
    <nav class="lang" [attr.aria-label]="site.t().langSwitch.label">
      @for (l of links(); track l.lang) {
        <a
          [routerLink]="l.href"
          [attr.hreflang]="l.lang"
          [attr.lang]="l.lang"
          [attr.aria-current]="l.current ? 'true' : null"
          [attr.title]="l.name"
          [class.is-on]="l.current"
          >{{ l.lang.toUpperCase() }}</a
        >
      }
    </nav>
  `,
  styles: `
    .lang { display: flex; align-items: center; gap: 2px; padding: 3px; border-radius: 999px; border: 1px solid rgba(241, 236, 225, 0.22); }
    a {
      display: inline-flex; align-items: center; justify-content: center; min-width: 40px; min-height: 40px; padding: 0 8px;
      border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; color: rgba(241, 236, 225, 0.75);
      transition: background 0.2s, color 0.2s;
    }
    a:hover { color: var(--cream); }
    a.is-on { background: var(--cream); color: var(--forest); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitch {
  protected readonly site = inject(SiteStore);
  protected readonly links = computed(() => {
    const current = this.site.lang();
    const alternates = this.site.page()?.alternates ?? {};
    return LANGS.map((lang: Lang) => ({
      lang,
      name: UI[current].langSwitch[lang],
      current: lang === current,
      href: alternates[lang] ?? UI[lang].routes.home,
    }));
  });
}
