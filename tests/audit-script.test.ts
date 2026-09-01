import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(new URL("../scripts/audit-pages.mjs", import.meta.url));
const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

function runAudit(baseUrl: string) {
  return new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(process.execPath, [scriptPath], {
      env: { ...process.env, BASE_URL: baseUrl },
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

describe("route audit script", () => {
  it("audits every unique sitemap URL without a stale hard-coded route count", async () => {
    const paths = ["/", "/alpha", "/beta"];
    const server = createServer((request, response) => {
      if (request.url === "/sitemap.xml") {
        response.setHeader("content-type", "application/xml");
        response.end(`<urlset>${paths.map((path) => `<url><loc>https://fixture.test${path}</loc></url>`).join("")}</urlset>`);
        return;
      }

      const path = request.url ?? "/";
      response.setHeader("content-type", "text/html");
      response.end(`<!doctype html><html><head><title>Fixture page ${path}</title><meta name="description" content="A fixture description long enough to exercise the real route audit without relying on application mocks or a hard-coded route total."><link rel="canonical" href="https://fixture.test${path}"></head><body><h1>Fixture ${path}</h1><a href="/alpha">Alpha</a><a href="/beta">Beta</a></body></html>`);
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Expected a TCP test server");

    const result = await runAudit(`http://127.0.0.1:${address.port}`);

    expect(result.code, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).auditedPages).toBe(3);
  });
});
