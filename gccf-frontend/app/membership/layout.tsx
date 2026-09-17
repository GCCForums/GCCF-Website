import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Member",
  description: "Join the Global Cybersecurity Community Forum and advance your cybersecurity journey.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
