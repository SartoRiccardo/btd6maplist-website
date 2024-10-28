import stylesComp from "./MaplistCompletions.module.css";
import { allFormats, filterCompletionFormats } from "@/utils/maplistUtils";
import CompletionColumn from "./CompletionColumn";

export default function CompletionRow({
  completion,
  mapIdxCurver,
  mapIdxAllver,
  className,
  userEntry,
  onlyIcon,
}) {
  completion = completion instanceof Array ? completion : [completion];
  completion = filterCompletionFormats(completion, allFormats);
  if (!completion.length) return null;

  return (
    <div
      className={`panel my-2 overflow-hidden ${className || ""}`}
      data-cy="completion"
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
        </div>
      </div>
    </div>
  );
}
