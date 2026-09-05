import {
  FaShieldAlt,
  FaUsers,
  FaBook,
  FaBullseye,
  FaMicroscope,
  FaGlobe,
} from "react-icons/fa";
import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import MetricsSection from "@/components/public/MetricsSection";
import EventsSection from "@/components/public/EventsSection";
import GallerySection from "@/components/public/GallerySection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import FaqSection from "@/components/public/FaqSection";

export default function HomePage() {
  const services = [
    {
      icon: FaShieldAlt,
      title: "Security Training",
      description:
        "Comprehensive training programs for individuals and organizations",
    },
    {
      icon: FaUsers,
      title: "Community Events",
      description: "Regular meetups, workshops, and networking opportunities",
    },
    {
      icon: FaBook,
      title: "Knowledge Sharing",
      description: "Access to resources, articles, and industry insights",
    },
    {
      icon: FaBullseye,
      title: "Career Development",
      description: "Job opportunities and mentorship programs",
    },
    {
      icon: FaMicroscope,
      title: "Research & Innovation",
      description: "Collaborative research projects and security innovations",
    },
    {
      icon: FaGlobe,
      title: "Global Network",
      description: "Connect with cybersecurity professionals worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      <HeroSection />

      <AboutSection />

      <MetricsSection />

      <EventsSection />

      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Services & Activities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
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

      <GallerySection />

      <TestimonialsSection />

      <FaqSection />
    </div>
  );
}
