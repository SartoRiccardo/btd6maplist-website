import { getMapCompletions } from "@/server/maplistRequests";
import CompletionRow from "./CompletionRow";
import UserEntry from "../users/UserEntry";
import { groupCompsByUser } from "@/utils/functions";
import PaginateElement from "../buttons/PaginateElement";

export default async function MaplistCompletions({
  page,
  code,
  mapIdxCurver,
  mapIdxAllver,
}) {
  const completions = await getMapCompletions(code, { page });
  const { keyOrder, runsBySameUsr } = groupCompsByUser(completions.completions);

  return (
    <PaginateElement qname="comp_page" page={page} total={completions.pages}>
      {keyOrder.map((key) => (
        <CompletionRow
          key={key}
          completion={runsBySameUsr[key]}
          mapIdxCurver={mapIdxCurver}
          mapIdxAllver={mapIdxAllver}
          userEntry={runsBySameUsr[key][0].users.map((uid) => (
            <UserEntry key={uid} id={uid} centered lead="sm" />
          ))}
        />
      ))}
    </PaginateElement>
  );
}
