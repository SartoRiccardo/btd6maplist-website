import "./globalcss";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { titleFont, pFont, btd6Font } from "@/lib/fonts";
import StoreProvider from "@/components/StoreProvider";
import { cookies } from "next/headers";
import { getMaplistRoles } from "@/server/discordRequests";
import Btd6ProfileLoader from "@/components/appcontrol/Btd6ProfileLoader";
import { getConfig, maplistAuthenticate } from "@/server/maplistRequests";
import RulesFirstTimePopup from "@/components/appcontrol/RulesFirstTimePopup";

export const metadata = {
  title: "Bloons TD 6 Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
  manifest: "/manifest.json",
  openGraph: {
    images: [
      {
        url: "https://btd6maplist.sarto.dev/site-banner.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport = {
  themeColor: "#00897b",
};

const getUserInfo = async (accessToken) => {
  const profile = await maplistAuthenticate(accessToken);
  if (profile === null) return null;
  return {
    discordProfile: profile.discord_profile,
    maplistProfile: profile.maplist_profile,
  };
};

const authenticate = async (cookieStore) => {
  if (!cookieStore.has("accessToken")) return null;

  let accessToken = null;
  try {
    accessToken = JSON.parse(cookieStore.get("accessToken").value);
  } catch (exc) {
    return null;
  }

  if (accessToken && accessToken.access_token) {
    const [userInfo, maplistRoles] = await Promise.all([
      getUserInfo(accessToken.access_token),
      getMaplistRoles(accessToken.access_token),
    ]);

    if (userInfo === null) return null;

    return {
      discordAccessToken: accessToken,
      discordProfile: userInfo.discordProfile,
      maplistProfile: {
        roles: maplistRoles || [],
        isInServer: maplistRoles !== null,
        ...userInfo.maplistProfile,
      },
    };
  }
};

export default async function RootLayout({ children }) {
  const initReduxState = {};
  const cookieStore = cookies();

  const [maplistCfg, authState] = await Promise.all([
    getConfig(),
    authenticate(cookieStore),
  ]);

  if (authState) initReduxState.auth = authState;
  initReduxState.maplist = {};
  for (const cfg of maplistCfg) initReduxState.maplist[cfg.name] = cfg.value;

  return (
    <html lang="en">
      <body
        className={`${btd6Font.variable} ${titleFont.variable} ${pFont.variable}`}
      >
        <StoreProvider initialState={initReduxState}>
          {initReduxState.auth && (
            <Btd6ProfileLoader oak={initReduxState.auth.maplistProfile.oak} />
          )}

          <div className={`content`}>
            <Header />
            <RulesFirstTimePopup />
            <div className="container mb-5 mt-3">{children}</div>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
