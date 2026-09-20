"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { HeroSectionContent } from "@/lib/api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

const CyberThreatGlobe = dynamic(() => import("./CyberThreatGlobe"), {
  ssr: false,
  loading: () => (
    <div className="relative flex flex-col items-center select-none w-full max-w-[480px]">
      <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#1d3c68]/15 to-[#3d73bd]/10 animate-pulse" />
      </div>
      <div className="mt-2 h-[38px] w-full max-w-[340px] rounded-full bg-slate-900/10 animate-pulse" />
    </div>
  ),
});

interface HeroSectionProps {
  content?: HeroSectionContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const activeContent = content || DEFAULT_HOMEPAGE_CONTENT.hero;
  const badge = activeContent.badge || "";
  const title = activeContent.title || "";
  const titleHighlight = activeContent.titleHighlight || "";
  const subtitle = activeContent.subtitle || "";

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
            {/* Badge - Clean Text Only (No pill/capsule) */}
            {badge && (
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#3d73bd] mb-4">
                {badge}
              </p>
            )}

            {/* Headline */}
            {(title || titleHighlight) && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                {title}{" "}
                {titleHighlight && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9]">
                    {titleHighlight}
                  </span>
                )}
              </h1>
            )}

            {/* Subtext */}
            {subtitle && (
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Action Buttons from Dashboard */}
            {(activeContent.primaryButtonText || activeContent.secondaryButtonText) && (
              <div className="flex flex-wrap items-center gap-4 mt-8">
                {activeContent.primaryButtonText && (
                  <Link
                    href={activeContent.primaryButtonUrl || "/membership"}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#2d5fa5] shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {activeContent.primaryButtonText}
                  </Link>
                )}
                {activeContent.secondaryButtonText && (
                  <Link
                    href={activeContent.secondaryButtonUrl || "/events"}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#3d73bd] hover:text-[#3d73bd] shadow-2xs hover:shadow-xs transition-all duration-200"
                  >
                    {activeContent.secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
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
