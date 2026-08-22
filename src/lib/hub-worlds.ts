/** 3D headquarters world layout and photography */

export const WORLD_LAYOUT: Record<
  string,
  {
    position: [number, number, number];
    rotation: [number, number, number];
    photo: string;
    label: string;
    tagline: string;
    accent: string;
    cameraFocus: [number, number, number];
  }
> = {
  "j-surprise-events": {
    position: [-7, 0, 0.5],
    rotation: [0, 0.35, 0],
    photo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
    label: "J SURPRISE EVENTS",
    tagline: "Make moments unforgettable.",
    accent: "#d4a574",
    cameraFocus: [-2.5, 0.3, 1],
  },
  "j-foods": {
    position: [7, 0, 0.5],
    rotation: [0, -0.35, 0],
    photo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&q=85",
    label: "J FOODS",
    tagline: "Taste the tradition.",
    accent: "#c9a227",
    cameraFocus: [2.5, 0.3, 1],
  },
  "j-foundation": {
    position: [0, 0, -7.5],
    rotation: [0, 0, 0],
    photo: "https://images.unsplash.com/photo-1532629345422-7515f3d6a8b2?w=1200&q=85",
    label: "J FOUNDATION",
    tagline: "Creating impact that matters.",
    accent: "#6b9b7a",
    cameraFocus: [0, 0.2, -2.5],
  },
};

export const FUTURE_WORLD = {
  position: [9, 0, -6] as [number, number, number],
  rotation: [0, -0.5, 0] as [number, number, number],
};
