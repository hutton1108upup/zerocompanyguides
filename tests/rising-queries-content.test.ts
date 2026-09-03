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

const getPage = (path: string) =>
  contentPages.find((entry) => entry.path === path);

describe("rising-query content expansion", () => {
  it("turns the existing trophy route into a current Platinum roadmap", () => {
    const page = getPage("/trophy-guide");

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Platinum Trophy and Achievement Guide",
      h1: "Star Wars Zero Company Platinum Trophy & Achievement Guide",
      status: "verified",
      verification: "source-verified-synthesis",
      indexable: true,
      lastVerified: "2026-09-02",
    });
    if (!page) return;

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Platinum route at a glance",
        "Why the difficulty trophies can stack",
        "Plan these trophies before the final sequence",
        "Platinum questions",
      ]),
    );
    expect(resolveSources(page.sources).map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "steam-store",
        "truetrophies-list",
        "wehunt-platinum",
        "reddit-platinum-guide",
      ]),
    );
  });

  it("publishes a bounded Nebulous Pursuit Operation guide", () => {
    const page = getPage("/walkthrough/nebulous-pursuit");

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Nebulous Pursuit Choices and Rewards",
      h1: "Star Wars Zero Company Nebulous Pursuit Operation Guide",
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
      lastVerified: "2026-09-02",
    });
    if (!page) return;

    const firstChoices = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Nebulous Pursuit I choices",
    );
    const secondChoices = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Nebulous Pursuit II choices",
    );
    expect(firstChoices?.type).toBe("table");
    expect(secondChoices?.type).toBe("table");
    if (firstChoices?.type === "table") {
      expect(firstChoices.rows.map((row) => row[0])).toEqual([
        "Sullust",
        "Bothawui",
        "Mon Gazza",
      ]);
      expect(firstChoices.rows.flat().join(" ")).toContain("randomized");
    }
    if (secondChoices?.type === "table") {
      expect(secondChoices.rows.map((row) => row[0])).toEqual([
        "Nevarro",
        "Koboh",
        "Lotho Minor",
      ]);
      expect(secondChoices.rows.flat().join(" ")).toContain("Exotic Modification");
      expect(secondChoices.rows.flat().join(" ")).toContain("injury");
    }

    expect(resolveSources(page.sources).map((source) => source.id)).toEqual(
      expect.arrayContaining([
        "ea-faq",
        "zerocompany-tools-nebulous-pursuit",
        "powerup-nebulous-pursuit",
        "gamerblurb-nebulous-pursuit",
      ]),
    );
  });

  it("publishes one Ship Adrift guide for the five-part Operation chain", () => {
    const page = getPage("/walkthrough/ship-adrift");

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Ship Adrift Choices and Rewards Guide",
      h1: "Star Wars Zero Company Ship Adrift I-V Operation Guide",
      status: "verified",
      verification: "source-verified-synthesis",
      evidence: "community",
      indexable: true,
      lastVerified: "2026-09-02",
    });
    if (!page) return;

    const choiceTables = page.blocks.filter(
      (block) => block.type === "table" && /^Ship Adrift [IVX]+ choices$/.test(block.heading),
    );
    expect(choiceTables).toHaveLength(5);
    expect(choiceTables.flatMap((block) => block.type === "table" ? block.rows : []).flat().join(" ")).toEqual(
      expect.stringContaining("Capacitor"),
    );
    expect(choiceTables.flatMap((block) => block.type === "table" ? block.rows : []).flat().join(" ")).toEqual(
      expect.stringContaining("Bond"),
    );
    expect(resolveSources(page.sources).map((source) => source.id)).toEqual(
      expect.arrayContaining(["ea-faq", "gamersheroes-choices", "showgamer-choices"]),
    );
  });

  it("discovers both new Operation guides through the Walkthrough hub and public registries", async () => {
    const paths = [
      "/walkthrough/nebulous-pursuit",
      "/walkthrough/ship-adrift",
    ];
    const hub = getPage("/walkthrough");
    const cardHrefs = hub?.blocks.flatMap((block) =>
      block.type === "cards"
        ? block.items.flatMap((item) => item.href ? [item.href] : [])
        : [],
    ) ?? [];
    const sitemapUrls = (await sitemap()).map((entry) => entry.url);
    const staticPaths = getInnerRouteParams().map((entry) => `/${entry.slug.join("/")}`);
    const searchPaths = getSearchPages().map((entry) => entry.path);

    for (const path of paths) {
      expect(requiredPublicPaths).toContain(path);
      expect(hub?.related).toContain(path);
      expect(cardHrefs).toContain(path);
      expect(staticPaths).toContain(path);
      expect(searchPaths).toContain(path);
      expect(sitemapUrls).toContain(buildCanonicalUrl(path));
      expect(getMetadataForPath(path)?.robots).toBe("index, follow");
      expect(getMetadataForPath(path)?.alternates?.canonical).toBe(buildCanonicalUrl(path));
    }
  });

  it("makes the existing Permadeath route own the broader difficulty-settings decision", () => {
    const page = getPage("/guides/permadeath");

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Difficulty Settings and Permadeath Guide",
      h1: "Star Wars Zero Company Difficulty Settings, Permadeath & Injury Guide",
      lastVerified: "2026-09-02",
      indexable: true,
    });
    if (!page) return;

    const headings = page.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Difficulty, Permadeath and Beskar are separate choices",
        "Which Zero Company difficulty setting should you choose?",
        "Difficulty and Permadeath questions",
      ]),
    );
  });

  it("answers Czech, Russian and SteamDB intent on Game Info without thin routes", () => {
    const page = getPage("/game-info");

    expect(page).toMatchObject({
      lastVerified: "2026-09-03",
      indexable: true,
    });
    if (!page) return;

    const languages = page.blocks.find(
      (block) => block.type === "table" && block.heading === "Supported interface and subtitle languages",
    );
    const steam = page.blocks.find(
      (block) => block.type === "facts" && block.heading === "Steam status and external data",
    );
    expect(languages?.type).toBe("table");
    expect(steam?.type).toBe("facts");
    if (languages?.type === "table") {
      const text = languages.rows.flat().join(" ");
      expect(text).toContain("English");
      expect(text).toContain("German");
      expect(text).toContain("Czech / Čeština");
      expect(text).toContain("Russian / Русский");
      expect(text).toContain("Not listed");
    }
    if (steam?.type === "facts") {
      const text = steam.items.map((item) => `${item.label} ${item.value}`).join(" ");
      expect(text).toContain("2075800");
      expect(text).toContain("SteamDB");
    }
    expect(resolveSources(page.sources).map((source) => source.id)).toContain("steamdb-config");
  });

  it("refreshes the dedicated Steam Deck page to Valve's current Unsupported record", () => {
    const page = getPage("/performance/steam-deck");

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Steam Deck Performance Status",
      lastVerified: "2026-09-02",
      verification: "needs-retest",
      indexable: true,
    });
    expect(page?.summary).toContain("Unsupported");
    if (!page) return;

    const status = page.blocks.find(
      (block) => block.type === "facts" && block.heading === "Current Steam Deck status",
    );
    expect(status?.type).toBe("facts");
    if (status?.type === "facts") {
      const text = status.items.map((item) => `${item.label} ${item.value}`).join(" ");
      expect(text).toContain("Unsupported");
      expect(text).toContain("24414723");
      expect(text).toContain("August 19, 2026");
    }
    expect(resolveSources(page.sources).map((source) => source.id)).toContain("steamdb-config");
  });
});
