import { contentPageByPath } from "../content/pages";
import type { ContentPage } from "../content/types";

export function getHeadingId(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getRelatedPages(page: ContentPage): ContentPage[] {
  return page.related.flatMap((path) => {
    const related = contentPageByPath.get(path);
    return related && related.path !== page.path ? [related] : [];
  });
}

export function getParentPage(page: ContentPage): ContentPage | undefined {
  const firstSegment = page.path.split("/").filter(Boolean)[0];
  if (!firstSegment || page.path === `/${firstSegment}`) return undefined;
  return contentPageByPath.get(`/${firstSegment}`);
}
