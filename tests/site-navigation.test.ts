import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "../src/components/site-footer";
import { SiteHeader } from "../src/components/site-header";
import { contentPages } from "../src/content/pages";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const indexableInnerPaths = contentPages
  .filter((page) => page.indexable && page.path !== "/")
  .map((page) => page.path);

describe("rendered site navigation", () => {
  it("keeps every indexable inner page discoverable in the desktop header HTML", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));
    const primaryNav = markup.match(
      /<nav aria-label="Primary site navigation"[\s\S]*?<\/nav>/,
    )?.[0];

    expect(primaryNav).toContain('href="/weapons"');
    expect(primaryNav).toContain('href="/game-info"');
    expect(primaryNav).toContain('aria-controls="desktop-more-navigation"');
    expect(primaryNav).toContain("More");

    for (const path of indexableInnerPaths) {
      expect(primaryNav, `${path} should be discoverable in the desktop header`).toContain(
        `href="${path}"`,
      );
    }
  });

  it("renders the complete navigation registry in the footer", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    for (const path of indexableInnerPaths) {
      expect(markup, `${path} should be linked from the footer`).toContain(
        `href="${path}"`,
      );
    }
  });
});
