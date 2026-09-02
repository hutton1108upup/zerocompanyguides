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

const path = "/walkthrough/back-channels";

describe("Back Channels decision route", () => {
  it("publishes one searchable child canonical through the site's discovery registry", async () => {
    const page = contentPages.find((entry) => entry.path === path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const navigationPaths = [
      ...primaryNavigationPaths,
      ...moreNavigationSections.flatMap((section) => section.paths),
      ...footerNavigationSections.flatMap((section) => section.paths),
    ];

    expect(page).toMatchObject({
      navLabel: "Back Channels",
      title: "Star Wars Zero Company Back Channels: Runa or Neesh?",
      description:
        "Compare Runa's Connection and Neesh's Connection rewards, including the Capacitor, Contracts, Storm Basin, Station and follow-up consequences.",
      h1: "Star Wars Zero Company Back Channels: Runa's Connection or Neesh's Connection?",
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
    });
    expect(staticPaths).toContain(path);
    expect(requiredPublicPaths).toContain(path);
    expect(getSearchPages().map((entry) => entry.path)).toContain(path);
    expect(sitemapUrls).toContain(buildCanonicalUrl(path));
    expect(navigationPaths.filter((entry) => entry === path)).toHaveLength(2);
    expect(getMetadataForPath(path)?.robots).toBe("index, follow");
    expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));
  });

  it("answers the fixed Operation choice without inventing a combat walkthrough", () => {
    const page = contentPages.find((entry) => entry.path === path);

    expect(page).toBeDefined();
    if (!page) return;

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Back Channels quick answer",
        "Runa's Connection vs Neesh's Connection",
        "Which Back Channels choice should you make?",
        "What each route unlocks",
        "Before you advance the next Cycle",
        "Back Channels questions",
      ]),
    );

    const choiceTable = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Runa's Connection vs Neesh's Connection",
    );
    expect(choiceTable?.type).toBe("table");
    if (choiceTable?.type === "table") {
      expect(choiceTable.rows.map((row) => row[0])).toEqual([
        "Runa's Connection",
        "Neesh's Connection",
      ]);
      expect(choiceTable.rows[0].join(" ")).toContain("+1 Capacitor");
      expect(choiceTable.rows[0].join(" ")).toContain("Storm Basin");
      expect(choiceTable.rows[1].join(" ")).toContain("+2 Contracts");
      expect(choiceTable.rows[1].join(" ")).toContain("Station Mission");
    }

    expect(page.blocks.flatMap((block) => (
      block.type === "briefing" ? block.items : []
    )).join(" ")).toContain("Critical Operation");

    const sources = resolveSources(page.sources);
    const sourceKinds = new Set(sources.map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("competitor")).toBe(true);
    expect(sources.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "ea-faq",
        "gamersheroes-choices",
        "showgamer-choices",
        "allthings-storm-basin",
      ]),
    );
  });
});
