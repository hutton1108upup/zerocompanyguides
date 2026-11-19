import { describe, expect, it, vi } from "vitest";
import { metadata } from "../src/app/layout";
import { getMetadataForPath } from "../src/lib/site";

vi.mock("next/font/local", () => ({
  default: ({ variable }: { variable: string }) => ({ variable }),
}));

describe("site metadata", () => {
  it("uses the production origin as the metadata base", () => {
    expect(metadata.metadataBase?.toString()).toBe(
      "https://zerocompany-guides.wiki/",
    );
  });

  it("uses the concise visual brand as the site-wide Open Graph name", () => {
    expect(metadata.openGraph?.siteName).toBe("Zero Company Intel");
  });

  it("uses the patch notes' existing game artwork for social previews", () => {
    const patchNotes = getMetadataForPath("/patch-notes");
    const images = [expect.objectContaining({
      url: new URL("/media/zero-company/key-art.jpg", metadata.metadataBase!),
      width: 3840,
      height: 2160,
    })];

    expect(patchNotes?.openGraph?.images).toEqual(images);
    expect(patchNotes?.twitter?.images).toEqual(images);
  });

  it("uses the approved brand image for pages without their own social artwork", () => {
    const images = [expect.objectContaining({
      url: new URL("/opengraph-image.png", metadata.metadataBase!),
      width: 1200,
      height: 630,
    })];

    for (const path of ["/", "/squad-builder"]) {
      const pageMetadata = getMetadataForPath(path);
      expect(pageMetadata?.openGraph?.images).toEqual(images);
      expect(pageMetadata?.twitter?.images).toEqual(images);
    }
  });
});
