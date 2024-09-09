import { getMapCompletions } from "@/server/maplistRequests";
import CompletionRow from "./CompletionRow";
import UserEntry from "../users/UserEntry";
import { hashCode } from "@/utils/functions";
import PaginateElement from "../buttons/PaginateElement";

export default async function MaplistCompletions({
  page,
  code,
  mapIdxCurver,
  mapIdxAllver,
}) {
  const completions = await getMapCompletions(code, { page });

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
    <PaginateElement qname="comp_page" page={page} total={completions.pages}>
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
    </PaginateElement>
  );
}
