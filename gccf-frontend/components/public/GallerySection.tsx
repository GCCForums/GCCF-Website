"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useVisibleGallery } from "@/lib/hooks";
import { FaImages, FaArrowRight, FaTimes, FaExpandAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Gallery } from "@/types/gallery";
import { stripHtml } from "@/lib/html-utils";

export default function GallerySection() {
  const { data: galleryItems = [], isLoading, error } = useVisibleGallery();
  const [activeImage, setActiveImage] = useState<Gallery | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const getPhotos = (item: Gallery | null): string[] => {
    if (!item) return [];
    const list: string[] = [];
    if (item.imageUrl) {
      list.push(...item.imageUrl.split(/[,\n]/).map((s) => s.trim()).filter(Boolean));
    }
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      list.push(
        ...item.images.flatMap((u) =>
          typeof u === "string"
            ? u.split(/[,\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
            : []
        )
      );
    }
    return Array.from(new Set(list));
  };

  const activePhotos = getPhotos(activeImage);

  const openModal = (item: Gallery) => {
    setActiveImage(item);
    setPhotoIndex(0);
  };

  return (
    <section id="gallery" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Ambient soft glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#3d73bd]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-16 gap-6 text-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block flex items-center gap-2 justify-center">
              gallery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Moments from our Community
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto text-base">
              Snapshots of collaboration, keynotes, and cybersecurity summits around the world.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#3d73bd] hover:text-[#1d3c68] transition-colors group cursor-pointer"
          >
            <span>View Full Visual Archive</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-4/3 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FaImages className="text-4xl mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No gallery items to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.slice(0, 6).map((item) => {
              const photos = getPhotos(item);
              const coverUrl = item.imageUrl || photos[0] || "";

              return (
                <div
                  key={item.id}
                  onClick={() => openModal(item)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={coverUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Top photo count badge */}
                  {photos.length > 1 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/15">
                        <FaImages className="text-[10px]" />
                        <span>{photos.length}</span>
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="font-bold text-base leading-snug line-clamp-1">
                          {item.title}
                        </h3>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xs shrink-0 ml-3">
                        <FaExpandAlt />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Slider Modal */}
      {activeImage && activePhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              <FaTimes />
            </button>

            {/* Slider view */}
            <div className="relative flex-1 flex items-center justify-center min-h-[50vh] max-h-[72vh] p-2 bg-black/40">
              {activePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPhotoIndex((prev) => (prev > 0 ? prev - 1 : activePhotos.length - 1))}
                  className="absolute left-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Previous Photo"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
              )}

              <img
                src={activePhotos[photoIndex]}
                alt={activeImage.title || "Gallery Preview"}
                className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg"
              />

              {activePhotos.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPhotoIndex((prev) => (prev < activePhotos.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Next Photo"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              )}
            </div>

            {/* Modal Info Bar */}
            <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm sm:text-base font-bold truncate">
                    {activeImage.title || "Community Photo"}
                  </h3>
                  {activePhotos.length > 1 && (
                    <span className="text-[11px] text-blue-300 font-medium">
                      ({photoIndex + 1}/{activePhotos.length})
                    </span>
                  )}
                </div>
                {activeImage.description && (
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                    {stripHtml(activeImage.description)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
