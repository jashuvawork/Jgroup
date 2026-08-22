import manifest from "../../public/events/manifest.json";

export type GalleryItem = {
  file: string;
  type: "image" | "video";
  package: string;
  description: string;
  instagramUrl: string;
  shortcode: string;
};

export const EVENTS_GALLERY = manifest as GalleryItem[];

export const EVENTS_INSTAGRAM = {
  handle: "@j_surprise_events_",
  url: "https://www.instagram.com/j_surprise_events_/",
} as const;

/** Flyer order — matches prisma seed sortOrder */
export const PACKAGE_ORDER = [
  "Basic Package",
  "2800 Package",
  "House Surprise",
  "Banner Surprise",
  "Teddy Surprise",
  "Flash Mob (Local)",
  "Flash Mob with Teddy",
  "Cracker Surprise",
  "Crackers with Cold Fires Surprise",
  "Teddy with Crackers Surprise",
  "24 Hrs Surprise",
  "Bike T-Shirt Surprise",
  "Surprise at Restaurant",
  "Car Decoration",
  "Mega Surprise Package",
  "Birthday Decoration",
  "Mandapam / Haldi & Event Decoration",
] as const;

/** Curated Instagram thumbnail per package (flyer order) */
export const PACKAGE_MEDIA: Record<string, string> = {
  "Basic Package": "/events/gallery/03-basic-package-DcImZD.jpg",
  "2800 Package": "/events/gallery/03-basic-package-DcImZD.jpg",
  "House Surprise": "/events/gallery/08-birthday-decoration-DbsFJn.jpg",
  "Banner Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "Teddy Surprise": "/events/gallery/01-birthday-decoration-DcQ0qp.jpg",
  "Flash Mob (Local)": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Flash Mob with Teddy": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Cracker Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "Crackers with Cold Fires Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "Teddy with Crackers Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "24 Hrs Surprise": "/events/gallery/04-birthday-decoration-DcDtYW.jpg",
  "Bike T-Shirt Surprise": "/events/gallery/11-birthday-decoration-DblAzn.jpg",
  "Surprise at Restaurant": "/events/gallery/06-surprise-at-restaurant-Db5fZF.jpg",
  "Car Decoration": "/events/gallery/11-birthday-decoration-DblAzn.jpg",
  "Mega Surprise Package": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Birthday Decoration": "/events/gallery/05-birthday-decoration-Db-XJQ.jpg",
  "Mandapam / Haldi & Event Decoration": "/events/gallery/07-birthday-decoration-Db5Qbr.jpg",
};

/** Gallery sections — grouped by package type, ordered for display */
export const GALLERY_SECTIONS = [
  {
    title: "Gifts & Basic Surprises",
    shortcodes: ["DcImZDdCUnY", "DcQ0qpgzGKk"],
  },
  {
    title: "Birthday & Party Decorations",
    shortcodes: ["Db-XJQ5Tfaj", "Db5QbruTjxa", "DbsFJnizVos", "DbpbmWOz2SG", "DblAznjTfuT"],
  },
  {
    title: "Flash Mob & Dance",
    shortcodes: ["DcJDhQXTDJ-"],
  },
  {
    title: "Restaurant Surprises",
    shortcodes: ["Db5fZFkpcZM", "DblB24WRMKR", "Dbf066Uv3iQ"],
  },
  {
    title: "Midnight & Special Moments",
    shortcodes: ["DcDtYWtzco8"],
  },
] as const;

/** Curated labels for Instagram posts */
const MEDIA_LABELS: Record<string, string> = {
  DcQ0qpgzGKk: "Romantic surprise with roses & gifts",
  DcJDhQXTDJ: "Flash mob dance surprise",
  DcImZDdCUnY: "Basic package gift setup",
  DcDtYWtzco8: "12 AM midnight surprise",
  "Db-XJQ5Tfaj": "Party room birthday decoration",
  Db5fZFkpcZM: "Restaurant surprise celebration",
  Db5QbruTjxa: "Birthday decoration setup",
  DbsFJnizVos: "House surprise decoration",
  DbpbmWOz2SG: "Banner & cracker surprise",
  DblB24WRMKR: "Restaurant surprise with cake",
  DblAznjTfuT: "Car & bike decoration surprise",
  Dbf066Uv3iQ: "Restaurant birthday surprise",
};

export function getMediaLabel(item: GalleryItem): string {
  return MEDIA_LABELS[item.shortcode] ?? item.package;
}

/** Prefer video entries with a matching poster image */
export function getGalleryMedia() {
  const videos = EVENTS_GALLERY.filter((i) => i.type === "video");
  const images = EVENTS_GALLERY.filter((i) => i.type === "image");

  return videos.map((video) => {
    const poster = images.find((img) => img.shortcode === video.shortcode);
    return {
      ...video,
      poster: poster ? `/${poster.file}` : undefined,
      src: `/${video.file}`,
      label: getMediaLabel(video),
    };
  });
}

export function getGalleryPhotos() {
  return EVENTS_GALLERY.filter((i) => i.type === "image").map((item) => ({
    ...item,
    src: `/${item.file}`,
    label: getMediaLabel(item),
  }));
}

/** Gallery media grouped by section for display */
export function getGroupedGalleryMedia() {
  const allVideos = getGalleryMedia();
  const used = new Set<string>();

  const sections: { title: string; items: ReturnType<typeof getGalleryMedia> }[] = GALLERY_SECTIONS.map(
    (section) => ({
      title: section.title,
      items: section.shortcodes
        .map((sc) => allVideos.find((v) => v.shortcode === sc))
        .filter((v): v is NonNullable<typeof v> => {
          if (!v) return false;
          used.add(v.shortcode);
          return true;
        }),
    })
  ).filter((s) => s.items.length > 0);

  const remaining = allVideos.filter((v) => !used.has(v.shortcode));
  if (remaining.length > 0) {
    sections.push({ title: "More Moments", items: remaining });
  }

  return sections;
}

/** Sort services by flyer order (sortOrder fallback) */
export function sortPackagesByFlyer<T extends { name: string; sortOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ai = PACKAGE_ORDER.indexOf(a.name as (typeof PACKAGE_ORDER)[number]);
    const bi = PACKAGE_ORDER.indexOf(b.name as (typeof PACKAGE_ORDER)[number]);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });
}
