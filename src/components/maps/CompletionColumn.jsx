"use client";
import stylesComp from "./MaplistCompletions.module.css";
import { allFormats } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import MaplistPoints from "./MaplistPoints";
import RowMedals from "./RowMedals";
import { useHasPerms } from "@/utils/hooks";
import Link from "next/link";
import BtnShowCompletion from "../buttons/BtnShowCompletion";
import { Fragment } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function CompletionColumn({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  onlyIcon,
}) {
  const hasPerms = useHasPerms();

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
        <FormatIcon
          name={runFormat?.longName || runFormat.name}
          image={runFormat.image}
          id={id}
        />
      );

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
                ) : (format === 1 && mapIdxCurver !== null) ||
                  (format === 2 && mapIdxAllver !== null) ? (
                  <MaplistPoints
                    completion={compl}
                    prevCompletions={completion.slice(0, i)}
                    idx={format === 1 ? mapIdxCurver : mapIdxAllver}
                    icon={fmtIcon}
                    className="ms-3"
                  />
                ) : (
                  fmtIcon
                )}
              </div>
            </div>
          </div>

          <div className="col-2 col-md-1 d-flex justify-content-center">
            {hasPerms(["edit:completion", "delete:completion"], { format }) ? (
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

function FormatIcon({ image, name, id }) {
  return (
    <OverlayTrigger
      overlay={(props) => (
        <Tooltip {...props} id={`tooltip-format-comp-${id}`}>
          Beaten with {name} rules
        </Tooltip>
      )}
    >
      <div>
        <SelectorButton className="me-2" active>
          <img src={image} width={35} height={35} />
        </SelectorButton>
      </div>
    </OverlayTrigger>
  );
}
