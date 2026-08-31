import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContentBlocks } from "../src/components/content-blocks";
import type { ImageBlock, VideoBlock } from "../src/content/types";
import type { TableBlock } from "../src/content/types";

const imageBlock: ImageBlock = {
  type: "image",
  src: "/media/zero-company/tactical-combat.jpg",
  alt: "A four-operator squad fights battle droids on an industrial platform.",
  caption: "Official tactical combat screenshot used to explain squad positioning.",
  sourceUrl: "https://www.ea.com/en/games/starwars/zero-company",
  publisher: "Electronic Arts",
  checkedAt: "2026-08-30",
  evidence: "official",
};

const videoBlock: VideoBlock = {
  type: "video",
  heading: "Watch the tactical breakdown",
  videoId: "4MG48L7qYHE",
  posterSrc: "/media/zero-company/video-posters/tactical-breakdown.jpg",
  title: "Tactical Gameplay Breakdown | STAR WARS Zero Company",
  publisher: "EA Star Wars",
  duration: "2:40",
  publishedAt: "2026-08-13",
  description: "Official explanation of the turn-based combat loop.",
  checkedAt: "2026-08-30",
  evidence: "official",
  versionNote: "Official pre-launch systems overview",
};

const compactTableBlock: TableBlock = {
  type: "table",
  heading: "Compact comparison",
  caption: "A compact mobile comparison",
  columns: ["Class", "Role", "Best use"],
  rows: [["Scout", "Setup", "Create Advantage"]],
};

const wideTableBlock: TableBlock = {
  ...compactTableBlock,
  heading: "Wide comparison",
  caption: "A wide comparison that must scroll",
  columns: ["Weapon", "Damage", "Critical", "Range", "AP"],
  rows: [["Blaster", "6", "+4", "Medium", "1"]],
};

describe("media content blocks", () => {
  it("renders an attributed evidence image with useful alternative text", () => {
    const render = () => renderToStaticMarkup(
      createElement(ContentBlocks, { blocks: [imageBlock] }),
    );

    expect(render).not.toThrow();
    const markup = render();
    expect(markup).toContain("<figure");
    expect(markup).toContain(imageBlock.alt);
    expect(markup).toContain(imageBlock.caption);
    expect(markup).toContain(imageBlock.sourceUrl);
    expect(markup).toContain("Electronic Arts");
    expect(markup).toContain("Official");
  });

  it("renders a click-to-load video poster without an initial iframe", () => {
    const render = () => renderToStaticMarkup(
      createElement(ContentBlocks, { blocks: [videoBlock] }),
    );

    expect(render).not.toThrow();
    const markup = render();
    expect(markup).toContain("Watch the tactical breakdown");
    expect(markup).toContain(videoBlock.title);
    expect(markup).toContain("EA Star Wars");
    expect(markup).toContain("2:40");
    expect(markup).toContain("Official pre-launch systems overview");
    expect(markup).toContain("Load video");
    expect(markup).not.toContain("<iframe");
    expect(markup).not.toContain("youtube-nocookie.com/embed");
  });

  it("keeps spoiler videos inside a closed disclosure", () => {
    const markup = renderToStaticMarkup(
      createElement(ContentBlocks, {
        blocks: [{ ...videoBlock, spoiler: true, heading: "Spoiler walkthrough" }],
      }),
    );

    expect(markup).toContain("<details");
    expect(markup).not.toContain("<details open");
    expect(markup).toContain("Reveal spoiler video");
  });

  it("renders compact tables as labeled mobile cards", () => {
    const markup = renderToStaticMarkup(
      createElement(ContentBlocks, { blocks: [compactTableBlock] }),
    );

    expect(markup).toContain("data-table--cards");
    expect(markup).toContain('data-label="Role"');
    expect(markup).not.toContain("Swipe to view all columns");
  });

  it("renders wide comparisons with an explicit horizontal-scroll cue", () => {
    const markup = renderToStaticMarkup(
      createElement(ContentBlocks, { blocks: [wideTableBlock] }),
    );

    expect(markup).toContain("data-table--scroll");
    expect(markup).toContain("Swipe to view all columns");
    expect(markup).toContain('data-label="AP"');
  });
});
