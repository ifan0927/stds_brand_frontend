# Coding Style

This repo is an Astro + TypeScript public brand website for STDS. Optimize for clear static content, SEO, accessibility, and simple maintenance. Do not treat it like an admin SPA.

## Astro and TypeScript

- Prefer `.astro` pages/components for static content and layout. Add client-side TypeScript only when interaction needs it.
- Keep props typed with small local `interface` or `type` declarations. Avoid generic abstractions until repeated usage proves they are needed.
- Keep page data loading close to the page or a small API utility. Avoid global state libraries.
- Use semantic HTML first; use components to remove real duplication, not to hide simple markup.
- Keep generated routes, slugs, and metadata deterministic and easy to inspect.

## Components and Styles

- Keep components focused on one visible section or reusable primitive.
- Prefer plain CSS, scoped Astro styles, or the repo's established styling pattern once one exists.
- Avoid styling systems, animation libraries, or design-token plumbing unless the repo already adopts them.
- Use responsive layout constraints deliberately: content width, image aspect ratio, readable line length, and stable spacing.
- Do not introduce decorative UI that competes with brand content or SEO readability.

## Backend API Boundary

Use a narrow public API client boundary for the only core backend public
readonly brand endpoint:

- `GET /api/v1/public/properties/availability`

TinaCMS owns brand profile, site settings, contact details, FAQ, page content,
and news content. Real users should not trigger runtime API calls to compose
core editorial content. The current legacy brand profile/FAQ API fixtures and
single-page integration code are temporary pre-Tina migration scaffolding, not
the target staging architecture.

Centralize base URL handling, request helpers, response typing, and error mapping in a small API utility. Pages should consume typed functions, not hand-roll `fetch` options. Normal rendering should fail gracefully with useful public content behavior; do not expose internal backend errors to visitors.

## Cloud-Friendly Configuration

- Keep environment variable usage explicit and documented before relying on it.
- Distinguish build-time public config from runtime server config when Astro modes require it.
- Do not hard-code localhost, staging, production, Firebase Hosting, or Cloud Run URLs inside page code.
- Do not depend on Firebase Hosting rewrites, a runtime backend proxy, `stds_brand_backend`, or a brand thin Cloud Run service.
- Never place secrets in frontend-exposed environment variables or generated static output.
- When a new environment variable is added, update architecture or deployment docs in the same change.

## SEO Expectations

- Every page should have an intentional title, description, canonical URL when applicable, and Open Graph/Twitter metadata where useful.
- Prefer crawlable server-rendered content over client-only content for profile, FAQ, availability, and landing content.
- Use one clear `h1`, logical heading order, meaningful link text, and structured content that matches search intent.
- Keep images optimized with dimensions, alt text, and lazy loading where appropriate.
- Add structured data only when the content genuinely supports it; keep JSON-LD typed and testable.

## Accessibility

- Interactive elements must be keyboard reachable, labeled, and visible in focus states.
- Images need useful `alt` text unless decorative.
- Forms and filters need associated labels, error text, and status messaging when introduced.
- Preserve sufficient color contrast and avoid conveying meaning through color alone.

## DESIGN.md Usage

Use `DESIGN.md` as the current visual direction and token reference, but do not copy Airbnb brand identity, proprietary names, copy, icons, trade dress, or marketplace-specific UI patterns. Translate the useful design qualities into an STDS-owned brand expression.
