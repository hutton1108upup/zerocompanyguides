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
  it("builds the permadeath review candidate without publishing it to search", async () => {
    const candidate = contentPages.find((page) => page.path === "/guides/permadeath");
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);

    expect(candidate).toBeDefined();
    expect(candidate?.status).toBe("draft");
    expect(candidate?.verification).toBe("official-verified");
    expect(candidate?.indexable).toBe(false);
    expect(requiredPublicPaths).not.toContain("/guides/permadeath");
    expect(staticPaths).toContain("/guides/permadeath");
    expect(getSearchPages().map((page) => page.path)).not.toContain("/guides/permadeath");
    expect(sitemapUrls).not.toContain(buildCanonicalUrl("/guides/permadeath"));
    expect(getMetadataForPath("/guides/permadeath")?.robots).toBe("noindex, follow");
  });

  it("gives the candidate an independent, source-backed permadeath workflow", () => {
    const candidate = contentPages.find((page) => page.path === "/guides/permadeath");
    const headings = candidate?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    const sourceKinds = new Set(resolveSources(candidate?.sources ?? []).map((source) => source.kind));

    expect(headings).toEqual(
      expect.arrayContaining([
        "What Permadeath changes",
        "Injury, Rally and recovery state",
        "Before-deployment permadeath checklist",
        "Permadeath questions",
      ]),
    );
    expect(sourceKinds.has("official")).toBe(true);
    expect(sourceKinds.has("press")).toBe(true);
  });
});
