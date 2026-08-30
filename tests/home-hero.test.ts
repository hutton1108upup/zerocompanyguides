import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeHero } from "../src/components/home-hero";

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
});
