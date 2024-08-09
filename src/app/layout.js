import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { titleFont, pFont, btd6Font } from "@/lib/fonts";
import StoreProvider from "@/components/StoreProvider";

export const metadata = {
  title: "Bloons TD 6 Maplist",
  description: "A community curated list of the best Bloons TD 6 custom maps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${btd6Font.variable} ${titleFont.variable} ${pFont.variable}`}
      >
        <StoreProvider>
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
