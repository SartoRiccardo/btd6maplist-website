import styles from "./userpage.module.css";
import { getFormats, getUser } from "@/server/maplistRequests";
import { intToHex } from "@/utils/functions";
import { initialBtd6Profile } from "@/features/authSlice";
import EditProfilePencil from "@/components/buttons/EditProfilePencil";
import UserCompletions from "@/components/users/UserCompletions";
import { Suspense } from "react";
import { ServerRoles, UserRole, WebsiteCreatorRole } from "./page.client";
import ProfileMedal from "@/components/users/ProfileMedal";
import { notFound } from "next/navigation";
import MapList from "@/components/layout/maplists/MapList";
import { UserListStats } from "@/components/ui/UserListStats";
import BtnBanUser from "@/components/buttons/BtnBanUser";

export async function generateMetadata({ params }) {
  const userData = await getUser(params.uid);
  return {
    title: `${userData?.name || "User Page"} | BTD6 Maplist`,
  };
}

export default async function PageUser({ params, searchParams }) {
  const { uid } = params;
  const [userData, formats] = await Promise.all([getUser(uid), getFormats()]);
  const visibleFormats = formats
    .filter(({ hidden }) => !hidden)
    .map(({ id }) => id);
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
              {userData.name} <EditProfilePencil userId={userData.id} />{" "}
              <BtnBanUser user={userData} roles={userData.roles} />
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
      <div className="row gx-3 gy-3 mb-3">
        {userData.list_stats
          .filter(({ format_id }) => visibleFormats.includes(format_id))
          .map(({ format_id, stats }) => (
            <UserListStats key={format_id} format={format_id} stats={stats} />
          ))}
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
