import { describe, expect, it } from "vitest";
import { type SquadState } from "../src/content/squad-data";
import { decodeSquadState, encodeSquadState, evaluateSquad } from "../src/lib/squad-builder";

const retailSquad: SquadState = {
  mode: "story",
  slots: [
    {
      operatorSlug: "hawks",
      specializationSlug: "scout",
      secondarySpecializationSlug: "gunslinger",
      talentSlug: "fearless-leader",
      operatorLevel: 8,
      focusAvailable: 20,
      focusSpent: 18,
      weaponSlug: "rifle",
    },
    {
      operatorSlug: "trick",
      specializationSlug: "soldier",
      secondarySpecializationSlug: "heavy",
      talentSlug: "for-my-brothers",
      operatorLevel: 7,
      focusAvailable: 16,
      focusSpent: 14,
      weaponSlug: "rifle",
    },
    {
      operatorSlug: "custom",
      specializationSlug: "heavy",
      talentSlug: "taunt",
      operatorLevel: 6,
      focusAvailable: 12,
      focusSpent: 9,
      weaponSlug: "repeater",
    },
    {
      operatorSlug: "custom",
      specializationSlug: "medic",
      secondarySpecializationSlug: "scoundrel",
      talentSlug: "fortitude",
      operatorLevel: 6,
      focusAvailable: 12,
      focusSpent: 12,
      weaponSlug: "pistol",
    },
  ],
};

describe("retail Builder state", () => {
  it("round-trips dual specialization, Talent, level and Focus in a v2 code", () => {
    const code = encodeSquadState(retailSquad);

    expect(code.startsWith("v2|")).toBe(true);
    expect(decodeSquadState(code)).toEqual(retailSquad);
  });

  it("migrates a v1 share code without inventing retail fields", () => {
    const legacy = "v1|story|hawks.scout.rifle~trick.soldier.rifle~kabb.heavy.repeater~custom.medic.pistol";

    expect(decodeSquadState(legacy)).toEqual({
      mode: "story",
      slots: [
        { operatorSlug: "hawks", specializationSlug: "scout", weaponSlug: "rifle" },
        { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
        { operatorSlug: "kabb", specializationSlug: "heavy", weaponSlug: "repeater" },
        { operatorSlug: "custom", specializationSlug: "medic", weaponSlug: "pistol" },
      ],
    });
  });

  it("reports Focus budget conflicts and unsupported secondary specializations", () => {
    const overBudget: SquadState = {
      ...retailSquad,
      slots: retailSquad.slots.map((slot, index) => index === 0
        ? { ...slot, focusAvailable: 3, focusSpent: 8 }
        : slot),
    };
    const illegalSecondary: SquadState = {
      ...retailSquad,
      slots: retailSquad.slots.map((slot, index) => index === 0
        ? { ...slot, secondarySpecializationSlug: "jedi-padawan" }
        : slot),
    };

    expect(evaluateSquad(overBudget).findings).toContainEqual(
      expect.objectContaining({ id: "focus-over-budget", severity: "conflict" }),
    );
    expect(evaluateSquad(illegalSecondary).findings).toContainEqual(
      expect.objectContaining({ id: "secondary-specialization-invalid", severity: "conflict" }),
    );
  });
});
