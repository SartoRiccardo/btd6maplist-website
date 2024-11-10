import DifficultySelector from "@/components/maps/DifficultySelector";
import { listVersions } from "@/utils/maplistUtils";
import MapListLoader from "@/components/layout/maplists/MapListLoader";

export default function TheListPage() {
  return (
    <>
      <h1 className="text-center">The Maplist</h1>

      <DifficultySelector difficulties={listVersions} />

      <MapListLoader />
    </>
  );
}
