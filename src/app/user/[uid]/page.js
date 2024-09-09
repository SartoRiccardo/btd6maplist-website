import styles from "./userpage.module.css";
import Btd6Map from "@/components/maps/Btd6Map";
import SelectorButton from "@/components/buttons/SelectorButton";
import ResourceNotFound from "@/components/layout/ResourceNotFound";
import { getUser } from "@/server/maplistRequests";
import { getPositionColor } from "@/utils/functions";
import { difficulties, listVersions, userRoles } from "@/utils/maplistUtils";
import { initialBtd6Profile } from "@/features/authSlice";
import EditProfilePencil from "@/components/buttons/EditProfilePencil";
import UserCompletions from "@/components/users/UserCompletions";
import { Suspense } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserRole } from "./page.client";

const btnSize = 50;

export async function generateMetadata({ params }) {
  const userData = await getUser(params.uid);
  return {
    title: `${userData?.name || "User Page"} | BTD6 Maplist`,
  };
}

export default async function PageUser({ params, searchParams }) {
  const { uid } = params;
  const userData = await getUser(uid);
  const page = parseInt(searchParams?.comp_page || "1");

  if (!userData) return <ResourceNotFound label="user" />;

  const grantedRoles = userRoles.filter(({ requirement }) =>
    requirement({ user: userData })
  );

  return (
    <>
      <div
        className={`panel d-flex mb-3 py-3 ${styles.profileViewContainer}`}
        style={{
          backgroundImage: `url(${
            userData.bannerURL || initialBtd6Profile.bannerURL
          })`,
        }}
      >
        <img
          src={userData.avatarURL || initialBtd6Profile.avatarURL}
          className={styles.profilePfp}
        />
        <div className="ps-3 d-flex flex-column">
          <h1 className={`${styles.title} font-border`}>
            {userData.name} <EditProfilePencil userId={userData.id} />
          </h1>
          {grantedRoles.length > 0 && (
            <div className={styles.rolesContainer}>
              {grantedRoles.map(({ name, color, borderColor, description }) => (
                <UserRole
                  name={name}
                  color={color}
                  borderColor={borderColor}
                  description={description}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-center">Overview</h2>
      <div className="row justify-content-center">
        {!!listVersions.find(({ value }) => value === 1) && (
          <div className="col-6 col-md-5 col-lg-4 col-xl-3">
            <MaplistOverview stats={userData.maplist.current} />
          </div>
        )}
        {!!listVersions.find(({ value }) => value === 2) && (
          <div className="col-6 col-md-5 col-lg-4 col-xl-3">
            <MaplistOverview stats={userData.maplist.all} all />
          </div>
        )}
      </div>

      <h2 className="text-center">Completions</h2>
      <Suspense fallback={null}>
        <UserCompletions userId={uid} page={page} />
      </Suspense>

      <h2 className="text-center mt-4">Created Maps</h2>
      <div className="row">
        {userData.created_maps.length ? (
          userData.created_maps.map((mapData) => (
            <div
              key={mapData.code}
              className="col-12 col-sm-6 col-lg-4 p-relative"
            >
              <Btd6Map mapData={mapData} name={mapData.name} hrefBase="/map" />
              <div
                className={`${styles.difficulties} d-flex justify-content-center`}
              >
                {mapData.placement_cur > -1 && (
                  <SelectorButton text={`#${mapData.placement_cur}`} active>
                    <img
                      src={"/icon_curver.png"}
                      alt="Cur"
                      width={btnSize}
                      height={btnSize}
                    />
                  </SelectorButton>
                )}

                {mapData.placement_all > -1 && (
                  <SelectorButton text={`#${mapData.placement_all}`} active>
                    <img
                      src={"/icon_allver.png"}
                      alt="All"
                      width={btnSize}
                      height={btnSize}
                    />
                  </SelectorButton>
                )}

                {mapData.difficulty > -1 && (
                  <SelectorButton active>
                    <img
                      src={difficulties[mapData.difficulty].image}
                      alt="Diff"
                      width={btnSize}
                      height={btnSize}
                    />
                  </SelectorButton>
                )}
              </div>
            </div>
          ))
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
          <img
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
