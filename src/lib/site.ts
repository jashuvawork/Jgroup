/** J Group site configuration — jgroup.space */

export const SITE = {
  name: "J",
  brand: "J Group",
  domain: "jgroup.space",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://jgroup.space",
  tagline: "ONE VISION. MANY POSSIBILITIES.",
  secondaryTagline: "Welcome to the world of J.",
  supportingLine: "Creating. Celebrating. Serving.",
  description:
    "J Group — a premium multi-business ecosystem spanning events, food, foundation, and future J worlds. Based in Amalapuram, Andhra Pradesh.",
  locale: "en_IN",
  location: "Amalapuram, Andhra Pradesh, India",
} as const;

export const BRAND_COLORS = {
  black: "#050505",
  ivory: "#F5F1E8",
  gold: "#C9A45C",
} as const;

export const SOCIAL = {
  instagram: "https://instagram.com/jgroup",
  facebook: "https://facebook.com/jgroup",
  youtube: "https://youtube.com/jgroup",
} as const;
