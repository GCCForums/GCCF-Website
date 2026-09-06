"use client";

import { useEffect, useState } from "react";
import { useGallery } from "@/lib/hooks";
import { X, ZoomIn, Camera } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import type { Gallery } from "@/types/gallery";

export default function GalleryPage() {
  const { data: galleryList = [], isLoading, error } = useGallery();
  const [selectedImage, setSelectedImage] = useState<Gallery | null>(null);
  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    ...new Set(
      galleryList
        .map((item) => item.category)
        .filter((c): c is string => Boolean(c)),
    ),
  ];

  const filteredImages =
    filter === "All"
      ? galleryList.filter((item) => item.isVisible)
      : galleryList.filter(
          (item) => item.isVisible && item.category === filter,
        );

  // Close the lightbox on Escape
  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1d3c68]" />
        <p className="mt-6 text-slate-500 font-medium">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">
            Failed to load gallery. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] px-6 py-2.5 font-medium text-white transition-all shadow-md hover:shadow-lg"
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

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-8 sm:px-10">
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={active}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  active
                    ? "border-[#1d3c68] bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] text-white shadow-md shadow-[#3d73bd]/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#3d73bd] hover:text-[#1d3c68] shadow-xs"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10">
        {filteredImages.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No gallery items found.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 [grid-auto-flow:dense] sm:gap-7">
            {filteredImages.map((image, index) => {
              const featured = index % 3 === 0;
              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`group relative animate-[fadeInScale_0.5s_ease-out_backwards] overflow-hidden rounded-2xl bg-white text-left shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(30,58,138,0.15)] ${
                    featured ? "row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative w-full overflow-hidden ${
                      featured ? "min-h-[420px]" : "min-h-[260px]"
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute right-4 top-4 flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-white/95 text-[#1d3c68] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 shadow-md">
                      <ZoomIn size={20} />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#1d3c68]/95 via-[#1d3c68]/40 to-transparent to-60% p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                        {image.category && (
                          <span className="mb-2 inline-block w-fit rounded-full bg-[#3d73bd]/90 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xs">
                            {image.category}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-white">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[9999] flex animate-[fadeIn_0.2s_ease] items-center justify-center bg-black/95 p-6 sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] animate-[scaleIn_0.2s_ease]"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
              className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white transition-all hover:rotate-90 hover:bg-white/20"
            >
              <X size={22} />
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}