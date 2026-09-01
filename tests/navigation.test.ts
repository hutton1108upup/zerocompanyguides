import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import {
  footerNavigationSections,
  getSearchPages,
  moreNavigationSections,
  primaryNavigationPaths,
} from "../src/lib/site";

const approvedPaths = new Set(contentPages.map((page) => page.path));

describe("navigation registry", () => {
  it("keeps eight core destinations visible in the primary navigation", () => {
    expect(primaryNavigationPaths).toEqual([
      "/squad-builder",
      "/builds",
      "/classes",
      "/weapons",
      "/characters",
      "/walkthrough",
      "/trophy-guide",
      "/performance",
    ]);
  });

  it("covers every indexable inner page exactly once across primary and More", () => {
    const morePaths = moreNavigationSections.flatMap((section) => section.paths);
    const headerPaths = [...primaryNavigationPaths, ...morePaths];
    const indexableInnerPaths = contentPages
      .filter((page) => page.indexable && page.path !== "/")
      .map((page) => page.path);

    expect(moreNavigationSections.map((section) => section.title)).toEqual([
      "Start & Decide",
      "Build & Squad",
      "Technical & Reference",
      "This Site",
    ]);
    expect(new Set(headerPaths).size).toBe(headerPaths.length);
    expect([...headerPaths].sort()).toEqual([...indexableInnerPaths].sort());
  });

  it("uses only approved footer routes and excludes banned duplicates", () => {
    const footerPaths = footerNavigationSections.flatMap((section) => section.paths);

    expect(new Set(footerPaths).size).toBe(footerPaths.length);
    expect(footerPaths).toEqual(
      expect.arrayContaining([
        "/squad-builder",
        "/corrections",
        "/updates",
        "/game-info",
        "/system-requirements",
        "/multiplayer",
        "/guides/beginners-guide",
        "/worth-it",
        "/guides",
        "/guides/respec",
        "/builds/hawks",
        "/builds/best-team",
        "/classes/tier-list",
        "/weapons",
        "/performance/pc",
        "/performance/fps-fix",
        "/performance/steam-deck",
        "/mods",
      ]),
    );

    for (const path of footerPaths) {
      expect(approvedPaths.has(path), `${path} should exist in contentPages`).toBe(true);
    }

    expect(footerPaths).not.toContain("/wiki");
    expect(footerPaths).not.toContain("/classes/best");

    const indexableInnerPaths = contentPages
      .filter((page) => page.indexable && page.path !== "/")
      .map((page) => page.path);
    expect([...footerPaths].sort()).toEqual([...indexableInnerPaths].sort());
  });

  it("keeps the search registry on indexable inner pages only", () => {
    const searchPages = getSearchPages();
    const searchPaths = searchPages.map((page) => page.path);
    const expectedSearchPaths = contentPages
      .filter((page) => page.indexable && page.path !== "/")
      .map((page) => page.path);

    expect(searchPaths).toEqual(expectedSearchPaths);
    expect(searchPaths).not.toContain("/");
    expect(searchPaths).not.toContain("/wiki");
    expect(searchPaths).not.toContain("/classes/best");

    for (const page of searchPages) {
      expect(page.indexable, `${page.path} must be indexable`).toBe(true);
    }
  });
});
