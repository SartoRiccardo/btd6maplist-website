import styles from "./userpage.module.css";
import cssMedals from "@/components/maps/Medals.module.css";
import SelectorButton from "@/components/buttons/SelectorButton";
import { getUser } from "@/server/maplistRequests";
import { getPositionColor, intToHex } from "@/utils/functions";
import { allFormats } from "@/utils/maplistUtils";
import { initialBtd6Profile } from "@/features/authSlice";
import EditProfilePencil from "@/components/buttons/EditProfilePencil";
import UserCompletions from "@/components/users/UserCompletions";
import { Suspense } from "react";
import { ServerRoles, UserRole, WebsiteCreatorRole } from "./page.client";
import ProfileMedal from "@/components/users/ProfileMedal";
import { notFound } from "next/navigation";
import MapList from "@/components/layout/maplists/MapList";

export async function generateMetadata({ params }) {
  const userData = await getUser(params.uid);
  return {
    title: `${userData?.name || "User Page"} | BTD6 Maplist`,
  };
}

export default async function PageUser({ params, searchParams }) {
  const { uid } = params;
  const userData = await getUser(uid);
  let page = parseInt(searchParams?.comp_page || "1");
  page = isNaN(page) ? 1 : page;

  if (userData === null) notFound();

  const medals = [];
  for (const mdl of Object.keys(userData.medals))
    if (userData.medals[mdl] > 0)
      medals.push(<ProfileMedal medal={mdl} count={userData.medals[mdl]} />);

  return (
    <>
      <div className={`panel ${styles.profileContainer}`}>
        <div
          className={`d-flex py-3 ${styles.profileBannerContainer}`}
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

            <div className={styles.rolesContainer} data-cy="user-roles">
              {uid === "1077309729942024302" && <WebsiteCreatorRole />}
              {userData.achievement_roles.map(
                ({ name, tooltip_description, clr_border, clr_inner }) => (
                  <UserRole
                    key={name}
                    name={name}
                    color={intToHex(clr_inner)}
                    borderColor={intToHex(clr_border)}
                    description={tooltip_description}
                  />
                )
              )}
              <ServerRoles userId={uid} roles={userData.roles} />
            </div>
          </div>
        </div>

        {medals.length > 0 && (
          <div className={styles.medals_container}>{medals}</div>
        )}
      </div>

      <h2 className="text-center mt-3">Overview</h2>
      <div className="row gx-3 justify-content-center">
        <MaplistOverview stats={userData.maplist.current} format={1} />
        <MaplistOverview stats={userData.maplist.all} format={2} />
        <MaplistOverview stats={userData.maplist.experts} format={51} />
      </div>

      <Suspense fallback={null} key="completions">
        <UserCompletions userId={uid} page={page} />
      </Suspense>

      {userData.created_maps.length > 0 && (
        <>
          <h2 className="text-center mt-4">Created Maps</h2>
          <div className="row" data-cy="created-maps">
            <MapList
              maps={userData.created_maps}
              noSubmit
              noMedals
              bottomInfo
            />
          </div>
        </>
      )}
    </>
  );
}

function MaplistOverview({ stats, format }) {
  const formatData = allFormats.find(({ value }) => value === format);
  if (!formatData) return null;

  const placements = [
    {
      plc: stats.lccs_placement,
      score: stats.lccs,
      prefix: (
        <img
          src="/medals/medal_lcc.webp"
          className={`${cssMedals.inline_medal} me-1`}
        />
      ),
    },
    {
      plc: stats.no_geraldo_placement,
      score: stats.no_geraldo,
      prefix: (
        <img
          src="/medals/medal_nogerry.webp"
          className={`${cssMedals.inline_medal} me-1`}
        />
      ),
    },
    {
      plc: stats.black_border_placement,
      score: stats.black_border,
      prefix: (
        <img
          src="/medals/medal_bb.webp"
          className={`${cssMedals.inline_medal} me-1`}
        />
      ),
    },
  ].sort((a, b) => b.plc - a.plc);

  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-3">
      <div className="panel my-3">
        <div className="d-flex justify-content-center my-2">
          <SelectorButton active>
            <img src={formatData.image} width={50} height={50} />
          </SelectorButton>
          <div className="d-flex flex-column justify-content-center">
            <h3 className="mb-0 ms-3">{formatData.name}</h3>
          </div>
        </div>

        <PlacementRow
          placement={stats.pts_placement}
          score={stats.points}
          suffix="pt"
          large
        />
        {placements.map(({ plc, score, prefix }, i) => (
          <PlacementRow key={i} placement={plc} score={score} prefix={prefix} />
        ))}
      </div>
    </div>
  );
}

function PlacementRow({ placement, score, suffix, prefix, large }) {
  return (
    <div className={placement === null ? styles.no_score : ""}>
      <div
        className={`px-0 px-lg-4 ${
          large ? "fs-2 my-3" : "fs-5 my-2"
        } d-flex justify-content-between`}
      >
        <div
          className={`${large ? "px-3" : "px-2"} py-1 font-border rounded-3 ${
            styles.placement
          }`}
          style={{
            backgroundColor: placement
              ? getPositionColor(placement) || "#7191AD"
              : null,
            border: placement ? null : "1px solid var(--color-primary)",
          }}
        >
          #{placement || "-"}
        </div>
        <div>
          {prefix}
          {score}
          {suffix}
        </div>
      </div>
    </div>
  );
}
