import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CorrectionForm } from "../src/components/correction-form";
import { BuildShareCard } from "../src/components/build-share-card";
import { ContentPageView } from "../src/components/content-page";
import { getContentPage } from "../src/content/pages";

describe("correction and share entry points", () => {
  it("renders page-aware evidence fields without transmitting on render", () => {
    const markup = renderToStaticMarkup(createElement(CorrectionForm, { pagePath: "/classes/tier-list" }));

    expect(markup).toContain("Page URL");
    expect(markup).toContain("/classes/tier-list");
    expect(markup).toContain("Claim to correct");
    expect(markup).toContain("Game version");
    expect(markup).toContain("Platform");
    expect(markup).toContain("Difficulty");
    expect(markup).toContain("Evidence URL");
    expect(markup).toContain("Prepare correction");
    expect(markup).not.toContain("issues/new");
  });

  it("keeps a human-readable Builder share entry on the canonical route", () => {
    const markup = renderToStaticMarkup(createElement(BuildShareCard, {
      code: "v2|story|hawks.scout.-.fearless-leader.8.20.18.rifle",
      summary: "Hawks Scout with a recorded Focus plan",
    }));

    expect(markup).toContain("Share-ready build");
    expect(markup).toContain("Hawks Scout with a recorded Focus plan");
    expect(markup).toContain("/squad-builder?s=");
    expect(markup).toContain("Copy build link");
  });

  it("mounts correction context on a non-editorial content page", () => {
    const page = getContentPage("/classes/tier-list");
    expect(page).toBeDefined();
    const markup = renderToStaticMarkup(createElement(ContentPageView, { page: page! }));
    expect(markup).toContain("Claim to correct");
  });
});
