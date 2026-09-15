"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaNewspaper, FaUpload } from "react-icons/fa";
import { News } from "@/types/news";
import { NewsFormData, generateSlug } from "./types";
import { ImageUploadInput } from "./ImageUploadInput";
import { uploadApi } from "@/lib/api";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNews: News | null;
  newsForm: NewsFormData;
  setNewsForm: React.Dispatch<React.SetStateAction<NewsFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  editingNews,
  newsForm,
  setNewsForm,
  onSubmit,
  loading,
}) => {
  const [uploadingGallery, setUploadingGallery] = React.useState(false);

  if (!isOpen) return null;

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingGallery(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadApi.uploadImage(files[i], 'news/gallery');
        if (res?.url) urls.push(res.url);
      }
      const existing = newsForm.galleryImages
        ? newsForm.galleryImages.split(/[,\n]/).map((u) => u.trim()).filter(Boolean)
        : [];
      setNewsForm({
        ...newsForm,
        galleryImages: [...existing, ...urls].join('\n'),
      });
    } catch (err: any) {
      alert(err.message || 'Failed to upload gallery images to Cloudinary');
    } finally {
      setUploadingGallery(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-base">
              <FaNewspaper />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingNews ? "Edit Article" : "Add New Article"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingNews
                  ? "Update news story details and published content"
                  : "Draft a new press release or community bulletin"}
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
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. GCCF Announces 2026 Cyber Threat Intelligence Summit"
                value={newsForm.title}
                onChange={(e) =>
                  setNewsForm({
                    ...newsForm,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Brief Excerpt *
              </label>
              <textarea
                placeholder="A compelling one or two-sentence summary..."
                rows={2}
                value={newsForm.excerpt}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, excerpt: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Article Content *
              </label>
              <textarea
                placeholder="Write the complete article content here..."
                rows={7}
                value={newsForm.content}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, content: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Row: Author & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCCF Editorial Team"
                  value={newsForm.author}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, author: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cybersecurity, Threat Intel"
                  value={newsForm.category}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, category: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
            </div>

            {/* Row: Date & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Published Date *
                </label>
                <input
                  type="date"
                  value={newsForm.publishedDate}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, publishedDate: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="url-friendly-slug"
                  value={newsForm.slug}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
            </div>

            {/* Featured Cover Image (Cloudinary) */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <ImageUploadInput
                label="Featured Cover Image"
                value={newsForm.featuredImage}
                onChange={(url) => setNewsForm({ ...newsForm, featuredImage: url })}
                folder="news"
                placeholder="https://... or upload cover image"
                required
                helperText="Upload article cover to Cloudinary, or paste an external image URL"
              />
            </div>

            {/* Multiple Gallery Images */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Additional Article Images
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Upload article photos to Cloudinary or paste URLs (comma/newline separated)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1d3c68] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer">
                    <FaUpload className="text-[10px]" />
                    <span>{uploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingGallery}
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </label>
                  {newsForm.galleryImages && (
                    <span className="text-[11px] font-semibold text-[#3d73bd] bg-white border border-blue-200 px-2 py-0.5 rounded-full">
                      {newsForm.galleryImages.split(/[,\n]/).map((u) => u.trim()).filter(Boolean).length} image(s)
                    </span>
                  )}
                </div>
              </div>
              <textarea
                placeholder="https://res.cloudinary.com/..., https://res.cloudinary.com/..."
                rows={3}
                value={newsForm.galleryImages}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, galleryImages: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
              {newsForm.galleryImages && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {newsForm.galleryImages
                    .split(/[,\n]/)
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((url, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs">
                        <img
                          src={url}
                          alt={`Article gallery ${idx + 1}`}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="AI, Phishing, Ransomware, Governance"
                value={newsForm.tags}
                onChange={(e) =>
                  setNewsForm({ ...newsForm, tags: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Row: Source & Source URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Source Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CyberWire / Reuters"
                  value={newsForm.source}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, source: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Source URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newsForm.sourceUrl}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, sourceUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
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
              <span>{editingNews ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
