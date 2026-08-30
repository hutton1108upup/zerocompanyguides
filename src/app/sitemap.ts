import type { MetadataRoute } from "next";
import { indexableContentPages, buildCanonicalUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableContentPages.map((page) => ({
    url: buildCanonicalUrl(page.path),
    lastModified: page.lastVerified,
  }));
}
