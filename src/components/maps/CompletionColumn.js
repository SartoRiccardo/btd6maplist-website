"use client";
import stylesComp from "./MaplistCompletions.module.css";
import { allFormats } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import MaplistPoints from "./MaplistPoints";
import RowMedals from "./RowMedals";
import { useAuthLevels } from "@/utils/hooks";
import Link from "next/link";
import BtnShowCompletion from "../buttons/BtnShowCompletion";

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
        const {
          id,
          black_border,
          no_geraldo,
          current_lcc,
          format,
          subm_proof_img,
        } = compl;
        const runFormat = allFormats.find(({ value }) => value === format);
        if (!runFormat) return null;

        const fmtIcon = (
          <SelectorButton text={runFormat.short} className="ms-3" active>
            <img src={runFormat.image} width={35} height={35} />
          </SelectorButton>
        );

        const isAdmin = authLevels.loaded && authLevels.hasPerms;
        return (
          <div key={id} className="row gx-0" data-cy="single-completion">
            <div className="col-6">
              <div className="d-flex justify-content-start h-100">
                <div className="align-self-center">
                  <RowMedals
                    black_border={black_border}
                    no_geraldo={no_geraldo}
                    current_lcc={current_lcc}
                    hideNoGeraldo={runFormat.value > 50}
                  />
                </div>
              </div>
            </div>
            <div className={`col-5`}>
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
                      className="ms-3"
                    />
                  ) : (
                    fmtIcon
                  )}
                </div>
              </div>
            </div>
            <div className="col-1 flex-vcenter">
              {isAdmin ? (
                <Link
                  className={`${stylesComp.completion_link} align-self-center no-underline`}
                  href={`/completions/${id}`}
                >
                  <p className="text-center mb-0">
                    <i className="bi bi-pencil-fill" />
                  </p>
                </Link>
              ) : (
                subm_proof_img.length > 0 && (
                  <BtnShowCompletion src={subm_proof_img} />
                )
              )}
            </div>
          </div>
        );
      })
  );
}
