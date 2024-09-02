import { getMapCompletions } from "@/server/maplistRequests";
import CompletionRow from "./CompletionRow";
import UserEntry from "../users/UserEntry";
import { hashCode } from "@/utils/functions";

export default async function MaplistCompletions({
  code,
  mapIdxCurver,
  mapIdxAllver,
}) {
  const completions = await getMapCompletions(code);

  let equalRuns = {};
  let keyOrder = [];
  for (const run of completions.completions) {
    const key = hashCode(run.user_ids.reduce((agg, uid) => agg + uid, ""));
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
      equalRuns[key] = [];
    }
    equalRuns[key].push(run);
  }

  return (
    <div>
      {keyOrder.map((key) => (
        <CompletionRow
          key={key}
          completion={equalRuns[key]}
          mapIdxCurver={mapIdxCurver}
          mapIdxAllver={mapIdxAllver}
          userEntry={equalRuns[key][0].user_ids.map((uid) => (
            <UserEntry key={uid} id={uid} centered lead="sm" />
          ))}
        />
      ))}
    </div>
  );
}
