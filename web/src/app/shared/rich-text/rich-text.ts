import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RichText } from '../../core/content/content.models';
import { SiteStore } from '../../core/site/site.store';
import { InlineRun, toNodes } from './portable-text';

/**
 * Renders Portable Text as semantic HTML (p, h3, ul/ol, strong, em, a).
 * Text is always interpolated, never bound as HTML: content cannot inject markup.
 */
@Component({
  selector: 'fc-rich-text',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (inline()) {
      @for (node of nodes(); track node.key; let first = $first) {
        @if (node.kind === 'p' || node.kind === 'h3') { {{ first ? '' : ' ' }}<ng-container *ngTemplateOutlet="runsTpl; context: { $implicit: node.runs }" />}
      }
    } @else {
    @for (node of nodes(); track node.key) {
      @switch (node.kind) {
        @case ('h3') {
          <h3 class="h3"><ng-container *ngTemplateOutlet="runsTpl; context: { $implicit: node.runs }" /></h3>
        }
        @case ('ul') {
          <ul class="rt-list">
            @for (it of node.items; track it.key) {
              <li><span><ng-container *ngTemplateOutlet="runsTpl; context: { $implicit: it.runs }" /></span></li>
            }
          </ul>
        }
        @case ('ol') {
          <ol class="rt-list">
            @for (it of node.items; track it.key) {
              <li><span><ng-container *ngTemplateOutlet="runsTpl; context: { $implicit: it.runs }" /></span></li>
            }
          </ol>
        }
        @default {
          <p [class]="pClass()"><ng-container *ngTemplateOutlet="runsTpl; context: { $implicit: node.runs }" /></p>
        }
      }
    }
    }

    <ng-template #runsTpl let-runs>
      @for (r of runs; track r.key) {
        @switch (r.kind) {
          @case ('pending') {
            <span class="pending">{{ r.text }}</span>
          }
          @case ('zone') {
            <ng-container>{{ zoneLabel() }}</ng-container>
          }
          @default {
            @if (r.path) {
              <a class="link" [routerLink]="r.path" [fragment]="r.fragment"><ng-container *ngTemplateOutlet="text; context: { $implicit: r }" /></a>
            } @else if (r.href) {
              <a class="link" [href]="r.href" [attr.target]="external(r) ? '_blank' : null" [attr.rel]="external(r) ? 'noopener noreferrer' : null"><ng-container *ngTemplateOutlet="text; context: { $implicit: r }" /></a>
            } @else if (r.action) {
              <button type="button" class="rt-action" data-action="manage-cookies"><ng-container *ngTemplateOutlet="text; context: { $implicit: r }" /></button>
            } @else {
              <ng-container *ngTemplateOutlet="text; context: { $implicit: r }" />
            }
          }
        }
      }
    </ng-template>

    <ng-template #text let-r>@if (r.strong) {<strong>{{ r.text }}</strong>} @else if (r.em) {<em>{{ r.text }}</em>} @else {{{ r.text }}}</ng-template>
  `,
  styles: `
    :host { display: contents; }
    strong { font-weight: 600; }
    .rt-action {
      background: none; border: 0; padding: 0; font: inherit; color: inherit; cursor: pointer;
      text-decoration: underline; text-decoration-color: var(--lime-brand); text-decoration-thickness: 2px; text-underline-offset: 3px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextComponent {
  private readonly site = inject(SiteStore);
  readonly value = input<RichText | undefined | null>();
  /** Zone shown by the `{{zone}}` variable (quote confirmation). */
  readonly zone = input<string>('');
  readonly pClass = input<string>('');
  /** Renders paragraphs as phrasing content (inside headings, table cells, spans). */
  readonly inline = input(false);
  protected readonly nodes = computed(() => toNodes(this.value()));
  protected readonly zoneLabel = computed(() => this.site.zoneLabel((this.zone() || '') as never));
  protected external(r: InlineRun): boolean {
    return !!r.href?.startsWith('https:');
  }
}
