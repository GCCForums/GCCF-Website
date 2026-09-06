"use client";

import React from "react";

interface PageHeroProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  titlePrefix?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  children?: React.ReactNode;
  headingLevel?: "h1" | "h2";
}

export default function PageHero({
  badge,
  badgeIcon,
  titlePrefix,
  titleHighlight,
  titleSuffix,
  subtitle,
  children,
  headingLevel = "h1",
}: PageHeroProps) {
  const HeadingTag = headingLevel;

  return (
    <section className="relative pt-36 sm:pt-40 pb-16 px-6 text-center overflow-hidden bg-white">
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

      {/* Subtle Ambient Radial Glows in GCCF Logo Colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#3d73bd]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-16 right-10 w-[350px] h-[350px] bg-[#1d3c68]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 left-10 w-[300px] h-[300px] bg-[#4466b3]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Radial vignette fade for grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.7)_85%,#ffffff_100%)]" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-4">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#1d3c68] bg-[#3d73bd]/10 border border-[#3d73bd]/25 shadow-xs mb-2">
            {badgeIcon && <span className="text-[#3d73bd] text-[12px]">{badgeIcon}</span>}
            <span>{badge}</span>
          </div>
        )}

        <HeadingTag className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {titlePrefix && <span>{titlePrefix} </span>}
          {titleHighlight && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9]">
              {titleHighlight}
            </span>
          )}
          {titleSuffix && <span> {titleSuffix}</span>}
        </HeadingTag>

        {subtitle && (
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
            {subtitle}
          </p>
        )}

        {children && <div className="pt-6">{children}</div>}
      </div>
    </section>
  );
}
