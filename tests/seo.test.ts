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
  defaultLocalOrigin,
  resolveSiteOrigin,
  siteOrigin,
} from "../src/lib/site";

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

    expect(robotsConfig.sitemap).toBe(`${siteOrigin}/sitemap.xml`);
    expect(robotsConfig.rules).toEqual({
      userAgent: "*",
      allow: "/",
    });
  });

  it("uses localhost as the non-production fallback origin", () => {
    expect(siteOrigin).toBe(defaultLocalOrigin);
    expect(resolveSiteOrigin({})).toBe(defaultLocalOrigin);
    expect(resolveSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" })).toBe(
      defaultLocalOrigin,
    );
  });

  it("requires an explicit origin in production", () => {
    expect(() => resolveSiteOrigin({ VERCEL_ENV: "production" })).toThrow(
      "NEXT_PUBLIC_SITE_URL is required when VERCEL_ENV=production.",
    );
    expect(
      resolveSiteOrigin({
        VERCEL_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://zerocompany.example.com/",
      }),
    ).toBe("https://zerocompany.example.com");
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
});
