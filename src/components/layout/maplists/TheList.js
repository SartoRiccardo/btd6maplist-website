"use client";
import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { selectMaplistProfile } from "@/features/authSlice";
import { useAppSelector } from "@/lib/store";
import { listVersions } from "@/utils/maplistUtils";
import { useState } from "react";

export default function TheList({ current, allvers }) {
  const [version, setVersion] = useState(listVersions[0]);
  const { maplistProfile } = useAppSelector(selectMaplistProfile);

  return (
    <div>
      <DifficultySelector
        value={version.value}
        onChange={(diff) => setVersion(diff)}
        difficulties={listVersions}
      />
      <p className={`${styles.diffDesc}`}>{version.description}</p>
      <div className="row">
        {(version.value ? allvers : current).map(
          ({ code, placement, name, verified }) => {
            let completion = null;
            if (maplistProfile) {
              let compIdx = maplistProfile.completions.findIndex(
                ({ formats, map }) =>
                  map.code === code &&
                  (formats.includes(0) || formats.includes(version.value + 1))
              );
              if (compIdx > -1)
                completion = maplistProfile.completions[compIdx];
            }

            return (
              <div key={code} className="col-12 col-sm-6 col-lg-4">
                <Btd6Map
                  code={code}
                  name={name}
                  hrefBase="/map"
                  verified={verified}
                  placement={placement}
                  completion={completion}
                  showMedals={maplistProfile !== null}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
