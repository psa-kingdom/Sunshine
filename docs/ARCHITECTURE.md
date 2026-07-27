# Architecture Document
### Sunshine Public School — Official Website
**Version:** 1.0.0 | **Status:** Active | **Last Updated:** July 2026

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│   HTML · CSS · React Islands · Google Fonts             │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│           Cloudflare Edge Network (Production)          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Cloudflare Worker (Vinext SSR)           │   │
│  │  worker/index.ts  →  Vinext RSC/SSR Engine       │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │  React Server Components (app/page.tsx)   │  │   │
│  │  │  Root Layout (app/layout.tsx)             │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐                    │
│  │  D1 SQLite  │    │  R2 Storage  │  (future phases)   │
│  └─────────────┘    └──────────────┘                    │
└─────────────────────────────────────────────────────────┘

Local Development:
  Vite Dev Server → Miniflare (D1/R2 emulation) → Browser
```

---

## 2. Framework Architecture: Vinext

**Vinext** is an open-source Next.js-compatible framework that compiles a Next.js App Router application to run as a **Cloudflare Worker** instead of Node.js. It is the core meta-framework powering this project.

### 2.1 How Vinext Works

```
Source (TSX/CSS)
       │
       ▼ vite build (5 environments in sequence)
┌────────────────────────────────────────────────┐
│  [1/5] Analyze Client References               │
│    — Scans RSC tree for "use client" components │
│                                                 │
│  [2/5] Analyze Server References               │
│    — Scans SSR tree for "use server" actions    │
│                                                 │
│  [3/5] Build RSC Environment                   │
│    — Server Components → dist/server/index.js   │
│    — CSS → dist/server/assets/*.css             │
│                                                 │
│  [4/5] Build Client Environment                │
│    — React runtime + client chunks              │
│    — → dist/client/assets/*.js, *.css           │
│                                                 │
│  [5/5] Build SSR Environment                   │
│    — SSR entry for first-paint HTML             │
│    — → dist/server/ssr/index.js                 │
└────────────────────────────────────────────────┘
```

### 2.2 Request Lifecycle (Production)

```
Browser Request
      │
      ▼
Cloudflare Worker Entry (worker/index.ts)
      │  delegates to Vinext runtime
      ▼
Vinext RSC Router
      │  matches URL → app/page.tsx
      ▼
React Server Components Execute (server-side)
      │  renders HTML + RSC payload
      ▼
SSR Entry (dist/server/ssr/index.js)
      │  hydrates RSC payload → full HTML string
      ▼
Response: HTML + Link CSS + script[__VINEXT_RSC_CHUNKS__]
      │
      ▼
Browser receives HTML → paints → hydrates React client
```

---

## 3. File Architecture

### 3.1 Application Layer (`app/`)

```
app/
├── layout.tsx        Root layout — runs on every route
│                     Responsibilities:
│                       · Imports Google Fonts (Cinzel, Outfit, Plus Jakarta Sans)
│                       · Injects CSS variable classes onto <body>
│                       · Sets <html lang="en"> and metadata defaults
│                       · Renders <Metadata> (title, description, icons)
│
├── page.tsx          Homepage component — single RSC (no "use client")
│                     Sections (in order):
│                       · Utility Bar
│                       · Sticky Header & Navigation
│                       · Hero Section
│                       · Announcement Bar
│                       · Quick Access Grid
│                       · About / Intro
│                       · Academic Programs
│                       · Achievements
│                       · Student Life Gallery
│                       · News & Notices
│                       · Admissions CTA
│                       · Footer
│
├── globals.css       CSS Design System (968 lines)
│                     Structure:
│                       · CSS custom properties (:root token block)
│                       · Reset + base styles
│                       · Component-scoped class rules (no global resets beyond box-sizing)
│                       · Responsive media queries (≤1024px, ≤640px)
│
└── chatgpt-auth.ts   Sign-in with ChatGPT helpers
                      Exports: getChatGPTUser(), requireChatGPTUser(),
                               chatGPTSignInPath(), chatGPTSignOutPath()
                      Note: not used in v1 homepage — available for portal pages
```

### 3.2 Worker Layer (`worker/`)

```
worker/
└── index.ts          Cloudflare Worker fetch handler
                      · Imports and delegates to Vinext's internal fetch handler
                      · Exposes CF env bindings (DB, R2) to the RSC layer
                      · Handles 404/500 error boundaries at the edge
```

### 3.3 Database Layer (`db/`)

```
db/
├── index.ts          Drizzle client initializer
│                     · Reads CF D1 binding from Worker env (`env.DB`)
│                     · Exports a drizzle() instance for use in Server Components
│
└── schema.ts         Drizzle table definitions
                      · Currently an empty scaffold (v1 — no live queries)
                      · Designed for future: notices, news, admissions_enquiries tables
```

### 3.4 Build Infrastructure (`build/`, `scripts/`)

```
build/
└── sites-vite-plugin.ts    Custom Vite plugin from the OpenAI Sites platform
                             · Injects Sites-specific build optimizations
                             · Validates artifact manifest format

scripts/
├── build-verified.sh        Production build with timeout + validation
├── install-ci.sh            Offline-preferring npm ci (lockfile-only install)
├── sites-env.sh             Sets project-local $HOME, npm cache, XDG paths
└── validate-artifact.sh     Checks dist/ for valid ESM default.fetch export
```

---

## 4. CSS Architecture

The design system uses a **flat CSS custom property (token) approach** — no utility-class frameworks, no CSS Modules, no CSS-in-JS.

### 4.1 Token Hierarchy

```
:root                           ← All CSS variables declared here
  ├── Typography tokens
  │     --font-display          (Cinzel — serif headings)
  │     --font-heading          (Outfit — UI sans)
  │     --font-body             (Plus Jakarta Sans — body)
  │
  ├── Color tokens
  │     --navy-{900,800,700,600} (dark navy scale)
  │     --gold-{500,400,300,100} (gold accent scale)
  │     --cream-{50,100}         (warm neutral backgrounds)
  │     --surface-card           (card white)
  │     --text-{primary,secondary,muted}
  │     --border-{subtle,glass}
  │
  └── Shadow tokens
        --shadow-{sm,md,lg,gold}
```

### 4.2 Component Class Naming

Classes follow a semantic-BEM-hybrid convention (no utility classes):

| Pattern | Example | What It Styles |
|---|---|---|
| Section | `.hero`, `.programs`, `.life`, `.news` | Full page sections |
| Layout wrapper | `.wrap`, `.sectionHead`, `.cardGrid` | Layout containers |
| UI Component | `.programCard`, `.statBox`, `.newsCard` | Repeatable components |
| State modifier | `.active`, `.one`, `.two`, `.three` | Modifier variants |
| Primitive | `.goldButton`, `.outlineButton`, `.textLinkDark` | Reusable interactive elements |

### 4.3 Responsive Strategy

```css
/* Mobile-first base styles in the component blocks */

@media (max-width: 1024px) {
  /* Tablet breakpoint — collapse multi-column grids */
  .hero { grid-template-columns: 1fr; }
  .cardGrid { grid-template-columns: 1fr; }
  /* ... */
}

@media (max-width: 640px) {
  /* Mobile breakpoint — stack everything, hide secondary elements */
  .admissionTop { display: none; }  /* Replaced by hamburger */
  .mainNav { display: none; }       /* CSS :target toggle */
  .heroActions { flex-direction: column; }
  /* ... */
}
```

---

## 5. Font Loading Architecture

Fonts are loaded via Next.js `next/font/google` which:

1. **Downloads fonts at build time** to `dist/client/assets/_vinext_fonts/`
2. **Self-hosts the WOFF2 files** — no Google Fonts CDN requests in production
3. **Injects CSS `@font-face` declarations** with `font-display: swap`
4. **Exposes CSS variables** via `className` on `<body>`

```tsx
// app/layout.tsx
const cinzel = Cinzel({ variable: "--font-cinzel", subsets: ["latin"], weight: ["500","600","700","800"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400","500","600","700"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], weight: ["400","500","600","700"] });

// <body className={`${cinzel.variable} ${outfit.variable} ${jakarta.variable}`}>
// ↓ this exposes:
//   var(--font-cinzel)   → the loaded Cinzel typeface
//   var(--font-outfit)   → the loaded Outfit typeface
//   var(--font-jakarta)  → the loaded Plus Jakarta Sans typeface
```

---

## 6. Vite Configuration

[`vite.config.ts`](../vite.config.ts) configures the build pipeline:

```typescript
plugins: [
  vinext(),     // Compiles Next.js App Router → Cloudflare Worker
  sites(),      // OpenAI Sites platform integration + artifact validation
  // cloudflare() — conditionally loaded only when ENABLE_CLOUDFLARE_DEV=true
]

server: {
  host: "0.0.0.0",                     // Accessible from network (for device testing)
  allowedHosts: ["terminal.local"],     // Codex preview environment host
  watch: {                              // macOS seatbelt sandbox polling
    useFsEvents: false, usePolling: true  // Only in CODEX_SANDBOX=seatbelt
  }
}
```

### 6.1 Cloudflare Plugin Guard

The Cloudflare Vite plugin (`@cloudflare/vite-plugin`) requires a working Wrangler/Miniflare process. On Windows without the proper stdin pipe, it throws `Error: write EOF`. The plugin is therefore **opt-in for local dev**:

```typescript
if (process.env.ENABLE_CLOUDFLARE_DEV === "true") {
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  plugins.push(cloudflare({ ... }));
}
```

---

## 7. Data Flow Architecture

### 7.1 v1 — Static (Current)

```
build time:  app/page.tsx → vite build → dist/server/index.js
                                        dist/client/assets/
                                        dist/server/ssr/

runtime:     Request → Worker → Vinext → renders page.tsx (no DB queries)
                              → returns HTML + CSS + RSC chunks
```

### 7.2 v1.1 — Semi-Dynamic (Planned)

```
runtime:     Request → Worker → Vinext → page.tsx
                                           │
                                           ├── await db.select(notices)   ← D1 query
                                           └── renders HTML with live data
```

### 7.3 D1 Schema Plan (Phase 2)

```typescript
// db/schema.ts (future)
export const notices = sqliteTable("notices", {
  id:         integer("id").primaryKey({ autoIncrement: true }),
  title:      text("title").notNull(),
  body:       text("body"),
  publishedAt: text("published_at").notNull(),
  active:     integer("active", { mode: "boolean" }).default(true),
});

export const enquiries = sqliteTable("enquiries", {
  id:         integer("id").primaryKey({ autoIncrement: true }),
  parentName: text("parent_name").notNull(),
  email:      text("email").notNull(),
  phone:      text("phone"),
  grade:      text("grade_sought"),
  createdAt:  text("created_at").notNull(),
});
```

---

## 8. Authentication Architecture

Authentication is handled by `app/chatgpt-auth.ts` using **Sign in with ChatGPT (SIWC)** — OpenAI's hosted identity layer.

### 8.1 Auth Header Injection (Hosting Platform)

The OpenAI Sites hosting platform injects identity headers per-request:

| Header | Value | When Present |
|---|---|---|
| `oai-authenticated-user-email` | User's email address | SIWC authenticated |
| `oai-authenticated-user-full-name` | Percent-encoded UTF-8 name | SIWC with name claim |
| `oai-authenticated-user-full-name-encoding` | `"percent-encoded-utf-8"` | When full name present |

### 8.2 Auth Helper API

```typescript
import { getChatGPTUser, requireChatGPTUser } from "./chatgpt-auth";

// Optional auth — returns null if not signed in
const user = await getChatGPTUser();

// Required auth — redirects anonymous visitors to SIWC sign-in
const user = await requireChatGPTUser("/parent-dashboard");
```

### 8.3 Reserved Platform Routes

These routes are **owned by the hosting platform** — do not implement app routes for them:

- `/signin-with-chatgpt`
- `/signout-with-chatgpt`
- `/callback`

---

## 9. Security Architecture

| Concern | Approach |
|---|---|
| **HTTPS enforcement** | Enforced at Cloudflare edge — no HTTP served |
| **XSS** | React's JSX escaping; no `dangerouslySetInnerHTML` in use |
| **Content-Security-Policy** | Not yet configured — planned for Phase 2 |
| **PII** | No client-side PII collection in v1 |
| **External links** | `rel="noopener noreferrer"` on all `target="_blank"` links |
| **Auth tokens** | OAuth cookies managed entirely by the hosting platform |
| **D1 access** | Only accessible server-side via CF Worker bindings |

---

## 10. Performance Architecture

### 10.1 Build Output Sizes

| Asset | Size | Gzipped |
|---|---|---|
| `index-*.css` (design system) | ~15 kB | ~3.5 kB |
| `framework-*.js` (React runtime) | ~190 kB | ~60 kB |
| `index-*.js` (app code) | ~80 kB | ~25 kB |
| `rolldown-runtime-*.js` | ~0.7 kB | ~0.4 kB |
| **Total JS** | **~271 kB** | **~85 kB** |

### 10.2 Font Performance

Fonts are **self-hosted** at build time by `next/font/google`. No DNS lookup, no third-party network roundtrip. Browser receives `<link rel="preload">` for each WOFF2 file in the `<head>`.

### 10.3 Image Performance

The hero image (`public/hero-school.png`, 2.1 MB) is served directly from Cloudflare's CDN with edge caching. **Future optimization:** Convert to AVIF/WebP and add `width`/`height` attributes to prevent CLS.

### 10.4 CSS Architecture Impact

- No runtime CSS-in-JS — zero JS overhead for styling
- Flat token cascade — computed once per page load
- `backdrop-filter: blur` on sticky nav uses GPU compositing layer

---

## 11. Local Development vs. Production Differences

| Aspect | Local Dev (Vite) | Production (Cloudflare Worker) |
|---|---|---|
| Server runtime | Node.js (Vite dev server) | Cloudflare V8 isolate |
| CSS serving | Hot Module Replacement via `/app/globals.css` | Embedded in `index-*.css` chunk |
| Font serving | Via Next.js dev font server | Self-hosted WOFF2 in `_vinext_fonts/` |
| D1 database | Miniflare SQLite emulation | Real Cloudflare D1 at edge |
| Environment vars | `.env.local` | Cloudflare Secrets / env bindings |
| Cloudflare plugin | Optional (`ENABLE_CLOUDFLARE_DEV=true`) | Always bundled in worker |

---

## 12. Deployment Architecture

```
Developer → git push main
                │
                ▼
         OpenAI Sites CI
                │
                ├── npm run install:ci    (offline-first lockfile install)
                ├── npm run build         (npx vite build, 5-environment sequence)
                └── npm run validate:artifact   (ESM + manifest validation)
                │
                ▼
         dist/ artifact uploaded to Cloudflare
                │
                ▼
         Cloudflare Workers platform
                │
                ├── dist/server/index.js         → Worker script
                ├── dist/client/assets/*         → R2 or KV (CDN assets)
                └── dist/server/wrangler.json    → Routing + bindings config
```

---

## 13. Hallmark Design Skill Architecture

The [nutlope/hallmark](https://github.com/Nutlope/hallmark) design skill is installed at:

```
.agents/skills/hallmark/
├── SKILL.md                      Main instruction file (68 kB)
└── references/
    ├── slop-test.md              58 anti-slop gates + 6-axis self-critique
    ├── anti-patterns.md          Visual/structural patterns to avoid
    ├── macrostructures.md        21 structural patterns to choose from
    ├── typography.md             Type pairing and hierarchy rules
    ├── color.md                  OKLCH palette guidance
    ├── responsive.md             Mobile-first non-negotiables
    ├── microinteractions.md      Interaction and animation rules
    └── ...                       (24 reference files total)
```

### 13.1 Applied Design Decisions (v1.0)

| Hallmark Decision | Applied Value |
|---|---|
| **Theme** | Royal Heritage (navy + gold editorial) |
| **Macrostructure** | Atelier Editorial (asymmetric, off-axis hero, numeral anchors) |
| **Genre** | Editorial (Cinzel display serif, precise whitespace) |
| **Pre-emit score** | `P5 H5 E5 S5 R5 V5` (all passing) |
| **Anti-pattern avoidance** | No gradient text, no centred-everything hero, no `transition: all` |

---

*Architecture maintained by: Sunshine Public School Digital Team | CBSE Affiliation No. 1234567*
