import cssUsrE from "./UserEntry.module.css";
import { getBtd6User } from "@/server/ninjakiwiRequests";
import Image from "../utils/Image";
import { emptyImage } from "@/utils/misc";

export default async function NKUserEntry({ userId }) {
  if (!userId) return null;

  const userData = await getBtd6User(userId);

  return (
    <div className={`${cssUsrE.user_entry}`}>
      <Image
        loading="lazy"
        className={`${cssUsrE.pfp} ${cssUsrE.small}`}
        src={userData?.avatarURL ?? emptyImage}
        alt=""
        width={50}
        height={50}
      />

      <p className={`${cssUsrE.pfp_name} align-self-center ps-2 my-0`}>
        {userData.displayName}
      </p>
    </div>
  );
}
