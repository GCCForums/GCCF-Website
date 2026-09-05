"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
} from "react-icons/fa";

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);

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
            <img
              src="/gccf logo.png"
              alt="Global Cybersecurity Community Forum (GCCF)"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
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

          {/* Our Team (Replaced About) */}
          <li className="relative group cursor-pointer py-1">
            <Link
              href="/team"
              className="text-[16px] font-semibold text-slate-700 hover:text-[#3d73bd] transition-colors"
            >
              Our Team
            </Link>
            <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#3d73bd] group-hover:w-full transition-all duration-300" />
          </li>

          {/* Become a Member */}
          

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

        {/* Desktop Admin Login Button (Admin Only) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-[#1d3c68] bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#3d73bd] transition-all duration-200 shadow-2xs hover:shadow-xs group"
          >
           
            <span> Login</span>
          </Link>
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
            href="/about#team"
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

          {/* Mobile Auth Button (Admin Only) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-center text-sm font-semibold rounded-xl bg-[#3d73bd] hover:bg-[#3462a1] text-white shadow-md shadow-blue-500/20 transition-colors"
            >
              <FaShieldAlt className="text-xs" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
