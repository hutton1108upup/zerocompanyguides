import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import {
  buildCanonicalUrl,
  getContentPageByPath,
  getContentPageBySlug,
  getInnerRouteParams,
  getMetadataForPath,
  toRouteSlug,
} from "../src/lib/site";

const innerPages = contentPages.filter((page) => page.path !== "/");

describe("static route generation", () => {
  it("generates params for every approved inner page exactly once", () => {
    const params = getInnerRouteParams();
    const actualPaths = params.map((entry) => `/${entry.slug.join("/")}`);
    const expectedPaths = innerPages.map((page) => page.path);

    expect(new Set(actualPaths).size).toBe(actualPaths.length);
    expect(actualPaths.sort()).toEqual(expectedPaths.sort());
  });

  it("resolves content pages from path and slug inputs", () => {
    for (const page of innerPages) {
      expect(getContentPageByPath(page.path)?.path).toBe(page.path);
      expect(getContentPageBySlug(toRouteSlug(page.path))?.path).toBe(page.path);
    }

    expect(getContentPageByPath("/wiki")).toBeUndefined();
    expect(getContentPageBySlug(["classes", "best"])).toBeUndefined();
  });

  it("builds unique metadata titles and self canonicals for inner pages", () => {
    const titles = new Set<string>();

    for (const page of innerPages) {
      const metadata = getMetadataForPath(page.path);

      expect(metadata).toBeDefined();
      expect(typeof metadata?.title).toBe("string");
      expect(metadata?.title).toBe(page.title);
      expect(metadata?.description).toBe(page.description);
      expect(metadata?.alternates?.canonical).toBe(buildCanonicalUrl(page.path));

      titles.add(String(metadata?.title));
    }

    expect(titles.size).toBe(innerPages.length);
  });
});
