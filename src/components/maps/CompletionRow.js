import MaplistPoints from "./MaplistPoints";
import SelectorButton from "../buttons/SelectorButton";

export default function CompletionRow({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  className,
  userEntry,
}) {
  completion = completion instanceof Array ? completion : [completion];

  return (
    <div className={`panel my-2 ${className || ""}`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 align-self-center">
          {userEntry}
        </div>

        <div className="col-12 col-md-7 col-lg-5 align-self-center">
          {completion
            .sort((c1, c2) => c1.format - c2.format)
            .map((compl) => {
              const { id, black_border, no_geraldo, current_lcc, format } =
                compl;
              return (
                <div key={id} className="row single-completion">
                  <div className="col-6">
                    <div className="d-flex justify-content-start h-100">
                      <div className="align-self-center">
                        <RowMedals
                          black_border={black_border}
                          no_geraldo={no_geraldo}
                          current_lcc={current_lcc}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex justify-content-end justify-content-lg-start h-100">
                      <div className="align-self-center">
                        <MaplistPoints
                          completion={compl}
                          idx={format === 1 ? mapIdxCurver : mapIdxAllver}
                          icon={
                            <SelectorButton
                              text={format === 1 ? "cur" : "all"}
                              active
                            >
                              <img
                                src={
                                  format === 1
                                    ? "/icon_curver.png"
                                    : "/icon_allver.png"
                                }
                                width={35}
                                height={35}
                              />
                            </SelectorButton>
                          }
                          className={"ms-3"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

const medal_size = 45;
function RowMedals({ black_border, no_geraldo, current_lcc }) {
  return (
    <div>
      <img
        src={black_border ? "/medal_bb.webp" : "/medal_win.webp"}
        width={medal_size}
        height={medal_size}
      />
      <img
        src="/medal_nogerry.png"
        width={medal_size}
        height={medal_size}
        className={`${!no_geraldo ? "comp-blocked" : ""} mx-2`}
      />
      <img
        src="/medal_lcc.webp"
        width={medal_size}
        height={medal_size}
        className={!current_lcc ? "transparent" : ""}
      />
    </div>
  );
}
