import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";

type RegistryBlock = {
  type: string;
  src?: string;
  sourceUrl?: string;
  publisher?: string;
  checkedAt?: string;
  evidence?: string;
  videoId?: string;
  posterSrc?: string;
};

const imagePaths = [
  "/",
  "/classes",
  "/classes/tier-list",
  "/builds",
  "/builds/hawks",
  "/builds/best-team",
  "/guides",
  "/guides/respec",
  "/walkthrough",
  "/performance",
  "/performance/pc",
  "/performance/fps-fix",
  "/game-info",
  "/system-requirements",
  "/multiplayer",
  "/weapons",
  "/characters",
  "/characters/companions",
  "/characters/voice-cast",
  "/guides/beginners-guide",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
].sort();

const videoPaths = [
  "/",
  "/classes",
  "/classes/tier-list",
  "/builds/best-team",
  "/guides",
  "/walkthrough",
  "/performance",
  "/performance/pc",
  "/game-info",
  "/guides/beginners-guide",
  "/performance/steam-deck",
  "/mods",
  "/worth-it",
].sort();

const mediaBlocks = (path: string) => {
  const page = contentPages.find((entry) => entry.path === path)!;
  return (page.blocks as RegistryBlock[]).filter(
    (block) => block.type === "image" || block.type === "video",
  );
};

describe("media content registry", () => {
  it("adds editorial images to every approved visual route", () => {
    const actual = contentPages
      .filter((page) => mediaBlocks(page.path).some((block) => block.type === "image"))
      .map((page) => page.path)
      .sort();

    expect(actual).toEqual(imagePaths);
  });

  it("adds playable videos only to the approved explanatory routes", () => {
    const actual = contentPages
      .filter((page) => mediaBlocks(page.path).some((block) => block.type === "video"))
      .map((page) => page.path)
      .sort();

    expect(actual).toEqual(videoPaths);
  });

  it("enforces local images, source metadata, valid video ids and density limits", () => {
    for (const page of contentPages) {
      const media = mediaBlocks(page.path);
      const images = media.filter((block) => block.type === "image");
      const videos = media.filter((block) => block.type === "video");

      expect(images.length, `${page.path} image density`).toBeLessThanOrEqual(2);
      expect(videos.length, `${page.path} video density`).toBeLessThanOrEqual(1);

      for (const image of images) {
        expect(image.src, `${page.path} local image`).toMatch(/^\/media\/zero-company\/[a-z0-9-]+\.(avif|jpg|jpeg|png|webp)$/);
        expect(image.sourceUrl, `${page.path} image source`).toMatch(/^https:\/\//);
        expect(image.publisher, `${page.path} image publisher`).toBeTruthy();
        expect(image.checkedAt, `${page.path} image checked date`).toBe("2026-08-30");
        expect(["official", "community"]).toContain(image.evidence);
      }

      for (const video of videos) {
        expect(video.videoId, `${page.path} YouTube id`).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(video.posterSrc, `${page.path} local video poster`).toMatch(
          /^\/media\/zero-company\/video-posters\/[a-z0-9-]+\.jpg$/,
        );
        expect(video.publisher, `${page.path} video channel`).toBeTruthy();
        expect(video.checkedAt, `${page.path} video checked date`).toBe("2026-08-30");
        expect(["official", "community"]).toContain(video.evidence);
      }
    }
  });
});
