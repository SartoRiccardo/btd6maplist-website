"use client";
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
              <img
                src={`/format_icons/icon_${query}.webp`}
                className={`${cssMedals.inline_medal} ${cssMedals.format_border} me-1`}
              />
              {name} Expert completions award{" "}
              <b>
                {maplistCfg[points_cfg]} point
                {maplistCfg[points_cfg] > 1 && "s"}
              </b>
              {maplistCfg[points_nogerry_cfg] > 0 && (
                <ul>
                  <li>
                    <img
                      src="/medals/medal_nogerry.webp"
                      className={`${cssMedals.inline_medal} me-1`}
                    />
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
    </div>
  );
}
