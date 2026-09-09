"use client";

import { MetricsSectionContent } from "@/lib/api";

interface MetricsSectionProps {
  content?: MetricsSectionContent;
}

const DEFAULT_METRICS = [
  { number: "15+", label: "Years of Impact" },
  { number: "50K+", label: "Lives Touched" },
  { number: "120+", label: "Active Projects" },
  { number: "35+", label: "Countries" },
];

export default function MetricsSection({ content }: MetricsSectionProps) {
  const metrics =
    content?.items && content.items.length > 0 ? content.items : DEFAULT_METRICS;
  const bgImage = content?.backgroundImage || "/statsbg2.png";

  return (
    <section
      className="relative bg-cover bg-center bg-fixed py-24 px-6"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d3c68]/92 via-[#3d73bd]/85 to-[#122746]/92" />
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
