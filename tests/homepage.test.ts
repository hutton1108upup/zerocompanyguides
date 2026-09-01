import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../src/app/page";
import { homeFacts, homeSections, popularPaths } from "../src/lib/home-data";
import { contentPageByPath } from "../src/content/pages";

describe("homepage data", () => {
  it("explains the core campaign loop before advanced build decisions", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));
    const howToPlay = markup.indexOf("How to Play Star Wars Zero Company");
    const start = markup.indexOf("Three decisions before the next Cycle");

    expect(howToPlay).toBeGreaterThan(-1);
    expect(howToPlay).toBeLessThan(start);
    for (const step of [
      "Get ready at the Den",
      "Choose the next job",
      "Pick a squad for the objective",
      "Spend each Operator&#x27;s 3 AP",
      "Set up a better shot",
      "Reset at the Den after the mission",
    ]) {
      expect(markup).toContain(step);
    }
  });

  it("replaces generic deploy copy with useful first-campaign questions", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));

    expect(markup).toContain("First-campaign questions that actually matter");
    expect(markup).toContain("Can I complete every job in one campaign?");
    expect(markup).toContain("What should I do when an Operator is downed?");
    expect(markup).not.toContain("Before you deploy");
    expect(markup).not.toContain("Is Zero Company multiplayer?");
    expect(markup).not.toContain("Is it Steam Deck Verified?");
  });

  it("puts mobile task decisions before secondary media and reference sections", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));
    const start = markup.indexOf("Three decisions before the next Cycle");
    const popular = markup.indexOf("Popular now");
    const quickFacts = markup.indexOf("Quick game facts");
    const media = markup.indexOf('aria-label="Official visual briefing"');

    expect(start).toBeGreaterThan(-1);
    expect(start).toBeLessThan(popular);
    expect(popular).toBeLessThan(quickFacts);
    expect(quickFacts).toBeLessThan(media);
  });

  it("exposes six current popular destinations", () => {
    expect(popularPaths).toHaveLength(6);
    expect(popularPaths[0]).toBe("/squad-builder");
    for (const path of popularPaths) {
      expect(contentPageByPath.has(path), path).toBe(true);
    }
  });

  it("makes the account-free Squad Builder the primary product action", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));

    expect(markup).toContain('href="/squad-builder"');
    expect(markup).toContain("Build Your Squad");
    expect(homeSections[0].links[0]).toBe("/squad-builder");
  });

  it("provides official quick facts without mutable review counts", () => {
    expect(homeFacts).toHaveLength(6);
    expect(homeFacts.map((fact) => fact.label)).toContain("Release date");
    expect(homeFacts.map((fact) => fact.label)).toContain("Platforms");
    expect(homeFacts.map((fact) => `${fact.label} ${fact.value}`).join(" ")).not.toMatch(/reviews|players/i);
  });

  it("routes users through all core content clusters", () => {
    expect(homeSections).toHaveLength(6);
    for (const section of homeSections) {
      expect(section.links.length).toBeGreaterThanOrEqual(2);
      for (const link of section.links) expect(contentPageByPath.has(link)).toBe(true);
    }
  });
});
