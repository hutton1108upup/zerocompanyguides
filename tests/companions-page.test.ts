import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";
import {
  footerNavigationSections,
  getBreadcrumbPages,
  getMetadataForPath,
  moreNavigationSections,
  primaryNavigationPaths,
} from "../src/lib/site";

const companionsPath = "/characters/companions";

describe("companions child page", () => {
  it("publishes a distinct, indexable companions intent under Characters", () => {
    const companions = contentPages.find((page) => page.path === companionsPath);
    const metadata = getMetadataForPath(companionsPath);

    expect(companions).toMatchObject({
      navLabel: "Companions",
      title: "Star Wars Zero Company Companions: All Operators & Bonds",
      description:
        "Meet all six Star Wars Zero Company companions, learn when they join, what each unique talent does, how Bonds work, and when to rotate Custom Operators.",
      h1: "Star Wars Zero Company: All Companions & Story Operators",
      pageType: "article",
      evidence: "community",
      verification: "source-verified-synthesis",
      indexable: true,
    });
    expect(metadata?.alternates?.canonical).toBe(
      "https://zerocompany-guides.wiki/characters/companions",
    );
    expect(metadata?.robots).toBe("index, follow");
    expect(getBreadcrumbPages(companions!).map((page) => page.path)).toEqual([
      "/",
      "/characters",
      companionsPath,
    ]);
    expect(contentPages.some((page) => page.path === "/companions")).toBe(false);
  });

  it("answers best-companion, unlock and Bond-strategy searches on one canonical", () => {
    const companions = contentPages.find((page) => page.path === companionsPath);
    const decisionTable = companions?.blocks.find(
      (block) => block.type === "table" && block.heading === "All six story companions at a glance",
    );
    const unlockTable = companions?.blocks.find(
      (block) => block.type === "table" && block.heading === "How to unlock every companion",
    );
    const bondTable = companions?.blocks.find(
      (block) => block.type === "table" && block.heading === "Best Bond strategy: core team or roster rotation?",
    );
    const headings = companions?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);

    expect(decisionTable?.type).toBe("table");
    if (decisionTable?.type === "table") {
      expect(decisionTable.columns).toEqual([
        "Companion",
        "Joins",
        "Unique edge",
        "Best fit",
        "Evidence",
      ]);
      expect(decisionTable.rows.map((row) => row[0])).toEqual([
        "Trick (CT-3301)",
        "Kabb Uppercut",
        "Jae Mordant",
        "Tel-Rea Vokoss",
        "Cly Kullervo",
        "Luco Bronc",
      ]);
    }

    expect(headings).toEqual(
      expect.arrayContaining([
        "Best companions by squad job",
        "How to unlock every companion",
        "Authored vs Custom Operators",
        "Best Bond strategy: core team or roster rotation?",
        "How Bonds and Cross Training change squad planning",
        "Injuries, Permadeath and reserve Operators",
        "Companion questions",
      ]),
    );

    expect(unlockTable?.type).toBe("table");
    if (unlockTable?.type === "table") {
      expect(unlockTable.rows.map((row) => row[0])).toEqual([
        "Trick (CT-3301)",
        "Kabb Uppercut",
        "Jae Mordant",
        "Tel-Rea Vokoss",
        "Cly Kullervo",
        "Luco Bronc",
      ]);
      expect(unlockTable.columns).toEqual([
        "Companion",
        "Unlock window",
        "What to do",
        "Evidence boundary",
      ]);
    }

    expect(bondTable?.type).toBe("table");
    if (bondTable?.type === "table") {
      expect(bondTable.rows.map((row) => row[0])).toEqual([
        "Core team",
        "Wide rotation",
        "Hybrid rotation",
      ]);
      expect(bondTable.rows[2].join(" ")).toContain("Recommended starting point");
      expect(bondTable.rows.flat().join(" ")).toContain("community");
    }

    const briefing = companions?.blocks.find((block) => block.type === "briefing");
    expect(briefing?.type).toBe("briefing");
    if (briefing?.type === "briefing") {
      expect(briefing.items.join(" ")).toContain("no universal best companion");
      expect(briefing.items.join(" ")).toContain("launch-build synthesis");
    }
  });

  it("uses official facts plus labeled press and community observations", () => {
    const companions = contentPages.find((page) => page.path === companionsPath);

    expect(companions).toBeDefined();
    if (!companions) return;

    const sources = resolveSources(companions.sources);
    const sourceKinds = new Set(sources.map((source) => source.kind));

    expect(sourceKinds.size).toBe(3);
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
    expect(sources.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "ea-gameplay-overview",
        "steam-dev-faq",
        "epic-operators",
        "reddit-bond-strategies",
      ]),
    );
  });

  it("links the child page without turning it into another primary navigation item", () => {
    const characters = contentPages.find((page) => page.path === "/characters");
    const characterLinks = characters?.blocks
      .filter((block) => block.type === "cards")
      .flatMap((block) => block.items.map((item) => item.href));
    const morePaths = moreNavigationSections.flatMap((section) => section.paths);
    const footerPaths = footerNavigationSections.flatMap((section) => section.paths);

    expect(characters?.title).toBe(
      "Star Wars Zero Company Characters, Story Roles and Den Staff",
    );
    expect(characters?.h1).toBe("Star Wars Zero Company Characters & Story Roles");
    expect(characterLinks).toContain(companionsPath);
    expect(primaryNavigationPaths).not.toContain(companionsPath);
    expect(morePaths).toContain(companionsPath);
    expect(footerPaths).toContain(companionsPath);
  });
});
