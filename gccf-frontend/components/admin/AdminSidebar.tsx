"use client";

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
} from "react-icons/fa";
import { AdminTab } from "./types";

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
        <button
          className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaTachometerAlt />
          {sidebarOpen && <span>Dashboard</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          <FaNewspaper />
          {sidebarOpen && <span>News</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <FaCalendarAlt />
          {sidebarOpen && <span>Events</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          <FaImages />
          {sidebarOpen && <span>Gallery</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <FaUsers />
          {sidebarOpen && <span>Members</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "teams" ? "active" : ""}`}
          onClick={() => setActiveTab("teams")}
        >
          <FaUserFriends />
          {sidebarOpen && <span>Teams</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "popup" ? "active" : ""}`}
          onClick={() => setActiveTab("popup")}
        >
          <FaBullhorn />
          {sidebarOpen && <span>Pop-Up</span>}
        </button>
        <button
          className={`nav-item ${activeTab === "testimonials" ? "active" : ""}`}
          onClick={() => setActiveTab("testimonials")}
        >
          <FaQuoteRight />
          {sidebarOpen && <span>Testimonials</span>}
        </button>
        <Link href="/admin/analytics" className="nav-item">
          <FaChartLine />
          {sidebarOpen && <span>Analytics</span>}
        </Link>
        <button
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <FaCog />
          {sidebarOpen && <span>Settings</span>}
        </button>
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
