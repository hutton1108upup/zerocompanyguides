import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {},
}));

import { size as appleIconSize } from "../src/app/apple-icon";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

describe("metadata assets", () => {
  it("ships a valid multi-size favicon asset", () => {
    const faviconPath = fileURLToPath(
      new URL("../src/app/favicon.ico", import.meta.url),
    );
    const favicon = readFileSync(faviconPath);

    expect(statSync(faviconPath).size).toBeGreaterThan(100);
    expect([...favicon.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(favicon.readUInt16LE(4)).toBeGreaterThanOrEqual(2);
  });

  it("defines the Apple touch icon and linked web manifest", () => {
    expect(appleIconSize).toEqual({ width: 180, height: 180 });

    const manifest = JSON.parse(
      readFileSync(`${projectRoot}/public/site.webmanifest`, "utf8"),
    ) as { name: string; short_name: string; start_url: string; icons: unknown[] };

    expect(manifest).toMatchObject({
      name: "Star Wars Zero Company Intel",
      short_name: "Zero Company Intel",
      start_url: "/",
    });
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        { src: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
        { src: "/icon", sizes: "64x64", type: "image/png" },
        { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      ]),
    );
  });
});
