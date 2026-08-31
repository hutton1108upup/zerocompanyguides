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
      (block) => block.type === "table" && block.heading === "Weapon × Specialization × squad job",
    );
    expect(roleMatrix?.type).toBe("table");
    if (roleMatrix?.type === "table") expect(roleMatrix.rows).toHaveLength(8);

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

    const sourceKinds = new Set(resolveSources(weapons?.sources ?? []).map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
  });

  it("keeps companions on the characters canonical with roster and consequence guidance", () => {
    const characters = contentPages.find((page) => page.path === "/characters");

    expect(characters?.title.toLowerCase()).toContain("companions");
    expect(characters?.h1.toLowerCase()).toContain("companions");
    expect(contentPages.some((page) => page.path === "/companions")).toBe(false);
    const headings = characters?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Story Operators, Custom Operators and Den staff",
        "Recruitment timing and missable content",
        "Bonds, crewmate missions and permadeath",
      ]),
    );

    const companionTable = characters?.blocks.find(
      (block) => block.type === "table" && block.heading === "Six story companions at a glance",
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
        .find((item) => item.href === "/characters");

      expect(companionLink?.label).toContain("Companions");
    }

    const sourceKinds = new Set(resolveSources(characters?.sources ?? []).map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
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
});
