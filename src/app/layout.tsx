import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter, Cinzel } from "next/font/google";
import { Providers } from "./providers";
import { SITE } from "@/lib/site";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.brand}`,
  },
  description: SITE.description,
  keywords: [
    "J Group",
    "J Space",
    "J Foods",
    "J Surprise Events",
    "J Foundation",
    "Amalapuram",
    "Andhra Pradesh",
    "catering",
    "biryani",
    "events",
  ],
  authors: [{ name: SITE.brand }],
  creator: SITE.brand,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.secondaryTagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.secondaryTagline,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${cinzel.variable} h-full`}
    >
      <body className="grain min-h-full bg-[#050505] font-[family-name:var(--font-inter)] text-[#F5F1E8] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
