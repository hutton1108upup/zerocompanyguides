import { describe, expect, it } from "vitest";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";

describe("content enrichment routes", () => {
  it("publishes a sourced weapons hub with official values and evidence boundaries", () => {
    const weapons = contentPages.find((page) => page.path === "/weapons");

    expect(requiredPublicPaths).toContain("/weapons");
    expect(weapons).toBeDefined();
    expect(weapons?.indexable).toBe(true);
    expect(weapons?.status).toBe("verified");
    expect(weapons?.title.toLowerCase()).toContain("weapon mods");
    expect(weapons?.h1.toLowerCase()).toContain("weapon mods");
    expect(contentPages.some((page) => page.path.startsWith("/weapons/"))).toBe(false);

    const weaponTable = weapons?.blocks.find(
      (block) => block.type === "table" && block.heading === "Four core weapon classes",
    );
    expect(weaponTable?.type).toBe("table");
    if (weaponTable?.type === "table") {
      expect(weaponTable.rows).toEqual([
        ["Blaster Pistol", "6", "+4", "5%", "Short", "1 AP per shot; repeat while AP remains", "Official EA Help"],
        ["Blaster Rifle", "10", "+6", "5%", "Medium", "First shot 1 AP; another shot that turn costs 2 AP", "Official EA Help"],
        ["Repeater", "8", "+4", "5%", "Medium", "Rapid Fire scales with AP committed; launch guides observe it spending the remaining pool", "Official scaling + launch observation"],
        ["Longarm Blaster", "12", "+12", "5%", "Long", "2 AP per shot; normally leaves 1 AP from a standard three-AP turn", "Official EA Help"],
      ]);
    }

    const roleMatrix = weapons?.blocks.find(
      (block) => block.type === "table" && block.heading === "Best weapon for every Specialization",
    );
    expect(roleMatrix?.type).toBe("table");
    if (roleMatrix?.type === "table") expect(roleMatrix.rows).toHaveLength(8);

    const classComparison = weapons?.blocks.find(
      (block) => block.type === "table" && block.heading === "Rifle vs Pistol vs Longarm vs Repeater",
    );
    expect(classComparison?.type).toBe("table");
    if (classComparison?.type === "table") {
      expect(classComparison.columns).toEqual([
        "Desired turn",
        "Start with",
        "Why it fits",
        "Main trade-off",
        "When it stops fitting",
      ]);
      expect(classComparison.rows.slice(0, 4).map((row) => row[1])).toEqual([
        "Blaster Pistol",
        "Blaster Rifle",
        "Repeater",
        "Longarm Blaster",
      ]);
    }

    const bestChanges = weapons?.blocks.find(
      (block) => block.type === "prose" && block.heading === "When the answer changes",
    );
    expect(bestChanges?.type).toBe("prose");
    if (bestChanges?.type === "prose") {
      const guidance = [...(bestChanges.paragraphs ?? []), ...(bestChanges.bullets ?? [])].join(" ");
      expect(guidance).toContain("map");
      expect(guidance).toContain("Specialization");
      expect(guidance).toContain("AP");
      expect(guidance).toContain("Mods");
      expect(guidance).toContain("difficulty");
      expect(guidance).toContain("editorial");
    }

    const evidenceTable = weapons?.blocks.find(
      (block) => block.type === "table" && block.heading === "Official values versus launch observations",
    );
    expect(evidenceTable?.type).toBe("table");
    if (evidenceTable?.type === "table") {
      expect(evidenceTable.rows).toEqual([
        ["Base Critical Chance", "5% for all four core classes", "An August 26 creator table shows 11%", "Use 5%; show the dated disagreement"],
        ["Repeater AP behavior", "More AP produces more Rapid Fire Damage", "GamesRadar and current players describe a Final Action that consumes remaining AP", "Label the full-pool behavior as launch-observed"],
        ["Best weapon", "Choose by playstyle and Specialization", "Players disagree sharply on Pistol, Rifle and Repeater value", "Publish a decision matrix, not one winner"],
        ["Current site testing", "Not applicable", "External launch observations only", "No first-hand-tested badge until this site reproduces the result"],
      ]);
    }

    const restrictions = weapons?.blocks.find(
      (block) => block.type === "table" && block.heading === "Special equipment and Operator limits",
    );
    expect(restrictions?.type).toBe("table");
    if (restrictions?.type === "table") {
      expect(restrictions.rows).toEqual(
        expect.arrayContaining([
          ["Tel-Rea Vokoss", "Uses unique Jedi equipment rather than the standard four-blaster comparison", "Official identity; equipment restriction observed by launch media", "Do not force the core weapon matrix onto her"],
          ["Astromech Custom Operators", "Support units rely on Utilities and do not follow a conventional primary-blaster loadout", "Droid Bay official; no-standard-weapon behavior observed by launch media", "Plan Utility capacity and role, not a blaster tier"],
        ]),
      );
    }

    const faq = weapons?.blocks.find(
      (block) => block.type === "faq" && block.heading === "Weapon questions",
    );
    expect(faq?.type).toBe("faq");
    if (faq?.type === "faq") {
      const questions = faq.items.map((item) => item.question);
      expect(questions).toContain("Can every Operator use every weapon class?");
      expect(questions).toContain("Can I change weapons between deployments?");
      expect(questions).not.toContain("Should I create a page for each weapon now?");
    }

    const sourceKinds = new Set(resolveSources(weapons?.sources ?? []).map((source) => source.kind));
    const sourceIds = resolveSources(weapons?.sources ?? []).map((source) => source.id);
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
    expect(sourceIds).toEqual(
      expect.arrayContaining(["reddit-weapons-specializations", "reddit-repeater-debate"]),
    );
  });

  it("keeps character identity on the hub and companion decisions on its child page", () => {
    const characters = contentPages.find((page) => page.path === "/characters");
    const companions = contentPages.find((page) => page.path === "/characters/companions");

    expect(characters?.title.toLowerCase()).not.toContain("companions");
    expect(characters?.h1.toLowerCase()).not.toContain("companions");
    expect(contentPages.some((page) => page.path === "/companions")).toBe(false);
    const headings = characters?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Story Operators, Custom Operators and Den staff",
        "Character identity, cast and tactical handoffs",
      ]),
    );

    const companionTable = companions?.blocks.find(
      (block) => block.type === "table" && block.heading === "All six story companions at a glance",
    );
    expect(companionTable?.type).toBe("table");
    if (companionTable?.type === "table") {
      expect(companionTable.rows.map((row) => row[0])).toEqual([
        "Trick (CT-3301)",
        "Kabb Uppercut",
        "Jae Mordant",
        "Tel-Rea Vokoss",
        "Cly Kullervo",
        "Luco Bronc",
      ]);
    }

    for (const path of ["/builds/best-team", "/guides/beginners-guide", "/walkthrough"]) {
      const page = contentPages.find((entry) => entry.path === path);
      const companionLink = page?.blocks
        .filter((block) => block.type === "cards")
        .flatMap((block) => block.items)
        .find((item) => item.href === "/characters/companions");

      expect(companionLink?.label).toContain("Companions");
    }

    const sourceKinds = new Set(resolveSources(companions?.sources ?? []).map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
  });

  it("separates confirmed Bonds and Cross Training rules from The Lounge unknowns", () => {
    const companions = contentPages.find((page) => page.path === "/characters/companions");
    const relationshipTable = companions?.blocks.find(
      (block) => block.type === "table" && block.heading === "Bonds, Cross Training and The Lounge",
    );

    expect(relationshipTable?.type).toBe("table");
    if (relationshipTable?.type === "table") {
      expect(relationshipTable.rows.map((row) => row[0])).toEqual([
        "Bonds",
        "Cross Training",
        "The Lounge",
      ]);
      expect(relationshipTable.rows[0].at(-1)).toContain("Official");
      expect(relationshipTable.rows[1].join(" ")).toContain("permanent combat stat bonus");
      expect(relationshipTable.rows[1].join(" ")).toContain("Bond level");
      expect(relationshipTable.rows[2].join(" ")).toContain("No official");
      expect(relationshipTable.rows[2].at(-1)).toContain("Unverified");
    }

    expect(contentPages.some((page) => page.path === "/guides/bonds")).toBe(false);
    expect(contentPages.some((page) => page.path === "/systems/the-lounge")).toBe(false);
  });

  it("adds ten beginner tips, a five-cycle plan and verified mission-state checks", () => {
    const beginner = contentPages.find((page) => page.path === "/guides/beginners-guide");
    const tips = beginner?.blocks.find(
      (block) => block.type === "steps" && block.heading === "10 things we wish we knew before the first mission",
    );
    expect(tips?.type).toBe("steps");
    if (tips?.type === "steps") expect(tips.items).toHaveLength(10);

    const cyclePlan = beginner?.blocks.find(
      (block) => block.type === "table" && block.heading === "Cycles 1–5 priority plan",
    );
    expect(cyclePlan?.type).toBe("table");
    if (cyclePlan?.type === "table") {
      expect(cyclePlan.rows.map((row) => row[0])).toEqual([
        "Cycle 1",
        "Cycle 2",
        "Cycle 3",
        "Cycle 4",
        "Cycle 5",
      ]);
    }

    const mechanicRules = beginner?.blocks.find(
      (block) => block.type === "table" && block.heading === "Backup, Overwatch and Advantage: verified rules",
    );
    expect(mechanicRules?.type).toBe("table");
    if (mechanicRules?.type === "table") {
      expect(mechanicRules.rows).toEqual([
        ["Call for Backup", "Saving it because it must cost AP", "It is a free action, available once per turn for the selected Operator's next attack", "Use it on a priority target when the assisting Operator can contribute"],
        ["Overwatch", "Setting it before moving or using the remaining kit", "It immediately ends that Operator's turn", "Prepare position and lane first; use Overwatch as the final commitment"],
        ["Advantage", "Hoarding it after reaching the cap", "Damage earns Advantage, the squad stores up to ten, and special actions spend it without AP", "Spend before new hits would be wasted, or reserve it for a harder encounter"],
        ["Rally", "Assuming the revived Operator is consequence-free", "Rally restores actions, but the down causes an Injury", "Protect the rallied Operator and budget Medbay time after extraction"],
      ]);
    }

    const campaignChecks = beginner?.blocks.find(
      (block) => block.type === "table" && block.heading === "Injury, extraction and expiry checklist",
    );
    expect(campaignChecks?.type).toBe("table");
    if (campaignChecks?.type === "table") {
      expect(campaignChecks.rows).toEqual(
        expect.arrayContaining([
          ["Injuries", "Is anyone one Injury away from permanent loss?", "Use a replacement, heal first or reduce exposure; do not treat Rally as a reset"],
          ["Extraction", "Who still needs movement AP after the objective is complete?", "Avoid a weapon or action sequence that consumes the exit turn"],
          ["Expiring content", "Which Operation or Mission disappears after this Cycle?", "Complete the higher-consequence item before launching"],
        ]),
      );
    }

    const sourceKinds = new Set(resolveSources(beginner?.sources ?? []).map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
  });

  it("adds a sourced Credits, Intel and Zone Influence decision table to the beginner guide", () => {
    const beginner = contentPages.find((page) => page.path === "/guides/beginners-guide");
    const resourceTable = beginner?.blocks.find(
      (block) => block.type === "table" && block.heading === "Credits, Intel and Zone Influence decisions",
    );

    expect(resourceTable?.type).toBe("table");
    if (resourceTable?.type === "table") {
      expect(resourceTable.rows.map((row) => row[0])).toEqual([
        "Credits",
        "Intel",
        "Zone Influence",
      ]);
      expect(resourceTable.rows[0].join(" ")).toContain("Facilities");
      expect(resourceTable.rows[1].join(" ")).toContain("Operations");
      expect(resourceTable.rows[2].join(" ")).toContain("Zone Rewards");
      expect(resourceTable.rows.every((row) => row.at(-1)?.includes("Official EA"))).toBe(true);
    }

    expect(contentPages.some((page) => page.path === "/guides/credits")).toBe(false);
    expect(contentPages.some((page) => page.path === "/guides/zone-influence")).toBe(false);
  });

  it("keeps interface, evacuation and Bacta guidance short and evidence-bounded", () => {
    const beginner = contentPages.find((page) => page.path === "/guides/beginners-guide");
    const performance = contentPages.find((page) => page.path === "/performance/pc");
    const permadeath = contentPages.find((page) => page.path === "/guides/permadeath");
    const shortNotes = beginner?.blocks.find(
      (block) => block.type === "cards" && block.heading === "Optional interface and recovery notes",
    );

    expect(shortNotes?.type).toBe("cards");
    if (shortNotes?.type === "cards") {
      expect(shortNotes.items.map((item) => item.title)).toEqual([
        "Linear ability selection",
        "Plan the extraction turn",
        "Use the Bacta Tank deliberately",
      ]);
      expect(shortNotes.items[0].body).toContain("Ability Selection Style");
      expect(shortNotes.items[0].body.toLowerCase()).toContain("preference");
      expect(shortNotes.items.map((item) => item.body).join(" ").toLowerCase()).not.toContain("best setting");
    }

    const performanceBoundary = performance?.blocks.find(
      (block) => block.type === "warning" && block.heading === "Linear ability selection is not a performance preset",
    );
    expect(performanceBoundary?.type).toBe("warning");
    if (performanceBoundary?.type === "warning") {
      expect(performanceBoundary.body).toContain("no FPS");
    }

    const recoveryBoundary = permadeath?.blocks.find(
      (block) => block.type === "warning" && block.heading === "Evacuation and Bacta are safeguards, not guarantees",
    );
    expect(recoveryBoundary?.type).toBe("warning");
    if (recoveryBoundary?.type === "warning") {
      expect(recoveryBoundary.body).toContain("live objective");
      expect(recoveryBoundary.body).toContain("Credits");
    }

    for (const page of [beginner, performance]) {
      expect(page?.sources).toContain("pcg-linear-abilities");
      expect(resolveSources(page?.sources ?? []).find((source) => source.id === "pcg-linear-abilities")?.kind).toBe("press");
    }
  });

  it("turns the walkthrough into a campaign router without inventing unverified mission steps", () => {
    const walkthrough = contentPages.find((page) => page.path === "/walkthrough");
    const earlyChecks = walkthrough?.blocks.find(
      (block) => block.type === "table" && block.heading === "Chapter 3–4 deployment checks",
    );

    expect(earlyChecks?.type).toBe("table");
    if (earlyChecks?.type === "table") {
      expect(earlyChecks.rows.map((row) => row[0])).toEqual([
        "In Debt to the Hutts",
        "Republic Intelligence",
      ]);
      expect(earlyChecks.rows[0].join(" ")).toContain("Credits");
      expect(earlyChecks.rows[0].join(" ")).toContain("expiring Operations");
      expect(earlyChecks.rows[1].join(" ")).toContain("Intel");
      expect(earlyChecks.rows[1].join(" ")).toContain("Zone Influence");
      expect(earlyChecks.rows.every((row) => row.at(-1)?.includes("planning only"))).toBe(true);
    }

    const contentTypes = walkthrough?.blocks.find(
      (block) => block.type === "table" && block.heading === "Chapter, Operation or Tactical Mission?",
    );
    expect(contentTypes?.type).toBe("table");
    if (contentTypes?.type === "table") {
      expect(contentTypes.rows.map((row) => row[0])).toEqual([
        "Chapter",
        "Critical Operation",
        "Operation",
        "Tactical Mission",
      ]);
      expect(contentTypes.rows.find((row) => row[0] === "Tactical Mission")?.join(" ")).toContain("ends the Cycle");
      expect(contentTypes.rows.find((row) => row[0] === "Operation")?.join(" ")).toContain("can expire");
    }

    const routes = walkthrough?.blocks.find(
      (block) => block.type === "cards" && block.heading === "Walkthrough routes and campaign decisions",
    );
    expect(routes?.type).toBe("cards");
    if (routes?.type === "cards") {
      expect(routes.items.map((item) => item.href)).toEqual([
        "/walkthrough/nebulous-pursuit",
        "/walkthrough/ship-adrift",
        "/walkthrough/in-debt-to-the-hutts",
        "/walkthrough/back-channels",
        "/walkthrough/sloppy-supply-route",
        "/guides/beginners-guide",
      ]);
    }

    expect(walkthrough?.description).toBe(
      "Follow the Critical route, understand Operations versus Tactical Missions, compare important choices and open spoiler-labeled mission walkthroughs.",
    );
    expect(walkthrough?.lastVerified).toBe("2026-09-02");
  });
});
