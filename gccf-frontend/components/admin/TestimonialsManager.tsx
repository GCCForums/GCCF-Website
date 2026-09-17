"use client";

import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaQuoteLeft,
  FaStar,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { Testimonial, DeleteTarget } from "./types";

interface TestimonialsManagerProps {
  testimonialsList: Testimonial[];
  onOpenAddModal: () => void;
  onOpenEditModal: (item: Testimonial) => void;
  onSetDeleteTarget: (target: DeleteTarget) => void;
}

export default function TestimonialsManager({
  testimonialsList,
  onOpenAddModal,
  onOpenEditModal,
  onSetDeleteTarget,
}: TestimonialsManagerProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("gccf_testimonials_enabled");
    if (stored !== null) {
      setShowOnHomepage(stored === "true");
    }
  }, []);

  const handleToggleHomepage = () => {
    const nextVal = !showOnHomepage;
    setShowOnHomepage(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("gccf_testimonials_enabled", String(nextVal));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("testimonialsVisibilityChange", { detail: nextVal }));
    }
  };

  const filteredTestimonials = testimonialsList.filter((t) => {
    const search = searchFilter.toLowerCase();
    return (
      (t.name || "").toLowerCase().includes(search) ||
      (t.role || "").toLowerCase().includes(search) ||
      (t.feedback || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Testimonials Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage endorsements, reviews, and community feedback featured on the landing page carousel
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Homepage Visibility Toggle */}
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-700">
              Show on Homepage
            </span>
            <button
              type="button"
              onClick={handleToggleHomepage}
              className={`text-2xl transition-colors cursor-pointer ${
                showOnHomepage ? "text-[#3d73bd]" : "text-slate-300"
              }`}
              title={showOnHomepage ? "Testimonials currently visible on homepage" : "Testimonials hidden from homepage"}
            >
              {showOnHomepage ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <FaPlus className="text-xs" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by author, role, or review text..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaQuoteLeft className="text-[#3d73bd]" />
          <span>{filteredTestimonials.length} reviews</span>
        </div>
      </div>

      {/* Modern Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Amber Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

            <div>
              {/* Rating stars & Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <FaQuoteLeft className="text-slate-200 text-xl group-hover:text-amber-200 transition-colors" />
              </div>

              {/* Feedback Text */}
              <blockquote className="text-sm text-slate-700 leading-relaxed italic mb-5 line-clamp-4">
                &ldquo;{item.feedback}&rdquo;
              </blockquote>

              {/* Author & Role */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                  {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-[#3d73bd] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 truncate">
                    {item.role || "Community Member"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onOpenEditModal(item)}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <FaEdit className="text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                onClick={() =>
                  onSetDeleteTarget({ type: "testimonials", id: item.id })
                }
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
              >
                <FaTrash className="text-rose-500 text-[10px]" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <FaQuoteLeft className="text-3xl text-slate-300" />
            <p className="font-semibold text-slate-700">No testimonials found</p>
            <p className="text-xs text-slate-400">
              Click &quot;Add Testimonial&quot; above to create endorsements for your community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export { TestimonialsManager };
