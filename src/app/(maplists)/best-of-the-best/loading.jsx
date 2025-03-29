import DifficultySelector from "@/components/maps/DifficultySelector";
import { botbDifficulties } from "@/utils/maplistUtils";
import SubmissionRules from "@/components/layout/maplists/SubmissionRules";
import MapListLoader from "@/components/layout/maplists/MapListLoader";

export default function BotbLoader() {
  return (
    <>
      <h1 className="text-center">Best of the Best Custom Maps</h1>

      <div>
        <DifficultySelector difficulties={botbDifficulties} />

        <SubmissionRules on={52} />

        <MapListLoader />
      </div>
    </>
  );
}
