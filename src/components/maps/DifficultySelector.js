"use client";
import stylesDiffS from "./DifficultySelector.module.css";
import SelectorButton from "../buttons/SelectorButton";
import Link from "next/link";

function DifficultySelector({ onChange, value, difficulties, href }) {
  if (difficulties.length < 2) return null;

  return (
    <div className={`${stylesDiffS.difficulty_selector} row`}>
      {difficulties.map((diff) => (
        <div
          key={diff.value}
          className="col-6 col-md-4 col-lg-auto d-flex justify-content-center"
        >
          <Difficulty
            difficulty={diff}
            onClick={(_e) => onChange && onChange(diff)}
            active={diff.value === value}
            href={diff.value === value ? null : href}
          />
        </div>
      ))}
    </div>
  );
}

function Difficulty({ difficulty, onClick, active, href }) {
  const cmp = (
    <div
      className={`${stylesDiffS.difficulty} ${
        active ? stylesDiffS.active : ""
      }`}
      tabIndex={0}
      onClick={onClick}
    >
      <SelectorButton text={difficulty.name}>
        <img src={difficulty.image} width={100} height={100} />
      </SelectorButton>
    </div>
  );

  return href ? (
    <Link
      href={href
        .replace("{queryval}", difficulty.query)
        .replace("%7Bqueryval%7D", difficulty.query)}
      className="white-text"
      scroll={false}
    >
      {cmp}
    </Link>
  ) : (
    cmp
  );
}

export default DifficultySelector;
