"use client";

import Link from "next/link";
import { FaBars, FaGlobe } from "react-icons/fa";
import { AdminTab } from "./types";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab?: AdminTab;
  adminName?: string;
  adminRole?: string;
}

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  adminName = "Admin",
  adminRole,
}: AdminHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>
        <div className="header-title-wrap">
          <h2 className="flex items-center gap-2">
            <span>GCCF Admin Portal</span>
            {activeTab && activeTab !== "dashboard" && (
              <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                {activeTab}
              </span>
            )}
          </h2>
        </div>
      </div>
      <div className="header-right">
        <Link href="/" target="_blank" className="header-site-btn">
          <FaGlobe className="text-xs" />
          <span>Visit Site</span>
        </Link>
        <div className="admin-badge-pill">
          <span>{adminName}</span>
          {adminRole && (
            <span
              style={{
                fontSize: "0.75rem",
                opacity: 0.8,
                borderLeft: "1px solid #e2e8f0",
                paddingLeft: "0.4rem",
                marginLeft: "0.2rem",
              }}
            >
              {adminRole}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
export { AdminHeader };
