import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { contentPages, requiredPublicPaths } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";
import {
  buildCanonicalUrl,
  getInnerRouteParams,
  getMetadataForPath,
  getSearchPages,
} from "../src/lib/site";

const page = (path: string) => contentPages.find((entry) => entry.path === path);
const blockText = (path: string) => JSON.stringify(page(path)?.blocks ?? []);

describe("post-launch query expansion", () => {
  it("keeps stutter intent on FPS Fix while adding official timeline and platform split", () => {
    const fps = page("/performance/fps-fix");

    expect(fps).toMatchObject({
      title: "Star Wars Zero Company Stutter, Low FPS and Crash Fixes",
      h1: "Fix Star Wars Zero Company Stutter, Low FPS & Crashes",
      lastVerified: "2026-09-03",
      indexable: true,
    });
    expect(contentPages.some((entry) => entry.path === "/performance/stuttering")).toBe(false);
    expect(contentPages.some((entry) => entry.path === "/stuttering")).toBe(false);

    const timeline = fps?.blocks.find(
      (block) => block.type === "table" && block.heading === "Official status timeline",
    );
    expect(timeline?.type).toBe("table");
    if (timeline?.type === "table") {
      expect(timeline.rows.map((row) => row[0])).toEqual([
        "August 27, 2026",
        "September 1, 2026",
        "After each patch",
      ]);
      expect(timeline.rows.flat().join(" ")).toContain("crashes and CPU threading");
      expect(timeline.rows.flat().join(" ")).toContain("Last edited");
      expect(timeline.rows.flat().join(" ")).toContain("lastVerified");
    }

    const platformSplit = fps?.blocks.find(
      (block) => block.type === "table" && block.heading === "PC, PS5 and Xbox troubleshooting split",
    );
    expect(platformSplit?.type).toBe("table");
    if (platformSplit?.type === "table") {
      expect(platformSplit.rows.map((row) => row[0])).toEqual([
        "PC",
        "PlayStation 5",
        "Xbox Series X|S",
      ]);
      expect(platformSplit.rows[0].join(" ")).toContain("driver");
      expect(platformSplit.rows.slice(1).flat().join(" ")).toContain("EA Forums");
    }
  });

  it("keeps Sloppy Supply Route noindex while adding the answer-first review block", () => {
    const sloppy = page("/walkthrough/sloppy-supply-route");

    expect(sloppy).toMatchObject({
      status: "needs-retest",
      verification: "needs-retest",
      indexable: false,
      lastVerified: "2026-09-03",
    });

    const answer = sloppy?.blocks.find(
      (block) => block.type === "table" && block.heading === "Best choice at a glance",
    );
    expect(answer?.type).toBe("table");
    if (answer?.type === "table") {
      expect(answer.rows.map((row) => row[0])).toEqual([
        "Rewards match the extracted record",
        "You need a verified reward pool",
        "You already need to assign Operators",
      ]);
      expect(answer.rows.flat().join(" ")).toContain("Analyze");
      expect(answer.rows.flat().join(" ")).toContain("default low-risk option");
      expect(answer.rows.flat().join(" ")).toContain("Holotable");
    }

    expect(blockText("/walkthrough/sloppy-supply-route")).toContain("two result screens");
    expect(getMetadataForPath("/walkthrough/sloppy-supply-route")?.robots).toBe("noindex, follow");
  });

  it("publishes Help Wanted as the indexed multi-variant Operation owner", async () => {
    const helpWanted = page("/walkthrough/help-wanted");
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const searchPaths = getSearchPages().map((entry) => entry.path);
    const hub = page("/walkthrough");
    const hubCardHrefs = hub?.blocks.flatMap((block) =>
      block.type === "cards"
        ? block.items.flatMap((item) => item.href ? [item.href] : [])
        : [],
    ) ?? [];

    expect(helpWanted).toMatchObject({
      title: "Star Wars Zero Company Help Wanted Choices and Rewards",
      h1: "Star Wars Zero Company Help Wanted Operation: Every Variant, Choice & Outcome",
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
      lastVerified: "2026-09-03",
    });
    expect(requiredPublicPaths).toContain("/walkthrough/help-wanted");
    expect(staticPaths).toContain("/walkthrough/help-wanted");
    expect(searchPaths).toContain("/walkthrough/help-wanted");
    expect(sitemapUrls).toContain(buildCanonicalUrl("/walkthrough/help-wanted"));
    expect(getMetadataForPath("/walkthrough/help-wanted")?.robots).toBe("index, follow");
    expect(hub?.related).toContain("/walkthrough/help-wanted");
    expect(hubCardHrefs).toContain("/walkthrough/help-wanted");

    const locator = helpWanted?.blocks.find(
      (block) => block.type === "table" && block.heading === "Find your Help Wanted variant",
    );
    expect(locator?.type).toBe("table");
    if (locator?.type === "table") {
      expect(locator.rows.map((row) => row[0])).toEqual([
        "Skeez and the magic box",
        "Many-armed village beast",
        "Odra transport job",
        "Odra under Imperial eyes",
        "Assassin droid",
        "Regional gang weapon cache",
      ]);
    }

    const goals = helpWanted?.blocks.find(
      (block) => block.type === "table" && block.heading === "Choose by campaign goal",
    );
    expect(goals?.type).toBe("table");
    if (goals?.type === "table") {
      expect(goals.rows.map((row) => row[0])).toEqual([
        "Need Credits",
        "Protect Bonds",
        "Need Influence",
        "Permadeath or injured roster",
      ]);
    }
    expect(resolveSources(helpWanted?.sources ?? []).map((source) => source.id)).toEqual(
      expect.arrayContaining(["zerocompany-tools-help-wanted", "gamersheroes-choices", "showgamer-choices"]),
    );
  });

  it("keeps Protection Application on the Walkthrough hub instead of creating a thin route", () => {
    const walkthrough = page("/walkthrough");

    expect(contentPages.some((entry) => entry.path === "/walkthrough/protection-application")).toBe(false);
    const protection = walkthrough?.blocks.find(
      (block) => block.type === "table" && block.heading === "Protection Application: Credits or team Bond?",
    );
    expect(protection?.type).toBe("table");
    if (protection?.type === "table") {
      expect(protection.rows).toEqual([
        ["Drink to that", "+1,000 Credits; reported -25 Bond XP across the team", "+3 Influence", "Take only when the Credit bottleneck beats a whole-roster Bond loss"],
        ["Throw the drink", "+10 Bond XP across the roster", "+3 Influence", "Default when the campaign can survive without the immediate Credits"],
      ]);
    }
    expect(walkthrough?.sources).toEqual(expect.arrayContaining(["zerocompany-tools-protection-application", "gamersheroes-choices"]));
  });

  it("answers Inspect Mode on the beginner guide and separates the Nexus mod on Mods", () => {
    const beginnerText = blockText("/guides/beginners-guide");
    const modsText = blockText("/mods");

    expect(page("/guides/beginners-guide")?.lastVerified).toBe("2026-09-03");
    expect(beginnerText).toContain("How to use Inspect Mode");
    expect(beginnerText).toContain("controller users");
    expect(beginnerText).toContain("current binding");
    expect(beginnerText).toContain("Hover over keywords or icons");
    expect(beginnerText).toContain("does not reveal hidden rolls");

    expect(modsText).toContain("Full Info In Inspect Mode");
    expect(modsText).toContain("not the built-in Inspect Mode");
    expect(page("/mods")?.sources).toContain("nexus-full-info-inspect-mode");
  });

  it("answers Hungarian magyaritas intent on Game Info and Mods without creating language or download pages", () => {
    const gameInfoText = blockText("/game-info");
    const modsText = blockText("/mods");

    expect(page("/game-info")?.lastVerified).toBe("2026-09-03");
    expect(page("/mods")?.lastVerified).toBe("2026-09-03");
    expect(contentPages.some((entry) => entry.path === "/hu")).toBe(false);
    expect(contentPages.some((entry) => entry.path === "/mods/hungarian-translation")).toBe(false);

    expect(gameInfoText).toContain("Hungarian / Magyar");
    expect(gameInfoText).toContain("Does Star Wars Zero Company support Hungarian?");
    expect(gameInfoText).toContain("Jelenleg nincs hivatalos magyar felulet vagy felirat a jatekhoz.");
    expect(modsText).toContain("Hungarian translation / magyaritas status");
    expect(modsText).toContain("No verified Hungarian translation patch found in this check");
    expect(page("/game-info")?.sources).toContain("steam-store-hungarian");
    expect(page("/mods")?.sources).toEqual(
      expect.arrayContaining(["steam-store-hungarian", "google-trends-help"]),
    );
  });
});
