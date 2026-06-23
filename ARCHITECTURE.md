# ARCHITECTURE.md

## Purpose

This repo is the public STDS brand website frontend. It should be optimized for
SEO, fast first load, and simple build-time content consumption.

Use Astro + TypeScript. Treat this as a brand/SEO website, not an admin SPA.
`AGENTS.md` defines working behavior. `design_handoff_yide_site` is the current
product, page, visual, and TinaCMS content source of truth; this file defines
implementation and deployment boundaries.

When present, follow:

- `docs/.rules/coding-style.md`
- `docs/.rules/testing.md`
- `CICD.md`
- Current design handoff:
  `design_handoff_yide_site/README.md` and
  `design_handoff_yide_site/CONTENT-MODEL.md`
- Backend API contract for property availability:
  `GET /api/v1/public/properties/availability`

## Rendering Boundary

Default to static Astro pages for crawlable public content.

Use build-time content reads for TinaCMS editorial content and build-time data
fetches for property availability. Use SSR only if a later issue accepts runtime
freshness requirements that static generation cannot meet.

Client-side JavaScript should be limited to small interactive islands, for
example filters, accordions, or contact form affordances. Do not move core page
content behind client-only rendering.

## Content And Public API Boundary

The target content architecture follows the handoff:

- TinaCMS owns editorial copy, images, site settings, contact details, FAQ, and
  news/blog content.
- The STDS backend owns property availability only.

The frontend may read only this public readonly JSON endpoint from the core
backend:

- `GET /api/v1/public/properties/availability`

The frontend must not depend on core STDS operational tables, admin endpoints,
tenant data, lease data, billing data, repair data, attachments, or scheduler
behavior. Data ownership stays in the backend and its approved brand-facing
views.

Frontend API code should be a thin typed build-time wrapper around this public
availability endpoint. Do not introduce a generated client in the current
documentation alignment stage; a later issue can evaluate one if it becomes
useful.

## Suggested Source Layout

Do not create empty folders ahead of use. When implementation starts, prefer a
small layout like:

```text
src/
  pages/          Astro routes and SEO page composition
  layouts/        Shared page shells and document metadata
  components/     Reusable presentational components
  lib/api/        Typed public API fetch helpers
  lib/content/    Tina/content loading helpers when shared logic is useful
  lib/seo/        Title, meta, canonical, and structured-data helpers
  styles/         Global styles and design tokens from the current handoff
  test/           Test helpers only when shared test setup exists
```

Keep pages page-centric. Add shared code only after repetition or risk makes it
useful.

## SEO Principles

- Prefer semantic HTML with real headings, links, addresses, FAQ content, news
  articles, and property summaries in the server-rendered or static HTML.
- Every route should own its title, description, canonical URL, Open Graph data,
  and useful structured data where appropriate.
- Avoid client-only content for Tina editorial content, FAQ, news, and
  availability summaries.
- Keep images optimized with explicit dimensions, descriptive alt text, and no
  layout shift.
- Preserve accessible content and navigation before adding visual effects.
- Keep the page fast: minimal JavaScript, small CSS, cacheable assets, and no
  heavy state libraries.

## Deployment Shape

The deployment target is Cloudflare Pages.

Expected shape:

- Astro builds static assets into a deployable output directory.
- Cloudflare Pages serves the brand website.
- Cloudflare Pages staging builds from the GitHub `dev` branch.
- Cloudflare Pages production builds from a separate `prod` branch when
  production promotion is introduced.
- Cloudflare Pages may provide pull-request preview deployments, but they are
  temporary previews and not the staging environment.
- The Astro build reads TinaCMS editorial content from repo-backed content and
  fetches property availability from the configured core backend public API base
  URL.
- A protected Cloudflare Pages deploy hook can trigger scheduled or CMS-driven
  rebuilds.
- Public content freshness requires a Cloudflare Pages rebuild/redeploy because
  Tina content and availability snapshots are captured at build time.
- TinaCMS admin assets are generated during `npm run build` and copied into the
  static `dist/admin` output; generated admin assets are not source files.

No Firebase Hosting brand rewrite or runtime backend proxy is required for the
active architecture. The brand site does not depend on `stds_brand_backend` or a
brand thin Cloud Run service.

## Configuration Boundary

Keep cloud deployment assumptions explicit. When adding configuration, document:

- environment variable name
- whether it is build-time or runtime
- required environments such as local, staging, and prod
- safe example value
- whether it affects local, preview, staging, or production builds

Do not rely on hard-coded local URLs, machine-specific paths, or implicit
defaults that would be unclear in Cloudflare Pages or CI. Public frontend
configuration must not contain secrets. Deploy hook URLs are secrets and must
not be committed.

`BRAND_API_BASE_URL` is the build-time API base URL for the core backend public
availability API.

`SITE_URL` is the required build-time public origin URL for canonical links and
absolute metadata URLs. It must be an absolute `http` or `https` origin with no
path, query, or hash, for example `https://example.com`. A trailing slash is
accepted and normalized. Missing or invalid `SITE_URL` should fail the build
clearly so Cloudflare Pages staging and production do not publish ambiguous
metadata.

The initial TinaCMS foundation is local-first and does not select TinaCloud
credential environment variable names. Document those names only when the
operator/editor workflow is implemented.

## Testing And CI

Keep CI basic at first:

- install dependencies
- typecheck
- lint or formatting check when configured
- unit/component tests for API wrappers and rendering helpers
- build check

Add browser tests only for high-value public flows after the Astro app exists,
such as home page render, FAQ visibility, news list/detail render, property
availability render, and basic metadata presence.

## Non-Goals

- No admin SPA.
- No authenticated admin workflows.
- No heavy client state management.
- No frontend ownership of backend data rules.
- No direct database access.
- No private STDS operational API consumption.
- No booking, reservation, public contact-form submission, or other write API.
- No realtime availability contract; published availability is a build-time
  snapshot until a later issue changes that architecture.
- No backend ownership of editorial brand content after the TinaCMS migration.
- No generated client or multi-tenant architecture until a concrete issue
  requires it.
