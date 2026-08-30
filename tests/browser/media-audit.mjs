import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimePackage = "C:\\Users\\胡天天\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright\\package.json";
const runtimeRequire = createRequire(pathToFileURL(runtimePackage));
const { chromium } = runtimeRequire("playwright");

const baseUrl = "http://127.0.0.1:3000";
const routes = [
  "/",
  "/classes",
  "/classes/tier-list",
  "/builds",
  "/builds/hawks",
  "/builds/best-team",
  "/guides",
  "/guides/respec",
  "/walkthrough",
  "/trophy-guide",
  "/performance",
  "/performance/pc",
  "/performance/fps-fix",
  "/game-info",
  "/system-requirements",
  "/multiplayer",
  "/characters",
  "/characters/voice-cast",
  "/guides/beginners-guide",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
];

const imageRoutes = new Set(routes.filter((route) => route !== "/trophy-guide"));
const videoRoutes = new Set([
  "/",
  "/classes",
  "/classes/tier-list",
  "/builds/best-team",
  "/guides",
  "/walkthrough",
  "/performance",
  "/performance/pc",
  "/game-info",
  "/guides/beginners-guide",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
]);

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertRoute(page, route) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor({ state: "visible" });
  invariant(response?.status() === 200, `${route}: expected HTTP 200`);
  invariant(await page.locator("h1").count() === 1, `${route}: expected one H1`);

  const imageCount = await page.locator(".media-plate").count();
  const videoCount = await page.locator(".video-brief").count();
  invariant(
    (imageCount > 0) === imageRoutes.has(route),
    `${route}: image coverage expected=${imageRoutes.has(route)} actual=${imageCount} url=${page.url()}`,
  );
  invariant(
    (videoCount > 0) === videoRoutes.has(route),
    `${route}: video coverage expected=${videoRoutes.has(route)} actual=${videoCount} url=${page.url()}`,
  );
  invariant(videoCount <= 1, `${route}: video density`);
  invariant(await page.locator('iframe[src*="youtube"]').count() === 0, `${route}: eager YouTube iframe`);

  const images = page.locator(".media-plate img");
  for (let index = 0; index < await images.count(); index += 1) {
    const image = images.nth(index);
    invariant(Boolean(await image.getAttribute("alt")), `${route}: missing image alt`);
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(async (node) => {
      if (!node.complete) {
        await new Promise((resolve, reject) => {
          node.addEventListener("load", resolve, { once: true });
          node.addEventListener("error", reject, { once: true });
        });
      }
      await node.decode();
    });
    invariant(
      await image.evaluate((node) => node.complete && node.naturalWidth > 0),
      `${route}: broken image ${index}`,
    );
  }
}

const artifactDir = path.join(process.cwd(), "artifacts", "media-review");
await mkdir(artifactDir, { recursive: true });

const consoleErrors = [];
const pageErrors = [];
const failedResponses = [];
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await desktop.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      const location = message.location();
      consoleErrors.push(`${message.text()} @ ${location.url || "unknown"}:${location.lineNumber ?? 0}`);
    }
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  for (const route of routes) await assertRoute(page, route);

  await page.goto(`${baseUrl}/guides`, { waitUntil: "domcontentloaded" });
  await page.locator(".video-brief__poster").waitFor({ state: "visible" });
  await page.getByRole("button", { name: /Load video:/ }).click();
  const iframe = page.locator('iframe[src*="youtube-nocookie.com"]');
  await iframe.waitFor({ state: "visible" });
  const iframeUrl = new URL(await iframe.getAttribute("src"));
  invariant(iframeUrl.hostname === "www.youtube-nocookie.com", "video must use privacy-enhanced YouTube host");

  for (const [route, filename] of [
    ["/", "home-desktop.png"],
    ["/classes", "classes-desktop.png"],
    ["/performance/pc", "performance-pc-desktop.png"],
  ]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").waitFor({ state: "visible" });
    await page.screenshot({ path: path.join(artifactDir, filename), fullPage: true });
  }
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseUrl}/mods`, { waitUntil: "domcontentloaded" });
  await mobilePage.locator(".media-plate").waitFor({ state: "visible" });
  await mobilePage.screenshot({ path: path.join(artifactDir, "mods-mobile.png"), fullPage: true });
  invariant(
    await mobilePage.locator(".media-plate img").evaluate((node) => node.complete && node.naturalWidth > 0),
    "/mods: mobile image failed",
  );
  await mobile.close();

  invariant(pageErrors.length === 0, `Page errors: ${pageErrors.join(" | ")}`);
  invariant(
    consoleErrors.length === 0,
    `Console errors: ${consoleErrors.join(" | ")} | Failed responses: ${failedResponses.join(" | ")}`,
  );
  process.stdout.write(`PASS routes=${routes.length} images=${imageRoutes.size} videos=${videoRoutes.size} screenshots=4\n`);
} finally {
  await browser.close();
}
