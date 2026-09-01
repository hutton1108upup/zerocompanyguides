import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeHero } from "../src/components/home-hero";
import { contentPages } from "../src/content/pages";

describe("home hero", () => {
  it("keeps the site snapshot inside the hero but below the artwork stage", () => {
    const markup = renderToStaticMarkup(createElement(HomeHero));
    const heroStart = markup.indexOf('<section class="hero-shell">');
    const stageStart = markup.indexOf('class="hero-shell__stage"');
    const intelStart = markup.indexOf('class="hero-shell__intel"');
    const metricsStart = markup.indexOf('aria-label="Current site snapshot"');
    const heroEnd = markup.indexOf("</section>", metricsStart);

    expect(heroStart).toBe(0);
    expect(stageStart).toBeGreaterThan(heroStart);
    expect(intelStart).toBeGreaterThan(stageStart);
    expect(metricsStart).toBeGreaterThan(intelStart);
    expect(heroEnd).toBeGreaterThan(metricsStart);
  });

  it("serves dedicated group artwork for desktop, tablet and mobile viewports", () => {
    const markup = renderToStaticMarkup(createElement(HomeHero));

    expect(markup).toContain('media="(min-width: 1280px)"');
    expect(markup).toContain('/media/zero-company/hero/group-hero-desktop.webp');
    expect(markup).toContain('media="(min-width: 600px)"');
    expect(markup).toContain('/media/zero-company/hero/group-hero-tablet.webp');
    expect(markup).toContain('src="/media/zero-company/hero/group-hero-mobile.webp"');
    expect(markup).toContain('fetchPriority="high"');
    expect(markup).toContain(
      'alt="Star Wars Zero Company operators assembled against a blue starfield"',
    );
  });

  it("renders the homepage search intent as the H1 and keeps the tactical slogan outside it", () => {
    const markup = renderToStaticMarkup(createElement(HomeHero));
    const homePage = contentPages.find((page) => page.path === "/")!;
    const h1 = markup.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";

    expect(homePage.h1).toBe("Star Wars Zero Company Wiki, Builds & Walkthroughs");
    expect(h1).toBe("Star Wars Zero Company Wiki, Builds &amp; Walkthroughs");
    expect(h1).not.toContain("TACTICAL COMMAND INTEL");
    expect(markup).toContain(">TACTICAL COMMAND INTEL</p>");
  });
});
