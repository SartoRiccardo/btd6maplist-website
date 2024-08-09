import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { titleFont, pFont, btd6Font } from "@/lib/fonts";
import StoreProvider from "@/components/StoreProvider";
import { cookies } from "next/headers";
import { getDiscordUser, getMaplistRoles } from "@/server/discordRequests";
import Btd6ProfileLoader from "@/components/appcontrol/Btd6ProfileLoader";

export const metadata = {
  title: "Bloons TD 6 Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
};

const getUserInfo = async (accessToken) => {
  const discordProfile = await getDiscordUser(accessToken);
  if (!discordProfile) return { discordProfile: null, maplistProfile: null };

  // This is supposed to be an API call with discordProfile.id
  const maplistProfile = {
    oak: "9ced1583dd95adf04e138c185877e471cd021cbe9613db6e", // Random dude for test purposes
  };
  return { discordProfile, maplistProfile };
};

export default async function RootLayout({ children }) {
  const initReduxState = {};
  const cookieStore = cookies();

  if (cookieStore.has("accessToken")) {
    let accessToken = null;
    try {
      accessToken = JSON.parse(cookieStore.get("accessToken").value);
    } catch (exc) {}

    if (accessToken && accessToken.access_token) {
      const [userInfo, maplistRoles] = await Promise.all([
        getUserInfo(accessToken.access_token),
        getMaplistRoles(accessToken.access_token),
      ]);

      initReduxState.auth = {
        discordAccessToken: accessToken,
        discordProfile: userInfo.discordProfile,
        maplistProfile: {
          roles: maplistRoles,
          ...userInfo.maplistProfile,
        },
      };
    }
  }

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
            <div className="container mb-5 mt-3">{children}</div>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
