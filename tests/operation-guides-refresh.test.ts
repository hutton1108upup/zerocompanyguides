import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import {
  buildCanonicalUrl,
  footerNavigationSections,
  getInnerRouteParams,
  getMetadataForPath,
  getSearchPages,
  navigationGroups,
  primaryNavigationPaths,
} from "../src/lib/site";

const page = (path: string) => contentPages.find((entry) => entry.path === path);

describe("Operation guide refresh boundaries", () => {
  it("keeps Strange Bedfellows directly routable but out of public discovery", async () => {
    const path = "/walkthrough/strange-bedfellows";
    const draft = page(path);
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);

    expect(draft).toMatchObject({
      status: "draft",
      verification: "needs-retest",
      evidence: "community",
      indexable: false,
      lastVerified: "2026-10-15",
    });
    expect(getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`)).toContain(path);
    expect(requiredPublicPaths).not.toContain(path);
    expect(getSearchPages().map((entry) => entry.path)).not.toContain(path);
    expect(sitemapUrls).not.toContain(buildCanonicalUrl(path));
    expect(getMetadataForPath(path)?.robots).toBe("noindex, follow");
    expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));

    const publicLinks = contentPages
      .filter((entry) => entry.path !== path)
      .flatMap((entry) => [entry.path, ...entry.related, ...entry.blocks.flatMap((block) =>
        block.type === "cards" ? block.items.flatMap((item) => item.href ? [item.href.split("#")[0]] : []) : [],
      )]);
    expect(publicLinks).not.toContain(path);
    const navigationLinks = [
      ...primaryNavigationPaths,
      ...navigationGroups.flatMap((group) => group.links.map((link) => link.href.split("#")[0])),
      ...footerNavigationSections.flatMap((section) => section.paths),
    ];
    expect(navigationLinks).not.toContain(path);
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
