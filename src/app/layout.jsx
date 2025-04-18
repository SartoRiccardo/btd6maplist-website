import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { titleFont, pFont, btd6Font } from "@/lib/fonts";
import StoreProvider from "@/components/StoreProvider";
import { cookies } from "next/headers";
import Btd6ProfileLoader from "@/components/appcontrol/Btd6ProfileLoader";
import {
  getConfig,
  getFormats,
  getMaplistRoles,
  maplistAuthenticate,
} from "@/server/maplistRequests";
import RulesFirstTimePopup from "@/components/appcontrol/RulesFirstTimePopup";
import Script from "next/script";

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

const authenticate = async (cookieStore) => {
  if (!cookieStore.has("accessToken")) return null;

  let accessToken = null;
  try {
    accessToken = JSON.parse(cookieStore.get("accessToken").value);
  } catch (exc) {
    return null;
  }

  if (accessToken && accessToken.access_token) {
    const userInfo = await maplistAuthenticate(accessToken.access_token);
    if (userInfo === null) return null;

    return {
      discordAccessToken: accessToken,
      maplistProfile: userInfo,
    };
  }
};

export default async function RootLayout({ children }) {
  const initReduxState = {};
  const cookieStore = cookies();

  const [maplistCfg, maplistRoles, authState, maplistFormats] =
    await Promise.all([
      getConfig(),
      getMaplistRoles(),
      authenticate(cookieStore),
      getFormats(),
    ]);

  if (authState) initReduxState.auth = authState;
  initReduxState.maplist = {
    config: maplistCfg,
    roles: maplistRoles,
    formats: maplistFormats,
  };

  return (
    <html lang="en">
      {process.env.NODE_ENV === "production" &&
        process.env.PLAUSIBLE_DATA_DOMAIN &&
        process.env.PLAUSIBLE_SCRIPT_SRC && (
          <Script
            data-domain={process.env.PLAUSIBLE_DATA_DOMAIN}
            src={process.env.PLAUSIBLE_SCRIPT_SRC}
          />
        )}

      <body
        className={`${btd6Font.variable} ${titleFont.variable} ${pFont.variable}`}
      >
        <StoreProvider initialState={initReduxState}>
          {initReduxState.auth && (
            <Btd6ProfileLoader oak={initReduxState.auth.maplistProfile.oak} />
          )}

          <div className="content">
            <Header />
            <RulesFirstTimePopup />
            <main className="container mb-5 mt-3">{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
