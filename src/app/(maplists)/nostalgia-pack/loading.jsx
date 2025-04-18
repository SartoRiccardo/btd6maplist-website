import DifficultySelector from "@/components/maps/DifficultySelector";
import { npDifficulties } from "@/utils/maplistUtils";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapListLoader from "@/components/layout/maplists/MapListLoader";

export default function ExpertsLoader() {
  return (
    <>
      <h1 className="text-center">Nostalgia Pack</h1>

      <div>
        <DifficultySelector difficulties={npDifficulties} />

        <SubmissionRules on={11} />

        <MapListLoader />
      </div>
    </>
  );
}
