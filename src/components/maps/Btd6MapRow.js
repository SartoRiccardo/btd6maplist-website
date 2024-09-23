import stylesComp from "./MaplistCompletions.module.css";
import { btd6Font } from "@/lib/fonts";
import Link from "next/link";
import CompletionColumn from "./CompletionColumn";
import { allFormats, filterCompletionFormats } from "@/utils/maplistUtils";

export default function Btd6MapRow({ map, hrefBase, completion }) {
  completion = completion instanceof Array ? completion : [completion];
  completion = filterCompletionFormats(completion, allFormats);
  if (!completion.length) return null;

  const cmpMap = (
    <div className="d-flex align-self-center">
      <img className="btd6mapImage" loading="lazy" src={map.map_preview_url} />
      <div className="d-flex flex-column justify-content-center">
        <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
          {map.name}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`panel py-2 my-2 btd6mapRow`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 d-flex pb-3 pb-md-0">
          {hrefBase ? (
            <Link
              scroll={false}
              className="btd6map-clickable"
              href={`${hrefBase}/${map.code}`}
            >
              {cmpMap}
            </Link>
          ) : (
            cmpMap
          )}
        </div>

        <div
          className={`col-12 col-md-7 col-lg-5 align-self-center ${stylesComp.compcol_container}`}
        >
          <CompletionColumn
            completion={completion}
            mapIdxCurver={map.placement_cur}
            mapIdxAllver={map.placement_all}
          />
        </div>
      </div>
    </div>
  );
}
