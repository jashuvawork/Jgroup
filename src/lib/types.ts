export interface BusinessWithTheme {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  category: string;
  logo: string | null;
  heroImage: string | null;
  route: string;
  status: string;
  sortOrder: number;
  featured: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string | null;
    environment3d: string | null;
    fontFamily: string | null;
  } | null;
}

export interface ImpactStatItem {
  key: string;
  label: string;
  value: number;
  icon: string | null;
}
