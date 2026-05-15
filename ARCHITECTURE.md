# ARCHITECTURE.md

## Purpose

This repo is the public STDS brand website frontend for
`~/stds_brand_backend`. It should be optimized for SEO, fast first load, and
simple content consumption from the public brand API.

Use Astro + TypeScript. Treat this as a brand/SEO website, not an admin SPA.
`AGENTS.md` defines working behavior, `DESIGN.md` defines product/design
direction, and this file defines implementation boundaries.

When present, follow:

- `docs/.rules/coding-style.md`
- `docs/.rules/testing.md`
- `CICD.md`
- Backend API contract:
  `~/stds_brand_backend/docs/api/public-brand-api.md`

## Rendering Boundary

Default to static Astro pages for crawlable public content.

Use SSR only when static generation cannot meet the need, such as when live
availability must be fetched per request and stale build-time data is not
acceptable. If SSR is introduced, keep it narrow and document which routes need
runtime rendering.

Client-side JavaScript should be limited to small interactive islands, for
example filters, accordions, or contact form affordances. Do not move core page
content behind client-only rendering.

## Public API Boundary

The frontend may read only the public readonly JSON endpoints documented by the
backend:

- `GET /api/v1/brand/profile`
- `GET /api/v1/brand/faqs`
- `GET /api/v1/properties/availability`

The frontend must not depend on core STDS operational tables, admin endpoints,
tenant data, lease data, billing data, repair data, attachments, or scheduler
behavior. Data ownership stays in the backend and its approved brand-facing
views.

Frontend API code should be a thin typed wrapper around these public endpoints.
Avoid generated clients until the backend publishes an OpenAPI contract.

## Suggested Source Layout

Do not create empty folders ahead of use. When implementation starts, prefer a
small layout like:

```text
src/
  pages/          Astro routes and SEO page composition
  layouts/        Shared page shells and document metadata
  components/     Reusable presentational components
  lib/api/        Typed public API fetch helpers
  lib/seo/        Title, meta, canonical, and structured-data helpers
  styles/         Global styles and design tokens from DESIGN.md
  test/           Test helpers only when shared test setup exists
```

Keep pages page-centric. Add shared code only after repetition or risk makes it
useful.

## SEO Principles

- Prefer semantic HTML with real headings, links, addresses, FAQ content, and
  property summaries in the server-rendered or static HTML.
- Every route should own its title, description, canonical URL, Open Graph data,
  and useful structured data where appropriate.
- Avoid client-only content for profile, FAQ, and availability summaries.
- Keep images optimized with explicit dimensions, descriptive alt text, and no
  layout shift.
- Preserve accessible content and navigation before adding visual effects.
- Keep the page fast: minimal JavaScript, small CSS, cacheable assets, and no
  heavy state libraries.

## Deployment Shape

The likely first deployment target is Firebase Hosting or another static hosting
provider.

Expected shape:

- Astro builds static assets into a deployable output directory.
- Static hosting serves the brand website.
- Hosting rewrites proxy a public backend prefix, for example `/brand-api/**`,
  to the brand backend service.
- The frontend API wrapper can map a deployment-specific public base URL to the
  backend service paths documented as `/api/v1/...`.

Backend service paths remain owned by
`~/stds_brand_backend/docs/api/public-brand-api.md`; hosting rewrites are an
environment/deployment concern.

## Configuration Boundary

Keep cloud deployment assumptions explicit. When adding configuration, document:

- environment variable name
- whether it is build-time or runtime
- required environments such as local, staging, and prod
- safe example value
- which hosting or backend rewrite behavior depends on it

Do not rely on hard-coded local URLs, machine-specific paths, or implicit
defaults that would be unclear in Firebase Hosting, Cloud Run, or CI. Public
frontend configuration must not contain secrets.

## Testing And CI

Keep CI basic at first:

- install dependencies
- typecheck
- lint or formatting check when configured
- unit/component tests for API wrappers and rendering helpers
- build check

Add browser tests only for high-value public flows after the Astro app exists,
such as home page render, FAQ visibility, property availability render, and
basic metadata presence.

## Non-Goals

- No admin SPA.
- No authenticated admin workflows.
- No heavy client state management.
- No frontend ownership of backend data rules.
- No direct database access.
- No private STDS operational API consumption.
- No speculative CMS, generated client, or multi-tenant architecture until a
  concrete issue requires it.
