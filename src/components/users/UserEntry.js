import pfpStyles from "./pfp.module.css";
import { initialBtd6Profile } from "@/features/authSlice";
import { getUser } from "@/server/maplistRequests";
import Link from "next/link";
import { Suspense } from "react";

export default async function UserEntry({ id, label }) {
  return (
    <Suspense fallback={<UserEntry_Plc />}>
      <UserEntry_S id={id} label={label} />
    </Suspense>
  );
}

async function UserEntry_S({ id, label }) {
  const profile = await getUser(id);

  return (
    <Link href={`/users/${id}`} className={`${pfpStyles.link}`}>
      <div className={`${pfpStyles.userEntry}`}>
        <img
          className={`${pfpStyles.pfp}`}
          src={initialBtd6Profile.avatarURL}
        />
        <div>
          <p className={`${pfpStyles.name}`}>{profile.name}</p>
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
