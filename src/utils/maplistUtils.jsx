import Image from "next/image";

const mapPointsCache = {};
export const calcMapPoints = (
  idx,
  {
    points_top_map,
    points_bottom_map,
    formula_slope,
    map_count,
    decimal_digits,
  }
) => {
  if (!(idx in mapPointsCache)) {
    const result =
      points_bottom_map *
      (points_top_map / points_bottom_map) **
        ((1 + (1 - idx) / (map_count - 1)) ** formula_slope);
    mapPointsCache[idx] = parseFloat(result.toFixed(decimal_digits));
  }
  return mapPointsCache[idx];
};

const addCountKey = (list) => list.map((obj, i) => ({ ...obj, count: -1 - i }));

export const mapDataToFormik = (mapData) => {
  const initialValues = {
    ...mapData,
    placement_curver:
      mapData.placement_curver === null
        ? ""
        : mapData.placement_curver.toString(),
    placement_allver:
      mapData.placement_allver === null
        ? ""
        : mapData.placement_allver.toString(),
    difficulty:
      mapData.difficulty === null ? "-1" : mapData.difficulty.toString(),
    botb_difficulty:
      mapData.botb_difficulty === null
        ? "-1"
        : mapData.botb_difficulty.toString(),
    remake_of:
      mapData.remake_of === null ? "-1" : mapData.remake_of.id.toString(),
    map_data: ["a", null].includes(mapData.map_data) ? "" : mapData.map_data,
    map_data_req_permission: mapData.map_data === "a",
    r6_start: mapData.r6_start === null ? "" : mapData.r6_start,
    aliases: addCountKey(mapData.aliases.map((alias) => ({ alias }))),
    has_no_creators: mapData.creators.length === 0,
    creators: addCountKey(
      mapData.creators.map(({ role, name }) => ({
        id: name,
        role: role ? role : "",
      }))
    ),
    no_optimal_hero: mapData.optimal_heros.length === 0,
    verifiers: addCountKey(
      mapData.verifications.map(({ name, version }) => ({
        id: name,
        version: version ? version.toString() : "",
      }))
    ),
    additional_codes: addCountKey(
      mapData.additional_codes.map((obj) => ({
        ...obj,
        description: obj.description ? obj.description : "",
      }))
    ),
    version_compatibilities: addCountKey(
      mapData.map_data_compatibility.map(({ status, version }) => ({
        status: status.toString(),
        version: version.toString(),
      }))
    ),
    map_preview_file: [],
    r6_start_file: [],
  };
  const toDelete = [
    "lccs",
    "verified",
    "placement_cur",
    "placement_all",
    "map_data_compatibility",
    "verifications",
  ];
  for (const td of toDelete) delete initialValues[td];

  return initialValues;
};

export const difficulties = [
  {
    name: "Casual",
    query: "casual",
    value: 0,
    image: "/format_icons/icon_casual.webp",
    points_cfg: "exp_points_casual",
    description:
      "These maps are a great mix of fun and challenge—tough enough to keep things interesting but not so hard that you’ll get stuck for hours. Most towers work well here, so you’ve got plenty of ways to win. If you’ve beaten Workshop and Muddy Puddles and had a good time, you’ll feel right at home with these.",
    meta_desc:
      "Enjoyable yet thoughtful custom BTD6 maps, offering balanced difficulty comparable to Workshop and Muddy Puddles.",
  },
  {
    name: "Medium",
    query: "medium",
    value: 1,
    image: "/format_icons/icon_medium.webp",
    points_cfg: "exp_points_medium",
    description:
      "These maps step things up a notch, adding extra obstacles or mechanics that make you think more carefully about your strategy. They can get pretty tough at times, but they never feel unfair. If you’ve beaten maps like Sanctuary and Flooded Valley, expect a similar level of challenge with some fresh twists.",
    meta_desc:
      "Challenging but fair BTD6 custom maps with strategic twists, comparable to Sanctuary and Flooded Valley.",
  },
  {
    name: "High",
    query: "hard",
    value: 2,
    image: "/format_icons/icon_hard.webp",
    points_cfg: "exp_points_high",
    description:
      "Things start getting serious here. These maps always have at least one part that’s brutally tough—usually in the lategame, where even small mistakes can ruin a run. You’ll need to plan ahead and make smart moves to survive. If you’ve handled Dark Dungeons and Quad, you’ll know what to expect.",
    meta_desc:
      "Advanced Bloons TD 6 maps featuring difficult phases and intense lategame challenges, similar to Dark Dungeons and Quad.",
  },
  {
    name: "True",
    query: "true",
    value: 3,
    image: "/format_icons/icon_true.webp",
    points_cfg: "exp_points_true",
    description:
      "If you’re looking for a real challenge, these maps don’t mess around. A lot of normal strategies just won’t cut it, so you’ll have to come up with new ways to win. Every round is a battle, and even small mistakes can send you back to square one. They’re as tough as, or even harder than, Bloody Puddles and Ouch—so if you want to prove you’re one of the best, here’s your chance.",
    meta_desc:
      "Brutally difficult Bloons TD 6 maps demanding elite-level skill. As hard as Bloody Puddles and Ouch, or worse.",
  },
  {
    name: "Extreme",
    query: "extreme",
    value: 4,
    image: "/format_icons/icon_extreme.webp",
    points_cfg: "exp_points_extreme",
    description: (
      <>
        The hardest of the hard, featuring even some maps which have fallen off
        The Maplist. These maps make official expert maps look easy, pushing the
        game to its absolute limit. You’ll often need super-specific strategies
        just to stand a chance. If you’re looking for the toughest CHIMPS runs
        ever made, this is it.
        <br />
        <i>Good luck...</i>
      </>
    ),
    meta_desc:
      "The hardest custom BTD6 maps ever made. Beyond official maps, featuring forced strategies and near-impossible CHIMPS runs.",
  },
];

export const botbDifficulties = [
  {
    name: "Beginner",
    query: "beginner",
    value: 0,
    image: "/format_icons/icon_botb_1.png",
    description:
      "Simple, clean, and beautifully crafted — these maps are perfect for getting started or just enjoying the art of great design. Whether you're new to the game or just want to relax, feel free to breeze through and admire the smooth flow and charming aesthetics.",
    meta_desc:
      "Explore beginner-friendly maps that are easy to play and beautifully designed. Perfect for new players or a relaxing experience!",
  },
  {
    name: "Intermediate",
    query: "intermediate",
    value: 1,
    image: "/format_icons/icon_botb_2.png",
    description:
      "Ready to turn things up a notch? These maps introduce a bit more challenge, but nothing you haven’t handled before. The gameplay stays fair and familiar, while the decoration steps things up with unique and polished visuals that bring every level to life.",
    meta_desc:
      "Browse intermediate-level maps that blend familiar gameplay with increased difficulty and stunning visuals.",
  },
  {
    name: "Advanced",
    query: "advanced",
    value: 2,
    image: "/format_icons/icon_botb_3.png",
    description:
      "You'll need solid game knowledge and sharper skills to push through the creative mechanics and complex layouts. While the visuals are still top-tier, the focus here shifts to serious gameplay. Expect to restart a few times — and enjoy the process.",
    meta_desc:
      "Discover advanced maps with intricate design and challenging mechanics. For players ready to test their skills and strategy!",
  },
  {
    name: "Expert",
    query: "expert",
    value: 3,
    difficuly_values: [3, 4],
    image: "/format_icons/icon_botb_4.png",
    description:
      "Beautiful and brutal. These maps are not for the faint of heart — they're punishing, strategic, and some have even earned spots on The Maplist and The Expert List. While the decoration may wow you, don’t get too distracted. You'll need everything you've learned (and then some) to make it through.\n\nMaps marked with a flame are extreme, they might break within updates and are sometimes featured in harder lists.",
    meta_desc:
      "Dive into expert-level maps featuring elite-level difficulty and stunning visuals. Only for the brave!",
  },
];

export const npDifficulties = [
  {
    name: "BTD1/2/3",
    query: "btd1_2_3",
    value: 0,
    image: "/format_icons/icon_np_1.png",
    description:
      "Travel all the way back to where it began! These maps are remakes and reimaginings of tracks from the original Bloons TD trilogy. Simple layouts, classic vibes, and a healthy dose of nostalgia — all brought to life with modern decoration.",
    meta_desc:
      "Play remakes of classic Bloons TD 1, 2, and 3 maps. Reimagined with updated visuals, perfect for longtime fans and curious newcomers.",
  },
  {
    name: "iOS/PSN/DSi",
    query: "btd_ios_psn_dsi",
    value: 1,
    image: "/format_icons/icon_np_2.png",
    description:
      "Miss those mobile and console exclusives? These maps are faithful recreations of tracks found only in Bloons TD's early iOS, PlayStation Network, and DSi versions. Rare, sometimes forgotten, but always fun — they're back and better than ever!",
    meta_desc:
      "Explore remakes of classic Bloons TD maps from iOS, PSN, and DSi versions. Rare and nostalgic tracks brought into the modern era!",
  },
  {
    name: "BTD4",
    query: "bloons_td_4",
    value: 2,
    image: "/format_icons/icon_np_3.png",
    description:
      "Bloons TD 4 brought major changes — and these remakes honor that legacy! Enjoy fan-favorite tracks from the BTD4 era with refreshed visuals, and all the charm that made the original game so memorable.",
    meta_desc:
      "Relive Bloons TD 4 with remade tracks from the classic game. Updated visuals and design, same nostalgic fun!",
  },
  {
    name: "BTD5",
    query: "bloons_td_5",
    value: 3,
    image: "/format_icons/icon_np_4.png",
    description:
      "BTD5 was a fan-favorite for a reason, and these remade maps capture all the tight track design and fun layouts you remember. Brought into the current era with fresh decoration and quality-of-life updates — it's the best of both worlds.",
    meta_desc:
      "Revisit Bloons TD 5 maps with modern remakes. Nostalgic layouts enhanced with updated visuals and smooth gameplay.",
  },
  {
    name: "BTDB1",
    query: "bloons_td_battles",
    value: 4,
    image: "/format_icons/icon_np_5.png",
    description:
      "Inspired by the intense head-to-head action of Bloons TD Battles, these maps are built for competitive strategy. Whether you're reliving your favorite arenas or just love their design, these remakes bring the spirit of PvP into any playstyle.",
    meta_desc:
      "Remade Bloons TD Battles maps featuring competitive layouts and classic arenas. Perfect for strategy fans and old-school players!",
  },
  {
    name: "BMC",
    query: "bloons_monkey_city",
    value: 5,
    image: "/format_icons/icon_np_6.png",
    description:
      "Remember expanding your Monkey City and fighting through the world's maps along the way? These remakes bring that world-building charm back to life, with maps based on the tracks from Bloons Monkey City — now fully updated!",
    meta_desc:
      "Play remakes of maps from Bloons Monkey City. Unique layouts from the city-builder TD game, brought into modern gameplay.",
  },
  {
    name: "BATTD",
    query: "bloons_adventure_time_td",
    value: 6,
    image: "/format_icons/icon_np_7.png",
    description:
      "These aren't just remakes — they're full-on ports from Bloons Adventure Time TD. Originally built for a different universe, these maps have been carefully adapted into the core Bloons TD style. Expect creative layouts and thematic fun, now fully playable outside the Land of Ooo.",
    meta_desc:
      "Ported maps from Bloons Adventure Time TD, adapted for core Bloons gameplay. Unique layouts and themes from the crossover title!",
  },
  {
    name: "BTDB2/BTD6",
    query: "bloons_td_battles_2",
    value: 7,
    image: "/format_icons/icon_np_8.png",
    description:
      "These maps were either scrapped from BTD6 before release or originally launched in Bloons TD Battles 2 — and now they’ve made their way over here. Whether they were cut, forgotten, or locked behind multiplayer, these ports give them new life in a fresh format. Think of it as the second chance they deserve.",
    meta_desc:
      "Play official maps from Battles 2 and scrapped BTD6 content, now ported into full playability. Unreleased and multiplayer-only maps revived!",
  },
];

export const filterCompletionFormats = (completions, formats) => {
  return completions
    .sort((c1, c2) => c1.format - c2.format)
    .filter(({ format }) => !!formats.find(({ id }) => format === id));
};

export const listVersions = [
  {
    name: "Maplist",
    diffPanelName: "Maplist",
    short: "List",
    query: "current",
    value: 1,
    image: "/format_icons/icon_curver.webp",
    plcKey: "placement_curver",
    leaderboards: ["points", "no_optimal_hero", "black_border", "lccs"],
    description:
      "The 50 hardest custom maps in the game, ordered by difficulty. Good luck, you'll need it...",
  },
  {
    name: "All Versions",
    longName: "Maplist ~ All Versions",
    diffPanelName: "All Vers",
    short: "All",
    query: "all",
    value: 2,
    image: "/format_icons/icon_allver.webp",
    plcKey: "placement_allver",
    leaderboards: ["points", "no_optimal_hero", "black_border", "lccs"],
    description: (
      <>
        Unlike the Current Version format, you can play these maps in any past
        versions. Check out the{" "}
        <a
          href="https://docs.google.com/document/d/1AcjTgWI2-mfj3-vJpY7YgKoAM5SYAGSIbonWI5urQQI"
          target="_blank"
        >
          Old Versions Guide
        </a>{" "}
        to check how you can play (and optionally mod) past versions of BTD6.{" "}
        <span className="muted">It's easier than it looks.</span>
      </>
    ),
  },
];

export const allFormats = [
  ...listVersions,
  {
    name: "Expert List",
    short: "Exp",
    query: "experts",
    plcKey: "difficulty",
    value: 51,
    image: "/format_icons/icon_hard.webp",
    leaderboards: ["points", "no_optimal_hero", "black_border", "lccs"],
  },
  {
    name: "Best of the Best",
    short: "BotB",
    query: "best_of_the_best",
    plcKey: "botb_difficulty",
    value: 52,
    image: "/format_icons/icon_botb.png",
    leaderboards: [],
  },
  {
    name: "Nostalgia Pack",
    short: "NP",
    query: "nostalgia_pack",
    plcKey: "remake_of",
    value: 11,
    image: "/format_icons/icon_np_1.png",
    leaderboards: [],
  },
];

export const getServerRoleStyle = (name) => {
  const styles = { bg: "rgba(0,0,0,0.5)", border: "#000", hidden: true };
  if (name.includes("Owner")) {
    styles.bg = "#d50000";
    styles.border = "#f06292";
    styles.hidden = false;
  }
  if (
    name.includes("Mod") ||
    name.includes("Curator") ||
    name.includes("Verifier")
  ) {
    styles.bg = "#ba68c8";
    styles.border = "#e1bee7";
    styles.hidden = false;
  }
  if (name === "Technician") {
    styles.bg = "#000";
  }
  return styles;
};

export const leaderboards = [
  { key: "points", title: "Points", suffix: "pt" },
  {
    key: "lccs",
    title: "LCCs",
    suffix: (
      <Image
        src="/medals/medal_lcc.webp"
        alt=""
        className="ms-2"
        width={30}
        height={30}
      />
    ),
  },
  {
    key: "no_optimal_hero",
    title: "No Optimal Hero",
    suffix: (
      <Image
        src="/medals/medal_nogerry.webp"
        alt=""
        className="ms-2"
        width={30}
        height={30}
      />
    ),
  },
  {
    key: "black_border",
    title: "Black Border",
    suffix: (
      <Image
        src="/medals/medal_bb.webp"
        alt=""
        className="ms-2"
        width={30}
        height={30}
      />
    ),
  },
];

export const formatToKey = {
  1: "placement_curver",
  2: "placement_allver",
  51: "difficulty",
  52: "botb_difficulty",
  11: "remake_of",
};

export const discordInvites = {
  maplist: "https://discord.gg/ZgMtM7X2TS",
  emporium: "https://discord.gg/T228Dtkfb9",
};
