import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "../src/app/layout";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-sans" }),
  JetBrains_Mono: () => ({ variable: "font-mono" }),
  Orbitron: () => ({ variable: "font-display" }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("site analytics", () => {
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
});
