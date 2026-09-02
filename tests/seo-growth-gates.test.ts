import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";
import {
  buildCanonicalUrl,
  getInnerRouteParams,
  getMetadataForPath,
  getSearchPages,
} from "../src/lib/site";

describe("SEO growth gates", () => {
  it("publishes the completed permadeath workflow after the repeated-demand gate", async () => {
    const candidate = contentPages.find((page) => page.path === "/guides/permadeath");
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);

    expect(candidate).toBeDefined();
    expect(candidate?.status).toBe("verified");
    expect(candidate?.verification).toBe("source-verified-synthesis");
    expect(candidate?.indexable).toBe(true);
    expect(requiredPublicPaths).toContain("/guides/permadeath");
    expect(staticPaths).toContain("/guides/permadeath");
    expect(getSearchPages().map((page) => page.path)).toContain("/guides/permadeath");
    expect(sitemapUrls).toContain(buildCanonicalUrl("/guides/permadeath"));
    expect(getMetadataForPath("/guides/permadeath")?.robots).toBe("index, follow");
  });

  it("separates campaign difficulty, Permadeath, Beskar and mission risk", () => {
    const candidate = contentPages.find((page) => page.path === "/guides/permadeath");
    const headings = candidate?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    const sourceKinds = new Set(resolveSources(candidate?.sources ?? []).map((source) => source.kind));

    expect(headings).toEqual(
      expect.arrayContaining([
        "What Permadeath changes",
        "Difficulty, Permadeath and Beskar are separate choices",
        "Which Zero Company difficulty setting should you choose?",
        "Injury, Rally and recovery state",
        "Before-deployment permadeath checklist",
        "Difficulty and Permadeath questions",
      ]),
    );
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
    expect(sourceKinds.has("community")).toBe(true);

    const settings = candidate?.blocks.find(
      (block) => block.type === "table" && block.heading === "Difficulty, Permadeath and Beskar are separate choices",
    );
    expect(settings?.type).toBe("table");
    if (settings?.type === "table") {
      expect(settings.rows.map((row) => row[0])).toEqual([
        "Campaign difficulty",
        "Permadeath",
        "Beskar Mode",
        "Mission risk",
      ]);
      expect(settings.rows[0].join(" ")).toContain("Story, Normal, Hard and Expert");
      expect(settings.rows[3].join(" ")).toContain("Risky, Dangerous and Extreme");
    }
  });
});
