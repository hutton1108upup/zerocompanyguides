import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import { getHeadingId } from "../src/lib/content";
import { homeSections } from "../src/lib/home-data";
import {
  footerNavigationSections, getNavigationGroup, getPublicNavigationGroups,
  getSearchPages, navigationGroups, primaryNavigationPaths,
} from "../src/lib/site";

describe("shared navigation and contextual discovery", () => {
  it("uses five task groups consistently across navigation and homepage", () => {
    expect(primaryNavigationPaths).toEqual(["/walkthrough", "/builds", "/guides", "/performance", "/game-info"]);
    expect(homeSections.map((section) => section.title)).toEqual(navigationGroups.map((group) => group.label));
    expect(navigationGroups.every((group) => group.links.length <= 7)).toBe(true);
    expect(footerNavigationSections.flatMap((section) => section.paths)).toHaveLength(10);
  });

  it.each([
    ["/weapons", "builds"], ["/classes/tier-list", "builds"],
    ["/characters/voice-cast", "builds"], ["/guides/respec", "guides"],
    ["/trophy-guide", "guides"], ["/mods", "fixes"],
    ["/performance/steam-deck", "fixes"], ["/worth-it", "game-info"],
    ["/walkthrough/help-wanted", "walkthrough"],
  ])("assigns %s to its semantic category", (path, id) => {
    expect(getNavigationGroup(path)?.id).toBe(id);
  });

  it("keeps navigation public and resolves every fragment to a real section", () => {
    const hrefs = getPublicNavigationGroups().flatMap((group) => [group.path, ...group.links.map((link) => link.href)]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) {
      const [path, fragment] = href.split("#");
      const page = contentPages.find((entry) => entry.path === path);
      expect(page?.indexable, href).toBe(true);
      if (fragment) {
        expect(page?.blocks.flatMap((block) => "heading" in block ? [getHeadingId(block.heading)] : [])).toContain(fragment);
      }
    }
    expect(hrefs).not.toContain("/walkthrough/sloppy-supply-route");
    expect(hrefs).not.toContain("/walkthrough/in-debt-to-the-hutts");
  });

  it("gives each public game page at least two contextual incoming pages without counting global menus", () => {
    const publicPages = contentPages.filter((page) => page.indexable && page.pageType !== "editorial" && page.path !== "/");
    const incoming = new Map<string, Set<string>>();
    for (const page of publicPages) {
      const links = [...page.related, ...page.blocks.flatMap((block) => block.type === "cards"
        ? block.items.flatMap((item) => item.href?.startsWith("/") ? [item.href.split("#")[0]] : []) : [])];
      for (const target of new Set(links)) {
        expect(contentPages.some((entry) => entry.path === target), `${page.path} -> ${target}`).toBe(true);
        if (target === page.path) continue;
        if (!incoming.has(target)) incoming.set(target, new Set());
        incoming.get(target)!.add(page.path);
      }
    }
    for (const page of publicPages) {
      expect(incoming.get(page.path)?.size ?? 0, `${page.path}: incoming contextual pages`).toBeGreaterThanOrEqual(2);
    }
  });

  it("retains indexable search entries and excludes evidence-gated pages", () => {
    expect(getSearchPages().map((page) => page.path)).toEqual(contentPages.filter((page) => page.indexable && page.path !== "/").map((page) => page.path));
  });
});
