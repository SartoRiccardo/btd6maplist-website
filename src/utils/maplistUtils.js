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
