import { btd6Font } from "@/lib/fonts";
import Link from "next/link";
import CompletionColumn from "./CompletionColumn";

export default function Btd6MapRow({ map, hrefBase, completion }) {
  completion = completion instanceof Array ? completion : [completion];

  const cmpMap = (
    <div className={`panel py-2 my-2 btd6mapRow`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 d-flex pb-3 pb-md-0">
          <div className="d-flex align-self-center">
            <img
              className={`btd6mapImage`}
              src={`https://data.ninjakiwi.com/btd6/maps/map/${map.code}/preview`}
            />
            <div className="d-flex flex-column justify-content-center">
              <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
                {map.name}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 col-lg-5 align-self-center">
          <CompletionColumn
            completion={completion}
            mapIdxCurver={map.placement_cur}
            mapIdxAllver={map.placement_all}
          />
        </div>
      </div>
    </div>
  );

  return hrefBase ? (
    <Link
      scroll={false}
      className={"btd6map-clickable"}
      href={`${hrefBase}/${map.code}`}
    >
      {cmpMap}
    </Link>
  ) : (
    cmpMap
  );
}
