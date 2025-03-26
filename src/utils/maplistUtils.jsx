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
      "Easy and enjoyable, yet not brainless maps. Expect a game where many towers are viable. Comparable difficulty to maps like Workshop and Muddy Puddles.",
    meta_desc:
      "Easy and enjoyable, yet not brainless maps. Expect a game where many towers are viable.",
  },
  {
    name: "Medium",
    query: "medium",
    value: 1,
    image: "/format_icons/icon_medium.webp",
    points_cfg: "exp_points_medium",
    description:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point. Comparable difficulty to maps like Sanctuary and Flooded Valley.",
    meta_desc:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point.",
  },
  {
    name: "High",
    query: "hard",
    value: 2,
    image: "/format_icons/icon_hard.webp",
    points_cfg: "exp_points_high",
    description:
      "Has at least one phase of the game that is very tough, usually a hard lategame at minimum. Comparable difficulty to maps like Dark Dungeons and Quad.",
    meta_desc:
      "Has at least one phase of the game that is very tough, usually a hard lategame at minimum.",
  },
  {
    name: "True",
    query: "true",
    value: 3,
    image: "/format_icons/icon_true.webp",
    points_cfg: "exp_points_true",
    description:
      "If you're asking for one of the best, you'd better be one of the best. Many strategies will not work. Comparable to, or even greater difficulty than maps like Bloody Puddles and Ouch.",
    meta_desc:
      "Many strategies will not work. If you're asking for one of the best, you'd better be one of the best.",
  },
  {
    name: "Extreme",
    query: "extreme",
    value: 4,
    image: "/format_icons/icon_extreme.webp",
    points_cfg: "exp_points_extreme",
    description: (
      <>
        Some of the toughest challenges CHIMPS has to offer, each being much
        harder than any official map made by Ninja Kiwi. This difficulty often
        contains forced strategies and maps that have fallen off The Maplist.
        <br />
        <i>Good luck...</i>
      </>
    ),
    meta_desc:
      "The absolute hardest this community has to offer. Many strategies are forced. Good luck...",
  },
];

export const filterCompletionFormats = (completions, formats) => {
  return completions
    .sort((c1, c2) => c1.format - c2.format)
    .filter(({ format }) => !!formats.find(({ value }) => format === value));
};

export const listVersions = [
  {
    name: "Maplist",
    diffPanelName: "Maplist",
    short: "List",
    query: "current",
    value: 1,
    image: "/format_icons/icon_curver.webp",
    plcKey: "placement_cur",
    description: "",
  },
  /* ALLVER UCOMMENT */
  // {
  //   name: "All Versions",
  //   diffPanelName: "All Vers",
  //   short: "All",
  //   query: "all",
  //   value: 2,
  //   image: "/format_icons/icon_allver.webp",
  //   plcKey: "placement_all",
  //   description: (
  //     <>
  //       Unlike the Current Version format, you can play these maps in any past
  //       versions. Check out the{" "}
  //       <a
  //         href="https://docs.google.com/document/d/1AcjTgWI2-mfj3-vJpY7YgKoAM5SYAGSIbonWI5urQQI"
  //         target="_blank"
  //       >
  //         Old Versions Guide
  //       </a>{" "}
  //       to check how you can play (and optionally mod) past versions of BTD6.{" "}
  //       <span className="muted">It's easier than it looks.</span>
  //     </>
  //   ),
  // },
];

const explistVersions = [
  {
    name: "Expert List",
    // diffPanelName: "Experts",
    short: "Exp",
    query: "experts",
    value: 51,
    image: "/format_icons/icon_hard.webp",
    // plcKey: "placement_cur",
    // description: "",
  },
];

export const allFormats = [...listVersions, ...explistVersions];

export const serverRoleStyles = {
  1: { bg: "#000", border: "#000", hidden: true },
  2: { bg: "#d50000", border: "#f06292" },
  3: { bg: "#d50000", border: "#f06292" },
  4: { bg: "#ba68c8", border: "#e1bee7" },
  5: { bg: "#ba68c8", border: "#e1bee7" },
  6: { bg: "rgba(0,0,0,0.5)", border: "#000", hidden: true },
  7: { bg: "rgba(0,0,0,0.5)", border: "#000", hidden: true },
  8: { bg: "rgba(0,0,0,0.5)", border: "#000", hidden: true },
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
