"use client";
import stylesMapP from "./MapPlacements.module.css";
import {
  calcMapPoints,
  difficulties,
  listVersions,
} from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import { titleFont } from "@/lib/fonts";
import { useMaplistConfig } from "@/utils/hooks";

export default function MapPlacements({ mapData, placeholder }) {
  mapData = placeholder
    ? { difficulty: null, placement_cur: null, placement_all: null }
    : mapData;
  const maplistCfg = useMaplistConfig();

  const expertDiff =
    mapData.difficulty !== null
      ? difficulties.filter((diff) => diff.value === mapData.difficulty)[0]
      : null;

  return (
    <>
      {listVersions.map(
        ({ plcKey, image, diffPanelName }) =>
          mapData[plcKey] !== null &&
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

      {placeholder && (
        <DifficultyPanel
          image={"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="}
          label={
            <span style={{ width: "6rem", display: "block" }}>&nbsp;</span>
          }
        />
      )}
    </>
  );
}

function DifficultyPanel({ image, shortLabel, label }) {
  return (
    <div className="col-auto">
      <div className={`${stylesMapP.difficulty_container} shadow`}>
        <div>
          <SelectorButton text={shortLabel} active>
            <img src={image} width={75} height={75} />
          </SelectorButton>
        </div>

        <div className="d-flex flex-column justify-content-center">
          <p
            className={`${titleFont.className} ${stylesMapP.difficulty_label}`}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
