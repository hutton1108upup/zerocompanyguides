import { resolveSources } from "../content/sources";
import type { ContentPage, FaqBlock, VideoBlock } from "../content/types";
import {
  buildCanonicalUrl,
  getBreadcrumbPages,
  siteAlternateNames,
  siteName,
  siteOrigin,
} from "./site";

export type StructuredDataNode =
  | WebSiteStructuredData
  | CollectionOrArticleStructuredData
  | BreadcrumbListStructuredData
  | FaqPageStructuredData
  | VideoObjectStructuredData;

type OrganizationStructuredData = {
  "@type": "Organization";
  name: string;
  url: string;
};

type WebSiteRefStructuredData = {
  "@type": "WebSite";
  name: string;
  url: string;
};

type ListItemStructuredData = {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
};

export type WebSiteStructuredData = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  alternateName: string[];
  description: string;
  url: string;
  inLanguage: "en";
  publisher: OrganizationStructuredData;
};

export type BreadcrumbListStructuredData = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: ListItemStructuredData[];
};

type AnswerStructuredData = {
  "@type": "Answer";
  text: string;
};

type QuestionStructuredData = {
  "@type": "Question";
  name: string;
  acceptedAnswer: AnswerStructuredData;
};

export type FaqPageStructuredData = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: QuestionStructuredData[];
};

export type VideoObjectStructuredData = {
  "@context": "https://schema.org";
  "@type": "VideoObject";
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
  contentUrl: string;
  isAccessibleForFree: true;
  publisher: OrganizationStructuredData;
};

export type CollectionOrArticleStructuredData = {
  "@context": "https://schema.org";
  "@type": "CollectionPage" | "Article";
  name: string;
  headline: string;
  description: string;
  url: string;
  dateModified: string;
  isPartOf: WebSiteRefStructuredData;
  citation: string[];
};

function getFaqBlock(page: ContentPage): FaqBlock | undefined {
  return page.blocks.find((block): block is FaqBlock => block.type === "faq");
}

function getVideoBlocks(page: ContentPage): VideoBlock[] {
  return page.blocks.filter((block): block is VideoBlock => block.type === "video");
}

function toIsoDuration(duration: string): string {
  const parts = duration.split(":").map(Number);
  const [hours, minutes, seconds] = parts.length === 3
    ? parts
    : [0, parts[0], parts[1]];

  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds ? `${seconds}S` : ""}`;
}

function getPageSchemaType(page: ContentPage): "CollectionPage" | "Article" {
  return page.pageType === "home" || page.pageType === "hub" ? "CollectionPage" : "Article";
}

export function buildSiteStructuredData(page: ContentPage): WebSiteStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: [...siteAlternateNames],
    description: page.description,
    url: buildCanonicalUrl(page.path),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteOrigin,
    },
  };
}

export function buildBreadcrumbStructuredData(page: ContentPage): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: getBreadcrumbPages(page).map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.navLabel,
      item: buildCanonicalUrl(crumb.path),
    })),
  };
}

export function buildFaqStructuredData(page: ContentPage): FaqPageStructuredData | undefined {
  const faq = getFaqBlock(page);
  if (!faq) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildPageStructuredData(page: ContentPage): {
  page: CollectionOrArticleStructuredData;
  breadcrumb: BreadcrumbListStructuredData;
  faq?: FaqPageStructuredData;
  videos?: VideoObjectStructuredData[];
} {
  const pageSources = resolveSources(page.sources);
  const structuredPage: CollectionOrArticleStructuredData = {
    "@context": "https://schema.org",
    "@type": getPageSchemaType(page),
    name: page.title,
    headline: page.h1,
    description: page.description,
    url: buildCanonicalUrl(page.path),
    dateModified: page.lastVerified,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteOrigin,
    },
    citation: pageSources.map((source) => source.url),
  };

  const faq = buildFaqStructuredData(page);
  const videos = getVideoBlocks(page).map<VideoObjectStructuredData>((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: `${siteOrigin}${video.posterSrc}`,
    uploadDate: video.publishedAt,
    duration: toIsoDuration(video.duration),
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: video.publisher,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
    },
  }));

  return {
    page: structuredPage,
    breadcrumb: buildBreadcrumbStructuredData(page),
    ...(faq ? { faq } : {}),
    ...(videos.length ? { videos } : {}),
  };
}

export function buildStructuredDataNodes(page: ContentPage): StructuredDataNode[] {
  const pageGraph = buildPageStructuredData(page);
  return [
    pageGraph.page,
    pageGraph.breadcrumb,
    ...(pageGraph.faq ? [pageGraph.faq] : []),
    ...(pageGraph.videos ?? []),
  ];
}
