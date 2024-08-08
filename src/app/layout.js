import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { luckiestGuy } from "@/lib/fonts";

export const metadata = {
  title: "BTD6 Maplist",
  description: "A community curated list of the best BTD6 custom maps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${luckiestGuy.variable}`}>
        <div className={`content`}>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
