import {
  operators,
  specializations,
  weapons,
  type SquadRole,
  type SquadSlot,
  type SquadState,
} from "../content/squad-data";

export type FindingSeverity = "conflict" | "confirmed" | "gap" | "note";
export type FindingEvidence = "source-backed" | "synthesis";
export type DimensionStatus = "strong" | "covered" | "gap";

export type SquadFinding = {
  id: string;
  title: string;
  body: string;
  severity: FindingSeverity;
  evidence: FindingEvidence;
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
};

export type SquadEvaluation = {
  findings: SquadFinding[];
  dimensions: SquadDimension[];
};

const operatorBySlug = new Map(operators.map((entry) => [entry.slug, entry]));
const specializationBySlug = new Map(specializations.map((entry) => [entry.slug, entry]));
const weaponBySlug = new Map(weapons.map((entry) => [entry.slug, entry]));

function selectionIsAllowed(slot: SquadSlot): boolean {
  const operator = operatorBySlug.get(slot.operatorSlug);
  const specialization = specializationBySlug.get(slot.specializationSlug);
  const weapon = weaponBySlug.get(slot.weaponSlug);
  if (!operator || !specialization || !weapon) return false;

  if (operator.lockedSpecializationSlug) {
    return operator.lockedSpecializationSlug === specialization.slug;
  }

  return specialization.availability === "standard";
}

function stateIsValid(state: SquadState): boolean {
  return (state.mode === "story" || state.mode === "skirmish")
    && state.slots.length === 4
    && state.slots.every(selectionIsAllowed);
}

function countRoles(state: SquadState): Map<SquadRole, number> {
  const counts = new Map<SquadRole, number>();
  for (const slot of state.slots) {
    const specialization = specializationBySlug.get(slot.specializationSlug);
    for (const role of specialization?.roles ?? []) {
      counts.set(role, (counts.get(role) ?? 0) + 1);
    }
  }
  return counts;
}

function statusForCount(count: number): DimensionStatus {
  if (count >= 2) return "strong";
  if (count === 1) return "covered";
  return "gap";
}

export function evaluateSquad(state: SquadState): SquadEvaluation {
  const findings: SquadFinding[] = [];
  const roleCounts = countRoles(state);
  const selectedOperators = state.slots
    .map((slot) => operatorBySlug.get(slot.operatorSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const selectedSpecializations = state.slots
    .map((slot) => specializationBySlug.get(slot.specializationSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const selectedWeapons = state.slots
    .map((slot) => weaponBySlug.get(slot.weaponSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (state.mode === "story" && !selectedOperators.some((entry) => entry.storyRequired)) {
    findings.push({
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
    findings.push({
      id: "duplicate-named-operator",
      title: "A named Operator occupies two bays",
      body: "Authored Operators are unique. Custom and Astromech recruits can repeat; named companions cannot.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  if (!state.slots.every(selectionIsAllowed)) {
    findings.push({
      id: "locked-specialization",
      title: "A locked Specialization was changed",
      body: "Tel-Rea, Cly and Astromech recruits retain their unique class route in this source-bounded planner.",
      severity: "conflict",
      evidence: "source-backed",
    });
  }

  const generators = selectedSpecializations.filter((entry) => entry.advantageRole === "generator").length;
  const spenders = selectedSpecializations.filter((entry) => entry.advantageRole === "spender").length;
  if (spenders >= 2 && generators === 0) {
    findings.push({
      id: "advantage-pressure",
      title: "Several roles spend Advantage and none deliberately generates it",
      body: "The shared pool starts empty and caps at ten. Choose which Ultimate the squad is funding or add Scout/Astromech income.",
      severity: "gap",
      evidence: "synthesis",
    });
  } else if (generators > 0) {
    findings.push({
      id: "advantage-generator",
      title: "The squad deliberately feeds its shared Advantage pool",
      body: "Scout or Astromech support gives the squad a planned source instead of relying only on ordinary damage.",
      severity: "confirmed",
      evidence: "source-backed",
    });
  }

  if ((roleCounts.get("sustain") ?? 0) === 0) {
    findings.push({
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

  const dimensions: SquadDimension[] = [
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

  return { findings, dimensions };
}

export function encodeSquadState(state: SquadState): string {
  const slots = state.slots
    .map((slot) => `${slot.operatorSlug}.${slot.specializationSlug}.${slot.weaponSlug}`)
    .join("~");
  return `v1|${state.mode}|${slots}`;
}

export function decodeSquadState(code: string): SquadState | undefined {
  const [version, mode, slotsCode, ...extra] = code.split("|");
  if (version !== "v1" || extra.length > 0 || (mode !== "story" && mode !== "skirmish")) {
    return undefined;
  }

  const slots = (slotsCode ?? "").split("~").map((slotCode) => {
    const [operatorSlug, specializationSlug, weaponSlug, ...slotExtra] = slotCode.split(".");
    if (!operatorSlug || !specializationSlug || !weaponSlug || slotExtra.length > 0) return undefined;
    return { operatorSlug, specializationSlug, weaponSlug };
  });
  if (slots.some((slot) => !slot)) return undefined;

  const state: SquadState = { mode, slots: slots as SquadSlot[] };
  return stateIsValid(state) ? state : undefined;
}
