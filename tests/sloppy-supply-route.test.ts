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
  moreNavigationSections,
  primaryNavigationPaths,
} from "../src/lib/site";

const path = "/walkthrough/sloppy-supply-route";

describe("Sloppy Supply Route evidence gate", () => {
  it("builds a direct review route without publishing single-source outcomes", async () => {
    const page = contentPages.find((entry) => entry.path === path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const navigationPaths = [
      ...primaryNavigationPaths,
      ...moreNavigationSections.flatMap((section) => section.paths),
      ...footerNavigationSections.flatMap((section) => section.paths),
    ];

    expect(page).toMatchObject({
      navLabel: "Sloppy Supply Route",
      title: "Star Wars Zero Company Sloppy Supply Route Guide",
      description:
        "Review the Sloppy Supply Route Operation, its 100-Intel cost, three-turn deadline, Analyze, Pay Off and Direct Raid options, risks and reported rewards.",
      h1: "Star Wars Zero Company Sloppy Supply Route Operation Guide",
      status: "needs-retest",
      verification: "needs-retest",
      evidence: "community",
      indexable: false,
    });
    expect(staticPaths).toContain(path);
    expect(requiredPublicPaths).not.toContain(path);
    expect(getSearchPages().map((entry) => entry.path)).not.toContain(path);
    expect(sitemapUrls).not.toContain(buildCanonicalUrl(path));
    expect(navigationPaths).not.toContain(path);
    expect(getMetadataForPath(path)?.robots).toBe("noindex, follow");
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
