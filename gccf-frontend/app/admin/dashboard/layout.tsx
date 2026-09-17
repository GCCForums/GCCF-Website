import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "GCCF Administration Management Console",
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
