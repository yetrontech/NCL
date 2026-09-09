export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type LocationGallery = {
  name: string;
  photos: GalleryPhoto[];
};

export const LOCATION_GALLERIES = {
  beltline: {
    name: "Atlanta BeltLine Access",
    photos: [
      {
        src: "/img/locations/beltline/IMG_9167.jpeg",
        alt: "Atlanta BeltLine Access exterior",
        caption: "The home",
      },
      {
        src: "/img/locations/beltline/IMG_9058.jpeg",
        alt: "Living room with sectional seating",
        caption: "Living room",
      },
      {
        src: "/img/locations/beltline/IMG_7754.jpeg",
        alt: "Renovated kitchen with white cabinetry",
        caption: "Kitchen",
      },
      {
        src: "/img/locations/beltline/IMG_7752.jpeg",
        alt: "Kitchen and dining area",
        caption: "Kitchen & dining",
      },
      {
        src: "/img/locations/beltline/IMG_7758.jpeg",
        alt: "Hallway seating nook",
        caption: "Hallway",
      },
      {
        src: "/img/locations/beltline/IMG_8122.jpeg",
        alt: "Shared bedroom with twin beds",
        caption: "Bedroom",
      },
      {
        src: "/img/locations/beltline/IMG_8120.jpeg",
        alt: "Second view of the shared bedroom",
        caption: "Bedroom",
      },
      {
        src: "/img/locations/beltline/IMG_7759.jpeg",
        alt: "Bathroom with tub and vanity",
        caption: "Bathroom",
      },
      {
        src: "/img/locations/beltline/IMG_8127.jpeg",
        alt: "Bathroom vanity and lighting",
        caption: "Bathroom",
      },
      {
        src: "/img/locations/beltline/IMG_8124.jpeg",
        alt: "Walk-in shower with tiled walls",
        caption: "Shower",
      },
    ],
  },
} as const satisfies Record<string, LocationGallery>;

export type LocationGalleryId = keyof typeof LOCATION_GALLERIES;
