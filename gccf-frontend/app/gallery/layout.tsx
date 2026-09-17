import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore photos and moments from our cybersecurity community events and summits.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
