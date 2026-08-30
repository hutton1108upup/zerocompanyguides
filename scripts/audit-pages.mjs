const baseUrl = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#x2F;", "/");
const matchOne = (html, pattern) => decode(html.match(pattern)?.[1]?.trim() ?? "");
const findTagAttribute = (html, tagPattern, attribute) => {
  const tag = html.match(tagPattern)?.[0] ?? "";
  return decode(tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1] ?? "");
};

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`sitemap.xml returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

if (sitemapUrls.length !== 22) {
  throw new Error(`Expected 22 sitemap URLs, received ${sitemapUrls.length}`);
}

const results = [];
const discoveredLinks = new Set();

for (const sitemapUrl of sitemapUrls) {
  const path = new URL(sitemapUrl).pathname;
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const title = matchOne(html, /<title>(.*?)<\/title>/is);
  const description = findTagAttribute(html, /<meta[^>]+name=["']description["'][^>]*>/is, "content");
  const canonical = findTagAttribute(html, /<link[^>]+rel=["']canonical["'][^>]*>/is, "href");
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const hasNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

  if (response.status !== 200) throw new Error(`${path} returned ${response.status}`);
  if (!title) throw new Error(`${path} has no title`);
  if (description.length < 70) throw new Error(`${path} has a short or missing description`);
  if (new URL(canonical).pathname !== path) throw new Error(`${path} canonical mismatch: ${canonical}`);
  if (h1Count !== 1) throw new Error(`${path} has ${h1Count} H1 elements`);
  if (hasNoindex) throw new Error(`${path} unexpectedly contains noindex`);

  for (const linkMatch of html.matchAll(/href="(\/[^"]*)"/g)) {
    const linkPath = linkMatch[1].split("#")[0].split("?")[0];
    if (linkPath && !linkPath.startsWith("//")) discoveredLinks.add(linkPath);
  }

  results.push({ path, status: response.status, title, canonical, h1Count });
}

for (const path of discoveredLinks) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  if (response.status >= 400) throw new Error(`Internal link ${path} returned ${response.status}`);
}

console.log(JSON.stringify({ auditedPages: results.length, internalLinks: discoveredLinks.size, results }, null, 2));
