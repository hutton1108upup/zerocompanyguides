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

  it("does not emit the Microsoft Clarity loader before consent", () => {
    const markup = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Analytics test page"),
      ),
    );

    expect(markup).not.toContain('id="microsoft-clarity"');
    expect(markup).not.toContain("https://www.clarity.ms/tag/");
    expect(markup).toContain("Accept analytics");
  });

  it("does not emit the Google Analytics tag before consent", () => {
    const markup = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Analytics test page"),
      ),
    );

    expect(markup).not.toContain('id="google-analytics-loader"');
    expect(markup).not.toContain(
      "https://www.googletagmanager.com/gtag/js?id=G-V8KC7HD1PW",
    );
    expect(markup).not.toContain('id="google-analytics-bootstrap"');
    expect(markup).toContain("Reject analytics");
  });

  it("emits both advertising loaders and the native banner container on every page", () => {
    const markup = renderToStaticMarkup(
      createElement(
        RootLayout,
        null,
        createElement("main", null, "Advertising test page"),
      ),
    );

    expect(markup).toContain('id="profitablerate-popunder"');
    expect(markup).toContain(
      "https://pl31426954.profitableratecpmnetwork.com/04/b3/48/04b348dffa1f19e7124eacf90c1414a4.js",
    );
    expect(markup).toContain('id="profitablerate-native-banner"');
    expect(markup).toContain('async=""');
    expect(markup).toContain('data-cfasync="false"');
    expect(markup).toContain(
      "https://pl31426956.profitableratecpmnetwork.com/96272942accec8aba062ea528ff5e99c/invoke.js",
    );
    expect(markup).toContain(
      'id="container-96272942accec8aba062ea528ff5e99c"',
    );
  });
});
