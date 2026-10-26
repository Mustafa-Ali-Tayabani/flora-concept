import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { readFile } from 'node:fs/promises';
import { join, normalize } from 'node:path';
import { from, map, catchError, throwError } from 'rxjs';

/** Directory holding `content/` at render time (web/public). */
export const CONTENT_ROOT = new InjectionToken<string>('CONTENT_ROOT', {
  factory: () => join(process.cwd(), 'public'),
});

/**
 * Server only: serves `/content/*.json` straight from disk while prerendering,
 * so the build never needs a running HTTP server.
 */
export const serverContentInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;
  if (req.method !== 'GET' || !url.startsWith('/content/')) return next(req);
  const root = inject(CONTENT_ROOT);
  const file = normalize(join(root, url.split('?')[0]));
  if (!file.startsWith(join(root, 'content'))) return throwError(() => new HttpErrorResponse({ url, status: 400 }));
  return from(readFile(file, 'utf8')).pipe(
    map((body) => new HttpResponse({ url, status: 200, body: JSON.parse(body) })),
    catchError(() => throwError(() => new HttpErrorResponse({ url, status: 404, statusText: 'Not Found' }))),
  );
};
