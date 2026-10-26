import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, TransferState, afterNextRender, computed, inject, makeStateKey, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteStore } from '../../core/site/site.store';

const KEY = 'fc_season_closed';
/** Build-time month, so the first client render matches the prerendered HTML. */
const MONTH = makeStateKey<number>('fc-season-month');

export function inSeason(month: number, from: number, to: number): boolean {
  return from <= to ? month >= from && month <= to : month >= from || month <= to;
}

/**
 * S20 · seasonal banner on the home page (October to December by default).
 * Prerendered when the build runs in season; the scheduled Monday/Thursday
 * rebuild switches it on and off. The browser re-checks the month and the
 * visitor's dismissal.
 */
@Component({
  selector: 'fc-seasonal-banner',
  imports: [RouterLink],
  template: `
    @if (visible()) {
      <div class="season">
        <a class="season__link" [routerLink]="cfg().href">
          <span class="season__tag">Saison</span>
          {{ cfg().text }} <span aria-hidden="true">→</span>
        </a>
        <button type="button" class="season__close" aria-label="Fermer le bandeau saisonnier" (click)="close()">✕</button>
      </div>
    }
  `,
  styles: `
    .season {
      margin: var(--band-margin) var(--band-margin) 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
      padding: 8px 8px 8px clamp(20px, 3vw, 32px); border-radius: 999px; background: var(--forest-2); border: 1px solid rgba(214, 226, 107, 0.35);
    }
    .season__link { display: flex; align-items: center; gap: 12px; color: var(--cream); font-size: 15px; min-height: 44px; }
    .season__link:hover { color: var(--lime); }
    .season__tag {
      font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
      background: var(--lime); color: var(--forest); padding: 6px 10px; border-radius: 999px;
    }
    .season__close {
      flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(241, 236, 225, 0.3);
      background: transparent; color: var(--cream); cursor: pointer;
    }
    @media (max-width: 640px) { .season { border-radius: 28px; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonalBanner {
  private readonly site = inject(SiteStore);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly cfg = computed(() => this.site.settings().seasonal);
  private readonly state = inject(TransferState);
  private readonly month = signal(this.state.get(MONTH, new Date().getMonth() + 1));
  private readonly closed = signal(false);
  protected readonly visible = computed(() => {
    const c = this.cfg();
    return c.enabled && !this.closed() && inSeason(this.month(), c.fromMonth, c.toMonth);
  });

  constructor() {
    if (!this.browser) this.state.set(MONTH, this.month());
    afterNextRender(() => {
      this.month.set(new Date().getMonth() + 1);
      try {
        this.closed.set(sessionStorage.getItem(KEY) === '1');
      } catch {
        /* ignore */
      }
    });
  }

  protected close(): void {
    this.closed.set(true);
    if (!this.browser) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
  }
}
