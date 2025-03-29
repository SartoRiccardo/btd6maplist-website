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
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolorum vel excepturi sapiente ex explicabo, dolore est quos dolor nulla hic fugiat ad a aliquid incidunt iure itaque veniam aliquam?",
    meta_desc: "Lorem ipsum",
  },
  {
    name: "Intermediate",
    query: "intermediate",
    value: 1,
    image: "/format_icons/icon_botb_2.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolorum vel excepturi sapiente ex explicabo, dolore est quos dolor nulla hic fugiat ad a aliquid incidunt iure itaque veniam aliquam?",
    meta_desc: "Lorem ipsum",
  },
  {
    name: "Advanced",
    query: "advanced",
    value: 2,
    image: "/format_icons/icon_botb_3.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolorum vel excepturi sapiente ex explicabo, dolore est quos dolor nulla hic fugiat ad a aliquid incidunt iure itaque veniam aliquam?",
    meta_desc: "Lorem ipsum",
  },
  {
    name: "Expert",
    query: "expert",
    value: 3,
    difficuly_values: [3, 4],
    image: "/format_icons/icon_botb_4.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolorum vel excepturi sapiente ex explicabo, dolore est quos dolor nulla hic fugiat ad a aliquid incidunt iure itaque veniam aliquam?",
    meta_desc: "Lorem ipsum",
  },
];

export const npDifficulties = [
  {
    name: "BTD1/2/3",
    query: "btd1_2_3",
    value: 0,
    image: "/format_icons/icon_np_1.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "iOS/PSN/DSi",
    query: "btd_ios_psn_dsi",
    value: 1,
    image: "/format_icons/icon_np_2.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BTD4",
    query: "bloons_td_4",
    value: 2,
    image: "/format_icons/icon_np_3.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BTD5",
    query: "bloons_td_5",
    value: 3,
    image: "/format_icons/icon_np_4.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BTDB1",
    query: "bloons_td_battles",
    value: 4,
    image: "/format_icons/icon_np_5.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BMC",
    query: "bloons_monkey_city",
    value: 5,
    image: "/format_icons/icon_np_6.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BATTD",
    query: "bloons_adventure_time_td",
    value: 6,
    image: "/format_icons/icon_np_7.png",
    description: "",
    meta_desc: "",
  },
  {
    name: "BTDB2/BTD6",
    query: "bloons_td_battles_2",
    value: 7,
    image: "/format_icons/icon_np_8.png",
    description: "",
    meta_desc: "",
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
    value: 51,
    image: "/format_icons/icon_hard.webp",
  },
  {
    name: "Best of the Best",
    short: "BotB",
    query: "best_of_the_best",
    value: 52,
    image: "/format_icons/icon_botb.webp",
  },
  {
    name: "Nostalgia Pack",
    short: "NP",
    query: "nostalgia_pack",
    value: 52,
    image: "/format_icons/icon_np.webp",
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
