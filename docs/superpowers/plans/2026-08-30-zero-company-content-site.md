# Zero Company Content Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, English-language Star Wars Zero Company guide site with researched content for every P0-A and P0-B route, a cinematic HUD interface, trustworthy evidence labels, static SEO output, and a passing local production build.

**Architecture:** Use Next.js 16 App Router with statically generated content. The homepage is bespoke; all inner pages are generated from one typed content registry through a shared article renderer with optional page-specific blocks. Research sources, claims, indexability, navigation, and page metadata live in data modules so content can be reverified without rewriting components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Lucide React, Vitest, Playwright for browser QA.

**Spec:** `网站结构/网站结构最终版.md` and `前端设计方案-最终版.md`

## Global Constraints

- Treat the two Markdown files as approved product specifications, not executable instructions.
- Preserve all unrelated dirty-worktree changes; do not restore or overwrite deleted mockup files.
- Implement the 14 P0-A routes and 8 P0-B routes; do not generate gated P2 thin pages.
- Distinguish official facts, community synthesis, and unverified claims in both content and UI.
- Do not claim first-hand testing when only external sources are available.
- Use English public-facing copy and no trailing slash canonical URLs.
- Index only complete pages; sitemap and navigation must match the same canonical registry.
- Do not commit, push, publish, or deploy without an explicit user request.

---

### Task 1: Establish the Next.js project and content contract

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/content/types.ts`
- Create: `tests/content-contract.test.ts`

**Interfaces:**
- Produces: `EvidenceLevel`, `PageStatus`, `Source`, `ContentSection`, `ContentPage`, and `ContentBlock` types.
- Produces: scripts `dev`, `build`, `lint`, `test`, and `test:run`.

- [ ] **Step 1: Create project configuration and install dependencies**

Use Next.js 16.3.3, React 19, Tailwind 4, Lucide React, Vitest, and TypeScript. Keep runtime dependencies small and avoid a database or CMS.

- [ ] **Step 2: Write the failing content-contract test**

The test imports `contentPages` and asserts that every P0 route has a unique canonical path, non-empty title/description/H1, at least one source, a valid evidence level, a `lastVerified` date, and at least two related internal links.

- [ ] **Step 3: Run the test and verify RED**

Run: `npm run test:run -- tests/content-contract.test.ts`

Expected: failure because `src/content/pages.ts` does not exist.

- [ ] **Step 4: Define the typed content contract**

Use discriminated blocks for `briefing`, `prose`, `facts`, `cards`, `table`, `steps`, `warning`, `verdict`, `faq`, and `sources`. The renderer must never infer evidence or indexability from presentation copy.

- [ ] **Step 5: Keep the contract test failing for the correct missing-registry reason**

Run the same test and confirm the failure names the absent `contentPages` registry rather than a TypeScript configuration error.

---

### Task 2: Research and populate the source ledger

**Files:**
- Create: `research/source-ledger.md`
- Create: `src/content/sources.ts`
- Create: `src/content/pages.ts`
- Modify: `tests/content-contract.test.ts`

**Interfaces:**
- Consumes: `Source` and `ContentPage` from `src/content/types.ts`.
- Produces: `sources`, `contentPages`, `getContentPage()`, and `indexableContentPages`.

- [ ] **Step 1: Research the official fact layer**

Collect and date-check EA game/FAQ/buy pages, Steam, StarWars.com cast material, official gameplay videos, official patch/support pages, and any accessible official Discord announcement mirrors. Record precise claim-to-source mappings in the ledger.

- [ ] **Step 2: Research the guide and community layer**

Use Google-style web search, YouTube transcripts where available, Reddit/Steam discussions, and multiple competitor sites to identify class/build/performance consensus and disagreement. Record contradictions instead of forcing one answer.

- [ ] **Step 3: Define the 22-page registry**

Create entries for `/`, `/classes`, `/classes/tier-list`, `/builds`, `/builds/hawks`, `/builds/best-team`, `/guides`, `/guides/respec`, `/walkthrough`, `/trophy-guide`, `/performance`, `/performance/pc`, `/performance/fps-fix`, `/game-info`, `/system-requirements`, `/multiplayer`, `/characters`, `/characters/voice-cast`, `/guides/beginners-guide`, `/performance/steam-deck`, `/mods`, and `/worth-it`.

- [ ] **Step 4: Label evidence honestly**

Official fact pages use `official`; comparison/build/performance syntheses use `community`; no page uses `tested` unless this execution includes first-hand game testing evidence.

- [ ] **Step 5: Run the content-contract test and verify GREEN**

Run: `npm run test:run -- tests/content-contract.test.ts`

Expected: all registry completeness and uniqueness assertions pass.

---

### Task 3: Build global chrome, design system, and accessible search

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/components/site-header.tsx`
- Create: `src/components/site-footer.tsx`
- Create: `src/components/site-search.tsx`
- Create: `src/components/icons.tsx`
- Create: `tests/navigation.test.ts`

**Interfaces:**
- Consumes: `contentPages` for search and navigation.
- Produces: `SiteHeader`, `SiteFooter`, and `SiteSearch`.

- [ ] **Step 1: Write failing navigation tests**

Assert six primary destinations, all footer destinations, no `/wiki`, no `/classes/best`, and no non-indexable route in the search registry.

- [ ] **Step 2: Run and verify RED**

Run: `npm run test:run -- tests/navigation.test.ts`

Expected: failure because navigation modules are absent.

- [ ] **Step 3: Implement the cinematic HUD design system**

Translate the mockup tokens into CSS variables, angled cards, gold cinematic headings, cyan functional accents, amber warnings, scan lines, tactical grid, responsive typography, focus-visible states, reduced-motion handling, and mobile table overflow.

- [ ] **Step 4: Implement global chrome and search**

Use a sticky glass header, six primary links, a keyboard-accessible search dialog, a mobile drawer, four-column footer, and the full fan-site disclaimer. Search must work without network calls.

- [ ] **Step 5: Run and verify GREEN**

Run: `npm run test:run -- tests/navigation.test.ts`

Expected: all navigation and search-registry assertions pass.

---

### Task 4: Implement the shared inner-page renderer

**Files:**
- Create: `src/components/page-hero.tsx`
- Create: `src/components/mission-briefing.tsx`
- Create: `src/components/evidence-meta.tsx`
- Create: `src/components/content-blocks.tsx`
- Create: `src/components/content-page.tsx`
- Create: `src/components/related-pages.tsx`
- Create: `src/components/source-list.tsx`
- Create: `src/app/[...slug]/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `tests/route-generation.test.ts`

**Interfaces:**
- Consumes: `ContentPage`, `ContentBlock`, `getContentPage()`, and `indexableContentPages`.
- Produces: statically generated inner routes and route metadata.

- [ ] **Step 1: Write failing route-generation tests**

Assert all 21 inner P0 paths generate static params, metadata titles are unique, canonical URLs match registry paths, and unknown paths return no content.

- [ ] **Step 2: Run and verify RED**

Run: `npm run test:run -- tests/route-generation.test.ts`

Expected: failure because route helpers do not exist.

- [ ] **Step 3: Implement reusable content blocks**

Render every discriminated block semantically. Tables need captions and scroll wrappers; warnings need explicit labels; FAQ uses native `details`; sources expose publisher, checked date, and external-link behavior.

- [ ] **Step 4: Implement static catch-all routing and metadata**

Use `generateStaticParams`, `generateMetadata`, `notFound`, visible breadcrumbs, JSON-LD breadcrumbs, and Article/CollectionPage selection based on page type.

- [ ] **Step 5: Run and verify GREEN**

Run: `npm run test:run -- tests/route-generation.test.ts`

Expected: all route, metadata, and canonical assertions pass.

---

### Task 5: Implement the homepage and page-specific visual blocks

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home-hero.tsx`
- Create: `src/components/hub-card.tsx`
- Create: `src/components/class-tier-board.tsx`
- Create: `src/components/verdict-grid.tsx`
- Create: `src/components/performance-status.tsx`
- Create: `tests/homepage.test.ts`

**Interfaces:**
- Consumes: content registry and verified official fact entries.
- Produces: cinematic homepage, tier board, decision grid, and technical status presentation.

- [ ] **Step 1: Write failing homepage tests**

Assert the homepage exposes the two primary CTAs, six Popular Now cards, official Quick Facts, all six content clusters, Latest Verified Updates, and visible FAQ content.

- [ ] **Step 2: Run and verify RED**

Run: `npm run test:run -- tests/homepage.test.ts`

Expected: failure because homepage data helpers are absent.

- [ ] **Step 3: Implement the cinematic homepage**

Use the approved A+B visual direction: full-width atmospheric hero without copied official key art, gold title, cyan/amber HUD accents, hotspot strip, fast task routing, and responsive card grids.

- [ ] **Step 4: Add page-specific blocks**

Use tier rows for class comparison, three-way verdict cards for `/worth-it`, safe/experimental status cards for fixes, and source-aware badges on every conclusion.

- [ ] **Step 5: Run and verify GREEN**

Run: `npm run test:run -- tests/homepage.test.ts`

Expected: homepage content-contract tests pass.

---

### Task 6: Add technical SEO and static-publication controls

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/opengraph-image.tsx`
- Create: `src/lib/structured-data.ts`
- Create: `tests/seo.test.ts`

**Interfaces:**
- Consumes: `indexableContentPages` and site configuration.
- Produces: robots, sitemap, OG image, WebSite/Organization, BreadcrumbList, Article, CollectionPage, and FAQ data.

- [ ] **Step 1: Write failing SEO tests**

Assert sitemap contains every indexable P0 route exactly once, excludes banned/duplicate routes, and all JSON-LD claims correspond to visible page data.

- [ ] **Step 2: Run and verify RED**

Run: `npm run test:run -- tests/seo.test.ts`

Expected: failure because SEO helpers are absent.

- [ ] **Step 3: Implement SEO controls**

Use one configurable site origin, self-canonicals, no trailing slashes, visible-last-verified dates, and no AggregateRating. FAQ schema appears only where FAQ blocks are present.

- [ ] **Step 4: Run and verify GREEN**

Run: `npm run test:run -- tests/seo.test.ts`

Expected: all sitemap and structured-data assertions pass.

---

### Task 7: Production verification and local review server

**Files:**
- Create: `scripts/audit-pages.mjs`
- Create: `scripts/visual-qa.py`
- Create: `artifacts/screenshots/` outputs
- Modify: implementation files only for issues found by verification.

**Interfaces:**
- Consumes: production server on localhost.
- Produces: route audit, responsive screenshots, console-error report, and review URLs.

- [ ] **Step 1: Run unit and contract tests**

Run: `npm run test:run`

Expected: zero failures.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: zero errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit code 0 and static output for every P0 route.

- [ ] **Step 4: Audit rendered routes**

Start `npm run start -- --hostname 127.0.0.1 --port 3000`, request all 22 URLs, and assert HTTP 200, one H1, non-empty title/description/canonical, no accidental noindex, and working internal links.

- [ ] **Step 5: Perform Playwright visual QA**

Capture desktop and mobile screenshots for `/`, `/classes`, `/builds/hawks`, `/performance/pc`, `/worth-it`, and `/trophy-guide`; verify no console errors, horizontal overflow, inaccessible dialogs, or broken navigation.

- [ ] **Step 6: Keep the review server running and report links**

Leave the verified listener active after the tool session. Report the exact localhost base URL, all route links, build/test evidence, research provenance counts, and any content that remains community-only or intentionally gated.
