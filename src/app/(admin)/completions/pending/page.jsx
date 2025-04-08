import PaginateElement from "@/components/buttons/PaginateElement";
import CompletionRowSubmission from "@/components/maps/CompletionRowSubmission";
import Btd6MapRowPreview from "@/components/ui/Btd6MapRowPreview";
import UserEntry from "@/components/users/UserEntry";
import { getUnapprovedRuns } from "@/server/maplistRequests";
import { groupCompsByMap } from "@/utils/functions";

export default async function UnconfirmedList({ searchParams }) {
  let page = parseInt(searchParams?.comp_page || "1");
  page = isNaN(page) ? 1 : page;

  const completions = await getUnapprovedRuns({ page });
  const { keyOrder, runsOnSameMap } = groupCompsByMap(completions.completions);

  return (
    <>
      <h1 className="text-center">Unapproved Completions</h1>

      <PaginateElement qname="comp_page" page={page} total={completions.pages}>
        {keyOrder.length ? (
          keyOrder.map((keyMap) => {
            const runs = runsOnSameMap[keyMap];
            const mapData = runs[0].map;
            return (
              <div className="mb-3" key={keyMap}>
                <div className="panel py-2 rounded-bottom-0">
                  <Btd6MapRowPreview
                    name={mapData.name}
                    previewUrl={mapData.map_preview_url}
                  />
                </div>

                {runs.map((completion, i) => (
                  <CompletionRowSubmission
                    key={completion.id}
                    isLast={i === runs.length - 1}
                    completion={completion}
                    userEntry={completion.users.map((uid) => (
                      <UserEntry key={uid} id={uid} centered lead="sm" />
                    ))}
                  />
                ))}
              </div>
            );
          })
        ) : (
          <p className="lead text-center muted">No pending completions!</p>
        )}
      </PaginateElement>
    </>
  );
}
