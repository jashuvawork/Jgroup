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

/** Human-readable label from messy Instagram scrape text */
export function cleanCaption(text: string, fallback: string): string {
  const hash = text.match(/#[\w]+(?:\s+#[\w]+)*/)?.[0];
  if (hash) return hash.replace(/#/g, "# ").replace(/\s+/g, " ").trim();
  if (text.length > 120 || text.includes("datePublished")) return fallback;
  return text.trim() || fallback;
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
      label: cleanCaption(video.description, video.package),
    };
  });
}

export function getGalleryPhotos() {
  return EVENTS_GALLERY.filter((i) => i.type === "image").map((item) => ({
    ...item,
    src: `/${item.file}`,
    label: cleanCaption(item.description, item.package),
  }));
}

/** Map package names to best matching Instagram thumbnail */
export const PACKAGE_MEDIA: Record<string, string> = {
  "Basic Package": "/events/gallery/03-basic-package-DcImZD.jpg",
  "2800 Package": "/events/gallery/03-basic-package-DcImZD.jpg",
  "House Surprise": "/events/gallery/01-birthday-decoration-DcQ0qp.jpg",
  "Banner Surprise": "/events/gallery/06-surprise-at-restaurant-Db5fZF.jpg",
  "Teddy Surprise": "/events/gallery/01-birthday-decoration-DcQ0qp.jpg",
  "Flash Mob (Local)": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Flash Mob with Teddy": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Cracker Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "Crackers with Cold Fires Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "Teddy with Crackers Surprise": "/events/gallery/09-birthday-decoration-DbpbmW.jpg",
  "24 Hrs Surprise": "/events/gallery/05-birthday-decoration-Db-XJQ.jpg",
  "Bike T-Shirt Surprise": "/events/gallery/11-birthday-decoration-DblAzn.jpg",
  "Surprise at Restaurant": "/events/gallery/06-surprise-at-restaurant-Db5fZF.jpg",
  "Car Decoration": "/events/gallery/11-birthday-decoration-DblAzn.jpg",
  "Mega Surprise Package": "/events/gallery/02-flash-mob-local-DcJDhQ.jpg",
  "Birthday Decoration": "/events/gallery/04-birthday-decoration-DcDtYW.jpg",
  "Mandapam / Haldi & Event Decoration": "/events/gallery/07-birthday-decoration-Db5Qbr.jpg",
};
