import type { Metadata } from "next";
import { contentPages } from "../content/pages";
import type { ContentPage } from "../content/types";

export const siteName = "Star Wars Zero Company Wiki & Guide";
export const siteDescription =
  "Evidence-labeled Star Wars Zero Company builds, classes, walkthrough planning, trophies, performance fixes, characters and official game information.";
export const defaultSiteOrigin = "https://zerocompany-guides.wiki";

type OriginEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_ENV?: string;
};

export function resolveSiteOrigin(env?: OriginEnv): string {
  const sourceEnv = env ?? (process.env as OriginEnv);
  const configuredOrigin = sourceEnv.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

  if (configuredOrigin) {
    return configuredOrigin;
  }

  return defaultSiteOrigin;
}

export const siteOrigin = resolveSiteOrigin();

export const primaryNavigationPaths = [
  "/builds",
  "/classes",
  "/characters",
  "/walkthrough",
  "/trophy-guide",
  "/performance",
] as const;

export const footerNavigationSections = [
  {
    title: "Decide & Start",
    paths: [
      "/game-info",
      "/system-requirements",
      "/multiplayer",
      "/guides/beginners-guide",
      "/worth-it",
    ],
  },
  {
    title: "Strategy & Progression",
    paths: [
      "/classes",
      "/classes/tier-list",
      "/builds",
      "/builds/hawks",
      "/builds/best-team",
      "/guides",
      "/guides/respec",
      "/walkthrough",
      "/trophy-guide",
      "/characters",
      "/characters/voice-cast",
    ],
  },
  {
    title: "Tech & Extensions",
    paths: [
      "/performance",
      "/performance/pc",
      "/performance/fps-fix",
      "/performance/steam-deck",
      "/mods",
    ],
  },
] as const;

const pageByPath = new Map(contentPages.map((page) => [page.path, page]));

export const indexableContentPages = contentPages.filter((page) => page.indexable);

export function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  const normalized = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? normalized : normalized.toLowerCase();
}

export function buildCanonicalUrl(path: string): string {
  return `${siteOrigin}${normalizePath(path)}`;
}

export function toRouteSlug(path: string): string[] {
  const normalized = normalizePath(path);
  return normalized === "/" ? [] : normalized.slice(1).split("/");
}

export function fromRouteSlug(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) {
    return "/";
  }

  return normalizePath(slug.join("/"));
}

export function getContentPageByPath(path: string): ContentPage | undefined {
  return pageByPath.get(normalizePath(path));
}

export function getContentPageBySlug(slug: string[] | undefined): ContentPage | undefined {
  return getContentPageByPath(fromRouteSlug(slug));
}

export function getInnerRouteParams(): Array<{ slug: string[] }> {
  return contentPages
    .filter((page) => page.path !== "/")
    .map((page) => ({ slug: toRouteSlug(page.path) }));
}

export function getSearchPages(): ContentPage[] {
  return indexableContentPages.filter((page) => page.path !== "/");
}

export function getBreadcrumbPages(page: ContentPage): ContentPage[] {
  if (page.path === "/") {
    return [page];
  }

  const segments = toRouteSlug(page.path);
  const breadcrumbs: ContentPage[] = [contentPages[0]];

  if (segments.length > 1) {
    const parent = getContentPageByPath(`/${segments[0]}`);
    if (parent) {
      breadcrumbs.push(parent);
    }
  }

  breadcrumbs.push(page);
  return breadcrumbs;
}

export function getRobotsDirective(page: ContentPage): string {
  return page.indexable ? "index, follow" : "noindex, follow";
}

export function getMetadataForPath(path: string): Metadata | undefined {
  const page = getContentPageByPath(path);
  if (!page) {
    return undefined;
  }

  const canonical = buildCanonicalUrl(page.path);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: page.pageType === "home" || page.pageType === "hub" ? "website" : "article",
      title: page.title,
      description: page.description,
      url: canonical,
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: getRobotsDirective(page),
  };
}
