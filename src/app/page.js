import TokenSaver from "@/components/control/TokenSaver";
import { getAccessToken } from "@/server/discordAuth";

export default async function Home({ searchParams }) {
  let accessToken = null;
  let fetchAccessTokenSuccess = false;
  if ("code" in searchParams) {
    accessToken = await getAccessToken(searchParams["code"]);
    if (accessToken) {
      fetchAccessTokenSuccess = true;
    }
  }

  return (
    <>
      {fetchAccessTokenSuccess && <TokenSaver accessToken={accessToken} />}
      <div className="container"></div>
    </>
  );
}
