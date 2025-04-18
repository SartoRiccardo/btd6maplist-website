"use client";
import cssUserListStats from "./UserListStats.module.css";
import { allFormats } from "@/utils/maplistUtils";
import LazyCollapse from "../transitions/LazyCollapse";
import SelectorButton from "../buttons/SelectorButton";
import Image from "next/image";
import StatsMedal from "./StatsMedal";
import { useState } from "react";
import { useMaplistFormats } from "@/utils/hooks";

export function UserListStats({ format, stats }) {
  const [showDetail, setShowDetail] = useState(false);
  const formatData = {
    ...allFormats.find(({ value }) => value === format),
    ...useMaplistFormats().find(({ id }) => id === format),
  };

  return (
    <>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="panel">
          <div className={`d-flex my-2 ${cssUserListStats.preview}`}>
            <div className="align-self-center">
              <SelectorButton active>
                <Image src={formatData.image} alt="" width={35} height={35} />
              </SelectorButton>
            </div>
            <div className="d-flex align-items-center">
              <h3 className="mb-0 ms-3">{formatData.name}</h3>
            </div>
            <div className="d-flex flex-1 justify-content-end align-items-center">
              <StatsMedal
                src="/medals/medal_win.webp"
                description="Leaderboard points"
                placement={stats.pts_placement}
                score={`${stats.points}pt`}
              />
              <div>
                <i
                  className={`bi ${
                    showDetail ? "bi-dash" : "bi-plus-lg"
                  } fs-3 ms-3 c-pointer`}
                  onClick={() => setShowDetail(!showDetail)}
                />
              </div>
            </div>
          </div>

          <LazyCollapse in={showDetail}>
            <div>
              <div className="d-flex column-gap-3 justify-content-center pt-4 pb-2">
                {stats.black_border !== null && (
                  <StatsMedal
                    src="/medals/medal_bb.webp"
                    description="Black Border leaderboard"
                    placement={stats.black_border_placement}
                    score={stats.black_border}
                  />
                )}
                {stats.no_geraldo !== null && (
                  <StatsMedal
                    src="/medals/medal_nogerry.webp"
                    description="No Optimal Hero leaderboard"
                    placement={stats.no_geraldo_placement}
                    score={stats.no_geraldo}
                  />
                )}
                {stats.lccs !== null && (
                  <StatsMedal
                    src="/medals/medal_lcc.webp"
                    description="Least Cost CHIMPS leaderboard"
                    placement={stats.lccs_placement}
                    score={stats.lccs}
                  />
                )}
              </div>
            </div>
          </LazyCollapse>
        </div>
      </div>
    </>
  );
}
