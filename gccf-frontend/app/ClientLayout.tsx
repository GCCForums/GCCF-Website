"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NavbarWrapper from "@/components/public/NavbarWrapper";
import Footer from "@/components/public/Footer";
import WebsitePopup from "@/components/public/WebsitePopup";
import PageLoader from "@/components/public/PageLoader";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Global Cybersecurity Community Forums",
  "/events": "Events | Global Cybersecurity Community Forums",
  "/gallery": "Gallery | Global Cybersecurity Community Forums",
  "/membership": "Become a Member | Global Cybersecurity Community Forums",
  "/news": "News | Global Cybersecurity Community Forums",
  "/team": "Our Team | Global Cybersecurity Community Forums",
  "/teams": "Our Team | Global Cybersecurity Community Forums",
  "/admin/login": "Admin Login | Global Cybersecurity Community Forums",
  "/admin/dashboard": "Admin Dashboard | Global Cybersecurity Community Forums",
  "/admin/analytics": "Analytics | Global Cybersecurity Community Forums",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (!pathname) return;

    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
    } else if (pathname.startsWith("/events/")) {
      document.title = "Events | Global Cybersecurity Community Forums";
    } else if (pathname.startsWith("/news/")) {
      document.title = "News | Global Cybersecurity Community Forums";
    } else if (pathname.startsWith("/admin/")) {
      const segment = pathname.split("/").filter(Boolean).pop() || "Admin";
      const cleanName = segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      document.title = `${cleanName} | Global Cybersecurity Community Forums`;
    }
  }, [pathname]);

  return (
    <>
      <PageLoader />
      {!isAdminRoute && <NavbarWrapper />}
      <main>{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WebsitePopup />}
    </>
  );
}
