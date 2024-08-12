const mapPointsCache = {};
export const calcMapPoints = (
  idx,
  { points_top_map, points_bottom_map, formula_slope, map_count }
) => {
  if (!(idx in mapPointsCache)) {
    const result =
      points_bottom_map *
      (points_top_map / points_bottom_map) **
        ((1 + (1 - idx) / (map_count - 1)) ** formula_slope);
    mapPointsCache[idx] = result;
  }
  return mapPointsCache[idx];
};
