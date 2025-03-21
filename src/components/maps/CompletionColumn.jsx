"use client";
import stylesComp from "./MaplistCompletions.module.css";
import { allFormats } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import MaplistPoints from "./MaplistPoints";
import RowMedals from "./RowMedals";
import { useAuthLevels } from "@/utils/hooks";
import Link from "next/link";
import BtnShowCompletion from "../buttons/BtnShowCompletion";
import { Fragment } from "react";

export default function CompletionColumn({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  onlyIcon,
}) {
  const authLevels = useAuthLevels();

  return completion
    .sort((cmp1, cmp2) => {
      return (
        cmp1.format - cmp2.format ||
        cmp1.black_border - cmp2.black_border ||
        cmp1.no_geraldo - cmp2.no_geraldo ||
        cmp1.current_lcc - cmp2.current_lcc ||
        cmp1.id - cmp2.id
      );
    })
    .reverse()
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
      if (!runFormat) return <Fragment key={id} />;

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
                />
              </div>
            </div>
          </div>

          <div className="col-4 col-md-5">
            <div className="d-flex justify-content-end justify-content-lg-start h-100">
              <div className="align-self-center">
                {onlyIcon ? (
                  fmtIcon
                ) : format <= 50 &&
                  (mapIdxCurver !== null || mapIdxAllver !== null) ? (
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

          <div className="col-2 col-md-1 d-flex justify-content-end">
            {isAdmin ? (
              <Link
                className={`${stylesComp.completion_link} align-self-center no-underline`}
                href={`/completions/${id}`}
                data-cy="btn-completion-edit"
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
    });
}
