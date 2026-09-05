"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import CyberThreatGlobe from "./CyberThreatGlobe";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-white overflow-hidden pt-32 sm:pt-36 pb-16">
      {/* Brand Color Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(61, 115, 189, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(61, 115, 189, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Subtle Ambient Radial Glow in Logo Color */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3d73bd]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#4466b3]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Radial vignette fade for grid edges */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.7)_90%,#ffffff_100%)]" />

      {/* Main Content Container - Aligned with Navbar Logo */}
      <div className="relative z-10 w-full pl-8 sm:pl-16 md:pl-20 lg:pl-28 pr-6 sm:pr-10 md:pr-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Hero Text & Circular CTAs */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
            {/* Badge: Simple text without pulse effect */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#1d3c68] bg-[#3d73bd]/10 border border-[#3d73bd]/25 mb-6 shadow-xs">
              GLOBAL CYBERSECURITY FORUM
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Protecting the Digital World{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9]">
                Together
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl font-normal leading-relaxed">
              Join thousands of cybersecurity practitioners, researchers, and enterprise defenders.
              Share threat intelligence, collaborate on live defense, and elevate the security posture of global systems.
            </p>

            {/* Circular CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#3d73bd] hover:to-[#5a8fd9] rounded-full shadow-lg shadow-[#3d73bd]/25 hover:shadow-xl hover:shadow-[#3d73bd]/35 hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Join Our Community</span>
                <FaArrowRight className="text-sm" />
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-[#1d3c68] bg-white hover:bg-slate-50 border-2 border-[#3d73bd]/30 hover:border-[#3d73bd] rounded-full shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Explore Events</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Transparent 3D Cyber Threat Globe */}
          <div className="lg:col-span-6 xl:col-span-5 w-full flex justify-center items-center">
            <CyberThreatGlobe />
          </div>
        </div>
      </div>
    </section>
  );
}
