import TokenSaver from "@/components/control/TokenSaver";
import { getAccessToken } from "@/server/discordRequests";

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
      <TokenSaver
        accessToken={accessToken}
        justFetched={fetchAccessTokenSuccess}
      />
      <div className="container"></div>
    </>
  );
}
