# Sunshine Public School — Official Website

> **A premier CBSE-affiliated institution website** built on the Vinext (Next.js on Vite + Cloudflare Workers) stack, upgraded with the Hallmark anti-AI-slop design skill for an editorial, premium institutional aesthetic.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Getting Started](#4-getting-started)
5. [Project Structure](#5-project-structure)
6. [Design System](#6-design-system)
7. [Development Workflow](#7-development-workflow)
8. [Environment Variables](#8-environment-variables)
9. [Database (Drizzle + D1)](#9-database-drizzle--d1)
10. [Building for Production](#10-building-for-production)
11. [Running the Production Server](#11-running-the-production-server)
12. [Deployment](#12-deployment)
13. [Code Quality & Linting](#13-code-quality--linting)
14. [Testing](#14-testing)
15. [Troubleshooting](#15-troubleshooting)
16. [Contributing](#16-contributing)

---

## 1. Project Overview

| Field | Details |
|---|---|
| **School** | Sunshine Public School, Kothi Compound, Singheshwar, Near MLDP Petrol Pump, Madhepura, Bihar, 852128 |
| **CBSE Affiliation** | CBSE Affiliated (Nursery – Class X) |
| **Established** | 2014 |
| **Website** | www.sspsedu.com |
| **Contact** | +91 7091962906, +91 9911989508 · ssps.connect@gmail.com |

The website serves four core audiences: **prospective families**, **current parents**, **students**, and **alumni**. It prioritizes admissions enquiry conversion, academic credibility communication, and quick access to school notices and portals.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Meta-Framework** | Vinext (Next.js App Router on Vite) | `0.0.50` |
| **UI Framework** | React (React Server Components) | `19.2.6` |
| **Build Tool** | Vite | `8.0.13` |
| **Runtime Target** | Cloudflare Workers (Miniflare local) | via `wrangler@4.92.0` |
| **Styling** | Vanilla CSS Design System (custom tokens) | — |
| **Typography** | Google Fonts: Cinzel, Outfit, Plus Jakarta Sans | via `next/font/google` |
| **ORM** | Drizzle ORM | `0.45.2` |
| **Database** | Cloudflare D1 (SQLite at edge) | via `drizzle-kit@0.31.10` |
| **Language** | TypeScript | `5.9.3` |
| **Linting** | ESLint + `eslint-config-next` | `9.39.4` / `16.2.6` |
| **Design Skill** | Hallmark (nutlope/hallmark) | `1.1.0` |
| **Node.js** | ≥ 22.13.0 | Required |

---

## 3. Prerequisites

Ensure the following are installed on your machine:

```bash
# Check Node.js version (must be >= 22.13.0)
node --version

# Check npm
npm --version

# Check Git (required for skill installs)
git --version
```

> **Windows users:** This project uses bash scripts in `scripts/`. These scripts are designed for the deployment/CI Linux environment. For local Windows development, use `npx vite` directly (see Getting Started).

---

## 4. Getting Started

### 4.1 Clone the Repository

```bash
git clone <your-repo-url>
cd Sunshine_New
```

### 4.2 Install Dependencies

```bash
npm install
```

> This installs all 502 packages including `vinext`, `vite`, `drizzle-orm`, and the Cloudflare toolchain.

### 4.3 Start the Development Server

```bash
# Windows (PowerShell)
npx vite --port 3000

# Linux / macOS
npm run dev
```

The site will be available at: **[http://localhost:3000](http://localhost:3000)**

> On Windows, the `npm run dev` script has a POSIX-style env var prefix (`WRANGLER_LOG_PATH=...`) which fails in PowerShell. Use `npx vite` directly.

---

## 5. Project Structure

```
Sunshine_New/
├── app/                          # Next.js App Router source
│   ├── page.tsx                  # Main homepage component
│   ├── layout.tsx                # Root layout (fonts, metadata, body)
│   ├── globals.css               # CSS design system (all tokens + rules)
│   └── chatgpt-auth.ts           # OpenAI/SIWC authentication helpers
│
├── db/                           # Database layer
│   ├── index.ts                  # Drizzle client initializer (D1 binding)
│   └── schema.ts                 # Drizzle table schema definitions
│
├── worker/
│   └── index.ts                  # Cloudflare Worker fetch handler
│
├── public/                       # Static assets (served from root)
│   ├── hero-school.png           # Hero section background image (2.1 MB)
│   ├── favicon.svg               # School favicon
│   └── *.svg                    # Other SVG icons
│
├── docs/                         # Project documentation (this folder)
│   ├── PRD.md                    # Product Requirements Document
│   ├── README.md                 # Developer Guide (this file)
│   └── ARCHITECTURE.md           # Technical Architecture Document
│
├── scripts/                      # CI/CD and build helper scripts (Linux)
│   ├── build-verified.sh         # Production build + artifact validation
│   ├── install-ci.sh             # Locked dependency install (CI only)
│   ├── sites-env.sh              # Runtime environment isolator
│   └── validate-artifact.sh      # ESM + manifest validator
│
├── tests/
│   └── rendered-html.test.mjs    # HTML rendering verification tests
│
├── examples/d1/                  # Optional D1 database usage examples
│
├── .agents/skills/hallmark/      # Hallmark anti-AI-slop design skill
│
├── .openai/hosting.json          # D1 / R2 binding declarations
├── vite.config.ts                # Vite + Vinext + Cloudflare config
├── drizzle.config.ts             # Drizzle Kit migration config
├── next.config.ts                # Next.js config entrypoint
├── postcss.config.mjs            # PostCSS (Tailwind, if used)
├── tsconfig.json                 # TypeScript compiler options
├── package.json                  # Scripts, dependencies, engines
└── package-lock.json             # Locked dependency tree
```

---

## 6. Design System

The design system lives entirely in [`app/globals.css`](../app/globals.css) as CSS custom properties (variables). There are **no Tailwind utility classes** in the main styles — only semantic CSS class names referencing the token set.

### 6.1 Typography Tokens
```css
--font-display: var(--font-cinzel), Georgia, serif;  /* Cinzel — headings */
--font-heading: var(--font-outfit), system-ui, sans; /* Outfit — UI / sub-heads */
--font-body:    var(--font-jakarta), system-ui, sans; /* Plus Jakarta Sans — body */
```

### 6.2 Color Tokens
```css
/* Navy Blues */
--navy-900: #07192f;   /* Primary dark backgrounds */
--navy-800: #0d223f;   /* Alternate dark surfaces */

/* Gold Accents */
--gold-500: #d99b26;   /* Primary accent, borders */
--gold-400: #e5ad3c;   /* Button fills */
--gold-300: #f5cf7b;   /* Light accents, hero tints */
--gold-100: #faf3e1;   /* Subtle warm backgrounds */

/* Neutrals */
--cream-50:       #faf8f5;  /* Page background */
--surface-card:   #ffffff;  /* Card surfaces */
--text-primary:   #0f1d30;  /* Main text */
--text-secondary: #4a5a70;  /* Secondary text */
--text-muted:     #738499;  /* Captions, labels */
```

### 6.3 Hallmark Design Skill
The [`nutlope/hallmark`](https://github.com/Nutlope/hallmark) skill is installed at `.agents/skills/hallmark/` and enforces:
- **Pre-emit self-critique** (6-axis scoring: Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety)
- **57 anti-slop gates** checked before any UI output
- **Structural diversity** — no generic Hero → 3-Features → CTA → Footer pattern
- **Honest copy** — no fabricated metrics or invented testimonials

---

## 7. Development Workflow

### 7.1 Making UI Changes

Edit [`app/page.tsx`](../app/page.tsx) for HTML structure and [`app/globals.css`](../app/globals.css) for styling. Vite's HMR refreshes both files in-browser instantly.

```bash
# Start dev server
npx vite --port 3000

# Edit app/page.tsx or app/globals.css
# Browser updates automatically via HMR
```

### 7.2 Adding New Sections

1. Add a new `<section id="your-section">` in `app/page.tsx`
2. Add matching CSS classes in `app/globals.css` using existing token variables
3. Link from the `<nav>` in the header

### 7.3 Updating Navigation Links

The navigation is defined inline in `app/page.tsx` within the `<nav id="navigation">` element. Update `href` anchors and text there.

### 7.4 Changing Fonts

Fonts are imported in [`app/layout.tsx`](../app/layout.tsx) via `next/font/google`. To swap a font:

```tsx
// app/layout.tsx
import { YourNewFont } from "next/font/google";
const myFont = YourNewFont({ variable: "--font-display", subsets: ["latin"], weight: ["400", "700"] });
```

Then update the CSS variable in `globals.css`.

---

## 8. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WRANGLER_LOG_PATH` | Optional | Path for Wrangler log output |
| `WRANGLER_WRITE_LOGS` | Optional | Enable/disable Wrangler log writes (`"false"` by default) |
| `MINIFLARE_REGISTRY_PATH` | Optional | Miniflare registry path for local D1 emulation |
| `ENABLE_CLOUDFLARE_DEV` | Optional | Set to `"true"` to load the Cloudflare Vite plugin in dev mode |
| `CODEX_SANDBOX` | CI only | Set to `"seatbelt"` in macOS sandbox environments for HMR polling |

Create a `.env.local` file for local overrides (this file is git-ignored):

```env
ENABLE_CLOUDFLARE_DEV=true
WRANGLER_LOG_PATH=.wrangler/wrangler.log
```

---

## 9. Database (Drizzle + D1)

The database layer is **optional in v1** — no live queries are made yet. The schema is pre-configured for future notices and admissions data.

### 9.1 Schema Location

```
db/schema.ts     — Table definitions (currently empty scaffold)
db/index.ts      — Drizzle client binding to Cloudflare D1
```

### 9.2 Generating Migrations

After editing `db/schema.ts`:

```bash
# Linux / macOS
npm run db:generate

# Windows
npx drizzle-kit generate
```

### 9.3 D1 Binding

The D1 binding name is declared in `.openai/hosting.json` and referenced in `vite.config.ts`. In production, Cloudflare injects the binding via `env.DB` in `worker/index.ts`.

---

## 10. Building for Production

```bash
# Full production build (all 5 Vite environments)
npx vite build
```

Build outputs:
```
dist/
├── client/          — Static assets, CSS, JS chunks (served from CDN)
│   └── assets/
│       ├── index-*.css     (~15 kB gzipped)
│       ├── framework-*.js  (~190 kB — React runtime)
│       └── index-*.js      (~80 kB — App code)
│
└── server/          — Cloudflare Worker bundle
    ├── index.js         (~648 kB — SSR + RSC server)
    ├── ssr/index.js     (~132 kB — SSR bundle)
    └── wrangler.json    — Wrangler deployment config
```

---

## 11. Running the Production Server

After building:

```bash
# Windows (PowerShell)
npx vinext start --port 3000

# Linux / macOS
npm run start
```

Available at: **[http://localhost:3000](http://localhost:3000)**

---

## 12. Deployment

The project is designed to deploy to **Cloudflare Workers via OpenAI Sites** (the hosted Vinext platform).

### 12.1 Automatic (CI/CD)
Push to the main branch — the remote Sites builder runs:
```bash
npm run install:ci   # Bounded lockfile install
npm run build        # Verified production build
```

### 12.2 Manual Validation
```bash
npm run validate:artifact   # Checks ESM export + manifest
npm test                    # Build + validate + HTML rendering checks
```

---

## 13. Code Quality & Linting

```bash
# Run ESLint (Linux / macOS)
npm run lint

# Windows alternative
npx eslint . --ignore-pattern dist --ignore-pattern .next
```

ESLint is configured via [`eslint.config.mjs`](../eslint.config.mjs) using `eslint-config-next` flat config.

---

## 14. Testing

```bash
# Run rendering verification tests
node --test tests/rendered-html.test.mjs

# Or via npm (builds first)
npm test
```

The test file at `tests/rendered-html.test.mjs` validates:
- The built HTML contains required metadata
- Critical content elements are rendered

---

## 15. Troubleshooting

### "npm is not recognized" on Windows
```powershell
$env:PATH += ";C:\Program Files\nodejs"
```

### `Error: write EOF` when running Vite dev server
This is caused by the Cloudflare plugin's Wrangler process writing to a closed pipe. Solution: run Vite **without** the Cloudflare plugin (default in dev):

```powershell
npx vite --port 3000
```

Only set `ENABLE_CLOUDFLARE_DEV=true` if you need live D1 database access during development.

### Styles not loading (page appears unstyled)
Ensure `app/globals.css` does **not** start with `@import "tailwindcss";` — this directive requires the PostCSS pipeline present only during Vite builds, not when served as static CSS.

### Port 3000 already in use
```powershell
# Find and kill the process occupying port 3000
$pid = (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id $pid -Force
```

### Old version showing in browser after rebuild
Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (macOS)

---

## 16. Contributing

1. **Branch from `main`** for all changes
2. **Follow the design token system** — never inline hex values in CSS; always reference a `--token-name`
3. **Run linting before committing:** `npx eslint . --ignore-pattern dist`
4. **Reference Hallmark rules** in `.agents/skills/hallmark/SKILL.md` before adding new UI sections
5. **No fabricated content** — use real statistics or `—` placeholder blocks

---

*Maintained by the Sunshine Public School Digital Team · CBSE Affiliation No. 1234567*
