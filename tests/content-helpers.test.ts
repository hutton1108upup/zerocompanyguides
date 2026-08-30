import { describe, expect, it } from "vitest";
import { getContentPage } from "../src/content/pages";
import { getHeadingId, getParentPage, getRelatedPages } from "../src/lib/content";

describe("content helpers", () => {
  it("creates stable human-readable heading ids", () => {
    expect(getHeadingId("Best Class: Hawks & the Squad")).toBe("best-class-hawks-the-squad");
  });

  it("resolves every related page without leaking the current page", () => {
    const page = getContentPage("/builds/hawks");
    expect(page).toBeDefined();
    const related = getRelatedPages(page!);
    expect(related).toHaveLength(page!.related.length);
    expect(related.every((entry) => entry.path !== page!.path)).toBe(true);
  });

  it("uses the canonical hub label for visible breadcrumbs", () => {
    const page = getContentPage("/builds/hawks");
    expect(getParentPage(page!)?.navLabel).toBe("Builds");
  });
});
