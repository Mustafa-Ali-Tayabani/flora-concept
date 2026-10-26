import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContentService } from '../content/content.service';
import { Page, SiteSettings, Zone } from '../content/content.models';
import { DEFAULT_LANG, Lang, UI, langFromPath } from '../i18n/i18n';

/**
 * App-wide state: current language, site settings per language (loaded on
 * demand, before the page that needs them renders) and the current page.
 */
@Injectable({ providedIn: 'root' })
export class SiteStore {
  private readonly content = inject(ContentService);
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>(DEFAULT_LANG);
  private readonly settingsByLang = signal<Partial<Record<Lang, SiteSettings>>>({});
  readonly settings = computed(() => {
    const s = this.settingsByLang()[this.lang()] ?? this.settingsByLang()[DEFAULT_LANG];
    if (!s) throw new Error('Site settings not loaded');
    return s;
  });
  /** Interface strings of the current language. */
  readonly t = computed(() => UI[this.lang()]);

  readonly page = signal<Page | null>(null);
  readonly zone = computed<Zone>(() => this.page()?.zone ?? '');
  readonly phone = computed(() => this.settings().phones.default);
  readonly menuOpen = signal(false);

  /** Bootstrap: settings of the language of the requested URL. */
  async load(): Promise<void> {
    await this.useLang(langFromPath(this.doc.location?.pathname ?? '/'));
  }

  /** Loads the settings of `lang` if needed, then switches to it. */
  async useLang(lang: Lang): Promise<void> {
    if (!this.settingsByLang()[lang]) {
      const s = await firstValueFrom(this.content.settings(lang));
      this.settingsByLang.update((m) => ({ ...m, [lang]: s }));
    }
    this.lang.set(lang);
  }

  zoneLabel(zone: Zone): string {
    const z = this.t().zones;
    return zone ? z[zone] : z.none;
  }
}
