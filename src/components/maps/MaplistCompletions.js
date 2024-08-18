import { getMapCompletions } from "@/server/maplistRequests";
import CompletionRow from "./CompletionRow";
import UserEntry from "../users/UserEntry";

export default async function MaplistCompletions({
  code,
  mapIdxCurver,
  mapIdxAllver,
}) {
  const completions = await getMapCompletions(code);

  return (
    <div>
      {completions.map((completion) => (
        <CompletionRow
          key={`${completion.user_id}+${completion.formats.join(",")}`}
          completion={completion}
          mapIdxCurver={mapIdxCurver}
          mapIdxAllver={mapIdxAllver}
          userEntry={<UserEntry id={completion.user_id} centered lead="sm" />}
        />
      ))}
    </div>
  );
}
