import type { ContentPage } from "./types";
import { getMediaBlocksForPath } from "./media";

export const requiredPublicPaths = [
  "/",
  "/classes",
  "/classes/tier-list",
  "/builds",
  "/builds/hawks",
  "/builds/best-team",
  "/guides",
  "/guides/respec",
  "/walkthrough",
  "/trophy-guide",
  "/performance",
  "/performance/pc",
  "/performance/fps-fix",
  "/game-info",
  "/system-requirements",
  "/multiplayer",
  "/characters",
  "/characters/voice-cast",
  "/guides/beginners-guide",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
] as const;

type PageInput = Omit<
  ContentPage,
  "status" | "verification" | "indexable" | "lastVerified" | "gameVersion" | "platforms" | "difficulty" | "spoiler"
> &
  Partial<
    Pick<
      ContentPage,
      "status" | "verification" | "indexable" | "lastVerified" | "platforms" | "difficulty" | "spoiler" | "gameVersion"
    >
  >;

const page = (input: PageInput): ContentPage => {
  const { blocks, verification, ...rest } = input;
  const media = getMediaBlocksForPath(input.path);
  const insertionIndex = blocks[0]?.type === "briefing" ? 1 : 0;
  const defaultVerification =
    input.status === "needs-retest" || input.evidence === "unverified"
      ? "needs-retest"
      : input.evidence === "official"
        ? "official-verified"
        : "source-verified-synthesis";

  return {
    status: "verified",
    verification: verification ?? defaultVerification,
    indexable: true,
    lastVerified: "2026-08-30",
    gameVersion: "Launch build — checked 2026-08-30",
    platforms: ["PC", "PS5", "Xbox Series X|S"],
    difficulty: "All difficulties",
    spoiler: "none",
    ...rest,
    blocks: [
      ...blocks.slice(0, insertionIndex),
      ...media,
      ...blocks.slice(insertionIndex),
    ],
  };
};

export const contentPages: ContentPage[] = [
  page({
    path: "/",
    navLabel: "Home",
    title: "Star Wars Zero Company Wiki, Builds and Walkthroughs",
    description:
      "Evidence-labeled Star Wars Zero Company builds, classes, walkthrough planning, trophies, performance fixes, characters and official game information.",
    h1: "Star Wars Zero Company Wiki & Guide",
    kicker: "Every move counts",
    summary: "Fast routes to class choices, squad planning, campaign help and launch technical guidance.",
    pageType: "home",
    evidence: "official",
    sources: ["ea-game", "ea-faq", "steam-store", "ea-official-video"],
    related: ["/builds/hawks", "/classes", "/performance/pc", "/walkthrough"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Choose a class or Hawks build before spending Focus Points.",
          "Check the launch technical status before changing advanced PC settings.",
          "Use the spoiler-labeled walkthrough and trophy pages when you are ready to progress.",
        ],
      },
      {
        type: "faq",
        heading: "Quick questions",
        items: [
          { question: "Is Zero Company multiplayer?", answer: "No. EA describes it as a single-player campaign with no online or local co-op modes." },
          { question: "Can I change Hawks' class?", answer: "Yes. Launch guides report Change Specialization unlocking at Cycle 3, with specialization Focus Points refunded." },
          { question: "Is it Steam Deck Verified?", answer: "No. EA says the game will not be Steam Deck Verified at launch." },
          { question: "Are mods officially supported?", answer: "No. Community mods exist, but EA says there is no official mod support planned." },
        ],
      },
    ],
  }),
  page({
    path: "/classes",
    navLabel: "Classes",
    title: "Star Wars Zero Company Classes and Specializations Guide",
    description:
      "Compare all eight official Zero Company Specializations by combat role, signature abilities, learning curve and the playstyles each class supports.",
    h1: "All Classes and Specializations",
    kicker: "Operator doctrine",
    summary:
      "Eight standard Specializations define how most Operators fight; each has an Ultimate, Standard action and passive kit.",
    pageType: "hub",
    evidence: "official",
    sources: ["ea-specializations", "ea-class-guide", "ea-gameplay-overview"],
    related: ["/classes/tier-list", "/builds/hawks", "/builds/best-team"],
    blocks: [
      {
        type: "briefing",
        items: [
          "New to tactics? EA uses Soldier or Assault with a Blaster Rifle as a straightforward starter example, not a universal best build.",
          "Damage is not the only job: Scout creates Advantage, Scoundrel creates assists and vulnerabilities, and Medic protects the run.",
          "Later dual-Specialization choices make role combinations more important than a single launch tier list.",
        ],
      },
      {
        type: "table",
        heading: "The eight standard Specializations",
        caption: "Official role descriptions, condensed from EA's Specialization guide.",
        columns: ["Class", "Primary job", "Signature tools", "Best fit"],
        rows: [
          ["Assault", "Mobile frontline", "Bull Rush, displacement, exposed-target pressure", "Aggressive close-to-mid range"],
          ["Gunslinger", "Tempo damage", "Extra attacks, quick sidearm shots, critical pressure", "Fast offensive turns"],
          ["Heavy", "Tank and aggro", "Taunt, retaliation, armor and health", "Holding exposed ground"],
          ["Medic", "Sustain and recovery", "Morale healing, Combat Stim, stronger Medpacs", "Permadeath safety"],
          ["Scoundrel", "Assist and setup", "Vulnerable, assist damage, defense penetration", "Coordinated focus fire"],
          ["Scout", "Recon and Advantage", "Combat Recon, Spotted, Advantage generation", "Team economy"],
          ["Sharpshooter", "Long-range precision", "Guaranteed hit, accuracy setup, improved Overwatch", "Stable firing positions"],
          ["Soldier", "All-round offense", "Rocket area damage, melee Daze, broad combat tools", "Straightforward versatility"],
        ],
      },
      {
        type: "cards",
        heading: "Choose by the turn you want to repeat",
        items: [
          { title: "Move and break cover", label: "Assault", body: "Use mobility and displacement to expose targets for the rest of the squad.", tone: "amber" },
          { title: "Create the team's next action", label: "Scout / Scoundrel", body: "Generate Advantage, mark targets and turn one attack into coordinated damage.", tone: "cyan" },
          { title: "Protect a long campaign", label: "Medic / Heavy", body: "Reduce injury pressure or redirect attacks when the campaign cannot afford another loss.", tone: "green" },
        ],
      },
      {
        type: "faq",
        heading: "Class questions",
        items: [
          { question: "Are there eight classes?", answer: "EA lists eight standard Specializations. Authored Operators can also have unique or locked Specializations and Talents." },
          { question: "Can every Operator change class?", answer: "Hawks and Custom Operators can change Specializations. Authored Operators retain assigned Talents, and some of their Specializations cannot be changed." },
        ],
      },
    ],
  }),
  page({
    path: "/classes/tier-list",
    navLabel: "Class Tier List",
    title: "Star Wars Zero Company Class Tier List by Squad Role",
    description:
      "A scenario-based Zero Company class tier list comparing early game, damage, support, Advantage economy, positioning and permadeath value.",
    h1: "Best Classes Ranked by Mission Job",
    kicker: "Community synthesis",
    summary:
      "There is no uncontested best class at launch, so this ranking scores repeatable squad value rather than raw damage alone.",
    pageType: "decision",
    evidence: "community",
    sources: ["ea-class-guide", "pcg-best-class", "mobalytics-tier", "reddit-hawks"],
    related: ["/classes", "/builds/hawks", "/builds/best-team"],
    blocks: [
      {
        type: "warning",
        heading: "A tier list is an editorial model",
        body: "Launch guides disagree because difficulty, Operator Talents, secondary Specializations and squad composition change the result. Use the role matrix before copying a letter grade.",
        tone: "cyan",
      },
      {
        type: "table",
        heading: "Task-based ranking",
        caption: "Community synthesis checked on August 30, 2026; not first-hand testing by this site.",
        columns: ["Mission job", "Top candidates", "Why", "Trade-off"],
        rows: [
          ["Beginner clarity", "Soldier, Assault", "Officially recommended for learning movement and attacks", "Less specialized team utility"],
          ["Priority-target setup", "Scoundrel", "Vulnerable and Assist tools multiply allied attacks", "Needs line of sight and follow-up"],
          ["Advantage economy", "Scout", "Recon and Spotted effects improve the whole squad", "Lower direct burst"],
          ["Run safety", "Medic, Heavy", "Prevents losses or absorbs pressure", "May be more defense than early missions need"],
          ["Burst damage", "Gunslinger, Soldier", "Extra attacks or area damage close fights quickly", "Resource and positioning dependent"],
          ["Long sightlines", "Sharpshooter", "Accuracy and Overwatch reward preparation", "Movement breaks setup"],
        ],
      },
      {
        type: "prose",
        heading: "Our launch ordering",
        paragraphs: [
          "For broad campaign utility, Scoundrel, Scout and Medic form the top decision tier because they change what the entire squad can do. Gunslinger, Soldier and Assault sit close behind when a mission rewards tempo. Heavy and Sharpshooter are powerful in the right geometry but more sensitive to enemy behavior and position.",
          "That ordering is deliberately provisional. A balance patch, a different secondary Specialization or a named Operator's fixed Talent can move any class by a full tier.",
        ],
      },
      {
        type: "faq",
        heading: "Tier-list questions",
        items: [
          { question: "What is the safest first choice?", answer: "EA points new tactics players toward Soldier or Assault. PC Gamer favors Scoundrel for early Hawks synergy. Both are defensible; choose simple direct actions or team setup." },
          { question: "Is Heavy bad?", answer: "No. Heavy's taunt, retaliation and durability solve a specific frontline problem. It ranks lower only when a mission does not need a dedicated tank." },
        ],
      },
    ],
  }),
  page({
    path: "/builds",
    navLabel: "Builds",
    title: "Best Star Wars Zero Company Builds and Squad Roles",
    description:
      "Plan Zero Company builds around Operator Talents, primary and secondary Specializations, weapon AP costs, team jobs and available replacements.",
    h1: "Zero Company Builds",
    kicker: "Loadout command",
    summary: "A useful build answers a mission job, not just a damage question.",
    pageType: "hub",
    evidence: "community",
    sources: ["ea-class-guide", "ea-gameplay-overview", "pcg-best-class", "reddit-squads"],
    related: ["/builds/hawks", "/builds/best-team", "/classes"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Start with the Operator's fixed Talent and the job your squad is missing.",
          "Check weapon AP cost before assuming a class name dictates the weapon.",
          "Every recommended team needs a replacement plan because permadeath and story availability change the roster.",
        ],
      },
      {
        type: "cards",
        heading: "Build paths",
        items: [
          { title: "Hawks by playstyle", label: "Leader", body: "Compare Scoundrel, Medic, Gunslinger and Scout without pretending one route wins every difficulty.", href: "/builds/hawks", tone: "amber" },
          { title: "Role-complete squads", label: "Four slots", body: "Balance damage, control, sustain and frontline pressure, then record a substitute for each role.", href: "/builds/best-team", tone: "cyan" },
          { title: "Class reference", label: "Eight standards", body: "Read official role and ability descriptions before spending Focus Points.", href: "/classes", tone: "green" },
        ],
      },
      {
        type: "steps",
        heading: "Build in the right order",
        items: [
          { title: "1. Name the job", body: "Damage, Advantage, control, sustain or space-holding. If a build does not name its job, it cannot be evaluated." },
          { title: "2. Respect the fixed Talent", body: "Authored Operators keep assigned Talents. A good class pairing reinforces that unique value instead of replacing it." },
          { title: "3. Budget AP", body: "Movement, weapon attacks, utilities and Standard actions compete for three AP. Expensive weapons change the turn." },
          { title: "4. Add a replacement", body: "Record which class or recruit can cover the role if a story Operator is unavailable or injured." },
        ],
      },
    ],
  }),
  page({
    path: "/builds/hawks",
    navLabel: "Hawks Build",
    title: "Best Class for Hawks: Builds by Playstyle and Difficulty",
    description:
      "Compare Scoundrel, Medic, Gunslinger and Scout Hawks builds with their squad role, weapon logic, strengths, weaknesses and secondary-class options.",
    h1: "Best Hawks Class and Build",
    kicker: "Commander loadout",
    summary:
      "Scoundrel is the strongest early setup recommendation, but Medic, Gunslinger and Scout can be better for safety, burst or Advantage economy.",
    pageType: "decision",
    evidence: "community",
    sources: ["ea-class-guide", "pcg-best-class", "pcg-respec", "reddit-hawks"],
    related: ["/classes/tier-list", "/guides/respec", "/builds/best-team"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Best early coordinated option: Scoundrel, because Hawks already rewards squad follow-up and assists.",
          "Best safety option: Medic, especially when permanent losses matter more than speed.",
          "Best direct-damage option: Gunslinger; best team-economy option: Scout.",
          "These are external launch recommendations, not a first-hand benchmark by this site.",
        ],
      },
      {
        type: "table",
        heading: "Hawks build decision matrix",
        caption: "Choose the repeated turn pattern you want Hawks to create.",
        columns: ["Playstyle", "Primary", "Secondary candidate", "Weapon logic", "Main risk"],
        rows: [
          ["Assist leader", "Scoundrel", "Scout or Medic", "Blaster Rifle for flexible sightlines", "Needs allies ready to follow up"],
          ["Permadeath safety", "Medic", "Scout or Gunslinger", "Stay near the formation; prioritize AP flexibility", "Lower early kill speed"],
          ["Tempo damage", "Gunslinger", "Medic or Scoundrel", "Pistol for cheap actions or Rifle for reach", "Can over-invest in damage"],
          ["Advantage engine", "Scout", "Scoundrel", "Use a weapon that keeps Spotted pressure available", "Less personal burst"],
          ["Simple first run", "Soldier or Assault", "Medic", "Blaster Rifle", "Less differentiated from recruits"],
        ],
      },
      {
        type: "prose",
        heading: "Why the sources disagree",
        paragraphs: [
          "PC Gamer recommends Scoundrel at the start, while players report successful Medic, Gunslinger and Scout Hawks builds. The disagreement is expected: early difficulty, companion choices, weapon AP cost and the later secondary Specialization all change the answer.",
          "Treat the first choice as a learning direction, not an irreversible build. Respec becomes available early, and refunded Focus Points reduce the cost of changing course.",
        ],
      },
      {
        type: "warning",
        heading: "Do not copy a talent order without the same patch",
        body: "Named-Talent details and balance can change. This page intentionally stops at role and pairing guidance until a launch-version talent-by-talent test is available.",
        tone: "amber",
      },
      {
        type: "faq",
        heading: "Hawks build questions",
        items: [
          { question: "Can I fix a bad first class choice?", answer: "Yes. Launch guides report Change Specialization becoming available at Cycle 3, with spent Focus Points refunded for the specialization change." },
          { question: "Does Hawks need to be the Medic?", answer: "No. Medic is a safety choice, not a requirement. A Custom Operator can cover sustain if Hawks is built for assists or damage." },
        ],
      },
    ],
  }),
  page({
    path: "/builds/best-team",
    navLabel: "Best Team",
    title: "Best Squad Compositions in Star Wars Zero Company",
    description:
      "Build balanced Zero Company squads for a first run, aggressive play or permadeath with clear jobs, replacement rules and role coverage.",
    h1: "Best Squads and Team Compositions",
    kicker: "Four-slot doctrine",
    summary: "The best squad is a coverage plan with replacements, not four fixed names.",
    pageType: "decision",
    evidence: "community",
    sources: ["ea-gameplay-overview", "reddit-squads", "destructoid-squads", "pcg-discord-jedi"],
    related: ["/builds/hawks", "/classes", "/guides/beginners-guide"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Cover four jobs: reliable damage, setup/Advantage, sustain and frontline or displacement.",
          "Rotate only when the mission or injury state demands it; Bonds reward repeated deployment together.",
          "Tel-Rea is unique, so a Jedi-dependent plan needs a non-Jedi fallback.",
        ],
      },
      {
        type: "table",
        heading: "Squad templates",
        caption: "Role templates synthesized from official systems and early player squads.",
        columns: ["Plan", "Slot 1", "Slot 2", "Slot 3", "Slot 4"],
        rows: [
          ["Balanced first run", "Hawks: Scoundrel", "Medic", "Assault / Heavy", "Sharpshooter / Gunslinger"],
          ["Advantage chain", "Hawks: Scout", "Scoundrel", "Gunslinger", "Displacement / control"],
          ["Permadeath safety", "Hawks: Medic", "Heavy", "Sharpshooter", "Scout"],
          ["Aggressive clear", "Hawks: Gunslinger", "Assault", "Scoundrel", "Scout or Medic"],
        ],
      },
      {
        type: "cards",
        heading: "Replacement rules",
        items: [
          { title: "Lost a damage dealer", body: "Replace the job with Gunslinger, Soldier or Sharpshooter; keep the team's setup and sustain intact.", tone: "red" },
          { title: "Lost your support", body: "Move Hawks or a Custom Operator into Medic/Scout coverage before adding more damage.", tone: "amber" },
          { title: "No Tel-Rea", body: "Replace displacement and control, not the Jedi label. Assault and utility effects can recreate part of the tactical job.", tone: "cyan" },
        ],
      },
      {
        type: "faq",
        heading: "Squad questions",
        items: [
          { question: "Should I use the same four Operators forever?", answer: "A stable core builds familiarity and Bonds, but injuries, mission requirements and permadeath make a trained reserve valuable." },
          { question: "Is Tel-Rea mandatory?", answer: "No. Early guides value her unique Padawan tools, but the campaign must remain playable after losses. Build a displacement/control fallback." },
        ],
      },
    ],
  }),
  page({
    path: "/guides",
    navLabel: "Guides",
    title: "Star Wars Zero Company Guides for Combat and Progression",
    description:
      "Learn Zero Company's core loop, Action Points, Advantage, cover, injuries, Bonds, respec rules, the Den and mission planning without forced spoilers.",
    h1: "Combat and Progression Guides",
    kicker: "Field manual",
    summary: "Understand the rules that shape every Cycle before optimizing a single build.",
    pageType: "hub",
    evidence: "official",
    sources: ["ea-gameplay-overview", "ea-faq", "ea-class-guide"],
    related: ["/guides/beginners-guide", "/guides/respec", "/walkthrough"],
    blocks: [
      {
        type: "cards",
        heading: "Start with the problem in front of you",
        items: [
          { title: "First mission fundamentals", body: "Three AP, cover, Overwatch, Advantage and a four-role squad plan.", href: "/guides/beginners-guide", tone: "green" },
          { title: "Change Specialization", body: "When respec unlocks, what is refunded and which authored Talents stay fixed.", href: "/guides/respec", tone: "cyan" },
          { title: "Campaign order", body: "A spoiler-labeled chapter index and before-you-deploy checklist.", href: "/walkthrough", tone: "amber" },
        ],
      },
      {
        type: "prose",
        heading: "The campaign loop",
        paragraphs: [
          "At the Den, recruit, equip, heal and talk with Operators. The Holotable presents Operations and Tactical Missions. Operations can return resources or choices without a tactical battle; Tactical Missions advance the Cycle and can expire.",
          "On the battlefield, every Operator starts with three AP. Movement distance, weapon type, abilities and Overwatch all compete for that budget, while Advantage is a separate shared resource for powerful actions.",
        ],
      },
      {
        type: "warning",
        heading: "Finish Den business before a critical mission",
        body: "The official overview warns that starting a Tactical Mission advances the Cycle. Time-limited Operations and Missions can disappear, so compare expiring options before deployment.",
        tone: "amber",
      },
    ],
  }),
  page({
    path: "/guides/respec",
    navLabel: "Respec Guide",
    title: "How to Respec and Change Specialization in Zero Company",
    description:
      "Learn when Change Specialization unlocks, how Focus Point refunds work, which Operators can switch and what authored Talents cannot be changed.",
    h1: "How to Change Specialization and Respec",
    kicker: "Reconfigure operator",
    summary: "Launch guides place the first class-change access at Cycle 3, early enough to treat the opening choice as reversible.",
    pageType: "article",
    evidence: "community",
    sources: ["ea-class-guide", "pcg-respec", "pcg-best-class"],
    related: ["/builds/hawks", "/classes", "/guides/beginners-guide"],
    blocks: [
      {
        type: "steps",
        heading: "Change a Specialization",
        intro: "Menu labels can vary by platform; the rules below are the launch-version flow reported by PC Gamer and consistent with EA's official class guide.",
        items: [
          { title: "Reach Cycle 3", body: "Change Specialization is reported to unlock early in the campaign, after the first two Cycles." },
          { title: "Open the Operator's specialization controls", body: "Select Hawks or an eligible recruited Operator and choose Change Specialization." },
          { title: "Review the refund", body: "Focus Points spent in the changed Specialization are reported as refunded so they can be reassigned." },
          { title: "Rebuild for the squad job", body: "Choose a role, weapon AP pattern and replacement plan before reinvesting." },
        ],
      },
      {
        type: "table",
        heading: "What can change",
        caption: "Official and launch-guide boundaries.",
        columns: ["Element", "Changeable?", "Boundary"],
        rows: [
          ["Hawks standard Specialization", "Yes", "Available after Change Specialization unlocks"],
          ["Custom Operator Specialization", "Yes", "EA explicitly permits changing Custom Operators"],
          ["Authored Operator Talent", "No", "Assigned named Talents remain fixed"],
          ["Some authored Specializations", "Not always", "EA says some cannot be changed"],
          ["Weapon class", "Yes", "Evaluate AP cost and role after switching"],
        ],
      },
      {
        type: "faq",
        heading: "Respec questions",
        items: [
          { question: "Do I lose Focus Points?", answer: "PC Gamer reports that points invested in the changed Specialization are refunded. Check the confirmation screen before accepting after future patches." },
          { question: "Can I remove a story character's unique Talent?", answer: "No. Authored Talents are identity-defining and remain assigned." },
        ],
      },
    ],
  }),
  page({
    path: "/walkthrough",
    navLabel: "Walkthrough",
    title: "Star Wars Zero Company Walkthrough Hub and Chapter Order",
    description:
      "Use a spoiler-labeled Zero Company campaign index with chapter order, Cycle planning, before-deploy checks, missable warnings and completion links.",
    h1: "Walkthrough Hub and Campaign Chapter Order",
    kicker: "Campaign operations",
    summary: "This hub confirms the community-reported 14-part order but does not invent step-by-step solutions the site has not independently verified.",
    pageType: "hub",
    evidence: "community",
    spoiler: "minor",
    sources: ["ea-gameplay-overview", "allthings-chapters", "pcg-review"],
    related: ["/trophy-guide", "/guides/beginners-guide", "/builds/best-team"],
    blocks: [
      {
        type: "warning",
        heading: "Spoiler level: minor",
        body: "The table reveals chapter titles and broad campaign order. It does not disclose endings, character outcomes or boss solutions.",
        tone: "amber",
      },
      {
        type: "table",
        heading: "Community-reported chapter order",
        caption: "Cross-checked on August 30, 2026. Individual chapter pages remain gated pending independent walkthrough evidence.",
        columns: ["#", "Chapter", "Before advancing"],
        rows: [
          ["1", "Prologue", "Learn the AP and cover loop"],
          ["2", "Business as Usual", "Review early Den facilities"],
          ["3", "In Debt to the Hutts", "Compare expiring Operations"],
          ["4", "Republic Intelligence", "Check squad jobs and injuries"],
          ["5", "Smugglers and Slugrats", "Review choices before deployment"],
          ["6", "Enter Fathom", "Carry a control and sustain plan"],
          ["7", "Jedi Undercover", "Protect unique Operators"],
          ["8", "The Umbaran Connection", "Check long-range coverage"],
          ["9", "The Fathom Menace", "Prepare a replacement plan"],
          ["10", "Liberate Luunata", "Clear desired Den conversations"],
          ["11", "Tighten the Noose", "Review achievement conditions"],
          ["12", "Back to Business", "Repair equipment and injuries"],
          ["13", "Fathom's Grand Designs", "Create a pre-finale save if the mode allows"],
          ["14", "Epilogue", "Review remaining completion tasks"],
        ],
      },
      {
        type: "steps",
        heading: "Before every Tactical Mission",
        items: [
          { title: "Scan expiring content", body: "Operations and Missions can be time-limited. Decide what you are willing to lose before advancing the Cycle." },
          { title: "Check injuries", body: "A downed Operator gains an Injury, and the official overview describes three Injuries as fatal on standard permadeath settings." },
          { title: "Cover four jobs", body: "Bring damage, setup/Advantage, sustain and a way to hold or reshape space." },
          { title: "Read the objective", body: "Rescue, sabotage and narrative missions reward different movement and risk plans." },
        ],
      },
    ],
  }),
  page({
    path: "/trophy-guide",
    navLabel: "Trophies",
    title: "Star Wars Zero Company Trophy and Achievement Guide",
    description:
      "Plan all 53 Zero Company achievements with story, difficulty, combat, Bond and permadeath categories plus honest missability warnings.",
    h1: "Trophy and Achievement Guide",
    kicker: "Completion protocol",
    summary: "Steam confirms 53 achievements; route optimization and one-playthrough claims remain provisional this close to launch.",
    pageType: "article",
    evidence: "community",
    spoiler: "minor",
    sources: ["steam-store", "allthings-achievements", "ea-faq"],
    related: ["/walkthrough", "/guides/beginners-guide", "/builds/best-team"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Steam lists 53 achievements; platform trophy distributions can present the same goals differently.",
          "Difficulty, Bond, combat and permanent-loss goals deserve separate planning passes.",
          "Do not assume one playthrough is confirmed until post-launch completion routes converge.",
        ],
      },
      {
        type: "table",
        heading: "Roadmap categories",
        caption: "Category-level roadmap; exact unlock descriptions belong to the live platform list.",
        columns: ["Category", "Plan early?", "Main risk", "Safe action"],
        rows: [
          ["Story", "Low", "Title spoilers", "Let natural progress unlock them"],
          ["Difficulty", "High", "Changing mode may affect eligibility", "Choose target difficulty before starting"],
          ["Bonds", "High", "Too much squad rotation", "Keep a core while building reserves"],
          ["Combat", "Medium", "Missing a specific setup", "Track conditions before finishing enemies"],
          ["Permadeath / loss", "High", "Conflicts with a no-loss run", "Separate save or later run where allowed"],
          ["Collection / equipment", "Medium", "Spending and missed Operations", "Review Den upgrades each Cycle"],
        ],
      },
      {
        type: "table",
        heading: "All 53 trophies and achievements",
        intro: "This list exposes hidden trophy names and mission titles. Conditions are cross-checked against the launch achievement list; route and missability advice remains community evidence.",
        caption: "Full launch list grouped by planning category.",
        columns: ["Achievement", "Category", "Requirement"],
        rows: [
          ["Hired Gun", "Difficulty", "Finish the campaign on Story difficulty or above"],
          ["Veteran", "Difficulty", "Finish the campaign on Normal difficulty or above"],
          ["Operator", "Difficulty", "Finish the campaign on Hard difficulty or above"],
          ["Captain", "Difficulty", "Finish the campaign on Expert"],
          ["Legend", "Difficulty", "Finish Expert with Beskar Mode active"],
          ["In a galaxy far, far away…", "Story", "Complete the first mission"],
          ["Scum And Villainy", "Story", "Complete Eavesdropping"],
          ["Fathom Revealed", "Story", "Complete Dark Waters"],
          ["One Less Clanker", "Story", "Complete Smugglers' Den"],
          ["Sky High", "Story", "Complete Casualties of War"],
          ["A Way to Pass the Time", "Story", "Complete Enemy Intelligence"],
          ["Luunata Reclaimed", "Story", "Complete Behind Enemy Lines"],
          ["A New Order", "Story", "Complete Stillwatch"],
          ["Jungle Warfare", "Story", "Complete Deep Cover"],
          ["With Friends Like These", "Story", "Complete Unfinished Business"],
          ["An End of the Infinite", "Story", "Complete The Infinite Coil"],
          ["The Trooper", "Operator story", "Complete Trick's story"],
          ["The Umbaran", "Operator story", "Complete Luco's story"],
          ["The Prizefighter", "Operator story", "Complete Kabb's story"],
          ["The Baroness", "Operator story", "Complete Jae's story"],
          ["The Mandalorian", "Operator story", "Complete Cly's story"],
          ["The Padawan", "Operator story", "Complete Tel-Rea's story"],
          ["Old Friends", "Bond", "Reach Very High Bond with Hawks and Trick"],
          ["Sharp Shooters", "Bond", "Reach Very High Bond with Hawks and Luco"],
          ["Mate and Marrow", "Bond", "Reach Very High Bond with Hawks and Kabb"],
          ["Class and Distinction", "Bond", "Reach Very High Bond with Hawks and Jae"],
          ["Word Of Honor", "Bond", "Reach Very High Bond with Hawks and Cly"],
          ["Lost Causes", "Bond", "Reach Very High Bond with Hawks and Tel-Rea"],
          ["Heroes on Both Sides", "Bond", "Reach Very High Bond with Trick and Luco"],
          ["The Baroness and the Boxer", "Bond", "Reach Very High Bond with Kabb and Jae"],
          ["Thick As Thieves", "Bond", "Reach Very High Bond with two Custom Operators"],
          ["Beep Boop", "Bond", "Reach Very High Bond with two Astromechs"],
          ["Never Tell Me the Odds", "Combat", "Land a shot at 10% hit chance or lower"],
          ["Do or Do Not", "Combat", "Miss a shot at 90% hit chance or higher"],
          ["Forceful", "Combat", "Push or pull one enemy into another with the Force"],
          ["Watch That First Step", "Combat", "Knock an enemy out of the combat area"],
          ["The High Ground", "Combat", "Defeat 10 enemies from higher elevation"],
          ["See Your Own Demise", "Combat", "Defeat a Seer in one blow"],
          ["Angry Beeps", "Combat", "Complete a mission with four Astromechs"],
          ["If You Know You Know", "Combat", "Defeat 1,138 enemies in Tactical Missions"],
          ["Dress Code", "Company", "Customize a Zero Company member"],
          ["Signature Flair", "Company", "Customize a weapon"],
          ["Fully Geared", "Company", "Equip four weapon mods on one weapon"],
          ["Where Credit Is Due", "Company", "Buy an item at The Black Market"],
          ["Sign Here", "Company", "Recruit an Operator"],
          ["Full Roster", "Company", "Recruit 20 Operators in one campaign"],
          ["Your Focus Determines Your Reality", "Company", "Spend a Focus Point"],
          ["A Natural Part of Life", "Company", "Lose a member of Zero Company"],
          ["Active Duty", "Company", "Complete 50 optional missions"],
          ["To the Victor Go the Spoils", "Company", "Unlock one Regional Reward"],
          ["Across the Stars", "Company", "Unlock every Regional Reward"],
          ["There Will Be No Bargain", "Company", "Unlock the Hutt Roulette Prize three times"],
          ["Zero Company Legend", "Completion", "Earn every other trophy or achievement"],
        ],
      },
      {
        type: "warning",
        heading: "Missability is not fully settled",
        body: "Early community lists disagree about what can be cleaned up after the story. Treat difficulty, Bonds, campaign choices and intentional-loss requirements as planning-sensitive until a verified postgame audit is available.",
        tone: "amber",
      },
      {
        type: "faq",
        heading: "Completion questions",
        items: [
          { question: "Are there online trophies?", answer: "The game is single-player. Steam's feature list does not imply multiplayer achievement requirements." },
          { question: "Can I get everything in one run?", answer: "That is not confirmed here. Conflicting goals and difficulty settings make a second run a safer assumption for planning." },
        ],
      },
    ],
  }),
  page({
    path: "/performance",
    navLabel: "Performance",
    title: "Star Wars Zero Company Performance and Fixes Hub",
    description:
      "Check official Zero Company PC requirements, current issue updates, safe troubleshooting, Steam Deck launch status and evidence-labeled settings guidance.",
    h1: "Performance and Technical Intel",
    kicker: "Systems diagnostic",
    summary: "Start with official issue guidance, then test one reversible graphics change at a time.",
    pageType: "hub",
    evidence: "official",
    sources: ["ea-faq", "steam-issue-update", "steam-store", "ea-forums"],
    related: ["/performance/pc", "/performance/fps-fix", "/performance/steam-deck"],
    blocks: [
      {
        type: "cards",
        heading: "Choose the right diagnostic",
        items: [
          { title: "PC performance", body: "Official CPU/upscaler context, measured-review evidence and settings trade-offs.", href: "/performance/pc", tone: "cyan" },
          { title: "Stutter and crashes", body: "Driver, file, Intel stability and reversible settings checks in a safe order.", href: "/performance/fps-fix", tone: "red" },
          { title: "Steam Deck", body: "Official unsupported-at-launch status and two launch-test snapshots.", href: "/performance/steam-deck", tone: "amber" },
        ],
      },
      {
        type: "warning",
        heading: "Current developer issue status",
        body: "EA's pinned Steam update says the team is investigating crashes and CPU threading. It also points NVIDIA users on older drivers toward an update and Intel 13th/14th-gen desktop users toward motherboard-vendor BIOS guidance.",
        tone: "red",
      },
      {
        type: "prose",
        heading: "Evidence rule",
        paragraphs: [
          "This site did not run its own hardware benchmark. Numbers are attributed to the exact reviewer or community test that produced them.",
          "A setting that gains frames on one system can be neutral or worse on another. Change one option, retest the same scene and keep a rollback path.",
        ],
      },
    ],
  }),
  page({
    path: "/performance/pc",
    navLabel: "PC Performance",
    title: "Star Wars Zero Company PC Performance Evidence and Settings",
    description:
      "Understand Zero Company's CPU-bound launch behavior, official upscaler target, hardware review results and a conservative settings test order.",
    h1: "PC Performance Evidence and Settings",
    kicker: "Launch benchmark synthesis",
    summary: "Performance varies sharply by CPU, scene and upscaler; no single preset or geometry toggle is a guaranteed fix.",
    pageType: "tech",
    evidence: "community",
    verification: "needs-retest",
    platforms: ["PC"],
    sources: ["ea-faq", "steam-issue-update", "pcg-review", "techradar-review", "gamesgg-settings", "reddit-geometry"],
    related: ["/system-requirements", "/performance/fps-fix", "/performance/steam-deck"],
    blocks: [
      {
        type: "briefing",
        items: [
          "EA says its 1440p/60 recommended target uses TSR or vendor upscalers rather than native resolution.",
          "EA describes the game as CPU-bound, so lowering every GPU setting may not scale frame rate as expected.",
          "Reviewer results differ: TechRadar reports mostly 60 FPS on an RTX 3060 Ti/Ryzen 7 5700X, while PC Gamer reports serious low-settings/Deck limits and two hard crashes.",
        ],
      },
      {
        type: "table",
        heading: "Published launch tests",
        caption: "External tests only; configurations and scenes are not directly comparable.",
        columns: ["Source", "Hardware", "Reported result", "Limit"],
        rows: [
          ["TechRadar", "RTX 3060 Ti / Ryzen 7 5700X", "Mostly 60 FPS; occasional high-40s to low-50s", "Review scenes and settings vary"],
          ["PC Gamer", "Core i5-12600K / RX 9070 XT / 32 GB", "Positive desktop review but two hard crashes", "No full settings table"],
          ["EA target", "RTX 3080 or RX 7800 XT / 32 GB", "1440p / 60 / High with upscaling", "Target, not a guarantee for every scene"],
        ],
      },
      {
        type: "steps",
        heading: "Conservative settings order",
        items: [
          { title: "Use the recommended upscaler path", body: "Start with TSR, DLSS or FSR at a quality setting appropriate to the output resolution; EA says upscaling is part of its 1440p/60 target." },
          { title: "Set a stable frame target", body: "A consistent cap can improve pacing, but measure the same busy scene before and after." },
          { title: "Test CPU-heavy scene behavior", body: "If GPU use is low and presets barely change FPS, avoid destroying image quality for no gain." },
          { title: "Test Environment Geometry Detail last", body: "Some players report large gains and others no benefit. Toggle it in the same scene and keep the better result for your system." },
        ],
      },
      {
        type: "warning",
        heading: "No first-hand benchmark from this site",
        body: "The table attributes every number to its original reviewer. We do not provide estimated FPS for untested hardware.",
        tone: "cyan",
      },
    ],
  }),
  page({
    path: "/performance/fps-fix",
    navLabel: "FPS & Crash Fix",
    title: "How to Fix Zero Company Stutter, Low FPS and Crashes",
    description:
      "Work through official driver, game-file and Intel stability guidance before reversible settings tests for Zero Company stutter, low FPS or crashes.",
    h1: "Fix Stutter, Low FPS and Crashes",
    kicker: "Safe diagnostic sequence",
    summary: "Apply the lowest-risk official checks first; community config changes are not universal fixes.",
    pageType: "tech",
    evidence: "official",
    platforms: ["PC"],
    sources: ["steam-issue-update", "ea-faq", "ea-forums", "reddit-geometry"],
    related: ["/performance/pc", "/system-requirements", "/mods"],
    blocks: [
      {
        type: "steps",
        heading: "Troubleshoot in this order",
        items: [
          { title: "1. Record the symptom", body: "Note whether the crash is at startup, during shader work, in one repeatable scene or after extended play. Different patterns need different evidence." },
          { title: "2. Update supported GPU drivers", body: "EA's pinned update specifically calls out NVIDIA Game Ready 610.88 or older for DLSS-related crashes." },
          { title: "3. Verify game files", body: "Use the repair/verify function in Steam, EA app or Epic after a crash or interrupted update." },
          { title: "4. Check Intel 13th/14th-gen desktop stability", body: "If applicable, follow Intel and your motherboard vendor's current BIOS guidance. Do not flash a BIOS using instructions from a game guide." },
          { title: "5. Reset to a known graphics baseline", body: "Use the default recommended preset and supported upscaler, then change one setting at a time." },
          { title: "6. Test Geometry Detail", body: "Treat Off as a reversible hardware-specific experiment, not a promised 40-FPS fix." },
        ],
      },
      {
        type: "table",
        heading: "Risk ladder",
        caption: "Stop when the problem is resolved; do not stack unmeasured changes.",
        columns: ["Action", "Risk", "Rollback"],
        rows: [
          ["Driver update", "Low", "Use vendor-supported rollback if the new driver introduces issues"],
          ["Verify files", "Low", "No content change expected; custom files may be removed"],
          ["In-game setting", "Low", "Restore previous value"],
          ["Delete/reset config", "Medium", "Back up the config folder first"],
          ["BIOS update", "High", "Use motherboard-vendor process only"],
          ["Engine.ini or mod tweak", "Experimental", "Back up, remove tweak, verify files"],
        ],
      },
      {
        type: "warning",
        heading: "Do not combine every community tweak",
        body: "Multiple Engine.ini changes make causality and rollback harder. This page does not recommend an unofficial config pack without a patch-matched source, backup and removal path.",
        tone: "red",
      },
      {
        type: "faq",
        heading: "Technical questions",
        items: [
          { question: "Does turning off Environment Geometry Detail always help?", answer: "No. Reports range from large gains to no meaningful change. Test the same scene on your own system." },
          { question: "Why does Low look similar to High in FPS?", answer: "EA describes the game as CPU-bound, so some GPU-quality reductions may not change the limiting workload." },
        ],
      },
    ],
  }),
  page({
    path: "/game-info",
    navLabel: "Game Info",
    title: "Star Wars Zero Company Release, Platforms, Price and Editions",
    description:
      "Check Zero Company's release date, supported PC and console platforms, current US Steam price, editions, language support, campaign format and official trailer.",
    h1: "Release Date, Platforms and Price",
    kicker: "Official game file",
    summary: "Released August 27, 2026 for PC, PlayStation 5 and Xbox Series X|S as a single-player tactics game.",
    pageType: "article",
    evidence: "official",
    sources: ["ea-game", "steam-store", "ea-faq", "ea-official-video"],
    related: ["/system-requirements", "/multiplayer", "/worth-it"],
    blocks: [
      {
        type: "facts",
        heading: "Quick facts",
        items: [
          { label: "Release", value: "August 27, 2026" },
          { label: "Platforms", value: "PC, PS5, Xbox Series X|S" },
          { label: "Developer", value: "Bit Reactor" },
          { label: "Publisher", value: "Electronic Arts" },
          { label: "Mode", value: "Single-player turn-based tactics" },
          { label: "US Steam price", value: "$49.99 Standard / $59.99 Deluxe", note: "Checked 2026-08-30; regional prices vary." },
        ],
      },
      {
        type: "table",
        heading: "Where to play",
        caption: "Officially listed launch platforms and storefront context.",
        columns: ["Platform", "Status", "Storefront / note"],
        rows: [
          ["Windows PC", "Available", "Steam, EA app, Epic Games Store"],
          ["PlayStation 5", "Available", "PlayStation Store / retail where offered"],
          ["Xbox Series X|S", "Available", "Xbox Store / retail where offered"],
          ["Nintendo Switch", "Not announced", "Do not treat absence as a future-platform decision"],
          ["macOS", "No native version listed", "Steam requirements list Windows 10/11"],
        ],
      },
      {
        type: "table",
        heading: "Standard vs Deluxe",
        caption: "Steam US pricing and official cosmetic contents checked August 30, 2026.",
        columns: ["Edition", "US Steam price", "What changes"],
        rows: [
          ["Standard", "$49.99", "Full base game"],
          ["Deluxe", "$59.99", "Cosmetic armor, faction themes and weapon appearance sets"],
          ["Deluxe Upgrade", "$9.99", "Cosmetic upgrade for Standard owners"],
        ],
      },
      {
        type: "faq",
        heading: "Game information questions",
        items: [
          { question: "Is this an action game?", answer: "No. It is a squad-based, turn-based tactics game with cinematic story sequences and some third-person exploration between tactical encounters." },
          { question: "Is the Deluxe Edition required for classes or missions?", answer: "The listed Deluxe contents are cosmetic. The base campaign and standard classes are part of the base game." },
        ],
      },
    ],
  }),
  page({
    path: "/system-requirements",
    navLabel: "System Requirements",
    title: "Star Wars Zero Company PC System Requirements",
    description:
      "Compare the official Zero Company minimum 1080p/30 Low and recommended 1440p/60 High PC targets, storage, memory and upscaler context.",
    h1: "PC System Requirements",
    kicker: "Hardware manifest",
    summary: "The recommended target is 1440p/60 High with TSR or a vendor upscaler, not a stated native-resolution target.",
    pageType: "tech",
    evidence: "official",
    platforms: ["PC"],
    sources: ["steam-store", "ea-faq"],
    related: ["/performance/pc", "/performance/fps-fix", "/game-info"],
    blocks: [
      {
        type: "table",
        heading: "Official PC targets",
        caption: "EA and Steam requirements checked August 30, 2026.",
        columns: ["Component", "Minimum", "Recommended"],
        rows: [
          ["Target", "1920×1080 / 30 FPS / Low", "2560×1440 / 60 FPS / High with upscaling"],
          ["OS", "64-bit Windows 10/11", "64-bit Windows 10/11 (Windows 11 recommended)"],
          ["CPU", "Intel i5-8400 / Ryzen 5 2600X", "Intel i7-10700K / Ryzen 7 3700X"],
          ["Memory", "16 GB RAM", "32 GB RAM"],
          ["NVIDIA GPU", "GeForce GTX 1080", "GeForce RTX 3080"],
          ["AMD GPU", "Radeon RX 5600 XT", "Radeon RX 7800 XT"],
          ["Intel GPU", "Arc B580", "No recommended Intel GPU listed"],
          ["Storage", "50 GB", "50 GB"],
          ["API", "DirectX 12", "DirectX 12"],
        ],
      },
      {
        type: "warning",
        heading: "A requirement is a target, not a guarantee",
        body: "EA says the game is CPU-bound and that the recommended 1440p/60 target uses TSR, DLSS or FSR. Mission density, drivers and CPU stability can change actual results.",
        tone: "cyan",
      },
      {
        type: "faq",
        heading: "Requirements questions",
        items: [
          { question: "Does the recommended RTX 3080 target mean native 1440p?", answer: "No. EA says the target is best achieved using the default TSR or a vendor upscaler such as DLSS or FSR." },
          { question: "Is 16 GB enough?", answer: "It meets the published minimum. EA lists 32 GB for the recommended target, so 16 GB should not be described as the recommended experience." },
        ],
      },
    ],
  }),
  page({
    path: "/multiplayer",
    navLabel: "Multiplayer",
    title: "Is Star Wars Zero Company Multiplayer or Co-op?",
    description:
      "Zero Company is single-player only. Check the official answer for online multiplayer, local co-op, split screen, offline needs and the Steam EA-app distinction.",
    h1: "Does Zero Company Have Multiplayer?",
    kicker: "Direct answer",
    summary: "No. Star Wars Zero Company has no competitive multiplayer, online co-op, local co-op or split-screen mode.",
    pageType: "article",
    evidence: "official",
    sources: ["ea-faq", "ea-game", "steam-store"],
    related: ["/game-info", "/worth-it", "/guides/beginners-guide"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Single-player campaign only.",
          "No online multiplayer or competitive mode.",
          "No online co-op, local co-op or split-screen co-op.",
        ],
      },
      {
        type: "prose",
        heading: "What the official FAQ says",
        paragraphs: [
          "EA describes Zero Company as a single-player game built around recruiting and leading a squad through tactical missions and a story-driven campaign. Squad members are controlled by one player rather than separate co-op players.",
          "EA also says the Steam version is Steam-native and does not require the EA app. The Steam store separately states that an EA account and account linking may be required; app installation and account requirements are not the same thing.",
        ],
      },
      {
        type: "faq",
        heading: "Multiplayer questions",
        items: [
          { question: "Can a friend control another Operator?", answer: "No official co-op mode is included." },
          { question: "Does single-player mean no internet is ever needed?", answer: "The campaign is single-player, but downloading, updating and storefront/account functions can still require a connection." },
        ],
      },
    ],
  }),
  page({
    path: "/characters",
    navLabel: "Characters",
    title: "Star Wars Zero Company Characters and Operators",
    description:
      "Meet Hawks, Trick, Tel-Rea, Cly, Luco, Jae, Kabb and Runa with official roles, backgrounds, recruitment context and links to builds and voice actors.",
    h1: "Characters and Operators",
    kicker: "Company dossiers",
    summary: "Authored Operators join through the story; Custom Operators are recruited and personalized by the player.",
    pageType: "hub",
    evidence: "official",
    sources: ["ea-game", "ea-gameplay-overview", "starwars-cast"],
    related: ["/characters/voice-cast", "/builds/best-team", "/builds/hawks"],
    blocks: [
      {
        type: "table",
        heading: "Authored Company roster",
        caption: "Official background summary; combat availability changes as the story progresses.",
        columns: ["Character", "Official identity", "Tactical / story note"],
        rows: [
          ["Hawks", "Former Grand Army captain; customizable leader", "Required commander whose standard Specialization can change"],
          ["Trick (CT-3301)", "Veteran clone trooper and long-time Hawks ally", "Soldier history; authored Talent remains fixed"],
          ["Tel-Rea Vokoss", "Tognath Jedi Padawan", "Force-focused authored role; protect her if permadeath is enabled"],
          ["Cly Kullervo", "Mandalorian warrior and Verminoth-clan survivor", "Revenge-driven authored Operator"],
          ["Luco Bronc", "Umbaran sharpshooter", "Long-range identity and Republic tension"],
          ["Jae Mordant", "Former ore baroness of Luunata", "Political and campaign connection to Luunata"],
          ["Kabb Uppercut", "Felsi ex-boxer, thief and bounty fighter", "Cybernetic arm and displacement identity"],
          ["Runa Blask", "Hawks' right hand and company manager", "Den staff and story character, not presented here as a combat build"],
        ],
      },
      {
        type: "prose",
        heading: "Authored vs Custom Operators",
        paragraphs: [
          "Authored Operators enter the company as the story unfolds and bring fixed identity Talents. Custom Operators are recruited directly and can be personalized in appearance, clothing, voice and name.",
          "A character dossier should answer who the person is and how they enter the campaign. Build pages answer how to use a combat role; keeping those jobs separate prevents duplicated thin pages.",
        ],
      },
      {
        type: "warning",
        heading: "Permadeath can change the cast",
        body: "EA allows permadeath to be toggled in supported difficulty settings. Once an authored Operator is fully part of the campaign, losing them can change later roster availability and relationship opportunities.",
        tone: "amber",
      },
    ],
  }),
  page({
    path: "/characters/voice-cast",
    navLabel: "Voice Cast",
    title: "Star Wars Zero Company Voice Cast and Characters",
    description:
      "See the officially announced Zero Company voice cast for both Hawks voices, Trick, Runa, Tel-Rea, Cly, Jae, Kabb, Fathom and other major characters.",
    h1: "Voice Cast and Voice Actors",
    kicker: "Transmission credits",
    summary: "StarWars.com announced the cast at SDCC 2026; this page lists confirmed roles only.",
    pageType: "article",
    evidence: "official",
    sources: ["starwars-cast"],
    related: ["/characters", "/game-info", "/walkthrough"],
    blocks: [
      {
        type: "table",
        heading: "Confirmed cast",
        caption: "Official StarWars.com announcement checked August 30, 2026.",
        columns: ["Character", "Voice actor", "Known for"],
        rows: [
          ["Hawks (masculine)", "Jonathan Freeman", "Goliath, Children's Hospital"],
          ["Hawks (feminine)", "Erica Luttrell", "Star Wars: Squadrons, Steven Universe"],
          ["Kundri Fathom", "Rekha Sharma", "Star Trek: Discovery, Battlestar Galactica"],
          ["Trick", "Dee Bradley Baker", "The Clone Wars, The Bad Batch"],
          ["Anakin Skywalker", "Matt Lanter", "The Clone Wars, The Mandalorian"],
          ["Runa Blask", "Vic Michaelis", "Dropout, Ponies"],
          ["Kabb Uppercut", "JB Blanc", "Arcane"],
          ["Jae Mordant", "Judy Alice Lee", "Marvel Rivals"],
          ["Cly Kullervo", "Alex McKenna", "Red Dead Redemption 2"],
          ["Bennic Halloren", "Leo Howard", "Kickin' It"],
          ["Tel-Rea", "Nicole Rainteau", "Criminal Minds"],
          ["Neesh Renark", "Jim Pirri", "Marvel's Spider-Man 2"],
          ["M-3VO / Meevo", "D.C. Douglas", "Mass Effect 2, Jedi: Survivor"],
        ],
      },
      {
        type: "faq",
        heading: "Cast questions",
        items: [
          { question: "Does Hawks have two voice actors?", answer: "Yes. The official cast announcement lists Jonathan Freeman for masculine Hawks and Erica Luttrell for feminine Hawks." },
          { question: "Who voices Runa Blask?", answer: "Vic Michaelis." },
        ],
      },
    ],
  }),
  page({
    path: "/guides/beginners-guide",
    navLabel: "Beginner Guide",
    title: "Star Wars Zero Company Beginner Guide and First-Cycle Tips",
    description:
      "Learn the three-AP turn, cover, Overwatch, Advantage, injuries, permadeath, Bonds, the Den and a safe first-mission squad checklist.",
    h1: "Beginner Guide: Win the First Cycles",
    kicker: "Recruit training",
    summary: "Solve the next enemy turn before chasing damage: use cover, reserve a response and keep the squad's jobs visible.",
    pageType: "article",
    evidence: "official",
    sources: ["ea-gameplay-overview", "ea-class-guide", "ea-faq"],
    related: ["/classes", "/builds/hawks", "/walkthrough"],
    blocks: [
      {
        type: "briefing",
        items: [
          "Each Operator has three AP; movement distance and weapon type change the cost of a turn.",
          "Cover changes hit chance. Flanking, height and displacement create better shots than repeating a bad one.",
          "Advantage is shared, caps at ten in EA's overview and powers special actions without AP.",
          "A third Injury is fatal on standard permadeath settings, so extraction and healing are campaign resources.",
        ],
      },
      {
        type: "steps",
        heading: "A reliable early turn",
        items: [
          { title: "Identify the next threat", body: "Choose the enemy most able to injure the squad on its activation, not simply the closest target." },
          { title: "Create the shot", body: "Flank, move to height, break cover or apply Vulnerable/Spotted before committing the damage dealer." },
          { title: "Spend Advantage deliberately", body: "Use it to rescue a bad turn or finish a priority target; do not sit at the ten-point cap." },
          { title: "End in cover or Overwatch", body: "The official overview calls Overwatch a natural final action because it ends that Operator's turn." },
        ],
      },
      {
        type: "table",
        heading: "Before deployment",
        caption: "First-Cycle checklist.",
        columns: ["Check", "Question"],
        rows: [
          ["Injuries", "Is anyone one Injury away from permanent loss?"],
          ["Squad jobs", "Who supplies damage, setup, sustain and space control?"],
          ["Expiring content", "Which Operation or Mission disappears after this Cycle?"],
          ["Weapons", "Can every Operator still move after their intended attack?"],
          ["Bonds", "Is this the group whose relationship you want to develop?"],
        ],
      },
      {
        type: "faq",
        heading: "Beginner questions",
        items: [
          { question: "Should I turn permadeath off?", answer: "EA lets players adjust the setting. Keep it on for campaign consequences or turn it off while learning; neither choice changes the fact that injuries reduce combat readiness." },
          { question: "What class is easiest to learn?", answer: "EA uses Soldier or Assault with a Blaster Rifle as a straightforward beginner example. It is a learning path, not a claim that other classes are poor starters." },
        ],
      },
    ],
  }),
  page({
    path: "/performance/steam-deck",
    navLabel: "Steam Deck",
    title: "Star Wars Zero Company Steam Deck Performance Status",
    description:
      "Check the official not-Verified-at-launch status, two attributed launch performance tests, image-quality trade-offs and safer alternatives for Steam Deck.",
    h1: "Steam Deck Performance and Settings",
    kicker: "Unsupported launch profile",
    summary: "Native Steam Deck play is not a safe recommendation at launch; streaming from a stronger PC is the lower-risk option.",
    pageType: "tech",
    evidence: "community",
    verification: "needs-retest",
    platforms: ["Steam Deck"],
    sources: ["ea-faq", "pcg-review", "steamdeckhq"],
    related: ["/performance/pc", "/system-requirements", "/performance/fps-fix"],
    blocks: [
      {
        type: "briefing",
        items: [
          "EA says Zero Company will not be Steam Deck Verified at launch.",
          "Steam Deck HQ reports roughly 18–22 FPS in its tested combat/hub scenarios at the lowest settings.",
          "PC Gamer reports a 15–20 FPS result with low settings and aggressive FSR in its review context.",
          "These are two device snapshots, not a universal minimum or guaranteed future state.",
        ],
      },
      {
        type: "table",
        heading: "Launch evidence",
        caption: "Attributed native-Deck results checked August 30, 2026.",
        columns: ["Source", "Reported range", "Quality note", "Verdict"],
        rows: [
          ["EA FAQ", "No FPS claim", "Not Verified at launch", "Wait for status change"],
          ["Steam Deck HQ", "About 18–22 FPS", "Lowest settings in tested scenes", "Below a stable 30 target"],
          ["PC Gamer", "About 15–20 FPS", "Low settings and heavy FSR looked unclear", "Not recommended"],
        ],
      },
      {
        type: "cards",
        heading: "Safer options",
        items: [
          { title: "Remote Play / streaming", body: "Run the game on a stronger PC and use the Deck as the client if your network is stable.", tone: "green" },
          { title: "Wait for a patch", body: "Recheck EA's FAQ, Steam compatibility badge and patch notes before buying for Deck-first use.", tone: "amber" },
          { title: "Native experimentation", body: "If you already own it, record Deck model, SteamOS, game build and image quality; avoid treating one preset as universal.", tone: "red" },
        ],
      },
    ],
  }),
  page({
    path: "/mods",
    navLabel: "Mods",
    title: "Star Wars Zero Company Mods and Safe Modding Guide",
    description:
      "Understand Zero Company's unofficial modding status, Nexus and Vortex ecosystem, patch compatibility, backup rules, source safety and clean removal.",
    h1: "Mods and Modding Status",
    kicker: "Unofficial extensions",
    summary: "Community mods exist, but EA does not officially support modding and every installation is patch-sensitive.",
    pageType: "hub",
    evidence: "community",
    platforms: ["PC"],
    sources: ["ea-faq", "pcg-discord-mods", "nexus-vortex", "zerocommand-modding"],
    related: ["/performance/pc", "/performance/fps-fix", "/game-info"],
    blocks: [
      {
        type: "warning",
        heading: "Unofficial means unsupported",
        body: "Bit Reactor and EA say no official mod support is planned. A Vortex extension or Nexus listing does not turn community files into official tools.",
        tone: "red",
      },
      {
        type: "steps",
        heading: "Safe mod evaluation",
        items: [
          { title: "Open the original listing", body: "Use the author's Nexus or other trusted release page; never download a rehosted executable from a guide site." },
          { title: "Match the game patch", body: "Check upload date, current mod version, requirements and comments after every game update." },
          { title: "Back up saves and config", body: "Keep a copy outside the game directory before installing loaders, DLLs or Engine.ini changes." },
          { title: "Install one change at a time", body: "Launch and verify saves before adding another dependency." },
          { title: "Know the removal path", body: "Document every added file. Remove the mod, restore config and verify game files if behavior persists." },
        ],
      },
      {
        type: "table",
        heading: "Current ecosystem",
        caption: "Observed community tooling, not an endorsement of every file it can install.",
        columns: ["Tool / source", "Purpose", "Evidence", "Risk note"],
        rows: [
          ["Nexus Mods game listings", "Original mod pages and author updates", "Community platform", "Review each file and requirements"],
          ["Vortex extension 1.0.0", "Game detection and multiple deployment types", "Nexus-hosted extension", "Manager support is not game support"],
          ["UE4SS / loaders", "Required by some script or Lua mods", "Third-party dependency", "Patch and antivirus sensitivity"],
          ["Engine.ini tweaks", "Configuration changes", "Community experiments", "Back up and test one key at a time"],
        ],
      },
      {
        type: "faq",
        heading: "Mod questions",
        items: [
          { question: "Does Zero Company officially support mods?", answer: "No. EA's FAQ says there is no official mod support planned at this time." },
          { question: "Will verifying files remove mods?", answer: "It can replace modified game files but may leave extra files. Follow the specific mod's removal list and keep your own install record." },
        ],
      },
    ],
  }),
  page({
    path: "/worth-it",
    navLabel: "Worth It?",
    title: "Is Star Wars Zero Company Worth It? Buy, Wait or Skip",
    description:
      "Decide whether Zero Company is worth buying based on its tactics, story, 30–40 hour review context, $49.99 US price, PC performance and Deck limits.",
    h1: "Is Star Wars Zero Company Worth It?",
    kicker: "Purchase decision",
    summary: "Buy for polished squad tactics and a cinematic Clone Wars story; wait if launch performance or Steam Deck is your deciding factor.",
    pageType: "decision",
    evidence: "community",
    sources: ["steam-store", "pcg-review", "techradar-review", "gamesradar-review", "windowscentral-review", "ea-faq", "steam-issue-update"],
    related: ["/game-info", "/system-requirements", "/performance/pc"],
    blocks: [
      {
        type: "facts",
        heading: "Decision snapshot",
        items: [
          { label: "US entry price", value: "$49.99", note: "Steam, checked 2026-08-30" },
          { label: "Steam rating", value: "Mostly Positive", note: "Live label changes; checked 2026-08-30" },
          { label: "Campaign context", value: "About 30–40 hours", note: "Developer Q&A / TechRadar review context" },
          { label: "Multiplayer", value: "None" },
          { label: "Steam Deck", value: "Not Verified at launch" },
          { label: "Mod support", value: "Unofficial community only" },
        ],
      },
      {
        type: "verdict",
        heading: "Who should buy, wait or skip",
        items: [
          {
            label: "Buy now",
            tone: "green",
            bullets: [
              "You want XCOM-style turn-based tactics with Star Wars production values.",
              "You value squad customization, Bonds and campaign consequences.",
              "Your PC meets the real recommended target or you are playing on a supported console.",
            ],
          },
          {
            label: "Wait",
            tone: "amber",
            bullets: [
              "You are sensitive to shader/CPU stutter or use affected PC hardware.",
              "Steam Deck is your primary device.",
              "You want post-launch issue fixes before a long permadeath run.",
            ],
          },
          {
            label: "Skip",
            tone: "red",
            bullets: [
              "You want real-time lightsaber action rather than tactical turns.",
              "You only play multiplayer or co-op games.",
              "Hit-chance uncertainty and permanent campaign consequences frustrate you.",
            ],
          },
        ],
      },
      {
        type: "prose",
        heading: "What the reviews agree on",
        paragraphs: [
          "PC Gamer, TechRadar, GamesRadar and Windows Central broadly praise the tactical combat, customization and cinematic Star Wars story. The strongest disagreement is technical: one review reports mostly stable 60 FPS on mid-to-high-range PC hardware, while another records crashes and a poor Steam Deck result.",
          "That makes the purchase decision unusually hardware-dependent. The game itself has strong critical support; the launch experience is less consistent across devices.",
        ],
      },
      {
        type: "warning",
        heading: "Scores and review counts move",
        body: "This page does not hard-code a Metacritic number because search snapshots conflicted during research. Follow the live Steam and aggregator links before purchasing.",
        tone: "cyan",
      },
      {
        type: "faq",
        heading: "Buying questions",
        items: [
          { question: "Is Deluxe worth the extra $10?", answer: "The listed upgrade is cosmetic. Buy it for the armor and weapon themes, not for additional classes or campaign missions." },
          { question: "Should Steam Deck owners buy now?", answer: "Not for native Deck-first play. EA withholds Verified status and two launch tests report sub-30 FPS behavior." },
        ],
      },
    ],
  }),
];

export const contentPageByPath = new Map(contentPages.map((entry) => [entry.path, entry]));

export const indexableContentPages = contentPages.filter(
  (entry) => entry.indexable && entry.status !== "draft" && entry.status !== "archived",
);

export function getContentPage(path: string): ContentPage | undefined {
  return contentPageByPath.get(path);
}

export function pathFromSegments(segments: string[]): string {
  return `/${segments.join("/")}`;
}
