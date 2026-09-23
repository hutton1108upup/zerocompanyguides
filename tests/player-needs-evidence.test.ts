import { describe, expect, it } from "vitest";
import { getContentPage } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";
import { getPublicNavigationGroups, indexableContentPages } from "../src/lib/site";

describe("player-needs publication boundaries", () => {
  it("keeps the un-replayed boss guide reviewable but outside discovery indexes", () => {
    const path = "/walkthrough/retake-mordant-citadel";
    const page = getContentPage(path);
    expect(page).toMatchObject({ indexable: false, verification: "needs-retest", spoiler: "major" });
    expect(page?.blocks.length).toBeGreaterThan(4);
    expect(indexableContentPages.map((entry) => entry.path)).not.toContain(path);
    expect(getPublicNavigationGroups().flatMap((group) => group.links.map((link) => link.href))).not.toContain(path);
  });

  it("resolves every citation in the new guides and marks the mission example as a spoiler", () => {
    for (const path of ["/guides/reinforcements-and-extraction", "/guides/credits-and-den-upgrades", "/walkthrough/retake-mordant-citadel"]) {
      const page = getContentPage(path)!;
      expect(resolveSources(page.sources).map((source) => source.id).sort()).toEqual([...page.sources].sort());
    }
    expect(getContentPage("/guides/reinforcements-and-extraction")?.spoiler).toBe("minor");
  });
});
