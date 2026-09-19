"use client";

import { AboutSectionContent } from "@/lib/api";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

interface AboutSectionProps {
  content?: AboutSectionContent;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const activeContent = content || DEFAULT_HOMEPAGE_CONTENT.about;
  if (!activeContent) return null;

  const badge = activeContent.badge || "";
  const title = activeContent.title || "";
  const paragraphs = activeContent.paragraphs || [];

  if (!badge && !title && paragraphs.length === 0) {
    return null;
  }

  // Split paragraphs across two columns for balanced layout if multiple
  const midIndex = Math.ceil(paragraphs.length / 2);
  const leftCol = paragraphs.slice(0, midIndex);
  const rightCol = paragraphs.slice(midIndex);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {badge && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
        </div>
        {paragraphs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-600 leading-relaxed text-base sm:text-lg">
            <div className="space-y-4">
              {leftCol.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="space-y-4">
              {rightCol.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
