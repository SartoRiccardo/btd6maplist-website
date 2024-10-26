"use client";
import stylesUsrE from "./UserEntry.module.css";
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
      <span className={stylesUsrE.pfp_padding_inline} /> {profile.name}
    </>
  ) : (
    profile.name
  );

  return (
    <Link
      scroll={false}
      href={`/user/${profile.id}`}
      className={stylesUsrE.pfp_link}
    >
      <div
        className={`${stylesUsrE.user_entry} ${
          inline ? stylesUsrE.inline : ""
        }`}
        data-cy="user-entry"
      >
        <img
          loading="lazy"
          className={`${stylesUsrE.pfp} ${inline ? stylesUsrE.inline : ""}`}
          src={profile.avatarURL || initialBtd6Profile.avatarURL}
        />

        <div
          className={`${stylesUsrE.name_container} ${
            centered ? "d-flex flex-column justify-content-center" : ""
          }`}
        >
          {leadClass && leadClass !== "fs-4" ? (
            <>
              <p
                className={`${stylesUsrE.pfp_name} d-none d-${lead}-block fs-4`}
              >
                {nameCmp}
              </p>
              <p className={`${stylesUsrE.pfp_name} d-block d-${lead}-none`}>
                {nameCmp}
              </p>
            </>
          ) : (
            <p className={`${stylesUsrE.pfp_name} ${leadClass}`}>{nameCmp}</p>
          )}

          <p className={`text-start ${stylesUsrE.pfp_small}`}>{label}</p>
        </div>
      </div>
    </Link>
  );
}

export function UserEntry_Plc({ inline }) {
  return (
    <div
      className={`${stylesUsrE.user_entry} ${inline ? stylesUsrE.inline : ""}`}
    >
      <img className={stylesUsrE.pfp} src={initialBtd6Profile.avatarURL} />
    </div>
  );
}
