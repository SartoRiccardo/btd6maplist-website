import { Luckiest_Guy, Inter, Oswald, Raleway } from "next/font/google";

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
});

const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-p",
});

const oswald = Oswald({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-oswald",
});

const raleway = Raleway({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-p",
});

export const btd6Font = luckiestGuy;
export const titleFont = oswald;
export const pFont = raleway;
