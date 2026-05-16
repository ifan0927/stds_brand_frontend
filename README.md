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

The repository is in its early Astro scaffold phase. Governance docs, design
references, package scripts, and the first static homepage structure are present;
the next integration slice should replace mock browser fetches with build-time
API fetches.

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

## Engineering Focus

The goal is a small but production-minded public website foundation:

- SEO-aware page structure, metadata, Open Graph data, and crawlable content
- Cloudflare Pages friendly configuration and documented build-time environment
  variables
- Clear separation from the main admin frontend
- Thin build-time API client boundary over the core public brand API
- Basic CI checks for type safety, tests, and production build once scripts
  exist
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

Early Astro scaffold. Static app code and package scripts exist; CI workflow and
build-time API integration remain later implementation slices.
