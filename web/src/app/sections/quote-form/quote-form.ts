import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { QuoteFormSection, Zone } from '../../core/content/content.models';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { readOrigin } from '../../core/site/origin';
import { SiteStore } from '../../core/site/site.store';
import { LeafIcon, PhoneIcon } from '../../shared/icons';
import { Photo } from '../../shared/photo';
import { RichTextComponent } from '../../shared/rich-text/rich-text';
import { AccentTitle } from '../../shared/accent-title';

type Field = 'nom' | 'contact' | 'besoin';
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function contactIsValid(v: string): boolean {
  return EMAIL.test(v) || v.replace(/\D/g, '').length >= 10;
}

/** S15 quote form + S16 phone block. Server rules live in server/api/devis.php. */
@Component({
  selector: 'fc-quote-form',
  imports: [LeafIcon, PhoneIcon, Photo, RichTextComponent, AccentTitle],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteForm {
  private readonly http = inject(HttpClient);
  private readonly analytics = inject(AnalyticsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly site = inject(SiteStore);

  readonly section = input.required<QuoteFormSection>();

  protected readonly zones: { value: Exclude<Zone, ''>; label: string }[] = [
    { value: 'marseille', label: 'Marseille et Provence' },
    { value: 'nice', label: "Nice et Côte d'Azur" },
    { value: 'paris', label: 'Paris et Île-de-France' },
  ];

  protected readonly zone = signal<Zone>('');
  protected readonly errors = signal<Partial<Record<Field | 'server', string>>>({});
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly phone = computed(() => this.site.phone());
  private source = '';
  private started = false;
  private readonly openedAt = Date.now();

  constructor() {
    afterNextRender(() => {
      const origin = readOrigin();
      if (origin) {
        this.source = origin.slug;
        if (origin.zone) this.zone.set(origin.zone);
      }
    });
  }

  protected start(): void {
    if (this.started) return;
    this.started = true;
    this.analytics.push('devis_start', { zone: this.zone() });
  }

  protected async submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    if (this.sending() || !this.browser) return;
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? '').trim();
    const msgs = this.section().errors;

    const errors: Partial<Record<Field, string>> = {};
    if (!value('nom')) errors.nom = msgs.nom;
    if (!contactIsValid(value('contact'))) errors.contact = msgs.contact;
    if (!value('besoin')) errors.besoin = msgs.besoin;
    this.errors.set(errors);
    const first = (Object.keys(errors) as Field[])[0];
    if (first) {
      form.querySelector<HTMLElement>(`#f-${first}`)?.focus();
      return;
    }

    this.sending.set(true);
    try {
      await firstValueFrom(
        this.http.post(this.site.settings().quoteEndpoint, {
          nom: value('nom'),
          contact: value('contact'),
          besoin: value('besoin'),
          zone: this.zone(),
          source: this.source,
          website: value('website'),
          elapsed: Date.now() - this.openedAt,
        }),
      );
      this.sent.set(true);
      this.analytics.push('devis_submit', { zone: this.zone(), origin: this.source });
      this.host.nativeElement.scrollIntoView({ block: 'start' });
    } catch (e) {
      const status = e instanceof HttpErrorResponse ? e.status : 0;
      const fieldErrors = e instanceof HttpErrorResponse ? (e.error?.errors as Partial<Record<Field, boolean>> | undefined) : undefined;
      if (status === 422 && fieldErrors) {
        this.errors.set(Object.fromEntries((Object.keys(fieldErrors) as Field[]).map((k) => [k, msgs[k]])));
      } else {
        this.errors.set({ server: status === 429 ? msgs.rateLimit : msgs.server });
      }
    } finally {
      this.sending.set(false);
    }
  }
}
