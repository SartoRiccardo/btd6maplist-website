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
      mapData.placement_cur === -1 ? "" : mapData.placement_cur.toString(),
    placement_allver:
      mapData.placement_all === -1 ? "" : mapData.placement_all.toString(),
    difficulty: mapData.difficulty.toString(),
    map_data: ["a", null].includes(mapData.map_data) ? "" : mapData.map_data,
    map_data_req_permission: mapData.map_data === "a",
    r6_start: mapData.r6_start === null ? "" : mapData.r6_start,
    aliases: addCountKey(mapData.aliases.map((alias) => ({ alias }))),
    creators: addCountKey(
      mapData.creators.map(({ role, name }) => ({
        id: name,
        role: role ? role : "",
      }))
    ),
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
    description:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point. Comparable difficulty to maps like Sanctuary and Flooded Valley.",
    meta_desc:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point.",
  },
  {
    name: "Hard",
    query: "hard",
    value: 2,
    image: "/format_icons/icon_hard.webp",
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
    description:
      "If you're asking for one of the best, you'd better be one of the best. Many strategies will not work. Comparable to, or even greater difficulty than maps like Bloody Puddles and Ouch.",
    meta_desc:
      "Many strategies will not work. If you're asking for one of the best, you'd better be one of the best.",
  },
];

export const filterCompletionFormats = (completions, formats) => {
  return completions
    .sort((c1, c2) => c1.format - c2.format)
    .filter(({ format }) => !!formats.find(({ value }) => format === value));
};

export const listVersions = [
  {
    name: "Current",
    diffPanelName: "Current",
    short: "Cur",
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
    // diffPanelName: "Current",
    // short: "Cur",
    // query: "current",
    value: 51,
    image: "/format_icons/icon_hard.webp",
    // plcKey: "placement_cur",
    // description: "",
  },
];

export const allFormats = [...listVersions, ...explistVersions];

export const userRoles = [
  {
    name: "List Map Creator",
    color: "#ffb74d",
    borderColor: "#fff9c4",
    description: "Have a map on the list",
    requirement: ({ user }) => {
      for (const map of user.created_maps) {
        if (map.placement_cur > -1 || map.placement_all > -1) return true;
      }
      return false;
    },
  },
  {
    name: "Expert Map Creator",
    color: "var(--color-experts)",
    borderColor: "lightpink",
    description: "Have a map on the experts list",
    requirement: ({ user }) => {
      for (const map of user.created_maps) {
        if (map.difficulty !== -1) return true;
      }
      return false;
    },
  },

  {
    name: "Beginner",
    color: "#00695c",
    borderColor: "#00bfa5",
    description: "1+ points on the leaderboard",
    requirement: ({ user }) =>
      user.maplist.current.points > 0 && user.maplist.current.points < 100,
    // || (user.maplist.all.points > 0 && user.maplist.all.points < 100),
  },
  {
    name: "Intermediate",
    color: "#00897b",
    borderColor: "#00bfa5",
    description: "100+ points on the leaderboard",
    requirement: ({ user }) =>
      user.maplist.current.points >= 100 && user.maplist.current.points < 350,
    // ||(user.maplist.all.points >= 100 && user.maplist.all.points < 350),
  },
  {
    name: "Advanced",
    color: "#26a69a",
    borderColor: "#00bfa5",
    description: "350+ points on the leaderboard",
    requirement: ({ user }) =>
      user.maplist.current.points >= 350 && user.maplist.current.points < 1000,
    // || (user.maplist.all.points >= 350 && user.maplist.all.points < 1000),
  },
  {
    name: "Expert",
    color: "#80cbc4",
    borderColor: "#00bfa5",
    description: "100+ points on the leaderboard",
    requirement: ({ user }) =>
      user.maplist.current.points >= 1000 &&
      user.maplist.current.pts_placement > 1,
    // || (user.maplist.all.points >= 1000 && user.maplist.all.pts_placement > 1),
  },
  {
    name: "The GOAT",
    color: "#b2dfdb",
    borderColor: "#00bfa5",
    description: "#1 on the points leaderboard",
    requirement: ({ user }) => user.maplist.current.pts_placement === 1,
    // || user.maplist.all.pts_placement === 1,
  },
];
