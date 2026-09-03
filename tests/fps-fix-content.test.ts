import { describe, expect, it } from "vitest";
import { contentPages } from "../src/content/pages";
import { resolveSources } from "../src/content/sources";

const path = "/performance/fps-fix";

describe("FPS fix search-intent coverage", () => {
  it("keeps the existing canonical while covering stutter variants and current status", () => {
    const page = contentPages.find((entry) => entry.path === path);

    expect(page).toMatchObject({
      title: "Star Wars Zero Company Stutter, Low FPS and Crash Fixes",
      description:
        "Fix Zero Company stutter and low FPS with an official-status-first checklist for CPU threading, drivers, upscalers, shader issues, Geometry Detail and safe rollback.",
      h1: "Fix Star Wars Zero Company Stutter, Low FPS & Crashes",
      lastVerified: "2026-09-03",
      indexable: true,
    });

    const headings = page?.blocks
      .filter((block) => "heading" in block)
      .map((block) => block.heading);
    expect(headings).toEqual(
      expect.arrayContaining([
        "Current official performance status",
        "Fix Star Wars Zero Company stuttering and FPS drops",
        "Diagnose the symptom before changing settings",
        "Troubleshoot in this order",
        "Measure one change and keep a rollback",
        "Community experiments: reversible is not guaranteed",
        "Zero Company stuttering and low FPS questions",
      ]),
    );
  });

  it("routes each symptom to a bounded first check instead of a tweak pile", () => {
    const page = contentPages.find((entry) => entry.path === path);
    const diagnosis = page?.blocks.find(
      (block) => block.type === "table" && block.heading === "Diagnose the symptom before changing settings",
    );

    expect(diagnosis?.type).toBe("table");
    if (diagnosis?.type === "table") {
      expect(diagnosis.rows.map((row) => row[0])).toEqual([
        "Crash during shader compilation",
        "High FPS but visible stutter",
        "Low and High show similar FPS",
        "The Den, cutscene or ship-loading dip",
        "DLSS or NVIDIA crash",
        "Intel 13th/14th-gen desktop crash",
      ]);
      expect(diagnosis.rows.flat().join(" ")).toContain("CPU-bound");
      expect(diagnosis.rows.flat().join(" ")).toContain("Frame pacing");
    }

    const experiments = page?.blocks.find(
      (block) => block.type === "table" && block.heading === "Community experiments: reversible is not guaranteed",
    );
    expect(experiments?.type).toBe("table");
    if (experiments?.type === "table") {
      expect(experiments.rows.map((row) => row[0])).toEqual([
        "Environment Geometry Detail",
        "Frame-rate cap",
        "Shader cache change",
        "Engine.ini or performance mod",
      ]);
      expect(experiments.rows.flat().join(" ")).toContain("Conflicting reports");
      expect(experiments.rows.flat().join(" ")).toContain("Experimental");
    }

    const sourceIds = resolveSources(page?.sources ?? []).map((source) => source.id);
    expect(sourceIds).toEqual(
      expect.arrayContaining([
        "steam-issue-update",
        "ea-faq",
        "reddit-geometry",
        "reddit-performance-megathread",
        "reddit-pc-stutter-reports",
      ]),
    );
  });
});
