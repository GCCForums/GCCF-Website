"use client";

import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import type { ChairpersonMessageContent } from "@/lib/api";

interface ChairpersonMessageSectionProps {
  content?: ChairpersonMessageContent;
}

export default function ChairpersonMessageSection({
  content,
}: ChairpersonMessageSectionProps) {
  // If admin explicitly set isActive to false, do not render
  if (content && content.isActive === false) {
    return null;
  }

  // All content strictly driven by the database & dashboard
  const badge: string = content?.badge || "";
  const title: string = content?.title || "Message from the CEO";
  const chairpersonName: string = content?.chairpersonName || "";
  const chairpersonTitle: string = content?.chairpersonTitle || "";
  const quote: string = content?.quote || "";
  const message: string = content?.message || "";
  const signatureText: string = content?.signatureText || "";
  const image: string = content?.image || "";

  // Split message paragraphs if multiline
  const messageParagraphs = message
    ? message
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <section
      aria-labelledby="chairperson-heading"
      className="relative py-20 sm:py-24 lg:py-28 px-5 sm:px-6 bg-white overflow-hidden"
    >
      {/* ── Wave Background ──────────────────────────────────────────────── */}
      {/* Large SVG wave shape in brand blue flowing from right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Right-side wave accent - tall curved shape */}
        <svg
          className="absolute right-0 top-0 h-full"
          style={{ width: "55%" }}
          viewBox="0 0 600 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 0 C120 120, 60 200, 80 400 C100 600, 140 700, 120 800 L600 800 L600 0 Z"
            fill="url(#waveGrad)"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3d73bd" />
              <stop offset="50%" stopColor="#2d5fa5" />
              <stop offset="100%" stopColor="#1d3c68" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle inner wave highlight for depth */}
        <svg
          className="absolute right-0 top-0 h-full opacity-30"
          style={{ width: "50%" }}
          viewBox="0 0 600 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M220 0 C160 150, 100 250, 130 400 C160 550, 200 680, 170 800 L600 800 L600 0 Z"
            fill="url(#waveGrad2)"
          />
          <defs>
            <linearGradient id="waveGrad2" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#5a8fd9" />
              <stop offset="100%" stopColor="#3d73bd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Decorative dots pattern on the wave area */}
        <div
          className="absolute right-8 top-8 opacity-10"
          style={{
            width: "120px",
            height: "120px",
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="absolute right-12 bottom-12 opacity-10"
          style={{
            width: "80px",
            height: "80px",
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Content ───────────────────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col space-y-6 order-2 lg:order-1">
            {/* Section Badge & Accent Dots */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3d73bd]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3d73bd]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#3d73bd]/30" />
              </div>
              {badge && (
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#3d73bd]">
                  {badge}
                </span>
              )}
            </div>

            {/* Main Section Title (Editable from Dashboard) */}
            {title && (
              <h2
                id="chairperson-heading"
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]"
              >
                {title}
              </h2>
            )}

            {/* Quote Card */}
            {quote && (
              <figure className="group relative rounded-2xl bg-white border border-[#3d73bd]/15 p-6 sm:p-7 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-14px_rgba(61,115,189,0.18)] hover:shadow-[0_1px_3px_rgba(15,23,42,0.04),0_16px_40px_-16px_rgba(61,115,189,0.28)] hover:-translate-y-0.5 transition-all duration-300">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-[#3d73bd] to-[#1d3c68]"
                />
                <FaQuoteLeft
                  aria-hidden="true"
                  className="absolute top-5 right-6 text-2xl text-[#3d73bd]/15 transition-colors duration-300 group-hover:text-[#3d73bd]/25"
                />
                <blockquote className="relative text-base sm:text-lg italic font-medium text-slate-800 leading-relaxed pr-10">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </figure>
            )}

            {/* Message Body */}
            {messageParagraphs.length > 0 && (
              <div className="space-y-4 text-slate-600 text-base sm:text-[1.0625rem] leading-[1.75]">
                {messageParagraphs.map((p, idx) => (
                  <p key={`para-${idx}`}>{p}</p>
                ))}
              </div>
            )}

            {/* Clean Executive Signature Block */}
            {(chairpersonName || chairpersonTitle || signatureText) && (
              <div className="pt-6 border-t border-slate-200/80">
                {chairpersonName && (
                  <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {chairpersonName}
                  </h4>
                )}
                {chairpersonTitle && (
                  <p className="text-sm font-semibold text-[#3d73bd] mt-0.5 tracking-wide uppercase">
                    {chairpersonTitle}
                  </p>
                )}
                {signatureText && (
                  <p className="mt-2 text-sm text-slate-500 font-serif italic tracking-wide">
                    {signatureText}
                  </p>
                )}

                {/* Decorative accent lines under signature */}
                <div className="flex gap-1 mt-4">
                  <span className="w-16 h-1 rounded-full bg-[#3d73bd]" />
                  <span className="w-8 h-1 rounded-full bg-[#3d73bd]/50" />
                  <span className="w-4 h-1 rounded-full bg-[#3d73bd]/25" />
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Portrait with Blue Wave Frame ────────────────────── */}
          {image && image.trim().length > 0 && (
            <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
              <div className="relative w-full max-w-[18rem] sm:max-w-[21rem]">
                {/* Photo card with thick blue accent border */}
                <div className="relative z-10 bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-slate-900/20 ring-1 ring-white/80 transition-transform duration-500 ease-out hover:-translate-y-2">
                  {/* Blue accent frame border */}
                  <div className="absolute -inset-1 rounded-2xl border-[3px] border-[#3d73bd]/60 pointer-events-none" />

                  {/* Corner accents */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-[4px] border-l-[4px] border-[#3d73bd] rounded-tl-lg pointer-events-none" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-[4px] border-r-[4px] border-[#3d73bd] rounded-br-lg pointer-events-none" />

                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={image}
                      alt={chairpersonName ? `Portrait of ${chairpersonName}` : "CEO Portrait"}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
                </div>

                {/* Decorative dots */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:-right-6 lg:bottom-1/3 lg:translate-x-0 opacity-20"
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundImage: "radial-gradient(circle, #3d73bd 2px, transparent 2px)",
                    backgroundSize: "12px 12px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}