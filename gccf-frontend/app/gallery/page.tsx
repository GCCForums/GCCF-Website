"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useGallery } from "@/lib/hooks";
import { X, ChevronLeft, ChevronRight, Images, ZoomIn, Camera } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import type { Gallery } from "@/types/gallery";

const getAlbumPhotos = (item: Gallery | null): string[] => {
  if (!item) return [];
  const list: string[] = [];
  if (item.imageUrl) {
    list.push(...item.imageUrl.split(/[,\n]/).map((s) => s.trim()).filter(Boolean));
  }
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    list.push(
      ...item.images.flatMap((u) =>
        typeof u === "string"
          ? u.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)
          : []
      )
    );
  }
  return Array.from(new Set(list));
};

export default function GalleryPage() {
  const { data: galleryList = [], isLoading, error } = useGallery();
  const [selectedAlbum, setSelectedAlbum] = useState<Gallery | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const visibleList = galleryList.filter((item) => item.isVisible);
  const albumPhotos = getAlbumPhotos(selectedAlbum);

  const handleOpenAlbum = (album: Gallery) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(0);
  };

  const handleCloseAlbum = () => {
    setSelectedAlbum(null);
    setActivePhotoIndex(0);
  };

  const handlePrev = useCallback(() => {
    if (albumPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : albumPhotos.length - 1));
  }, [albumPhotos.length]);

  const handleNext = useCallback(() => {
    if (albumPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev < albumPhotos.length - 1 ? prev + 1 : 0));
  }, [albumPhotos.length]);

  // Keyboard navigation for carousel slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") handleCloseAlbum();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, handlePrev, handleNext]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#3d73bd] border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/60 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-200/80 max-w-md">
          <p className="text-rose-600 font-semibold mb-2">Failed to load gallery</p>
          <p className="text-xs text-slate-500 mb-5">
            Unable to fetch media at this moment. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#1d3c68] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3d73bd] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Brand Grid Hero */}
      <PageHero
        badge="Visual Archive & Moments"
        titlePrefix="Our"
        titleHighlight="Gallery"
        subtitle="Capturing moments of impact, celebration, and community connection across our programs and initiatives."
      />

      {/* Event Gallery Grid */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:px-10">
        {visibleList.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100 shadow-xs">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-slate-800 mb-1">No Gallery Events Found</p>
            <p className="text-xs text-slate-500">Check back soon for new event photos and summit captures.</p>
          </div>
        ) : (
          <div
            className={`grid gap-8 ${
              visibleList.length === 1
                ? "max-w-2xl mx-auto"
                : visibleList.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {visibleList.map((image, index) => {
              const photos = getAlbumPhotos(image);
              const coverUrl = image.imageUrl || photos[0] || "";

              return (
                <div
                  key={image.id}
                  onClick={() => handleOpenAlbum(image)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(29,60,104,0.18)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-slate-900">
                    <Image
                      src={coverUrl}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                      <span className="flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/20 shadow-xs">
                        <Images className="w-3.5 h-3.5 text-blue-300" />
                        <span>{photos.length} {photos.length === 1 ? "Photo" : "Photos"}</span>
                      </span>

                      <div className="flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/95 text-[#1d3c68] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 shadow-md">
                        <ZoomIn size={16} />
                      </div>
                    </div>

                    {/* Subtle gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#3d73bd] transition-colors line-clamp-2">
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {image.description.replace(/<[^>]*>/g, "")}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1d3c68] group-hover:text-[#3d73bd] transition-colors">
                      <span>View Event Photos</span>
                      <span className="group-hover:translate-x-1 transition-transform text-sm">&rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Multi-Picture Event Carousel Slider Modal */}
      {selectedAlbum && albumPhotos.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedAlbum.title}
          onClick={handleCloseAlbum}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 p-4 sm:p-6 animate-fadeIn"
        >
          {/* Header Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between py-2 text-white z-20 shrink-0"
          >
            <div>
              <h3 className="text-base sm:text-xl font-bold tracking-tight">
                {selectedAlbum.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Photo {activePhotoIndex + 1} of {albumPhotos.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseAlbum}
              aria-label="Close carousel"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:rotate-90 hover:bg-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Photo Slider View */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-2 overflow-hidden"
          >
            {/* Previous Button */}
            {albumPhotos.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 cursor-pointer"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Current Active Image */}
            <div className="relative max-h-[70vh] sm:max-h-[75vh] max-w-full flex items-center justify-center animate-[scaleIn_0.2s_ease]">
              <img
                key={activePhotoIndex}
                src={albumPhotos[activePhotoIndex]}
                alt={`${selectedAlbum.title} - ${activePhotoIndex + 1}`}
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl transition-opacity duration-300"
              />
            </div>

            {/* Next Button */}
            {albumPhotos.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 sm:right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 cursor-pointer"
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Filmstrip */}
          {albumPhotos.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl py-2 shrink-0 z-20"
            >
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 scrollbar-thin">
                {albumPhotos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activePhotoIndex === idx
                        ? "border-[#3d73bd] scale-105 shadow-lg shadow-[#3d73bd]/50 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}