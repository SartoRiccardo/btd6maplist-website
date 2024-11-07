import styles from "./leaderboard.module.css";
import { getPositionColor } from "@/utils/functions";
import { allFormats } from "@/utils/maplistUtils";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { UserEntry_Plc } from "@/components/users/UserEntry.client";
import { leaderboards } from "./page";

export default function ListLeaderboardLoader() {
  const entries = [];
  for (let position = 1; position <= 20; position++) {
    let style = {};
    const posColor = getPositionColor(position);
    if (posColor !== null) style.backgroundColor = posColor;

    entries.push(
      <div
        key={position}
        className={`panel my-2 row ${position <= 3 ? "font-border" : ""}`}
        style={style}
        data-cy="leaderboard-entry"
      >
        <div className="col-1 d-flex flex-column justify-content-center">
          <p className="fs-4 lb-position text-center mb-0">#{position}</p>
        </div>
        <div className="col-8">
          <UserEntry_Plc />
        </div>
        <div className="col-3 d-flex flex-column justify-content-center">
          <p className="fs-4 text-end mb-0">&nbsp;</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center">Leaderboard</h1>

      <DifficultySelector difficulties={allFormats} />

      <div className={`d-flex justify-content-center ${styles.lbValueChooser}`}>
        {leaderboards.map(({ key, title }) => (
          <a key={key} href="#" className="font-border">
            <button className="btn btn-primary">{title}</button>
          </a>
        ))}
      </div>

      <div className="my-4">{entries}</div>
    </>
  );
}
