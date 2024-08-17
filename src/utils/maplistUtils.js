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

export const difficulties = [
  {
    name: "Casual",
    value: 0,
    image: "/icon_casual.png",
    description:
      "Easy and enjoyable, yet not brainless maps. Expect a game where many towers are viable. Comparable difficulty to maps like Workshop and Muddy Puddles.",
  },
  {
    name: "Medium",
    value: 1,
    image: "/icon_medium.png",
    description:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point. Comparable difficulty to maps like Sanctuary and Flooded Valley.",
  },
  {
    name: "Hard",
    value: 2,
    image: "/icon_hard.png",
    description:
      "Has at least one phase of the game that is very tough, usually a hard lategame at minimum. Comparable difficulty to maps like Dark Dungeons and Quad.",
  },
  {
    name: "True",
    value: 3,
    image: "/icon_true.png",
    description:
      "If you're asking for one of the best, you'd better be one of the best. Many strategies will not work. Comparable to, or even greater difficulty than maps like Bloody Puddles and Ouch.",
  },
];

export const listVersions = [
  {
    name: "Current",
    short: "Cur",
    value: 0,
    image: "/icon_curver.png",
    description: "",
  },
  {
    name: "All Versions",
    short: "All",
    value: 1,
    image: "/icon_allver.png",
    description: "",
  },
];

export const userRoles = [
  {
    name: "List Map Creator",
    color: "#ffb74d",
    description: "Have a map on the list",
    requirement: ({ user }) => {
      for (const map of user.created_maps) {
        if (map.placement_cur > -1 || map.placement_all > -1) return true;
      }
      return false;
    },
  },

  {
    name: "Beginner",
    color: "#00695c",
    description: "1+ points on the leaderboard",
    requirement: ({ user }) =>
      (user.maplist.current.points > 0 && user.maplist.current.points < 100) ||
      (user.maplist.all.points > 0 && user.maplist.all.points < 100),
  },
  {
    name: "Intermediate",
    color: "#00897b",
    description: "100+ points on the leaderboard",
    requirement: ({ user }) =>
      (user.maplist.current.points >= 100 &&
        user.maplist.current.points < 350) ||
      (user.maplist.all.points >= 100 && user.maplist.all.points < 350),
  },
  {
    name: "Advanced",
    color: "#26a69a",
    description: "350+ points on the leaderboard",
    requirement: ({ user }) =>
      (user.maplist.current.points >= 350 &&
        user.maplist.current.points < 1000) ||
      (user.maplist.all.points >= 350 && user.maplist.all.points < 1000),
  },
  {
    name: "Expert",
    color: "#80cbc4",
    description: "100+ points on the leaderboard",
    requirement: ({ user }) =>
      (user.maplist.current.points >= 1000 &&
        user.maplist.current.pts_placement > 1) ||
      (user.maplist.all.points >= 1000 && user.maplist.all.pts_placement > 1),
  },
  {
    name: "The GOAT",
    color: "#e0f2f1",
    description: "#1 on the points leaderboard",
    requirement: ({ user }) =>
      user.maplist.current.pts_placement === 1 ||
      user.maplist.all.pts_placement === 1,
  },
];
