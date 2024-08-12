"use client";
import Image from "next/image";
import styles from "./difficultyselector.module.css";
import SelectorButton from "./SelectorButton";

function DifficultySelector({ onChange, value, difficulties }) {
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
      <SelectorButton text={difficulty.name}>
        <Image src={difficulty.image} width={100} height={100} />
      </SelectorButton>
    </div>
  );
}

export default DifficultySelector;
