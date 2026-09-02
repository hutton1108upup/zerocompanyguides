import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";

describe("post-launch Hawks build refresh", () => {
  const page = contentPages.find((entry) => entry.path === "/builds/hawks");

  it("targets the Hawks build query with current metadata", () => {
    expect(page).toMatchObject({
      title: "Star Wars Zero Company Hawks Build: Best Class Combos",
      description:
        "Compare Medic/Scoundrel, Scout/Medic and Gunslinger/Medic Hawks builds by difficulty, weapon, squad role and respec timing.",
      h1: "Star Wars Zero Company Best Hawks Builds for Support, Advantage and Damage",
      evidence: "community",
      verification: "source-verified-synthesis",
      indexable: true,
      lastVerified: "2026-09-02",
    });
  });

  it("compares three complete two-specialization routes", () => {
    expect(page).toBeDefined();
    if (!page) return;

    const matrix = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Best Hawks build at a glance",
    );
    expect(matrix?.type).toBe("table");
    if (matrix?.type === "table") {
      expect(matrix.rows.map((row) => row[0])).toEqual([
        "Medic → Scoundrel",
        "Scout → Medic",
        "Gunslinger → Medic",
      ]);
      expect(matrix.rows.flat().join(" ")).toContain("difficulty");
    }

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Medic to Scoundrel: support and Bond route",
        "Scout to Medic: Advantage and safety",
        "Gunslinger to Medic: damage with a fallback",
        "When to respec Hawks",
        "Hawks build by difficulty",
      ]),
    );
  });

  it("connects the build to planning tools and current evidence", () => {
    expect(page).toBeDefined();
    if (!page) return;

    const cards = page.blocks.find(
      (block) => block.type === "cards" && block.heading === "Test the complete squad",
    );
    expect(cards?.type).toBe("cards");
    if (cards?.type === "cards") {
      expect(cards.items.map((item) => item.href)).toEqual([
        "/squad-builder",
        "/weapons",
        "/guides/respec",
      ]);
    }

    expect(resolveSources(page.sources).map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "ea-class-guide",
        "pcg-best-class",
        "pcg-respec",
        "reddit-expert-builds",
        "reddit-hawks-launch",
        "allthings-hawks-build",
      ]),
    );
  });
});
