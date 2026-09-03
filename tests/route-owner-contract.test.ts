import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";

const pageText = (path: string) => {
  const page = contentPages.find((entry) => entry.path === path);
  return JSON.stringify(page?.blocks ?? []).toLowerCase();
};

describe("P1 route ownership", () => {
  it("keeps each launch query family on one canonical owner", () => {
    const paths = contentPages.map((page) => page.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).not.toContain("/best-starting-class");
    expect(paths).not.toContain("/respec-guide");
    expect(paths).not.toContain("/steam-deck-fps-fix");
    expect(contentPages.find((page) => page.path === "/classes/tier-list")?.title.toLowerCase()).toContain("tier list");
    expect(contentPages.find((page) => page.path === "/builds/hawks")?.title.toLowerCase()).toContain("hawks");
    expect(contentPages.find((page) => page.path === "/guides/respec")?.title.toLowerCase()).toContain("respec");
  });

  it("keeps the trophy, performance and mod owners task-complete", () => {
    expect(pageText("/trophy-guide")).toContain("achievement-checklist");
    expect(pageText("/performance/fps-fix")).toContain("cpu threading");
    expect(pageText("/performance/fps-fix")).toContain("build version");
    expect(pageText("/mods")).toContain("patch compatibility");
    expect(pageText("/mods")).toContain("rollback");
    expect(pageText("/mods")).toContain("dependency");
  });
});
