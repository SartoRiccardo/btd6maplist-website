import "./pfp.css";
import { initialBtd6Profile } from "@/features/authSlice";
import { getUser } from "@/server/maplistRequests";
import { Suspense } from "react";
import UserEntry_C from "./UserEntry.client";

export default async function UserEntry({ id, label, centered, lead, inline }) {
  return (
    <Suspense fallback={<UserEntry_Plc />}>
      <UserEntry_S
        id={id}
        label={label}
        centered={centered}
        lead={lead}
        inline={inline}
      />
    </Suspense>
  );
}

async function UserEntry_S({ id, label, centered, lead, inline }) {
  const profile = await getUser(id);
  return (
    <UserEntry_C
      profile={profile}
      label={label}
      centered={centered}
      lead={lead}
      inline={inline}
    />
  );
}

function UserEntry_Plc() {
  return (
    <div className={`userEntry`}>
      <img className={`pfp`} src={initialBtd6Profile.avatarURL} />
    </div>
  );
}
