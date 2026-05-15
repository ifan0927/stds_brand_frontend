# STDS Brand Frontend

Public brand website frontend for the STDS property-management side project.

This repository is planned as a lightweight Astro + TypeScript website focused
on SEO, fast static delivery, and public-facing brand content. It is not the
main STDS admin application. The site will consume a small readonly brand API
for public profile, FAQ, and property availability content.

## Project Role

STDS is split into a few repositories with intentionally different
responsibilities:

- [STDS_backend_go](https://github.com/ifan0927/STDS_backend_go): main core
  backend for the property-management system.
- [stds_fronted](https://github.com/ifan0927/stds_fronted): main admin
  frontend for operational property-management workflows.
- [stds_brand_backend](https://github.com/ifan0927/stds_brand_backend): thin
  public brand backend that exposes readonly brand and availability endpoints.
- [stds_brand_frontend](https://github.com/ifan0927/stds_brand_frontend): this
  public brand website frontend.

The brand frontend is intentionally separate from the admin frontend so it can
stay static-first, SEO-friendly, and simple to deploy.

## Intended Stack

- Astro
- TypeScript
- Static-first rendering
- Small interactive islands only when needed
- Public API access through the brand backend

The repository is currently in its initial setup phase. The first committed
files define project direction, architecture boundaries, design references, test
rules, and CI/CD expectations before the application scaffold is added.

## API Boundary

The frontend should read only the public readonly contract from
`stds_brand_backend`:

- `GET /api/v1/brand/profile`
- `GET /api/v1/brand/faqs`
- `GET /api/v1/properties/availability`

The brand site should not consume admin APIs, tenant data, lease data, billing
data, repair workflows, attachments, scheduler behavior, or direct database
access.

## Engineering Focus

The goal is a small but production-minded public website foundation:

- SEO-aware page structure, metadata, Open Graph data, and crawlable content
- Cloud-deployment-friendly configuration and documented environment variables
- Clear separation from the main admin frontend
- Thin API client boundary over the public brand API
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

Early repository initialization. Application code, package scripts, hosting
configuration, and CI workflows will be added in later implementation slices.
