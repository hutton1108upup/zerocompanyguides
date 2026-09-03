import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const baseUrl = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const decode = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&#x2F;", "/")
  .replaceAll("&#x27;", "'");

const matchOne = (html, pattern) => decode(html.match(pattern)?.[1]?.trim() ?? "");

const getAttribute = (tag, attribute) => decode(
  tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, "i"))?.[1] ?? "",
);

const findTagAttribute = (html, tagPattern, attribute) => {
  const tag = html.match(tagPattern)?.[0] ?? "";
  return getAttribute(tag, attribute);
};

const findMetaContent = (html, name) => {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (getAttribute(tag, "name").toLowerCase() === name.toLowerCase()) {
      return getAttribute(tag, "content");
    }
  }
  return "";
};

export function parseSitemapUrls(sitemapXml) {
  const urls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]));

  if (urls.length === 0) throw new Error("sitemap.xml contains no URLs");
  if (new Set(urls).size !== urls.length) {
    throw new Error("sitemap.xml contains duplicate URLs");
  }

  return urls;
}

export function getPageSignals(html) {
  const canonical = findTagAttribute(html, /<link\b[^>]+rel=["']canonical["'][^>]*>/is, "href");

  return {
    title: matchOne(html, /<title>(.*?)<\/title>/is),
    description: findTagAttribute(html, /<meta\b[^>]+name=["']description["'][^>]*>/is, "content"),
    canonical,
    robots: findMetaContent(html, "robots"),
    h1Count: (html.match(/<h1(?:\s|>)/gi) ?? []).length,
    isHtml: /<html\b/i.test(html),
  };
}

function validatePageBasics(path, signals) {
  if (!signals.title) throw new Error(`${path} has no title`);
  if (signals.description.length < 70) throw new Error(`${path} has a short or missing description`);
  if (!signals.canonical) throw new Error(`${path} has no canonical URL`);
  if (new URL(signals.canonical).pathname !== path) {
    throw new Error(`${path} canonical mismatch: ${signals.canonical}`);
  }
  if (signals.h1Count !== 1) throw new Error(`${path} has ${signals.h1Count} H1 elements`);
}

export function validateIndexablePage(path, html, sitemapPaths) {
  const signals = getPageSignals(html);
  validatePageBasics(path, signals);

  if (!sitemapPaths.has(path)) throw new Error(`${path} is missing from sitemap.xml`);
  if (/\bnoindex\b/i.test(signals.robots)) {
    throw new Error(`${path} unexpectedly contains noindex`);
  }
}

export function validateReviewPage(path, html, sitemapPaths) {
  const signals = getPageSignals(html);
  validatePageBasics(path, signals);

  if (sitemapPaths.has(path)) throw new Error(`${path} review page must not be in sitemap.xml`);
  if (!/\bnoindex\b/i.test(signals.robots)) {
    throw new Error(`${path} review page must contain noindex`);
  }
}

function normalizePath(value) {
  return new URL(value, "https://audit.invalid").pathname;
}

export function parseReviewPaths(value = "") {
  return [...new Set(
    value.split(",").map((path) => path.trim()).filter(Boolean).map(normalizePath),
  )];
}

function collectInternalLinks(html, discoveredLinks) {
  for (const linkMatch of html.matchAll(/href=["'](\/[^"']*)["']/gi)) {
    const rawPath = linkMatch[1];
    if (rawPath.startsWith("//")) continue;
    const linkPath = normalizePath(rawPath);
    if (linkPath) discoveredLinks.add(linkPath);
  }
}

async function fetchPage(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return { response, html: await response.text() };
}

function signalsAreHtml(contentType, html) {
  return contentType.toLowerCase().includes("text/html") || /<html\b/i.test(html);
}

async function loadBuiltHtmlPaths() {
  const hostname = new URL(baseUrl).hostname;
  const isLocalAudit = hostname === "localhost" || hostname === "127.0.0.1";
  const manifestPath = process.env.ROUTE_MANIFEST || (isLocalAudit ? ".next/prerender-manifest.json" : "");
  if (!manifestPath) return [];

  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    return Object.entries(manifest.routes ?? {})
      .filter(([path, route]) => (
        route?.routeType === "page" &&
        (path === "/" || route.srcRoute === "/[...slug]")
      ))
      .map(([path]) => path);
  } catch {
    return [];
  }
}

async function main() {
  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`sitemap.xml returned ${sitemapResponse.status}`);

  const sitemapUrls = parseSitemapUrls(await sitemapResponse.text());
  const sitemapPaths = new Set(sitemapUrls.map((url) => new URL(url).pathname));
  const results = [];
  const discoveredLinks = new Set();
  const reviewPaths = new Set(parseReviewPaths(process.env.REVIEW_PATHS));
  const builtHtmlPaths = await loadBuiltHtmlPaths();

  for (const path of builtHtmlPaths) {
    if (!sitemapPaths.has(path)) reviewPaths.add(path);
  }

  for (const sitemapUrl of sitemapUrls) {
    const path = new URL(sitemapUrl).pathname;
    const { response, html } = await fetchPage(path);

    if (response.status !== 200) throw new Error(`${path} returned ${response.status}`);
    validateIndexablePage(path, html, sitemapPaths);
    collectInternalLinks(html, discoveredLinks);

    results.push({ path, status: response.status, ...getPageSignals(html) });
  }

  for (const path of discoveredLinks) {
    const { response, html } = await fetchPage(path);
    if (response.status >= 400) throw new Error(`Internal link ${path} returned ${response.status}`);

    const contentType = response.headers.get("content-type") ?? "";
    if (signalsAreHtml(contentType, html) && !sitemapPaths.has(path)) {
      reviewPaths.add(path);
    }
  }

  const reviewResults = [];
  for (const path of reviewPaths) {
    const { response, html } = await fetchPage(path);
    if (response.status !== 200) throw new Error(`${path} review page returned ${response.status}`);
    validateReviewPage(path, html, sitemapPaths);
    reviewResults.push({ path, status: response.status, ...getPageSignals(html) });
  }

  console.log(JSON.stringify({
    auditedPages: results.length,
    reviewPages: reviewResults.length,
    internalLinks: discoveredLinks.size,
    results,
    reviewResults,
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
