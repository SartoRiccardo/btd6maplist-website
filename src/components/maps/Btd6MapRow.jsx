import stylesComp from "./MaplistCompletions.module.css";
import stylesMap from "./Btd6Map.module.css";
import { btd6Font } from "@/lib/fonts";
import Link from "next/link";
import CompletionColumn from "./CompletionColumn";
import { allFormats, filterCompletionFormats } from "@/utils/maplistUtils";
import Image from "../utils/Image";

export default function Btd6MapRow({ map, hrefBase, completion }) {
  completion = completion instanceof Array ? completion : [completion];
  completion = filterCompletionFormats(completion, allFormats);
  if (!completion.length) return null;

  const cmpMap = (
    <div className="d-flex align-self-center">
      <Image
        className={stylesMap.btd6map_image}
        src={map.map_preview_url}
        alt=""
        width={225}
        height={150}
      />
      <div className="d-flex flex-column justify-content-center">
        <p className={`mb-0 ps-3 ${btd6Font.className} font-border fs-5`}>
          {map.name}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`panel py-2 my-2 ${stylesMap.btd6map_row}`}>
      <div className="row">
        <div className="col-12 col-md-5 col-lg-7 d-flex pb-3 pb-md-0">
          {hrefBase ? (
            <Link
              className={stylesMap.btd6map_clickable}
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
            mapIdxCurver={map.placement_curver}
            mapIdxAllver={map.placement_allver}
          />
        </div>
      </div>
    </div>
  );
}
