import TheList from "@/components/layout/maplists/TheList";
import { getLegacyList } from "@/server/maplistRequests";

// export async function generateMetatdata({ searchParams }) {
//   let version = searchParams?.format || "current";
//   if (!listVersions.map(({ query }) => query).includes(version))
//     version = "current";

//   return {
//     title: `The List ${
//       version === "all" ? "(all versions)" : ""
//     } | BTD6 Maplist`,
//     description:
//       "50 of the hardest community-made Bloons TD 6 maps, ranked by difficulty. Each one awards points on completion",
//   };
// }

export const metadata = {
  title: "Legacy List | BTD6 Maplist",
  metadata: "Maps that were pushed off the list or manually deleted",
};

export default async function TheListPage() {
  const maps = await getLegacyList();

  return (
    <>
      <h1 className="text-center">Legacy List</h1>
      <p className="text-center muted">
        Maps that were pushed off the list. If a map wasn't pushed off the list
        (doesn't have an index), it was deleted.
      </p>

      <TheList maps={maps} legacy />
    </>
  );
}
