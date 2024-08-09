import Btd6Map from "@/components/maps/Btd6Map";
import { getExpertMaplist } from "@/server/maplistRequests";

export default async function ExpertMaps() {
  const maplist = await getExpertMaplist();
  return (
    <div className="row">
      {maplist
        .filter(({ difficulty }) => difficulty === 0)
        .map(({ code, creator, name }) => (
          <div key={code} className="col-12 col-sm-6 col-lg-4">
            <Btd6Map code={code} creator={creator} name={name} />
          </div>
        ))}
    </div>
  );
}
