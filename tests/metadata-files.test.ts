import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function readAsset(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url));
}

describe("metadata assets", () => {
  it("ships a valid multi-size favicon asset", () => {
    const favicon = readAsset("src/app/favicon.ico");

    expect([...favicon.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(favicon.readUInt16LE(4)).toBe(3);
    expect([favicon[6], favicon[22], favicon[38]]).toEqual([16, 32, 48]);
  });

  it.each([
    ["src/app/apple-icon.png", 180, 180],
    ["src/app/opengraph-image.png", 1200, 630],
    ["public/icon-192.png", 192, 192],
    ["public/icon-512.png", 512, 512],
  ])("ships %s as a PNG with the expected dimensions", (path, width, height) => {
    const png = readAsset(path);

    expect(png.readUInt32BE(0)).toBe(0x89504e47);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([width, height]);
  });

  it("links the approved icon sizes in the web manifest", () => {
    const manifest = JSON.parse(
      readAsset("public/site.webmanifest").toString("utf8"),
    ) as { name: string; short_name: string; start_url: string; icons: unknown[] };

    expect(manifest).toMatchObject({
      name: "Star Wars Zero Company Intel",
      short_name: "Zero Company Intel",
      start_url: "/",
    });
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        { src: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ]),
    );
  });
});
