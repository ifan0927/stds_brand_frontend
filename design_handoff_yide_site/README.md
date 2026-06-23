# Handoff: 奕德不動產官網（多頁版 · Astro + TinaCMS）

## Overview

Marketing + content website for **奕德不動產 (Yi-De / Trust Estate)**, a 包租代管 (rental
management / sublet) service in 大台南 (Greater Tainan). The site serves two audiences —
**房客 (tenants)** and **房東 (landlords)** — plus a news/blog and contact surface.

This is the **multi-page (v2)** information architecture, replacing the earlier single-page
design in `../design_handoff_yide_brand/` (v1, kept for token reference only). Five top-level
destinations:

| Nav label | Route (reference file) | Purpose |
|---|---|---|
| 最新消息 | `news-app.html` | News / blog list + article reader |
| 關於奕德 | `index-v2.html#about` | About section on the home page (anchor, not a separate page) |
| 我是房客 | `tenant.html` | Tenant landing — available-property list + “book a viewing” form |
| 我是房東 | `landlord.html` | Landlord landing — service value + “book consultation” form |
| 預約賞屋 | external Google Form | Viewing-booking form (opens new tab) |
| 聯絡我們 | dropdown | LINE / FB / phone / email / address / hours |

> The home page (`index-v2.html`) hosts Hero, dual-entry cards, About, interior imagery,
> a service CTA band, credentials, FAQ and Contact. **The old “available properties” list was
> intentionally removed from the home page** — that list now lives only on `tenant.html`.

---

## About the Design Files

The files in `reference/` are **design references built as static HTML + CSS + vanilla JS**.
They show the intended look, copy, and behavior — they are **not** production code to ship.

The task is to **recreate these designs in the target stack (Astro + TinaCMS)** using its
established patterns. Open any `reference/*.html` in a browser to see the live design; the inline
JS fetches `reference/mock/*.json` to render dynamic parts. The README is self-sufficient — you
can implement from it alone; the HTML is there to disambiguate pixels and copy.

See **`CONTENT-MODEL.md`** (in this folder) for the authoritative per-page content-source map and
the proposed TinaCMS collection schema. This README covers layout, tokens, components and behavior.

---

## Fidelity

**High-fidelity.** Final colors, type, spacing, copy and interactions are specified. Recreate
faithfully: the muted-gold accent, Noto Sans TC display type, monospace eyebrow/label tags, the
thin-hairline editorial layout, the dropdown nav, the static property registry, the FAQ disclosure,
and the news list/article reader.

---

## Target Stack

- **Framework:** Astro (content-led, MPA routing — one route per page).
- **CMS:** **TinaCMS** (Git-backed). Edits commit to the repo; Astro reads collections at build.
- **Dynamic data:** a single read-only backend endpoint for live property availability.
- **Hosting:** Cloudflare Pages (static). Keep `SITE_URL` for canonical metadata and
  `BRAND_API_BASE_URL` for the backend availability API base URL.

### Content architecture (finalized)

| Source | What | How |
|---|---|---|
| 🟢 **TinaCMS** | All editorial copy & images, **最新消息 (news)**, **FAQ**, **聯絡資訊 (contact info)** | Tina collections read at build |
| 🔵 **Backend API** | **Property availability list only** (vacancy flips between rebuilds) | fetch at build + optional client refresh |
| ⚙️ **Site Settings** | Brand, contact, social (LINE/FB), Google Form URLs | Tina singleton, shared across all pages |

> Decision confirmed by client: **news and contact info both go through Tina.** The property
> availability list is the **only** backend-API data source. Full field mapping → `CONTENT-MODEL.md`.

### Suggested project layout

```
src/
  pages/
    index.astro              # 首頁
    tenant.astro             # 我是房客
    landlord.astro           # 我是房東
    news/index.astro         # 最新消息 list
    news/[slug].astro        # 文章內頁
  components/
    SiteHeader.astro         # incl. dropdown + mobile menu (see Components §)
    SiteFooter.astro
    Hero.astro DualEntry.astro AboutBand.astro InteriorBand.astro
    CtaBand.astro Credentials.astro FaqList.astro ContactBand.astro
    PropertyRegistry.astro   # static, non-clickable; data from API
    LeadCta.astro
    NewsList.astro NewsArticle.astro
  lib/
    api.ts                   # availability fetch helper
    tina.ts                  # tina client helpers
  styles/                    # port the 4 CSS files from reference/styles
tina/
  config.ts                  # collections (see CONTENT-MODEL.md §8)
public/uploads/...           # images
```

---

## Global chrome (every page)

### Site Header — `SiteHeader.astro`

- **Sticky** top, `z-index:50`, white background, 1px bottom border `#DDDDDD`.
- A **4px muted-gold band** sits above everything via `.site-header::before` (`background:#DAC858`).
- `.header-inner`: flex row, `height:84px` (mobile `72px`), `gap:32px`, inside `.wrap` (max-width 1280, side padding 24/48).
- **Left:** brand mark — `<img src="uploads/logos/logo-main-1.png">`, ~40px tall, links to `index.astro`.
- **Primary nav** (`.primary-nav`, flex, `gap:36px`): links are **Noto Sans TC 600, 15px,
  `letter-spacing:.12em`, `text-transform:uppercase`**, color `#5a5655`, 2px transparent bottom
  border that turns gold (`#DAC858`) on hover / `.is-active`. Items in order:
  `最新消息 · 關於奕德 · 我是房客 · 我是房東 · 預約賞屋 · 聯絡我們▾`.
  - `預約賞屋` is an external link (`data-yide="form-viewing"`, opens new tab).
- **聯絡我們 dropdown** (`.nav-dd`): a `<button class="nav-dd-trigger">` + `.nav-dd-menu`.
  - Menu is absolute, `min-width:264px`, white, 1px border, **2px gold top border**, soft shadow
    `0 18px 40px -16px rgba(40,36,34,.28)`, fades/slides in (`opacity` + `translateY(8px)→0`, .2s).
  - **Reveals on hover (desktop)** and **on click (touch / fallback)** — both wired.
  - Six rows, each = a mono `.ico` badge + label: `LINE 官方帳號`, `FB 不動產何男`,
    `TEL 06-208-1688`, `MAIL hello@yide.tw`, `MAP 台南市東區東門路二段 158 號 3 樓`, `HRS 平日 10:00 — 19:00`.
  - `.ico` badge: Geist Mono 11px 600, gold-strong text `#d99c09`, 1px border, 3px radius, min-width 40px, centered.
- **Header CTA** (`.header-cta`): gold pill, white text, `預約諮詢` (home/landlord) or `預約賞屋` (tenant);
  hover → `#d99c09`. Hidden under 980px.
- **Hamburger** (`.nav-toggle`, three 22×2px bars): shown **only < 980px**; animates to an ✕ when open.

#### Header responsive (≤ 980px)
- `.nav-toggle` shows; `.header-cta` + `.header-spacer` hide.
- `.primary-nav` becomes an absolute slide-down panel under the header (`max-height` 0→85vh,
  fade in), items stack full-width with hairline dividers.
- The dropdown becomes an **inline accordion** (menu goes `position:static`, expands on `.is-open`).
- JS for all of this is in `reference/scripts/yide-nav.js` (mobile toggle, dropdown toggle,
  outside-click close, and **applying configurable URLs** — see Config §).

### Site Footer — `SiteFooter.astro`

- Dark band `#3f3f3f`, text `#b8b3b1`. `.footer-top` = 3 areas: brand + tagline, **Service** link
  column, **Contact** column (phone / email / address / hours). `.footer-bottom` = copyright +
  meta strip. Contact + copyright + tagline come from **Site Settings**.

---

## Page: 首頁 — `index.astro` (reference `index-v2.html`)

One long scroll. Bands top→bottom:

1. **Hero** (`#top`) — full-bleed photo (`hero/index-slider-1.jpg`) + dark scrim; overlay text:
   mono eyebrow `Tainan · Property Service`, H1 `把房子的事，<br>交給更穩的人。`, gold divider,
   sub paragraph. Headlines are **Noto Sans TC 600** (no serif).
2. **Dual entry** — two cards → `tenant.astro` / `landlord.astro`. Each: mono tag (`For 房客` /
   `For 房東`), H3, paragraph, “go” link with arrow. Second card may be inverted; match reference.
3. **About** (`#about`) — section head (`— About 奕德`, H2 `不只是仲介，<br>是長期的居住管家。`,
   lede). `about-grid`: owner photo (`trust/team-inan.jpg`) + meta (`負責人 / 陳奕男 · Trust Estate`),
   and a 4-item numbered `service-list` (01–04, each title + paragraph). Then a `quote-block`.
4. **Interior band** — 3 figures (`interior/index-infobox-1..3.jpg`) with `kicker / caption`.
5. **Service CTA band** — background `banners/banner-img-1.jpg` + scrim; eyebrow, H2, sub, two
   buttons: `預約諮詢`(→`#contact`) and `看可入住物件`(→`tenant.astro`).
6. **Credentials** (`#trust`) — section head + 3 `trust-card`s (`trust/cert-*.jpg`, kicker, H4, p).
7. **FAQ** (`#faq`) — section head + disclosure list (data from Tina `faqs`). See Components §.
8. **Contact** (`#contact`) — section head; `contact-grid`: left lede + two CTAs (`立即撥打` `tel:`,
   `來信詢問` `mailto:`); right `contact-info` rows = **LINE / FB / Phone / Email / Address / Hours**
   (from Site Settings — this list is intentionally aligned 1:1 with the 聯絡我們 dropdown).
9. **Footer.**

---

## Page: 我是房客 — `tenant.astro` (reference `tenant.html`)

- **Page head** — breadcrumb `首頁 / 我是房客`, mono eyebrow `For Tenants`, H1
  `找一間，<br>可以好好住下來的房子。`, gold divider, lede.
- **Property registry** — section head (`— Available Now`, H2 `出租物件一覽`, lede) + the
  **static, non-clickable** list (`.props.is-static`) rendered from the **backend API**.
  Columns per row: `No.NN` (mono idx) · name · address (district prefix muted) · status chip
  (`可入住` gold pip / `滿房` muted). Layout is packed left with slack on the right —
  `grid-template-columns:64px max-content minmax(160px,max-content) 110px 1fr; column-gap:36px`.
  Sort **vacant first**. Pager: **8 per page**, prev/next, hidden when total ≤ 8.
- **Lead CTA** (`.lead-cta`) — eyebrow `— Book a Viewing`, H3 `看到喜歡的物件了嗎？`, paragraph, and a
  gold button **`前往預約賞屋表單`** → `Site Settings.forms.viewingUrl` (new tab).
- **Footer.**

---

## Page: 我是房東 — `landlord.astro` (reference `landlord.html`)

No API data — all Tina + Settings.

- **Page head** — eyebrow `For Landlords`, H1 `把空房，<br>換成穩定的月入。`, lede.
- **Value section** (`section-alt`) — `for-grid` (1.05fr / 1fr): left = 4-item numbered service
  list (01–04, landlord-focused copy), right = photo (`interior/index-infobox-1.jpg`,
  `aspect-ratio:4/5`; on mobile becomes 16/10 and moves above the list).
- **Lead CTA** — eyebrow `— Booking Form`, H3 `想評估自己的物件適合哪種方案？`, paragraph, gold button
  **`前往預約諮詢表單`** → `Site Settings.forms.landlordUrl` (new tab).
- **Footer.**

---

## Page: 最新消息 — `news/` (reference `news-app.html`)

A list + article reader (the reference does it as a hash-routed SPA; in Astro prefer real routes:
`news/index.astro` for the list, `news/[slug].astro` for articles). Data from Tina `news`.

- **List** — page head (`— News & Updates`, H1, lede); toolbar with **category filter** chips
  (categories derived from posts: 公告 / 房東指南 / 物件動態 / 房客指南…) + a count; then a vertical
  list of post rows (cover thumb, category, date, read-min, title, excerpt, arrow).
- **Article** — breadcrumb, category + date + read-min meta, H1 title, byline (avatar `奕` +
  `奕德編輯部`) + share (copy-link, print), cover image, body, tags, prev/next, related grid.
- **Body blocks** — reference uses typed blocks (`lede`, `h2`, `p`, `callout`). In Tina, model the
  body as **rich-text (MDX)** and map markdown → these styles (lede = intro paragraph, callout =
  bordered note). See `CONTENT-MODEL.md §6` / `§9.6`.

---

## Design Tokens

All defined in `reference/styles/yide-v2.css` `:root`. Port to your token file.

### Colors
```css
--color-brand:        #DAC858;  /* muted gold — top band, dividers, accents, pips */
--color-brand-strong: #d99c09;  /* gold-strong — hovers, mono labels, emphasis */
--color-text:         #5a5655;  /* body + heading (warm gray-brown) */
--color-heading:      #5a5655;
--color-text-soft:    #8a8584;
--color-text-muted:   #a8a4a3;
--color-muted-border: #DDDDDD;  /* default 1px border */
--color-hairline:     #ebe9e7;  /* lighter divider */
--color-soft-surface: #E7ECEF;
--color-page:         #FAFBFC;  /* page background (near-white) */
--color-white:        #ffffff;
--color-footer:       #3f3f3f;  /* footer bg */
--color-footer-text:  #b8b3b1;
```
Single-accent discipline: gold (`--color-brand`) is the only brand voltage; `--color-brand-strong`
is its hover/emphasis pair. No other saturated colors.

### Typography — two families
- **Noto Sans TC** (300/400/500/600/700) — everything: display headings (600), body, nav, buttons.
  (Note: unlike v1, **v2 uses NO serif display face**.)
- **Geist Mono** (400/500) — eyebrow labels, `.ico` badges, status chips, counters, metadata keys.
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
```
Type scale: `--text-xs 12 / sm 14 / base 16 / lg 18 / xl 22 / 2xl 28 / 3xl 40 / 4xl 50`.
Page-head H1 uses `clamp(36px,5vw,56px)`; section H2 large 600.

### Spacing / layout
`--container-max:1280px`, `--container-narrow:750px`, `--gutter:24px` (`48px` ≥960),
`--section-y:80px` (`100` lg, `50` mobile). Nav `gap:36px`; dropdown shadow
`0 18px 40px -16px rgba(40,36,34,.28)`. Corners are mostly square; buttons/chips use small radii
(4px buttons, pill chips). Keep it flat — depth comes from hairlines, not shadows.

---

## Components (behavior detail)

| Component | Key behavior |
|---|---|
| **Header dropdown** | Hover-open on desktop; click-toggle on touch; closes on outside click. Chevron rotates 180°. URLs for LINE/FB injected from config. |
| **Mobile menu** | `< 980px`: hamburger toggles a slide-down panel; dropdown becomes an accordion. Tapping a link closes the panel. |
| **Property registry** | Static list, **not clickable**, no per-property detail page. Vacant-first sort. Client pager 8/page; hide pager when ≤ 8. Address split via regex `^(.+?[市縣].+?[區鄉鎮市])(.*)$` → district prefix muted. |
| **FAQ** | Native `<details>` accordion (CSS-only); first item open; `+` rotates to `×`. |
| **News list/article** | Real Astro routes preferred. Category filter; copy-link share; print button (`window.print()`). |
| **Lead CTA / nav 預約賞屋 / header CTA** | External Google Form links — open in a new tab (`target=_blank rel=noopener`), URLs from Site Settings. |

### Data fetching / “state”
- **Build-time (Tina):** site settings, home content, tenant/landlord content, `faqs`, `news`.
- **Property availability (API):** render at build from
  `GET /api/v1/public/properties/availability` under `BRAND_API_BASE_URL`;
  optionally re-fetch client-side on mount to refresh vacancy if a later issue
  accepts that freshness behavior. Accept `{items:[...]}`. Empty →
  `目前無可入住物件。` (muted, centered). Error → console.error + graceful
  empty/skeleton, never crash.
- Pagination state lives only in the property registry (client island, or `?page=` SSR).

---

## TinaCMS — proposed collections

Authoritative field-by-field map is in **`CONTENT-MODEL.md`**. Summary:

```
siteSettings   (singleton)  brandName, brandNameEn, logo,
                            contact{ phone,email,address,hours },
                            social{ lineUrl, fbUrl, fbLabel },
                            forms{ viewingUrl, landlordUrl },
                            footerTagline, copyright
pages/home     (singleton)  hero, dualEntry[], about{…,services[]}, interior[],
                            ctaBand, credentials[], faqIntro, contact
pages/tenant   (singleton)  head, listIntro, cta
pages/landlord (singleton)  head, services[], photo, cta
pages/news     (singleton)  head
faqs           (collection) question, answer, sort_order
news           (collection) slug, category, title, excerpt, cover, date,
                            author, read_min, tags[], body(rich-text)
```
Property availability is **NOT** in Tina — it’s the backend API below.

---

## Backend API (the only non-Tina data)

Read-only JSON, used by `tenant.astro`.

```ts
export type PropertyAvailability = {
  property_id: string;
  property_public_name: string;
  address: string;
  has_vacant_room: boolean;
};
// endpoint returns { items: PropertyAvailability[] }
```
Endpoint base URL is configured with `BRAND_API_BASE_URL`; the production path is
`/api/v1/public/properties/availability`. Sort vacant-first client-side. Mock
payload: `reference/mock/availability.json`.

---

## Config (`reference/scripts/yide-config.js`)

Today the reference centralizes swap-in URLs in one global. In Astro, fold these into Tina
**Site Settings** (or env). `yide-nav.js` reads them and injects `href`s onto any
`[data-yide="…"]` element:

```js
window.YIDE_CONFIG = {
  PROPERTIES_API: "",                         // → backend availability endpoint
  FORM_VIEWING:   "https://docs.google.com/forms/",  // 預約賞屋
  FORM_LANDLORD:  "https://docs.google.com/forms/",  // 房東預約諮詢
  LINE_URL: "#",   // LINE 官方帳號
  FB_URL:   "#"    // FB
};
```
`data-yide` hooks in the markup: `form-viewing`, `form-landlord`, `line`, `fb`.
**All of these are placeholders — see “To fill in” below.**

Production Astro should not depend on `window.YIDE_CONFIG` for public content.
Use Tina site settings for LINE/FB/forms and `BRAND_API_BASE_URL` for the
availability API. Cloudflare Pages remains the deployment target.

---

## Assets

| Asset | File | Used on |
|---|---|---|
| Logo | `uploads/logos/logo-main-1.png` | header/footer (all) |
| Hero photo | `uploads/hero/index-slider-1.jpg` | home hero |
| Owner photo | `uploads/trust/team-inan.jpg` | home About |
| Interior ×3 | `uploads/interior/index-infobox-1..3.jpg` | home interior band |
| CTA banner | `uploads/banners/banner-img-1.jpg` | home service CTA |
| Certificates ×3 | `uploads/trust/cert-rental-service.jpg`, `cert-association.jpg`, `cert-rental.jpg` | home credentials |
| Landlord photo | `uploads/interior/index-infobox-1.jpg` | landlord page |
| News covers | `uploads/interior/index-infobox-1..5.jpg`, `uploads/banners/banner-img-2.jpg` | news posts (per `mock/news.json`) |

Fonts: Google Fonts (Noto Sans TC, Noto Sans, Geist Mono) — consider self-hosting a subset for perf.
Icons are inline stroke SVGs (arrow, chevron, plus, phone, link, print) — no icon library.

---

## To fill in before launch (placeholders)

1. **Real URLs:** LINE official account, FB page, the two Google Forms, the property-availability API endpoint.
2. **FB display name** “不動產何男” is transcribed from the client’s sketch — confirm exact wording.
3. **News body format:** mock uses typed blocks; convert to Tina rich-text(MDX) with styles for lede / callout.

---

## Files in this handoff

```
design_handoff_yide_site/
├── README.md                 ← this file
├── CONTENT-MODEL.md          ← per-page content-source map + Tina schema (authoritative)
└── reference/
    ├── index-v2.html         ← 首頁
    ├── tenant.html           ← 我是房客
    ├── landlord.html         ← 我是房東
    ├── news-app.html         ← 最新消息 (list + article SPA)
    ├── styles/               ← yide-v2.css (+ sections / assets / news)
    ├── scripts/              ← yide-nav.js (nav + config wiring), yide-config.js
    ├── mock/                 ← profile / faqs / news / availability JSON
    └── uploads/              ← referenced images only (logos, hero, interior, trust, banners)
```

To preview: open any `reference/*.html` in a browser. Inline JS fetches `mock/*.json`; nav,
dropdown, FAQ, pagination and news routing all work locally.

---

## Suggested implementation order

1. Scaffold/align Astro static output for Cloudflare Pages; port the 4 CSS files and load fonts.
2. Build **Site Settings** in Tina; wire `SiteHeader` (nav + dropdown + mobile) and `SiteFooter` from it.
3. Static home bands (Hero, DualEntry, About, Interior, CtaBand, Credentials) from `pages/home`.
4. `faqs` collection → FAQ; Contact band from Site Settings.
5. `tenant.astro` page content from `pages/tenant`; **PropertyRegistry** from the backend API (+ pager, empty/error states).
6. `landlord.astro` from `pages/landlord`.
7. `news` collection → list route + `[slug]` article route (rich-text body, category filter, share).
8. Replace all placeholder URLs with the real LINE/FB/Forms/API values; QA mobile menu + dropdown.
9. Configure Cloudflare Pages build-time environment variables and deploy from the accepted branch flow.
