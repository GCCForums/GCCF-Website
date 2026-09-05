"use client";

import { useState } from "react";
import Link from "next/link";
import { useVisibleGallery } from "@/lib/hooks";
import { FaImages, FaArrowRight, FaTimes, FaExpandAlt } from "react-icons/fa";
import { Gallery } from "@/types/gallery";

export default function GallerySection() {
  const { data: galleryItems = [], isLoading, error } = useVisibleGallery();
  const [activeImage, setActiveImage] = useState<Gallery | null>(null);

  return (
    <section id="gallery" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Ambient soft glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#3d73bd]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        {/* Header */}
<div className="flex flex-col items-center justify-center mb-16 gap-6 text-center">
  <div>
    <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block flex items-center gap-2 justify-center">
      gallery
    </span>
    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      A Glimpse Into Our Community
    </h2>
  </div>

  <Link
    href="/gallery"
    className="inline-flex items-center gap-2 text-sm font-semibold text-[#3d73bd] hover:text-[#1d3c68] transition-colors shrink-0 group"
  >
    <span>View full gallery</span>
    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
  </Link>
</div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="aspect-square rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-red-100 max-w-lg mx-auto shadow-xs">
            <p className="text-red-500 font-medium text-sm mb-2">Unable to load gallery photos.</p>
            <p className="text-slate-500 text-xs">Please verify your connection to the backend CMS.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && galleryItems.length === 0 && (
          <div className="bg-slate-50 rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-white text-slate-400 flex items-center justify-center mx-auto mb-4 text-xl shadow-xs border border-slate-200">
              <FaImages />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Gallery Photos Yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Photos added through the admin CMS dashboard will automatically appear here.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#1d3c68] transition-colors shadow-xs"
            >
              Open Gallery Page
            </Link>
          </div>
        )}

        {/* Dynamic Gallery Grid from Backend CMS */}
        {!isLoading && !error && galleryItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => setActiveImage(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/80 cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />

                {/* Top Action Badge */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center text-xs shadow-md">
                    <FaExpandAlt />
                  </span>
                </div>

                {/* Bottom Title & Category */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  {item.category && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3d73bd] text-white mb-1 shadow-xs">
                      {item.category}
                    </span>
                  )}
                  {item.title && (
                    <h4 className="text-white text-xs sm:text-sm font-semibold truncate drop-shadow-sm">
                      {item.title}
                    </h4>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-sm transition-colors"
            >
              <FaTimes />
            </button>

            <img
              src={activeImage.imageUrl}
              alt={activeImage.title || "Gallery Preview"}
              className="max-h-[75vh] w-auto mx-auto object-contain"
            />

            {/* Modal Info Bar */}
            <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-white text-sm sm:text-base font-bold truncate">
                  {activeImage.title || "Community Photo"}
                </h3>
                {activeImage.description && (
                  <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                    {activeImage.description}
                  </p>
                )}
              </div>
              {activeImage.category && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#3d73bd] text-white shrink-0">
                  {activeImage.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
