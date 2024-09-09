import { getUserCompletions } from "@/server/maplistRequests";
import Btd6MapRow from "../maps/Btd6MapRow";
import PaginateElement from "../buttons/PaginateElement";

export default async function UserCompletions({ userId, page }) {
  const completions = await getUserCompletions(userId, { page });

  let equalRuns = {};
  let keyOrder = [];
  for (const run of completions.completions) {
    const key = run.map.code;
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
      equalRuns[key] = [];
    }
    equalRuns[key].push(run);
  }

  return keyOrder.length ? (
    <PaginateElement qname="comp_page" page={page} total={completions.pages}>
      {keyOrder.map((key) => (
        <Btd6MapRow
          key={key}
          hrefBase="/map"
          map={equalRuns[key][0].map}
          completion={equalRuns[key]}
        />
      ))}
    </PaginateElement>
  ) : (
    <p className="fs-5 muted text-center">Nothing here yet!</p>
  );
}
