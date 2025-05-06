import MapList from "@/components/layout/maplists/MapList";
import { getLegacyList, getMaplist } from "@/server/maplistRequests";

export default async function ContestPage() {
  const [maplist, legacyList] = await Promise.all([
    getMaplist({ format: 1 }),
    getLegacyList(),
  ]);

  const fullList = maplist
    .concat(legacyList)
    .filter((map) => map.format_idx !== null)
    .sort((a, b) => a.format_idx - b.format_idx);

  return (
    <>
      <h1 className="text-center">Legacy Maplist</h1>
      <p className="text-center">
        Contains all previous maps on the Maplist, with order still preserved.
      </p>
      <p className="muted text-center">
        (The Legacy List will come out properly one day, this is a hastily made
        page for the contest!)
      </p>

      <MapList maps={fullList} showPlacement legacy />
    </>
  );
}
