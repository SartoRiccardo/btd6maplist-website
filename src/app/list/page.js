import TheList from "@/components/layout/maplists/TheList";
import { getTheList } from "@/server/maplistRequests";

export default async function TheListPage() {
  const [maplistCurrent, maplistAll] = await Promise.all([
    getTheList("current"),
    getTheList("all"),
  ]);
  return (
    <>
      <h1 className="text-center">The List</h1>
      <TheList current={maplistCurrent} allvers={maplistAll} />
    </>
  );
}
