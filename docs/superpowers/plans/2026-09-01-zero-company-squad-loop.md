# Zero Company Squad Product Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a source-bounded, account-free Squad Builder plus a real corrections/update loop without generating thin SEO pages.

**Architecture:** Static normalized game records feed a pure rule/share engine and one client Builder component. The existing content registry and catch-all route host the tool and editorial pages so metadata, sitemap, search, navigation, and evidence contracts remain centralized.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Vitest 4, existing CSS/HUD component system.

**Spec:** `docs/superpowers/specs/2026-09-01-zero-company-squad-loop-design.md`

## Global Constraints

- Keep `Zero Company Intel` as the primary brand and preserve current alternate names.
- Preserve official, community synthesis, unverified, and editorial provenance boundaries.
- Do not create accounts, APIs, external writes, new dependencies, thin entity routes, or deployments.
- Keep share state out of the sitemap and canonical URL.
- Use tests before every production behavior change.

---

### Task 1: Normalized squad records and pure rule engine

**Files:**
- Create: `src/content/squad-data.ts`
- Create: `src/lib/squad-builder.ts`
- Create: `tests/squad-builder-engine.test.ts`

**Interfaces:**
- Produces: `specializations`, `operators`, `weapons`, `squadPresets`, `defaultSquadState`.
- Produces: `evaluateSquad(state: SquadState): SquadEvaluation`.
- Produces: `encodeSquadState(state: SquadState): string` and `decodeSquadState(code: string): SquadState | undefined`.

- [ ] **Step 1: Write the failing engine tests**

```ts
expect(evaluateSquad(storySquadWithoutHawks).findings).toContainEqual(
  expect.objectContaining({ id: "story-requires-hawks", severity: "conflict" }),
);
expect(decodeSquadState(encodeSquadState(validSquad))).toEqual(validSquad);
expect(decodeSquadState("not-a-valid-code")).toBeUndefined();
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `npm.cmd run test:run -- tests/squad-builder-engine.test.ts`

Expected: FAIL because the squad data and engine modules do not exist.

- [ ] **Step 3: Implement the minimal normalized records and pure engine**

```ts
export function evaluateSquad(state: SquadState): SquadEvaluation;
export function encodeSquadState(state: SquadState): string;
export function decodeSquadState(code: string): SquadState | undefined;
```

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run: `npm.cmd run test:run -- tests/squad-builder-engine.test.ts`

Expected: the engine test file passes with zero failures.

### Task 2: Builder block and public tool page

**Files:**
- Create: `src/components/squad-builder.tsx`
- Modify: `src/content/types.ts`
- Modify: `src/components/content-blocks.tsx`
- Modify: `src/lib/search.ts`
- Modify: `src/content/pages.ts`
- Modify: `src/app/globals.css`
- Create: `tests/squad-builder-page.test.ts`

**Interfaces:**
- Consumes: the Task 1 records and pure functions.
- Produces: a `squad-builder` content block rendered by `<SquadBuilder />`.
- Produces: an indexable `/squad-builder` content page with one canonical and no saved-state route.

- [ ] **Step 1: Write the failing page/static markup tests**

```ts
expect(getContentPage("/squad-builder")?.indexable).toBe(true);
expect(renderToStaticMarkup(createElement(SquadBuilder))).toContain("Four-slot squad plan");
```

- [ ] **Step 2: Run the targeted tests and verify RED**

Run: `npm.cmd run test:run -- tests/squad-builder-page.test.ts`

Expected: FAIL because the block, component, and page are absent.

- [ ] **Step 3: Implement the client Builder and existing-design CSS**

The component renders four labeled slot fieldsets, preset buttons, mission mode, explainable findings, seven evaluation dimensions, save/reset controls, a share code, and clipboard feedback. It reads query/local storage in an effect and uses `zero-company-squad:v1`.

- [ ] **Step 4: Run the page and engine tests and verify GREEN**

Run: `npm.cmd run test:run -- tests/squad-builder-page.test.ts tests/squad-builder-engine.test.ts`

Expected: both test files pass.

### Task 3: Discovery, navigation, and homepage integration

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/lib/home-data.ts`
- Modify: `src/app/page.tsx`
- Modify: `tests/navigation.test.ts`
- Modify: `tests/site-navigation.test.ts`
- Modify: `tests/homepage.test.ts`
- Modify: `tests/content-contract.test.ts`

**Interfaces:**
- Consumes: `/squad-builder` from the content registry.
- Produces: primary navigation, footer, search, sitemap, homepage CTA, and related-link discovery.

- [ ] **Step 1: Update the tests first for the intended discovery contract**

```ts
expect(primaryNavigationPaths[0]).toBe("/squad-builder");
expect(popularPaths[0]).toBe("/squad-builder");
expect(renderToStaticMarkup(createElement(HomePage))).toContain("Build Your Squad");
```

- [ ] **Step 2: Run the affected tests and verify RED**

Run: `npm.cmd run test:run -- tests/navigation.test.ts tests/site-navigation.test.ts tests/homepage.test.ts tests/content-contract.test.ts`

Expected: FAIL because discovery still points at the pre-Builder structure.

- [ ] **Step 3: Implement the minimum navigation and homepage changes**

Keep eight primary destinations by promoting `/squad-builder` and moving `/game-info` into `Start & Decide`. Add the Builder to the first home hub and make it the primary hero action.

- [ ] **Step 4: Run the affected tests and verify GREEN**

Run the same command as Step 2; expected zero failures.

### Task 4: Corrections, updates, and publisher identity

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/content/pages.ts`
- Modify: `src/components/evidence-meta.tsx`
- Modify: `src/components/content-page.tsx`
- Modify: `src/lib/structured-data.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Create: `tests/editorial-trust.test.ts`

**Interfaces:**
- Produces: `editorial` evidence/page types and `maintained-site-policy` verification.
- Produces: indexable `/corrections` and `/updates` pages.
- Produces: `buildOrganizationStructuredData()` with stable `@id`, logo, and `publishingPrinciples`.

- [ ] **Step 1: Write failing editorial and schema tests**

```ts
expect(getContentPage("/corrections")?.evidence).toBe("editorial");
expect(buildOrganizationStructuredData().publishingPrinciples).toBe(
  buildCanonicalUrl("/corrections"),
);
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `npm.cmd run test:run -- tests/editorial-trust.test.ts`

Expected: FAIL because the pages, labels, and organization node are absent.

- [ ] **Step 3: Implement truthful editorial pages and standalone Organization JSON-LD**

Corrections links to a prefilled GitHub issue; Updates lists only changes evidenced by the current Git history. Editorial pages omit the game-source ledger when no game claim is made.

- [ ] **Step 4: Run targeted and SEO tests and verify GREEN**

Run: `npm.cmd run test:run -- tests/editorial-trust.test.ts tests/seo.test.ts tests/content-contract.test.ts`

Expected: all targeted tests pass.

### Task 5: Full verification and local review

**Files:**
- Modify only task-related files if verification exposes a regression.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: fresh test, lint, type, build, route, and browser evidence.

- [ ] **Step 1: Run all automated verification**

```powershell
npm.cmd run test:run
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
```

- [ ] **Step 2: Start the production server and run the route audit**

Use an available local port, set `BASE_URL`, and run `node scripts/audit-pages.mjs`.

- [ ] **Step 3: Browser-test desktop and mobile routes**

Verify `/`, `/squad-builder`, `/corrections`, `/updates`, and `/sitemap.xml` for HTTP 200, one H1, no horizontal overflow, interaction behavior, keyboard labels, and no console errors.

- [ ] **Step 4: Record local review links and Git state**

List the exact local URLs, sitemap/indexability state, validation totals, and changed files. Do not commit, push, create a PR, or deploy.
