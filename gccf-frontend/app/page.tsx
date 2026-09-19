"use client";

import {
  FaShieldAlt,
  FaUsers,
  FaBook,
  FaBullseye,
  FaMicroscope,
  FaGlobe,
} from "react-icons/fa";
import { IconType } from "react-icons";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import MetricsSection from "@/components/public/MetricsSection";
import ChairpersonMessageSection from "@/components/public/ChairpersonMessageSection";
import EventsSection from "@/components/public/EventsSection";
import GallerySection from "@/components/public/GallerySection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import FaqSection from "@/components/public/FaqSection";
import { useHomepageContent } from "@/lib/hooks";
import { DEFAULT_HOMEPAGE_CONTENT } from "@/lib/defaultContent";

// Icon name -> component mapping for dynamic rendering
const ICON_MAP: Record<string, IconType> = {
  FaShieldAlt,
  FaUsers,
  FaBook,
  FaBullseye,
  FaMicroscope,
  FaGlobe,
};

export default function HomePage() {
  const { data } = useHomepageContent();
  const homepageContent = data || DEFAULT_HOMEPAGE_CONTENT;

  // Services section from dashboard
  const servicesContent = homepageContent?.services;
  const servicesBadge = servicesContent?.badge || "";
  const servicesTitle = servicesContent?.title || "";
  const serviceItems = servicesContent?.items || [];

  return (
    <div className="min-h-screen bg-white">
      <HeroSection content={homepageContent?.hero} />

      <AboutSection content={homepageContent?.about} />

      <MetricsSection content={homepageContent?.metrics} />

      <ChairpersonMessageSection content={homepageContent?.chairpersonMessage} />

      <EventsSection />

      {/* Services & Activities — fully from dashboard */}
      {serviceItems.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              {servicesBadge && (
                <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
                  {servicesBadge}
                </span>
              )}
              {servicesTitle && (
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {servicesTitle}
                </h2>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceItems.map((service, index) => {
                const Icon = ICON_MAP[service.icon || ""] || FaShieldAlt;
                return (
                  <div
                    key={index}
                    className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#3d73bd] group-hover:bg-[#3d73bd] group-hover:text-white flex items-center justify-center text-2xl transition-colors duration-300 mb-6 shadow-xs">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <GallerySection />

      <TestimonialsSection />

      <FaqSection content={homepageContent?.faq} />
    </div>
  );
}
