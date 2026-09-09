"use client";

import { AboutSectionContent } from "@/lib/api";

interface AboutSectionProps {
  content?: AboutSectionContent;
}

const DEFAULT_PARAGRAPHS = [
  "The Global Cybersecurity Community Forum (GCCF) is a vibrant, international platform dedicated to fostering collaboration, knowledge sharing, and innovation in cybersecurity.",
  "Founded by industry leaders and passionate professionals, we bring together experts, learners, and organizations to address the ever-evolving challenges in digital security.",
  "Our mission is to create a trusted ecosystem where members can grow their skills, share insights, and contribute to a safer digital future.",
  "Through events, training programs, and collaborative initiatives, we're building the next generation of cybersecurity excellence.",
];

export default function AboutSection({ content }: AboutSectionProps) {
  const badge = content?.badge ?? "About GCCF";
  const title = content?.title ?? "Building a Safer Digital Future";
  const paragraphs =
    content?.paragraphs && content.paragraphs.length > 0
      ? content.paragraphs
      : DEFAULT_PARAGRAPHS;

  // Split paragraphs across two columns for balanced layout
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
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
      </div>
    </section>
  );
}
