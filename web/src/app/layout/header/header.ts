import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavGroup } from '../../core/content/content.models';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { ChevronIcon, LeafIcon } from '../../shared/icons';
import { Photo } from '../../shared/photo';

/**
 * G1 · header. Desktop: single row, mega dropdowns on hover/focus/click.
 * Phone and tablet: burger opening a full-height panel (groups expanded, quote
 * button visible). Keyboard: Escape closes, focus returns to the trigger.
 */
@Component({
  selector: 'fc-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, ChevronIcon, LeafIcon, Photo, AccentTitle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'closeAll()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly doc = inject(DOCUMENT);
  protected readonly site = inject(SiteStore);
  protected readonly nav = computed(() => this.site.settings().nav);
  protected readonly logo = computed(() => this.site.settings().logo);
  protected readonly open = signal<NavGroup['key'] | null>(null);
  protected readonly menuOpen = this.site.menuOpen;
  private readonly burger = viewChild<ElementRef<HTMLButtonElement>>('burger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.open.set(null);
        this.menuOpen.set(false);
      });
    effect(() => {
      // Lock page scroll behind the mobile panel.
      this.doc.documentElement.style.overflow = this.menuOpen() ? 'hidden' : '';
      if (this.menuOpen()) queueMicrotask(() => this.panel()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus());
    });
  }

  protected toggle(key: NavGroup['key']): void {
    this.open.update((k) => (k === key ? null : key));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (!this.menuOpen()) this.burger()?.nativeElement.focus();
  }

  protected onFocusOut(e: FocusEvent, key: NavGroup['key']): void {
    const to = e.relatedTarget as Node | null;
    if (!to || !(e.currentTarget as HTMLElement).contains(to)) {
      if (this.open() === key) this.open.set(null);
    }
  }

  protected closeAll(): void {
    if (this.menuOpen()) this.toggleMenu();
    this.open.set(null);
  }
}
