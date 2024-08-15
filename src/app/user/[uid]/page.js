import styles from "./userpage.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import Btd6MapRow from "@/components/maps/Btd6MapRow";
import SelectorButton from "@/components/maps/SelectorButton";
import { getUser } from "@/server/maplistRequests";
import { getPositionColor } from "@/utils/functions";
import { difficulties } from "@/utils/maplistUtils";
import Image from "next/image";

const btnSize = 50;

export default async function PageUser({ params }) {
  const { uid } = params;
  const userData = await getUser(uid);

  return (
    <>
      <h2 className="text-center">Overview</h2>
      <div className="row justify-content-center">
        <div className="col-6 col-md-5 col-lg-4 col-xl-3">
          <MaplistOverview stats={userData.maplist.current} />
        </div>
        <div className="col-6 col-md-5 col-lg-4 col-xl-3">
          <MaplistOverview stats={userData.maplist.all} all />
        </div>
      </div>

      <h2 className="text-center">Completions</h2>
      {userData.completions.length ? (
        userData.completions.map((completion) => (
          <Btd6MapRow
            key={completion.map.code}
            code={completion.map.code}
            name={completion.map.name}
            hrefBase="/map"
            completion={completion}
            mapIdxCurver={completion.map.placement_cur}
            mapIdxAllver={completion.map.placement_all}
          />
        ))
      ) : (
        <p className="fs-5 muted text-center">Nothing here yet!</p>
      )}

      <h2 className="text-center mt-4">Created Maps</h2>
      <div className="row">
        {userData.created_maps.length ? (
          userData.created_maps.map(
            ({ code, name, placement_all, placement_cur, difficulty }) => (
              <div key={code} className="col-12 col-sm-6 col-lg-4 p-relative">
                <Btd6Map code={code} name={name} hrefBase="/map" />
                <div
                  className={`${styles.difficulties} d-flex justify-content-center`}
                >
                  {placement_cur > -1 && (
                    <SelectorButton text={`#${placement_cur}`} active>
                      <Image
                        src={"/icon_curver.png"}
                        alt="Cur"
                        width={btnSize}
                        height={btnSize}
                      />
                    </SelectorButton>
                  )}

                  {placement_all > -1 && (
                    <SelectorButton text={`#${placement_all}`} active>
                      <Image
                        src={"/icon_allver.png"}
                        alt="All"
                        width={btnSize}
                        height={btnSize}
                      />
                    </SelectorButton>
                  )}

                  {difficulty > -1 && (
                    <SelectorButton active>
                      <Image
                        src={difficulties[difficulty].image}
                        alt="Diff"
                        width={btnSize}
                        height={btnSize}
                      />
                    </SelectorButton>
                  )}
                </div>
              </div>
            )
          )
        ) : (
          <div className="col">
            <p className="fs-5 muted text-center">Nothing here yet!</p>
          </div>
        )}
      </div>
    </>
  );
}

function MaplistOverview({ stats, all }) {
  const { points, pts_placement, lccs, lccs_placement } = stats;

  const fontBorder =
    pts_placement === null && lccs_placement === null ? "" : "font-border";

  return (
    <div className="panel my-3">
      <div className="d-flex justify-content-center my-2">
        <SelectorButton active>
          <Image
            src={all ? "/icon_allver.png" : "/icon_curver.png"}
            alt="Cur"
            width={50}
            height={50}
          />
        </SelectorButton>
        <div className="d-flex flex-column justify-content-center">
          <h3 className="mb-0 ms-3">{all ? "All Versions" : "Maplist"}</h3>
        </div>
      </div>

      <div>
        <p className="fs-2 text-center my-3">
          <span
            className={`p-2 ${fontBorder} rounded-3`}
            style={{
              backgroundColor: pts_placement
                ? getPositionColor(pts_placement) || "#7191AD"
                : null,
            }}
          >
            #{pts_placement || "--"}
          </span>{" "}
          {points}pt
        </p>
      </div>

      <div>
        <p className="fs-2 text-center my-3">
          <span
            className={`p-2 ${fontBorder} rounded-3`}
            style={{
              backgroundColor: lccs_placement
                ? getPositionColor(lccs_placement) || "#7191AD"
                : null,
            }}
          >
            #{lccs_placement || "--"}
          </span>{" "}
          {lccs} LCCs
        </p>
      </div>
    </div>
  );
}
