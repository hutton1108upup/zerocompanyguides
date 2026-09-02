import {
  operators,
  specializations,
  talents,
  weapons,
  type SquadRole,
  type SquadSlot,
  type SquadState,
} from "../content/squad-data";
import { getRetailEvidence, type RetailEvidence } from "../content/retail-data";

export type FindingSeverity = "conflict" | "confirmed" | "gap" | "note";
export type FindingEvidence = "source-backed" | "synthesis";
export type DimensionStatus = "strong" | "covered" | "gap";

export type SquadFinding = {
  id: string;
  title: string;
  body: string;
  severity: FindingSeverity;
  evidence: FindingEvidence;
  evidenceMeta: RetailEvidence;
};

export type SquadDimension = {
  id:
    | "role-coverage"
    | "range"
    | "action-economy"
    | "advantage"
    | "survivability"
    | "control"
    | "mobility";
  label: string;
  status: DimensionStatus;
  reason: string;
  evidenceMeta: RetailEvidence;
};

export type SquadEvaluation = {
  findings: SquadFinding[];
  dimensions: SquadDimension[];
};

const operatorBySlug = new Map(operators.map((entry) => [entry.slug, entry]));
const specializationBySlug = new Map(specializations.map((entry) => [entry.slug, entry]));
const talentBySlug = new Map(talents.map((entry) => [entry.slug, entry]));
const weaponBySlug = new Map(weapons.map((entry) => [entry.slug, entry]));

function primarySelectionIsAllowed(slot: SquadSlot): boolean {
  const operator = operatorBySlug.get(slot.operatorSlug);
  const specialization = specializationBySlug.get(slot.specializationSlug);
  const weapon = weaponBySlug.get(slot.weaponSlug);
  if (!operator || !specialization || !weapon) return false;

  if (operator.lockedSpecializationSlug) {
    return operator.lockedSpecializationSlug === specialization.slug;
  }

  return specialization.availability === "standard";
}

function secondarySelectionIsAllowed(slot: SquadSlot): boolean {
  if (!slot.secondarySpecializationSlug) return true;

  const operator = operatorBySlug.get(slot.operatorSlug);
  const primary = specializationBySlug.get(slot.specializationSlug);
  const secondary = specializationBySlug.get(slot.secondarySpecializationSlug);
  return Boolean(
    operator
      && primary
      && secondary
      && operator.canDualSpecialize !== false
      && !operator.lockedSpecializationSlug
      && primary.slug !== secondary.slug
      && secondary.availability === "standard",
  );
}

function talentSelectionIsAllowed(slot: SquadSlot): boolean {
  if (!slot.talentSlug) return true;

  const operator = operatorBySlug.get(slot.operatorSlug);
  const talent = talentBySlug.get(slot.talentSlug);
  if (!operator || !talent) return false;
  if (talent.availability === "universal") return operator.slug === "custom";
  if (talent.availability === "astromech") return operator.slug === "astromech";
  return talent.ownerSlug === operator.slug;
}

function numericFieldsAreWellFormed(slot: SquadSlot): boolean {
  const fields = [slot.operatorLevel, slot.focusAvailable, slot.focusSpent];
  return fields.every((value) => value === undefined || (Number.isInteger(value) && value >= 0));
}

function selectionIsAllowed(slot: SquadSlot): boolean {
  return primarySelectionIsAllowed(slot)
    && secondarySelectionIsAllowed(slot)
    && talentSelectionIsAllowed(slot)
    && numericFieldsAreWellFormed(slot);
}

function stateIsValid(state: SquadState): boolean {
  return (state.mode === "story" || state.mode === "skirmish")
    && state.slots.length === 4
    && state.slots.every(selectionIsAllowed);
}

function countRoles(state: SquadState): Map<SquadRole, number> {
  const counts = new Map<SquadRole, number>();
  for (const slot of state.slots) {
    for (const specializationSlug of [slot.specializationSlug, slot.secondarySpecializationSlug]) {
      const specialization = specializationBySlug.get(specializationSlug ?? "");
      for (const role of specialization?.roles ?? []) {
        counts.set(role, (counts.get(role) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function statusForCount(count: number): DimensionStatus {
  if (count >= 2) return "strong";
  if (count === 1) return "covered";
  return "gap";
}

function combineRetailEvidence(state: SquadState): RetailEvidence {
  const references = state.slots.flatMap((slot) => [
    getRetailEvidence("operator", slot.operatorSlug),
    getRetailEvidence("specialization", slot.specializationSlug),
    getRetailEvidence("specialization", slot.secondarySpecializationSlug ?? ""),
    getRetailEvidence("talent", slot.talentSlug ?? ""),
    getRetailEvidence("weapon", slot.weaponSlug),
  ]).filter((entry): entry is RetailEvidence => Boolean(entry));

  const sourceIds = [...new Set(references.flatMap((entry) => entry.sourceIds))];
  const builds = [...new Set(references.map((entry) => entry.observedBuild))];
  const verifiedDates = references.map((entry) => entry.verifiedAt).sort();
  const confidence = references.some((entry) => entry.confidence === "low")
    ? "low"
    : references.some((entry) => entry.confidence === "medium")
      ? "medium"
      : "high";
  const spoilerLevel = references.some((entry) => entry.spoilerLevel === "major")
    ? "major"
    : references.some((entry) => entry.spoilerLevel === "minor")
      ? "minor"
      : "none";

  return {
    observedBuild: builds.join("; ") || "No matching retail record",
    sourceType: references.every((entry) => entry.sourceType === "official") ? "official" : "independent",
    verifiedAt: verifiedDates.at(-1) ?? "2026-09-02",
    confidence,
    spoilerLevel,
    sourceIds,
  };
}

export function evaluateSquad(state: SquadState): SquadEvaluation {
  const evidenceMeta = combineRetailEvidence(state);
  const findings: SquadFinding[] = [];
  const addFinding = (finding: Omit<SquadFinding, "evidenceMeta">) => {
    findings.push({ ...finding, evidenceMeta });
  };
  const roleCounts = countRoles(state);
  const selectedOperators = state.slots
    .map((slot) => operatorBySlug.get(slot.operatorSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const selectedSpecializations = state.slots
    .flatMap((slot) => [
      specializationBySlug.get(slot.specializationSlug),
      specializationBySlug.get(slot.secondarySpecializationSlug ?? ""),
    ])
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const selectedWeapons = state.slots
    .map((slot) => weaponBySlug.get(slot.weaponSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (state.mode === "story" && !selectedOperators.some((entry) => entry.storyRequired)) {
    addFinding({
      id: "story-requires-hawks",
      title: "Story missions require Hawks",
      body: "The official campaign rules keep Hawks in every story squad. Switch to Skirmish or replace one bay with Hawks.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  const namedCounts = new Map<string, number>();
  for (const operator of selectedOperators) {
    if (!operator.repeatable) namedCounts.set(operator.slug, (namedCounts.get(operator.slug) ?? 0) + 1);
  }
  if ([...namedCounts.values()].some((count) => count > 1)) {
    addFinding({
      id: "duplicate-named-operator",
      title: "A named Operator occupies two bays",
      body: "Authored Operators are unique. Custom and Astromech recruits can repeat; named companions cannot.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (!state.slots.every(primarySelectionIsAllowed)) {
    addFinding({
      id: "locked-specialization",
      title: "A locked Specialization was changed",
      body: "Tel-Rea, Cly and Astromech recruits retain their unique class route in this source-bounded planner.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (!state.slots.every(secondarySelectionIsAllowed)) {
    addFinding({
      id: "secondary-specialization-invalid",
      title: "A secondary Specialization is not legal for this Operator",
      body: "Secondary choices must be different standard Specializations on an Operator that can dual-specialize. Locked exotic routes stay on their own class.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (!state.slots.every(talentSelectionIsAllowed)) {
    addFinding({
      id: "talent-selection-invalid",
      title: "The selected Talent is not tied to this Operator",
      body: "Universal Talents are reserved for Custom Operators in this first retail pass; authored and Astromech Talents stay with their recorded owner.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (!state.slots.every(numericFieldsAreWellFormed)) {
    addFinding({
      id: "retail-input-invalid",
      title: "A level or Focus input is not a valid planning value",
      body: "Operator level and Focus fields must be whole numbers at or above zero; the planner does not infer missing game values.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (state.slots.some((slot) => slot.focusSpent !== undefined
    && slot.focusAvailable !== undefined
    && slot.focusSpent > slot.focusAvailable)) {
    addFinding({
      id: "focus-over-budget",
      title: "Focus spent is above the entered budget",
      body: "Reduce Focus spent or increase the planning budget. Exact per-node Focus costs remain a recorded evidence gap until the retail tree is replayed.",
      severity: "conflict",
      evidence: "synthesis",
    });
  }

  const generators = selectedSpecializations.filter((entry) => entry.advantageRole === "generator").length;
  const spenders = selectedSpecializations.filter((entry) => entry.advantageRole === "spender").length;
  if (spenders >= 2 && generators === 0) {
    addFinding({
      id: "advantage-pressure",
      title: "Several roles spend Advantage and none deliberately generates it",
      body: "The shared pool starts empty and caps at ten. Choose which Ultimate the squad is funding or add Scout/Astromech income.",
      severity: "gap",
      evidence: "synthesis",
    });
  } else if (generators > 0) {
    addFinding({
      id: "advantage-generator",
      title: "The squad deliberately feeds its shared Advantage pool",
      body: "Scout or Astromech support gives the squad a planned source instead of relying only on ordinary damage.",
      severity: "confirmed",
      evidence: "source-backed",
    });
  }

  if ((roleCounts.get("sustain") ?? 0) === 0) {
    addFinding({
      id: "no-sustain",
      title: "No deliberate sustain route",
      body: "A short mission may not need healing or a tank, but a permadeath campaign should name how it protects an injured roster.",
      severity: "gap",
      evidence: "synthesis",
    });
  }

  const coreRoles: SquadRole[] = ["damage", "setup", "sustain", "control"];
  const coveredCoreRoles = coreRoles.filter((role) => (roleCounts.get(role) ?? 0) > 0);
  const rangeBands = new Set(selectedSpecializations.flatMap((entry) => entry.ranges));
  for (const weapon of selectedWeapons) rangeBands.add(weapon.range);
  const committedWeapons = selectedWeapons.filter((entry) => entry.actionProfile === "committed").length;
  const advantageStatus: DimensionStatus = generators > 0 ? "strong" : spenders >= 2 ? "gap" : "covered";

  const dimensions: Array<Omit<SquadDimension, "evidenceMeta">> = [
    {
      id: "role-coverage",
      label: "Role coverage",
      status: coveredCoreRoles.length === coreRoles.length ? "strong" : coveredCoreRoles.length >= 3 ? "covered" : "gap",
      reason: `${coveredCoreRoles.length} of 4 core jobs covered: ${coveredCoreRoles.join(", ") || "none"}.`,
    },
    {
      id: "range",
      label: "Range coverage",
      status: rangeBands.size >= 3 ? "strong" : rangeBands.size === 2 ? "covered" : "gap",
      reason: `The selected kits and weapons cover ${[...rangeBands].join(", ") || "no recorded"} range.`,
    },
    {
      id: "action-economy",
      label: "Action economy",
      status: committedWeapons >= 3 ? "gap" : committedWeapons === 2 ? "covered" : "strong",
      reason: `${committedWeapons} weapon${committedWeapons === 1 ? "" : "s"} commit a large share of the three-AP turn.`,
    },
    {
      id: "advantage",
      label: "Advantage economy",
      status: advantageStatus,
      reason: generators > 0
        ? `${generators} deliberate generator${generators === 1 ? "" : "s"} support ${spenders} spender${spenders === 1 ? "" : "s"}.`
        : `${spenders} spender${spenders === 1 ? "" : "s"} rely on ordinary attacks to fill the shared pool.`,
    },
    {
      id: "survivability",
      label: "Survivability",
      status: statusForCount(roleCounts.get("sustain") ?? 0),
      reason: `${roleCounts.get("sustain") ?? 0} selected kit${(roleCounts.get("sustain") ?? 0) === 1 ? "" : "s"} provide sustain or damage absorption.`,
    },
    {
      id: "control",
      label: "Control",
      status: statusForCount(roleCounts.get("control") ?? 0),
      reason: `${roleCounts.get("control") ?? 0} selected kit${(roleCounts.get("control") ?? 0) === 1 ? "" : "s"} create displacement, aggro or reaction pressure.`,
    },
    {
      id: "mobility",
      label: "Mission mobility",
      status: statusForCount(roleCounts.get("mobility") ?? 0),
      reason: `${roleCounts.get("mobility") ?? 0} selected kit${(roleCounts.get("mobility") ?? 0) === 1 ? "" : "s"} deliberately reposition or cross space.`,
    },
  ];

  return {
    findings,
    dimensions: dimensions.map((dimension) => ({ ...dimension, evidenceMeta })),
  };
}

function hasRetailStateFields(state: SquadState): boolean {
  return state.slots.some((slot) => Boolean(
    slot.secondarySpecializationSlug
      || slot.talentSlug
      || slot.operatorLevel !== undefined
      || slot.focusAvailable !== undefined
      || slot.focusSpent !== undefined,
  ));
}

function encodeSlotV1(slot: SquadSlot): string {
  return `${slot.operatorSlug}.${slot.specializationSlug}.${slot.weaponSlug}`;
}

function encodeSlotV2(slot: SquadSlot): string {
  return [
    slot.operatorSlug,
    slot.specializationSlug,
    slot.secondarySpecializationSlug ?? "-",
    slot.talentSlug ?? "-",
    String(slot.operatorLevel ?? 1),
    String(slot.focusAvailable ?? 0),
    String(slot.focusSpent ?? 0),
    slot.weaponSlug,
  ].join(".");
}

export function encodeSquadState(state: SquadState): string {
  const version = hasRetailStateFields(state) ? "v2" : "v1";
  const slots = state.slots
    .map((slot) => version === "v2" ? encodeSlotV2(slot) : encodeSlotV1(slot))
    .join("~");
  return `${version}|${state.mode}|${slots}`;
}

export function decodeSquadState(code: string): SquadState | undefined {
  const [version, mode, slotsCode, ...extra] = code.split("|");
  if ((version !== "v1" && version !== "v2") || extra.length > 0 || (mode !== "story" && mode !== "skirmish")) {
    return undefined;
  }

  const slots = (slotsCode ?? "").split("~").map((slotCode) => {
    const parts = slotCode.split(".");
    if (version === "v1") {
      const [operatorSlug, specializationSlug, weaponSlug, ...slotExtra] = parts;
      if (!operatorSlug || !specializationSlug || !weaponSlug || slotExtra.length > 0) return undefined;
      return { operatorSlug, specializationSlug, weaponSlug };
    }

    const [operatorSlug, specializationSlug, secondary, talent, level, focusAvailable, focusSpent, weaponSlug, ...slotExtra] = parts;
    const parsedLevel = Number(level);
    const parsedFocusAvailable = Number(focusAvailable);
    const parsedFocusSpent = Number(focusSpent);
    if (!operatorSlug || !specializationSlug || !weaponSlug || slotExtra.length > 0) return undefined;
    if (![parsedLevel, parsedFocusAvailable, parsedFocusSpent].every((value) => Number.isInteger(value) && value >= 0)) return undefined;
    return {
      operatorSlug,
      specializationSlug,
      ...(secondary && secondary !== "-" ? { secondarySpecializationSlug: secondary } : {}),
      ...(talent && talent !== "-" ? { talentSlug: talent } : {}),
      operatorLevel: parsedLevel,
      focusAvailable: parsedFocusAvailable,
      focusSpent: parsedFocusSpent,
      weaponSlug,
    };
  });
  if (slots.some((slot) => !slot)) return undefined;

  const state: SquadState = { mode, slots: slots as SquadSlot[] };
  return stateIsValid(state) ? state : undefined;
}
