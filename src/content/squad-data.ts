export type SquadRole =
  | "damage"
  | "setup"
  | "sustain"
  | "control"
  | "mobility"
  | "advantage";

export type RangeBand = "close" | "medium" | "long";
export type AdvantageRole = "generator" | "spender" | "neutral";
export type RecordEvidence = "source-backed" | "source-synthesis";

type SourcedRecord = {
  slug: string;
  name: string;
  summary: string;
  sourceIds: string[];
  evidence: RecordEvidence;
  lastVerified: string;
};

export type SpecializationRecord = SourcedRecord & {
  availability: "standard" | "locked";
  primaryJob: string;
  signatureTools: string;
  bestFit: string;
  roles: SquadRole[];
  ranges: RangeBand[];
  advantageRole: AdvantageRole;
};

export type OperatorRecord = SourcedRecord & {
  repeatable: boolean;
  storyRequired?: boolean;
  lockedSpecializationSlug?: string;
  lockedTalentSlug?: string;
  canDualSpecialize?: boolean;
};

export type WeaponRecord = SourcedRecord & {
  range: RangeBand;
  actionProfile: "flexible" | "committed";
};

export type TalentAvailability = "universal" | "authored" | "astromech";

export type TalentRecord = SourcedRecord & {
  availability: TalentAvailability;
  ownerSlug?: string;
};

export type SquadMode = "story" | "skirmish";

export type SquadSlot = {
  operatorSlug: string;
  specializationSlug: string;
  weaponSlug: string;
  secondarySpecializationSlug?: string;
  talentSlug?: string;
  operatorLevel?: number;
  focusAvailable?: number;
  focusSpent?: number;
};

export type SquadState = {
  mode: SquadMode;
  slots: SquadSlot[];
};

export type SquadPreset = {
  slug: string;
  name: string;
  summary: string;
  state: SquadState;
};

const checkedAt = "2026-09-01";

export const specializations: SpecializationRecord[] = [
  {
    slug: "assault",
    name: "Assault",
    summary: "Mobile frontline pressure that crosses space and displaces exposed targets.",
    availability: "standard",
    primaryJob: "Mobile frontline",
    signatureTools: "Bull Rush, displacement, exposed-target pressure",
    bestFit: "Aggressive close-to-mid range",
    roles: ["damage", "control", "mobility"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "gunslinger",
    name: "Gunslinger",
    summary: "Fast multi-attack damage that turns cheap actions and kills into tempo.",
    availability: "standard",
    primaryJob: "Tempo damage",
    signatureTools: "Extra attacks, quick sidearm shots, critical pressure",
    bestFit: "Fast offensive turns",
    roles: ["damage", "mobility"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "heavy",
    name: "Heavy",
    summary: "A durable anchor that redirects attacks and holds exposed ground.",
    availability: "standard",
    primaryJob: "Tank and aggro",
    signatureTools: "Taunt, retaliation, armor and health",
    bestFit: "Holding exposed ground",
    roles: ["sustain", "control"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "medic",
    name: "Medic",
    summary: "Healing, recovery and damage support for campaigns that cannot absorb another loss.",
    availability: "standard",
    primaryJob: "Sustain and recovery",
    signatureTools: "Morale healing, Combat Stim, stronger Medpacs",
    bestFit: "Permadeath safety",
    roles: ["sustain", "setup"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "scoundrel",
    name: "Scoundrel",
    summary: "Vulnerability, assists and defense penetration that set up coordinated focus fire.",
    availability: "standard",
    primaryJob: "Assist and setup",
    signatureTools: "Vulnerable, assist damage, defense penetration",
    bestFit: "Coordinated focus fire",
    roles: ["damage", "setup"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "scout",
    name: "Scout",
    summary: "Recon and Spotted pressure that deliberately feeds the shared Advantage pool.",
    availability: "standard",
    primaryJob: "Recon and Advantage",
    signatureTools: "Combat Recon, Spotted, Advantage generation",
    bestFit: "Team economy",
    roles: ["setup", "mobility", "advantage"],
    ranges: ["close", "medium", "long"],
    advantageRole: "generator",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "sharpshooter",
    name: "Sharpshooter",
    summary: "Long-range precision and prepared Overwatch from a stable firing position.",
    availability: "standard",
    primaryJob: "Long-range precision",
    signatureTools: "Guaranteed hit, accuracy setup, improved Overwatch",
    bestFit: "Stable firing positions",
    roles: ["damage", "control"],
    ranges: ["medium", "long"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "soldier",
    name: "Soldier",
    summary: "Straightforward offense with area damage, melee control and broad combat tools.",
    availability: "standard",
    primaryJob: "All-round offense",
    signatureTools: "Rocket area damage, melee Daze, broad combat tools",
    bestFit: "Straightforward versatility",
    roles: ["damage", "control"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-specializations", "ea-class-guide"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "jedi-padawan",
    name: "Jedi Padawan",
    summary: "Tel-Rea's locked Force kit combines displacement, deflection and priority damage.",
    availability: "locked",
    primaryJob: "Priority control",
    signatureTools: "Force displacement, deflection and Harmony",
    bestFit: "Tel-Rea only",
    roles: ["damage", "control", "mobility"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "mandalorian-warrior",
    name: "Mandalorian Warrior",
    summary: "Cly's locked jetpack kit creates mobile damage and formation disruption.",
    availability: "locked",
    primaryJob: "Mobile disruption",
    signatureTools: "Combat Jump, jetpack movement and Warrior kit",
    bestFit: "Cly only",
    roles: ["damage", "control", "mobility"],
    ranges: ["close", "medium"],
    advantageRole: "spender",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "astromech",
    name: "Astromech",
    summary: "A locked droid support route that carries utilities and redirects actions to allies.",
    availability: "locked",
    primaryJob: "Utility support",
    signatureTools: "Extra utilities, action handoff and droid support",
    bestFit: "Astromech recruits",
    roles: ["setup", "sustain", "advantage"],
    ranges: ["close", "medium"],
    advantageRole: "generator",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
];

export const standardClassTableRows: Array<[string, string, string, string]> =
  specializations
    .filter((entry) => entry.availability === "standard")
    .map((entry) => [
      entry.name,
      entry.primaryJob,
      entry.signatureTools,
      entry.bestFit,
    ]);

export const operators: OperatorRecord[] = [
  {
    slug: "hawks",
    name: "Hawks",
    summary: "Customisable commander required on story missions.",
    repeatable: false,
    storyRequired: true,
    sourceIds: ["ea-gameplay-overview", "ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "trick",
    name: "Trick",
    summary: "Clone veteran whose fixed Talent adds failure tolerance.",
    repeatable: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "kabb",
    name: "Kabb Uppercut",
    summary: "Close-range companion whose Uppercut converts setup into displacement.",
    repeatable: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "jae",
    name: "Jae Mordant",
    summary: "Authored companion built around coordinated cleanup.",
    repeatable: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "tel-rea",
    name: "Tel-Rea Vokoss",
    summary: "Jedi Padawan with a unique, locked Force progression.",
    repeatable: false,
    lockedSpecializationSlug: "jedi-padawan",
    lockedTalentSlug: "strong-with-the-force",
    canDualSpecialize: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "cly",
    name: "Cly Kullervo",
    summary: "Mandalorian companion with a unique, locked Warrior kit.",
    repeatable: false,
    lockedSpecializationSlug: "mandalorian-warrior",
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "luco",
    name: "Luco Bronc",
    summary: "Authored long-range companion who rewards protected sightlines.",
    repeatable: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "custom",
    name: "Custom Operator",
    summary: "A repeatable recruit used to fill a missing standard squad job.",
    repeatable: true,
    sourceIds: ["ea-gameplay-overview", "ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "astromech",
    name: "Astromech Operator",
    summary: "A repeatable droid recruit with a locked support route.",
    repeatable: true,
    lockedSpecializationSlug: "astromech",
    lockedTalentSlug: "built-in-comlink",
    canDualSpecialize: false,
    sourceIds: ["ea-gameplay-overview", "epic-operators"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
];

export const weapons: WeaponRecord[] = [
  {
    slug: "pistol",
    name: "Pistol",
    summary: "Short-range weapon whose low action commitment leaves room for abilities and movement.",
    range: "close",
    actionProfile: "flexible",
    sourceIds: ["ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "rifle",
    name: "Rifle",
    summary: "Flexible medium-range weapon for mixed movement, ability and attack turns.",
    range: "medium",
    actionProfile: "flexible",
    sourceIds: ["ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "longarm",
    name: "Longarm",
    summary: "Long-range weapon that commits more of a turn to each prepared shot.",
    range: "long",
    actionProfile: "committed",
    sourceIds: ["ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
  {
    slug: "repeater",
    name: "Repeater",
    summary: "Medium-range weapon whose attack consumes the remaining action budget.",
    range: "medium",
    actionProfile: "committed",
    sourceIds: ["ea-tactics-basics"],
    evidence: "source-backed",
    lastVerified: checkedAt,
  },
];

export const talents: TalentRecord[] = [
  {
    slug: "the-bigger-they-are",
    name: "The Bigger They Are",
    summary: "Universal damage pressure against elite and boss targets.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "anticipation",
    name: "Anticipation",
    summary: "Universal defensive preparation that builds Evasion.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "cold-blooded",
    name: "Cold Blooded",
    summary: "Universal critical pressure that builds Vicious stacks.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "taunt",
    name: "Taunt",
    summary: "Universal frontline control and damage reduction.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "a-life-of-labor",
    name: "A Life of Labor",
    summary: "Universal health, defense and close-range scaling.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "thievery",
    name: "Thievery",
    summary: "Universal Credit income from a completed mission.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "sabotage",
    name: "Sabotage",
    summary: "Universal explosive utility with repeated-use upgrades.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "espionage",
    name: "Espionage",
    summary: "Universal Intel income from completed operations.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "grit",
    name: "Grit",
    summary: "Universal health and injury resilience.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "fortitude",
    name: "Fortitude",
    summary: "Universal defense that offsets injury pressure.",
    availability: "universal",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "fearless-leader",
    name: "Fearless Leader",
    summary: "Hawks' authored Talent that improves squad failure tolerance.",
    availability: "authored",
    ownerSlug: "hawks",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "for-my-brothers",
    name: "For My Brothers",
    summary: "Trick's authored Talent with a recovery-focused identity.",
    availability: "authored",
    ownerSlug: "trick",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "strong-with-the-force",
    name: "Strong with the Force",
    summary: "Tel-Rea's authored Talent and Harmony progression.",
    availability: "authored",
    ownerSlug: "tel-rea",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
    },
  {
    slug: "combat-jump",
    name: "Combat Jump",
    summary: "Cly's authored mobility Talent.",
    availability: "authored",
    ownerSlug: "cly",
    sourceIds: ["epic-operators", "ea-gameplay-overview"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
  {
    slug: "built-in-comlink",
    name: "Built-In Comlink",
    summary: "Astromech authored Talent for handing off Action Points.",
    availability: "astromech",
    ownerSlug: "astromech",
    sourceIds: ["epic-operators", "reddit-expert-builds"],
    evidence: "source-synthesis",
    lastVerified: checkedAt,
  },
];

export const squadPresets: SquadPreset[] = [
  {
    slug: "balanced-first-run",
    name: "Balanced first run",
    summary: "A source-bounded starting point with damage, sustain, control and Advantage income.",
    state: {
      mode: "story",
      slots: [
        { operatorSlug: "hawks", specializationSlug: "scoundrel", weaponSlug: "rifle" },
        { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
        { operatorSlug: "tel-rea", specializationSlug: "jedi-padawan", weaponSlug: "pistol" },
        { operatorSlug: "custom", specializationSlug: "scout", weaponSlug: "longarm" },
      ],
    },
  },
  {
    slug: "permadeath-safety",
    name: "Permadeath safety",
    summary: "Two sustain routes protect a campaign that cannot afford another Injury.",
    state: {
      mode: "story",
      slots: [
        { operatorSlug: "hawks", specializationSlug: "medic", weaponSlug: "rifle" },
        { operatorSlug: "trick", specializationSlug: "soldier", weaponSlug: "rifle" },
        { operatorSlug: "kabb", specializationSlug: "heavy", weaponSlug: "repeater" },
        { operatorSlug: "custom", specializationSlug: "scout", weaponSlug: "longarm" },
      ],
    },
  },
  {
    slug: "mobile-control",
    name: "Mobile control",
    summary: "Displacement and mobility create shots instead of relying on a static damage race.",
    state: {
      mode: "story",
      slots: [
        { operatorSlug: "hawks", specializationSlug: "scout", weaponSlug: "rifle" },
        { operatorSlug: "cly", specializationSlug: "mandalorian-warrior", weaponSlug: "pistol" },
        { operatorSlug: "tel-rea", specializationSlug: "jedi-padawan", weaponSlug: "pistol" },
        { operatorSlug: "custom", specializationSlug: "medic", weaponSlug: "rifle" },
      ],
    },
  },
];

export const defaultSquadState: SquadState = squadPresets[0].state;
