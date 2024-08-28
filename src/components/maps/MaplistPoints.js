"use client";
import { useMaplistConfig } from "@/utils/hooks";
import { calcMapPoints } from "@/utils/maplistUtils";

export default function MaplistPoints({
  completion,
  idx,
  formats,
  icon,
  className,
}) {
  const maplistCfg = useMaplistConfig();
  let isInFormats = completion.formats.includes(0);
  for (let i = 0; i < formats.length && !isInFormats; i++)
    isInFormats = isInFormats || completion.formats.includes(formats[i]);

  return !isInFormats || idx < 0 || idx > maplistCfg.map_count ? null : (
    <div className={`d-flex ${className ? className : ""}`}>
      {icon}

      <div className={"pointsLabelContainer"}>
        <p className="fs-5">
          +
          {calcMapPoints(idx, maplistCfg) *
            (completion.no_geraldo ? maplistCfg.points_multi_gerry : 1) *
            (completion.black_border ? maplistCfg.points_multi_bb : 1) +
            (completion.current_lcc ? maplistCfg.points_extra_lcc : 0)}
          pt
        </p>
      </div>
    </div>
  );
}
