import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SquadBuilder } from "../src/components/squad-builder";
import { getContentPage } from "../src/content/pages";
import { collectBlockText } from "../src/lib/search";
import { buildStructuredDataNodes } from "../src/lib/structured-data";

describe("Squad Builder page", () => {
  it("publishes one differentiated, indexable tool route", () => {
    const page = getContentPage("/squad-builder");

    expect(page).toMatchObject({
      navLabel: "Squad Builder",
      pageType: "tool",
      indexable: true,
      verification: "source-verified-synthesis",
    });
    expect(page?.blocks.some((block) => block.type === "squad-builder")).toBe(true);
  });

  it("renders a complete four-slot planner before hydration", () => {
    const markup = renderToStaticMarkup(createElement(SquadBuilder));

    expect(markup).toContain("Four-slot squad plan");
    expect(markup.match(/data-squad-slot=/g)).toHaveLength(4);
    expect(markup).toContain("Balanced first run");
    expect(markup).toContain("Findings");
    expect(markup).toContain("Seven-dimension readout");
    expect(markup).toContain("Secondary specialization");
    expect(markup).toContain("Talent");
    expect(markup).toContain("Operator level");
    expect(markup).toContain("Focus available");
    expect(markup).toContain("Focus spent");
    expect(markup).toContain("Observed build");
    expect(markup).toContain("Copy share link");
    expect(markup).not.toContain("Overall score");
  });

  it("keeps the Builder searchable through its visible content block", () => {
    const page = getContentPage("/squad-builder")!;
    const builderBlock = page.blocks.find((block) => block.type === "squad-builder")!;

    expect(collectBlockText(builderBlock)).toContain("Squad Builder");
    expect(collectBlockText(builderBlock)).toContain("four Operators");
  });

  it("describes the public tool as a free SoftwareApplication", () => {
    const page = getContentPage("/squad-builder")!;
    const nodes = buildStructuredDataNodes(page);
    const application = nodes.find((node) => node["@type"] === "SoftwareApplication");

    expect(nodes[0]["@type"]).toBe("WebPage");
    expect(application).toMatchObject({
      "@type": "SoftwareApplication",
      applicationCategory: "GameApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    });
  });
});
