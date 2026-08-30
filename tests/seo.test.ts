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
  defaultSiteOrigin,
  resolveSiteOrigin,
  siteOrigin,
} from "../src/lib/site";

const productionOrigin = "https://zerocompany-guides.wiki";
const aiDiscoveryCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];
const aiTrainingCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
];

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

    expect(robotsConfig.host).toBeUndefined();
    expect(robotsConfig.sitemap).toBe(`${productionOrigin}/sitemap.xml`);
    expect(robotsConfig.rules).toEqual([
      { userAgent: "*", allow: "/" },
      { userAgent: aiDiscoveryCrawlers, allow: "/" },
      { userAgent: aiTrainingCrawlers, disallow: "/" },
    ]);
  });

  it("uses the production domain as the safe default origin", () => {
    expect(defaultSiteOrigin).toBe(productionOrigin);
    expect(siteOrigin).toBe(productionOrigin);
    expect(resolveSiteOrigin({})).toBe(productionOrigin);
    expect(resolveSiteOrigin({ VERCEL_ENV: "production" })).toBe(productionOrigin);
  });

  it("honors an explicit site URL environment override", () => {
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" })).toBe(
      "http://localhost:3000",
    );
    expect(
      resolveSiteOrigin({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://zerocompany.example.com/",
      }),
    ).toBe("https://zerocompany.example.com");
  });

  it("never emits localhost in canonical, sitemap, robots, or structured data defaults", async () => {
    const sitemapEntries = await sitemap();
    const robotsConfig = robots();

    for (const entry of sitemapEntries) {
      expect(entry.url).toMatch(/^https:\/\/zerocompany-guides\.wiki\//);
      expect(entry.url).not.toContain("localhost");
    }

    expect(robotsConfig.host).toBeUndefined();
    expect(robotsConfig.sitemap).toBe(`${productionOrigin}/sitemap.xml`);

    for (const page of contentPages) {
      const canonical = buildCanonicalUrl(page.path);
      const graph = buildPageStructuredData(page);

      expect(canonical.startsWith(productionOrigin)).toBe(true);
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
