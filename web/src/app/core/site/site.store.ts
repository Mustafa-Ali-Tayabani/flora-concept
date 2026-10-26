import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ContentService } from '../content/content.service';
import { Page, SiteSettings, Zone } from '../content/content.models';

const ZONE_LABEL: Record<Exclude<Zone, ''>, string> = {
  marseille: 'Marseille et Provence',
  nice: "Nice et Côte d'Azur",
  paris: 'Paris et Île-de-France',
};

/** App-wide state: site settings (loaded once before bootstrap) and the current page. */
@Injectable({ providedIn: 'root' })
export class SiteStore {
  private readonly content = inject(ContentService);

  private readonly _settings = signal<SiteSettings | null>(null);
  readonly settings = computed(() => {
    const s = this._settings();
    if (!s) throw new Error('Site settings not loaded');
    return s;
  });

  readonly page = signal<Page | null>(null);
  readonly zone = computed<Zone>(() => this.page()?.zone ?? '');
  readonly phone = computed(() => this.settings().phones.default);
  readonly menuOpen = signal(false);

  async load(): Promise<void> {
    this._settings.set(await firstValueFrom(this.content.settings()));
  }

  zoneLabel(zone: Zone): string {
    return zone ? ZONE_LABEL[zone] : "Provence-Alpes-Côte d'Azur ou Île-de-France";
  }
}
