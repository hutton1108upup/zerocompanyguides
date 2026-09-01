export const popularPaths = [
  "/squad-builder",
  "/builds/hawks",
  "/classes/tier-list",
  "/builds/best-team",
  "/performance/fps-fix",
  "/walkthrough",
] as const;

export const homeFacts = [
  { label: "Release date", value: "Aug 27, 2026", href: "/game-info" },
  { label: "Platforms", value: "PC · PS5 · Xbox", href: "/game-info" },
  { label: "Mode", value: "Single-player", href: "/multiplayer" },
  { label: "Standard classes", value: "8", href: "/classes" },
  { label: "Steam achievements", value: "53", href: "/trophy-guide" },
  { label: "Deck status", value: "Not Verified", href: "/performance/steam-deck" },
] as const;

export const homeSections = [
  {
    title: "Builds",
    kicker: "Operator loadouts",
    description: "Plan four legal bays, inspect role and resource gaps, then open the evidence behind each recommendation.",
    links: ["/squad-builder", "/builds", "/builds/hawks", "/builds/best-team"],
  },
  {
    title: "Classes",
    kicker: "Eight standards",
    description: "Use official role definitions first and editorial tiers second.",
    links: ["/classes", "/classes/tier-list", "/guides/respec"],
  },
  {
    title: "Field Guides",
    kicker: "Learn the loop",
    description: "Master AP, Advantage, cover, injuries and the Den before chasing damage.",
    links: ["/guides", "/guides/beginners-guide", "/walkthrough"],
  },
  {
    title: "Company Dossiers",
    kicker: "Authored operators",
    description: "Meet the squad, understand unique roles and verify the announced cast.",
    links: ["/characters", "/characters/voice-cast"],
  },
  {
    title: "Performance",
    kicker: "Launch diagnostics",
    description: "Separate official issue guidance from hardware-specific community fixes.",
    links: ["/performance", "/performance/pc", "/performance/fps-fix"],
  },
  {
    title: "Before You Buy",
    kicker: "Official facts",
    description: "Check price, platforms, requirements, multiplayer and Deck limits.",
    links: ["/game-info", "/system-requirements", "/worth-it"],
  },
] as const;
