import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../core/consent/consent.service';
import { SiteStore } from '../core/site/site.store';

/**
 * G7 · consent banner: three buttons of equal visual weight, no dark pattern.
 * Never part of the server render (consent is read in the browser), so it
 * cannot become the LCP element nor shift content.
 */
@Component({
  selector: 'fc-cookie-banner',
  imports: [RouterLink],
  template: `
    @if (consent.bannerOpen()) {
      <div class="ck" role="dialog" aria-labelledby="ck-text" aria-modal="false">
        <p id="ck-text">
          {{ t().cookies.text }}
          <a [routerLink]="t().routes.cookies">{{ t().cookies.policy }}</a>
        </p>
        @if (consent.customizing()) {
          <fieldset class="ck__opts">
            <legend class="visually-hidden">{{ t().cookies.choices }}</legend>
            <label><input type="checkbox" checked disabled /> {{ t().cookies.necessary }}</label>
            <label><input type="checkbox" [checked]="analytics()" (change)="analytics.set(!analytics())" /> {{ t().cookies.analytics }}</label>
            <label><input type="checkbox" [checked]="ergonomics()" (change)="ergonomics.set(!ergonomics())" /> {{ t().cookies.ergonomics }}</label>
          </fieldset>
        }
        <div class="ck__btns">
          <button type="button" (click)="consent.acceptAll()">{{ t().cookies.acceptAll }}</button>
          <button type="button" (click)="consent.refuseAll()">{{ t().cookies.refuseAll }}</button>
          @if (consent.customizing()) {
            <button type="button" (click)="consent.save({ analytics: analytics(), ergonomics: ergonomics() })">{{ t().cookies.save }}</button>
          } @else {
            <button type="button" (click)="customize()">{{ t().cookies.customize }}</button>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .ck {
      position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 70; max-width: 640px; margin: 0 auto; padding: 22px;
      background: rgba(18, 32, 26, 0.96); backdrop-filter: blur(20px); color: var(--cream);
      border: 1px solid rgba(241, 236, 225, 0.14); border-radius: 28px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
      display: flex; flex-direction: column; gap: 14px;
    }
    p { font-size: 15px; line-height: 1.55; }
    a { color: var(--lime); text-decoration: underline; }
    .ck__opts { margin: 0; padding: 0; border: 0; display: flex; flex-direction: column; gap: 4px; font-size: 15px; }
    label { display: flex; align-items: center; gap: 10px; min-height: 44px; }
    input { width: 20px; height: 20px; accent-color: var(--lime); }
    .ck__btns { display: flex; flex-wrap: wrap; gap: 8px; }
    /* Equal weight for all three choices (CNIL). */
    button {
      flex: 1; min-width: 140px; min-height: 48px; padding: 0 16px; border-radius: 999px; border: 1px solid rgba(241, 236, 225, 0.4);
      background: transparent; color: var(--cream); font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
    }
    button:hover { background: rgba(241, 236, 225, 0.1); }
    @media (max-width: 1240px) { .ck { bottom: calc(84px + env(safe-area-inset-bottom)); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBanner {
  protected readonly consent = inject(ConsentService);
  protected readonly t = inject(SiteStore).t;
  protected readonly analytics = signal(false);
  protected readonly ergonomics = signal(false);

  protected customize(): void {
    const c = this.consent.choice();
    this.analytics.set(!!c?.analytics);
    this.ergonomics.set(!!c?.ergonomics);
    this.consent.customizing.set(true);
  }
}
