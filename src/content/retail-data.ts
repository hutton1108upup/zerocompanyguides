export type RetailRecordKind =
  | "specialization"
  | "operator"
  | "weapon"
  | "talent"
  | "ability"
  | "operation";

export type RetailSourceType =
  | "official"
  | "first-hand"
  | "independent"
  | "community"
  | "competitor-lead";

export type RetailConfidence = "high" | "medium" | "low";
export type RetailSpoilerLevel = "none" | "minor" | "major";

export type RetailEvidenceMeta = {
  observedBuild: string;
  sourceType: RetailSourceType;
  verifiedAt: string;
  confidence: RetailConfidence;
  spoilerLevel: RetailSpoilerLevel;
  replacedBy?: string;
  retiredAt?: string;
};

export type RetailRecord = RetailEvidenceMeta & {
  id: string;
  kind: RetailRecordKind;
  name: string;
  summary: string;
  sourceIds: string[];
};

export type RetailEvidence = RetailEvidenceMeta & {
  sourceIds: string[];
};

const checkedAt = "2026-09-02";
const sourceSnapshotBuild = "Launch source package — retail build not independently captured";
const retailLeadBuild = "Retail build 24874058 — competitor data lead pending first-hand replay";

const record = (
  input: Omit<RetailRecord, keyof RetailEvidenceMeta> & Partial<RetailEvidenceMeta>,
): RetailRecord => ({
  observedBuild: sourceSnapshotBuild,
  sourceType: "official",
  verifiedAt: checkedAt,
  confidence: "medium",
  spoilerLevel: "none",
  ...input,
});

export const retailRecords: RetailRecord[] = [
  record({
    id: "assault",
    kind: "specialization",
    name: "Assault",
    summary: "Mobile frontline pressure and displacement.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "gunslinger",
    kind: "specialization",
    name: "Gunslinger",
    summary: "Fast multi-attack tempo and cleanup damage.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "heavy",
    kind: "specialization",
    name: "Heavy",
    summary: "Durable aggro control and exposed-ground holding.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "medic",
    kind: "specialization",
    name: "Medic",
    summary: "Healing, recovery and injury prevention.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "scoundrel",
    kind: "specialization",
    name: "Scoundrel",
    summary: "Vulnerability, assists and defense penetration.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "scout",
    kind: "specialization",
    name: "Scout",
    summary: "Recon, timing and Advantage generation.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "sharpshooter",
    kind: "specialization",
    name: "Sharpshooter",
    summary: "Long-range precision and prepared Overwatch.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "soldier",
    kind: "specialization",
    name: "Soldier",
    summary: "All-round offense with melee, grenades and rockets.",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    confidence: "high",
  }),
  record({
    id: "jedi-padawan",
    kind: "specialization",
    name: "Jedi Padawan",
    summary: "Locked Force control and priority damage route.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "mandalorian-warrior",
    kind: "specialization",
    name: "Mandalorian Warrior",
    summary: "Locked jetpack mobility and formation disruption.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "astromech",
    kind: "specialization",
    name: "Astromech",
    summary: "Locked utility support and ally action handoff.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "hawks",
    kind: "operator",
    name: "Hawks",
    summary: "Story-required commander with a customisable class route.",
    sourceIds: ["ea-gameplay-overview", "ea-tactics-basics"],
    confidence: "high",
    spoilerLevel: "minor",
  }),
  record({
    id: "tel-rea",
    kind: "operator",
    name: "Tel-Rea Vokoss",
    summary: "The only Jedi Padawan-class Operator.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "cly",
    kind: "operator",
    name: "Cly Kullervo",
    summary: "The Mandalorian Operator with a locked Warrior route.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "trick",
    kind: "operator",
    name: "Trick",
    summary: "Clone veteran with a fixed authored Talent.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "kabb",
    kind: "operator",
    name: "Kabb Uppercut",
    summary: "Close-range companion with a cover-breaking signature.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "jae",
    kind: "operator",
    name: "Jae Mordant",
    summary: "Authored companion built around coordinated cleanup.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "luco",
    kind: "operator",
    name: "Luco Bronc",
    summary: "Long-range authored companion with a protected-sightline role.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "custom",
    kind: "operator",
    name: "Custom Operator",
    summary: "Repeatable recruit for filling a missing standard job.",
    sourceIds: ["ea-gameplay-overview", "ea-tactics-basics"],
    confidence: "high",
    spoilerLevel: "none",
  }),
  record({
    id: "astromech",
    kind: "operator",
    name: "Astromech Operator",
    summary: "Repeatable droid recruit with a locked support route.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "pistol",
    kind: "weapon",
    name: "Blaster Pistol",
    summary: "Short-range, low-commitment weapon class.",
    sourceIds: ["ea-class-guide", "ea-tactics-basics"],
    confidence: "high",
  }),
  record({
    id: "rifle",
    kind: "weapon",
    name: "Blaster Rifle",
    summary: "Medium-range flexible weapon class.",
    sourceIds: ["ea-class-guide", "ea-tactics-basics"],
    confidence: "high",
  }),
  record({
    id: "longarm",
    kind: "weapon",
    name: "Longarm Blaster",
    summary: "Long-range weapon class with a committed shot.",
    sourceIds: ["ea-class-guide", "ea-tactics-basics"],
    confidence: "high",
  }),
  record({
    id: "repeater",
    kind: "weapon",
    name: "Repeater",
    summary: "Medium-range weapon class that consumes the remaining AP budget.",
    sourceIds: ["ea-class-guide", "ea-tactics-basics"],
    confidence: "high",
  }),
  record({
    id: "force-push-preview",
    kind: "ability",
    name: "Force Push (preview record)",
    summary: "Pre-retail ability placeholder superseded by the launch record.",
    sourceIds: ["ea-gameplay-overview"],
    sourceType: "official",
    confidence: "low",
    spoilerLevel: "minor",
    replacedBy: "force-push",
    retiredAt: checkedAt,
  }),
  record({
    id: "force-push",
    kind: "ability",
    name: "Force Push",
    summary: "Tel-Rea's displacement ability; retail numeric details remain source-bounded.",
    sourceIds: ["ea-gameplay-overview", "zerocompany-tools-nebulous-pursuit"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "combat-stim",
    kind: "ability",
    name: "Combat Stim",
    summary: "Medic support ability that raises an ally's damage and survivability.",
    sourceIds: ["ea-class-guide", "ea-gameplay-overview"],
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "fearless-leader",
    kind: "talent",
    name: "Fearless Leader",
    summary: "Hawks' authored Talent; exact rank values require retail verification.",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "built-in-comlink",
    kind: "talent",
    name: "Built-In Comlink",
    summary: "Astromech support Talent reported to hand off Action Points.",
    sourceIds: ["zerocompany-tools-nebulous-pursuit", "reddit-expert-beskar"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "the-bigger-they-are",
    kind: "talent",
    name: "The Bigger They Are",
    summary: "Universal damage scaling against elite and boss targets.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "anticipation",
    kind: "talent",
    name: "Anticipation",
    summary: "Universal defensive preparation that builds Evasion.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "cold-blooded",
    kind: "talent",
    name: "Cold Blooded",
    summary: "Universal critical pressure that builds Vicious stacks.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "taunt",
    kind: "talent",
    name: "Taunt",
    summary: "Universal frontline control and damage reduction.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "a-life-of-labor",
    kind: "talent",
    name: "A Life of Labor",
    summary: "Universal health, defense and close-range scaling.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "thievery",
    kind: "talent",
    name: "Thievery",
    summary: "Universal Credit income from a completed mission.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "sabotage",
    kind: "talent",
    name: "Sabotage",
    summary: "Universal explosive utility with repeated-use upgrades.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "espionage",
    kind: "talent",
    name: "Espionage",
    summary: "Universal Intel income from completed operations.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "grit",
    kind: "talent",
    name: "Grit",
    summary: "Universal health and injury resilience.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "fortitude",
    kind: "talent",
    name: "Fortitude",
    summary: "Universal defense that offsets injury pressure.",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    observedBuild: retailLeadBuild,
    sourceType: "competitor-lead",
    confidence: "low",
    spoilerLevel: "minor",
  }),
  record({
    id: "fearless-leader",
    kind: "talent",
    name: "Fearless Leader",
    summary: "Hawks' authored Talent that improves squad failure tolerance.",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "for-my-brothers",
    kind: "talent",
    name: "For My Brothers",
    summary: "Trick's authored recovery-focused Talent.",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "strong-with-the-force",
    kind: "talent",
    name: "Strong with the Force",
    summary: "Tel-Rea's authored Harmony Talent.",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "combat-jump",
    kind: "talent",
    name: "Combat Jump",
    summary: "Cly's authored mobility Talent.",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "minor",
  }),
  record({
    id: "nebulous-pursuit",
    kind: "operation",
    name: "Nebulous Pursuit",
    summary: "Randomized destination Operation with a two-stage outcome.",
    sourceIds: ["zerocompany-tools-nebulous-pursuit", "powerup-nebulous-pursuit", "gamerblurb-nebulous-pursuit"],
    observedBuild: retailLeadBuild,
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "major",
  }),
  record({
    id: "ship-adrift",
    kind: "operation",
    name: "Ship Adrift I-V",
    summary: "Five-part strategic choice chain with resource trade-offs.",
    sourceIds: ["gamersheroes-choices", "showgamer-choices"],
    observedBuild: "Launch build — post-launch choice cross-check 2026-09-02",
    sourceType: "independent",
    confidence: "medium",
    spoilerLevel: "major",
  }),
];

export const activeRetailRecords = retailRecords.filter((entry) => !entry.retiredAt);

export function getRetailRecord(kind: RetailRecordKind, id: string): RetailRecord | undefined {
  return retailRecords.find((entry) => entry.kind === kind && entry.id === id);
}

export function getRetailEvidence(kind: RetailRecordKind, id: string): RetailEvidence | undefined {
  const entry = getRetailRecord(kind, id);
  if (!entry) return undefined;

  return {
    observedBuild: entry.observedBuild,
    sourceType: entry.sourceType,
    verifiedAt: entry.verifiedAt,
    confidence: entry.confidence,
    spoilerLevel: entry.spoilerLevel,
    ...(entry.replacedBy ? { replacedBy: entry.replacedBy } : {}),
    ...(entry.retiredAt ? { retiredAt: entry.retiredAt } : {}),
    sourceIds: [...entry.sourceIds],
  };
}
