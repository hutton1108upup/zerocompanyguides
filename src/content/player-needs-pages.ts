import type { ContentPage } from "./types";

type GuideInput = Pick<ContentPage, "path" | "navLabel" | "title" | "description" | "h1" | "summary" | "sources" | "related" | "blocks"> & Partial<Pick<ContentPage, "spoiler" | "gameVersion" | "status" | "verification" | "indexable" | "difficulty">>;

function guide(input: GuideInput): ContentPage {
  return {
    kicker: "Campaign field guide",
    pageType: "article",
    evidence: "community",
    verification: "source-verified-synthesis",
    status: "verified",
    indexable: true,
    lastVerified: "2026-09-23",
    gameVersion: "Official rules and attributed community strategy reviewed 2026-09-23; no first-hand campaign test",
    platforms: ["PC", "PS5", "Xbox Series X|S"],
    difficulty: "General campaign advice",
    spoiler: "none",
    ...input,
  };
}

export const playerNeedsPages: ContentPage[] = [
  guide({
    path: "/guides/reinforcements-and-extraction",
    navLabel: "Reinforcements & Extraction",
    spoiler: "minor",
    title: "Star Wars Zero Company Reinforcements & Extraction Guide",
    description: "Handle incoming reinforcements in Star Wars Zero Company: identify the objective, budget movement, cover the retreat and distinguish a delay from a mission blocker.",
    h1: "Star Wars Zero Company Reinforcements & Extraction",
    summary: "On an extraction objective, clear the enemies blocking your route and move toward the exit together. On a holdout or elimination objective, keep fighting until that objective changes. Reinforcement rules depend on the mission.",
    sources: ["starwars-play-guide", "ea-community-qa", "ea-tactics-basics", "reddit-reinforcement-pressure", "steam-infinite-reinforcements", "ops-enemy-intelligence"],
    related: ["/guides/beginners-guide", "/walkthrough", "/builds/best-team", "/guides/permadeath", "/performance/fps-fix"],
    blocks: [
      { type: "briefing", items: [
        "Are reinforcements infinite? There is no single rule for every mission. Players report both finite waves and repeated arrivals tied to unfinished objectives.",
        "StarWars.com advises that defeating every enemy is unnecessary unless the mission requires it. The objective panel takes priority over a generic clear-the-map habit.",
        "A route to extraction is a squad problem: protect the slowest or injured Operator, not just the first character who can reach the exit.",
      ] },
      { type: "table", heading: "Should you fight another wave or move?", caption: "Match the next action to the objective currently on screen.", columns: ["Current objective", "Your priority", "Avoid"], rows: [
        ["Defend or hold a point", "Cover approaches and conserve the tools needed for later arrivals", "Abandoning the required area because another guide recommends rushing the exit"],
        ["Sabotage or interact with a target", "Make a route to the interaction, then read the next objective", "Spending every turn fighting new arrivals without progressing the objective"],
        ["Rescue or retrieve", "Check who must reach the target and what the mission asks next", "Assuming reaching the target automatically completes extraction"],
        ["Extract or escape", "Remove enemies blocking the route and move the whole required group", "Chasing distant kills that do not make the route safer"],
        ["Eliminate all enemies", "Finish the stated combat objective and inspect remaining hostiles", "Applying an escape strategy to a mission that explicitly requires a clear"],
      ] },
      { type: "steps", heading: "How do you move toward extraction under fire?", items: [
        { title: "Find the destination and the slowest squadmate", body: "Read the objective, locate its marker and compare the movement preview for each required Operator. Plan from the character who cannot keep up." },
        { title: "Choose the next safe position", body: "Work toward cover along the route. A closer enemy is worth attacking when it blocks movement or threatens the retreat; a distant enemy may not be." },
        { title: "Reserve movement before committing attacks", body: "Inspect the action cost shown by the game. Do not spend the full turn on damage and only then discover that the squad cannot reach its next position." },
        { title: "Use a rear guard without stranding it", body: "If Overwatch can protect the route, position the Operator first. It ends that Operator's turn, so check where they will be left when the rest move." },
        { title: "Check the objective after an interaction or arrival", body: "An objective can change. Confirm what the game asks before waiting for another wave or assuming that one Operator at the marker is enough." },
      ] },
      { type: "warning", heading: "Mission example below contains spoilers", body: "The next section names the objectives and an enemy in Enemy Intelligence. Skip it if you want to discover the story missions yourself.", tone: "amber" },
      { type: "steps", heading: "Example: when does Enemy Intelligence become an escape mission?", intro: "Zero Company Ops lists this sequence: control platform, data downlink, defeat Visser, then Escape. The tactical suggestions here apply that objective sequence; the source does not establish exact spawn counts or a tile-by-tile route.", items: [
        { title: "Reach the control platform and access the downlink", body: "Advance the listed interactions. Fighting an extra wave without reaching the interaction does not complete either objective." },
        { title: "Complete the Visser objective", body: "Keep the current target in mind while dealing with enemies that prevent you reaching or damaging it. Do not start using extraction advice before the game asks you to escape." },
        { title: "Switch to movement when Escape appears", body: "Locate the escape marker. Choose the next reachable cover position for the slowest required unit, then assign the rest of the squad to clear or cover that route." },
        { title: "Spend attacks on the route, not the whole map", body: "For example, if one enemy blocks the next cover position and another is behind the squad, compare their threat to the retreat. Deal with the route blocker first when it is the immediate danger, and keep enough movement to use the cleared path." },
      ] },
      { type: "cards", heading: "Check the example or troubleshoot a stalled action", items: [
        { title: "Enemy Intelligence objective sequence", body: "Open the community mission checklist used for this example.", href: "https://zerocompanyops.com/missions/enemy-intelligence", tone: "cyan" },
        { title: "Slow turns and Overwatch delays", body: "If the game stops resolving actions, follow the symptom checklist instead of waiting for another wave.", href: "/performance/fps-fix#slow-turns-and-overwatch-delays", tone: "amber" },
      ] },
      { type: "table", heading: "More enemies, a delayed action or a blocked mission?", caption: "Describe the symptom before treating it as a performance fault.", columns: ["Observation", "Check", "Next step"], rows: [
        ["Waves continue while an objective remains", "Current task and required interaction", "Advance the objective before concluding that the spawns are broken"],
        ["A reaction takes a long time, then completes", "Elapsed time and action sequence", "Use the slow-turn section of the performance guide"],
        ["A required unit cannot act or the objective never updates", "AP, status, menu response and exact scene", "Preserve the save and report a possible blocker; do not assume another wave will fix it"],
      ] },
      { type: "faq", heading: "Reinforcement questions", items: [
        { question: "Can I wait until every reinforcement is dead?", answer: "Only rely on that plan when the live objective calls for it. Community reports describe different reinforcement patterns across missions; there is no verified universal final wave." },
        { question: "Should all four Operators use Overwatch?", answer: "Not automatically. It can suit defense, but each Operator committed to Overwatch has finished their turn. On an extraction objective, consider the movement that still needs to happen." },
      ] },
    ],
  }),
  guide({
    path: "/guides/credits-and-den-upgrades",
    navLabel: "Credits & Den Upgrades",
    title: "Star Wars Zero Company Credits & Den Upgrade Priorities",
    description: "Decide how to spend scarce Credits in Star Wars Zero Company: compare Den upgrades, recovery, recruitment and Black Market purchases without a rigid build order.",
    h1: "Star Wars Zero Company Credits & Den Upgrades",
    summary: "Keep enough Credits to field a healthy squad. Then prioritize useful equipment slots and early Networking; buy Black Market improvements when you can also afford the gear. Upgrade the weapon types your regular squad carries before spreading money across the whole Armory.",
    sources: ["ea-gameplay-overview", "ea-community-qa", "reddit-credit-budget", "reddit-credit-shortage", "prodigy-den-upgrades", "allthings-den-priorities"],
    related: ["/guides/beginners-guide", "/walkthrough", "/characters/companions", "/weapons", "/guides/permadeath"],
    blocks: [
      { type: "briefing", items: [
        "Credits, Intel and upgrade materials are different constraints. More Credits do not replace missing prerequisites or an unavailable material.",
        "For a first campaign, preserve urgent recovery and mission access before optional shopping. Then improve the roles and weapons the squad actually uses.",
        "The order below is our recommendation for a healthy first-campaign squad. Move recovery to the top when injuries prevent the next deployment.",
      ] },
      { type: "table", heading: "Which Den upgrades should you prioritize?", caption: "Names and effects are described in the linked community upgrade guides; priority is our editorial recommendation. Prices and unlock levels are not independently verified here.", columns: ["Priority and upgrade", "What you gain", "When to buy or postpone"], rows: [
        ["First when useful: Utility Items / Weapon Mods", "Additional equipment slots at the relevant upgrades", "Buy when spare Utilities or Mods can improve the active squad. Follow the branch prerequisites before budgeting for the slot"],
        ["Early investment: Networking", "Improved Influence gains", "Move it up when you are still building regional rewards and have Contacts to use; it has less time to pay back near the finale"],
        ["Conditional: Black Market Quality I", "Better-tier shop stock", "Budget for the improvement and the item you want. Postpone it if mission rewards already supply the equipment you need"],
        ["Squad-specific: weapon Movement Distance / Damage", "Benefits the matching weapon category", "Prioritize the category shared by regular Operators; defer branches used only by the bench"],
        ["Urgent only when needed: Medbay capacity", "More room for recovery", "Move it ahead of combat upgrades if injuries repeatedly leave the next mission without a usable team"],
      ] },
      { type: "steps", heading: "A Credit budget before every deployment", items: [
        { title: "Price the immediate obligation", body: "Record treatment, recruitment or another expense needed for the next mission. Use the live costs, not a fixed Credit reserve copied from someone else's difficulty or roster." },
        { title: "Price one useful upgrade", body: "Check Credits, materials, prerequisites and completion time. Choose a concrete benefit for the active squad instead of trying to improve every branch at once." },
        { title: "Compare available rewards before advancing", body: "Read Operations, Tactical Missions and regional rewards. If the desired reward is a material, a high-Credit mission alone may not solve the upgrade gate." },
        { title: "Shop only with the remainder", body: "Treat planned income as uncertain until earned. Buy an item when it changes the next loadout or strategy, rather than because the inventory refreshed." },
      ] },
      { type: "prose", heading: "What if you can afford only one upgrade?", paragraphs: ["Suppose the squad is healthy, you have useful spare Weapon Mods, and you can afford either a mod-slot improvement or Black Market Quality I. Prefer the slot: it lets you use equipment already owned. Shop quality still leaves a second bill for the item itself. If the squad has no worthwhile spare equipment, that advantage disappears.", "Change the decision when two regular Operators are injured and recovery is blocking an expiring mission. Price treatment or a ready replacement first. A combat upgrade that leaves you unable to field the team does not solve the immediate problem."] },
      { type: "prose", heading: "How can you earn more Credits?", paragraphs: ["Compare available mission and regional rewards, then choose work that fits the remaining deadlines. Operations also consume Intel, so reserve enough for a companion prerequisite before buying an optional reward with it.", "Players also use Thievery Operators and sell redundant equipment. Check the talent effect before spending a squad slot on income, and keep equipment needed by replacements. There is no need to sell every spare item just because it is not equipped today."] },
      { type: "table", heading: "Black Market and upgrades: where the advice disagrees", caption: "Prodigygamers favors early shop quality; the linked Reddit discussion includes both buyers and players who avoided it. These are preferences, not universal rules.", columns: ["Choice", "Reason to consider it", "Reason to wait"], rows: [
        ["Black Market investment", "A specific item or improved stock serves your intended loadout", "You can afford the shop improvement but not the purchase that makes it worthwhile"],
        ["Medical capacity", "Repeated injuries leave useful Operators unavailable", "The existing recovery plan handles the roster without delaying valued missions"],
        ["Weapon upgrades", "Several regular Operators benefit from the same class", "You are spreading spending across weapons rarely deployed"],
        ["Selling spare equipment", "It is redundant for both the active and replacement squad", "Future slots or alternate loadouts could use it; a first run may need flexibility"],
      ] },
      { type: "faq", heading: "Credits and upgrade questions", items: [
        { question: "Do I need to upgrade the Den every Cycle?", answer: "No fixed spending schedule is recommended. Compare the next upgrade's benefit with recovery, recruitment, equipment and deadlines. Keeping Credits can be a deliberate choice." },
        { question: "Should I buy shop quality before equipment slots?", answer: "Prefer an available slot upgrade when you already own useful equipment for it. Buy shop quality first when the current shop cannot supply a missing capability and you can afford the later purchase too." },
        { question: "Why am I still blocked when I have enough Credits?", answer: "Check the upgrade's other requirements, including materials, prerequisites and construction availability. Do not assume every greyed-out upgrade is a money problem." },
      ] },
    ],
  }),
  guide({
    path: "/walkthrough/retake-mordant-citadel",
    navLabel: "Retake Mordant Citadel",
    title: "Star Wars Zero Company Visser Boss Guide: Mordant Citadel",
    description: "Prepare for Visser in Retake Mordant Citadel: compare squad roles, manage the escort and Plague Miasma, and check the mission objective after the boss falls.",
    h1: "Star Wars Zero Company: Visser at Mordant Citadel",
    summary: "At Mordant Citadel, reduce the escort's pressure before concentrating attacks on Visser. Keep an answer to Miasma ready and save Advantage for that opening. This page separates the published route from player-reported alternatives.",
    status: "needs-retest",
    verification: "needs-retest",
    indexable: false,
    difficulty: "Encounter advice; difficulty-specific clear not verified",
    spoiler: "major",
    gameVersion: "September 2–4 encounter guides and official rules reviewed 2026-09-23; no first-hand post-1.1 replay",
    sources: ["starwars-visser", "ea-community-qa", "ea-tactics-basics", "allthings-visser", "indiatimes-visser", "reddit-visser-difficulty", "reddit-citadel-boss"],
    related: ["/walkthrough", "/builds/best-team", "/characters/companions", "/guides/reinforcements-and-extraction", "/performance/fps-fix"],
    blocks: [
      { type: "warning", heading: "Spoilers and review status", body: "For Retake Mordant Citadel, not every Visser encounter. This source-based draft remains out of search indexing while the exact completion condition and post-1.1 behavior await an independent replay. Published walkthroughs and player reports are distinguished below.", tone: "amber" },
      { type: "briefing", items: [
        "Prepare control, recovery and a way to concentrate damage on one target. Hawks occupies the required commander slot on this story mission.",
        "The published route thins the escort before the boss push. Do not keep chasing newly arrived enemies if a safe opportunity to attack Visser is already open.",
        "Players report disabling Miasma with control effects. Check whether the effect actually disappears before committing the rest of the squad's attacks.",
      ] },
      { type: "table", heading: "Who should you bring to Mordant Citadel?", caption: "Choose a developed squad that covers these jobs.", columns: ["Job", "Example", "If unavailable"], rows: [
        ["Commander and recovery", "Hawks with a support loadout", "Hawks remains required for the story mission; bring recovery elsewhere if Hawks is built for damage"],
        ["Displacement and control", "Tel-Rea", "Inspect the control and Utilities you actually have; another Operator is not a like-for-like Jedi replacement"],
        ["Mobility and group pressure", "Cly", "Plan shorter moves between safe positions instead of assuming another unit can cross the arena the same way"],
        ["Finish a prepared target", "Jae or your developed damage role", "Use reliable damage and a complete action budget; do not build the plan around an unavailable passive"],
      ] },
      { type: "steps", heading: "How should you approach the fight?", intro: "The published Citadel walkthrough uses this sequence. Adapt positioning to the enemies and status effects in your save.", items: [
        { title: "Inspect the escort before rushing Visser", body: "Identify enemies that sustain or threaten the group and remove reachable threats. Do not chase a distant support unit if reaching it strands an Operator." },
        { title: "Use the arena to reduce incoming attacks", body: "The guides describe ledge displacement against escort units. Check positioning and the ability preview; avoid assuming the same move works against every target." },
        { title: "Save Advantage for Visser", body: "Keep enough for the control ability you plan to use on him. Spend ordinary attacks on a weak escort enemy when using an expensive ability would leave you without that control option." },
        { title: "Leave Plague Miasma", body: "Encounter coverage identifies Miasma as ground to avoid. Reposition before committing to a stationary firing plan, even if the affected tile has attractive cover." },
        { title: "Commit a coordinated damage turn", body: "When escort pressure is manageable, prepare sightlines and combine the squad's available attacks. The guides report Force Push working on Visser; treat it as a sourced option, not a guaranteed result for every patch or status." },
        { title: "Check what remains after Visser falls", body: "The two published guides say remaining Coil enemies must be defeated. Their overlapping coverage is not independent confirmation, so this completion condition remains under review. If your objective says Escape, move to that marker instead of waiting for a clear-all result." },
      ] },
      { type: "table", heading: "What do players report about Miasma?", caption: "Reports from the mining-citadel discussion; no current-build reproduction by this site.", columns: ["Reported option", "Evidence", "How to use the report"], rows: [
        ["Force Push or Pull", "A player identifies Jedi displacement as a way to remove Miasma", "Check the status change after the action before spending the remaining attacks"],
        ["Assault / Heavy control", "An Expert/Beskar finisher describes Trick as Assault and Kabb as Heavy", "This supports alternative squad roles, not a guarantee that any build of those classes works"],
        ["Astromech or burning", "Other replies name these options without a complete setup", "Keep as research leads; this guide does not prescribe an unidentified ability or duration"],
      ] },
      { type: "cards", heading: "Review the encounter evidence", intro: "The timestamps below are supplied by All Things How. Direct video playback could not be checked during this review; they are reference links, not claims that this site watched the sequence.", items: [
        { title: "00:35 — escort displacement", body: "The article identifies this point in PazarGamingGuides's footage as a push near the arena edge.", href: "https://www.youtube.com/watch?v=GyT9eIoVYuo&t=35s", tone: "cyan" },
        { title: "01:55 — Cly's action", body: "The article identifies Combat Jump and the Advantage display at this point.", href: "https://www.youtube.com/watch?v=GyT9eIoVYuo&t=115s", tone: "cyan" },
        { title: "Mining-citadel player discussion", body: "Compare the control options and differently configured squads reported by players.", href: "https://www.reddit.com/r/ZeroCompany/comments/1w1yla9/i_just_hit_one_of_the_boss_fights_and_need_to_rant/", tone: "amber" },
      ] },
      { type: "table", heading: "Why a retry can fail in the same way", caption: "Diagnostic questions rather than hidden enemy formulas.", columns: ["What went wrong", "Before the next attempt", "Do not assume"], rows: [
        ["The squad cannot finish a target", "Check active defensive effects, sightlines and total available attacks before splitting damage", "A generic tier-list rank guarantees enough damage"],
        ["The boss survives while more enemies arrive", "Compare escort pressure with the opportunity for a coordinated boss turn", "Endlessly clearing every arrival is always safer than progressing"],
        ["A companion is missing or badly injured", "Choose a functional replacement and revise the sequence", "A named four-person squad is the only way to win"],
        ["Actions stop resolving or the objective will not update", "Record the build, scene and remaining objective; use the softlock checklist", "Losing a difficult fight and a non-responsive action are the same problem"],
      ] },
      { type: "faq", heading: "Visser fight questions", items: [
        { question: "Is Visser the same fight in every mission?", answer: "Do not assume that. This page is scoped to Retake Mordant Citadel; match the mission title and live objective before following its cleanup advice." },
        { question: "Is the guide tested on Expert or Beskar?", answer: "This site has not replayed the encounter on those settings. Use the plan as source-based preparation, not a guaranteed safe route for a one-save campaign." },
      ] },
    ],
  }),
];
