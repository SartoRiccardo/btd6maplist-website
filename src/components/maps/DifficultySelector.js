"use client";
import Image from "next/image";
import styles from "./difficultyselector.module.css";
import { btd6Font } from "@/lib/fonts";

export const difficulties = [
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

function DifficultySelector({ onChange, value }) {
  return (
    <div className={`${styles.difficultySelector} row`}>
      {difficulties.map((diff) => (
        <div
          key={diff.value}
          className="col-6 col-md-auto d-flex justify-content-center"
        >
          <Difficulty
            difficulty={diff}
            onClick={(_e) => onChange(diff)}
            active={diff.value === value}
          />
        </div>
      ))}
    </div>
  );
}

function Difficulty({ difficulty, onClick, active }) {
  return (
    <div
      className={`${styles.difficulty} ${active ? styles.active : ""}`}
      tabIndex={0}
      onClick={onClick}
    >
      <div className={`${styles.imgWrapper} shadow`}>
        <Image src={difficulty.image} width={100} height={100} />
        <p className={`${btd6Font.className} font-border text-center`}>
          {difficulty.name}
        </p>
      </div>
    </div>
  );
}

export default DifficultySelector;
