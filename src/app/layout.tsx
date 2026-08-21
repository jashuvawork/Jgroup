import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Source_Sans_3, Cinzel, Syne } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "J — One Vision. Many Possibilities.",
  description:
    "Welcome to the world of J. A premium brand ecosystem spanning events, food, foundation, and beyond.",
  openGraph: {
    title: "J — One Vision. Many Possibilities.",
    description: "Welcome to the world of J.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${sourceSans.variable} ${cinzel.variable} ${syne.variable} h-full`}
    >
      <body className="grain min-h-full bg-[#030303] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
