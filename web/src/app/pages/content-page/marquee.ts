import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Lime scrolling band under the home hero (decorative: words repeat, hidden from AT). */
@Component({
  selector: 'fc-marquee',
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        @for (w of loop(); track $index; let i = $index) {
          <span class="marquee__item">
            {{ w }}
            <svg width="0.9em" height="0.9em" viewBox="0 0 48 48" fill="none" stroke="#3d5a40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
              @switch (i % 3) {
                @case (0) { <path d="M24 4L12 20h6L9 32h10l-7 8h24l-7-8h10l-9-12h6Z" /><path d="M24 40v5" /> }
                @case (1) { <circle cx="24" cy="18" r="13" /><path d="M24 45V22M24 30l-6-6M24 27l5-5" /> }
                @default { <path d="M24 45V26" /><path d="M24 26c-9 1-15-5-15-12 6-1 12 2 15 8M24 26c9 1 15-5 15-12-6-1-12 2-15 8M24 22c-3-7-1-13 0-17 1 4 3 10 0 17" /> }
              }
            </svg>
          </span>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .marquee {
      background: var(--lime); color: var(--forest); overflow: hidden;
      padding: clamp(18px, 2vw, 28px) 0; margin: var(--band-margin); border-radius: 999px;
    }
    .marquee__track {
      display: flex; gap: 48px; width: max-content; padding-left: 48px;
      font-family: var(--font-display); font-size: clamp(28px, 4vw, 60px); font-weight: 500;
      letter-spacing: -0.04em; white-space: nowrap; line-height: 1.1;
      animation: flora-marquee 38s linear infinite;
    }
    .marquee__item { display: flex; align-items: center; gap: 48px; }
    svg { flex-shrink: 0; }
    @media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Marquee {
  readonly words = input.required<string[]>();
  /** Two copies so the -50% translation loops seamlessly. */
  protected readonly loop = computed(() => [...this.words(), ...this.words()]);
}
