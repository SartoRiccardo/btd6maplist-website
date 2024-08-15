import TheList from "@/components/layout/maplists/TheList";
import { getTheList } from "@/server/maplistRequests";

export const metadata = {
  title: "The BTD6 Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
};

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
