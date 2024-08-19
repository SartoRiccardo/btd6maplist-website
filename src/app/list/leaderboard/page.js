import styles from "./leaderboard.module.css";
import UserEntry from "@/components/users/UserEntry";
import { getListLeaderboard } from "@/server/maplistRequests";
import Link from "next/link";
import { getPositionColor } from "@/utils/functions";
import { listVersions } from "@/utils/maplistUtils";
import DifficultySelector from "@/components/maps/DifficultySelector";
import { Button } from "react-bootstrap";

export const metadata = {
  title: "Leaderboard | BTD6 Maplist",
};

const leaderboards = [
  { key: "points", title: "Points" },
  { key: "lccs", title: "LCCs" },
];

export default async function ListLeaderboard({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!["current", "all"].includes(version.toLowerCase())) {
    version = "current";
  }
  let value = searchParams?.value || "points";
  if (!["points", "lccs"].includes(value.toLowerCase())) {
    value = "points";
  }
  const leaderboard = await getListLeaderboard(version, value);

  let curFormat =
    listVersions.find(({ query }) => version === query) || listVersions[0];

  return (
    <>
      <title>
        {`${value === "points" ? "Point" : "LCC"} Leaderboard${
          version === "all" ? " (all versions)" : ""
        } | BTD6 Maplist`}
      </title>

      <h1 className="text-center">Leaderboard</h1>

      <DifficultySelector
        value={curFormat.value}
        difficulties={listVersions}
        href={
          `/list/leaderboard?` +
          new URLSearchParams({
            ...searchParams,
            format: "{queryval}",
          }).toString()
        }
      />

      <div className={`d-flex justify-content-center ${styles.lbValueChooser}`}>
        {leaderboards.map(({ key, title }) => {
          const isActive = key === value;
          return isActive ? (
            <Button className={isActive ? "active" : ""} key={key}>
              {title}
            </Button>
          ) : (
            <Link
              key={key}
              scroll={false}
              href={
                `/list/leaderboard?` +
                new URLSearchParams({ ...searchParams, value: key }).toString()
              }
              className={`${
                key === value ? styles.lbValueActive : ""
              } font-border`}
            >
              <Button className={isActive ? "active" : ""}>{title}</Button>
            </Link>
          );
        })}
      </div>

      <div className="my-4">
        {leaderboard.map(({ user_id, score, position }) => {
          let style = {};
          const posColor = getPositionColor(position);
          if (posColor !== null) style.backgroundColor = posColor;

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
