import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the executive board, leadership, and team members behind the Global Cybersecurity Community Forum.",
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
