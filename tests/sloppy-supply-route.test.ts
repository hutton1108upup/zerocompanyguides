import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";
import {
  buildCanonicalUrl,
  footerNavigationSections,
  getInnerRouteParams,
  getMetadataForPath,
  getSearchPages,
  navigationGroups,
  primaryNavigationPaths,
} from "../src/lib/site";

const path = "/walkthrough/sloppy-supply-route";

describe("Sloppy Supply Route evidence gate", () => {
  it("publishes Sloppy Supply Route as an indexed Operation decision guide", async () => {
    const page = contentPages.find((entry) => entry.path === path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const navigationPaths = [
      ...primaryNavigationPaths,
      ...navigationGroups.flatMap((section) => section.links.map((link) => link.href)),
      ...footerNavigationSections.flatMap((section) => section.paths),
    ];

    expect(page).toMatchObject({
      navLabel: "Sloppy Supply Route",
      title: "Star Wars Zero Company Sloppy Supply Route: Analyze, Pay Off or Raid?",
      description:
        "Compare the Sloppy Supply Route Operation choices in Star Wars Zero Company: Analyze, Pay Off or Direct Raid—Intel cost, non-droid Operator rules, injury risks and Weapon Mod rewards.",
      h1: "Star Wars Zero Company Sloppy Supply Route: Analyze, Pay Off or Direct Raid?",
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
    });
    expect(staticPaths).toContain(path);
    expect(requiredPublicPaths).toContain(path);
    expect(getSearchPages().map((entry) => entry.path)).toContain(path);
    expect(sitemapUrls).toContain(buildCanonicalUrl(path));
    expect(navigationPaths).toContain(path);
    expect(getMetadataForPath(path)?.robots).toBe("index, follow");
    expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));
  });

  it("labels the entity as an Operation and preserves unresolved reward boundaries", () => {
    const page = contentPages.find((entry) => entry.path === path);
    expect(page).toBeDefined();
    if (!page) return;

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "First-hand Operation capture still required",
        "Sloppy Supply Route at a glance",
        "Analyze, Pay Off or Direct Raid?",
        "What the extracted record does and does not prove",
        "Sloppy Supply Route questions",
      ]),
    );

    const choices = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Analyze, Pay Off or Direct Raid?",
    );
    expect(choices?.type).toBe("table");
    if (choices?.type === "table") {
      expect(choices.rows.map((row) => row[0])).toEqual([
        "Analyze the supply ships",
        "Pay off Geonosian workers",
        "Direct raid",
      ]);
      expect(choices.rows[1].join(" ")).toContain("Low injury risk");
      expect(choices.rows[2].join(" ")).toContain("High injury risk");
      expect(choices.rows.flat().join(" ")).toContain("random Weapon Mod");
    }

    const atAGlance = page.blocks.find(
      (block) => block.type === "facts" && block.heading === "Sloppy Supply Route at a glance",
    );
    expect(atAGlance?.type).toBe("facts");
    if (atAGlance?.type === "facts") {
      expect(atAGlance.items.map((item) => `${item.label} ${item.value}`).join(" ")).toContain("100 Intel");
      expect(atAGlance.items.map((item) => `${item.label} ${item.value}`).join(" ")).toContain("3 turns");
      expect(atAGlance.items.map((item) => `${item.label} ${item.value}`).join(" ")).toContain("+3 Influence");
    }

    const sourceIds = resolveSources(page.sources).map((source) => source.id);
    expect(sourceIds).toEqual(
      expect.arrayContaining(["ea-faq", "zerocompany-tools-sloppy-supply-route"]),
    );
  });
});
