"use client";

import { usePathname } from "next/navigation";
import NavbarWrapper from "@/components/public/NavbarWrapper";
import Footer from "@/components/public/Footer";
import WebsitePopup from "@/components/public/WebsitePopup";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <NavbarWrapper />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WebsitePopup />}
    </>
  );
}
