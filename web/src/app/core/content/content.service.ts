import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Page, Post, SiteIndex, SiteSettings } from './content.models';

/** Same mapping as scripts/sync-content.mjs. */
export const fileForSlug = (slug: string): string =>
  slug === '/' ? 'index' : slug.replace(/^\/|\/$/g, '').replace(/\//g, '__');

/**
 * Reads the JSON documents produced at build time by scripts/sync-content.mjs.
 * While prerendering they are read from disk (server-content.interceptor) and
 * embedded in the page's transfer state, so a prerendered page never refetches
 * its own content in the browser. Client-side navigations fetch the small JSON file.
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly state = inject(TransferState);
  private readonly server = isPlatformServer(inject(PLATFORM_ID));

  settings(lang: 'fr' | 'en' = 'fr'): Observable<SiteSettings> {
    return this.get<SiteSettings>(lang === 'en' ? '/content/settings.en.json' : '/content/settings.json');
  }

  index(): Observable<SiteIndex> {
    return this.get<SiteIndex>('/content/index.json');
  }

  page(slug: string): Observable<Page | null> {
    return this.get<Page>(`/content/pages/${fileForSlug(slug)}.json`).pipe(catchError(() => of(null)));
  }

  post(slug: string): Observable<Post | null> {
    if (!/^[a-z0-9-]+$/.test(slug)) return of(null);
    return this.get<Post>(`/content/posts/${slug}.json`).pipe(catchError(() => of(null)));
  }

  private get<T>(url: string): Observable<T> {
    const key = makeStateKey<T>(url);
    if (!this.server && this.state.hasKey(key)) return of(this.state.get(key, null) as T);
    return this.http.get<T>(url).pipe(tap((body) => this.server && this.state.set(key, body)));
  }
}
