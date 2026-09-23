export const quickAnswers = [
  { path: "/walkthrough", href: "/walkthrough#protection-application-credits-or-team-bond", title: "Protection Application", summary: "Compare the Credit payout with team Bond changes before choosing a response." },
  { path: "/walkthrough/help-wanted", href: "/walkthrough/help-wanted", title: "Help Wanted", summary: "Match one of six opening scenes to its choices, costs and risks." },
  { path: "/walkthrough/back-channels", href: "/walkthrough/back-channels", title: "Back Channels", summary: "Compare Runa and Neesh, their rewards and the next mission each unlocks." },
  { path: "/performance/fps-fix", href: "/performance/fps-fix", title: "FPS & Crash Fixes", summary: "Start with official patch guidance, then narrow down your hardware and symptom." },
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
    title: "Walkthrough",
    kicker: "Missions and choices",
    description: "Find a named Operation, compare outcomes and follow the campaign route.",
    links: ["/walkthrough", "/walkthrough/help-wanted", "/walkthrough/back-channels", "/walkthrough/ship-adrift"],
  },
  {
    title: "Builds & Gear",
    kicker: "Plan the squad",
    description: "Connect Operator builds with classes, weapons and available companions.",
    links: ["/builds", "/squad-builder", "/classes/tier-list", "/weapons", "/characters/companions"],
  },
  {
    title: "Guides",
    kicker: "Learn and progress",
    description: "Start a campaign, change Specialization, manage injuries and plan achievements.",
    links: ["/guides", "/guides/beginners-guide", "/guides/respec", "/guides/permadeath", "/trophy-guide"],
  },
  {
    title: "Fixes",
    kicker: "Settings and troubleshooting",
    description: "Find help for PC performance, crashes, Steam Deck and unofficial mods.",
    links: ["/performance", "/performance/fps-fix", "/performance/pc", "/performance/steam-deck", "/mods"],
  },
  {
    title: "Game Info",
    kicker: "Before you buy",
    description: "Check platforms, requirements, single-player support and buying considerations.",
    links: ["/game-info", "/system-requirements", "/multiplayer", "/worth-it"],
  },
] as const;
