"use client";
import {
  calcMapPoints,
  difficulties,
  listVersions,
} from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import { titleFont } from "@/lib/fonts";
import { useMaplistConfig } from "@/utils/hooks";

export default function MapPlacements({ mapData }) {
  const maplistCfg = useMaplistConfig();

  const expertDiff =
    mapData.difficulty > -1
      ? difficulties.filter((diff) => diff.value === mapData.difficulty)[0]
      : null;
  listVersions;
  return (
    <>
      {listVersions.map(
        ({ plcKey, image, diffPanelName }) =>
          mapData[plcKey] > -1 &&
          mapData[plcKey] <= maplistCfg.map_count && (
            <DifficultyPanel
              key={plcKey}
              image={image}
              shortLabel={diffPanelName}
              label={`#${mapData[plcKey]} ~ ${
                Object.keys(maplistCfg).length
                  ? calcMapPoints(mapData[plcKey], maplistCfg)
                  : "&nbsp&nbsp"
              }pt`}
            />
          )
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
