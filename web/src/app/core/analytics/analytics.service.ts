import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { SiteStore } from '../site/site.store';

/**
 * Conversion events for GA4 / GTM. Events are only pushed to the local
 * `dataLayer` array: nothing leaves the browser unless GTM was loaded after
 * consent (see ConsentService).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly site = inject(SiteStore);

  init(): void {
    if (!this.browser) return;
    // Delegated: tel: links also live in non-hydrated, server-rendered sections.
    this.doc.addEventListener('click', (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (link) this.push('call_click', { zone: link.getAttribute('data-zone') || this.site.zone() });
    });
  }

  push(event: 'call_click' | 'devis_start' | 'devis_submit', params: Record<string, string> = {}): void {
    if (!this.browser) return;
    const w = this.doc.defaultView as Window;
    (w.dataLayer = w.dataLayer || []).push({ event, source: this.site.page()?.slug ?? this.doc.location.pathname, ...params });
  }
}
