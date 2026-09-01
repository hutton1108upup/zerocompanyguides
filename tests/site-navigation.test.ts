import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "../src/components/site-footer";
import { SiteHeader } from "../src/components/site-header";
import { contentPages } from "../src/content/pages";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
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

  it.each([
    ["/builds/hawks", "/builds"],
    ["/performance/pc", "/performance"],
  ])("keeps one primary owner active for %s", (pathname, owner) => {
    navigationState.pathname = pathname;

    const markup = renderToStaticMarkup(createElement(SiteHeader));
    const ownerLink = markup.match(
      new RegExp(`<a[^>]*href="${owner}"[^>]*>|<a[^>]*data-active="true"[^>]*href="${owner}"[^>]*>`),
    )?.[0];
    const moreButton = markup.match(
      /<button[^>]*class="site-nav__more-button"[^>]*>/,
    )?.[0];

    expect(ownerLink).toContain('data-active="true"');
    expect(ownerLink).toContain('aria-current="location"');
    expect(moreButton).toContain('data-active="false"');

    navigationState.pathname = "/";
  });
});
