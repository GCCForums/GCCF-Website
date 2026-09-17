import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure Administrator Access for GCCF Console",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
