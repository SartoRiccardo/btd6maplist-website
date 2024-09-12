import { getUserCompletions } from "@/server/maplistRequests";
import Btd6MapRow from "../maps/Btd6MapRow";
import PaginateElement from "../buttons/PaginateElement";
import { groupCompsByMap } from "@/utils/functions";

export default async function UserCompletions({ userId, page }) {
  const completions = await getUserCompletions(userId, { page });
  const { keyOrder, runsOnSameMap } = groupCompsByMap(completions.completions);

  return keyOrder.length ? (
    <PaginateElement qname="comp_page" page={page} total={completions.pages}>
      {keyOrder.map((key) => (
        <Btd6MapRow
          key={key}
          hrefBase="/map"
          map={runsOnSameMap[key][0].map}
          completion={runsOnSameMap[key]}
        />
      ))}
    </PaginateElement>
  ) : (
    <p className="fs-5 muted text-center">Nothing here yet!</p>
  );
}
