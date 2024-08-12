"use client";
import styles from "./maplist.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { useState } from "react";

const difficulties = [
  {
    name: "Casual",
    value: 0,
    image: "/icon_casual.png",
    description:
      "Easy and enjoyable, yet not brainless maps. Expect a game where many towers are viable. Comparable difficulty to maps like Workshop and Muddy Puddles.",
  },
  {
    name: "Medium",
    value: 1,
    image: "/icon_medium.png",
    description:
      "Challenging, but not frustrating or intense difficulty. May have complications at any point. Comparable difficulty to maps like Sanctuary and Flooded Valley.",
  },
  {
    name: "Hard",
    value: 2,
    image: "/icon_hard.png",
    description:
      "Has at least one phase of the game that is very tough, usually a hard lategame at minimum. Comparable difficulty to maps like Dark Dungeons and Quad.",
  },
  {
    name: "True",
    value: 3,
    image: "/icon_true.png",
    description:
      "If you're asking for one of the best, you'd better be one of the best. Many strategies will not work. Comparable to, or even greater difficulty than maps like Bloody Puddles and Ouch.",
  },
];

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
          .map(({ code, creator, name }) => (
            <div key={code} className="col-12 col-sm-6 col-lg-4">
              <Btd6Map code={code} creator={creator} name={name} />
            </div>
          ))}
      </div>
    </div>
  );
}
