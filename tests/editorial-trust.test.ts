import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../src/app/page";
import { ContentPageView } from "../src/components/content-page";
import { getContentPage } from "../src/content/pages";
import { buildCanonicalUrl, siteName } from "../src/lib/site";
import { buildOrganizationStructuredData } from "../src/lib/structured-data";

describe("editorial trust routes", () => {
  it.each(["/corrections", "/updates"])("publishes %s as an editorial page", (path) => {
    const page = getContentPage(path);

    expect(page).toMatchObject({
      pageType: "editorial",
      evidence: "editorial",
      verification: "maintained-site-policy",
      indexable: true,
      sources: [],
    });
  });

  it("routes corrections into a real evidence-shaped GitHub issue", () => {
    const corrections = getContentPage("/corrections")!;
    const hrefs = corrections.blocks.flatMap((block) => (
      block.type === "cards" ? block.items.map((item) => item.href) : []
    ));
    const issueUrl = hrefs.find((href) => href?.startsWith("https://github.com/"));

    expect(issueUrl).toContain("hutton1108upup/zerocompanyguides/issues/new");
    expect(issueUrl).toContain("game%20version");
    expect(issueUrl).toContain("evidence%20link");
  });

  it("renders editorial provenance without an empty game-source ledger", () => {
    const corrections = getContentPage("/corrections")!;
    const markup = renderToStaticMarkup(createElement(ContentPageView, { page: corrections }));

    expect(markup).toContain("Site editorial policy");
    expect(markup).toContain("Maintained site policy");
    expect(markup).not.toContain("Source ledger");
  });
});

describe("publisher identity", () => {
  it("publishes one stable Organization node with truthful principles", () => {
    expect(buildOrganizationStructuredData()).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${buildCanonicalUrl("/")}#organization`,
      name: siteName,
      alternateName: ["Star Wars Zero Company Wiki & Guide", "zerocompany-guides.wiki"],
      url: buildCanonicalUrl("/"),
      logo: buildCanonicalUrl("/icon"),
      publishingPrinciples: buildCanonicalUrl("/corrections"),
    });
  });

  it("includes the Organization node in visible homepage JSON-LD", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));

    expect(markup).toContain(`${buildCanonicalUrl("/")}#organization`);
    expect(markup).toContain(buildCanonicalUrl("/corrections"));
  });
});
