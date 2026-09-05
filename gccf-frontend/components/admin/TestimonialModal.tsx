"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaStar, FaQuoteLeft } from "react-icons/fa";
import { Testimonial, TestimonialFormData } from "./types";

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTestimonial: Testimonial | null;
  testimonialForm: TestimonialFormData;
  setTestimonialForm: React.Dispatch<React.SetStateAction<TestimonialFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  loading: boolean;
}

export default function TestimonialModal({
  isOpen,
  onClose,
  editingTestimonial,
  testimonialForm,
  setTestimonialForm,
  onSubmit,
  loading,
}: TestimonialModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-[#3d73bd] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
              <FaQuoteLeft />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingTestimonial
                  ? "Update member review, quote, and attribution"
                  : "Add member praise or organization endorsement"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Author Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Johnson"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    name: e.target.value,
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Role & Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role & Company / Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Security Architect, TechCorp"
                value={testimonialForm.role}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    role: e.target.value,
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setTestimonialForm({ ...testimonialForm, rating: star })
                    }
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <FaStar
                      className={`text-lg transition-colors ${
                        star <= testimonialForm.rating
                          ? "text-amber-400"
                          : "text-slate-200 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {testimonialForm.rating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Quote / Feedback */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Testimonial Quote / Feedback *
              </label>
              <textarea
                placeholder="Share the member's endorsement or experience with GCCF..."
                rows={4}
                value={testimonialForm.feedback}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    feedback: e.target.value,
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaSave className="text-xs" />
              )}
              <span>
                {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { TestimonialModal };
