# Zero Company P0-P1 Retail Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the current Zero Company guide site from a pre-launch source-bounded planner to a post-launch retail-data loop that answers real mission, build, trophy, performance and correction tasks without creating unverified thin pages.

**Architecture:** Keep the existing content registry and catch-all route as the public SEO boundary. Add a normalized versioned evidence contract below the Builder, keep all interactive state client-local, and use existing canonical pages for intent ownership before opening any new route. Analytics is consent-gated; GSC/GA reporting remains explicitly blocked until credentials or an export is available.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Vitest 4, existing HUD CSS, browser-local storage, and the current static content registry.

**Spec:** User-approved P0-P1 brief in the active conversation; prior Builder design is in `docs/superpowers/specs/2026-09-01-zero-company-squad-loop-design.md`.

## Global Constraints

- Preserve existing uncommitted user changes and do not reset or overwrite them.
- Keep official, independent-source synthesis, community, editorial, and unverified claims visibly distinct.
- Use a real game build/version on every retail-data record; competitor pages can be discovery leads but never become evidence by themselves.
- Do not open a new indexable route when an existing canonical route owns the same intent.
- Share links remain canonical `/squad-builder` URLs with query state excluded from sitemap.
- GA4 and Clarity load only after an explicit analytics-consent state; users can reject and withdraw.
- Missing GSC/GA credentials produce a visible blocked evidence state, never invented traffic or ranking claims.
- Write a failing test before each production behavior change and run the smallest relevant test before moving to the next task.

### Task 1: Lock the current 31-page post-launch content set

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/content/sources.ts`
- Modify: `tests/rising-queries-content.test.ts`
- Modify: `tests/content-contract.test.ts`
- Modify: `tests/navigation.test.ts`
- Modify: `tests/site-navigation.test.ts`

**Interfaces:**
- Consumes: existing `/walkthrough`, `/guides/permadeath`, `/trophy-guide`, `/performance/steam-deck`, `/game-info` page owners.
- Produces: verified Nebulous Pursuit and Ship Adrift routes plus refreshed launch-era metadata and source records.

- [ ] **Step 1: Run the current content tests and record the red contract, if any**

Run: `npm.cmd run test:run -- tests/rising-queries-content.test.ts tests/content-contract.test.ts tests/navigation.test.ts tests/site-navigation.test.ts`

Expected: the working-tree content contract identifies any stale page count, source, navigation or route assertions before changes.

- [ ] **Step 2: Verify every new indexed page has an independent intent and evidence boundary**

Keep the two Operation pages indexable only when their source arrays contain the extracted record plus independent launch reports, and keep every uncertain destination/reward visibly community or needs-retest.

- [ ] **Step 3: Update discovery and metadata without creating duplicate class, respec or performance URLs**

Use `/classes/tier-list`, `/builds/hawks`, `/guides/respec`, `/trophy-guide`, `/performance/fps-fix`, `/mods` and `/walkthrough` as the canonical owners.

- [ ] **Step 4: Run the content tests and route registry checks**

Run: `npm.cmd run test:run -- tests/rising-queries-content.test.ts tests/content-contract.test.ts tests/navigation.test.ts tests/site-navigation.test.ts`

Expected: all relevant tests pass and the public route count reflects the current content registry.

### Task 2: Add a retail evidence contract and migrate Builder records

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/squad-data.ts`
- Modify: `src/lib/squad-builder.ts`
- Create: `src/content/retail-data.ts`
- Create: `tests/retail-data-contract.test.ts`
- Modify: `tests/squad-builder-engine.test.ts`

**Interfaces:**
- Produces: `RetailEvidenceMeta` with `observedBuild`, `sourceType`, `verifiedAt`, `confidence`, `spoilerLevel`, `replacedBy` and `retiredAt`.
- Produces: validated retail records for Specializations, Operators, Weapons, Talents, Abilities and Operations.
- Consumes: existing source IDs and `SquadState` share-code format.

- [ ] **Step 1: Write failing tests for required provenance and stale-record behavior**

Assert that every retail record has a build, source type, verification date, confidence and spoiler level; assert a retired record is excluded from active Builder choices while its replacement remains discoverable.

- [ ] **Step 2: Run `npm.cmd run test:run -- tests/retail-data-contract.test.ts tests/squad-builder-engine.test.ts` and verify RED**

Expected: the new contract fails because the existing records have only source IDs and `lastVerified`.

- [ ] **Step 3: Implement the smallest shared metadata contract**

Keep the contract additive so current content records and `v1` share codes remain valid. Use `sourceType` values that distinguish `official`, `first-hand`, `independent`, `community` and `competitor-lead`.

- [ ] **Step 4: Run the targeted tests and verify GREEN**

Expected: all records pass metadata validation and legacy `v1` decode/encode tests remain green.

### Task 3: Upgrade Squad Builder to dual specialization, Talent and Focus planning

**Files:**
- Modify: `src/components/squad-builder.tsx`
- Modify: `src/lib/squad-builder.ts`
- Modify: `src/content/squad-data.ts`
- Modify: `src/content/types.ts`
- Modify: `src/components/content-blocks.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/squad-builder-retail.test.ts`
- Modify: `tests/squad-builder-page.test.ts`
- Modify: `tests/browser/squad-builder-audit.py`

**Interfaces:**
- Produces: `SquadSlot` fields for optional secondary specialization, Talent, Operator level and Focus available/spent.
- Produces: legal-selection validation, source-linked findings, Focus affordability findings, and dual-specialization conflict detection.
- Preserves: `v1` share-code decoding and browser-local save behavior.

- [ ] **Step 1: Write failing tests for a legal dual-spec build and an unaffordable Focus tree**

Assert that a valid primary/secondary/Talent selection round-trips through a new versioned code, while an over-budget build returns a conflict finding with the record build and checked date.

- [ ] **Step 2: Run the targeted Builder tests and verify RED**

Run: `npm.cmd run test:run -- tests/squad-builder-retail.test.ts tests/squad-builder-engine.test.ts tests/squad-builder-page.test.ts`

- [ ] **Step 3: Implement additive state and UI controls**

Keep the first screen readable: primary specialization, optional secondary, Talent, level, Focus available/spent, then a compact source/version strip on each finding. Do not add the full 2,800-record database or a single overall score.

- [ ] **Step 4: Add migration and interaction coverage**

Decode `v1` into empty secondary/Talent/Focus fields, preserve current URLs, and test keyboard labels, mobile stacking, reset, save and share behavior.

- [ ] **Step 5: Run targeted tests and browser smoke checks**

Expected: existing Builder behavior plus the new retail planning flow passes without console errors or horizontal overflow.

### Task 4: Gate GA4/Clarity on consent and document the GSC baseline boundary

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/google-analytics.tsx`
- Modify: `src/components/microsoft-clarity.tsx`
- Create: `src/components/analytics-consent.tsx`
- Create: `src/lib/analytics-consent.ts`
- Create: `tests/analytics-consent.test.ts`
- Create: `docs/seo/gsc-ga-baseline.md`

**Interfaces:**
- Produces: `analyticsConsentStorageKey`, consent states `unknown|accepted|rejected`, and a withdrawal action.
- Produces: no analytics script or Clarity request before acceptance; accepted state loads once; rejected/withdrawn state remains blocked.
- Produces: an auditable GSC/GA baseline checklist that explicitly reports unavailable credentials rather than fabricated metrics.

- [ ] **Step 1: Write failing tests for blocked, accepted and withdrawn states**

Assert that server-rendered layout contains the consent control but not active third-party script tags, and that the client loader only inserts scripts after acceptance.

- [ ] **Step 2: Run `npm.cmd run test:run -- tests/analytics-consent.test.ts` and verify RED**

Expected: the current layout always renders both third-party integrations.

- [ ] **Step 3: Implement a local-only consent banner and script gate**

Use a small client boundary; store only the consent decision, do not add user identity, cookies or a server database. Provide Accept, Reject and Manage/Withdraw controls.

- [ ] **Step 4: Add the blocked GSC/GA baseline document**

Record required credentials, the 28-day Query×Page export fields, and the exact condition for opening new indexable routes.

- [ ] **Step 5: Run tests, lint and a production build**

Expected: no third-party requests occur before consent in browser QA, and the static build remains successful.

### Task 5: Finish P1 task-blocker pages and existing route owners

**Files:**
- Modify: `src/content/pages.ts`
- Modify: `src/content/sources.ts`
- Modify: `tests/rising-queries-content.test.ts`
- Create: `tests/route-owner-contract.test.ts`
- Modify: `tests/fps-fix-content.test.ts`
- Modify: `tests/hawks-build-refresh.test.ts`

**Interfaces:**
- Produces: fixed section contracts for Quick Answer, appearance condition, objective order, failure/extraction, reward, version, screenshots and spoiler level.
- Preserves: existing canonical route ownership and noindex gates for incomplete missions.

- [ ] **Step 1: Write failing route-owner tests**

Assert `/classes/tier-list`, `/builds/hawks`, `/guides/respec`, `/trophy-guide`, `/performance/fps-fix` and `/mods` each own their stated intent and no duplicate route is added for the same query family.

- [ ] **Step 2: Run the affected tests and verify RED**

Expected: at least the checklist/technical matrix/route-owner contracts fail before implementation.

- [ ] **Step 3: Implement bounded content and interactive checklist contracts**

Add a local-only 53-achievement checklist with spoiler gating; add a versioned performance matrix; add mod dependency/rollback fields; keep uncertain values labeled and keep source gaps visible.

- [ ] **Step 4: Add only independently supported mission blockers**

Use the existing Operation routes first, then add Red Dust, Destroy the Power Station, Dark Waters, Find Somewhere to Spy, Saves/Beskar and Den upgrades only when each has first-hand capture or two independent sources.

- [ ] **Step 5: Run affected tests and content audit**

Expected: every indexable page has one owner, no duplicate slug, and no unverified mission claim enters sitemap.

### Task 6: Add low-friction corrections and Build sharing entry points

**Files:**
- Modify: `src/components/content-page.tsx`
- Create: `src/components/correction-form.tsx`
- Create: `src/components/build-share-card.tsx`
- Modify: `src/content/pages.ts`
- Modify: `src/app/globals.css`
- Create: `tests/correction-form.test.tsx`
- Modify: `tests/squad-builder-page.test.ts`

**Interfaces:**
- Produces: page-aware correction form fields for claim, version, platform, difficulty and evidence URL.
- Produces: a share card that carries the canonical Builder URL and human-readable selected roles without creating a new indexable route.
- Preserves: GitHub Issue as an advanced fallback; no image upload, public comments, voting or account requirement.

- [ ] **Step 1: Write failing tests for prefilled correction context and share-card canonicality**

Assert that the form includes the current page URL and required evidence fields, while the share card links only to `/squad-builder?s=...` and never to a sitemap path.

- [ ] **Step 2: Run the targeted tests and verify RED**

Run: `npm.cmd run test:run -- tests/correction-form.test.tsx tests/squad-builder-page.test.ts`

- [ ] **Step 3: Implement client-side form and share card**

The first version may open a prefilled email/GitHub destination after client validation; it must not silently transmit a claim or screenshot. Keep the form keyboard accessible and mobile-friendly.

- [ ] **Step 4: Run tests and browser interaction checks**

Expected: correction context, share link, clipboard fallback and no-sitemap behavior pass.

### Task 7: Final production verification and local review handoff

**Files:**
- Modify only task-related files if verification exposes a regression.

- [ ] **Step 1: Run all automated checks**

Run in parallel where safe: `npm.cmd run test:run`, `npm.cmd run lint`, `npx.cmd tsc --noEmit`, `npm.cmd run build`.

- [ ] **Step 2: Start production output and audit every sitemap URL**

Run `node scripts/audit-pages.mjs` with `BASE_URL` against the final local server. Verify status 200, title, description, canonical, exactly one H1, expected robots and no internal 4xx.

- [ ] **Step 3: Run desktop/mobile Playwright QA**

Verify Builder dual-spec/Talent/Focus flow, v1 share migration, consent states, correction context, checklist persistence, no console/page errors and no horizontal overflow.

- [ ] **Step 4: Report exact local links and boundaries**

List changed routes, sitemap/indexability state, test totals, build output, current branch/worktree state, and any GSC/GA credential block. Do not commit, push, create a PR or deploy unless separately requested.
