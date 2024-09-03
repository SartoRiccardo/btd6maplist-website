import { listVersions } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import MaplistPoints from "./MaplistPoints";
import RowMedals from "./RowMedals";

export default function CompletionColumn({
  completion,
  mapIdxCurver,
  mapIdxAllver,
}) {
  return completion
    .sort((c1, c2) => c1.format - c2.format)
    .map((compl) => {
      const { id, black_border, no_geraldo, current_lcc, format } = compl;
      const runFormat = listVersions.find(({ value }) => value === format);
      if (!runFormat) return null;

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
                    <SelectorButton text={runFormat.short} active>
                      <img src={runFormat.image} width={35} height={35} />
                    </SelectorButton>
                  }
                  className={"ms-3"}
                />
              </div>
            </div>
          </div>
        </div>
      );
    });
}
