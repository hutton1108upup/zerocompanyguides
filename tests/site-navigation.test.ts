import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "../src/components/site-footer";
import { SiteHeader } from "../src/components/site-header";
import {
  footerNavigationSections,
  moreNavigationSections,
  primaryNavigationPaths,
} from "../src/lib/site";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

const headerPaths = [
  ...primaryNavigationPaths,
  ...moreNavigationSections.flatMap((section) => section.paths),
];
const footerPaths = footerNavigationSections.flatMap((section) => section.paths);

describe("rendered site navigation", () => {
  it("renders the curated desktop header without expanding every leaf guide", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));
    const primaryNav = markup.match(
      /<nav aria-label="Primary site navigation"[\s\S]*?<\/nav>/,
    )?.[0];

    expect(primaryNav).toContain('href="/weapons"');
    expect(primaryNav).toContain('href="/game-info"');
    expect(primaryNav).toContain('href="/squad-builder"');
    expect(primaryNav).toContain('aria-controls="desktop-more-navigation"');
    expect(primaryNav).toContain("More");

    for (const path of headerPaths) {
      expect(primaryNav, `${path} should be present in the desktop header`).toContain(
        `href="${path}"`,
      );
    }
    expect(primaryNav).not.toContain('href="/walkthrough/nebulous-pursuit"');
    expect(primaryNav).not.toContain('href="/walkthrough/ship-adrift"');
  });

  it("renders the curated footer registry and leaves Operation discovery to the hub", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));

    for (const path of footerPaths) {
      expect(markup, `${path} should be linked from the footer`).toContain(
        `href="${path}"`,
      );
    }
    expect(markup).not.toContain('href="/walkthrough/nebulous-pursuit"');
    expect(markup).not.toContain('href="/walkthrough/ship-adrift"');
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

  it("marks the Squad Builder as the current primary page", () => {
    navigationState.pathname = "/squad-builder";

    const markup = renderToStaticMarkup(createElement(SiteHeader));
    const builderLink = markup.match(/<a[^>]*href="\/squad-builder"[^>]*>/)?.[0];

    expect(builderLink).toContain('data-active="true"');
    expect(builderLink).toContain('aria-current="page"');

    navigationState.pathname = "/";
  });
});
