import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';

/**
 * Decorative motion from the approved design: scroll reveal, scroll progress bar,
 * home hero parallax, FAQ reading progress, line-drawn branches, icon wiggle and
 * the cursor dot.
 *
 * Works on plain DOM attributes (`data-reveal`, `data-parallax`, …) so it also
 * animates server-rendered sections that are never hydrated. Progressive only:
 * content is visible without JS, nothing runs under prefers-reduced-motion, and
 * elements already on screen are never hidden (no LCP penalty).
 */
@Injectable({ providedIn: 'root' })
export class FxService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private io?: IntersectionObserver;
  /** Elements waiting to be revealed (also checked on scroll: IO misses elements skipped in one frame). */
  private readonly pending = new Set<HTMLElement>();
  private started = false;
  private reduce = true;

  init(): void {
    if (!this.browser || this.started) return;
    this.started = true;
    const w = this.doc.defaultView!;
    this.reduce = w.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver((entries) => this.onIntersect(entries), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      w.addEventListener('scroll', () => this.onScroll(), { passive: true });
      if (!this.reduce) {
        this.doc.addEventListener('mouseover', (e) => this.wiggle(e));
        if (w.matchMedia('(pointer: fine)').matches) this.cursor();
      }
    });
  }

  /** Call after every navigation, once the new page is in the DOM. */
  scan(): void {
    if (!this.browser || !this.io) return;
    const w = this.doc.defaultView!;
    w.requestAnimationFrame(() => {
      const vh = w.innerHeight;
      if (!this.reduce) {
        this.doc.querySelectorAll<HTMLElement>('[data-reveal]:not(.fx-in):not(.fx-pending)').forEach((el) => {
          // Only hide what is still below the fold.
          if (el.getBoundingClientRect().top > vh * 0.9) {
            el.classList.add('fx-pending');
            this.pending.add(el);
            this.io!.observe(el);
          }
        });
        this.doc.querySelectorAll<SVGSVGElement>('svg[data-draw]:not(.fx-draw)').forEach((svg) => {
          svg.querySelectorAll('path').forEach((p) => p.style.setProperty('--len', String(Math.ceil(p.getTotalLength()))));
          svg.classList.add('fx-draw');
          this.io!.observe(svg);
        });
      }
      this.onScroll();
    });
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    let i = 0;
    for (const e of entries) {
      // Also reveal what was scrolled past (fast scroll, anchor jump): never leave content hidden.
      if (!e.isIntersecting && e.boundingClientRect.top > 0) continue;
      const el = e.target as HTMLElement;
      this.io!.unobserve(el);
      if (el.matches('svg[data-draw]')) {
        el.classList.add('fx-drawn');
        continue;
      }
      el.style.setProperty('--fx-delay', `${i++ * 90}ms`);
      this.reveal(el);
    }
  }

  private reveal(el: HTMLElement): void {
    this.pending.delete(el);
    this.io?.unobserve(el);
    el.classList.replace('fx-pending', 'fx-in');
  }

  private onScroll(): void {
    const w = this.doc.defaultView!;
    const d = this.doc.documentElement;
    const y = w.scrollY;
    const bar = this.doc.querySelector<HTMLElement>('.scroll-progress');
    if (bar) bar.style.transform = `scaleX(${y / Math.max(1, d.scrollHeight - w.innerHeight)})`;
    for (const el of this.pending) {
      if (!el.isConnected) this.pending.delete(el);
      else if (el.getBoundingClientRect().top < w.innerHeight * 0.94) this.reveal(el);
    }
    if (this.reduce) return;
    const p = this.doc.querySelector<HTMLElement>('[data-parallax]');
    if (p && y < w.innerHeight * 1.2) p.style.transform = `translateY(${y * 0.35}px) scale(${1.12 + y * 0.0002})`;
    this.doc.querySelectorAll<HTMLElement>('[data-faqwrap]').forEach((wrap) => {
      const r = wrap.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (w.innerHeight * 0.55 - r.top) / Math.max(1, r.height - w.innerHeight * 0.3)));
      const fill = wrap.querySelector<HTMLElement>('[data-faqbar]');
      if (fill) fill.style.transform = `scaleX(${k})`;
      const n = wrap.querySelectorAll('details').length;
      const count = wrap.querySelector<HTMLElement>('[data-faqcount]');
      if (count && n) count.textContent = `${String(Math.max(1, Math.ceil(k * n))).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    });
  }

  private wiggle(e: Event): void {
    const host = (e.target as Element | null)?.closest?.('a, button');
    const ico = host?.querySelector<SVGElement>(':scope > svg[data-ico], :scope > span > svg[data-ico]');
    if (!ico || ico.classList.contains('fx-wiggle')) return;
    ico.classList.add('fx-wiggle');
    setTimeout(() => ico.classList.remove('fx-wiggle'), 750);
  }

  private cursor(): void {
    const dot = this.doc.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    this.doc.body.appendChild(dot);
    const w = this.doc.defaultView!;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      dot.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? w.requestAnimationFrame(loop) : 0;
    };
    w.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.opacity = '1';
      if (!raf) raf = w.requestAnimationFrame(loop);
    }, { passive: true });
    this.doc.addEventListener('mouseover', (e) => {
      dot.classList.toggle('is-hot', !!(e.target as Element | null)?.closest?.('a, button, input, textarea, summary'));
    });
    this.doc.addEventListener('mouseleave', () => (dot.style.opacity = '0'));
  }
}
