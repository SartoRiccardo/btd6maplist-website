"use client";
import stylesComp from "./MaplistCompletions.module.css";
import stylesMap from "./Btd6Map.module.css";
import Link from "next/link";
import CompletionColumn from "./CompletionColumn";
import { filterCompletionFormats } from "@/utils/maplistUtils";
import { useMaplistFormats } from "@/utils/hooks";
import Btd6MapRowPreview from "../ui/Btd6MapRowPreview";

export default function Btd6MapRow({ map, hrefBase, completion }) {
  completion = completion instanceof Array ? completion : [completion];

  const formats = useMaplistFormats();
  completion = filterCompletionFormats(completion, formats);
  if (!completion.length) return null;

  return (
    <div className={`panel py-2 my-2 ${stylesMap.btd6map_row}`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 d-flex pb-3 pb-md-0">
          {hrefBase ? (
            <Link
              className={stylesMap.btd6map_clickable}
              href={`${hrefBase}/${map.code}`}
            >
              <Btd6MapRowPreview
                previewUrl={map.map_preview_url}
                name={map.name}
              />
            </Link>
          ) : (
            <Btd6MapRowPreview
              previewUrl={map.map_preview_url}
              name={map.name}
            />
          )}
        </div>

        <div
          className={`col-12 col-md-7 col-lg-5 align-self-center ${stylesComp.compcol_container}`}
        >
          <CompletionColumn
            completion={completion}
            mapIdxCurver={map.placement_curver}
            mapIdxAllver={map.placement_allver}
          />
        </div>
      </div>
    </div>
  );
}
