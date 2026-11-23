import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import {
  buildCanonicalUrl,
  getInnerRouteParams,
  getMetadataForPath,
  getSearchPages,
} from "../src/lib/site";

const page = (path: string) => contentPages.find((entry) => entry.path === path);

describe("Operation guide refresh boundaries", () => {
  it("publishes Strange Bedfellows as an indexed Operation decision guide", async () => {
    const path = "/walkthrough/strange-bedfellows";
    const guide = page(path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);

    expect(guide).toMatchObject({
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
      lastVerified: "2026-11-23",
    });
    expect(getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`)).toContain(path);
    expect(requiredPublicPaths).toContain(path);
    expect(getSearchPages().map((entry) => entry.path)).toContain(path);
    expect(sitemapUrls).toContain(buildCanonicalUrl(path));
    expect(getMetadataForPath(path)?.robots).toBe("index, follow");
    expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));
  });

  it("keeps the five Ship Adrift anchors and qualifies wager arithmetic", () => {
    const ship = page("/walkthrough/ship-adrift");
    expect(ship?.lastVerified).toBe("2026-10-15");
    const text = ship?.blocks.flatMap((block) => {
      if (block.type === "cards") return block.items.map((item) => `${item.title} ${item.href ?? ""}`);
      if ("heading" in block) return [block.heading, JSON.stringify(block)];
      return [];
    }).join(" ") ?? "";
    expect(text).toContain("ship-adrift-i-choices");
    expect(text).toContain("ship-adrift-ii-choices");
    expect(text).toContain("ship-adrift-iii-choices");
    expect(text).toContain("ship-adrift-iv-choices");
    expect(text).toContain("ship-adrift-v-choices");
    expect(text).toContain("not guaranteed");
    expect(text).toContain("net +4,000");
    expect(text).toContain("net -1,000");
  });

  it("preserves the public Back Channels title and canonical", () => {
    const path = "/walkthrough/back-channels";
    expect(page(path)).toMatchObject({
      title: "Star Wars Zero Company Back Channels: Runa or Neesh?",
      h1: "Star Wars Zero Company Back Channels: Runa's Connection or Neesh's Connection?",
      indexable: true,
    });
    expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));
  });
});
