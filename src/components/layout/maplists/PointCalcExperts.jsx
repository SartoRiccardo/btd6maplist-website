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
        {difficulties.map(({ query, value, points_cfg, name }) => (
          <li key={value} className="mb-1">
            <img
              src={`/format_icons/icon_${query}.webp`}
              className={`${cssMedals.inline_medal} ${cssMedals.format_border} me-1`}
            />
            {name} Expert completions award{" "}
            <b>
              {maplistCfg[points_cfg]} point{maplistCfg[points_cfg] > 1 && "s"}
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
}
