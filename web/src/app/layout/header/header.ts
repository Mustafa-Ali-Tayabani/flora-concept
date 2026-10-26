import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavGroup } from '../../core/content/content.models';
import { SiteStore } from '../../core/site/site.store';
import { AccentTitle } from '../../shared/accent-title';
import { ChevronIcon, LeafIcon } from '../../shared/icons';
import { Photo } from '../../shared/photo';
import { LangSwitch } from '../lang-switch';

/**
 * G1 · header. Desktop: single row, mega dropdowns on hover/focus/click.
 * Phone and tablet: burger opening a full-height panel (groups expanded, quote
 * button visible). Keyboard: Escape closes, focus returns to the trigger.
 */
@Component({
  selector: 'fc-header',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, ChevronIcon, LeafIcon, Photo, AccentTitle, LangSwitch],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: { '(document:keydown.escape)': 'closeAll()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly site = inject(SiteStore);
  protected readonly t = this.site.t;
  protected readonly nav = computed(() => this.site.settings().nav);
  protected readonly logo = computed(() => this.site.settings().logo);
  protected readonly open = signal<NavGroup['key'] | null>(null);
  protected readonly menuOpen = this.site.menuOpen;
  private readonly burger = viewChild<ElementRef<HTMLButtonElement>>('burger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly hdr = viewChild.required<ElementRef<HTMLElement>>('hdr');
  private readonly desk = viewChild.required<ElementRef<HTMLElement>>('desk');
  private readonly deskList = viewChild.required<ElementRef<HTMLElement>>('deskList');

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
    afterNextRender(() => this.watchFit());
  }

  /**
   * Switches to the burger whenever the desktop menu does not fit its row
   * (translated labels, browser zoom, larger fonts), not only below 1240px.
   * Direct class toggling keeps the measurement synchronous.
   */
  private watchFit(): void {
    const hdr = this.hdr().nativeElement;
    const nav = this.desk().nativeElement;
    const list = this.deskList().nativeElement;
    const check = () => {
      if (!this.doc.defaultView?.matchMedia('(min-width: 1241px)').matches) return hdr.classList.remove('is-compact');
      hdr.classList.remove('is-compact');
      hdr.classList.toggle('is-compact', list.scrollWidth > nav.clientWidth + 1);
    };
    const ro = new ResizeObserver(check);
    ro.observe(hdr);
    const mo = new MutationObserver(check);
    mo.observe(list, { subtree: true, childList: true, characterData: true });
    this.doc.fonts?.ready.then(check);
    check();
    this.destroyRef.onDestroy(() => (ro.disconnect(), mo.disconnect()));
  }

  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private hoverOpenedAt = 0;

  /** Mouse enters a menu item (or its panel): open it, cancel any pending close. */
  protected hoverOpen(key: NavGroup['key']): void {
    clearTimeout(this.closeTimer);
    if (this.open() !== key) this.hoverOpenedAt = Date.now();
    this.open.set(key);
  }

  /** Mouse leaves: close after a short delay, so crossing the gap to the panel never closes it. */
  protected hoverClose(key: NavGroup['key']): void {
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      if (this.open() === key) this.open.set(null);
    }, 300);
  }

  protected toggle(key: NavGroup['key']): void {
    // A click right after hover-opening means « open », not « close » (mouse users click the label).
    if (this.open() === key && Date.now() - this.hoverOpenedAt < 600) return;
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
