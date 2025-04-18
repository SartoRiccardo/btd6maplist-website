"use client";
import stylesComp from "./MaplistCompletions.module.css";
import { filterCompletionFormats } from "@/utils/maplistUtils";
import CompletionColumn from "./CompletionColumn";
import { useMaplistFormats } from "@/utils/hooks";

export default function CompletionRow({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  className,
  userEntry,
  onlyIcon,
  extraColumns,
  cy_excludeData,
}) {
  extraColumns = extraColumns || [];
  completion = completion instanceof Array ? completion : [completion];

  const formats = useMaplistFormats();
  completion = filterCompletionFormats(completion, formats);
  if (!(completion.length + extraColumns.length)) return null;

  return (
    <div
      className={`panel ${
        !/my-\d/.test(className) ? "my-2" : ""
      } overflow-hidden ${className || ""}`}
      data-cy={cy_excludeData ? undefined : "completion"}
    >
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 align-self-center">
          {userEntry}
        </div>

        <div
          className={`col-12 col-md-7 col-lg-5 align-self-center ${stylesComp.compcol_container}`}
        >
          <CompletionColumn
            completion={completion}
            mapIdxCurver={mapIdxCurver}
            mapIdxAllver={mapIdxAllver}
            onlyIcon={onlyIcon}
          />
          {extraColumns}
        </div>
      </div>
    </div>
  );
}
