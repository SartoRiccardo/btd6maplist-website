"use client";
import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { difficulties } from "@/utils/maplistUtils";
import { useState } from "react";

export default function ExpertMaplist({ maplist }) {
  const [difficulty, setDifficulty] = useState(difficulties[0]);

  return (
    <div>
      <DifficultySelector
        value={difficulty.value}
        onChange={(diff) => setDifficulty(diff)}
        difficulties={difficulties}
      />
      <p className={`${styles.diffDesc}`}>{difficulty.description}</p>
      <div className="row">
        {maplist
          .filter((map) => map.difficulty === difficulty.value)
          .map(({ code, name }) => (
            <div key={code} className="col-12 col-sm-6 col-lg-4">
              <Btd6Map code={code} name={name} hrefBase="/map" />
            </div>
          ))}
      </div>
    </div>
  );
}
