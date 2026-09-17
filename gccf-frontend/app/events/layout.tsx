import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming and completed cybersecurity events, conferences, and workshops.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
