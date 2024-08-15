import pfpStyles from "./pfp.module.css";
import { initialBtd6Profile } from "@/features/authSlice";
import { getUser } from "@/server/maplistRequests";
import Link from "next/link";
import { Suspense } from "react";

export default async function UserEntry({ id, label, centered, lead }) {
  return (
    <Suspense fallback={<UserEntry_Plc />}>
      <UserEntry_S id={id} label={label} centered={centered} lead={lead} />
    </Suspense>
  );
}

async function UserEntry_S({ id, label, centered, lead }) {
  const profile = await getUser(id);
  const leadClass =
    lead && !label ? `fs${lead !== true ? `-${lead}` : ""}-4` : "";

  return (
    <Link href={`/user/${id}`} className={`${pfpStyles.link}`}>
      <div className={`${pfpStyles.userEntry}`}>
        <img
          className={`${pfpStyles.pfp}`}
          src={initialBtd6Profile.avatarURL}
        />
        <div
          className={`${
            centered ? "d-flex flex-column justify-content-center" : ""
          }`}
        >
          {leadClass && leadClass !== "fs-4" ? (
            <>
              <p className={`${pfpStyles.name} d-none d-${lead}-block fs-4`}>
                {profile.name}
              </p>
              <p className={`${pfpStyles.name} d-block d-${lead}-none`}>
                {profile.name}
              </p>
            </>
          ) : (
            <p className={`${pfpStyles.name} ${leadClass}`}>{profile.name}</p>
          )}

          <p className={`${pfpStyles.small}`}>{label}</p>
        </div>
      </div>
    </Link>
  );
}

function UserEntry_Plc() {
  return (
    <div className={`${pfpStyles.userEntry}`}>
      <img className={`${pfpStyles.pfp}`} src={initialBtd6Profile.avatarURL} />
    </div>
  );
}
