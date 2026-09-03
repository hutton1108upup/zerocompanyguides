import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseSitemapUrls,
  validateIndexablePage,
  validateReviewPage,
} from "../scripts/audit-pages.mjs";

const scriptPath = fileURLToPath(new URL("../scripts/audit-pages.mjs", import.meta.url));
const missingManifestPath = join(tmpdir(), "zero-company-audit-test-manifest-do-not-create.json");
const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) => new Promise<void>((resolve) => server.close(() => resolve())),
    ),
  );
});

const pageHtml = ({
  robots,
  canonical = "https://example.test/guide",
}: {
  robots: string;
  canonical?: string;
}) => `
  <html>
    <head>
      <title>Example guide</title>
      <meta
        name="description"
        content="A sufficiently long description that explains what this page helps the player accomplish in the game today."
      >
      <meta name="robots" content="${robots}">
      <link rel="canonical" href="${canonical}">
    </head>
    <body><main><h1>Example guide</h1></main></body>
  </html>
`;

function runAudit(
  baseUrl: string,
  extraEnv: Record<string, string> = {},
) {
  return new Promise<{
    code: number | null;
    stdout: string;
    stderr: string;
  }>((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      env: {
        ...process.env,
        BASE_URL: baseUrl,
        ROUTE_MANIFEST: missingManifestPath,
        ...extraEnv,
      },
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

describe("runtime sitemap audit", () => {
  it("accepts any non-empty unique sitemap instead of a fixed page count", () => {
    expect(
      parseSitemapUrls([
        "<loc>https://example.test/</loc>",
        "<loc>https://example.test/guide</loc>",
      ].join("")),
    ).toEqual([
      "https://example.test/",
      "https://example.test/guide",
    ]);

    expect(() =>
      parseSitemapUrls(
        "<loc>https://example.test/guide</loc><loc>https://example.test/guide</loc>",
      ),
    ).toThrow("duplicate URLs");

    expect(() => parseSitemapUrls("")).toThrow("contains no URLs");
  });

  it("validates indexable and review page robots rules", () => {
    expect(() =>
      validateIndexablePage(
        "/guide",
        pageHtml({ robots: "index, follow" }),
        new Set(["/guide"]),
      ),
    ).not.toThrow();

    expect(() =>
      validateIndexablePage(
        "/guide",
        pageHtml({ robots: "noindex, follow" }),
        new Set(["/guide"]),
      ),
    ).toThrow("unexpectedly contains noindex");

    expect(() =>
      validateReviewPage(
        "/draft-guide",
        pageHtml({
          robots: "noindex, follow",
          canonical: "https://example.test/draft-guide",
        }),
        new Set(["/guide"]),
      ),
    ).not.toThrow();

    expect(() =>
      validateReviewPage(
        "/draft-guide",
        pageHtml({
          robots: "index, follow",
          canonical: "https://example.test/draft-guide",
        }),
        new Set(["/guide"]),
      ),
    ).toThrow("must contain noindex");
  });

  it("runs the real audit script without a hard-coded sitemap count", async () => {
    const sitemapPaths = ["/", "/alpha", "/beta"];
    const reviewPath = "/review";

    const server = createServer((request, response) => {
      const requestedPath = new URL(
        request.url ?? "/",
        "http://fixture.test",
      ).pathname;

      if (requestedPath === "/sitemap.xml") {
        response.setHeader("content-type", "application/xml");
        response.end(
          `<urlset>${sitemapPaths
            .map((path) => `<url><loc>https://fixture.test${path}</loc></url>`)
            .join("")}</urlset>`,
        );
        return;
      }

      const isIndexable = sitemapPaths.includes(requestedPath);
      const robots = isIndexable ? "index, follow" : "noindex, follow";

      response.setHeader("content-type", "text/html");
      response.end(`
        <!doctype html>
        <html>
          <head>
            <title>Fixture page ${requestedPath}</title>
            <meta
              name="description"
              content="A fixture description long enough to exercise the real route audit without relying on a hard-coded route total."
            >
            <meta name="robots" content="${robots}">
            <link
              rel="canonical"
              href="https://fixture.test${requestedPath}"
            >
          </head>
          <body>
            <h1>Fixture ${requestedPath}</h1>
            <a href="/alpha">Alpha</a>
            <a href="/beta">Beta</a>
          </body>
        </html>
      `);
    });

    servers.push(server);

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Expected a TCP test server");
    }

    const result = await runAudit(
      `http://127.0.0.1:${address.port}`,
      { REVIEW_PATHS: reviewPath },
    );

    expect(result.code, result.stderr).toBe(0);

    const report = JSON.parse(result.stdout);

    expect(report.auditedPages).toBe(3);
    expect(report.reviewPages).toBe(1);
    expect(report.reviewResults[0]).toMatchObject({
      path: reviewPath,
      robots: "noindex, follow",
    });
  });
});