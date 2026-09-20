"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaNewspaper,
  FaCalendarAlt,
  FaUsers,
  FaImages,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaGlobe,
  FaBars,
  FaTimes,
  FaUserFriends,
  FaBullhorn,
  FaQuoteRight,
  FaUserShield,
  FaLayerGroup,
  FaClipboardList,
} from "react-icons/fa";
import { AdminTab } from "./types";
import { hasPermission, isSuperAdmin } from "@/lib/auth";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  onLogout,
}: AdminSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [, setAuthVersion] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onAuth = () => setAuthVersion((v) => v + 1);
    window.addEventListener("authChange", onAuth);
    return () => window.removeEventListener("authChange", onAuth);
  }, []);

  const checkPerm = (perm: string) => {
    if (!mounted) return true;
    return hasPermission(perm);
  };

  const superAdmin = mounted ? isSuperAdmin() : false;

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <Link href="/admin/dashboard" className="sidebar-logo">
          <img
            src="/gccf logo.png"
            alt="GCCF Logo"
            className="sidebar-logo-img"
          />
        </Link>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {checkPerm("dashboard") && (
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaTachometerAlt />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
        )}

        {checkPerm("homepage") && (
          <button
            className={`nav-item ${activeTab === "homepage" ? "active" : ""}`}
            onClick={() => setActiveTab("homepage")}
          >
            <FaLayerGroup />
            {sidebarOpen && <span>Homepage</span>}
          </button>
        )}

        {checkPerm("news") && (
          <button
            className={`nav-item ${activeTab === "news" ? "active" : ""}`}
            onClick={() => setActiveTab("news")}
          >
            <FaNewspaper />
            {sidebarOpen && <span>News</span>}
          </button>
        )}

        {checkPerm("events") && (
          <button
            className={`nav-item ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <FaCalendarAlt />
            {sidebarOpen && <span>Events</span>}
          </button>
        )}

        {checkPerm("gallery") && (
          <button
            className={`nav-item ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            <FaImages />
            {sidebarOpen && <span>Gallery</span>}
          </button>
        )}

        {checkPerm("members") && (
          <button
            className={`nav-item ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            <FaUsers />
            {sidebarOpen && <span>Members</span>}
          </button>
        )}

        {checkPerm("teams") && (
          <button
            className={`nav-item ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <FaUserFriends />
            {sidebarOpen && <span>Teams</span>}
          </button>
        )}

        {checkPerm("popup") && (
          <button
            className={`nav-item ${activeTab === "popup" ? "active" : ""}`}
            onClick={() => setActiveTab("popup")}
          >
            <FaBullhorn />
            {sidebarOpen && <span>Pop-Up</span>}
          </button>
        )}

        {checkPerm("analytics") && (
          <Link href="/admin/analytics" className="nav-item">
            <FaChartLine />
            {sidebarOpen && <span>Analytics</span>}
          </Link>
        )}

        {checkPerm("settings") && (
          <button
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog />
            {sidebarOpen && <span>Settings</span>}
          </button>
        )}

        {superAdmin && (
          <>
            <button
              className={`nav-item ${activeTab === "admins" ? "active" : ""}`}
              onClick={() => setActiveTab("admins")}
              style={{
                borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                marginTop: "0.5rem",
                paddingTop: "0.75rem",
              }}
            >
              <FaUserShield className="text-purple-600" />
              {sidebarOpen && (
                <span className="font-semibold text-purple-700">
                  Admins &amp; Roles
                </span>
              )}
            </button>
            <button
              className={`nav-item ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => setActiveTab("audit")}
            >
              <FaClipboardList className="text-amber-600" />
              {sidebarOpen && (
                <span className="font-semibold text-amber-700">
                  Audit Logs
                </span>
              )}
            </button>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <Link
          href="/"
          target="_blank"
          className="nav-item site-link"
          title="Visit Public Website"
        >
          <FaGlobe />
          {sidebarOpen && <span>View Website</span>}
        </Link>
        <button
          className="nav-item logout-btn-item"
          onClick={onLogout}
          title="Sign Out"
        >
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
