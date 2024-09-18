"use client";
import { allFormats } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import MaplistPoints from "./MaplistPoints";
import RowMedals from "./RowMedals";
import { useAuthLevels } from "@/utils/hooks";
import Link from "next/link";

export default function CompletionColumn({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  onlyIcon,
}) {
  const authLevels = useAuthLevels();

  return (
    completion
      // .sort((c1, c2) => c1.format - c2.format)
      .map((compl, i) => {
        const { id, black_border, no_geraldo, current_lcc, format } = compl;
        const runFormat = allFormats.find(({ value }) => value === format);
        if (!runFormat) return null;

        const fmtIcon = (
          <SelectorButton text={runFormat.short} active>
            <img src={runFormat.image} width={35} height={35} />
          </SelectorButton>
        );

        const isAdmin = authLevels.loaded && authLevels.hasPerms;
        return (
          <div key={id} className="row gx-0">
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
            <div className={`col-${isAdmin ? "5" : "6"}`}>
              <div className="d-flex justify-content-end justify-content-lg-start h-100">
                <div className="align-self-center">
                  {onlyIcon ? (
                    fmtIcon
                  ) : format <= 50 &&
                    (mapIdxCurver !== -1 || mapIdxAllver !== -1) ? (
                    <MaplistPoints
                      completion={compl}
                      prevCompletions={completion.slice(0, i)}
                      idx={format === 1 ? mapIdxCurver : mapIdxAllver}
                      icon={
                        <SelectorButton text={runFormat.short} active>
                          <img src={runFormat.image} width={35} height={35} />
                        </SelectorButton>
                      }
                      className={"ms-3"}
                    />
                  ) : (
                    fmtIcon
                  )}
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="col-1 flex-vcenter">
                <Link
                  className="completion-link align-self-center no-underline"
                  key={id}
                  href={`/completions/${id}`}
                >
                  <p className="text-center mb-0">
                    <i className="bi bi-three-dots" />
                  </p>
                </Link>
              </div>
            )}
          </div>
        );
      })
  );
}
