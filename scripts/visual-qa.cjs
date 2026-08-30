const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const output = path.resolve("artifacts/screenshots");
fs.mkdirSync(output, { recursive: true });

const routes = [
  ["home", "/"],
  ["classes", "/classes"],
  ["hawks", "/builds/hawks"],
  ["performance", "/performance/pc"],
  ["worth-it", "/worth-it"],
  ["trophies", "/trophy-guide"],
];

const errors = [];
const captures = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const [mode, viewport] of [
      ["desktop", { width: 1440, height: 1000 }],
      ["mobile", { width: 390, height: 844 }],
    ]) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`console:${message.text()}`);
      });
      page.on("pageerror", (error) => errors.push(`pageerror:${error.message}`));

      for (const [name, route] of routes) {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        if (!response || response.status() !== 200) throw new Error(`${route} did not return 200`);
        if ((await page.locator("h1").count()) !== 1) throw new Error(`${route} does not have exactly one H1`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 1) throw new Error(`${route} overflows viewport by ${overflow}px in ${mode}`);
        const screenshot = path.join(output, `${name}-${mode}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        captures.push(screenshot);
      }

      await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
      await page.locator('button[aria-haspopup="dialog"]').click();
      const input = page.getByRole("textbox", { name: /search site content/i });
      await input.fill("Hawks");
      if ((await page.locator('a[href="/builds/hawks"]').count()) === 0) {
        throw new Error("Search did not return the Hawks build route");
      }
      await page.keyboard.press("Escape");

      if (mode === "mobile") {
        await page.getByRole("button", { name: "Open mobile navigation" }).click();
        await page.locator("#mobile-navigation").waitFor({ state: "visible" });
        await page.keyboard.press("Escape");
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

if (errors.length) throw new Error(`Browser errors detected:\n${errors.join("\n")}`);

console.log(JSON.stringify({ captures, consoleErrors: errors.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
