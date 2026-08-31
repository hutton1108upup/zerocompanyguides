import type { ImageBlock, VideoBlock } from "./types";

const checkedAt = "2026-08-30";
const eaGamePage = "https://www.ea.com/en/games/starwars/zero-company";
const eaSpecializationsPage = "https://www.ea.com/games/starwars/zero-company/specializations-hub";
const eaOperatorsPage = "https://www.ea.com/en/games/starwars/zero-company/operators-hub";
const eaBuyPage = "https://www.ea.com/games/starwars/zero-company/buy";
const eaGameplayPage = "https://www.ea.com/games/starwars/zero-company/news/lead-zero-company-to-victory";
const starWarsCastPage = "https://www.starwars.com/news/sdcc-star-wars-zero-company-cast-announce";

type ImageInput = Omit<ImageBlock, "type" | "checkedAt" | "evidence">;
type VideoInput = Omit<VideoBlock, "type" | "checkedAt" | "evidence">;

const officialImage = (input: ImageInput): ImageBlock => ({
  type: "image",
  checkedAt,
  evidence: "official",
  ...input,
});

const officialVideo = (input: VideoInput): VideoBlock => ({
  type: "video",
  checkedAt,
  evidence: "official",
  ...input,
});

const communityVideo = (input: VideoInput): VideoBlock => ({
  type: "video",
  checkedAt,
  evidence: "community",
  ...input,
});

const keyArt = (caption: string, priority = false) => officialImage({
  src: "/media/zero-company/key-art.jpg",
  alt: "Hawks and the Zero Company squad stand against a galactic battlefield backdrop.",
  caption,
  sourceUrl: eaGamePage,
  publisher: "Electronic Arts",
  priority,
});

const specializations = (caption: string) => officialImage({
  src: "/media/zero-company/specializations.jpg",
  alt: "Zero Company operatives pose together, including a hologram user and a green lightsaber wielder.",
  caption,
  sourceUrl: eaSpecializationsPage,
  publisher: "Electronic Arts",
});

const squadLineup = (caption: string) => officialImage({
  src: "/media/zero-company/squad-lineup.jpg",
  alt: "The authored Zero Company operators stand together in a squad lineup.",
  caption,
  sourceUrl: eaOperatorsPage,
  publisher: "Electronic Arts",
});

const tacticalCombat = (caption: string) => officialImage({
  src: "/media/zero-company/tactical-combat.jpg",
  alt: "A squad fights battle droids with blasters, a lightsaber and environmental hazards on an industrial platform.",
  caption,
  sourceUrl: eaGameplayPage,
  publisher: "Electronic Arts",
});

const mediaByPath: Record<string, Array<ImageBlock | VideoBlock>> = {
  "/": [
    keyArt("Official key art establishes the squad, Clone Wars setting and cinematic tactics focus.", true),
    officialVideo({
      heading: "Watch the final mission briefing",
      videoId: "AxAgeglgSeA",
      posterSrc: "/media/zero-company/video-posters/final-trailer.jpg",
      title: "Star Wars Zero Company | Official Final Trailer",
      publisher: "EA Star Wars",
      duration: "2:14",
      publishedAt: "2026-08-17",
      uploadDateTime: "2026-08-17T15:30:14Z",
      description: "The official final trailer is the fastest visual overview of the squad, story tone and tactical presentation.",
      versionNote: "Official launch marketing; not a mechanics guide",
    }),
  ],
  "/classes": [
    specializations("EA defines eight standard Specializations; use the official role descriptions before community rankings."),
    communityVideo({
      heading: "See every class in motion",
      videoId: "D4eNuaEkP60",
      posterSrc: "/media/zero-company/video-posters/every-class.jpg",
      title: "Every Class Explained | Star Wars Zero Company Guide",
      publisher: "Dantics",
      duration: "28:56",
      publishedAt: "2026-08-13",
      uploadDateTime: "2026-08-13T20:00:37Z",
      description: "A long-form community explanation of class kits and play patterns to pair with the official role matrix above.",
      versionNote: "Community pre-launch guide; verify balance against the current patch",
    }),
  ],
  "/classes/tier-list": [
    specializations("The art is official; the ordering below remains this site's launch editorial model, not an EA ranking."),
    communityVideo({
      heading: "Compare a second specialization view",
      videoId: "kuPybko79-o",
      posterSrc: "/media/zero-company/video-posters/specializations-guide.jpg",
      title: "Watch THIS Before Picking Specialisations In Star Wars Zero Company",
      publisher: "NorZZa",
      duration: "18:05",
      publishedAt: "2026-08-23",
      uploadDateTime: "2026-08-23T16:00:23Z",
      description: "Use this as a contrasting community viewpoint, then return to the mission-job matrix rather than copying one universal tier order.",
      versionNote: "Community launch guidance; rankings are patch and difficulty sensitive",
    }),
  ],
  "/builds": [
    officialImage({
      src: "/media/zero-company/customization.jpeg",
      alt: "The character customization screen shows an operator portrait, equipment slots and appearance options.",
      caption: "A build combines a mission job, Specialization, equipment and a replacement plan—not appearance alone.",
      sourceUrl: eaGamePage,
      publisher: "Electronic Arts",
    }),
  ],
  "/builds/hawks": [
    officialImage({
      src: "/media/zero-company/hawks.jpg",
      alt: "Hawks faces forward in a dark command-room jacket with subtle cyan interface lighting.",
      caption: "Hawks is customizable; the right class depends on the repeatable turn your squad still needs.",
      sourceUrl: eaOperatorsPage,
      publisher: "Electronic Arts",
    }),
  ],
  "/builds/best-team": [
    squadLineup("Authored Operators bring distinct jobs, but a durable squad is defined by role coverage and replacements."),
    officialImage({
      src: "/media/zero-company/trick-luco.jpg",
      alt: "Trick and Luco walk together through a dim industrial corridor.",
      caption: "Bonds and complementary jobs reward planning pairs as well as individual damage output.",
      sourceUrl: eaGamePage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "Watch an early-game squad example",
      videoId: "azLdFfc8fnw",
      posterSrc: "/media/zero-company/video-posters/best-team-early-game.jpg",
      title: "Star Wars Zero Company BEST TEAM & COMBAT GUIDE Early Game",
      publisher: "Jay Dunna",
      duration: "16:10",
      publishedAt: "2026-08-29",
      uploadDateTime: "2026-08-29T05:44:35Z",
      description: "A practical early-game squad demonstration. Treat the named lineup as an example, not a permanent best team.",
      versionNote: "Early-game community guide; operator availability and difficulty vary",
    }),
  ],
  "/guides": [
    tacticalCombat("Official combat imagery shows why movement, cover, hazards and target order matter before raw damage."),
    officialVideo({
      heading: "Watch the official tactical breakdown",
      videoId: "4MG48L7qYHE",
      posterSrc: "/media/zero-company/video-posters/tactical-breakdown.jpg",
      title: "Tactical Gameplay Breakdown | STAR WARS Zero Company",
      publisher: "EA Star Wars",
      duration: "2:40",
      publishedAt: "2026-08-13",
      uploadDateTime: "2026-08-13T16:00:33Z",
      description: "EA's concise visual overview of the battlefield loop, squad actions and tactical presentation.",
      versionNote: "Official systems overview",
    }),
  ],
  "/guides/respec": [
    officialImage({
      src: "/media/zero-company/customization.jpeg",
      alt: "An operator customization screen shows portraits, equipment and appearance controls.",
      caption: "This official customization image illustrates operator editing, but it does not independently confirm the reported Cycle 3 respec timing.",
      sourceUrl: eaGamePage,
      publisher: "Electronic Arts",
    }),
  ],
  "/walkthrough": [
    officialImage({
      src: "/media/zero-company/holotable.jpg",
      alt: "The holotable displays a crisis mission on Vandor with rewards, upgrades and squad briefing information.",
      caption: "The holotable is the campaign decision surface: review expiry, rewards, injuries and squad jobs before advancing.",
      sourceUrl: eaGameplayPage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "Spoiler walkthrough: opening campaign",
      videoId: "bIcQxfFdlyY",
      posterSrc: "/media/zero-company/video-posters/walkthrough-part-one.jpg",
      title: "The Star Wars XCOM Game We've Waited For // Part 1 // Expert Difficulty",
      publisher: "ChristopherOdd",
      duration: "2:59:27",
      publishedAt: "2026-08-26",
      uploadDateTime: "2026-08-26T19:00:35Z",
      description: "A long-form Expert-difficulty playthrough useful for visual mission context after you choose to reveal spoilers.",
      versionNote: "Expert difficulty; long-form launch playthrough",
      spoiler: true,
    }),
  ],
  "/performance": [
    tacticalCombat("Use one repeatable busy scene like this when comparing settings; do not judge a change from different locations."),
    communityVideo({
      heading: "Review one dated PC and Deck test",
      videoId: "rJODwTE69y8",
      posterSrc: "/media/zero-company/video-posters/performance-review.jpg",
      title: "Star Wars Zero Company REVIEW + Steam Deck / PC Performance",
      publisher: "AZZATRU",
      duration: "11:25",
      publishedAt: "2026-08-26",
      uploadDateTime: "2026-08-26T13:00:38Z",
      description: "A launch-window performance snapshot that complements, but does not replace, official issue guidance or hardware-specific testing.",
      versionNote: "Launch review snapshot; recheck after patches",
    }),
  ],
  "/performance/pc": [
    officialImage({
      src: "/media/zero-company/concussion-grenade.jpg",
      alt: "A clone trooper targets a group of enemies with a Concussion Grenade in an isometric combat scene.",
      caption: "Choose a repeatable combat scene with several characters and effects before comparing a graphics change.",
      sourceUrl: eaGameplayPage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "Watch a hardware-labeled benchmark",
      videoId: "RClgZcVLI7Y",
      posterSrc: "/media/zero-company/video-posters/rtx-4060-benchmark.jpg",
      title: "Star Wars: Zero Company Performance Test | RTX 4060 + Ryzen 7 5800X",
      publisher: "ProTest Games",
      duration: "12:10",
      publishedAt: "2026-08-28",
      uploadDateTime: "2026-08-27T18:32:10Z",
      description: "A specific 1080p and DLSS test. Compare only if its hardware, resolution and scene resemble your own setup.",
      versionNote: "RTX 4060 + Ryzen 7 5800X; 1080p; third-party benchmark",
    }),
  ],
  "/performance/fps-fix": [
    tacticalCombat("Re-test the same combat scene after each reversible change; never combine every forum tweak at once."),
  ],
  "/game-info": [
    keyArt("Official key art for the launch platforms and edition overview."),
    officialImage({
      src: "/media/zero-company/deluxe-edition.jpg",
      alt: "The Deluxe Edition comparison displays faction cosmetics, armor, helmets and weapon themes.",
      caption: "Deluxe content is cosmetic; compare the current regional store price before buying.",
      sourceUrl: eaBuyPage,
      publisher: "Electronic Arts",
    }),
    officialVideo({
      heading: "Watch the official gameplay trailer",
      videoId: "WxLUZ1omFA8",
      posterSrc: "/media/zero-company/video-posters/gameplay-trailer.jpg",
      title: "Star Wars Zero Company | Official Gameplay Trailer",
      publisher: "EA Star Wars",
      duration: "3:08",
      publishedAt: "2026-06-05",
      uploadDateTime: "2026-06-05T22:07:33Z",
      description: "The official trailer demonstrates the single-player squad, combat framing and cinematic Clone Wars story.",
      versionNote: "Official gameplay trailer",
    }),
  ],
  "/system-requirements": [
    tacticalCombat("Official requirements describe target output and presets; a cinematic combat scene can still vary sharply by CPU and effects load."),
  ],
  "/multiplayer": [
    squadLineup("This is a multi-operator squad, but EA describes the shipped game as a single-player experience—not co-op."),
  ],
  "/weapons": [
    tacticalCombat("The official combat overview shows blasters, a lightsaber, Utilities and hazards sharing one turn economy; choose a weapon by the AP and position the squad still needs."),
  ],
  "/characters": [
    squadLineup("The official authored roster joins through the story; custom recruits add flexible species, looks and standard Specializations."),
  ],
  "/characters/voice-cast": [
    officialImage({
      src: "/media/zero-company/cast-reveal.jpeg",
      alt: "A cast reveal graphic pairs Zero Company characters with their confirmed voice actors.",
      caption: "StarWars.com announced the confirmed character and voice actor pairings at SDCC 2026.",
      sourceUrl: starWarsCastPage,
      publisher: "StarWars.com",
    }),
  ],
  "/guides/beginners-guide": [
    officialImage({
      src: "/media/zero-company/concussion-grenade.jpg",
      alt: "A clone trooper targets clustered enemies with a Concussion Grenade during tactical combat.",
      caption: "Create the shot before spending the damage action: group control, cover and target order shape the turn.",
      sourceUrl: eaGameplayPage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "Watch the complete starting guide",
      videoId: "bMIWs-xIh44",
      posterSrc: "/media/zero-company/video-posters/starting-guide.jpg",
      title: "Star Wars Zero Company - The Ultimate Starting Guide",
      publisher: "Dantics",
      duration: "41:56",
      publishedAt: "2026-08-27",
      uploadDateTime: "2026-08-27T20:00:13Z",
      description: "A long-form launch guide for players who want to see the opening systems demonstrated after reading the concise checklist.",
      versionNote: "Launch guide; long-form and lightly spoiler-sensitive",
    }),
  ],
  "/performance/steam-deck": [
    tacticalCombat("This official PC/console capture is not representative of Deck image quality; use the dated device test below for native Deck evidence."),
    communityVideo({
      heading: "Watch a dated Steam Deck OLED test",
      videoId: "XjdPD0oEvWA",
      posterSrc: "/media/zero-company/video-posters/steam-deck-oled.jpg",
      title: "Steam Deck OLED / STAR WARS Zero Company Performance / SteamOS 3.8.25",
      publisher: "NotAGameAddict",
      duration: "15:28",
      publishedAt: "2026-08-27",
      uploadDateTime: "2026-08-27T16:33:11Z",
      description: "A device- and SteamOS-labeled launch test that makes the page's native-performance warning easier to inspect.",
      versionNote: "Steam Deck OLED; SteamOS 3.8.25; launch build",
    }),
  ],
  "/mods": [
    officialImage({
      src: "/media/zero-company/customization.jpeg",
      alt: "The official character customization interface shows appearance and equipment controls.",
      caption: "Built-in customization is official; third-party mods remain unsupported, patch-sensitive additions outside this interface.",
      sourceUrl: eaGamePage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "See the community mod ecosystem",
      videoId: "1tn9Iyb_oz0",
      posterSrc: "/media/zero-company/video-posters/nexus-mods.jpg",
      title: "The Ultimate Tactical Upgrade: Star Wars Zero Company Mods",
      publisher: "Nexus Mods",
      duration: "0:48",
      publishedAt: "2026-08-27",
      uploadDateTime: "2026-08-27T19:00:13Z",
      description: "A short Nexus Mods ecosystem showcase. It proves community tooling exists, not that EA supports or validates any mod.",
      versionNote: "Community ecosystem showcase; not an installation tutorial",
    }),
  ],
  "/worth-it": [
    officialImage({
      src: "/media/zero-company/deluxe-edition.jpg",
      alt: "The Deluxe Edition visual shows optional armor, faction cosmetics, helmets and weapon appearances.",
      caption: "Separate the base tactics game from optional cosmetic value when deciding whether to buy.",
      sourceUrl: eaBuyPage,
      publisher: "Electronic Arts",
    }),
    communityVideo({
      heading: "Watch one full launch review",
      videoId: "F5zTrnc5q3g",
      posterSrc: "/media/zero-company/video-posters/ign-review.jpg",
      title: "Star Wars Zero Company Review",
      publisher: "IGN",
      duration: "14:49",
      publishedAt: "2026-08-26",
      uploadDateTime: "2026-08-26T13:00:07Z",
      description: "A named external review for players who want a visual second opinion after the site's buy, wait or skip decision matrix.",
      versionNote: "Launch review; editorial opinion, not an evergreen score",
    }),
  ],
};

export function getMediaBlocksForPath(path: string): Array<ImageBlock | VideoBlock> {
  return mediaByPath[path] ?? [];
}
