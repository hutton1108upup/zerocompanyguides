import { describe, expect, it } from "vitest";
import { contentPages, requiredPublicPaths } from "../src/content/pages";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

describe("content registry", () => {
  it("contains every approved P0 route exactly once", () => {
    const paths = contentPages.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect([...paths].sort()).toEqual([...requiredPublicPaths].sort());
  });

  it("publishes complete, sourced metadata for every route", () => {
    for (const page of contentPages) {
      expect(page.title.length, `${page.path} title`).toBeGreaterThan(20);
      expect(page.description.length, `${page.path} description`).toBeGreaterThan(70);
      expect(page.h1.length, `${page.path} h1`).toBeGreaterThan(8);
      expect(page.sources.length, `${page.path} sources`).toBeGreaterThan(0);
      expect(page.related.length, `${page.path} related`).toBeGreaterThanOrEqual(2);
      expect(page.lastVerified, `${page.path} lastVerified`).toMatch(datePattern);
      expect(["official", "community", "unverified"]).toContain(page.evidence);
      if (page.status === "draft" || page.evidence === "unverified") {
        expect(page.indexable, `${page.path} draft/unverified indexability`).toBe(false);
      }
      if (page.indexable) {
        expect(page.status, `${page.path} indexable status`).not.toBe("draft");
        expect(page.evidence, `${page.path} indexable evidence`).not.toBe("unverified");
      }
    }
  });

  it("separates verification provenance without removing synthesis pages from search", () => {
    const verificationOf = (path: string) =>
      contentPages.find((entry) => entry.path === path)!.verification;

    expect(verificationOf("/classes")).toBe("official-verified");
    expect(verificationOf("/classes/tier-list")).toBe("source-verified-synthesis");
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
