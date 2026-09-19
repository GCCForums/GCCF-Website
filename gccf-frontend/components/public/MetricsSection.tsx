"use client";

import Image from "next/image";
import { MetricsSectionContent } from "@/lib/api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

interface MetricsSectionProps {
  content?: MetricsSectionContent;
}

export default function MetricsSection({ content }: MetricsSectionProps) {
  const activeContent = content || DEFAULT_HOMEPAGE_CONTENT.metrics;
  if (!activeContent || !activeContent.items || activeContent.items.length === 0) {
    return null;
  }

  const metrics = activeContent.items;
  const bgImage = activeContent.backgroundImage;

  return (
    <section className="relative bg-slate-900 py-24 px-6 overflow-hidden">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Metrics background"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d3c68]/95 via-[#3d73bd]/90 to-[#122746]/95 z-1" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm hover:bg-white/15 transition-all duration-300"
            >
              <span className="block text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                {metric.number}
              </span>
              <span className="text-sky-200 text-sm sm:text-base font-medium">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
