"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaImages, FaUpload, FaTrash } from "react-icons/fa";
import { Gallery } from "@/types/gallery";
import { GalleryFormData } from "./types";
import { ImageUploadInput } from "./ImageUploadInput";
import { RichTextEditor } from "./RichTextEditor";
import { uploadApi } from "@/lib/api";

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
  const [uploadingProgress, setUploadingProgress] = React.useState<string | null>(null);
  const [showRawUrls, setShowRawUrls] = React.useState(false);

  if (!isOpen) return null;

  // Extract all photos as a clean, deduplicated list
  const photosList = Array.from(
    new Set([
      ...(galleryForm.imageUrl ? [galleryForm.imageUrl.trim()] : []),
      ...(galleryForm.images
        ? galleryForm.images
            .split(/[,\n]/)
            .map((u) => u.trim())
            .filter(Boolean)
        : []),
    ])
  ).filter(Boolean);

  const activeCover = galleryForm.imageUrl || photosList[0] || "";

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadingProgress(`Uploading ${i + 1} of ${files.length}...`);
        const res = await uploadApi.uploadImage(files[i], "gallery/events");
        if (res?.url) urls.push(res.url);
      }
      const updatedList = Array.from(new Set([...photosList, ...urls]));
      const newCover = galleryForm.imageUrl || updatedList[0] || "";
      setGalleryForm({
        ...galleryForm,
        images: updatedList.join("\n"),
        imageUrl: newCover,
      });
    } catch (err: any) {
      alert(err.message || "Failed to upload photos to Cloudinary");
    } finally {
      setUploadingProgress(null);
      e.target.value = "";
    }
  };

  const setAsCoverPhoto = (urlToCover: string) => {
    const remaining = photosList.filter((u) => u !== urlToCover);
    const reordered = [urlToCover, ...remaining];
    setGalleryForm({
      ...galleryForm,
      imageUrl: urlToCover,
      images: reordered.join("\n"),
    });
  };

  const removePhoto = (urlToRemove: string) => {
    const remaining = photosList.filter((u) => u !== urlToRemove);
    const newCover =
      activeCover === urlToRemove ? remaining[0] || "" : activeCover;
    setGalleryForm({
      ...galleryForm,
      images: remaining.join("\n"),
      imageUrl: newCover,
    });
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
        <div className="h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-[#3d73bd] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-base">
              <FaImages />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingGallery ? "Edit Gallery Event & Photos" : "Add Gallery Event & Photos"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingGallery
                  ? "Manage event pictures, carousel slider, and metadata"
                  : "Upload event photos for community carousel and visual archive"}
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
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Event / Media Title *
              </label>
              <input
                type="text"
                placeholder="e.g. GCCF Annual Cybersecurity Summit 2026"
                value={galleryForm.title}
                onChange={(e) =>
                  setGalleryForm({ ...galleryForm, title: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Description */}
            <RichTextEditor
              label="Description & Highlights"
              value={galleryForm.description || ""}
              onChange={(val) =>
                setGalleryForm({
                  ...galleryForm,
                  description: val,
                })
              }
              placeholder="Highlights from this event or session..."
              minHeight="100px"
            />

            {/* Event Photography & Multi-Image Manager */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/70">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Event Photos ({photosList.length})
                    </label>
                    {photosList.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#3d73bd] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        {photosList.length} {photosList.length === 1 ? "photo" : "photos"} in album
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload all photos for this event. Visitors can slide through them in the carousel modal.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-sm transition-all shrink-0">
                  {uploadingProgress ? (
                    <FaSpinner className="animate-spin text-xs" />
                  ) : (
                    <FaUpload className="text-xs" />
                  )}
                  <span>{uploadingProgress || "Upload Photos"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultiUpload}
                    disabled={!!uploadingProgress}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Photo Thumbnails Visual Grid */}
              {photosList.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                    {photosList.map((url, idx) => {
                      const isCover = url === activeCover;
                      return (
                        <div
                          key={idx}
                          className={`group relative aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-200 bg-white ${
                            isCover
                              ? "border-blue-500 ring-2 ring-blue-400/40 shadow-md"
                              : "border-slate-200 hover:border-slate-300 shadow-2xs"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover Badge */}
                          {isCover && (
                            <span className="absolute top-1.5 left-1.5 bg-[#3d73bd] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 z-10">
                              <span>★ Cover</span>
                            </span>
                          )}

                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-20">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removePhoto(url)}
                                className="w-6 h-6 rounded-md bg-rose-600/90 text-white flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer"
                                title="Delete Photo"
                              >
                                <FaTrash className="text-[9px]" />
                              </button>
                            </div>

                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setAsCoverPhoto(url)}
                                className="w-full py-1 text-[10px] font-semibold rounded bg-white/90 text-[#1d3c68] hover:bg-white transition-colors text-center cursor-pointer shadow-xs"
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Tip: Hover over any photo to set it as Cover or remove it.
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/60">
                  <FaImages className="text-2xl text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No photos added yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Upload Photos" above or paste URLs below.
                  </p>
                </div>
              )}

              {/* Advanced: Manual URLs toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowRawUrls(!showRawUrls)}
                  className="text-xs font-medium text-[#3d73bd] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showRawUrls ? "Hide URL list editor" : "Paste or edit photo URLs directly"}</span>
                </button>

                {showRawUrls && (
                  <div className="mt-2 animate-fadeIn space-y-1">
                    <textarea
                      placeholder="Paste image URLs (one per line)..."
                      rows={3}
                      value={galleryForm.images}
                      onChange={(e) => {
                        const val = e.target.value;
                        const first = val.split(/[,\n]/).map((u) => u.trim()).filter(Boolean)[0] || "";
                        setGalleryForm({
                          ...galleryForm,
                          images: val,
                          imageUrl: galleryForm.imageUrl || first,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                    />
                    <p className="text-[10px] text-slate-400">
                      One URL per line. The first valid URL will be used as the default cover.
                    </p>
                  </div>
                )}
              </div>
            </div>



            {/* Publishing Visibility */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer p-3 bg-slate-50/80 rounded-xl border border-slate-200 hover:bg-slate-100/60 transition-colors">
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
                <div>
                  <span className="block text-slate-800 font-semibold">Publish as visible in public gallery</span>
                  <span className="block text-[11px] text-slate-500 font-normal">When unchecked, this event album will be saved as a draft and hidden from visitors.</span>
                </div>
              </label>
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
