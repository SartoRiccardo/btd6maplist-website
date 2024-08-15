import { btd6Font } from "@/lib/fonts";
import "./maplistcompletions.css";
import "./btd6map.css";
import Link from "next/link";
import SelectorButton from "./SelectorButton";
import MaplistPoints from "./MaplistPoints";

export default function Btd6MapRow({
  code,
  name,
  hrefBase,
  completion,
  mapIdxAllver,
  mapIdxCurver,
}) {
  const cmpMap = (
    <div className={`panel py-2 my-2 btd6mapRow`}>
      <div className="row">
        <div className="col-12 col-lg-5 d-flex">
          <img
            className={`btd6mapImage`}
            src={`https://data.ninjakiwi.com/btd6/maps/map/${code}/preview`}
          />
          <div className="d-flex flex-column justify-content-center">
            <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
              {name}
            </p>
          </div>
        </div>

        {/* TODO Placeholders - will add medals */}
        {completion && (
          <>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="d-flex my-3 my-lg-0 justify-content-center justify-content-sm-start">
                <SelectorButton active>
                  <img
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.black_border && "comp-blocked"}
                  />
                </SelectorButton>
                <SelectorButton className="mx-1 mx-md-3" active>
                  <img
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.no_geraldo && "comp-blocked"}
                  />
                </SelectorButton>
                <SelectorButton active>
                  <img
                    src="/icon_true.png"
                    width={35}
                    height={35}
                    className={!completion.current_lcc && "comp-blocked"}
                  />
                </SelectorButton>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-4">
              <div
                className={`pointsGainedContanier d-flex justify-content-center`}
              >
                {mapIdxCurver && mapIdxCurver > -1 && (
                  <div className="d-flex">
                    <SelectorButton text="cur" active>
                      <img src="/icon_curver.png" width={40} height={40} />
                    </SelectorButton>

                    <div className={"pointsLabelContainer"}>
                      <p className="fs-5">
                        +
                        <MaplistPoints
                          completion={completion}
                          idx={mapIdxCurver}
                        />
                        pt
                      </p>
                    </div>
                  </div>
                )}

                {mapIdxAllver && mapIdxAllver > -1 && (
                  <div className={`ms-3 d-flex`}>
                    <SelectorButton text="all" active>
                      <img src="/icon_allver.png" width={40} height={40} />
                    </SelectorButton>

                    <div className={"pointsLabelContainer"}>
                      <p className="fs-5">
                        +
                        <MaplistPoints
                          completion={completion}
                          idx={mapIdxAllver}
                        />
                        pt
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return hrefBase ? (
    <Link className={"btd6map-clickable"} href={`${hrefBase}/${code}`}>
      {cmpMap}
    </Link>
  ) : (
    cmpMap
  );
}
