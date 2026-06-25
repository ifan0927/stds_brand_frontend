# STDS Brand Frontend

Public brand website frontend for the STDS property-management side project.

This repository is a lightweight Astro + TypeScript website focused on SEO,
fast static delivery, and public-facing brand content. It is not the main STDS
admin application. The target content architecture follows
`design_handoff_yide_site`: TinaCMS owns editorial brand content, while the core
backend remains the source for public property availability only.

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
- TinaCMS for editable brand content, FAQ, contact details, and news
- Build-time public API access to the core backend property availability endpoint

The repository is in its early Astro implementation phase. Governance docs,
design references, package scripts, and the first static homepage structure are
present. The current code still contains the first homepage/API integration
slice; the next implementation direction is the multi-page
`design_handoff_yide_site` handoff with TinaCMS content and a tenant-page
availability list.

Astro 6 requires Node.js `22.12.0` or newer. This repo includes `.nvmrc` with
`22.12.0`; Cloudflare Pages builds should use Node 22 or set
`NODE_VERSION=22.12.0` explicitly.

## Content And API Boundary

The product, page structure, visual design, and TinaCMS content model should
follow [design_handoff_yide_site](design_handoff_yide_site/README.md).

TinaCMS should own all editorial content:

- site settings, brand identity, contact details, social links, and form URLs
- homepage, tenant page, landlord page, FAQ, and news/blog content
- page-level SEO fields and editorial images

The frontend should read only this public readonly property availability
contract from the core backend public namespace:

- `GET /api/v1/public/properties/availability`

The brand site should not consume admin APIs, tenant data, lease data, billing
data, repair workflows, attachments, scheduler behavior, or direct database
access.

The brand site does not include booking, reservation, public contact form
submission, realtime availability, or any write API. Booking and consultation
actions link out to configured external forms.

Public availability data is fetched at Astro build time. Cloudflare Pages should
provide `BRAND_API_BASE_URL` as the build-time core backend API base URL for
local, preview, staging, and production builds. Do not hardcode local, staging,
production, Firebase, or Cloud Run URLs.

Cloudflare Pages staging builds from the GitHub `dev` branch. Production is
reserved for a separate `prod` branch when production promotion is introduced.
The build command is `npm run build`, and the deployable output directory is
`dist`.

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

## TinaCMS Foundation

The TinaCMS admin shell is local-first in the current foundation slice. Run the
Astro dev server with Tina available at `/admin/index.html`:

```sh
npm run dev:tina
```

`npm run build` generates Tina admin assets before Astro builds the deployable
`dist` output. If `TINA_BRANCH`, `TINA_CLIENT_ID`, and `TINA_TOKEN` are set, the
admin client is built for the managed TinaCloud project while Astro reads the
repo-backed content snapshot. If those variables are missing, the build falls
back to local Tina mode. Tina local indexing is skipped in both modes because
the site does not currently depend on Tina search indexing during builds.
Generated Tina files under `tina/__generated__` and `public/admin` are build
artifacts and are not committed.

TinaCloud is the selected managed CMS service; this repo does not self-host a
CMS. During the current smoke test, TinaCloud targets `dev`. Do not commit Tina
tokens, deploy hook URLs, or account-specific values.

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
- [design_handoff_yide_site](design_handoff_yide_site/README.md): current
  multi-page visual handoff and TinaCMS content model; this supersedes the
  earlier single-page visual direction for implementation planning.
- [CICD.md](CICD.md): branch flow, PR checks, staging smoke, and production
  release expectations.
- [docs/.rules/coding-style.md](docs/.rules/coding-style.md): implementation
  style rules.
- [docs/.rules/testing.md](docs/.rules/testing.md): testing rules.

## Status

Early Astro app. Static homepage code, package scripts, build-time public API
integration, and the first PR CI workflow exist. The accepted next direction is
to migrate toward the `design_handoff_yide_site` multi-page handoff, TinaCMS
content, and backend availability-only data boundary.
