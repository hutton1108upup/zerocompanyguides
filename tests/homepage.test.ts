import { describe, expect, it } from "vitest";
import { homeFacts, homeSections, popularPaths } from "../src/lib/home-data";
import { contentPageByPath } from "../src/content/pages";

describe("homepage data", () => {
  it("exposes six current popular destinations", () => {
    expect(popularPaths).toHaveLength(6);
    for (const path of popularPaths) {
      expect(contentPageByPath.has(path), path).toBe(true);
    }
  });

  it("provides official quick facts without mutable review counts", () => {
    expect(homeFacts).toHaveLength(6);
    expect(homeFacts.map((fact) => fact.label)).toContain("Release date");
    expect(homeFacts.map((fact) => fact.label)).toContain("Platforms");
    expect(homeFacts.map((fact) => `${fact.label} ${fact.value}`).join(" ")).not.toMatch(/reviews|players/i);
  });

  it("routes users through all core content clusters", () => {
    expect(homeSections).toHaveLength(6);
    for (const section of homeSections) {
      expect(section.links.length).toBeGreaterThanOrEqual(2);
      for (const link of section.links) expect(contentPageByPath.has(link)).toBe(true);
    }
  });
});
