import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContentBlocks } from "../src/components/content-blocks";
import { getContentPage } from "../src/content/pages";

describe("responsive data tables", () => {
  it("renders persistent edge affordances for wide comparison tables", () => {
    const page = getContentPage("/weapons")!;
    const table = page.blocks.find(
      (block) => block.type === "table" && block.columns.length > 3,
    );

    expect(table?.type).toBe("table");
    if (!table || table.type !== "table") return;

    const markup = renderToStaticMarkup(
      createElement(ContentBlocks, { blocks: [table] }),
    );

    expect(markup).toContain('class="table-scroll-shell"');
    expect(markup).toContain("Swipe to view all columns");
    expect(markup).toContain('class="table-scroll-shadow table-scroll-shadow--right"');
  });
});
