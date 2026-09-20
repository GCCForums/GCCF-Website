"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
  FaThLarge,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { isAdminLoggedIn, getAdminName, logoutAdmin, syncCurrentUserProfile } from "@/lib/auth";

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync auth state on mount and on storage/auth changes
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const loggedIn = isAdminLoggedIn();
      if (isMounted) {
        setIsAdmin(loggedIn);
        if (loggedIn) {
          setAdminName(getAdminName());
        }
      }
      try {
        const user = await syncCurrentUserProfile();
        if (isMounted) {
          if (user) {
            setIsAdmin(true);
            setAdminName(user.username || getAdminName());
          } else {
            setIsAdmin(false);
          }
        }
      } catch {
        // keep fallback
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      const loggedIn = isAdminLoggedIn();
      setIsAdmin(loggedIn);
      if (loggedIn) {
        setAdminName(getAdminName());
      }
    };
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 20) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 border-b border-slate-100 ${
        navScrolled
          ? "shadow-md py-3 sm:py-3.5"
          : "shadow-xs py-4 sm:py-5"
      } pl-8 sm:pl-16 md:pl-20 lg:pl-28 pr-6 sm:pr-10 md:pr-14`}
    >
      <div className="w-full flex items-center justify-between">
        {/* Brand Logo with Image (Prominent & Larger) */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center group">
            <Image
              src="/gccf logo.png"
              alt="Global Cybersecurity Community Forum (GCCF)"
              width={200}
              height={80}
              priority
              className="h-14 sm:h-16 md:h-20 w-auto aspect-[200/80] object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Nav Menu */}
        <ul className="hidden md:flex items-center gap-7 lg:gap-9 list-none m-0 p-0">
          <li className="relative group cursor-pointer py-1">
            <Link
              href="/"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              Home
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>

          {/* Our Team */}
          <li className="relative group cursor-pointer py-1">
            <Link
              href="/team"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              Our Team
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>

          <li className="relative group cursor-pointer py-1">
            <Link
              href="/gallery"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              Gallery
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>

          <li className="relative group cursor-pointer py-1">
            <Link
              href="/news"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              News
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>

          {/* Events Dropdown */}
          <li className="relative group cursor-pointer py-1">
            <span className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors flex items-center gap-1.5">
              Events
              <FaChevronDown size={11} className="text-slate-400 group-hover:text-[#3d73bd] transition-transform group-hover:rotate-180 duration-200" />
            </span>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
            <div className="absolute top-full left-0 pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <ul className="min-w-[220px] bg-white text-slate-800 rounded-2xl py-2.5 shadow-2xl border border-slate-100 list-none m-0">
                <li>
                  <Link
                    href="/events?type=upcoming"
                    className="block px-5 py-2.5 text-sm text-slate-700 hover:text-[#3d73bd] hover:bg-blue-50/60 hover:pl-6 transition-all duration-200 font-medium"
                  >
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events?type=completed"
                    className="block px-5 py-2.5 text-sm text-slate-700 hover:text-[#3d73bd] hover:bg-blue-50/60 hover:pl-6 transition-all duration-200 font-medium"
                  >
                    Completed Events
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group cursor-pointer py-1">
            <Link
              href="/membership"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              Become a Member
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-slate-800 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-[#3d73bd]/60 transition-all duration-200 shadow-2xs cursor-pointer group"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[130px] truncate text-slate-800 font-semibold text-sm">
                  {adminName}
                </span>
                <FaChevronDown
                  size={10}
                  className={`text-slate-400 group-hover:text-[#3d73bd] transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2.5 bg-slate-50/80 rounded-xl mb-1.5 border border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {adminName}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#3d73bd] uppercase tracking-wider mt-0.5">
                      <FaShieldAlt className="text-[9px]" /> Administrator
                    </span>
                  </div>

                  <Link
                    href="/admin/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#3d73bd] hover:bg-blue-50/70 rounded-xl transition-colors"
                  >
                    <FaThLarge className="text-xs text-[#3d73bd]" />
                    <span>Go to Dashboard</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <FaSignOutAlt className="text-xs text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-white bg-slate-50 hover:bg-[#3d73bd] border border-slate-200 hover:border-[#3d73bd] transition-all duration-200 shadow-2xs hover:shadow-md group cursor-pointer"
              title="Login"
              aria-label="Login"
            >
              <FaUser className="text-base transition-transform duration-200 group-hover:scale-110" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-slate-700 hover:text-[#3d73bd] hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 pb-6 border-t border-slate-100 space-y-2 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors"
          >
            Home
          </Link>

          <Link
            href="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors"
          >
            Our Team
          </Link>

          <Link
            href="/membership"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors"
          >
            Become a Member
          </Link>

          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors"
          >
            Gallery
          </Link>

          <Link
            href="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors"
          >
            News
          </Link>

          {/* Mobile Events Accordion */}
          <div>
            <button
              onClick={() => setMobileEventsOpen(!mobileEventsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-base font-semibold text-slate-800 hover:text-[#3d73bd] hover:bg-blue-50/50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <span>Events</span>
              <FaChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  mobileEventsOpen ? "rotate-180 text-[#3d73bd]" : "text-slate-400"
                }`}
              />
            </button>
            {mobileEventsOpen && (
              <div className="pl-6 pr-4 py-2 space-y-2 bg-slate-50/60 rounded-xl mt-1">
                <Link
                  href="/events?type=upcoming"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-sm font-medium text-slate-600 hover:text-[#3d73bd]"
                >
                  Upcoming Events
                </Link>
                <Link
                  href="/events?type=completed"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-sm font-medium text-slate-600 hover:text-[#3d73bd]"
                >
                  Completed Events
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {isAdmin ? (
              <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
                <div className="flex items-center gap-3 px-1 pb-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {adminName}
                    </p>
                    <p className="text-xs text-[#3d73bd] font-medium">
                      Signed In as Administrator
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 flex items-center justify-center gap-2 text-center text-sm font-semibold rounded-xl bg-[#3d73bd] hover:bg-[#3462a1] text-white shadow-xs transition-colors"
                >
                  <FaThLarge className="text-xs" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 flex items-center justify-center gap-2 text-center text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
                >
                  <FaSignOutAlt className="text-xs" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 flex items-center justify-center gap-2 text-center text-sm font-semibold rounded-xl bg-[#3d73bd] hover:bg-[#3462a1] text-white shadow-md shadow-blue-500/20 transition-colors"
              >
                <FaUser className="text-sm" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
