import { describe, expect, it } from "vitest";
import { collectBlockText } from "../src/lib/search";
import type { ImageBlock, VideoBlock } from "../src/content/types";

describe("site search media text", () => {
  it("indexes image captions and video explanations instead of dropping media blocks", () => {
    const image: ImageBlock = {
      type: "image",
      src: "/media/zero-company/holotable.jpg",
      alt: "Vandor crisis mission holotable",
      caption: "Review mission expiry and rewards before advancing the Cycle.",
      sourceUrl: "https://www.ea.com/en/games/starwars/zero-company",
      publisher: "Electronic Arts",
      checkedAt: "2026-08-30",
      evidence: "official",
    };
    const video: VideoBlock = {
      type: "video",
      heading: "Steam Deck launch test",
      videoId: "XjdPD0oEvWA",
      posterSrc: "/media/zero-company/video-posters/steam-deck-oled.jpg",
      title: "Steam Deck OLED performance",
      publisher: "NotAGameAddict",
      duration: "15:28",
      publishedAt: "2026-08-27",
      uploadDateTime: "2026-08-27T16:33:11Z",
      description: "A device and SteamOS labeled test.",
      checkedAt: "2026-08-30",
      evidence: "community",
      versionNote: "SteamOS 3.8.25",
    };

    expect(collectBlockText(image)).toBe(
      "Vandor crisis mission holotable Review mission expiry and rewards before advancing the Cycle. Electronic Arts official",
    );
    expect(collectBlockText(video)).toBe(
      "Steam Deck launch test Steam Deck OLED performance NotAGameAddict A device and SteamOS labeled test. SteamOS 3.8.25 community",
    );
  });
});
