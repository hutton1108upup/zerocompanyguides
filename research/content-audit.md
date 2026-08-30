# Content Audit — P0 / P0-B

Audit date: 2026-08-30

Scope reviewed:
- `网站结构/网站结构最终版.md`
- `前端设计方案-最终版.md`
- `research/source-ledger.md`
- `src/content/sources.ts`
- `src/content/pages.ts`
- Live source checks against EA, Steam, StarWars.com, and the cited press pages

## Blockers

1. Publish state currently overclaims certainty.
   - `src/content/pages.ts:34-42` defaults every route to `status: "verified"` and `indexable: true`.
   - That pushes press/community-led pages into the same published state as official-fact pages, even where the page text itself says the site did not test the claim first-hand.
   - Highest-risk affected routes: `/classes/tier-list`, `/builds/hawks`, `/builds/best-team`, `/guides/respec`, `/walkthrough`, `/trophy-guide`, `/performance/pc`, `/performance/steam-deck`, `/mods`, `/worth-it`.
   - Smallest fix: remove the global default and set per-route status/indexability. Keep press/community launch pages `draft` or `needs-retest` until they have first-hand tests or a stronger source pack.

2. The design brief reintroduces claims and routes the structure doc explicitly rejected.
   - `前端设计方案-最终版.md` still calls for a hot ticker with `73K 峰值 / 好评率回升 / +40 FPS`, `7 项导航`, `/wiki/`, and `AggregateRating`.
   - The structure baseline says not to hard-code volatile counts, not to create `/wiki/` beside `/`, to keep 6 primary nav items, and not to fake rating schema.
   - Smallest fix: treat those design notes as invalid until replaced with evidence-safe copy.

3. Three P0 pages are below the structure doc's own launch bar.
   - `/trophy-guide` does not contain the promised 53-item master table or a real missable filter plan.
   - `/performance/pc` does not contain the required tested hardware / patch / resolution / average FPS / 1% low set; it is still an attributed synthesis page.
   - `/walkthrough` is a chapter-order holding page, not an independently verified walkthrough.
   - Smallest fix: either downgrade them to `draft`/`needs-retest` or narrow the copy so the page describes its actual scope.

## Important Corrections

1. `/classes` and `/guides/beginners-guide` overstate the official class advice.
   - Current copy says EA recommends `Soldier or Assault with a Blaster Rifle` for new players.
   - The EA Help class guide is broader: it maps choices to playstyle, and the official text supports several direct or mobile options rather than one narrow beginner recommendation.
   - Fix: rewrite as "straightforward starter options include Soldier, Assault, Gunslinger, or Heavy depending on preferred range/mobility" or soften to "EA maps classes by playstyle."
   - URLs:
     - https://help.ea.com/en/articles/star-wars/zero-company/specialization-and-weapon-class-guide/

2. `/characters` mixes official and press-only evidence.
   - The route is labeled `official`, but its warning says Tel-Rea's Padawan role is not replaceable by another Jedi recruit.
   - That specific "only Jedi" claim is press reporting of a Discord Q&A, not an EA/StarWars.com primary source.
   - Fix: either remove the uniqueness claim from the official page, or keep it and downgrade the page evidence/status for that section.
   - URLs:
     - https://www.pcgamer.com/games/strategy/theres-only-one-jedi-operator-in-star-wars-zero-company-and-reckless-players-may-end-up-with-none-at-all-be-careful-that-nothing-unfortunate-happens-to-her/
     - https://www.ea.com/games/starwars/zero-company
     - https://www.starwars.com/news/sdcc-star-wars-zero-company-cast-announce

3. `/guides/respec` still rests on one press source for the core answer.
   - "Cycle 3" and "Focus Points refunded" are visible in PC Gamer, but not confirmed in the official FAQ or official class guide.
   - The page already says "reported"; that caveat is correct and should stay visible. It should not ship as fully verified/indexable unless you confirm it in-game or find an official source.
   - URLs:
     - https://www.pcgamer.com/games/strategy/star-wars-zero-company-respec-change-class/
     - https://help.ea.com/en/articles/star-wars/zero-company/specialization-and-weapon-class-guide/

4. `/worth-it` cites outlets that are not in the route source list.
   - The prose names GamesRadar and Windows Central, but `sources` for `/worth-it` do not include either source, and neither appears in `src/content/sources.ts`.
   - Fix: add exact source entries first, or remove the named-outlet claim.
   - URLs if kept:
     - https://www.gamesradar.com/games/strategy/star-wars-zero-company-review/
     - https://www.windowscentral.com/gaming/star-wars-zero-company-review

5. `research/source-ledger.md` provenance totals do not match `src/content/sources.ts`.
   - Ledger says `5 community` and `4 competitor/reference`.
   - The actual registry currently resolves to `4 community` and `5 competitor`.
   - Fix: correct the ledger summary before it is reused in UI or release notes.

## Route-by-Route Gaps

| Route | Current support | Main gap | Action |
|---|---|---|---|
| `/` | Adequate official hub | Home promises evidence-labeled builds/walkthroughs whose child pages are still mixed-certainty | Keep, but do not visually imply all linked answers are equally verified |
| `/classes` | Strong official base | Beginner recommendation is too narrow vs EA Help | Soften the recommendation |
| `/classes/tier-list` | Community editorial only | No first-hand testing; route still globally publishes as `verified` | Keep community badge; downgrade publish state until tested |
| `/builds` | Acceptable hub | No first-hand build data yet | Safe as a hub, but avoid "tested" framing |
| `/builds/hawks` | Thin community/press support | "Best" answer relies mainly on one PC Gamer guide plus one Reddit thread | Keep explicit "reported/community" language and downgrade publish state |
| `/builds/best-team` | Thin community/press support | Squad templates are still synthesis; Tel-Rea fallback logic is partly press-only | Keep as provisional templates, not settled meta |
| `/guides` | Strong official mechanics hub | None major | Good launch page |
| `/guides/respec` | Weak for a P0 answer | Core unlock/refund claim is press-only | Keep visible caveat; do not treat as fully verified |
| `/walkthrough` | Under-evidenced | Chapter order is community cross-check only; no verified mission guidance | Present as chapter-order hub only, or noindex until deeper verification |
| `/trophy-guide` | Thin | Missing the promised full 53-entry table and missable logic | Expand materially or downgrade from P0-complete |
| `/performance` | Good official hub | Issue-state copy must stay dated | Keep checked date visible |
| `/performance/pc` | Under launch bar | No site-run benchmark; no 1% lows; exact figures remain third-party | Reframe as synthesis or add first-hand test data |
| `/performance/fps-fix` | Good official-first troubleshooting | None major | Good launch page |
| `/game-info` | Strong official base | Price is region/time sensitive | Keep region + checked date on every price mention |
| `/system-requirements` | Strong official base | None major | Good launch page |
| `/multiplayer` | Strong enough | "No local co-op/split-screen" is an inference from single-player-only official materials, not a separate FAQ line | Optional copy softening to "no such mode is listed" |
| `/characters` | Mostly official | Tel-Rea uniqueness/permadeath warning is not primary-source-backed | Remove or relabel that claim |
| `/characters/voice-cast` | Strong official base | None major | Good launch page |
| `/guides/beginners-guide` | Strong official mechanics base | Repeats the too-narrow beginner-class recommendation | Soften as above |
| `/performance/steam-deck` | Adequate for status page | Native verdict is based on two launch snapshots, not a stable long-term state | Keep it as dated launch status, not evergreen hardware truth |
| `/mods` | Safe caution framing | Thin as a "guide"; mostly ecosystem/status coverage, not direct verified install cases | Either keep as status/safety page or add direct original-mod examples |
| `/worth-it` | Useful editorial page | Named review consensus is under-sourced in the registry | Add the exact review URLs or remove those names |

## Source Count / Provenance Summary

Current registry in `src/content/sources.ts`:
- 10 primary/store/video sources total: 9 `official` + 1 `video`
- 8 `press`
- 4 `community`
- 5 `competitor`

Coverage is strong for:
- release date, platforms, editions, price, language support
- system requirements and CPU/upscaler guidance
- official class list and core combat systems
- cast/voice actor confirmations
- no-Steam-Deck-Verified-at-launch and no-official-mod-support statements

Coverage is weak for:
- "best" class/build/team answers
- respec unlock timing and refund behavior
- chapter order / walkthrough specifics
- trophy missability and one-playthrough routing
- first-hand PC benchmarks
- stable Steam Deck recommendations
- direct mod install/remove compatibility examples

## URLs Used For Corrections

- Official overview: https://www.ea.com/games/starwars/zero-company
- Official FAQ: https://www.ea.com/games/starwars/zero-company/faq
- Official gameplay overview: https://www.ea.com/games/starwars/zero-company/news/lead-zero-company-to-victory
- Official class guide: https://help.ea.com/en/articles/star-wars/zero-company/specialization-and-weapon-class-guide/
- Steam store page: https://store.steampowered.com/app/2075800/STAR_WARS_Zero_Company/
- Official cast page: https://www.starwars.com/news/sdcc-star-wars-zero-company-cast-announce
- PC Gamer respec guide: https://www.pcgamer.com/games/strategy/star-wars-zero-company-respec-change-class/
- PC Gamer starting-class guide: https://www.pcgamer.com/games/strategy/star-wars-zero-company-best-class-specialization/
- PC Gamer Tel-Rea / Jedi report: https://www.pcgamer.com/games/strategy/theres-only-one-jedi-operator-in-star-wars-zero-company-and-reckless-players-may-end-up-with-none-at-all-be-careful-that-nothing-unfortunate-happens-to-her/
- PC Gamer review: https://www.pcgamer.com/games/strategy/star-wars-zero-company-review/
- Steam Deck HQ launch note: https://steamdeckhq.com/news/star-wars-zero-company-not-good-on-steam-deck/
- GamesRadar review: https://www.gamesradar.com/games/strategy/star-wars-zero-company-review/
- Windows Central review: https://www.windowscentral.com/gaming/star-wars-zero-company-review
