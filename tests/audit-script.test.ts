import { describe, expect, it } from "vitest";
import { parseSitemapUrls, validateIndexablePage, validateReviewPage } from "../scripts/audit-pages.mjs";

const pageHtml = ({ robots, canonical = "https://example.test/guide" }: { robots: string; canonical?: string }) => `
  <html>
    <head>
      <title>Example guide</title>
      <meta name="description" content="A sufficiently long description that explains what this page helps the player accomplish in the game today.">
      <meta name="robots" content="${robots}">
      <link rel="canonical" href="${canonical}">
    </head>
    <body><main><h1>Example guide</h1></main></body>
  </html>
`;

describe("runtime sitemap audit", () => {
  it("accepts any non-empty unique sitemap instead of a fixed page count", () => {
    expect(parseSitemapUrls([
      "<loc>https://example.test/</loc>",
      "<loc>https://example.test/guide</loc>",
    ].join(""))).toEqual([
      "https://example.test/",
      "https://example.test/guide",
    ]);

    expect(() => parseSitemapUrls("<loc>https://example.test/guide</loc><loc>https://example.test/guide</loc>"))
      .toThrow("duplicate URLs");
    expect(() => parseSitemapUrls(""))
      .toThrow("contains no URLs");
  });

  it("validates indexable pages and separately validates linked review pages", () => {
    expect(() => validateIndexablePage(
      "/guide",
      pageHtml({ robots: "index, follow" }),
      new Set(["/guide"]),
    )).not.toThrow();

    expect(() => validateIndexablePage(
      "/guide",
      pageHtml({ robots: "noindex, follow" }),
      new Set(["/guide"]),
    )).toThrow("unexpectedly contains noindex");

    expect(() => validateReviewPage(
      "/draft-guide",
      pageHtml({
        robots: "noindex, follow",
        canonical: "https://example.test/draft-guide",
      }),
      new Set(["/guide"]),
    )).not.toThrow();

    expect(() => validateReviewPage(
      "/draft-guide",
      pageHtml({
        robots: "index, follow",
        canonical: "https://example.test/draft-guide",
      }),
      new Set(["/guide"]),
    )).toThrow("must contain noindex");
  });
});
