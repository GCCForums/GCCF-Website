"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Testimonial, defaultInitialTestimonials } from "../admin/types";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    defaultInitialTestimonials
  );
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Load testimonials from localStorage and listen to updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadTestimonials = () => {
      try {
        const enabledStored = localStorage.getItem("gccf_testimonials_enabled");
        if (enabledStored !== null) {
          setIsVisible(enabledStored === "true");
        }

        const stored = localStorage.getItem("gccf_testimonials");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTestimonials(parsed);
            return;
          }
        }
        localStorage.setItem(
          "gccf_testimonials",
          JSON.stringify(defaultInitialTestimonials)
        );
      } catch (err) {
        console.error("Failed to load testimonials", err);
      }
    };

    const handleVisibility = (e: any) => {
      if (typeof e?.detail === "boolean") {
        setIsVisible(e.detail);
      } else {
        const enabledStored = localStorage.getItem("gccf_testimonials_enabled");
        if (enabledStored !== null) {
          setIsVisible(enabledStored === "true");
        }
      }
    };

    loadTestimonials();
    window.addEventListener("storage", loadTestimonials);
    window.addEventListener("testimonialsVisibilityChange", handleVisibility as EventListener);
    return () => {
      window.removeEventListener("storage", loadTestimonials);
      window.removeEventListener("testimonialsVisibilityChange", handleVisibility as EventListener);
    };
  }, []);

  // Update visible cards count based on viewport width
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const effectiveIndex = Math.min(currentIndex, maxIndex);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay carousel
  useEffect(() => {
    if (isPaused || testimonials.length <= visibleCount) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide, testimonials.length, visibleCount]);

  if (!isVisible || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 bg-slate-50" id="testimonials">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Members Say
            </h2>
          </div>

          {/* Carousel Navigation Buttons */}
          {testimonials.length > visibleCount && (
            <div className="flex items-center gap-3 mt-6 md:mt-0">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#3d73bd] hover:border-[#3d73bd] transition-all flex items-center justify-center shadow-sm hover:shadow"
                aria-label="Previous Testimonials"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-white hover:bg-[#3d73bd] hover:border-[#3d73bd] transition-all flex items-center justify-center shadow-sm hover:shadow"
                aria-label="Next Testimonials"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${(effectiveIndex * 100) / visibleCount}%)`,
            }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="px-3 flex-shrink-0"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                  <div>
                    {/* Header: Star Rating and Quote Icon */}
                    <div className="flex items-center justify-between mb-4">
                      {testimonial.rating && (
                        <div className="flex gap-1 text-[#f59e0b]">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="text-xs" />
                          ))}
                        </div>
                      )}
                      <FaQuoteLeft className="text-slate-200 text-xl" />
                    </div>

                    {/* Feedback Quote */}
                    <p className="text-slate-700 italic text-base leading-relaxed mb-6">
                      &ldquo;{testimonial.feedback}&rdquo;
                    </p>
                  </div>

                  {/* Author & Role (No Avatar) */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {testimonial.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#3d73bd] block mt-0.5">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dot Indicators */}
        {testimonials.length > visibleCount && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  effectiveIndex === idx
                    ? "w-8 h-2.5 bg-[#3d73bd]"
                    : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
