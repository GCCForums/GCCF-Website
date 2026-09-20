"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { MetricsSectionContent } from "@/lib/api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

interface MetricsSectionProps {
  content?: MetricsSectionContent;
}

function parseMetricValue(raw: string) {
  const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return null;
  }
  const prefix = match[1] || "";
  const numStr = match[2].replace(/,/g, "");
  const target = parseFloat(numStr);
  const suffix = match[3] || "";
  const hasDecimals = match[2].includes(".");
  const decimalPlaces = hasDecimals ? match[2].split(".")[1].length : 0;

  return { prefix, target, suffix, decimalPlaces };
}

function MetricCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  const parsed = useMemo(() => parseMetricValue(value), [value]);

  useEffect(() => {
    setHasAnimated(false);
    setDisplayValue(0);
  }, [value]);

  useEffect(() => {
    if (!parsed) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;
            const endValue = parsed.target;

            const step = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic: smooth quick start, gentle deceleration
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = startValue + (endValue - startValue) * easeOut;

              setDisplayValue(current);

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setDisplayValue(endValue);
              }
            };

            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [parsed, hasAnimated]);

  if (!parsed) {
    return <span>{value}</span>;
  }

  const formattedNumber =
    parsed.decimalPlaces > 0
      ? displayValue.toFixed(parsed.decimalPlaces)
      : Math.floor(displayValue).toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {parsed.prefix}
      {hasAnimated ? formattedNumber : "0"}
      {parsed.suffix}
    </span>
  );
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
                <MetricCounter value={metric.number} />
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
