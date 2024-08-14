"use client";
import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { listVersions } from "@/utils/maplistUtils";
import { useState } from "react";

export default function TheList({ current, allvers }) {
  const [version, setVersion] = useState(listVersions[0]);

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
          ({ code, placement, name, verified }) => (
            <div key={code} className="col-12 col-sm-6 col-lg-4">
              <Btd6Map
                code={code}
                name={name}
                hrefBase="/map"
                verified={verified}
                placement={placement}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
