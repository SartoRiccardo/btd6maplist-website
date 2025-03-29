"use client";
import stylesMapP from "./MapPlacements.module.css";
import {
  botbDifficulties,
  calcMapPoints,
  difficulties,
  listVersions,
} from "@/utils/maplistUtils";
import SelectorButton from "../buttons/SelectorButton";
import { titleFont } from "@/lib/fonts";
import { useMaplistConfig, useVisibleFormats } from "@/utils/hooks";
import { emptyImage } from "@/utils/misc";
import Image from "next/image";

export default function MapPlacements({ mapData, placeholder }) {
  mapData = placeholder
    ? { difficulty: null, placement_cur: null, placement_all: null }
    : mapData;
  const maplistCfg = useMaplistConfig();
  const visibleFormats = useVisibleFormats(true);

  const expertDiff =
    mapData.difficulty !== null
      ? difficulties.filter((diff) => diff.value === mapData.difficulty)[0]
      : null;

  const botbDiff =
    mapData.botb_difficulty !== null
      ? botbDifficulties.filter((diff) => {
          const formats = diff?.difficuly_values || diff.value;
          return Array.isArray(formats)
            ? formats.includes(mapData.botb_difficulty)
            : mapData.botb_difficulty === formats;
        })[0]
      : null;

  return (
    <>
      {listVersions
        .filter(({ value }) => visibleFormats.includes(value))
        .map(
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

      {expertDiff && visibleFormats.includes(51) && (
        <DifficultyPanel
          image={expertDiff.image}
          shortLabel={expertDiff.name}
          label={`${expertDiff.name} Expert`}
        />
      )}

      {botbDiff && visibleFormats.includes(52) && (
        <DifficultyPanel
          image={botbDiff.image}
          shortLabel={botbDiff.name}
          label="Best of the Best"
        />
      )}

      {placeholder && (
        <DifficultyPanel
          image={emptyImage}
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
    <div className="col-6 col-md-auto">
      <div className={`${stylesMapP.difficulty_container} shadow`}>
        <div>
          <SelectorButton text={shortLabel} active>
            <Image alt="" src={image} width={50} height={50} />
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
