import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout, { metadata } from "../src/app/layout";
import { siteName } from "../src/lib/site";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-sans" }),
  JetBrains_Mono: () => ({ variable: "font-mono" }),
  Orbitron: () => ({ variable: "font-display" }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("site analytics", () => {
  it("keeps page titles standalone instead of appending the branded site name twice", () => {
    expect(metadata.title).toBe(siteName);
  });

  it("emits the Microsoft Clarity loader on every page", () => {
    const markup = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Analytics test page"),
      ),
    );

    expect(markup).toContain('id="microsoft-clarity"');
    expect(markup).toContain("https://www.clarity.ms/tag/");
    expect(markup).toContain("yajf5sc56v");
  });

  it("emits the configured Google Analytics tag on every page", () => {
    const markup = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Analytics test page"),
      ),
    );

    expect(markup).toContain('id="google-analytics-loader"');
    expect(markup).toContain(
      "https://www.googletagmanager.com/gtag/js?id=G-V8KC7HD1PW",
    );
    expect(markup).toContain('id="google-analytics-bootstrap"');
    expect(markup).toContain("window.dataLayer = window.dataLayer || [];");
    expect(markup).toContain("gtag('config', 'G-V8KC7HD1PW');");
  });
});
