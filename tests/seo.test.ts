import { describe, expect, it } from "vitest";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { contentPages } from "../src/content/pages";
import {
  buildPageStructuredData,
  buildSiteStructuredData,
} from "../src/lib/structured-data";
import {
  buildCanonicalUrl,
  resolveSiteOrigin,
  siteOrigin,
} from "../src/lib/site";

const productionOrigin = "https://zerocompany-guides.wiki";

describe("SEO outputs", () => {
  it("publishes every indexable route in the sitemap exactly once", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const expectedUrls = contentPages
      .filter((page) => page.indexable)
      .map((page) => buildCanonicalUrl(page.path));

    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.sort()).toEqual(expectedUrls.sort());
    expect(urls).not.toContain(buildCanonicalUrl("/wiki"));
    expect(urls).not.toContain(buildCanonicalUrl("/classes/best"));
  });

  it("points robots at the canonical sitemap and allows crawling", () => {
    const robotsConfig = robots();

    expect(robotsConfig.host).toBe(productionOrigin);
    expect(robotsConfig.sitemap).toBe(`${productionOrigin}/sitemap.xml`);
    expect(robotsConfig.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
  });

  it("uses the real custom domain as the default canonical origin", () => {
    expect(siteOrigin).toBe(productionOrigin);
    expect(resolveSiteOrigin({})).toBe(productionOrigin);
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" })).toBe(
      "http://localhost:3000",
    );
  });

  it("keeps the custom domain fallback in production", () => {
    expect(resolveSiteOrigin({ VERCEL_ENV: "production" })).toBe(productionOrigin);
    expect(
      resolveSiteOrigin({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://zerocompany.example.com/",
      }),
    ).toBe("https://zerocompany.example.com");
  });

  it("uses the production origin for every canonical and media thumbnail", async () => {
    const sitemapEntries = await sitemap();

    expect(sitemapEntries).toHaveLength(22);
    for (const entry of sitemapEntries) {
      expect(entry.url.startsWith(`${productionOrigin}/`)).toBe(true);
    }

    for (const page of contentPages) {
      expect(buildCanonicalUrl(page.path).startsWith(productionOrigin)).toBe(true);
      const graph = buildPageStructuredData(page);
      expect(graph.page.url.startsWith(productionOrigin)).toBe(true);
      for (const item of graph.breadcrumb.itemListElement) {
        expect(item.item.startsWith(productionOrigin)).toBe(true);
      }
      for (const video of graph.videos ?? []) {
        expect(video.thumbnailUrl.startsWith(`${productionOrigin}/`)).toBe(true);
      }
    }
  });

  it("keeps structured data aligned with visible page facts", () => {
    const homePage = contentPages.find((page) => page.path === "/");

    expect(homePage).toBeDefined();

    const siteGraph = buildSiteStructuredData(homePage!);
    expect(siteGraph["@type"]).toBe("WebSite");
    expect(siteGraph.name).toBe(homePage!.h1);
    expect(siteGraph.url).toBe(buildCanonicalUrl("/"));

    for (const page of contentPages) {
      const graph = buildPageStructuredData(page);
      const hasFaqBlock = page.blocks.some((block) => block.type === "faq");

      expect(graph.page["@type"]).toMatch(/^(CollectionPage|Article)$/);
      expect(graph.page.name).toBe(page.title);
      expect(graph.page.description).toBe(page.description);
      expect(graph.page.url).toBe(buildCanonicalUrl(page.path));
      expect(graph.breadcrumb["@type"]).toBe("BreadcrumbList");
      expect(graph.breadcrumb.itemListElement.at(-1)?.name).toBe(page.navLabel);

      if (hasFaqBlock) {
        expect(graph.faq?.["@type"]).toBe("FAQPage");
      } else {
        expect(graph.faq).toBeUndefined();
      }
    }
  });

  it("publishes one VideoObject for each visible media video", () => {
    const guide = contentPages.find((page) => page.path === "/guides")!;
    const videoBlock = guide.blocks.find((block) => block.type === "video")!;
    const graph = buildPageStructuredData(guide);

    expect(graph.videos).toHaveLength(1);
    expect(graph.videos?.[0]).toMatchObject({
      "@type": "VideoObject",
      name: videoBlock.title,
      description: videoBlock.description,
      uploadDate: videoBlock.publishedAt,
      duration: "PT2M40S",
      thumbnailUrl: `${siteOrigin}${videoBlock.posterSrc}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoBlock.videoId}`,
      contentUrl: `https://www.youtube.com/watch?v=${videoBlock.videoId}`,
    });

    const trophyGuide = contentPages.find((page) => page.path === "/trophy-guide")!;
    expect(buildPageStructuredData(trophyGuide).videos).toBeUndefined();
  });
});
