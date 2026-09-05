"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // pages where navbar should be hidden
  const hiddenRoutes = ["/admin/login", "/admin/dashboard", "/admin/analytics"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}
