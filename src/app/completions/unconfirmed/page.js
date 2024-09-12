import PaginateElement from "@/components/buttons/PaginateElement";
import CompletionRow from "@/components/maps/CompletionRow";
import UserEntry from "@/components/users/UserEntry";
import { getUnapprovedRuns } from "@/server/maplistRequests";
import { groupCompsByMap, groupCompsByUser } from "@/utils/functions";

export default async function UnconfirmedList({ searchParams }) {
  let page = parseInt(searchParams?.page || "1");
  page = isNaN(page) ? 1 : page;

  const completions = await getUnapprovedRuns({ page });
  const { keyOrder, runsOnSameMap } = groupCompsByMap(completions.completions);
  for (const key of keyOrder) {
    runsOnSameMap[key] = groupCompsByUser(runsOnSameMap[key]);
  }

  return (
    <>
      <h1 className="text-center">Unapproved Completions</h1>

      <PaginateElement qname="comp_page" page={page} total={completions.pages}>
        {keyOrder.map((keyMap) => {
          const runs = runsOnSameMap[keyMap];
          const mapName = runs.runsBySameUsr[runs.keyOrder[0]][0].map.name;
          return (
            <div className="mb-3" key={keyMap}>
              <h2 className="text-center">{mapName}</h2>
              {runs.keyOrder.map((keyUsr) => (
                <CompletionRow
                  key={keyUsr}
                  completion={runs.runsBySameUsr[keyUsr]}
                  userEntry={runs.runsBySameUsr[keyUsr][0].user_ids.map(
                    (uid) => (
                      <UserEntry key={uid} id={uid} centered lead="sm" />
                    )
                  )}
                />
              ))}
            </div>
          );
        })}
      </PaginateElement>
    </>
  );
}
