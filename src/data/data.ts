import type { Track } from "@/types/types";

export const tracks: Track[] = [
  {
    id: 1,
    title: "One More Time",
    artist: "Daft Punk",
    isFavorite: true,
    imageUrl: "/images/one-more-time.svg",
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    isFavorite: false,
    imageUrl: "/images/blinding-lights.svg",
  },
  {
    id: 3,
    title: "Intro",
    artist: "The xx",
    isFavorite: true,
    imageUrl: "/images/intro.svg",
  },
  {
    id: 4,
    title: "Midnight City",
    artist: "M83",
    isFavorite: false,
    imageUrl: "/images/midnight-city.svg",
  },
];
