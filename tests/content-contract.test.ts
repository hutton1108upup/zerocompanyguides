import { describe, expect, it } from "vitest";
import { contentPages, requiredPublicPaths } from "../src/content/pages";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const entityKeyword = "star wars zero company";
const intentTermsByPath: Record<string, readonly string[]> = {
  "/": ["wiki", "builds", "walkthrough"],
  "/squad-builder": ["squad builder", "team planner"],
  "/corrections": ["corrections", "editorial policy"],
  "/updates": ["site updates", "change log"],
  "/classes": ["classes", "specializations"],
  "/classes/tier-list": ["class tier list"],
  "/builds": ["builds"],
  "/builds/hawks": ["hawks", "build"],
  "/builds/best-team": ["squad"],
  "/guides": ["guides"],
  "/guides/respec": ["respec", "specialization"],
  "/guides/permadeath": ["permadeath", "injury"],
  "/walkthrough": ["walkthrough"],
  "/walkthrough/back-channels": ["back channels", "runa", "neesh"],
  "/walkthrough/in-debt-to-the-hutts": ["in debt to the hutts", "walkthrough"],
  "/walkthrough/sloppy-supply-route": ["sloppy supply route"],
  "/trophy-guide": ["trophy", "achievement"],
  "/performance": ["performance", "fixes"],
  "/performance/pc": ["pc performance", "settings"],
  "/performance/fps-fix": ["stutter", "fps", "crash"],
  "/game-info": ["release", "platforms", "price"],
  "/system-requirements": ["system requirements"],
  "/multiplayer": ["multiplayer", "co-op"],
  "/weapons": ["weapons", "weapon mods"],
  "/characters": ["characters"],
  "/characters/companions": ["companions", "operators"],
  "/characters/voice-cast": ["voice cast", "characters"],
  "/guides/beginners-guide": ["beginner guide", "first-cycle"],
  "/performance/steam-deck": ["steam deck", "performance"],
  "/mods": ["mods", "modding"],
  "/worth-it": ["worth it"],
};

describe("content registry", () => {
  it("contains every approved P0 route exactly once", () => {
    const paths = contentPages.map((page) => page.path);
    const indexablePaths = contentPages
      .filter((page) => page.indexable)
      .map((page) => page.path);
    const reviewPaths = contentPages
      .filter((page) => !page.indexable)
      .map((page) => page.path);

    expect(new Set(paths).size).toBe(paths.length);
    expect([...indexablePaths].sort()).toEqual([...requiredPublicPaths].sort());
    for (const path of reviewPaths) {
      expect(requiredPublicPaths).not.toContain(path);
    }
  });

  it("publishes complete, sourced metadata for every route", () => {
    for (const page of contentPages) {
      expect(page.title.length, `${page.path} title`).toBeGreaterThan(20);
      expect(page.description.length, `${page.path} description`).toBeGreaterThan(70);
      expect(page.h1.length, `${page.path} h1`).toBeGreaterThan(8);
      if (page.pageType === "editorial") {
        expect(page.sources, `${page.path} editorial sources`).toEqual([]);
      } else {
        expect(page.sources.length, `${page.path} sources`).toBeGreaterThan(0);
      }
      expect(page.related.length, `${page.path} related`).toBeGreaterThanOrEqual(2);
      expect(page.lastVerified, `${page.path} lastVerified`).toMatch(datePattern);
      expect(["official", "community", "unverified", "editorial"]).toContain(page.evidence);
      if (page.status === "draft" || page.evidence === "unverified") {
        expect(page.indexable, `${page.path} draft/unverified indexability`).toBe(false);
      }
      if (page.indexable) {
        expect(page.status, `${page.path} indexable status`).not.toBe("draft");
        expect(page.evidence, `${page.path} indexable evidence`).not.toBe("unverified");
      }
    }
  });


  it("keeps the game entity and route intent aligned in every Title and H1", () => {
    for (const page of contentPages) {
      const title = page.title.toLowerCase();
      const h1 = page.h1.toLowerCase();
      const intentTerms = intentTermsByPath[page.path];

      expect(title, `${page.path} title entity`).toContain(entityKeyword);
      expect(h1, `${page.path} h1 entity`).toContain(entityKeyword);
      expect(intentTerms, `${page.path} intent mapping`).toBeDefined();

      for (const term of intentTerms ?? []) {
        expect(title, `${page.path} title intent: ${term}`).toContain(term);
        expect(h1, `${page.path} h1 intent: ${term}`).toContain(term);
      }
    }
  });

  it("separates verification provenance without removing synthesis pages from search", () => {
    const verificationOf = (path: string) =>
      contentPages.find((entry) => entry.path === path)!.verification;

    expect(verificationOf("/classes")).toBe("official-verified");
    expect(verificationOf("/classes/tier-list")).toBe(
      "source-verified-synthesis",
    );
    expect(verificationOf("/performance/pc")).toBe("needs-retest");
    expect(verificationOf("/performance/steam-deck")).toBe("needs-retest");

    for (const path of [
      "/classes/tier-list",
      "/builds/hawks",
      "/performance/pc",
      "/performance/steam-deck",
    ]) {
      expect(
        contentPages.find((entry) => entry.path === path)?.indexable,
        `${path} remains indexable`,
      ).toBe(true);
    }
  });
});
