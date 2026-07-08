# CI/CD

This repo is the Astro + TypeScript public brand frontend. Keep delivery simple,
static-first, and aligned with `AGENTS.md`, `ARCHITECTURE.md`,
`design_handoff_yide_site`, and `docs/.rules/testing.md` when present.

## Branch Flow

1. Feature work starts from `dev` on a short-lived feature branch.
2. Feature branches merge back to `dev` through PR review.
3. Cloudflare Pages production builds directly from `dev`.
4. Cloudflare Pages preview deployments build from feature branches when
   enabled.
5. TinaCloud editing targets `dev` so editorial content and media stay on the
   same GitHub default branch.

Do not use the brand frontend pipeline for backend migrations, admin workflow validation, or broad end-to-end coverage.

## PR Checks

PRs run the minimal Astro project gate:

- Install dependencies with the project package manager lockfile.
- Run `check`.
- Run `test`.
- Run `build` against a local fixture server for the backend availability API
  until TinaCMS content fixtures are introduced.

The current PR workflow is `.github/workflows/pr-ci.yml`. The expected required
PR check name for the first repository gate baseline is `PR CI / verify`.

The first CI version should stay small. Prefer fast checks that protect Astro rendering, TypeScript correctness, static output, and public-page regressions.

## Cloudflare Pages Baseline

Cloudflare Pages is the deployment target for this repo.

Expected production setup:

- Branch: `dev`.
- Environment: Cloudflare Pages production.
- Build command: `npm run build`.
- Output directory: `dist`.
- Build-time data sources: TinaCMS repo-backed content and the core backend
  production property availability API.
- Content freshness: TinaCMS content commits or backend availability refreshes
  require a Cloudflare Pages rebuild/redeploy so Astro publishes a fresh static
  snapshot.

Preview deployments, if enabled in Cloudflare Pages, are temporary per-feature
branch previews. They are separate from production and are used for review
before merging to `dev`.

No Firebase Hosting brand rewrite, `stds_brand_backend`, brand thin Cloud Run
service, booking flow, write API, or realtime availability is part of this
deployment shape. TinaCMS is the accepted editorial content source; its admin,
tokens, and webhooks must be configured explicitly and must not introduce
runtime rendering for public pages.

The current TinaCMS foundation builds the admin shell locally with
`npm run build`. When `TINA_BRANCH`, `TINA_CLIENT_ID`, and `TINA_TOKEN` are set,
the build generates a TinaCloud-connected admin client while reading the
repo-backed content snapshot for the static Astro build. When those variables
are missing, the same command falls back to local Tina mode. Tina local
indexing is skipped in both modes because this site does not currently depend
on Tina search indexing during the Cloudflare Pages build.

## Cloudflare Environment Variables

Configure these as Cloudflare Pages build-time environment variables. Values are
operator-managed and must not be committed.

| Name | Required | Scope | Safe example shape | Used for |
| --- | --- | --- | --- | --- |
| `BRAND_API_BASE_URL` | Yes | Production and preview builds | `https://example.com` | Core backend public API base URL for property availability. |
| `SITE_URL` | Yes | Production and preview builds | `https://example.com` | Absolute public origin for canonical and metadata URLs. |
| `LINE_URL` | No | Production and preview builds | `https://line.me/R/ti/p/@example` | Floating LINE social button URL. Falls back to Tina site settings, then `#`. |
| `FB_URL` | No | Production and preview builds | `https://www.facebook.com/example` | Floating Facebook social button URL. Falls back to Tina site settings, then `#`. |
| `TINA_BRANCH` | Yes for TinaCloud admin | Production/editor builds | `dev` | Git branch TinaCloud reads and writes. Keep this on `dev` so TinaCloud media and content stay aligned with the GitHub default branch. |
| `TINA_CLIENT_ID` | Yes for TinaCloud admin | Production/editor builds | TinaCloud client ID from `app.tina.io` | Identifies the managed TinaCloud project for the generated admin client. |
| `TINA_TOKEN` | Yes for TinaCloud admin | Production/editor builds | TinaCloud read-only token from `app.tina.io` | Allows the generated admin/client code to read TinaCloud content API metadata. Treat as operator-managed secret. |

`BRAND_API_BASE_URL` must allow build-time fetches for:

- `GET /api/v1/public/properties/availability`

The selected TinaCloud setup uses TinaCloud as the managed CMS service; no
self-hosted CMS/admin backend is part of this architecture. TinaCloud targets
`dev`, matching the GitHub default branch and Cloudflare Pages production
branch for the current release model.

`SITE_URL` must be an absolute origin with no path, query, or hash. A trailing
slash may be normalized by the site code.

Do not commit real environment values, deploy hook URLs, Cloudflare API tokens,
Tina tokens, or private account-specific identifiers.

## Operator Setup Checklist

Repo-side baseline:

- Confirm GitHub default branch is `dev`.
- Configure Cloudflare Pages production to build from `dev`.
- Configure Cloudflare Pages preview deployments for feature branches.
- Set build command to `npm run build`.
- Set output directory to `dist`.
- Set production `BRAND_API_BASE_URL` and `SITE_URL`.
- Configure `TINA_BRANCH=dev`, `TINA_CLIENT_ID`, and `TINA_TOKEN` for the
  TinaCloud editor.

Repository gate baseline:

- Protect `dev` or configure a GitHub ruleset for `dev`.
- Require pull requests before merge if that remains the accepted repo flow.
- Require `PR CI / verify` before merge.
- Prevent force pushes to protected branches.
- Decide separately whether approvals, stale-review dismissal, linear history,
  or additional production safeguards are needed.

Branch protection, rulesets, required checks, Cloudflare project settings, and
Cloudflare environment variables are operator-managed. This document describes
the desired baseline; it does not claim those settings are configured unless
separate non-secret evidence is recorded.

## Dependency Advisories

Astro 6 requires Node.js `22.12.0` or newer; keep Cloudflare Pages, CI, and
local builds on Node 22+.

`npm audit` may report moderate advisories through the dev-only
`@astrojs/check` language-server YAML dependency chain. Do not run
`npm audit fix --force` just to downgrade `@astrojs/check`; review a forward
upgrade path when one is available. Runtime Astro advisories should be handled
through normal Astro upgrades.

## Deployment Smoke

Actual first production deployment validation belongs to a follow-up
smoke/evidence issue. After Cloudflare Pages builds production from `dev`,
verify:

- Public pages load successfully at their expected URLs.
- Core SEO metadata is present: page title, description, canonical URL when applicable, and Open Graph tags.
- Static output and assets are reachable, including CSS, JS, images, and generated Astro assets.
- Required Cloudflare Pages environment variables are documented, configured for
  the target environment, and do not expose secrets in frontend output.
- `BRAND_API_BASE_URL` is configured as the build-time API base URL for the
  target core backend property availability API.
- TinaCMS content is present for required site settings, page content, FAQ, and
  news entries, and the generated `/admin` client can reach the configured
  TinaCloud project during the editor workflow smoke.
- Build-time data fetch succeeds against the core backend public availability
  endpoint.

Backend API smoke should cover:

- `GET /api/v1/public/properties/availability`

Use the core backend `/health` only as an environment sanity check; it is not a
substitute for the public availability endpoint check.

Future non-secret deployment evidence should record:

- Production URL.
- Branch and commit SHA.
- Cloudflare Pages deployment or build identifier when available.
- Build command and output directory.
- Confirmation that required environment variables are configured, without
  recording their private values.
- Confirmation that static pages and generated assets were published.
- Confirmation that TinaCMS content was read successfully, when applicable.
- Confirmation that build-time data fetch succeeded for the public availability
  endpoint.

Do not record secrets, tokens, deploy hook URLs, private environment values, or
actual Cloudflare credential material.

## Production Release

Production releases are currently triggered by updates to `dev`. Merge to `dev`
only after:

- PR checks passed before merge.
- Preview page-load and SEO smoke passed when the change needs visual review.
- Preview static asset checks passed when the change needs visual review.
- Cloudflare Pages environment-variable configuration matched the
  documented release assumptions.
- TinaCMS content smoke passed, when applicable.
- Build-time API smoke passed for the public availability endpoint.
- The release owner confirms rollback expectations for the `dev` deployment.

## Initial Non-Goals

- No heavy end-to-end suite at the start.
- No admin workflow checks.
- No backend migration checks.
- No broad backend contract testing beyond public availability endpoint smoke
  for the brand site.
