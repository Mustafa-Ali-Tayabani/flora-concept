import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ContentService } from '../../core/content/content.service';
import { Photo } from '../../shared/photo';

/**
 * T8 · reverse-chronological list. The index only ever contains posts whose
 * pubDate has passed at build time (scripts/sync-content.mjs).
 */
@Component({
  selector: 'fc-blog-list',
  imports: [RouterLink, Photo, DatePipe],
  template: `
    @let list = posts() ?? [];
    @if (list.length) {
      <section class="band">
        <div class="wrap">
            <ul class="posts">
              @for (p of list; track p.slug) {
                <li class="post tone-surface" data-reveal>
                  <fc-photo class="post__img" ratio="4/3" [image]="p.image" alt="" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div class="post__body">
                    <time class="small" [attr.datetime]="p.pubDate">{{ p.pubDate | date: 'd MMMM y' : undefined : 'fr' }}</time>
                    <h2 class="h3 post__title"><a [routerLink]="['/blog', p.slug]">{{ p.title }}</a></h2>
                    <p class="post__excerpt">{{ p.excerpt }}</p>
                    <span class="link post__more" aria-hidden="true">Lire</span>
                  </div>
                </li>
              }
            </ul>
        </div>
      </section>
    }
  `,
  styles: `
    .posts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: clamp(16px, 2vw, 24px); }
    .post { position: relative; display: flex; flex-direction: column; background: var(--paper); border-radius: 28px; padding: 10px; color: var(--forest); }
    .post__img { border-radius: 20px; }
    .post__body { display: flex; flex-direction: column; gap: 10px; padding: 18px 14px 14px; }
    .post__title a { color: inherit; }
    .post__title a::after { content: ''; position: absolute; inset: 0; border-radius: 28px; }
    .post__excerpt { font-size: 15px; line-height: 1.55; color: var(--mu); display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .post__more { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList {
  protected readonly posts = toSignal(inject(ContentService).index().pipe(map((i) => i.posts)));
}
