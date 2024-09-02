import { getUserCompletions } from "@/server/maplistRequests";
import Btd6MapRow from "../maps/Btd6MapRow";

export default async function UserCompletions({ userId, page }) {
  const completions = await getUserCompletions(userId);

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
    keyOrder.map((key) => (
      <Btd6MapRow
        key={key}
        hrefBase="/map"
        map={equalRuns[key][0].map}
        completion={equalRuns[key]}
      />
    ))
  ) : (
    <p className="fs-5 muted text-center">Nothing here yet!</p>
  );
}
