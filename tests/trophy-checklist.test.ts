import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AchievementChecklist } from "../src/components/achievement-checklist";
import { trophyAchievements } from "../src/content/trophy-data";
import { getContentPage } from "../src/content/pages";

describe("trophy checklist", () => {
  it("keeps the shared launch list at 53 records", () => {
    expect(trophyAchievements).toHaveLength(53);
    expect(new Set(trophyAchievements.map((entry) => entry.id)).size).toBe(53);
  });

  it("renders filter, spoiler and browser-save controls", () => {
    const markup = renderToStaticMarkup(createElement(AchievementChecklist));

    expect(markup).toContain("53 trophies");
    expect(markup).toContain("Filter trophies");
    expect(markup).toContain("Hide spoiler-heavy rows");
    expect(markup).toContain("Save progress in this browser");
    expect(markup.match(/data-achievement-id=/g)).toHaveLength(53);
  });

  it("mounts the checklist inside the existing trophy owner route", () => {
    const page = getContentPage("/trophy-guide");
    expect(page?.blocks.some((block) => block.type === "achievement-checklist")).toBe(true);
  });
});
