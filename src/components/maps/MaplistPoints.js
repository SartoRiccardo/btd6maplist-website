"use client";
import stylesComp from "./MaplistCompletions.module.css";
import { useMaplistConfig } from "@/utils/hooks";
import { calcMapPoints } from "@/utils/maplistUtils";

export default function MaplistPoints({
  completion,
  prevCompletions,
  idx,
  icon,
  className,
}) {
  const maplistCfg = useMaplistConfig();

  let mul = 0;
  let add = 0;

  if (!completion.black_border && !completion.no_geraldo) {
    if (prevCompletions.some((cmp1) => cmp1.format === completion.format))
      mul = 0;
    else mul = 1;
  } else if (
    completion.black_border &&
    completion.no_geraldo &&
    !prevCompletions.some(
      (cmp1) =>
        completion.format === cmp1.format &&
        cmp1.no_geraldo &&
        cmp1.black_border
    )
  )
    mul = maplistCfg.points_multi_bb * maplistCfg.points_multi_gerry;
  else {
    if (
      completion.black_border &&
      !prevCompletions.some(
        (cmp1) => completion.format === cmp1.format && cmp1.black_border
      )
    )
      mul += maplistCfg.points_multi_bb;
    if (
      completion.no_geraldo &&
      !prevCompletions.some(
        (cmp1) => completion.format === cmp1.format && cmp1.no_geraldo
      )
    )
      mul += maplistCfg.points_multi_gerry;
  }
  if (completion.current_lcc) add += maplistCfg.points_extra_lcc;

  const gainedPoints = calcMapPoints(idx, maplistCfg) * mul + add;

  return idx && idx >= 0 && idx <= maplistCfg.map_count && gainedPoints > 0 ? (
    <div className={`d-flex ${className ? className : ""}`}>
      {icon}

      <div className={stylesComp.points_label_container}>
        <p className="fs-5">+{gainedPoints}pt</p>
      </div>
    </div>
  ) : null;
}
