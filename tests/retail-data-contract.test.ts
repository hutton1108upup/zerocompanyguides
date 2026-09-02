import { describe, expect, it } from "vitest";
import {
  activeRetailRecords,
  getRetailEvidence,
  getRetailRecord,
  retailRecords,
} from "../src/content/retail-data";
import {
  operators,
  specializations,
  talents,
  weapons,
} from "../src/content/squad-data";

describe("retail data contract", () => {
  it("requires versioned provenance for every active Builder record", () => {
    expect(retailRecords.length).toBeGreaterThan(10);

    for (const record of retailRecords) {
      expect(record.id).toBeTruthy();
      expect(record.sourceIds.length, `${record.id} sources`).toBeGreaterThan(0);
      expect(record.observedBuild, `${record.id} build`).toMatch(/\S+/);
      expect(record.sourceType, `${record.id} source type`).toMatch(/\S+/);
      expect(record.verifiedAt, `${record.id} verifiedAt`).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(["high", "medium", "low"]).toContain(record.confidence);
      expect(["none", "minor", "major"]).toContain(record.spoilerLevel);
    }
  });

  it("keeps retired records queryable but out of active choices", () => {
    const retired = getRetailRecord("ability", "force-push-preview");

    expect(retired?.retiredAt).toBe("2026-09-02");
    expect(activeRetailRecords).not.toContain(retired);
    const replacement = getRetailRecord("ability", retired?.replacedBy ?? "");
    expect(replacement?.id).toBe("force-push");
    expect(replacement?.retiredAt).toBeUndefined();
  });

  it("maps every current Builder choice to a versioned retail record", () => {
    for (const entry of specializations) {
      expect(getRetailRecord("specialization", entry.slug), entry.slug).toBeDefined();
    }
    for (const entry of operators) {
      expect(getRetailRecord("operator", entry.slug), entry.slug).toBeDefined();
    }
    for (const entry of weapons) {
      expect(getRetailRecord("weapon", entry.slug), entry.slug).toBeDefined();
    }
    for (const entry of talents) {
      expect(getRetailRecord("talent", entry.slug), entry.slug).toBeDefined();
    }
    expect(getRetailRecord("ability", "force-push")).toBeDefined();
    expect(getRetailRecord("operation", "nebulous-pursuit")).toBeDefined();
  });

  it("returns only provenance fields for Builder findings", () => {
    expect(getRetailEvidence("specialization", "scout")).toMatchObject({
      observedBuild: expect.any(String),
      sourceType: "official",
      verifiedAt: "2026-09-02",
      confidence: "high",
      spoilerLevel: "none",
    });
  });
});
