import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "GCCF Administration Management Console",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
