import styles from "./leaderboard.module.css";
import UserEntry from "@/components/users/UserEntry";
import { getListLeaderboard } from "@/server/maplistRequests";
import ListLeaderboardDifficulty from "./page.client";
import Link from "next/link";

const verToValue = {
  current: 0,
  all: 1,
};

const leaderboards = [
  { key: "points", title: "Points" },
  { key: "lccs", title: "LCCs" },
];

export default async function ListLeaderboard({ searchParams }) {
  let version = searchParams?.version || "current";
  if (!["current", "all"].includes(version.toLowerCase())) {
    version = "current";
  }
  let value = searchParams?.value || "points";
  if (!["points", "lccs"].includes(value.toLowerCase())) {
    value = "points";
  }
  const leaderboard = await getListLeaderboard(version, value);

  return (
    <>
      <h1 className="text-center">Leaderboard</h1>

      <ListLeaderboardDifficulty value={verToValue[version]} />

      <div className={`d-flex justify-content-center ${styles.lbValueChooser}`}>
        {leaderboards.map(({ key, title }) => (
          <Link
            key={key}
            href={`/list/leaderboard?version=${version}&value=${key}`}
            className={`${
              key === value ? styles.lbValueActive : ""
            } font-border`}
          >
            <div className="fs-3 panel">
              <p className="mb-0">
                <b>{title}</b>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="my-4">
        {leaderboard.map(({ user_id, score, position }) => {
          let style = {};
          if (position === 1) style = { backgroundColor: "#ffd54f" };
          else if (position === 2) style = { backgroundColor: "#e0e0e0" };
          else if (position === 3) style = { backgroundColor: "#cd7f32" };

          return (
            <div
              key={user_id}
              className={`panel my-2 row ${position <= 3 ? "font-border" : ""}`}
              style={style}
            >
              <div className="col-1 d-flex flex-column justify-content-center">
                <p className="fs-4 text-center mb-0">#{position}</p>
              </div>
              <div className="col-8">
                <UserEntry id={user_id} centered lead="sm" />
              </div>
              <div className="col-3 d-flex flex-column justify-content-center">
                <p className="fs-4 text-end mb-0">
                  {score}
                  {value === "points" && "pt"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
