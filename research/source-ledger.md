# Star Wars Zero Company content research ledger

Research date: 2026-08-30

Public content language: English

Rule: official facts outrank press, press outranks community anecdotes, and disagreement remains visible.

## Channel status

| Channel | Status | How it was used | Boundary |
|---|---|---|---|
| EA / Steam / StarWars.com | Collected | Release, platforms, requirements, systems, Operators, cast, Deck and mod-support status | Primary fact layer |
| Google-style web search | Collected | Located official pages, recent guides, reviews, community discussions and competitors | Search result snippets were opened or cross-checked before use |
| YouTube | Partially collected | Official gameplay trailer page and description | Local transcript CLI unavailable; no unsupported creator transcript claims were used |
| Discord | Indirectly collected | Developer Q&A reported by PC Gamer, plus EA FAQ corroboration | No authenticated Discord session; direct announcement history was not scraped |
| EA Forums / Steam discussions | Collected | Developer-pinned issue updates and community symptom reports | Individual player reports remain community evidence |
| Competitor sites | Collected | Coverage map, chapter/achievement categories, content gaps | Structure and claims were synthesized; wording was not copied |
| Tavily deep research | Blocked | CLI present | No API key configured; manual multi-source research used instead |

## Claim groups

### Official fact layer

- Release: 2026-08-27.
- Platforms: Windows PC storefronts, PlayStation 5, Xbox Series X|S.
- Mode: single-player turn-based tactics; no multiplayer or co-op.
- Eight standard Specializations: Assault, Gunslinger, Heavy, Medic, Scoundrel, Scout, Sharpshooter, Soldier.
- Combat: three AP per Operator turn; attacks, movement, abilities, utilities and Overwatch compete for AP.
- Advantage: shared squad resource, earned through damage, capped at ten in the official gameplay overview, and spent on powerful actions without AP.
- Injuries: a downed Operator gains an Injury; three Injuries kill an Operator on standard settings when permadeath is enabled.
- Steam Deck: not Verified at launch.
- Mods: no official mod support planned.
- Achievements: Steam lists 53.

### Community synthesis layer

- Hawks has no single uncontested best class. Scoundrel supports assist play, Medic adds safety, Gunslinger adds tempo damage, and Scout feeds Advantage.
- Respec unlock is reported at Cycle 3; Focus Points are refunded, while named-character Talents remain fixed.
- Strong squads cover damage, control/Advantage, sustain, and a frontline or displacement role; roster availability and permadeath make replacements essential.
- PC performance varies widely. EA identifies CPU-bound behavior and recommends supported upscalers for the 1440p/60 target. Geometry-detail changes help some players and do nothing for others.
- Native Steam Deck play is not currently a safe recommendation: EA withholds Verified status and two launch tests report sub-30 FPS behavior.
- Community modding exists through Nexus/Vortex/UE tooling, but every mod is unofficial and patch-sensitive.

### Known contradictions and safe editorial decisions

- Steam says an EA account/link may be required while EA FAQ says the EA app is not required. Copy distinguishes app from account.
- Metacritic search snapshots conflict. The site does not hard-code a Metascore; it links the live source and summarizes named reviews.
- Steam review counts change during the day. The site uses the rating label and checked date, not a permanent count.
- Environment Geometry Detail gains are hardware-dependent. The fix page presents it as a reversible test, not a guaranteed FPS boost.
- Trophy missability and one-playthrough feasibility are still being worked out. The trophy page avoids definitive completion-route claims.

## Provenance summary

- 10 official/store/forum/video sources.
- 10 press and developer-Q&A reporting sources.
- 4 community discussion/test sources.
- 5 competitor/reference sources used for gap discovery and cross-checking.

The exact source registry used by the website is maintained in `src/content/sources.ts`.
