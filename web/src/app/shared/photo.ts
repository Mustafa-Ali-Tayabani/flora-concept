import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImageRef } from '../core/content/content.models';

/**
 * Cover-fitted responsive photo (NgOptimizedImage: srcset, lazy loading, and
 * `priority` = eager + fetchpriority=high + preload for the LCP hero).
 * Without an image it renders the neutral placeholder block of the design.
 */
@Component({
  selector: 'fc-photo',
  imports: [NgOptimizedImage],
  host: { class: 'media', '[style.aspect-ratio]': 'ratio()' },
  template: `
    @if (image(); as img) {
      <img [ngSrc]="img.src" fill [sizes]="sizes()" [alt]="alt() ?? img.alt" [priority]="priority()" [loading]="priority() ? undefined : loading()"
        [style.object-position]="img.position || position()" />
    }
    <ng-content />
  `,
  styles: `:host { display: block; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Photo {
  readonly image = input<ImageRef | undefined>();
  readonly sizes = input('(max-width: 860px) 100vw, 50vw');
  readonly ratio = input<string | null>(null);
  readonly priority = input(false);
  /** `eager` for above-the-fold images that are not the LCP element. */
  readonly loading = input<'lazy' | 'eager'>('lazy');
  /** Overrides the content alt (`''` = decorative). */
  readonly alt = input<string | undefined>(undefined);
  readonly position = input('50% 50%');
}
