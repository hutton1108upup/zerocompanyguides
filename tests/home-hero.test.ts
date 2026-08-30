import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeHero } from "../src/components/home-hero";
import { contentPages } from "../src/content/pages";

describe("home hero", () => {
  it("keeps the site snapshot inside the hero instead of rendering a standalone strip", () => {
    const markup = renderToStaticMarkup(createElement(HomeHero));
    const heroStart = markup.indexOf('<section class="hero-shell">');
    const metricsStart = markup.indexOf('aria-label="Current site snapshot"');
    const heroEnd = markup.indexOf("</section>", metricsStart);

    expect(heroStart).toBe(0);
    expect(metricsStart).toBeGreaterThan(heroStart);
    expect(heroEnd).toBeGreaterThan(metricsStart);
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
