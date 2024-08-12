"use client";
import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { useState } from "react";

const versions = [
  {
    name: "Current",
    value: 0,
    image: "/icon_curver.png",
    description: "",
  },
  {
    name: "All Versions",
    value: 1,
    image: "/icon_allver.png",
    description: "",
  },
];

export default function TheList({ current, allvers }) {
  const [version, setVersion] = useState(versions[0]);

  return (
    <div>
      <DifficultySelector
        value={version.value}
        onChange={(diff) => setVersion(diff)}
        difficulties={versions}
      />
      <p className={`${styles.diffDesc}`}>{version.description}</p>
      <div className="row">
        {(version.value ? allvers : current).map(
          ({ code, placement, name }) => (
            <div key={code} className="col-12 col-sm-6 col-lg-4">
              <Btd6Map
                code={code}
                name={name}
                hrefBase="/map"
                placement={placement}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
