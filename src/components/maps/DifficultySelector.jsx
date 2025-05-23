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
          className="col-3 col-md-auto d-flex justify-content-center"
          data-cy="difficulty-selector"
          data-difficulty={diff.value.toString()}
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
        <img
          className={stylesDiffS.selector_image}
          src={difficulty.image}
          width={80}
          height={80}
        />
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
