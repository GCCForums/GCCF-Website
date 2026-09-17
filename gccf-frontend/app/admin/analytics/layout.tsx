import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "GCCF Community Analytics and Traffic Statistics",
};

export default function AdminAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
