"use client";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { calcMapPoints } from "@/utils/maplistUtils";

export default function MaplistPoints({ completion, idx }) {
  const maplistCfg = useAppSelector(selectMaplistConfig);

  return (
    <>
      {(calcMapPoints(idx, maplistCfg) +
        (completion.current_lcc ? maplistCfg.points_extra_lcc : 0)) *
        (completion.no_geraldo ? maplistCfg.points_multi_gerry : 1) *
        (completion.black_border ? maplistCfg.points_multi_bb : 1)}
    </>
  );
}
