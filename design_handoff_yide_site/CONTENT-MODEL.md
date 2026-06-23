# 內容來源對照表（Content Model）— 奕德不動產官網

> 目的：在 handoff 給工程團隊前，先把**每一個頁面、每一塊內容**會由「TinaCMS 編輯」、「後端 API 取得」還是「全站設定」標示清楚，讓 Astro + TinaCMS 的 schema 設計一目了然。
>
> 對應的設計檔（現行版本）：`index-v2.html`（首頁）、`tenant.html`（我是房客）、`landlord.html`（我是房東）、`news-app.html`（最新消息）。
> 舊版單頁 `design_handoff_yide_brand/` 為 v1 參考，內容模型以本文件為準。

---

## 1. 架構摘要

| 層 | 負責內容 | 技術 |
|---|---|---|
| **TinaCMS**（Git-backed，commit 進 repo） | 所有「行銷／編輯型」文案、圖片、最新消息、FAQ、聯絡資訊 | Astro build 時讀 Tina collection（markdown / json） |
| **後端 API**（read-only JSON） | 即時變動的**物件出租列表**（空房狀態） | Astro build 時或 client 端 fetch |
| **全站設定 Site Settings**（Tina global / 單例） | 品牌、聯絡方式、社群連結、Google 表單網址 | Tina singleton，集中管理，所有頁面共用 |

> 集中設定檔目前在 reference 的 `scripts/yide-config.js`（表單 / LINE / FB / 外部物件 API 網址）。
> handoff 後請對應到 Tina 的 `siteSettings` 或 Cloudflare Pages build-time 環境變數。

### 來源標記（本文件表格通用）
- 🟢 **Tina** — TinaCMS 可編輯內容
- 🔵 **API** — 後端 API 取得（不進 Tina）
- ⚙️ **Settings** — 全站設定（Tina 單例，跨頁共用）
- ▪️ **Code** — 結構性／版型，不需 CMS（如 nav 結構、icon、SVG）

---

## 2. 全站共用（Header / Footer / 聯絡下拉）

這些區塊出現在**每一頁**，建議全部綁到 `siteSettings` 單例，改一次全站生效。

| 內容 | 範例值 | 來源 | 建議欄位 |
|---|---|---|---|
| 品牌中文名 | 奕德不動產 | ⚙️ Settings | `site.brandName` (string) |
| 品牌英文名 | Trust Estate | ⚙️ Settings | `site.brandNameEn` (string) |
| Logo 圖檔 | `uploads/logos/logo-main-1.png` | ⚙️ Settings | `site.logo` (image) |
| 主選單項目與連結 | 最新消息／關於奕德／我是房客／我是房東／預約賞屋 | ▪️ Code | 結構固定，標籤可選擇性放 `site.nav[]` |
| 電話 | 06-208-1688 | ⚙️ Settings | `site.contact.phone` (string) |
| Email | hello@yide.tw | ⚙️ Settings | `site.contact.email` (string) |
| 地址 | 台南市東區東門路二段 158 號 3 樓 | ⚙️ Settings | `site.contact.address` (string) |
| 營業時間 | 平日 10:00 — 19:00 · 例假日預約制 | ⚙️ Settings | `site.contact.hours` (string) |
| LINE 官方帳號連結 | （待填） | ⚙️ Settings | `site.social.lineUrl` (string) |
| FB 連結 | （待填） | ⚙️ Settings | `site.social.fbUrl` (string) |
| FB 顯示名稱 | 不動產何男 | ⚙️ Settings | `site.social.fbLabel` (string) |
| Google 表單 — 預約賞屋 | （待填） | ⚙️ Settings | `site.forms.viewingUrl` (string) |
| Google 表單 — 房東預約諮詢 | （待填） | ⚙️ Settings | `site.forms.landlordUrl` (string) |
| Footer 標語 | 深耕大台南，提供包租代管與居住服務。一份合約，雙向安心。 | ⚙️ Settings | `site.footerTagline` (string) |
| 版權字串 | © 2026 奕德不動產 Trust Estate | ⚙️ Settings | `site.copyright` (string) |

> 聯絡下拉選單（聯絡我們）與首頁 Contact 區塊**共用同一組** `site.contact` + `site.social`，已對齊：LINE / FB / 電話 / Email / 地址 / 營業時間。

---

## 3. 首頁 `index-v2.html`

建議用一個單例 collection `pages/home`。

| 區塊 | 內容欄位 | 來源 | 建議欄位（`pages/home`） |
|---|---|---|---|
| Hero | eyebrow「Tainan · Property Service」 | 🟢 Tina | `hero.eyebrow` (string) |
| Hero | 主標「把房子的事，交給更穩的人。」 | 🟢 Tina | `hero.title` (string, 允許換行) |
| Hero | 副文案 | 🟢 Tina | `hero.subtitle` (text) |
| Hero | 背景大圖 | 🟢 Tina | `hero.image` (image) |
| 雙入口卡 ×2 | 標籤 / 標題 / 說明 / 按鈕文字 | 🟢 Tina | `dualEntry[]` { tag, title, body, ctaLabel } |
| 雙入口卡 ×2 | 連結目標（→ 房客頁 / 房東頁） | ▪️ Code | 站內路由固定 |
| 關於奕德 | eyebrow / 標題 / lede | 🟢 Tina | `about.eyebrow / title / lede` |
| 關於奕德 | 負責人照片 + 職稱 + 姓名 | 🟢 Tina | `about.photo` (image), `about.ownerRole`, `about.ownerName` |
| 關於奕德 | 服務四點（01–04：標題＋說明） | 🟢 Tina | `about.services[]` { title, body } |
| 關於奕德 | 引言區（quote 文字＋署名） | 🟢 Tina | `about.quote`, `about.quoteMeta` |
| 室內意象帶 | 三張圖（圖檔＋編號標題＋說明） | 🟢 Tina | `interior[]` { image, kicker, caption } |
| 影像 CTA 帶 | eyebrow / 標題 / 副文 / 兩個按鈕文字 / 背景圖 | 🟢 Tina | `ctaBand` { eyebrow, title, subtitle, image, buttons[] } |
| 合法登記（Credentials） | eyebrow / 標題 / lede | 🟢 Tina | `credentials.eyebrow / title / lede` |
| 合法登記 | 三張證書（圖檔＋編號＋標題＋說明） | 🟢 Tina | `credentials.items[]` { image, kicker, title, body } |
| FAQ | 區塊 eyebrow / 標題 / lede | 🟢 Tina | `faqIntro` { eyebrow, title, lede } |
| FAQ | 問答清單本身 | 🟢 Tina | → 獨立 collection `faqs`（見 §6） |
| Contact 區塊 | eyebrow / 標題 / lede / 兩個 CTA 文字 | 🟢 Tina | `contact` { eyebrow, title, lede } |
| Contact 區塊 | 電話 / Email / 地址 / 營業時間 / LINE / FB | ⚙️ Settings | 取自 `site.contact` + `site.social` |

> 註：首頁原本的「可入住物件」列表區塊**已移除**（物件清單統一在「我是房客」頁），因此首頁不再打物件 API。

---

## 4. 我是房客 `tenant.html`

單例 `pages/tenant` + 物件列表走 **API**。

| 區塊 | 內容欄位 | 來源 | 建議欄位 |
|---|---|---|---|
| 頁首 Page Head | 麵包屑「我是房客」 | ▪️ Code | 固定 |
| 頁首 | eyebrow「For Tenants」/ 標題 / lede | 🟢 Tina | `pages/tenant.head` { eyebrow, title, lede } |
| 列表標頭 | eyebrow「Available Now」/ 標題「出租物件一覽」/ lede | 🟢 Tina | `pages/tenant.listIntro` { eyebrow, title, lede } |
| **物件列表** | 編號／物件名／地址／空房狀態（不可點擊） | 🔵 **API** | 見 §7，欄位 `property_public_name`, `address`, `has_vacant_room` |
| 引導 CTA | eyebrow / 標題 / 說明 / 按鈕文字 | 🟢 Tina | `pages/tenant.cta` { eyebrow, title, body, ctaLabel } |
| 引導 CTA | 按鈕連結（→ Google 預約賞屋表單） | ⚙️ Settings | `site.forms.viewingUrl` |

---

## 5. 我是房東 `landlord.html`

單例 `pages/landlord`。此頁**沒有** API 資料，全部 Tina + Settings。

| 區塊 | 內容欄位 | 來源 | 建議欄位 |
|---|---|---|---|
| 頁首 | eyebrow「For Landlords」/ 標題「把空房，換成穩定的月入。」/ lede | 🟢 Tina | `pages/landlord.head` { eyebrow, title, lede } |
| 服務價值 | 四點（01–04：標題＋說明） | 🟢 Tina | `pages/landlord.services[]` { title, body } |
| 服務價值 | 搭配圖片 | 🟢 Tina | `pages/landlord.photo` (image) |
| 引導 CTA | eyebrow / 標題 / 說明 / 按鈕文字 | 🟢 Tina | `pages/landlord.cta` { eyebrow, title, body, ctaLabel } |
| 引導 CTA | 按鈕連結（→ Google 房東預約諮詢表單） | ⚙️ Settings | `site.forms.landlordUrl` |

---

## 6. 最新消息 `news-app.html`

最新消息＝典型部落格，**整批走 TinaCMS collection**（每篇一個 entry）。

| 區塊 | 內容欄位 | 來源 | 建議欄位 |
|---|---|---|---|
| 頁首 | eyebrow「News & Updates」/ 標題 / lede | 🟢 Tina | `pages/news.head` { eyebrow, title, lede } |
| 分類篩選 | 分類清單（公告／房東指南／物件動態／房客指南…） | 🟢 Tina | 由 `news` 各篇的 `category` 自動彙整 |
| 文章列表 / 內文 | 每篇文章 | 🟢 Tina | → collection `news`（見下） |

### `news` collection 欄位（對照 `mock/news.json`）

| 欄位 | 型別 | 說明 |
|---|---|---|
| `slug` | string | 網址用 slug（唯一） |
| `category` | string（建議 options） | 公告 / 房東指南 / 物件動態 / 房客指南 |
| `title` | string | 標題 |
| `excerpt` | text | 列表摘要 |
| `cover` | image | 封面圖 |
| `date` | datetime | 發布日期 |
| `author` | string | 預設「奕德編輯部」 |
| `read_min` | number | 閱讀分鐘數 |
| `tags` | string[] | 標籤 |
| `body` | rich-text | 內文。現為結構化區塊（`lede` / `h2` / `p` / `callout`）；建議改成 Tina 的 **rich-text（MDX）**，再以 markdown 樣式對應 lede／小標／引述框 |

### FAQ collection `faqs`（對照 `mock/faqs.json`）

| 欄位 | 型別 | 說明 |
|---|---|---|
| `question` | string | 問題 |
| `answer` | text | 答案 |
| `sort_order` | number | 排序（小到大） |

---

## 7. 後端 API（不進 Tina）

唯一保留在後端 API 的，是**物件出租列表**（空房狀態會即時變動，由物業管理端同步）。

| 端點 | 用於頁面 | 回傳 |
|---|---|---|
| `GET /api/v1/public/properties/availability`（base URL 由 `BRAND_API_BASE_URL` 提供） | 我是房客 `tenant.html` | `{ items: [...] }` |

物件欄位：

| 欄位 | 型別 | 用途 |
|---|---|---|
| `property_id` | string | 唯一識別 |
| `property_public_name` | string | 物件名（列表顯示） |
| `address` | string | 地址（前端會自動切出行政區前綴） |
| `has_vacant_room` | boolean | 空房 →「可入住」/「滿房」 |

> reference 原型在 `PROPERTIES_API` 留空時會 fallback 到 `./mock/availability.json` 方便本機預覽。
> production Astro 應使用 `BRAND_API_BASE_URL` 組出正式 public availability endpoint。
> 列表**不可點擊**（無單一物件詳情頁）；排序為「可入住優先」。

---

## 8. 建議的 TinaCMS collection 總覽

```
tina/
  siteSettings        (單例)   品牌 / 聯絡 / 社群 / 表單網址 / footer
  pages/
    home              (單例)   首頁所有區塊
    tenant            (單例)   我是房客頁文案 + CTA
    landlord          (單例)   我是房東頁文案 + 服務四點 + CTA
    news-index        (單例)   最新消息頁首文案
  faqs                (集合)   常見問題（question/answer/sort_order）
  news                (集合)   最新消息文章（每篇一個 entry）
```
物件列表 = 後端 API，不在 Tina。

---

## 9. 已確認決策 & 待補項目

**已確認（2026-06）**
1. ✅ **聯絡資訊（電話/Email/地址/營業時間）走 Tina** → 放 `siteSettings.contact`，首頁 Contact 區塊與聯絡下拉皆讀此來源。
2. ✅ **最新消息走 Tina** → `news` collection，每篇一個 entry。
3. ✅ **唯一的後端 API = 物件出租列表**（`tenant.html`）。

**待補（不影響開發，上線前填入）**
4. 實際網址：LINE 官方帳號、FB 連結、兩個 Google 表單、物件 API 端點 —— 目前皆為 placeholder（集中在 `scripts/yide-config.js`）。
5. **FB 名稱「不動產何男」** 沿用手稿，請確認正確字樣。
6. **內文格式**：`news` 的 `body` 現為結構化區塊陣列；轉 Tina 時建議改為 rich-text(MDX)，需確認 lede／callout 等樣式對應。
