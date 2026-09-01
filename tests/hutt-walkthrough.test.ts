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

const path = "/walkthrough/in-debt-to-the-hutts";

describe("In Debt to the Hutts review route", () => {
  it("builds the review page without publishing untested route advice", async () => {
    const page = contentPages.find((entry) => entry.path === path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const navigationPaths = [
      ...primaryNavigationPaths,
      ...moreNavigationSections.flatMap((section) => section.paths),
      ...footerNavigationSections.flatMap((section) => section.paths),
    ];

    expect(page).toMatchObject({
      navLabel: "In Debt to the Hutts",
      title: "Star Wars Zero Company In Debt to the Hutts Walkthrough",
      description:
        "Clear the 80,000-Credit debt, follow Gorga's Critical chain, understand Pick Your Poison and complete Payback before its deadline.",
      h1: "Star Wars Zero Company: In Debt to the Hutts Walkthrough",
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

  it("answers the debt route while keeping first-hand verification visibly open", () => {
    const page = contentPages.find((entry) => entry.path === path);

    expect(page).toBeDefined();
    if (!page) return;

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "First-hand replay still required",
        "In Debt to the Hutts route at a glance",
        "How to clear the 80,000-Credit debt",
        "Kaller or Dantooine?",
        "What to spend Credits on during the debt",
        "Before you advance the next Cycle",
        "In Debt to the Hutts questions",
      ]),
    );

    const route = page.blocks.find(
      (block) => block.type === "table" && block.heading === "In Debt to the Hutts route at a glance",
    );
    expect(route?.type).toBe("table");
    if (route?.type === "table") {
      expect(route.rows.map((row) => row[0])).toEqual([
        "Gorga's Critical chain",
        "Bruckner and Lothal",
        "Pick Your Poison",
        "Republic Intelligence contract",
        "Payback Operation",
      ]);
      expect(route.rows.at(-1)?.join(" ")).toContain("one-Cycle");
    }

    const sources = resolveSources(page.sources);
    const sourceKinds = new Set(sources.map((source) => source.kind));
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("competitor")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);
    expect(sources.map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "whisper-hutt-debt",
        "allthings-chapters",
        "reddit-credit-economy",
      ]),
    );
  });
});
