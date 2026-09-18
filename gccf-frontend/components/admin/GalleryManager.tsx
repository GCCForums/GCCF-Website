"use client";

import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaImages, FaEye, FaEyeSlash } from "react-icons/fa";
import { Gallery } from "@/types/gallery";
import { DeleteTarget } from "./types";

interface GalleryManagerProps {
  galleryList: Gallery[];
  onOpenAddModal: () => void;
  onOpenEditModal: (item: Gallery) => void;
  onSetDeleteTarget: (target: DeleteTarget) => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  galleryList,
  onOpenAddModal,
  onOpenEditModal,
  onSetDeleteTarget,
}) => {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredGallery = galleryList.filter((item) =>
    item.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Gallery Management
          </h1>
          <p className="text-sm text-slate-500">
            Upload, categorize, and organize event photography and community media
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search gallery media by title..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaImages className="text-[#3d73bd]" />
          <span>{filteredGallery.length} items</span>
        </div>
      </div>

      {/* Modern Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Visibility Status Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${
                      item.isVisible
                        ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/30"
                        : "bg-slate-900/80 text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {item.isVisible ? (
                      <>
                        <FaEye className="text-[10px]" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <FaEyeSlash className="text-[10px]" />
                        <span>Hidden</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Photo Count Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-slate-900/80 text-white border border-white/20 shadow-xs">
                    <FaImages className="text-[10px] text-blue-400" />
                    <span>
                      {item.images && item.images.length > 0
                        ? item.images.length
                        : item.imageUrl
                        ? 1
                        : 0}{" "}
                      {(item.images?.length || 1) === 1 ? "Photo" : "Photos"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-1 truncate group-hover:text-[#3d73bd] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {item.description ? item.description.replace(/<[^>]*>/g, "") : "Event photography collection"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end gap-1.5">
              <button
                title="Edit Media"
                onClick={() => onOpenEditModal(item)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <FaEdit className="text-xs" />
              </button>
              <button
                title="Delete Media"
                onClick={() => onSetDeleteTarget({ type: "gallery", id: item.id })}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}

        {filteredGallery.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <FaImages className="text-3xl text-slate-300" />
            <p className="font-semibold text-slate-700">No media items found</p>
            <p className="text-xs text-slate-400">
              Upload event photos or community media to populate the gallery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
