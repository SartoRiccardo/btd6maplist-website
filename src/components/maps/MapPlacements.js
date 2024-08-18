"use client";
import "./mapplacements.css";
import { selectMaplistConfig } from "@/features/maplistSlice";
import { useAppSelector } from "@/lib/store";
import { calcMapPoints, difficulties } from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import { titleFont } from "@/lib/fonts";

export default function MapPlacements({ mapData }) {
  const maplistCfg = useAppSelector(selectMaplistConfig);

  const expertDiff =
    mapData.difficulty > -1
      ? difficulties.filter((diff) => diff.value === mapData.difficulty)[0]
      : null;
  return (
    <>
      {mapData.placement_cur > -1 && (
        <DifficultyPanel
          image="/icon_curver.png"
          shortLabel="Maplist"
          label={`#${mapData.placement_cur} ~ ${
            Object.keys(maplistCfg).length
              ? calcMapPoints(mapData.placement_cur, maplistCfg)
              : "&nbsp&nbsp"
          }pt`}
        />
      )}
      {mapData.placement_all > -1 && (
        <DifficultyPanel
          image="/icon_allver.png"
          shortLabel="All Vers"
          label={`#${mapData.placement_all} ~ ${
            Object.keys(maplistCfg).length
              ? calcMapPoints(mapData.placement_all, maplistCfg)
              : "&nbsp&nbsp"
          }pt`}
        />
      )}
      {expertDiff && (
        <DifficultyPanel
          image={expertDiff.image}
          shortLabel={expertDiff.name}
          label={`${expertDiff.name} Expert`}
        />
      )}
    </>
  );
}

function DifficultyPanel({ image, shortLabel, label }) {
  return (
    <div className="col-auto">
      <div className={`difficultyContainer shadow`}>
        <div>
          <SelectorButton text={shortLabel} active>
            <img src={image} width={75} height={75} />
          </SelectorButton>
        </div>

        <div className="d-flex flex-column justify-content-center">
          <p className={`${titleFont.className} difficultyLabel`}>{label}</p>
        </div>
      </div>
    </div>
  );
}
