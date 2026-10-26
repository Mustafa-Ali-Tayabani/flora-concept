import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ImageRef, Page, Post, SiteSettings } from '../content/content.models';
import { floraImageLoader } from '../media/image-loader';
import { buildPageGraph, buildPostGraph } from './json-ld';

interface HeadInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: ImageRef;
  type?: 'website' | 'article';
}

/** Title, description, canonical, robots, Open Graph and JSON-LD for every route. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  forPage(page: Page, settings: SiteSettings): void {
    this.apply(
      { title: page.seo.title, description: page.seo.description, path: page.slug, noindex: page.seo.noindex, image: page.heroImage },
      settings,
    );
    this.setJsonLd(page.template === 'notFound' ? null : buildPageGraph(page, settings));
  }

  forPost(post: Post, settings: SiteSettings): void {
    this.apply(
      { title: post.seo.title, description: post.seo.description, path: `/blog/${post.slug}/`, image: post.image, type: 'article' },
      settings,
    );
    this.setJsonLd(buildPostGraph(post, settings));
  }

  private apply(input: HeadInput, settings: SiteSettings): void {
    const url = settings.siteUrl + input.path;
    this.title.setTitle(input.title);
    const tags: [string, string, 'name' | 'property'][] = [
      ['description', input.description, 'name'],
      ['robots', input.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large', 'name'],
      ['og:type', input.type ?? 'website', 'property'],
      ['og:site_name', settings.siteName, 'property'],
      ['og:locale', 'fr_FR', 'property'],
      ['og:title', input.title, 'property'],
      ['og:description', input.description, 'property'],
      ['og:url', url, 'property'],
      ['twitter:card', 'summary_large_image', 'name'],
    ];
    const image = input.image ?? settings.logo;
    const imageUrl = floraImageLoader({ src: image.src, width: 1440 });
    tags.push(['og:image', imageUrl.startsWith('http') ? imageUrl : settings.siteUrl + imageUrl, 'property']);
    for (const [key, content, attr] of tags) {
      if (content) this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    this.setCanonical(input.noindex ? null : url);
  }

  private setCanonical(url: string | null): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(graph: object | null): void {
    let script = this.doc.head.querySelector<HTMLScriptElement>('script#ld-json');
    if (!graph) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'ld-json';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    // `<` is escaped so content can never close the script element.
    script.textContent = JSON.stringify(graph).replace(/</g, '\\u003c');
  }
}
