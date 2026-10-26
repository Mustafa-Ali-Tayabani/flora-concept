import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Leaf pictogram used in buttons and bullets (wiggles on hover, see FxService). */
@Component({
  selector: 'fc-leaf',
  template: `<svg data-ico [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 20C4 11 10 4.5 20 4c.2 9.5-6 15.5-14.5 15.5" /><path d="M4 20l9.5-9.5" /><path d="M10 14h4.5M13.5 10.5V7" />
    </svg>`,
  styles: `:host { display: contents; } svg { flex-shrink: 0; transform-origin: 20% 80%; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeafIcon {
  readonly size = input(18);
}

@Component({
  selector: 'fc-phone-icon',
  template: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>`,
  styles: `:host { display: contents; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneIcon {}

@Component({
  selector: 'fc-chevron',
  template: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">
      <path d="M2 3.5l3 3 3-3" />
    </svg>`,
  styles: `:host { display: contents; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChevronIcon {}

/** Hand-drawn branch illustration from the design (line-draw animated by FxService). */
@Component({
  selector: 'fc-branch',
  template: `<svg data-draw viewBox="0 0 320 600" fill="none" [attr.stroke]="color()" stroke-width="1.2" stroke-linecap="round"
      stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 580C120 420 90 220 300 30"/><g transform="translate(46.5 530.9) rotate(-123.1)"><path d="M0 0C14.5 -15.2 33.8 -15.2 48.2 0C33.8 15.2 14.5 15.2 0 0Z"/><path d="M0 0L38.6 0"/></g><g transform="translate(67.4 479.6) rotate(-12.2)"><path d="M0 0C17.1 -17.9 39.9 -17.9 57 0C39.9 17.9 17.1 17.9 0 0Z"/><path d="M0 0L45.6 0"/></g><g transform="translate(84.9 426.5) rotate(-130.9)"><path d="M0 0C19.2 -20.1 44.8 -20.1 64 0C44.8 20.1 19.2 20.1 0 0Z"/><path d="M0 0L51.2 0"/></g><g transform="translate(101.3 372) rotate(-15.3)"><path d="M0 0C20.5 -21.5 47.9 -21.5 68.5 0C47.9 21.5 20.5 21.5 0 0Z"/><path d="M0 0L54.8 0"/></g><g transform="translate(118.8 316.3) rotate(-129.6)"><path d="M0 0C21 -22 49 -22 70 0C49 22 21 22 0 0Z"/><path d="M0 0L56 0"/></g><g transform="translate(139.5 259.6) rotate(-9.9)"><path d="M0 0C20.5 -21.5 47.9 -21.5 68.5 0C47.9 21.5 20.5 21.5 0 0Z"/><path d="M0 0L54.8 0"/></g><g transform="translate(165.8 202.4) rotate(-120.6)"><path d="M0 0C19.2 -20.1 44.8 -20.1 64 0C44.8 20.1 19.2 20.1 0 0Z"/><path d="M0 0L51.2 0"/></g><g transform="translate(199.8 144.8) rotate(1.9)"><path d="M0 0C17.1 -17.9 39.9 -17.9 57 0C39.9 17.9 17.1 17.9 0 0Z"/><path d="M0 0L45.6 0"/></g><g transform="translate(243.8 87.3) rotate(-107.1)"><path d="M0 0C14.5 -15.2 33.8 -15.2 48.2 0C33.8 15.2 14.5 15.2 0 0Z"/><path d="M0 0L38.6 0"/></g><g transform="translate(300 30) rotate(-42.1)"><path d="M0 0C14.7 -13.2 34.3 -13.2 49 0C34.3 13.2 14.7 13.2 0 0Z"/></g><path d="M104 330C170 300 220 300 290 250"/><g transform="translate(142 315) rotate(-77.2)"><path d="M0 0C11.2 -12.2 26.2 -12.2 37.5 0C26.2 12.2 11.2 12.2 0 0Z"/><path d="M0 0L30 0"/></g><g transform="translate(177.8 303.3) rotate(40.3)"><path d="M0 0C13.5 -14.7 31.5 -14.7 45 0C31.5 14.7 13.5 14.7 0 0Z"/><path d="M0 0L36 0"/></g><g transform="translate(213.3 291.1) rotate(-78.9)"><path d="M0 0C13.5 -14.7 31.5 -14.7 45 0C31.5 14.7 13.5 14.7 0 0Z"/><path d="M0 0L36 0"/></g><g transform="translate(250.1 274.6) rotate(30.4)"><path d="M0 0C11.2 -12.2 26.2 -12.2 37.5 0C26.2 12.2 11.2 12.2 0 0Z"/><path d="M0 0L30 0"/></g><g transform="translate(290 250) rotate(-35.5)"><path d="M0 0C9.7 -9 22.5 -9 32.2 0C22.5 9 9.7 9 0 0Z"/></g><path d="M80 470C30 420 20 360 40 300"/><g transform="translate(49.8 430.8) rotate(-177.4)"><path d="M0 0C10.4 -11.3 24.3 -11.3 34.7 0C24.3 11.3 10.4 11.3 0 0Z"/><path d="M0 0L27.8 0"/></g><g transform="translate(33.8 388.8) rotate(-44.3)"><path d="M0 0C12 -13 28 -13 40 0C28 13 12 13 0 0Z"/><path d="M0 0L32 0"/></g><g transform="translate(30.8 344.8) rotate(-143.8)"><path d="M0 0C10.4 -11.3 24.3 -11.3 34.7 0C24.3 11.3 10.4 11.3 0 0Z"/><path d="M0 0L27.8 0"/></g><g transform="translate(40 300) rotate(-71.6)"><path d="M0 0C8.4 -7.8 19.6 -7.8 28 0C19.6 7.8 8.4 7.8 0 0Z"/></g></svg>`,
  // The host is the positioned box: parents set top/right/bottom/height on it.
  styles: `:host { position: absolute; display: block; pointer-events: none; } svg { height: 100%; width: auto; transform-origin: 10% 100%; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchArt {
  readonly color = input('#3d5a40');
}
