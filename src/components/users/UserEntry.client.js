"use client";
import { initialBtd6Profile } from "@/features/authSlice";
import Link from "next/link";

export default function UserEntry_C({ profile, label, centered, lead }) {
  const leadClass =
    lead && !label ? `fs${lead !== true ? `-${lead}` : ""}-4` : "";

  return (
    <Link scroll={false} href={`/user/${profile.id}`} className={`pfp-link`}>
      <div className={`userEntry`}>
        <img
          className={`pfp`}
          src={profile.avatarURL || initialBtd6Profile.avatarURL}
        />
        <div
          className={`${
            centered ? "d-flex flex-column justify-content-center" : ""
          }`}
        >
          {leadClass && leadClass !== "fs-4" ? (
            <>
              <p className={`pfp-name d-none d-${lead}-block fs-4`}>
                {profile.name}
              </p>
              <p className={`pfp-name d-block d-${lead}-none`}>
                {profile.name}
              </p>
            </>
          ) : (
            <p className={`pfp-name ${leadClass}`}>{profile.name}</p>
          )}

          <p className={`pfp-small`}>{label}</p>
        </div>
      </div>
    </Link>
  );
}
