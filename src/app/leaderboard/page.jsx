import styles from "./leaderboard.module.css";
import UserEntry from "@/components/users/UserEntry";
import {
  getListLeaderboard,
  getVisibleFormats,
} from "@/server/maplistRequests";
import Link from "next/link";
import { getPositionColor } from "@/utils/functions";
import { allFormats, leaderboards } from "@/utils/maplistUtils";
import DifficultySelector from "@/components/maps/DifficultySelector";
import PaginateElement from "@/components/buttons/PaginateElement";
import { PointCalcFade } from "./page.client";

export async function generateMetadata({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!["current", "all"].includes(version.toLowerCase())) version = "current";
  let value = searchParams?.value || "points";
  if (!["points", "lccs"].includes(value.toLowerCase())) value = "points";

  return {
    title: `${value === "points" ? "Point" : "LCC"} Leaderboard${
      version === "all" ? " (all versions)" : ""
    } | BTD6 Maplist`,
  };
}

export default async function ListLeaderboard({ searchParams }) {
  let version = searchParams?.format || "current";
  if (!["current", "all", "experts"].includes(version.toLowerCase()))
    version = "current";
  let value = searchParams?.value || "points";
  let lbType = leaderboards.find(({ key }) => key == value.toLowerCase());
  if (!lbType) lbType = leaderboards[0];
  let page = searchParams?.page || "1";
  if (!/^\d+$/.test(page)) page = "1";
  page = parseInt(page);

  const [leaderboard, visibleFormats] = await Promise.all([
    await getListLeaderboard(version, lbType.key, page),
    await getVisibleFormats(),
  ]);

  let curFormat =
    allFormats.find(({ query }) => version === query) || allFormats[0];

  return (
    <>
      <h1 className="text-center">Leaderboard</h1>

      <DifficultySelector
        value={curFormat.value}
        difficulties={allFormats.filter(
          ({ value, leaderboards }) =>
            visibleFormats.includes(value) && leaderboards.length > 0
        )}
        href={
          `/leaderboard?` +
          new URLSearchParams({
            ...searchParams,
            format: "{queryval}",
            value: curFormat.leaderboards[0],
            page: 1,
          }).toString()
        }
      />

      <div className={`d-flex justify-content-center ${styles.lbValueChooser}`}>
        {curFormat.leaderboards.map((lbKey) => {
          const { key, title } = leaderboards.find(({ key }) => key === lbKey);

          const isActive = key === lbType.key;
          return isActive ? (
            <button className="btn btn-primary active" key={key}>
              {title}
            </button>
          ) : (
            <Link
              key={key}
              scroll={false}
              href={
                `/leaderboard?` +
                new URLSearchParams({
                  ...searchParams,
                  value: key,
                  page: 1,
                }).toString()
              }
              className={`${isActive ? styles.lbValueActive : ""} font-border`}
            >
              <button className="btn btn-primary">{title}</button>
            </Link>
          );
        })}
      </div>

      {lbType.key === "points" && <PointCalcFade format={version} />}

      <div className="my-4">
        <PaginateElement qname="page" page={page} total={leaderboard.pages}>
          {leaderboard.entries.length === 0 ? (
            <p className="text-center muted lead mt-5">Nobody's here...</p>
          ) : (
            leaderboard.entries.map(({ user, score, position }) => {
              let style = {};
              const posColor = getPositionColor(position);
              if (posColor !== null) style.backgroundColor = posColor;

              return (
                <div
                  key={user.id}
                  className={`panel my-2 row ${
                    position <= 3 ? "font-border" : ""
                  }`}
                  style={style}
                  data-cy="leaderboard-entry"
                >
                  <div className="col-1 d-flex flex-column justify-content-center">
                    <p className="fs-4 lb-position text-center mb-0">
                      #{position}
                    </p>
                  </div>
                  <div className="col-8">
                    <UserEntry id={user.id} centered lead="sm" />
                  </div>
                  <div className="col-3 d-flex flex-column justify-content-center">
                    <p className="fs-4 text-end mb-0">
                      {score}
                      {lbType.suffix}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </PaginateElement>
      </div>
    </>
  );
}
