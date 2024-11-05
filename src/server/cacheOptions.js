export const revalidate = process.env.CACHE_MAPLIST === "false" ? 0 : 60 * 5;
export const cache = undefined;
