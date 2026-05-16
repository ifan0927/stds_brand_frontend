# Handoff — 奕德不動產 品牌官網（首頁）

## Overview

A single-page marketing site for **奕德不動產 (Yi-De Real Estate)**, a 包租代管 (rental management / sub-let) service operating in 大台南 (Greater Tainan). The page serves two audiences simultaneously:

- **Tenants (房客)** — browse available rentals, learn about the service, read FAQs.
- **Landlords (房東)** — understand the management plans and contact the team.

It pulls data at build time from core backend public read-only endpoints that expose brand profile, FAQs, and property availability summaries.

---

## About the Design Files

The files in `reference/` are **design references**, written as a static HTML+CSS+vanilla-JS prototype. They are NOT meant to be copy-pasted into the target codebase. The task is to **recreate the design in Astro** using the existing patterns of the chosen target stack and integration with the public Brand API.

- `reference/index.html` — full design source. Markup, styles, and JavaScript renderers all live in one file for easy inspection.
- `reference/mock/*.json` — example payloads matching the public Brand API response shapes. Use these for local development before the backend is live.

---

## Target Stack

**Frontend:** Astro (static output, content-driven, MPA-style routing).
**Hosting:** Cloudflare Pages (static).

### Why this stack matches the design

- The page is content-led, mostly static, with three build-time data fetches → Astro's island/SSG model fits perfectly.
- No client-side routing required; this is a single landing page.
- The three backend endpoints are read-only, public, and JSON. Fetch them at
  **build time** so the deployed page contains crawlable static content. Do not
  use runtime client-side API calls to compose the core page content.

### Suggested project layout

```
src/
  pages/
    index.astro              # the entire homepage
  components/
    SiteHeader.astro
    Hero.astro
    HeroPhoto.astro
    DualEntryCards.astro
    PropertiesRegistry.astro   # client island for pagination only
    AboutSection.astro
    FaqList.astro              # native <details> based, no JS needed
    ContactBand.astro
    SiteFooter.astro
  lib/
    api.ts                     # fetch helpers for the 3 endpoints
    types.ts                   # TS types matching API contract
  styles/
    tokens.css                 # design tokens (CSS custom properties)
    base.css                   # resets + typography
public/
  fonts/                       # optionally self-host Google Fonts for perf
```

### Build-time data fetch

| Endpoint | Recommendation | Reasoning |
|---|---|---|
| `GET /api/v1/public/brand/profile` | **Build-time** | Changes rarely; rebuild when admins update. |
| `GET /api/v1/public/brand/faqs` | **Build-time** | Same — content-y, rebuild on change. |
| `GET /api/v1/public/properties/availability` | **Build-time** | The brand site accepts snapshot freshness and daily rebuilds. |

The Astro page can use top-level `await fetch(...)` in the frontmatter for all
three. Daily Cloudflare Pages deploy-hook rebuilds refresh the static snapshot.
When backend content changes, rebuilding/redeploying Cloudflare Pages is the
expected freshness mechanism.

### Cloudflare Pages note

No Firebase Hosting rewrite or runtime backend proxy is required. Keep
`BRAND_API_BASE_URL` as a build-time env var so local / preview / prod builds
can target the right core backend public API.

---

## Fidelity

**High-fidelity (hifi).** Final colors, type, spacing, and interactions are all specified below. Recreate pixel-faithfully — including the warm clay accent, Instrument Serif headings, monospace eyebrow labels, the editorial properties registry, and the FAQ disclosure pattern.

---

## Page Structure

The page is one long scroll, broken into seven bands. All in-page navigation uses `#anchor` links + `scroll-behavior: smooth; scroll-padding-top: 88px` on `<html>`.

| # | Section | Anchor | Purpose |
|---|---|---|---|
| 1 | Site Header (sticky) | — | Brand mark · primary nav · 聯絡我們 CTA |
| 2 | Hero | `#top` | Eyebrow + headline + sub + reserved photo slot, then dual entry cards |
| 3 | Properties Registry | `#properties` | Typographic list of available properties, paginated 6 per page |
| 4 | About | `#about` | Why 奕德 — three pillars + quote aside with brand metadata |
| 5 | FAQ | `#faq` | Disclosure list, first item open by default |
| 6 | Contact | `#contact` | Inverted dark card with phone / email / address from profile API |
| 7 | Site Footer | — | Brand mark + copyright + updated-at timestamp |

---

## Design Tokens

All values are inline in `reference/index.html` under `:root`. Port them into `tokens.css`:

### Colors

```css
--canvas:        oklch(0.985 0.006 80);   /* page floor — warm off-white */
--surface-soft:  oklch(0.962 0.011 75);   /* about card, hover bg */
--surface-warm:  oklch(0.928 0.020 70);   /* photo placeholder fill */

--ink:           oklch(0.215 0.012 60);   /* dominant text */
--body:          oklch(0.405 0.010 60);   /* paragraph text */
--muted:         oklch(0.555 0.010 60);   /* secondary labels */
--muted-soft:    oklch(0.700 0.008 60);   /* disabled */

--hairline:      oklch(0.880 0.008 60);   /* default 1px border */
--hairline-soft: oklch(0.930 0.006 60);   /* lighter divider */

--accent:        oklch(0.590 0.135 45);   /* warm clay — single brand voltage */
--accent-deep:   oklch(0.470 0.130 38);   /* hover / mono labels */
--accent-soft:   oklch(0.945 0.025 50);   /* hero photo gradient */
--leaf:          oklch(0.460 0.060 155);  /* vacancy pip — green-ish */
```

Single-accent discipline: **only `--accent` carries the brand voltage** (eyebrow dot, hero "更穩的人" italic, quote mark, primary CTA hover, vacancy pip background ring, contact band glow). No other saturated color is used.

### Typography

Three families, loaded from Google Fonts:

- **Instrument Serif** (regular 400, italic 400) — display headlines, property names, FAQ questions, decorative quote mark.
- **Noto Sans TC** (300/400/500/600/700) — body, nav, buttons, captions. Provides the Traditional Chinese coverage.
- **Geist Mono** (400/500) — eyebrow labels, monospace tags, metadata keys, page counters, status chips.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Sans+TC:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
```

For best perf on Cloudflare Pages, consider self-hosting the subset of glyphs needed via `unicode-range`.

### Type scale (used in design)

| Token | Spec | Example |
|---|---|---|
| Hero H1 | Instrument Serif 400, `clamp(48px, 7vw, 92px)`, line-height 1.02, letter-spacing -1.4px | "把房子的事，交給更穩的人。" |
| Section H2 | Instrument Serif 400, `clamp(36px, 4.5vw, 54px)`, line-height 1.06, letter-spacing -0.7px | "正在等你的下一個家。" |
| Dual card H3 | Instrument Serif 400, 30px, line-height 1.12, letter-spacing -0.3px | "找一間，可以好好住下來的房子。" |
| Property name | Instrument Serif 400, 28px (mobile 22px), line-height 1.1, letter-spacing -0.3px | "東門靜巷" |
| FAQ question | Instrument Serif 400, 22px (mobile 18px), line-height 1.3, letter-spacing -0.2px | "包租代管和傳統仲介有什麼不同？" |
| Hero sub | Noto Sans TC 400, 18px, line-height 1.6, max-width 540px | — |
| Body paragraph | Noto Sans TC 400, 15–16px, line-height 1.55–1.7 | — |
| Eyebrow / mono label | Geist Mono 400, 11–12px, letter-spacing 1.2px, uppercase | "Photo · Reserved", "Service area" |
| Status chip | Noto Sans TC 500, 12.5px, `white-space: nowrap` | "可入住", "滿房" |

### Spacing scale

| Token | Value | Common use |
|---|---|---|
| `--space-xs` | 4px | inline gap between icon + text |
| `--space-sm` | 8px | tight stack |
| `--space-md` | 12px | row padding |
| `--space-base` | 16px | default gap |
| `--space-lg` | 24px | card internal padding |
| `--space-xl` | 32px | nav inner padding, card outer padding |
| `--space-2xl` | 48px | between section head and content |
| `--space-section` | 64–112px | between major sections |

Container max-width: **1240px**, side padding 32px desktop / 20px mobile (`.wrap`).

### Border radius

| Token | Value | Use |
|---|---|---|
| `--r-xs` | 6px | tiny chips |
| `--r-sm` | 10px | inputs (future) |
| `--r-md` | 18px | future small cards |
| `--r-lg` | 28px | dual entry cards, hero photo, about card, contact band |
| `--r-pill` | 999px | nav CTA, status chips, page buttons, badges |

Every interactive surface is rounded. No hard corners except the body grid.

### Shadows

The system has effectively **one shadow tier** used on hovered cards:

```css
--shadow-card: 0 1px 0 0 rgba(40,28,16,.025),
               0 8px 24px -12px rgba(40,28,16,.10);
```

Everything else is flat. Depth comes from white-on-cream surface contrast and rounded clipping, not stacked shadows.

---

## Components

### 1. Site Header

- Sticky top, 76px height, `backdrop-filter: blur(10px)` over `--canvas` at 92% opacity, 1px soft hairline bottom.
- Layout: brand (logo + name + small mono "YI·DE") · primary nav (3 anchors) · spacer · "聯絡我們" pill CTA.
- Primary nav links: 15px Noto Sans TC 500, ink color, 1.5px transparent bottom border that turns ink on hover.
- CTA: 44px tall, pill-rounded, ink fill, white text — hover flips background to `--accent-deep`.
- **Mobile (< 820px):** hide `.primary` nav. Keep brand + CTA only. (You can add a sheet menu if needed — the design intentionally leaves it minimal.)
- Brand mark SVG: a 28px circle filled with `--accent`, white roof-triangle path + center dot. Inline SVG, replicated in footer.

### 2. Hero

- Two-column grid, 1.15fr / 1fr, gap 56px, `align-items: center`. Collapses to one column below 960px.
- **Left column (`.hero-text`):**
  - Eyebrow: a pulsing 6px accent dot + mono "大台南 · 包租代管".
  - H1 with `<br>` between lines, italic-accent on key phrase (`<em>更穩的人</em>`).
  - Sub paragraph, max-width 540px.
- **Right column (`.hero-photo`):**
  - **Reserved photo slot** — aspect-ratio 4/5, `--r-lg` border-radius. Currently rendered as a striped warm placeholder with two annotations: a mono pill "Photo · Reserved" top-left, and serif caption "Img · 01 / 台南實景 / 代表物件主視覺" bottom-left.
  - When the real photo is ready, replace the placeholder with `<img>` — the wrapper retains the same aspect ratio and radius.
- Below the grid (full width): **dual entry cards** — see next component.

### 3. Dual Entry Cards (`.dual`)

Two side-by-side cards (1:1 grid), 20px gap, collapses to single column under 720px.

- **Tenant card** (left): `--surface-soft` fill, hairline border, padding 32px.
- **Landlord card** (right): `--ink` fill (dark), white text — visually inverted.
- Inside each: monospace badge ("For 房客" / "For 房東"), serif H3, body paragraph, a "go" row with a circular ink-filled arrow.
- Decorative `.ornament`: bottom-right radial gradient blob, `z-index: 0`, positioned at `right: -90px; bottom: -90px`, falls off at 55% — adds warmth without obscuring text (all text gets `z-index: 1`).
- Hover: `translateY(-2px)` + shadow tier; arrow shifts right and recolors to `--accent`.

### 4. Properties Registry (`.props-list`)

Editorial typographic list — **not photo cards**. The backend currently has no photo field, so the design honestly displays text only. Each property is a row with:

| Column | Width | Content |
|---|---|---|
| idx | 56px | Mono 12px, two-digit index "01", "02", …, in muted gray |
| name | 1fr | Instrument Serif 28px, ink — `property_public_name` |
| addr | 1.1fr | Sans 14.5px — district prefix muted (`台南市東區`), rest in body color |
| chip | 110px | Pill chip with colored pip + "可入住" or "滿房" |
| arrow | 28px | Circle outline arrow; hover recolors to ink-filled |

- Each row 22px / 22px vertical padding, 1px hairline above and below.
- Hover: `background: var(--surface-soft)` + 12px left padding shift; chip color shifts; arrow inverts.
- **Address splitting:** the design parses the leading admin region with regex `/^(.+?[市縣].+?[區鄉鎮市])(.*)$/` and renders the district prefix in `--muted`, the rest in `--body`. Implement the same in your component.
- **Sort order:** vacant rooms (`has_vacant_room: true`) first, full rooms last. Stable within each group (preserves API order).
- **Pagination:** 6 items per page, controls in `.props-foot`:
  - Left: stats line `共 N 間可入住 · 顯示 X–Y / Z 間`
  - Right: pager `[<] 1 / 3 [>]` with circular buttons; disabled state at 35% opacity.
  - Hide entirely when total ≤ page size.
  - On page change, smooth-scroll the section back into view (`#properties`).
- **Mobile (< 820px):** collapse to 3-column grid `40px 1fr 96px` with grid-template-areas — name + chip on row 1, addr + arrow on row 2. Property name shrinks to 22px.
- **Skeleton state:** during fetch, render 3 placeholder rows of height 76px with shimmer animation.
- **Empty state:** `目前無可入住物件。` in muted, centered, 64px vertical padding.

**In Astro:** the registry should be a client island (`client:visible` or `client:idle`) since pagination requires state. Or implement pagination as URL query (`?page=2`) and re-render server-side — both are fine, but the design is built for client pagination.

### 5. About Section (`.why`)

Soft-cream rounded card (28px radius, 64px / 56px padding) containing:

- **`.about-head`** — two-column grid 1.4fr / 1fr, gap 56px:
  - Left: mono `— 關於奕德` label + serif H2 "不只是仲介，是長期的居住管家。" (italic-accent on `<em>仲介</em>` and `<em>居住管家</em>`).
  - Right: **`.about-aside`** — a large italic serif `"` quote mark (64px, accent color) absolutely positioned top-left, followed by an italic serif quote paragraph, then 3 metadata rows with hairline dividers (`Service area`, `Plans`, `Updates`). Metadata keys use mono 11px uppercase.
- **`.why-grid`** — 3-column grid below the head, 36px gap, each item: italic serif accent number "01", 18px/600 title, 14.5px body paragraph.

Collapses to single column at 820px (head) and 720px (why-grid).

### 6. FAQ List (`.faq-list`)

Native `<details>` accordion — no JS required (the reference file uses CSS only):

- Each `<details>` is `.faq`, summary contains: mono `Q.01` index, serif question text, circular `+` button.
- First item starts open (`<details open>`); others closed.
- Summary padding 26px vertical, 24px gap between elements.
- `+` button is 32px circle, 1px hairline. On `[open]`, fills with ink and rotates 45° → becomes `×`.
- Answer body: 0 64px 28px 56px padding, body color, line-height 1.7, max-width 70ch.
- Mobile: question font 18px, answer padding-left 42px.

### 7. Contact Band (`.contact`)

Inverted dark band (`--ink` background), 28px radius, 64px / 56px padding. Two columns:

- **Left:** Serif H2 ("有任何問題，直接聊聊。") + lede paragraph in 70%-opacity white.
- **Right (`.contact-info`):** 3 rows, each is mono uppercase key + serif/sans value with white hairline separator. Rendered from the `profile` API response (`contact_phone`, `contact_email`, `contact_address`). Phone wraps in `tel:`, email in `mailto:`.
- Decorative radial accent glow in top-right corner (`::before`, won't affect text — text has `position: relative`).

### 8. Site Footer

Simple — brand mark on the left, mono meta strip on the right:
`© 2026 奕德不動產 · 大台南包租代管 · 資料更新於 YYYY.MM.DD` (date from `profile.updated_at`).

---

## API Integration

Public, read-only, JSON. Base path `/api/v1/public`. **Empty endpoints return 200 with `items: []` or `profile: null`** — handle both gracefully.
No Firebase JWT is required for these public endpoints. Do not hardcode local,
staging, or production backend URLs; use the Cloudflare Pages build-time
environment value for the API base URL.

### Types (TypeScript)

```ts
export type BrandProfile = {
  brand_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  updated_at: string; // RFC 3339
};

export type FaqItem = {
  question: string;
  answer: string;
  sort_order: number;
};

export type PropertyAvailability = {
  property_id: string;
  property_public_name: string;
  address: string;
  has_vacant_room: boolean;
};

// Response shapes
export type ProfileResponse = { profile: BrandProfile | null };
export type FaqsResponse = { items: FaqItem[] };
export type AvailabilityResponse = { items: PropertyAvailability[] };

// Shared error shape (all 4xx/5xx)
export type ApiError = {
  error: { code: string; message: string };
  request_id: string;
};
```

### Endpoints

| Method + Path | Returns |
|---|---|
| `GET /api/v1/public/brand/profile` | `ProfileResponse` |
| `GET /api/v1/public/brand/faqs` | `FaqsResponse` (items already sorted by `sort_order` from the backend view; do NOT re-sort) |
| `GET /api/v1/public/properties/availability` | `AvailabilityResponse` (re-sort client-side: vacant first) |

### Empty / error states (must implement)

| State | UX |
|---|---|
| Profile null | Render `—` for each contact row. Hide updated-at date in footer. |
| FAQs empty | Render muted "目前沒有常見問題。" centered, 48px padding. |
| Availability empty | Render muted "目前無可入住物件。" centered, 64px padding, hidden pager. |
| Network / 5xx | Console.error + fallback to skeleton or empty-state copy. Don't crash the page. |

### Error code reference (from contract)

`VALIDATION_FAILED`, `NOT_FOUND`, `SERVICE_UNAVAILABLE`, `INTERNAL_ERROR`. None of these endpoints take params, so `VALIDATION_FAILED` shouldn't occur in practice; the rest are operational.

---

## Interactions & Behavior

| Behavior | Spec |
|---|---|
| Smooth in-page scroll | `html { scroll-behavior: smooth; scroll-padding-top: 88px; }` to clear the sticky header |
| Eyebrow dot pulse | 2.4s ease-in-out infinite, scale 1 → 0.7, opacity 1 → 0.4 |
| Card hover | `transform: translateY(-2px)` + `--shadow-card`, 250ms ease |
| Property row hover | bg → `--surface-soft`, padding-left → 16px, 180ms |
| Arrow circle hover (inside row / dual card) | ink fill, white icon, +2px translateX |
| FAQ disclosure | Native `<details>` toggle. `+` icon rotates 45° + inverts on `[open]`, 250ms |
| Pagination click | Update page state, re-render slice, scroll section into view (instant) |
| Disabled pager button | opacity 0.35, `cursor: not-allowed`, no hover |
| Hero photo placeholder | Currently striped CSS; replace with `<img>` when real asset arrives |

No real animations beyond the above. No carousel, no autoplay, no scroll-triggered effects.

---

## Responsive Breakpoints

| Name | Width | Key changes |
|---|---|---|
| Mobile | < 720px | Dual cards stack; properties grid collapses to 2-row template with chip + arrow on second row; why-grid stacks; FAQ question shrinks |
| Tablet | 720–960px | Hero stays two-column down to 960px; below 820px About head collapses; properties registry stays compressed grid |
| Desktop | 960–1240px | Full two-column hero; full 5-column properties row; full 3-column why-grid |
| Wide | > 1240px | Container caps at 1240px; centered; gutters absorb extra space |

Touch targets: nav CTA 44px, dual card arrow 28px (within 44px tap zone), property row arrow 28px (entire row is the tap target — link the whole row), FAQ summary 26px padding (≥ 60px tap zone), page buttons 32px.

---

## Assets

| Asset | Source | Notes |
|---|---|---|
| Instrument Serif | Google Fonts | Italic variant essential |
| Noto Sans TC | Google Fonts | Includes traditional Chinese coverage |
| Geist Mono | Google Fonts | Modern monospace |
| Brand mark | Inline SVG (in reference HTML) | 28×28 circle + roof triangle + center dot; reuse as a component |
| Icons | Inline SVG strokes | Arrow, plus, chevron — all stroke-based, no icon library |
| Photos | Not yet provided | Hero placeholder reserved for "台南實景 / 代表物件主視覺" |

The brand mark is a simple geometric — circle filled `--accent`, a 2px white roof-style polyline (`M7 19 L14 9 L21 19`), and a small white center dot. Lift it from `reference/index.html` and turn it into a `<BrandMark>` Astro component.

---

## Suggested Implementation Order

1. **Scaffold** — `npm create astro@latest`, configure Cloudflare Pages build output (`dist`).
2. **Tokens + typography** — port `tokens.css` and load fonts.
3. **Shared chrome** — `SiteHeader.astro`, `SiteFooter.astro`, `BrandMark.astro`.
4. **Static sections** (no API): Hero (with photo placeholder), About, dual entry cards, Contact band shell.
5. **API client** — `lib/api.ts` with typed fetch helpers, env var for base URL.
6. **Data-bound sections** — FAQ (build-time), Contact info (build-time), Properties (build-time).
7. **Properties pagination island** — client component with state + smooth scroll-back.
8. **Empty / error states** for all three data sources.
9. **Cloudflare Pages deploy** — connect the repo, set build-time env vars, and verify preview/prod deployments.

---

## Files in this Handoff

```
docs/design/
├── README.md                       ← this file
└── reference/
    ├── index.html                  ← full design source (HTML+CSS+JS in one file)
    └── mock/
        ├── profile.json            ← matches GET /api/v1/public/brand/profile
        ├── faqs.json               ← matches GET /api/v1/public/brand/faqs
        └── availability.json       ← matches GET /api/v1/public/properties/availability
```

To run the reference locally: open `reference/index.html` in any modern browser.
The vanilla JS at the bottom fetches the three mock JSONs from `./mock/*.json`
only so the design artifact can render standalone. Do not wire the production
Astro site by swapping that prototype `API_BASE`; production integration should
use build-time fetches from `BRAND_API_BASE_URL`.
