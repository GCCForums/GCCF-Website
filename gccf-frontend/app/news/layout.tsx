import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Stay informed with the latest cybersecurity news, research insights, and community announcements.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
