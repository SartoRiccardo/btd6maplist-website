"use client";
import { initialBtd6Profile } from "@/features/authSlice";
import Link from "next/link";

export default function UserEntry_C({
  profile,
  label,
  centered,
  lead,
  inline,
}) {
  const leadClass =
    lead && !label ? `fs${lead !== true ? `-${lead}` : ""}-4` : "";

  const nameCmp = inline ? (
    <>
      <span className="pfp-padding-inline" /> {profile.name}
    </>
  ) : (
    profile.name
  );

  return (
    <Link scroll={false} href={`/user/${profile.id}`} className={`pfp-link`}>
      <div className={`userEntry ${inline ? "inline" : ""}`}>
        <img
          loading="lazy"
          className={`pfp ${inline ? "inline" : ""}`}
          src={profile.avatarURL || initialBtd6Profile.avatarURL}
        />

        <div
          className={`name-container ${
            centered ? "d-flex flex-column justify-content-center" : ""
          }`}
        >
          {leadClass && leadClass !== "fs-4" ? (
            <>
              <p className={`pfp-name d-none d-${lead}-block fs-4`}>
                {nameCmp}
              </p>
              <p className={`pfp-name d-block d-${lead}-none`}>{nameCmp}</p>
            </>
          ) : (
            <p className={`pfp-name ${leadClass}`}>{nameCmp}</p>
          )}

          <p className={`text-start pfp-small`}>{label}</p>
        </div>
      </div>
    </Link>
  );
}

export function UserEntry_Plc() {
  return (
    <div className="userEntry">
      <img className="pfp" src={initialBtd6Profile.avatarURL} />
    </div>
  );
}
