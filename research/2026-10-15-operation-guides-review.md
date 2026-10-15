# Operation guides review — 2026-10-15

## Scope

This review covered the requested GSC inner-page wording and the evidence gate for the Strange Bedfellows draft. It used the Zero Company Databank Strange Bedfellows page (footer build 25513890), the Gamers Heroes choices guide, the ShowGamer choices guide, the Protection Application Databank page, and the Ship Adrift sections of the Gamers Heroes guide. No first-hand replay was performed.

## Decisions recorded

- Strange Bedfellows remains a directly viewable route with `draft`, `needs-retest`, community evidence, `noindex, follow`, and a self canonical. It is excluded from public paths, sitemap, search, navigation, and incoming public cards or related links.
- The draft keeps the full two-row choice table. Entry cost and availability are separated from gross reported rewards: 50 Intel and 3 turns are not a completion-time claim, and +50/+1 versus +25/+2 is a 25 Intel versus one Contact trade-off.
- Published reports place the operation after the Runa Back Channels route. The shared immediate refusal does not prove identical later consequences or an ending. Contacts and Contracts remain separate labels.
- Ship Adrift I-V is presented as five covered guide entries, not a complete or fixed chain. The wager winner is not guaranteed; the 1,000 stake and 5,000 receipt example is +4,000 net.

## GSC notes

The supplied screenshot notes 10 rows, 23 clicks and 462 impressions. Those figures are not treated as whole-site totals or search volume. The four reported clusters were Back Channels 23/91, Strange Bedfellows 0/234, Ship Adrift 0/103 and Protection Application 0/34; no ranking or query-page export was available, so no causal claim is made from them.

The existing public titles were retained. A draft can be reconsidered only after 28 days of query-page evidence plus independent evidence or first-hand replay; those are release criteria, not current verification.

## Remaining limits

Patch 1.2 reward behavior, platform differences, later Strange Bedfellows consequences, and a first-hand entry-cost/reward capture remain unverified. The Protection Application +3 Databank versus +4 Zone Cresh conflict remains unresolved.

## Local validation

- Targeted Operation/content tests: 3 files, 12 tests passed.
- Full Vitest suite: 45 files, 162 tests passed after registering the new draft's intent mapping in `tests/content-contract.test.ts`.
- ESLint: passed.
- Production build: passed; 46 static pages generated.

## Font build recovery

The build failure was resolved by bundling the official Latin variable font assets locally and switching `src/app/layout.tsx` to `next/font/local`. Inter, Orbitron and JetBrains Mono total 91,488 bytes; each file has a `wOF2` header, a recorded SHA256 in `public/fonts/README.md`, and its matching OFL text beside it. The post-fix full test suite passed (45 files, 162 tests), lint passed, and `npm.cmd run build` completed successfully with 46 static pages generated. Logs are retained under `artifacts/operation-guides/` for local handoff.

Independent browser acceptance then passed for 8 pages and viewports, 10 interaction stages and 2 search checks with 0 JavaScript errors. `site:audit` passed with 34 public and 4 review routes.
