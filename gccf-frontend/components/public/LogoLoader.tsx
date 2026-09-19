"use client";

import React from "react";
import Image from "next/image";

interface LogoLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LogoLoader({
  size = "md",
  text = "Global Cybersecurity Community Forums",
}: LogoLoaderProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const ringSize = isSm ? "w-16 h-16" : isLg ? "w-28 h-28" : "w-20 h-20";
  const badgeSize = isSm ? "w-12 h-12" : isLg ? "w-20 h-20" : "w-14 h-14";
  const iconSize = isSm ? "w-7 h-7" : isLg ? "w-12 h-12" : "w-9 h-9";
  const imgSize = isSm ? 28 : isLg ? 48 : 36;

  return (
    <div className="flex flex-col items-center justify-center select-none" role="status" aria-label="Loading">
      {/* Animated Rings & Logo Mark */}
      <div className={`relative flex items-center justify-center ${ringSize}`}>
        {/* Ambient Pulsing Glow */}
        <div className="absolute inset-0 rounded-full bg-[#3d73bd]/20 blur-xl animate-pulse" />

        {/* Outer Spinning Gradient Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-100 border-t-[#3d73bd] border-r-[#1d3c68] animate-spin" />

        {/* Secondary Counter-Spinning Dashed Ring */}
        <div
          className="absolute inset-1.5 rounded-full border border-dashed border-[#5a8fd9]/60 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "3s" }}
        />

        {/* Inner Logo Badge */}
        <div
          className={`relative rounded-full bg-white shadow-xl shadow-[#1d3c68]/15 border border-slate-100 flex items-center justify-center ${badgeSize}`}
        >
          <Image
            src="/FAVICON.png"
            alt="GCCF Logo"
            width={imgSize}
            height={imgSize}
            className={`${iconSize} object-contain transition-transform duration-700 animate-pulse`}
          />
        </div>
      </div>

      {/* Brand Text / Subtitle */}
      {text && (
        <div className="mt-6 flex flex-col items-center text-center">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-800">
            {text}
          </p>
          {/* Animated Gradient Progress Bar */}
          <div className="mt-3 w-32 sm:w-40 h-1 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="top-0 bottom-0 bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-[#5a8fd9] rounded-full animate-loading-bar" />
          </div>
        </div>
      )}
    </div>
  );
}
