import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";

describe("post-launch class tier-list refresh", () => {
  const page = contentPages.find((entry) => entry.path === "/classes/tier-list");

  it("answers the tier-list query with fresh, bounded metadata", () => {
    expect(page).toMatchObject({
      title: "Star Wars Zero Company Class Tier List by Squad Role",
      description:
        "Compare all eight Zero Company Specializations by squad role, difficulty and current post-launch rankings, including why major tier lists disagree.",
      h1: "Star Wars Zero Company Class Tier List by Squad Role",
      evidence: "community",
      verification: "source-verified-synthesis",
      indexable: true,
      lastVerified: "2026-09-02",
    });
  });

  it("covers every specialization and explains ranking disagreement", () => {
    expect(page).toBeDefined();
    if (!page) return;

    const snapshot = page.blocks.find(
      (block) => block.type === "table" && block.heading === "September 2026 tier snapshot",
    );
    expect(snapshot?.type).toBe("table");
    if (snapshot?.type === "table") {
      const text = snapshot.rows.flat().join(" ");
      for (const name of [
        "Assault",
        "Gunslinger",
        "Heavy",
        "Medic",
        "Scoundrel",
        "Scout",
        "Sharpshooter",
        "Soldier",
      ]) {
        expect(text).toContain(name);
      }
    }

    const comparison = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Why current tier lists disagree",
    );
    expect(comparison?.type).toBe("table");
    if (comparison?.type === "table") {
      const text = comparison.rows.flat().join(" ");
      expect(text).toContain("PC Gamer");
      expect(text).toContain("Mobalytics");
      expect(text).toContain("Destructoid");
      expect(text).toContain("Expert player report");
    }

    expect(
      page.blocks.some(
        (block) => block.type === "table" && block.heading === "What moves a class between tiers",
      ),
    ).toBe(true);
  });

  it("cites current official, editorial and player evidence", () => {
    expect(page).toBeDefined();
    if (!page) return;
    expect(resolveSources(page.sources).map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "ea-class-guide",
        "pcg-best-class",
        "mobalytics-tier",
        "destructoid-tier",
        "reddit-expert-builds",
      ]),
    );
  });
});
