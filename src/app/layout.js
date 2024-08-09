import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { titleFont, pFont, btd6Font } from "@/lib/fonts";
import StoreProvider from "@/components/StoreProvider";
import { cookies } from "next/headers";
import { getDiscordUser, getMaplistRoles } from "@/server/discordRequests";
import { getBtd6User } from "@/server/ninjakiwiRequests";

export const metadata = {
  title: "Bloons TD 6 Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
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
      const discordProfile = await getDiscordUser(accessToken.access_token);
      if (discordProfile) {
        const [maplistRoles] = await Promise.all([
          // TODO Maplist API call profile
          getMaplistRoles(accessToken.access_token),
        ]);
        const maplistProfile = {
          roles: maplistRoles,
          oak: "9ced1583dd95adf04e138c185877e471cd021cbe9613db6e", // Random dude for test purposes
        };

        initReduxState.auth = {
          discordAccessToken: { ...accessToken, valid: true },
          discordProfile,
          maplistProfile,
        };

        if (maplistProfile.oak) {
          const btd6Profile = await getBtd6User(maplistProfile.oak);
          initReduxState.auth = {
            ...initReduxState.auth,
            btd6Profile,
          };
        }
      }
    }
  }

  return (
    <html lang="en">
      <body
        className={`${btd6Font.variable} ${titleFont.variable} ${pFont.variable}`}
      >
        <StoreProvider initialState={initReduxState}>
          <div className={`content`}>
            <Header />
            {children}
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
