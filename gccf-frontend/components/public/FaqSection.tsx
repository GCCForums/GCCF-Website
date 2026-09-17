"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaqSectionContent } from "@/lib/api";

interface FaqSectionProps {
  content?: FaqSectionContent;
}

export default function FaqSection({ content }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!content || !content.items || content.items.length === 0) {
    return null;
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const badge = content.badge || "";
  const title = content.title || "";
  const faqs = content.items;

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {(badge || title) && (
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
        )}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-300 bg-white shadow-xs"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 hover:text-[#3d73bd] transition-colors cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <span
                    className={`ml-4 text-sm transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#3d73bd]" : "text-slate-400"
                    }`}
                  >
                    <FaChevronDown />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
