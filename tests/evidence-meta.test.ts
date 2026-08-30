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
    expect(markup).toContain(`Status: ${page.status}`);
    expect(markup).toContain(`Spoilers: ${page.spoiler}`);
    expect(markup).toContain(page.platforms.join(" · "));
    expect(markup).toContain(page.lastVerified);
  });
});
