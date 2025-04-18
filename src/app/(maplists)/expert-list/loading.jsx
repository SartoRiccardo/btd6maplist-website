import DifficultySelector from "@/components/maps/DifficultySelector";
import { difficulties } from "@/utils/maplistUtils";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapListLoader from "@/components/layout/maplists/MapListLoader";

export default function ExpertsLoader() {
  return (
    <>
      <h1 className="text-center">Expert List</h1>

      <div>
        <DifficultySelector difficulties={difficulties} />

        <SubmissionRules on={51} />

        <MapListLoader />
      </div>
    </>
  );
}
