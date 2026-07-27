# Product Requirements Document (PRD)
### Sunshine Public School — Official Website
**Version:** 1.0.0 | **Status:** Active | **Last Updated:** July 2026

---

## 1. Executive Summary

Sunshine Public School's official website serves as the primary digital touchpoint for prospective families, current parents, students, alumni, educators, and the wider community. The site must simultaneously:

- **Convert** prospective families into applicants and campus visitors
- **Communicate** the school's academic quality, values, and culture
- **Serve** existing stakeholders (parents, students, staff) with quick access to portals and notices
- **Sustain** an institutional identity built on 25+ years of educational excellence

---

## 2. Problem Statement

The previous digital presence relied on static content that failed to:

1. Reflect Sunshine's positioning as a *premium, future-ready CBSE school*
2. Surface key admissions information effectively to prospective families
3. Provide live announcements and academic updates in a timely manner
4. Scale gracefully across mobile, tablet, and desktop devices
5. Load efficiently within India's diverse network conditions

---

## 3. Product Vision

> **"A digital campus that feels as thoughtfully designed as the physical one."**

The website should communicate premium institutional quality at first glance — through editorial typography, refined color use, and purposeful information hierarchy — while ensuring every stakeholder finds their intended action within three clicks.

---

## 4. Target Personas

### 4.1 Prospective Parent (Primary)
- **Who:** Family with children aged 3–16 exploring school options in Gurugram NCR
- **Motivation:** Understand admission criteria, fee structure, campus quality, academic outcomes
- **Key Journey:** Homepage → Academics → Admissions → Contact / Campus Tour Booking
- **Pain Point:** Uncertainty about whether Sunshine's ethos and outcomes match family aspirations

### 4.2 Current Parent
- **Who:** Family with an enrolled student
- **Motivation:** Access notices, results, schedules, and contact the school quickly
- **Key Journey:** Notices → Parent Portal (external) → Contact Helpdesk
- **Pain Point:** Finding live updates without navigating through marketing content

### 4.3 Prospective Student (Grade IX–XI)
- **Who:** Student researching subject streams and co-curricular opportunities
- **Motivation:** CBSE stream options, club offerings, peer community
- **Key Journey:** Academics → Student Life → Admissions
- **Pain Point:** Generic marketing language that doesn't speak directly to students

### 4.4 Alumni
- **Who:** Former Sunshine student seeking connection, referrals, or community updates
- **Motivation:** Stay in touch, refer Sunshine to their social network
- **Key Journey:** Alumni portal link → external destination
- **Pain Point:** Not having a clear alumni entry point on the homepage

---

## 5. Functional Requirements

### 5.1 Core Pages & Sections

| # | Section | Description | Priority |
|---|---------|-------------|----------|
| F1 | Hero Banner | Full-bleed image, school tagline, CTA buttons, key statistics | P0 |
| F2 | Announcement Bar | Live or static notice strip, linked to Notices section | P0 |
| F3 | Quick Access Grid | 4-tile shortcut: Apply, Calendar, Transport, Contact | P0 |
| F4 | About / Philosophy | Two-column editorial layout, mission, leadership link | P0 |
| F5 | Academic Programs | 3-column cards (Foundational / Middle / Senior School) | P0 |
| F6 | Achievements | Split-layout copy + 4-cell stats grid | P0 |
| F7 | Student Life Gallery | 3-panel visual gallery: Sports, Innovation, Arts | P1 |
| F8 | News & Notices | 3-column date-stamped cards linked to full notices | P1 |
| F9 | Admissions CTA | Dark navy split-layout with email & phone CTAs | P0 |
| F10 | Footer | Brand identity, 3 nav columns, address, copyright | P0 |
| F11 | Utility Bar | Contact strip + portal links (Alumni, Parent, Student) | P1 |
| F12 | Sticky Navigation | Glassmorphic sticky top nav with gold active underline | P0 |

### 5.2 Navigation Requirements

- **Sticky header** that remains visible on scroll
- **Glassmorphism treatment** (`backdrop-filter: blur`) at viewport top
- **Active state** indicated via gold underline animation
- **Mobile navigation** toggled via hamburger (CSS `:target` pattern, no JS dependency)
- **Portal links** (Parent, Student, Alumni) clearly separated in utility bar

### 5.3 Contact & Admissions Flow

- **Primary CTA:** `mailto:admissions@sunshineps.edu.in`
- **Secondary CTA:** `tel:+911145678900`
- **Campus Tour:** Button linking to phone or future booking page
- No form submission required in v1 — external email + phone sufficient

### 5.4 Content Requirements

| Content Item | Owner | Update Frequency |
|---|---|---|
| Hero image (`hero-school.png`) | Marketing | Per session |
| Admission status (open/closed) | Admissions office | Twice yearly |
| Notice bar text | Administration | Weekly |
| News article titles & dates | Communications | As published |
| Achievement statistics | Academic office | Annually |
| Contact details | Administration | Rarely changes |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Largest Contentful Paint (LCP):** < 2.5 s on 4G
- **Total Blocking Time (TBT):** < 300 ms
- **Cumulative Layout Shift (CLS):** < 0.1
- CSS bundle: < 20 kB gzipped
- JS bundle: < 300 kB total (all chunks combined)

### 6.2 Accessibility
- WCAG 2.2 AA minimum compliance
- Keyboard navigability — all interactive elements reachable via `Tab`
- `:focus-visible` rings on all interactive elements
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`, `<time>`
- `aria-label` on icon-only controls, `aria-hidden` on decorative icons

### 6.3 Responsiveness
- Tested breakpoints: `320px / 375px / 414px / 768px / 1024px / 1440px`
- `overflow-x: clip` on both `html` and `body` — no horizontal scroll at any viewport
- Grid tracks use `minmax(0, 1fr)` for image-bearing cells
- All headings wrap with `overflow-wrap: anywhere; min-width: 0`

### 6.4 Browser Support
- **Desktop:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Mobile:** iOS Safari 17+, Chrome for Android 120+

### 6.5 Security
- Content served over HTTPS only
- No user PII collected client-side in v1
- All external links use `rel="noopener noreferrer"`

---

## 7. Design System Requirements

### 7.1 Typography
| Role | Font Family | Weights Used |
|---|---|---|
| Display / Headings | Cinzel (serif) | 500, 600, 700, 800 |
| Sub-headings / UI | Outfit (sans) | 400, 500, 600, 700 |
| Body copy | Plus Jakarta Sans | 400, 500, 600, 700 |

### 7.2 Color Tokens
| CSS Variable | Hex Value | Usage |
|---|---|---|
| `--navy-900` | `#07192f` | Primary dark backgrounds |
| `--navy-800` | `#0d223f` | Alternate dark surfaces |
| `--gold-500` | `#d99b26` | Primary accent, borders |
| `--gold-400` | `#e5ad3c` | Button fills, highlights |
| `--gold-300` | `#f5cf7b` | Light accent, hero tints |
| `--cream-50` | `#faf8f5` | Page background |
| `--surface-card` | `#ffffff` | Card backgrounds |

### 7.3 Hallmark Anti-Patterns to Avoid
- ❌ No gradient text (no `background-clip: text` gradients)
- ❌ No 3-equal-column icon-above-heading tile grids
- ❌ No `min-height: 100vh` fully-centred hero
- ❌ No `transition: all` — specify individual properties
- ❌ No italic heading text (`font-style: normal` always on headings)
- ❌ No invented metrics or fabricated statistics

---

## 8. Roadmap

### Phase 1 — v1.0 (Current ✅)
- [x] Hallmark anti-AI-slop editorial redesign
- [x] Responsive layouts across all breakpoints
- [x] Production build: Vinext + Cloudflare Worker
- [x] Custom CSS design system with curated token palette

### Phase 2 — v1.1
- [ ] Drizzle-backed `notices` table fed from lightweight admin panel
- [ ] Dynamic notice bar pulling from Cloudflare D1 database
- [ ] Animated stat counters (Intersection Observer)
- [ ] Skip-to-main-content accessibility link

### Phase 3 — v1.2
- [ ] Parent portal deep-link integration (external SSO)
- [ ] Online admission enquiry form with D1 storage
- [ ] JSON-LD structured data (Organization + EducationalOrganization)
- [ ] `sitemap.xml` and `robots.txt` generation

### Phase 4 — v2.0
- [ ] CMS integration (Sanity.io or Tina CMS) for notices, news, events
- [ ] Events calendar page
- [ ] Alumni directory section
- [ ] Multi-language support (English + Hindi)

---

## 9. Success Metrics

| Metric | Target | Tool |
|---|---|---|
| Monthly Admission Enquiry Clicks | > 150 unique clicks | Google Analytics 4 |
| Average Session Duration | > 2 min 30 sec | Google Analytics 4 |
| Bounce Rate | < 55% | Google Analytics 4 |
| LCP (Core Web Vitals) | < 2.5 s | PageSpeed Insights |
| Mobile Traffic Share | Monitored (target 60%+) | Google Analytics 4 |

---

## 10. Open Questions & Decisions Log

| # | Question | Status | Decision |
|---|----------|--------|----------|
| OQ1 | Auto-rotate multiple notices in announcement bar? | Open | Deferred to Phase 2 |
| OQ2 | Fee structure page — include inline or link externally? | Open | Pending admissions office input |
| OQ3 | Gallery — real photography vs. gradient placeholders? | Open | Awaiting photo assets from marketing |
| OQ4 | D1 database binding name — confirm with hosting team | Open | Currently using placeholder `DB` |
| OQ5 | Language toggle (EN/HI) in v1 or v2? | Decided | v2 — not in current scope |

---

*Document Owner: Sunshine Public School Digital Team | Review Cycle: Per Release*
