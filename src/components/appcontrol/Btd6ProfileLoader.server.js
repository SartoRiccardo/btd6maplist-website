import { getBtd6User } from "@/server/ninjakiwiRequests";
import C_Btd6ProfileLoader from "./Btd6ProfileLoader.client";

export default async function S_Btd6ProfileLoader({ oak }) {
  let btd6Profile = null;
  if (oak) {
    btd6Profile = await getBtd6User(oak);
  }

  return <C_Btd6ProfileLoader btd6Profile={btd6Profile} />;
}
