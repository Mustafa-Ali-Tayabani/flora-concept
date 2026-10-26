import { Zone } from '../content/content.models';

/**
 * The quote form is pre-filled with the zone of the page the visitor came from
 * (« zone field pre-filled from the originating page »). The last content page
 * viewed is kept in sessionStorage, which also works across full page loads.
 */
const KEY = 'fc_origin';

export interface Origin {
  slug: string;
  zone: Zone;
}

export function rememberOrigin(origin: Origin): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {
    /* storage unavailable: the visitor picks the zone */
  }
}

export function readOrigin(): Origin | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as Origin | null;
    return v && typeof v.slug === 'string' && ['', 'paris', 'nice', 'marseille'].includes(v.zone) ? v : null;
  } catch {
    return null;
  }
}
