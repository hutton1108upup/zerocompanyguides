import { describe, expect, it } from "vitest";
import {
  defaultSquadState,
  operators,
  specializations,
  squadPresets,
  weapons,
  type SquadState,
} from "../src/content/squad-data";
import {
  decodeSquadState,
  encodeSquadState,
  evaluateSquad,
} from "../src/lib/squad-builder";

const storySquadWithoutHawks: SquadState = {
  mode: "story",
  slots: [
    { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
    { operatorSlug: "kabb", specializationSlug: "assault", weaponSlug: "rifle" },
    { operatorSlug: "jae", specializationSlug: "scoundrel", weaponSlug: "pistol" },
    { operatorSlug: "custom", specializationSlug: "medic", weaponSlug: "rifle" },
  ],
};

const validStorySquad: SquadState = {
  mode: "story",
  slots: [
    { operatorSlug: "hawks", specializationSlug: "scoundrel", weaponSlug: "rifle" },
    { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
    { operatorSlug: "tel-rea", specializationSlug: "jedi-padawan", weaponSlug: "pistol" },
    { operatorSlug: "custom", specializationSlug: "scout", weaponSlug: "longarm" },
  ],
};

describe("squad builder data", () => {
  it("publishes complete, uniquely addressable records for every builder choice", () => {
    for (const records of [operators, specializations, weapons, squadPresets]) {
      expect(records.length).toBeGreaterThan(2);
      expect(new Set(records.map((record) => record.slug)).size).toBe(records.length);
    }

    for (const record of [...operators, ...specializations, ...weapons]) {
      expect(record.sourceIds.length, `${record.slug} sources`).toBeGreaterThan(0);
      expect(record.lastVerified).toMatch(/^2026-\d{2}-\d{2}$/);
    }

    expect(defaultSquadState.slots).toHaveLength(4);
  });
});

describe("evaluateSquad", () => {
  it("catches a story squad that omits required commander Hawks", () => {
    const result = evaluateSquad(storySquadWithoutHawks);

    expect(result.findings).toContainEqual(
      expect.objectContaining({
        id: "story-requires-hawks",
        severity: "conflict",
        evidence: "source-backed",
      }),
    );
  });

  it("rejects duplicate named Operators while allowing multiple Custom Operators", () => {
    const duplicateNamed: SquadState = {
      ...validStorySquad,
      slots: [validStorySquad.slots[0], validStorySquad.slots[1], validStorySquad.slots[1], validStorySquad.slots[3]],
    };
    const duplicateCustom: SquadState = {
      ...validStorySquad,
      slots: [validStorySquad.slots[0], validStorySquad.slots[1], validStorySquad.slots[3], validStorySquad.slots[3]],
    };

    expect(evaluateSquad(duplicateNamed).findings).toContainEqual(
      expect.objectContaining({ id: "duplicate-named-operator", severity: "conflict" }),
    );
    expect(evaluateSquad(duplicateCustom).findings).not.toContainEqual(
      expect.objectContaining({ id: "duplicate-named-operator" }),
    );
  });

  it("explains shared Advantage pressure instead of producing one overall score", () => {
    const result = evaluateSquad({
      mode: "story",
      slots: [
        { operatorSlug: "hawks", specializationSlug: "gunslinger", weaponSlug: "pistol" },
        { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
        { operatorSlug: "kabb", specializationSlug: "heavy", weaponSlug: "repeater" },
        { operatorSlug: "custom", specializationSlug: "medic", weaponSlug: "rifle" },
      ],
    });

    expect(result.findings).toContainEqual(
      expect.objectContaining({ id: "advantage-pressure", severity: "gap" }),
    );
    expect(result.dimensions.map((dimension) => dimension.id)).toEqual([
      "role-coverage",
      "range",
      "action-economy",
      "advantage",
      "survivability",
      "control",
      "mobility",
    ]);
    expect(result).not.toHaveProperty("score");
  });

  it("recognizes a deliberate Advantage generator and complete role coverage", () => {
    const result = evaluateSquad(validStorySquad);

    expect(result.dimensions.find((entry) => entry.id === "advantage")?.status).toBe("strong");
    expect(result.dimensions.find((entry) => entry.id === "role-coverage")?.status).not.toBe("gap");
  });

  it("attaches retail provenance to every finding and dimension", () => {
    const result = evaluateSquad(validStorySquad);

    for (const finding of result.findings) {
      expect(finding.evidenceMeta).toMatchObject({
        observedBuild: expect.any(String),
        verifiedAt: expect.stringMatching(/^2026-\d{2}-\d{2}$/),
        sourceIds: expect.arrayContaining([expect.any(String)]),
      });
    }
    for (const dimension of result.dimensions) {
      expect(dimension.evidenceMeta).toMatchObject({
        observedBuild: expect.any(String),
        verifiedAt: expect.stringMatching(/^2026-\d{2}-\d{2}$/),
        sourceIds: expect.arrayContaining([expect.any(String)]),
      });
    }
  });
});

describe("share codes", () => {
  it("round-trips a valid squad without changing its four slots", () => {
    expect(decodeSquadState(encodeSquadState(validStorySquad))).toEqual(validStorySquad);
  });

  it("rejects malformed, unknown, or locked-Specialization codes", () => {
    expect(decodeSquadState("not-a-valid-code")).toBeUndefined();
    expect(decodeSquadState("v1|story|hawks.unknown.rifle"))
      .toBeUndefined();

    const illegalTelClass: SquadState = {
      ...validStorySquad,
      slots: validStorySquad.slots.map((slot, index) => (
        index === 2 ? { ...slot, specializationSlug: "soldier" } : slot
      )),
    };
    expect(decodeSquadState(encodeSquadState(illegalTelClass))).toBeUndefined();
  });
});
