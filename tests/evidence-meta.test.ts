import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EvidenceMeta } from "../src/components/evidence-meta";
import { contentPages } from "../src/content/pages";

describe("verification metadata", () => {
  it("surfaces every trust field required by the approved structure", () => {
    const page = contentPages.find((entry) => entry.path === "/performance/pc")!;
    const markup = renderToStaticMarkup(createElement(EvidenceMeta, { page }));

    expect(markup).toContain(page.gameVersion);
    expect(markup).toContain(`Difficulty: ${page.difficulty}`);
    expect(markup).toContain("Needs retest");
    expect(markup).not.toContain("Status: verified");
    expect(markup).toContain(`Spoilers: ${page.spoiler}`);
    expect(markup).toContain(page.platforms.join(" · "));
    expect(markup).toContain(page.lastVerified);
  });

  it("labels official and source-verified pages separately", () => {
    const officialPage = contentPages.find((entry) => entry.path === "/classes")!;
    const synthesisPage = contentPages.find(
      (entry) => entry.path === "/classes/tier-list",
    )!;

    expect(
      renderToStaticMarkup(createElement(EvidenceMeta, { page: officialPage })),
    ).toContain("Official verified");
    expect(
      renderToStaticMarkup(createElement(EvidenceMeta, { page: synthesisPage })),
    ).toContain("Source-verified synthesis");
  });
});
