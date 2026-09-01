import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NotFound from "../src/app/not-found";

describe("not-found route", () => {
  it("offers useful recovery routes instead of a dead end", () => {
    const markup = renderToStaticMarkup(createElement(NotFound));

    expect(markup).toContain("Page not found");
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/builds"');
    expect(markup).toContain('href="/walkthrough"');
    expect(markup).toContain('href="/performance"');
  });

  it("publishes a descriptive metadata contract", async () => {
    const routeModule = await import("../src/app/not-found");

    expect(routeModule).toHaveProperty("metadata");
    expect(routeModule.metadata).toMatchObject({
      title: "Page not found | Zero Company Intel",
    });
  });
});
