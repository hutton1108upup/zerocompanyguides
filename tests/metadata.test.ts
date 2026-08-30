import { describe, expect, it, vi } from "vitest";
import { metadata } from "../src/app/layout";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "font-sans" }),
  JetBrains_Mono: () => ({ variable: "font-mono" }),
  Orbitron: () => ({ variable: "font-display" }),
}));

describe("site metadata", () => {
  it("uses the production origin as the metadata base", () => {
    expect(metadata.metadataBase?.toString()).toBe(
      "https://zerocompany-guides.wiki/",
    );
  });
});
