import "./maplistcompletions.css";
import MaplistPoints from "./MaplistPoints";
import SelectorButton from "../buttons/SelectorButton";

export default function CompletionRow({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  className,
  userEntry,
}) {
  return (
    <div className={`panel my-2 ${className || ""}`}>
      <div className="row">
        <div className="col-6 col-lg-5">{userEntry}</div>

        <div className="col-6 col-lg-3">
          <div className="d-flex justify-content-end justify-content-lg-start h-100">
            <div className="flex-vcenter">
              <div>
                <img
                  src={
                    completion.black_border
                      ? "/medal_bb.webp"
                      : "/medal_win.webp"
                  }
                  width={45}
                  height={45}
                />
                <img
                  src="/medal_nogerry.png"
                  width={45}
                  height={45}
                  className={`${
                    !completion.no_geraldo ? "comp-blocked" : ""
                  } mx-2`}
                />
                <img
                  src="/medal_lcc.webp"
                  width={45}
                  height={45}
                  className={!completion.current_lcc ? "comp-blocked" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div
            className={`pointsGainedContanier d-flex justify-content-center`}
          >
            {mapIdxCurver > -1 &&
              (completion.formats.includes(1) ||
                completion.formats.includes(0)) && (
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

            {mapIdxAllver > -1 &&
              (completion.formats.includes(2) ||
                completion.formats.includes(0)) && (
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
      </div>
    </div>
  );
}
