import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Splits a heading into « body » + italic serif accent on the last word, as in the
 * design (`accent()` in design/build/gen-v5.js). Words of 3 letters or fewer are
 * kept with the previous word; trailing punctuation stays upright.
 */
export function splitAccent(text: string): { pre: string; last: string; punct: string } {
  const pm = text.match(/^(.*?)(\s*[?!.:]+)$/);
  const body = pm ? pm[1] : text;
  const punct = pm ? pm[2] : '';
  const m = body.match(/^(.*\S)\s+(\S+)$/);
  if (!m) return { pre: '', last: '', punct: '' };
  let [, pre, last] = m;
  if (last.length <= 3) {
    const m2 = pre.match(/^(.*\S)\s+(\S+)$/);
    if (m2) {
      pre = m2[1];
      last = `${m2[2]} ${last}`;
    }
  }
  return { pre, last, punct };
}

@Component({
  selector: 'fc-accent',
  template: `@let p = parts();
    @if (p.last) {
      {{ p.pre }} <em class="accent">{{ p.last }}</em>{{ p.punct }}
    } @else {
      {{ text() }}
    }`,
  styles: `:host { display: contents; } em { white-space: nowrap; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccentTitle {
  readonly text = input.required<string>();
  protected readonly parts = computed(() => splitAccent(this.text()));
}
