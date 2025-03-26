"use client";
import Medal from "@/components/ui/Medal";
import cssMedals from "@/components/maps/Medals.module.css";
import { useMaplistConfig } from "@/utils/hooks";
import { difficulties } from "@/utils/maplistUtils";

export default function PointCalcExperts() {
  const maplistCfg = useMaplistConfig();
  return (
    <div className="panel pt-3 px-3">
      <h2 className="text-center">Points Assigned per Run</h2>
      <p>Once you beat a map, you will be assigned its points.</p>
      <ul>
        {difficulties.map(({ query, value, points_cfg, name }) => {
          const points_nogerry_cfg = points_cfg.replace(
            "_points",
            "_nogerry_points"
          );
          return (
            <li key={value} className="mb-1">
              <Medal
                src={`/format_icons/icon_${query}.webp`}
                padEnd
                padHeight
                border
              />{" "}
              {name} Expert completions award{" "}
              <b>
                {maplistCfg[points_cfg]} point
                {maplistCfg[points_cfg] > 1 && "s"}
              </b>
              {maplistCfg[points_nogerry_cfg] > 0 && (
                <ul>
                  <li>
                    <Medal src="/medals/medal_nogerry.webp" padEnd padHeight />{" "}
                    No Optimal Hero completions on this difficulty award{" "}
                    <b>
                      +{maplistCfg[points_nogerry_cfg]} point
                      {maplistCfg[points_nogerry_cfg] > 1 && "s"}
                    </b>
                  </li>
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <p>There are extra modifiers if you beat certain challenges:</p>
      <ul>
        {maplistCfg.exp_bb_multi !== 1 && (
          <li>
            <Medal src="/medals/medal_bb.webp" padHeight /> Black Border runs
            multiply <b>base</b> points earned by{" "}
            <b>x{maplistCfg.exp_bb_multi}</b>
          </li>
        )}
        {maplistCfg.exp_lcc_extra !== 0 && (
          <li>
            <Medal src="/medals/medal_lcc.webp" padHeight /> Holding the current
            Least Cost CHIMPS run on a map awards{" "}
            <b>+{maplistCfg.exp_lcc_extra} points</b> on it
          </li>
        )}
      </ul>
    </div>
  );
}
