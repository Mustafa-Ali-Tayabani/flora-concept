# Flora Concept: website

Static, SEO/AI-first website for Flora Concept (B2B interior landscaping, PACA + Île-de-France), built from the approved Claude Design hand-off (`design/Flora Concept v5.dc.html`) and the content delivery of 2026-10-08 (`design/uploads/floraconcept-livraison-dev-2026-10-08/`).

- **Angular 22** (standalone, zoneless, signals), **prerendered to static HTML** (SSG): every word is in the served HTML, no server runtime.
- **Sanity** (Studio v6) as the CMS, read **at build time only**.
- **Vercel** hosting (services): the `web` service (static site + the quote function `web/api/devis.mjs`) and the `studio` service (Sanity Studio at `/studio`).
- **Hostinger** (Apache + PHP) remains supported as an alternative: same build, `.htaccess` + `server/api/devis.php`.

Read the brief first: `design/uploads/floraconcept-livraison-dev-2026-10-08/READ-ME-FIRST.md` and `DEV-REQUIREMENTS.md`. Every rule below comes from them.

## Repository

```
web/            Angular app (SSG)
  src/app/core/      content loading, SEO + JSON-LD, consent, analytics, images, motion
  src/app/layout/    header, footer, mobile bar, cookie banner
  src/app/sections/  one component per design section (S3…S22)
  src/app/pages/     page templates (home, hub, service, city, about, FAQ, quote, blog, legal, 404)
  public/            fonts, optimised images, generated content JSON
studio/         Sanity Studio (schemas mirror web/src/app/core/content/content.models.ts)
content/        seed content (generated from the delivered Markdown) + original images
server/         PHP quote endpoint + config template
scripts/        content import/sync, build, post-build, audits, redirects
redirects/      legacy-domain spam list
design/         design hand-off and content delivery (source of truth, read-only)
```

## Commands

Requires **Node ≥ 24.15** (see `.nvmrc`; Angular 22 refuses older versions). On macOS: install the current Node 24 LTS from nodejs.org, or `brew install node@24` and put `/opt/homebrew/opt/node@24/bin` first in your `PATH`.

| Command | What it does |
|---|---|
| `npm install` | Installs web, studio and tooling (npm workspaces) |
| `npm run dev` | Syncs content and serves the site with live reload on http://localhost:4200 |
| `npm run build` | Content sync → prerender all pages → post-build (sitemap, robots, CSP, .htaccess, API) into `web/dist/web/browser/` |
| `npm run build:strict` | Same, but **fails while client data is missing** (use for go-live) |
| `npm run preview` | Serves the production build with the same routing, headers and CSP (http://localhost:4300, mocked quote API) |
| `npm test` | Unit tests (Vitest) |
| `npm run audit:site` | Acceptance checks on the build (titles, H1, canonicals, JSON-LD, CTAs, no prices/placeholders/encoding errors, sitemap) |
| `npm run content:guard` | Lists every `{{A_FOURNIR}}` still pending, per page |
| `npm run test:redirects` | Tests 100 % of `REDIRECTIONS.md` against the legacy domains |
| `npm run studio` | Sanity Studio on http://localhost:3333 |
| `npm run studio:seed` | One-off: loads the seed content and images into Sanity |
| `npm run content:import-md` | Regenerates `content/seed/` from the delivered Markdown |
| `npm run images` | Regenerates responsive WebP files from `content/media/originals/` |

## Content

- **Source of truth**: Sanity in production, `content/seed/` otherwise (the delivered Markdown, imported verbatim by `scripts/import-markdown.mjs`). `scripts/sync-content.mjs` turns either into `web/public/content/*.json` before every build.
- **Copy is never rewritten.** Portable Text carries the French text character for character. Editorial validations in the Studio warn on prices, « Végétal Office », em dashes and title/description lengths.
- **Client data** that fills a `{{A_FOURNIR}}` lives in `content/client-data.json` (exact find/replace on the delivered Markdown, each with its source: registry, client confirmation, implementation). Never put an unverified value there.
- **`{{A_FOURNIR}}`** still missing is a `pending` node. Production builds remove it, along with any sentence, list item or section left empty, and `content:guard` reports it. Sections that depend on client approvals (Réalisations, logos, team, key figures, timeline) appear automatically once their data exists. `CONTENT_PREVIEW=1 npm run build` shows the placeholders as « À fournir » chips for client review.
- **Blog**: a post with a future `pubDate` does not exist anywhere (no page, listing or sitemap entry). The deploy workflow rebuilds on **Mondays and Thursdays at 05:00 UTC**, and on every Sanity publish if the webhook is configured.

## Setting up Sanity

1. Create a project at sanity.io, then put its ID in `.env` (`SANITY_PROJECT_ID`, `SANITY_STUDIO_PROJECT_ID`). See `.env.example`.
2. `npm run studio:seed` with an Editor token in `SANITY_WRITE_TOKEN` (once).
3. `npm run studio` locally, or `npm run deploy -w studio` to host the Studio.
4. Add a GitHub webhook in Sanity (on publish → `POST https://api.github.com/repos/<owner>/<repo>/dispatches`, body `{"event_type":"sanity-publish"}`, with a fine-grained token).

## Deployment (Vercel)

Import the GitHub repository in Vercel as one project. `vercel.json` declares two services:

| Service | Root | Public path | Contents |
|---|---|---|---|
| `web` | `web/` | `/` (catch-all) | Prerendered site + `api/devis` function |
| `studio` | `studio/` | `/studio` | Sanity Studio (add the domain to the Sanity project's CORS origins, with credentials) |

There are no service bindings: the browser calls `/api/devis` on the same origin, and the site reads Sanity at build time from Sanity's own API. Trailing slashes, security headers and cache headers are top-level routing settings shared by both services.

- **Node**: Vercel picks 24.x from `engines`.
- **Environment variables** (Production):
  - Content: `SITE_URL` (e.g. `https://www.floraconcept.fr`), `GTM_ID`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN` (private dataset only).
  - Quote form: `DEVIS_ALLOWED_ORIGINS` (every domain the form is served from, comma-separated), `DEVIS_TO_PACA`, `DEVIS_TO_IDF`, `DEVIS_TO_DEFAULT`, `DEVIS_FROM` (a sender on a domain verified in Resend), `RESEND_API_KEY`, `DEVIS_ACK_SUBJECT` / `DEVIS_ACK_BODY` (client copy; empty = no acknowledgement), `DEVIS_IP_SALT`.
  - Rate limit: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, from the Upstash integration in the Vercel Marketplace. Without them the limit is kept per function instance, which is best effort only.
- **Content Security Policy**: on Vercel (`VERCEL=1`), the post-build step writes a `<meta>` CSP with the inline-script hashes into every page. The hashes change at each build, so they can't live in `vercel.json`. `vercel.json` sends the other headers, including `X-Frame-Options`, which replaces `frame-ancestors` (not allowed in a meta CSP).
- **Scheduled blog publishing**: create a Deploy Hook (Vercel → Settings → Git → Deploy Hooks) and store its URL as the GitHub secret `VERCEL_DEPLOY_HOOK_URL`. `.github/workflows/scheduled-publish.yml` calls it on Mondays and Thursdays at 05:00 UTC. Point the Sanity « on publish » webhook at the same hook.
- **Domain**: add `www.floraconcept.fr` and the bare domain in Vercel, and redirect the bare domain to `www`.
- Preview deployments are sent with `X-Robots-Tag: noindex` by Vercel and use the production canonical, so they never compete with the live site.

## Deployment (Hostinger, alternative)

`.github/workflows/deploy-hostinger.yml` (manual) builds, tests, audits and rsyncs `web/dist/web/browser/` to the web root over SSH.

- **Secrets**: `HOSTINGER_SSH_KEY`, `HOSTINGER_HOST`, `HOSTINGER_USER`, `HOSTINGER_PORT` (default 65002), `HOSTINGER_PATH` (e.g. `/home/u123/domains/floraconcept.fr/public_html`), `SANITY_READ_TOKEN` (if the dataset is private).
- **Variables**: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SITE_URL`, `GTM_ID`, `STRICT_CONTENT` (`true` for go-live).
- **Quote endpoint**: copy `server/devis.config.example.php` to `devis.config.php` **one level above** `public_html`, then fill in the recipients, sender and salt. Requires PHP ≥ 8.1 and a working `mail()` (SPF/DKIM on the sending domain). It has not been tested on the host yet: send a test request after the first deploy.
- **Legacy domains**: each build writes `web/dist/redirects/floraconcept.com.htaccess` and `vegetaloffice.fr.htaccess` (also uploaded as a workflow artefact). Install them at the root of each old domain, then run `npm run test:redirects`.
  - All 40 lines of `REDIRECTIONS.md`, plus every URL the old sitemaps still publish (checked 25/10/2026: nothing is missing).
  - Draft targets are mapped to the approved slugs. `/bouquets-fleurs-naturelles-artificielles/` goes to `/abonnement-fleurs-entreprise/`, decided from the old page's content (see `scripts/lib/redirects.mjs`).
  - Hack spam returns 410 via two rules: numeric `/NNNN-2/` slugs and any percent-encoded non-ASCII slug (Greek, Cyrillic…). The old sites have no legitimate non-ASCII URL. The original 385-line export can still be added to `redirects/vegetaloffice-spam.txt`.

## Security

- Static HTML, no server-side rendering at runtime. The only dynamic code is the quote endpoint (`web/api/devis.mjs` on Vercel, `server/api/devis.php` on Apache): same-origin check, JSON only, size limit, honeypot plus fill-time check, server-side validation, per-IP rate limit (5 per 10 min), header-injection-safe mail. Its config and storage live outside the web root.
- **Strict CSP** generated at build time (response header on Apache, `<meta>` on Vercel): scripts are limited to `'self'` plus the sha256 of each inline script, and GTM/Clarity hosts are allowed only for after consent. Plus HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` and COOP. JS bundles have Subresource Integrity.
- Content is rendered by interpolation only (no `innerHTML`); links are restricted to internal paths, `https:`, `tel:` and `mailto:`.
- **Consent Mode v2, strict**: nothing is requested from Google or Microsoft before the visitor accepts. GTM is injected only after consent; `devis_submit`, `devis_start` and `call_click` go to the `dataLayer`.

## Performance

Measured with mobile Lighthouse on the local production preview: **home 95, service 98–99, city 97–98, quote 97**, with Accessibility, Best Practices and SEO at **100**, TBT ≤ 30 ms and CLS ≤ 0.03.

How:
- Content sections are `@defer (hydrate never)`: their JS is never downloaded on load.
- The framework bundle loads after `load` and first paint; event replay keeps early clicks.
- WebP images at 6 widths with `srcset`.
- Self-hosted fonts: the display font is subset and weight-pinned to 33 KB.
- Critical CSS is inlined.

## Choices to review with the client

See the hand-over notes in the pull request / delivery message: phone number and address source, redirect targets still marked « à fixer », FAQ answers rendered open, newsletter block not built, legal pages blocked until completed.
