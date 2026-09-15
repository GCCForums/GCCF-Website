"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaImages } from "react-icons/fa";
import { Gallery } from "@/types/gallery";
import { GalleryFormData } from "./types";
import { ImageUploadInput } from "./ImageUploadInput";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGallery: Gallery | null;
  galleryForm: GalleryFormData;
  setGalleryForm: React.Dispatch<React.SetStateAction<GalleryFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  editingGallery,
  galleryForm,
  setGalleryForm,
  onSubmit,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-[#3d73bd] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base">
              <FaImages />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingGallery ? "Edit Gallery Media" : "Add Gallery Media"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingGallery
                  ? "Update media metadata, visibility, and tags"
                  : "Upload or link event photography and community captures"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Media Title *
              </label>
              <input
                type="text"
                placeholder="e.g. 2026 Keynote Opening Session"
                value={galleryForm.title}
                onChange={(e) =>
                  setGalleryForm({ ...galleryForm, title: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Brief caption describing this photo or event highlight..."
                rows={2}
                value={galleryForm.description}
                onChange={(e) =>
                  setGalleryForm({
                    ...galleryForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors resize-none"
              />
            </div>

            {/* Image (Cloudinary) */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <ImageUploadInput
                label="Gallery Image"
                value={galleryForm.imageUrl}
                onChange={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })}
                folder="gallery"
                placeholder="https://... or upload photo"
                required
                helperText="Upload event photograph to Cloudinary, or paste an external image URL"
              />
            </div>

            {/* Row: Category & Related Event */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summits, Hackathons"
                  value={galleryForm.category}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Related Event
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Summit 2026"
                  value={galleryForm.event}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, event: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="keynote, audience, panel"
                value={galleryForm.tags}
                onChange={(e) =>
                  setGalleryForm({ ...galleryForm, tags: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Row: Order & Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={galleryForm.order}
                  onChange={(e) =>
                    setGalleryForm({
                      ...galleryForm,
                      order: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div className="pt-5">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={galleryForm.isVisible}
                    onChange={(e) =>
                      setGalleryForm({
                        ...galleryForm,
                        isVisible: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-[#3d73bd] focus:ring-[#3d73bd] cursor-pointer"
                  />
                  <span>Publish as visible in public gallery</span>
                </label>
              </div>
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
              <span>{editingGallery ? "Update Media" : "Add to Gallery"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
