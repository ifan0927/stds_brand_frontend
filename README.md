# STDS Brand Frontend

Public brand website frontend for the STDS property-management side project.

This repository is a lightweight Astro + TypeScript website focused on SEO,
fast static delivery, and public-facing brand content. It is not the main STDS
admin application. The site consumes the core backend public readonly brand API
at build time for public profile, FAQ, and property availability content.

## Project Role

STDS is split into a few repositories with intentionally different
responsibilities:

- [STDS_backend_go](https://github.com/ifan0927/STDS_backend_go): main core
  backend for the property-management system.
- [stds_fronted](https://github.com/ifan0927/stds_fronted): main admin
  frontend for operational property-management workflows.
- [stds_brand_frontend](https://github.com/ifan0927/stds_brand_frontend): this
  public brand website frontend deployed through Cloudflare Pages.

The brand frontend is intentionally separate from the admin frontend so it can
stay static-first, SEO-friendly, and simple to deploy.

## Intended Stack

- Astro
- TypeScript
- Static-first rendering
- Small interactive islands only when needed
- Build-time public API access through core backend public read-only endpoints

The repository is in its early Astro implementation phase. Governance docs,
design references, package scripts, and the first static homepage structure are
present. The homepage fetches public brand content from `BRAND_API_BASE_URL` at
Astro build time and renders it into static HTML.

Astro 6 requires Node.js `22.12.0` or newer. This repo includes `.nvmrc` with
`22.12.0`; Cloudflare Pages builds should use Node 22 or set
`NODE_VERSION=22.12.0` explicitly.

## API Boundary

The frontend should read only the public readonly contract from the core
backend public namespace:

- `GET /api/v1/public/brand/profile`
- `GET /api/v1/public/brand/faqs`
- `GET /api/v1/public/properties/availability`

The brand site should not consume admin APIs, tenant data, lease data, billing
data, repair workflows, attachments, scheduler behavior, or direct database
access.

The brand site does not include booking, reservation, contact form submission,
CMS, realtime availability, or any write API.

Production brand data is fetched at Astro build time. Cloudflare Pages should
provide `BRAND_API_BASE_URL` as the build-time API base URL for local, preview,
staging, and production builds. Do not hardcode local, staging, production,
Firebase, or Cloud Run URLs.

`SITE_URL` is also required at build time for canonical URLs and absolute
metadata. It is non-secret public configuration and must be an absolute origin
URL with no path, query, or hash, for example `https://example.com`. A trailing
slash is accepted and normalized. Local builds should pass both variables:

```sh
SITE_URL=https://example.com BRAND_API_BASE_URL=http://localhost:8080 npm run build
```

For local CI-equivalent build verification without calling a real backend, run
the repo-owned public API fixture server in another shell:

```sh
PORT=4177 node scripts/brand-api-fixture.mjs
SITE_URL=https://example.com BRAND_API_BASE_URL=http://127.0.0.1:4177 npm run build
```

## Engineering Focus

The goal is a small but production-minded public website foundation:

- SEO-aware page structure, metadata, Open Graph data, and crawlable content
- Cloudflare Pages friendly configuration and documented build-time environment
  variables
- Clear separation from the main admin frontend
- Thin build-time API client boundary over the core public brand API
- Basic CI checks for type safety, tests, and production build
- Minimal architecture that can be reviewed and evolved without framework
  sprawl

## Documentation

- [AGENTS.md](AGENTS.md): coding-agent guardrails and project-specific rules.
- [ARCHITECTURE.md](ARCHITECTURE.md): Astro rendering, API, deployment, and
  configuration boundaries.
- [DESIGN.md](DESIGN.md): visual direction and design token reference.
- [CICD.md](CICD.md): branch flow, PR checks, staging smoke, and production
  release expectations.
- [docs/.rules/coding-style.md](docs/.rules/coding-style.md): implementation
  style rules.
- [docs/.rules/testing.md](docs/.rules/testing.md): testing rules.

## Status

Early Astro app. Static homepage code, package scripts, build-time public API
integration, and the first PR CI workflow exist. Broader smoke coverage remains
a later implementation slice.
