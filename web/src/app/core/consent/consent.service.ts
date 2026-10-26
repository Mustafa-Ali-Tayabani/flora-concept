import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { SiteStore } from '../site/site.store';

export interface ConsentChoice {
  /** GA4 audience measurement (via GTM). */
  analytics: boolean;
  /** Microsoft Clarity (via GTM). */
  ergonomics: boolean;
}

const STORAGE_KEY = 'fc_consent';
/** Consent is asked again after 6 months (CNIL recommendation). */
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;

type Gtag = (...args: unknown[]) => void;

/**
 * Strict Consent Mode v2: no measurement script is requested before the visitor
 * chooses. GTM is injected only after an explicit « accept », with the consent
 * state set before the container loads.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly site = inject(SiteStore);
  private gtmLoaded = false;

  /** `undefined` until read from storage (server render: banner not shown). */
  readonly choice = signal<ConsentChoice | null | undefined>(undefined);
  readonly bannerOpen = signal(false);
  readonly customizing = signal(false);

  init(): void {
    if (!this.browser) return;
    const stored = this.read();
    this.choice.set(stored);
    this.bannerOpen.set(stored === null);
    if (stored) this.apply(stored);
    // « Gérer les cookies » links rendered from content are plain buttons.
    this.doc.addEventListener('click', (e) => {
      const target = (e.target as Element | null)?.closest?.('[data-action="manage-cookies"]');
      if (target) {
        e.preventDefault();
        this.reopen();
      }
    });
  }

  acceptAll(): void {
    this.save({ analytics: true, ergonomics: true });
  }

  refuseAll(): void {
    this.save({ analytics: false, ergonomics: false });
  }

  save(choice: ConsentChoice): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...choice, at: Date.now() }));
    } catch {
      /* storage blocked: the choice applies to this visit only */
    }
    this.choice.set(choice);
    this.bannerOpen.set(false);
    this.customizing.set(false);
    this.apply(choice);
  }

  reopen(): void {
    this.customizing.set(true);
    this.bannerOpen.set(true);
  }

  private read(): ConsentChoice | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw) as ConsentChoice & { at?: number };
      if (!v.at || Date.now() - v.at > MAX_AGE_MS) return null;
      return { analytics: !!v.analytics, ergonomics: !!v.ergonomics };
    } catch {
      return null;
    }
  }

  private apply(choice: ConsentChoice): void {
    const w = this.doc.defaultView as Window;
    const dl = (w.dataLayer = w.dataLayer || []);
    // gtag() must push the `arguments` object for Consent Mode commands.
    const gtag: Gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      dl.push(arguments);
    };
    const granted = (on: boolean) => (on ? 'granted' : 'denied');
    const state = {
      analytics_storage: granted(choice.analytics),
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    };
    if (!this.gtmLoaded) gtag('consent', 'default', { ...state, wait_for_update: 0 });
    else gtag('consent', 'update', state);
    dl.push({ event: 'consent_update', consent_analytics: choice.analytics, consent_ergonomics: choice.ergonomics });

    const gtmId = this.site.settings().analytics.gtmId;
    if ((choice.analytics || choice.ergonomics) && gtmId && /^GTM-[A-Z0-9]+$/.test(gtmId) && !this.gtmLoaded) {
      this.gtmLoaded = true;
      dl.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const s = this.doc.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      this.doc.head.appendChild(s);
    }
  }
}
