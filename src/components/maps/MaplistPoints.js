"use client";
import { useMaplistConfig } from "@/utils/hooks";
import { calcMapPoints } from "@/utils/maplistUtils";

export default function MaplistPoints({ completion, idx }) {
  const maplistCfg = useMaplistConfig();

  return (
    <>
      {calcMapPoints(idx, maplistCfg) *
        (completion.no_geraldo ? maplistCfg.points_multi_gerry : 1) *
        (completion.black_border ? maplistCfg.points_multi_bb : 1) +
        (completion.current_lcc ? maplistCfg.points_extra_lcc : 0)}
    </>
  );
}
