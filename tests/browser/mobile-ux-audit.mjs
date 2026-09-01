import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const runtimePackage =
  "C:\\Users\\胡天天\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\playwright\\package.json";
const runtimeRequire = createRequire(pathToFileURL(runtimePackage));
const { chromium } = runtimeRequire("playwright");

const baseUrl = process.env.TEST_BASE ?? "http://127.0.0.1:3000";
const tableRoutes = [
  "/classes",
  "/classes/tier-list",
  "/builds/hawks",
  "/builds/best-team",
  "/guides/respec",
  "/walkthrough",
  "/trophy-guide",
  "/performance/pc",
  "/performance/fps-fix",
  "/game-info",
  "/system-requirements",
  "/weapons",
  "/characters",
  "/characters/companions",
  "/characters/voice-cast",
  "/guides/beginners-guide",
  "/guides/permadeath",
  "/performance/steam-deck",
  "/mods",
  "/walkthrough/in-debt-to-the-hutts",
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertArticleFits(page, route) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  invariant(response?.status() === 200, `${route}: expected HTTP 200`);
  await page.locator("h1").waitFor({ state: "visible" });

  const geometry = await page.evaluate(() => {
    const article = document.querySelector(".article-body")?.getBoundingClientRect();
    const layout = document.querySelector(".article-layout")?.getBoundingClientRect();
    const tables = Array.from(document.querySelectorAll(".table-wrap")).map((table) => {
      const rect = table.getBoundingClientRect();
      return {
        right: rect.right,
        width: rect.width,
        clientWidth: table.clientWidth,
        scrollWidth: table.scrollWidth,
      };
    });
    const cardCaptions = Array.from(document.querySelectorAll(".table-wrap--cards")).map((table) => ({
      captionWidth: table.querySelector("caption")?.getBoundingClientRect().width ?? 0,
      tableWidth: table.getBoundingClientRect().width,
    }));
    return {
      articleWidth: article?.width ?? 0,
      layoutWidth: layout?.width ?? 0,
      viewportWidth: document.documentElement.clientWidth,
      tables,
      cardCaptions,
    };
  });

  invariant(
    geometry.articleWidth <= geometry.layoutWidth + 1,
    `${route}: article ${geometry.articleWidth}px exceeds layout ${geometry.layoutWidth}px`,
  );
  for (const [index, table] of geometry.tables.entries()) {
    invariant(
      table.right <= geometry.viewportWidth + 1,
      `${route}: table ${index} extends beyond the viewport`,
    );
    invariant(
      table.width <= geometry.layoutWidth + 1,
      `${route}: table ${index} exceeds the article layout`,
    );
  }
  for (const [index, caption] of geometry.cardCaptions.entries()) {
    invariant(
      caption.captionWidth >= caption.tableWidth - 2,
      `${route}: card-table caption ${index} is ${caption.captionWidth}px inside a ${caption.tableWidth}px table region`,
    );
  }
}

async function assertPageFitsViewport(page, route) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  invariant(response?.ok(), `${route} did not return a successful response`);
  const geometry = await page.evaluate(() => ({
    layoutWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  invariant(
    geometry.scrollWidth <= geometry.layoutWidth + 1,
    `${route}: document ${geometry.scrollWidth}px exceeds viewport ${geometry.layoutWidth}px`,
  );
}

async function assertSearchDialog(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const trigger = page.getByRole("button", { name: "Search site content" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Popular verified routes" });
  await dialog.waitFor({ state: "visible" });

  const geometry = await page.evaluate(() => {
    const overlay = document.querySelector(".search-overlay")?.getBoundingClientRect();
    const panel = document.querySelector(".search-panel")?.getBoundingClientRect();
    const outside = document.elementFromPoint(5, Math.min(200, innerHeight - 5));
    const firstResult = document.querySelector(".search-result")?.getBoundingClientRect();
    const panelCenter = panel
      ? document.elementFromPoint(panel.left + panel.width / 2, panel.top + panel.height / 2)
      : null;
    return {
      overlayHeight: overlay?.height ?? 0,
      panelTop: panel?.top ?? 0,
      panelLeft: panel?.left ?? 0,
      panelRight: panel?.right ?? 0,
      panelBottom: panel?.bottom ?? 0,
      panelWidth: panel?.width ?? 0,
      panelHeight: panel?.height ?? 0,
      viewportHeight: innerHeight,
      viewportWidth: innerWidth,
      outsideInsideOverlay: Boolean(outside?.closest(".search-overlay")),
      panelIsTopLayer: Boolean(panelCenter?.closest(".search-panel")),
      firstResultHeight: firstResult?.height ?? 0,
    };
  });

  invariant(
    geometry.overlayHeight >= geometry.viewportHeight,
    `search overlay ${geometry.overlayHeight}px does not cover ${geometry.viewportHeight}px viewport`,
  );
  invariant(geometry.panelWidth > 0 && geometry.panelHeight > 0, "search panel has no usable size");
  invariant(geometry.panelTop >= 0 && geometry.panelLeft >= 0, "search panel begins outside viewport");
  invariant(geometry.panelRight <= geometry.viewportWidth + 1, "search panel exceeds viewport width");
  invariant(geometry.panelBottom <= geometry.viewportHeight + 1, "search panel exceeds viewport");
  invariant(geometry.panelIsTopLayer, "search backdrop visually covers the search panel");
  invariant(geometry.outsideInsideOverlay, "search backdrop does not block the underlying page");
  invariant(geometry.firstResultHeight <= 180, "mobile search result is too tall");

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    invariant(
      await page.evaluate(() => Boolean(document.activeElement?.closest(".search-panel"))),
      `search focus escaped after ${index + 1} tabs`,
    );
  }

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.activeElement?.matches(".search-trigger"));
  invariant(
    await trigger.evaluate((node) => node === document.activeElement),
    "search focus did not return to its trigger",
  );
}

async function assertDrawerDialog(page) {
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const trigger = page.getByRole("button", { name: "Open mobile navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site navigation" });
  await dialog.waitFor({ state: "visible" });
  invariant(await dialog.locator(".mobile-drawer__link").count() === 24, "drawer must retain all 24 links");
  invariant(
    await dialog.locator(".mobile-drawer__header").evaluate((node) => getComputedStyle(node).position === "sticky"),
    "drawer header should remain visible while scrolling",
  );
  invariant(
    await page.evaluate(() => Boolean(document.activeElement?.closest(".mobile-drawer"))),
    "drawer should move focus inside on open",
  );

  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press("Tab");
    invariant(
      await page.evaluate(() => Boolean(document.activeElement?.closest(".mobile-drawer"))),
      `drawer focus escaped after ${index + 1} tabs`,
    );
  }

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await page.waitForFunction(() => document.activeElement?.matches(".drawer-toggle"));
  invariant(
    await trigger.evaluate((node) => node === document.activeElement),
    "drawer focus did not return to its trigger",
  );
}

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

try {
  const portrait = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await portrait.newPage();

  for (const route of tableRoutes) await assertArticleFits(page, route);

  await page.goto(`${baseUrl}/guides/beginners-guide`, { waitUntil: "domcontentloaded" });
  invariant(await page.locator(".mobile-toc").isVisible(), "long pages need a visible mobile TOC");
  invariant(await page.locator(".mobile-toc a").count() > 1, "mobile TOC should expose section anchors");
  invariant(
    await page.evaluate(() => {
      const related = document.querySelector(".related-panel");
      const sources = document.querySelector(".sources-panel");
      return Boolean(
        related &&
          sources &&
          related.compareDocumentPosition(sources) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
    "related routes should appear before the source ledger",
  );

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const homeMetrics = await page.evaluate(() => ({
    heroHeight: document.querySelector(".hero-shell")?.getBoundingClientRect().height ?? 0,
    footerHeight: document.querySelector("footer")?.getBoundingClientRect().height ?? 0,
    shortTargets: Array.from(
      document.querySelectorAll(".hub-card__list-link, .hub-card__action, .text-link"),
    )
      .filter((node) => getComputedStyle(node).display !== "none")
      .map((node) => node.getBoundingClientRect().height)
      .filter((height) => height < 44),
  }));
  invariant(homeMetrics.heroHeight <= 1150, `mobile hero remains ${homeMetrics.heroHeight}px tall`);
  invariant(homeMetrics.footerHeight <= 800, `mobile footer remains ${homeMetrics.footerHeight}px tall`);
  invariant(homeMetrics.shortTargets.length === 0, "standalone homepage targets must be at least 44px tall");

  await assertSearchDialog(page);
  await assertDrawerDialog(page);
  await portrait.close();

  const responsiveViewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 812, height: 375 },
    { width: 1024, height: 768 },
  ];

  for (const viewport of responsiveViewports) {
    const context = await browser.newContext({ viewport });
    const responsivePage = await context.newPage();
    await assertPageFitsViewport(responsivePage, "/");
    await assertPageFitsViewport(responsivePage, "/system-requirements");
    if (viewport.width === 812 && viewport.height === 375) {
      await assertSearchDialog(responsivePage);
    }
    await context.close();
  }

  process.stdout.write(`PASS routes=${tableRoutes.length} viewports=${responsiveViewports.length + 1}\n`);
} finally {
  await browser.close();
}
