# ARCHITECTURE.md

## Purpose

This repo is the public STDS brand website frontend for
the STDS core backend public brand API. It should be optimized for SEO, fast
first load, and simple build-time content consumption.

Use Astro + TypeScript. Treat this as a brand/SEO website, not an admin SPA.
`AGENTS.md` defines working behavior, `DESIGN.md` defines product/design
direction, and this file defines implementation boundaries.

When present, follow:

- `docs/.rules/coding-style.md`
- `docs/.rules/testing.md`
- `CICD.md`
- Backend API contract:
  `~/stds_backend` core public brand endpoints from
  `https://github.com/ifan0927/STDS_backend_go/issues/209`

## Rendering Boundary

Default to static Astro pages for crawlable public content.

Use build-time data fetches for profile, FAQ, and availability content. Use SSR
only if a later issue accepts runtime freshness requirements that static
generation cannot meet.

Client-side JavaScript should be limited to small interactive islands, for
example filters, accordions, or contact form affordances. Do not move core page
content behind client-only rendering.

## Public API Boundary

The frontend may read only the public readonly JSON endpoints exposed by the
core backend:

- `GET /api/v1/public/brand/profile`
- `GET /api/v1/public/brand/faqs`
- `GET /api/v1/public/properties/availability`

The frontend must not depend on core STDS operational tables, admin endpoints,
tenant data, lease data, billing data, repair data, attachments, or scheduler
behavior. Data ownership stays in the backend and its approved brand-facing
views.

Frontend API code should be a thin typed build-time wrapper around these public
endpoints. Avoid generated clients until the backend publishes an OpenAPI
contract.

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

The deployment target is Cloudflare Pages.

Expected shape:

- Astro builds static assets into a deployable output directory.
- Cloudflare Pages serves the brand website.
- Cloudflare Pages provides branch and pull-request preview deployments.
- The Astro build fetches brand data from the configured core backend public
  API base URL.
- A protected Cloudflare Pages deploy hook can trigger scheduled rebuilds.

No Firebase Hosting brand rewrite or runtime backend proxy is required for the
active architecture.

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
