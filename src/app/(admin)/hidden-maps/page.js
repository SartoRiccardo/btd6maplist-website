import MapList from "@/components/layout/maplists/MapList";
import { getLegacyList } from "@/server/maplistRequests";

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

      <MapList maps={maps} legacy />
    </>
  );
}
