import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContentPageView } from "../src/components/content-page";
import { getContentPage } from "../src/content/pages";

describe("mobile content navigation", () => {
  it("renders a crawlable mobile section index for long guides", () => {
    const page = getContentPage("/guides/beginners-guide");
    expect(page).toBeDefined();

    const markup = renderToStaticMarkup(createElement(ContentPageView, { page: page! }));

    expect(markup).toMatch(/class="[^"]*mobile-toc/);
    expect(markup).toContain("On this page");
    expect(markup).toContain('href="#cycles-1-5-priority-plan"');
    expect(markup).toContain('aria-current="location"');
  });

  it("places next-step navigation before the full source ledger", () => {
    const page = getContentPage("/worth-it");
    expect(page).toBeDefined();

    const markup = renderToStaticMarkup(createElement(ContentPageView, { page: page! }));
    const relatedIndex = markup.indexOf('class="related-panel"');
    const sourcesIndex = markup.indexOf('class="sources-panel"');

    expect(relatedIndex).toBeGreaterThan(-1);
    expect(sourcesIndex).toBeGreaterThan(-1);
    expect(relatedIndex).toBeLessThan(sourcesIndex);
  });
});
