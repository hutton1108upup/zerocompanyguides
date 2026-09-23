import type { Metadata } from "next";
import { contentPages } from "../content/pages";
import type { ContentPage } from "../content/types";

export const siteName = "Zero Company Intel";
export const siteAlternateNames = [
  "Star Wars Zero Company Wiki & Guide",
  "zerocompany-guides.wiki",
] as const;
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

export type NavigationLink = { href: string; label: string };
export type NavigationGroup = {
  id: string;
  label: string;
  path: string;
  links: readonly NavigationLink[];
};

export const navigationGroups: readonly NavigationGroup[] = [
  {
    id: "walkthrough", label: "Walkthrough", path: "/walkthrough",
    links: [
      { href: "/walkthrough#protection-application-credits-or-team-bond", label: "Protection Application" },
      { href: "/walkthrough/help-wanted", label: "Help Wanted" },
      { href: "/walkthrough/back-channels", label: "Back Channels" },
      { href: "/walkthrough/nebulous-pursuit", label: "Nebulous Pursuit" },
      { href: "/walkthrough/ship-adrift", label: "Ship Adrift" },
    ],
  },
  {
    id: "builds", label: "Builds & Gear", path: "/builds",
    links: [
      { href: "/builds/hawks", label: "Hawks Build" },
      { href: "/builds/best-team", label: "Best Team" },
      { href: "/classes/tier-list", label: "Class Tier List" },
      { href: "/classes", label: "Classes" },
      { href: "/weapons", label: "Weapons" },
      { href: "/characters", label: "Characters" },
      { href: "/characters/companions", label: "Companions" },
    ],
  },
  {
    id: "guides", label: "Guides", path: "/guides",
    links: [
      { href: "/guides/beginners-guide", label: "Beginner Guide" },
      { href: "/guides/permadeath", label: "Difficulty & Permadeath" },
      { href: "/guides/respec", label: "Respec" },
      { href: "/trophy-guide", label: "Trophies & Achievements" },
    ],
  },
  {
    id: "fixes", label: "Fixes", path: "/performance",
    links: [
      { href: "/performance/fps-fix", label: "FPS & Crash Fixes" },
      { href: "/performance/pc", label: "PC Settings" },
      { href: "/performance/steam-deck", label: "Steam Deck" },
      { href: "/mods", label: "Mods" },
    ],
  },
  {
    id: "game-info", label: "Game Info", path: "/game-info",
    links: [
      { href: "/system-requirements", label: "System Requirements" },
      { href: "/multiplayer", label: "Multiplayer & Co-op" },
      { href: "/worth-it", label: "Worth Buying?" },
    ],
  },
];

export const primaryNavigationPaths = navigationGroups.map((group) => group.path);
export const siteUtilityLinks = [
  { href: "/corrections", label: "Corrections" },
  { href: "/updates", label: "Site Updates" },
] as const;

export const footerNavigationSections = [
  { title: "Explore", paths: ["/walkthrough", "/builds", "/guides", "/performance"] },
  { title: "Game & Tools", paths: ["/game-info", "/system-requirements", "/worth-it", "/squad-builder"] },
  { title: "About", paths: ["/corrections", "/updates"] },
] as const;

export function getNavigationGroup(pathname: string): NavigationGroup | undefined {
  const path = pathname.split("#")[0].split("?")[0];
  return navigationGroups.find((group) =>
    [group.path, ...group.links.filter((link) => !link.href.includes("#")).map((link) => link.href)]
      .some((owner) => path === owner || path.startsWith(`${owner}/`)),
  );
}

export function getNavigationLabel(path: string): string {
  return navigationGroups.find((group) => group.path === path)?.label
    ?? contentPages.find((page) => page.path === path)?.navLabel
    ?? path;
}

export function getPublicNavigationGroups(): NavigationGroup[] {
  return navigationGroups.filter((group) => {
    const page = contentPages.find((entry) => entry.path === group.path);
    return page && isPublicIndexablePage(page);
  }).map((group) => ({
    ...group,
    links: group.links.filter((link) => {
      const page = contentPages.find((entry) => entry.path === link.href.split("#")[0]);
      return page && isPublicIndexablePage(page);
    }),
  }));
}

const pageByPath = new Map(contentPages.map((page) => [page.path, page]));

export function isPublicIndexablePage(
  page: Pick<ContentPage, "indexable" | "status">,
): boolean {
  return page.indexable && page.status !== "draft" && page.status !== "archived";
}

export const indexableContentPages = contentPages.filter(isPublicIndexablePage);

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
