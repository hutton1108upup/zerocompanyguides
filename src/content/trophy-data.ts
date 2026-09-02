export type TrophyCategory = "Difficulty" | "Story" | "Operator story" | "Bond" | "Combat" | "Company" | "Completion";
export type TrophySpoilerLevel = "none" | "minor" | "major";

export type AchievementRecord = {
  id: string;
  name: string;
  category: TrophyCategory;
  requirement: string;
  spoilerLevel: TrophySpoilerLevel;
};

const none = "none" as const;
const minor = "minor" as const;
const major = "major" as const;

export const trophyAchievements: AchievementRecord[] = [
  { id: "hired-gun", name: "Hired Gun", category: "Difficulty", requirement: "Finish the campaign on Story difficulty or above", spoilerLevel: none },
  { id: "veteran", name: "Veteran", category: "Difficulty", requirement: "Finish the campaign on Normal difficulty or above", spoilerLevel: none },
  { id: "operator", name: "Operator", category: "Difficulty", requirement: "Finish the campaign on Hard difficulty or above", spoilerLevel: none },
  { id: "captain", name: "Captain", category: "Difficulty", requirement: "Finish the campaign on Expert", spoilerLevel: none },
  { id: "legend", name: "Legend", category: "Difficulty", requirement: "Finish Expert with Beskar Mode active", spoilerLevel: none },
  { id: "first-mission", name: "In a galaxy far, far away…", category: "Story", requirement: "Complete the first mission", spoilerLevel: major },
  { id: "scum-and-villainy", name: "Scum And Villainy", category: "Story", requirement: "Complete Eavesdropping", spoilerLevel: major },
  { id: "fathom-revealed", name: "Fathom Revealed", category: "Story", requirement: "Complete Dark Waters", spoilerLevel: major },
  { id: "one-less-clanker", name: "One Less Clanker", category: "Story", requirement: "Complete Smugglers' Den", spoilerLevel: major },
  { id: "sky-high", name: "Sky High", category: "Story", requirement: "Complete Casualties of War", spoilerLevel: major },
  { id: "way-to-pass-time", name: "A Way to Pass the Time", category: "Story", requirement: "Complete Enemy Intelligence", spoilerLevel: major },
  { id: "luunata-reclaimed", name: "Luunata Reclaimed", category: "Story", requirement: "Complete Behind Enemy Lines", spoilerLevel: major },
  { id: "a-new-order", name: "A New Order", category: "Story", requirement: "Complete Stillwatch", spoilerLevel: major },
  { id: "jungle-warfare", name: "Jungle Warfare", category: "Story", requirement: "Complete Deep Cover", spoilerLevel: major },
  { id: "friends-like-these", name: "With Friends Like These", category: "Story", requirement: "Complete Unfinished Business", spoilerLevel: major },
  { id: "end-of-infinite", name: "An End of the Infinite", category: "Story", requirement: "Complete The Infinite Coil", spoilerLevel: major },
  { id: "the-trooper", name: "The Trooper", category: "Operator story", requirement: "Complete Trick's story", spoilerLevel: major },
  { id: "the-umbaran", name: "The Umbaran", category: "Operator story", requirement: "Complete Luco's story", spoilerLevel: major },
  { id: "the-prizefighter", name: "The Prizefighter", category: "Operator story", requirement: "Complete Kabb's story", spoilerLevel: major },
  { id: "the-baroness", name: "The Baroness", category: "Operator story", requirement: "Complete Jae's story", spoilerLevel: major },
  { id: "the-mandalorian", name: "The Mandalorian", category: "Operator story", requirement: "Complete Cly's story", spoilerLevel: major },
  { id: "the-padawan", name: "The Padawan", category: "Operator story", requirement: "Complete Tel-Rea's story", spoilerLevel: major },
  { id: "old-friends", name: "Old Friends", category: "Bond", requirement: "Reach Very High Bond with Hawks and Trick", spoilerLevel: minor },
  { id: "sharp-shooters", name: "Sharp Shooters", category: "Bond", requirement: "Reach Very High Bond with Hawks and Luco", spoilerLevel: minor },
  { id: "mate-and-marrow", name: "Mate and Marrow", category: "Bond", requirement: "Reach Very High Bond with Hawks and Kabb", spoilerLevel: minor },
  { id: "class-and-distinction", name: "Class and Distinction", category: "Bond", requirement: "Reach Very High Bond with Hawks and Jae", spoilerLevel: minor },
  { id: "word-of-honor", name: "Word Of Honor", category: "Bond", requirement: "Reach Very High Bond with Hawks and Cly", spoilerLevel: minor },
  { id: "lost-causes", name: "Lost Causes", category: "Bond", requirement: "Reach Very High Bond with Hawks and Tel-Rea", spoilerLevel: minor },
  { id: "heroes-on-both-sides", name: "Heroes on Both Sides", category: "Bond", requirement: "Reach Very High Bond with Trick and Luco", spoilerLevel: minor },
  { id: "baroness-and-boxer", name: "The Baroness and the Boxer", category: "Bond", requirement: "Reach Very High Bond with Kabb and Jae", spoilerLevel: minor },
  { id: "thick-as-thieves", name: "Thick As Thieves", category: "Bond", requirement: "Reach Very High Bond with two Custom Operators", spoilerLevel: minor },
  { id: "beep-boop", name: "Beep Boop", category: "Bond", requirement: "Reach Very High Bond with two Astromechs", spoilerLevel: minor },
  { id: "never-tell-odds", name: "Never Tell Me the Odds", category: "Combat", requirement: "Land a shot at 10% hit chance or lower", spoilerLevel: minor },
  { id: "do-or-do-not", name: "Do or Do Not", category: "Combat", requirement: "Miss a shot at 90% hit chance or higher", spoilerLevel: minor },
  { id: "forceful", name: "Forceful", category: "Combat", requirement: "Push or pull one enemy into another with the Force", spoilerLevel: minor },
  { id: "watch-that-first-step", name: "Watch That First Step", category: "Combat", requirement: "Knock an enemy out of the combat area", spoilerLevel: minor },
  { id: "the-high-ground", name: "The High Ground", category: "Combat", requirement: "Defeat 10 enemies from higher elevation", spoilerLevel: minor },
  { id: "see-your-own-demise", name: "See Your Own Demise", category: "Combat", requirement: "Defeat a Seer in one blow", spoilerLevel: minor },
  { id: "angry-beeps", name: "Angry Beeps", category: "Combat", requirement: "Complete a mission with four Astromechs", spoilerLevel: minor },
  { id: "if-you-know", name: "If You Know You Know", category: "Combat", requirement: "Defeat 1,138 enemies in Tactical Missions", spoilerLevel: minor },
  { id: "dress-code", name: "Dress Code", category: "Company", requirement: "Customize a Zero Company member", spoilerLevel: minor },
  { id: "signature-flair", name: "Signature Flair", category: "Company", requirement: "Customize a weapon", spoilerLevel: minor },
  { id: "fully-geared", name: "Fully Geared", category: "Company", requirement: "Equip four weapon mods on one weapon", spoilerLevel: minor },
  { id: "where-credit-due", name: "Where Credit Is Due", category: "Company", requirement: "Buy an item at The Black Market", spoilerLevel: minor },
  { id: "sign-here", name: "Sign Here", category: "Company", requirement: "Recruit an Operator", spoilerLevel: minor },
  { id: "full-roster", name: "Full Roster", category: "Company", requirement: "Recruit 20 Operators in one campaign", spoilerLevel: minor },
  { id: "focus-determines", name: "Your Focus Determines Your Reality", category: "Company", requirement: "Spend a Focus Point", spoilerLevel: minor },
  { id: "natural-part-life", name: "A Natural Part of Life", category: "Company", requirement: "Lose a member of Zero Company", spoilerLevel: minor },
  { id: "active-duty", name: "Active Duty", category: "Company", requirement: "Complete 50 optional missions", spoilerLevel: minor },
  { id: "victor-spoils", name: "To the Victor Go the Spoils", category: "Company", requirement: "Unlock one Regional Reward", spoilerLevel: minor },
  { id: "across-stars", name: "Across the Stars", category: "Company", requirement: "Unlock every Regional Reward", spoilerLevel: minor },
  { id: "no-bargain", name: "There Will Be No Bargain", category: "Company", requirement: "Unlock the Hutt Roulette Prize three times", spoilerLevel: minor },
  { id: "zero-company-legend", name: "Zero Company Legend", category: "Completion", requirement: "Earn every other trophy or achievement", spoilerLevel: major },
];

export const trophyAchievementRows = trophyAchievements.map((entry) => [
  entry.name,
  entry.category,
  entry.requirement,
]);
