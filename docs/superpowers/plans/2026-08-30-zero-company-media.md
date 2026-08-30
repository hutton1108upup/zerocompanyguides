# Zero Company Media Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add source-labeled official images and click-to-load YouTube videos across the approved Zero Company routes, then verify the complete site locally.

**Architecture:** Extend the existing typed `ContentBlock` registry with image and video variants. Render them through focused components, keep images local, and use a client-only activation boundary for privacy-enhanced YouTube embeds.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Vitest 4, existing CSS design system.

**Spec:** `docs/superpowers/specs/2026-08-30-zero-company-media-design.md`

## Global Constraints

- Do not change canonical routes, navigation structure, evidence boundaries, or indexability.
- Do not copy community/forum images without permission.
- Ordinary articles contain at most two images and one playable video.
- YouTube iframes load only after explicit user activation and use `youtube-nocookie.com`.
- Preserve unrelated dirty-worktree changes and do not commit, push, create a PR, merge, or deploy.

---

### Task 1: Media content contract

**Files:**
- Create: `tests/media-content.test.ts`
- Modify: `src/content/types.ts`

**Interfaces:**
- Produces `ImageBlock`, `VideoBlock`, and their inclusion in `ContentBlock`.
- `ImageBlock.src` is a `/media/zero-company/...` path.
- `VideoBlock.videoId` is an eleven-character YouTube ID.

- [ ] **Step 1: Write the failing registry contract test**

Test hand-picked route expectations, density limits, local image paths, and YouTube ID format with literal route lists.

- [ ] **Step 2: Run `npm run test:run -- tests/media-content.test.ts`**

Expected: FAIL because no page currently contains an `image` or `video` block.

- [ ] **Step 3: Add the minimal TypeScript block interfaces**

Define source labels, captions, optional spoiler/version notes, and discriminated unions without adding new dependencies.

- [ ] **Step 4: Run the targeted test again**

Expected: registry assertions still fail, while the new types compile.

### Task 2: Media rendering components

**Files:**
- Create: `src/components/content-image.tsx`
- Create: `src/components/content-video.tsx`
- Create: `tests/media-components.test.ts`
- Modify: `src/components/content-blocks.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- `ContentImage({ block: ImageBlock })` renders `figure`, `next/image`, caption, source, and evidence badge.
- `ContentVideo({ block: VideoBlock })` renders an accessible poster button first and a privacy-enhanced iframe after activation.

- [ ] **Step 1: Write failing static-render tests**

Assert a figure caption/source link and a video poster button with title/channel/duration/version labels. Assert spoiler media is enclosed in a closed disclosure.

- [ ] **Step 2: Run `npm run test:run -- tests/media-components.test.ts`**

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement the minimal components and renderer branches**

Use `next/image`, a client state boundary for video activation, and no remote image configuration.

- [ ] **Step 4: Add responsive command-console styling**

Add evidence plate, poster, play button, caption, spoiler disclosure, focus, and mobile rules to the existing stylesheet.

- [ ] **Step 5: Run the component and existing tests**

Run `npm run test:run -- tests/media-components.test.ts tests/content-contract.test.ts` and expect all selected tests to pass.

### Task 3: Official image asset pack

**Files:**
- Create binary assets under: `public/media/zero-company/`

**Interfaces:**
- Filenames are stable, descriptive lowercase slugs.
- Every file is traceable to an official EA or StarWars.com URL recorded in page block metadata.

- [ ] **Step 1: Download the approved official assets**

Download key art, lineup, Hawks, Trick/Luco, tactical combat, concussion grenade, holotable, customization, deluxe edition, cast reveal, and selected class assets.

- [ ] **Step 2: Verify responses and file signatures**

Check non-zero size, expected image content type/signature, and readable pixel dimensions. Delete or replace any HTML/error payload.

### Task 4: Route-by-route media registry

**Files:**
- Modify: `src/content/pages.ts`

**Interfaces:**
- Consumes the media block interfaces and the local asset pack.
- Produces the approved image/video distribution for all 22 routes without exceeding density limits.

- [ ] **Step 1: Add image blocks in approved reading positions**

Place each image after the answer or section it explains, not ahead of the page summary.

- [ ] **Step 2: Add the approved playable video blocks**

Use official videos where available; label creator videos as community, include dates/durations, and record hardware, patch, early-game, or spoiler boundaries.

- [ ] **Step 3: Keep gated routes intentionally light**

Do not add a trophy video, a respec video, or copied forum imagery. Retain linked evidence through the existing source list.

- [ ] **Step 4: Run `npm run test:run -- tests/media-content.test.ts`**

Expected: PASS for exact route coverage, density, source, and ID contracts.

### Task 5: Production and browser verification

**Files:**
- Create: `tests/browser/media-audit.py`
- Create screenshots under: `artifacts/media-review/`

**Interfaces:**
- Browser audit requests all approved routes and checks media DOM, image completion, iframe laziness, accessibility labels, internal links, and console errors.

- [ ] **Step 1: Run full automated checks**

Run `npm run test:run`, `npm run lint`, and `npm run build`; each must exit 0.

- [ ] **Step 2: Run Playwright against the production server**

Audit all 22 routes, activate one video, confirm the resulting iframe host is `www.youtube-nocookie.com`, and capture desktop/mobile review screenshots.

- [ ] **Step 3: Start a persistent local review server**

Start `npm run start -- --hostname 127.0.0.1 --port 3000`, verify the listener persists, and request the main review routes over HTTP.

- [ ] **Step 4: Report exact review links and boundaries**

List the homepage plus representative classes, builds, guides, performance, characters, mods, and buying-decision URLs. State that no commit, push, PR, merge, or deployment occurred.
