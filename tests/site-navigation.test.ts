import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "../src/components/site-footer";
import { SiteHeader } from "../src/components/site-header";
import { navigationGroups } from "../src/lib/site";

const state = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));

describe("rendered task navigation", () => {
  it("renders crawlable links in five closed category panels and an independent tool", () => {
    const markup = renderToStaticMarkup(createElement(SiteHeader));
    expect(markup).not.toContain("desktop-more-navigation");
    expect(markup).not.toContain("site-nav__more");
    for (const group of navigationGroups) {
      expect(markup).toContain(`aria-controls="desktop-nav-${group.id}"`);
      expect(markup).toContain(`id="desktop-nav-${group.id}" hidden=""`);
      for (const link of group.links) expect(markup).toContain(`href="${link.href}"`);
    }
    expect(markup).toContain('class="site-tool-link"');
    expect(markup).toContain('href="/squad-builder"');
  });

  it.each([["/weapons", "/builds"], ["/trophy-guide", "/guides"], ["/mods", "/performance"]])(
    "highlights a single semantic owner for %s", (path, owner) => {
      state.pathname = path;
      const markup = renderToStaticMarkup(createElement(SiteHeader));
      const primaryLinks = markup.match(/<a[^>]*class="site-nav__link"[^>]*>/g) ?? [];
      const active = primaryLinks.filter((link) => link.includes('data-active="true"'));
      expect(active).toHaveLength(1);
      expect(active[0]).toContain(`href="${owner}"`);
      expect(active[0]).toContain('aria-current="location"');
      state.pathname = "/";
    },
  );

  it("keeps the footer compact with the same category labels", () => {
    const markup = renderToStaticMarkup(createElement(SiteFooter));
    expect(markup.match(/class="site-footer__link"/g)).toHaveLength(10);
    expect(markup).toContain("Builds &amp; Gear");
    expect(markup).toContain(">Fixes<");
    expect(markup).toContain('href="/corrections"');
    expect(markup).not.toContain('href="/walkthrough/back-channels"');
  });
});
