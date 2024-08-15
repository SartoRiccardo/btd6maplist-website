"use client";
import "./difficultyselector.css";
import SelectorButton from "./SelectorButton";

function DifficultySelector({ onChange, value, difficulties }) {
  return (
    <div className={`difficultySelector row`}>
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
      className={`difficulty ${active ? "diffsel-active" : ""}`}
      tabIndex={0}
      onClick={onClick}
    >
      <SelectorButton text={difficulty.name}>
        <img src={difficulty.image} width={100} height={100} />
      </SelectorButton>
    </div>
  );
}

export default DifficultySelector;
