# CI/CD

This repo is the Astro + TypeScript public brand frontend for the STDS core
backend public brand API. Keep delivery simple, static-first, and aligned with
`AGENTS.md`, `DESIGN.md`, `ARCHITECTURE.md` when present, and
`docs/.rules/testing.md` when present.

## Branch Flow

1. Feature work starts from `dev` on a short-lived feature branch.
2. Feature branches merge back to `dev` through PR review.
3. `dev` promotes to `staging` after checks pass and the change is ready for browser smoke validation.
4. `staging` promotes to `prod` only through an approved manual release.

Do not use the brand frontend pipeline for backend migrations, admin workflow validation, or broad end-to-end coverage.

## PR Checks

PRs run the minimal Astro project gate:

- Install dependencies with the project package manager lockfile.
- Run `check`.
- Run `test`.
- Run `build` against a local fixture server for the public brand API.

The first CI version should stay small. Prefer fast checks that protect Astro rendering, TypeScript correctness, static output, and public-page regressions.

## Staging Smoke

After deploying `staging`, verify:

- Public pages load successfully at their expected URLs.
- Core SEO metadata is present: page title, description, canonical URL when applicable, and Open Graph tags.
- Static output and assets are reachable, including CSS, JS, images, and generated Astro assets.
- Required Cloudflare Pages environment variables are documented, configured for
  the target environment, and do not expose secrets in frontend output.
- `BRAND_API_BASE_URL` is configured as the build-time API base URL for the
  target core backend public API.
- Build-time data fetch succeeds against the core backend public brand
  endpoints.

Backend API smoke should cover:

- `GET /api/v1/public/brand/profile`
- `GET /api/v1/public/brand/faqs`
- `GET /api/v1/public/properties/availability`

Use the core backend `/health` only as an environment sanity check; it is not a
substitute for the three public endpoint checks.

## Production Release

Production releases are manual and approved. Promote only after:

- PR checks passed before merge.
- Staging page-load and SEO smoke passed.
- Staging static asset checks passed.
- Staging Cloudflare Pages environment-variable configuration matched the
  documented release assumptions.
- Staging build-time API smoke passed for the three public endpoints.
- The release owner confirms the production change window and rollback path.

## Initial Non-Goals

- No heavy end-to-end suite at the start.
- No admin workflow checks.
- No backend migration checks.
- No broad backend contract testing beyond public endpoint smoke for the brand site.
