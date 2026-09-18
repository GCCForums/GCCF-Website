"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useNewsBySlug } from "@/lib/hooks";
import LogoLoader from "@/components/public/LogoLoader";
import {
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaImages,
  FaShareAlt,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
} from "react-icons/fa";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: news, isLoading, error } = useNewsBySlug(params.slug as string);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (news?.title) {
      document.title = `${news.title} | Global Cybersecurity Community Forums`;
    }
  }, [news?.title]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-24">
        <LogoLoader size="md" text="Loading News Article..." />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-100">
            <FaBookOpen />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The article you are looking for could not be found or has been moved.
          </p>
          <button
            onClick={() => router.push("/news")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to News</span>
          </button>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(news.publishedDate);
  const galleryImages = news.galleryImages || [];

  // Estimate reading time
  const wordCount = (news.content || "").split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && galleryImages.length > 0) {
      setSelectedImageIndex((prev) => (prev! > 0 ? prev! - 1 : galleryImages.length - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null && galleryImages.length > 0) {
      setSelectedImageIndex((prev) => (prev! < galleryImages.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-28">
      {/* Editorial Hero Banner */}
      <section className="relative w-full min-h-[440px] md:min-h-[500px] bg-slate-950 overflow-hidden flex items-end">
        {/* Background Cover Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={news.featuredImage}
            alt={news.title}
            className="w-full h-full object-cover object-center opacity-35 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 pb-12 pt-28 w-full">
          {/* Breadcrumb & Category */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-all"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>All News</span>
            </Link>

            {news.category && (
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3d73bd]/40 text-blue-200 border border-blue-400/30 backdrop-blur-md">
                {news.category}
              </span>
            )}

            <span className="text-xs text-white/60 font-medium">
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-5">
            {news.title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/15">
            {news.author && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300 text-xs">
                  <FaUser />
                </div>
                <span className="font-semibold text-white">{news.author}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-slate-400" />
              <span>
                {publishedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white transition-colors cursor-pointer ml-auto"
              title="Share article link"
            >
              {copied ? <FaCheck className="text-emerald-400 text-xs" /> : <FaShareAlt className="text-xs" />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 -mt-6 relative z-20">
        {/* Article Body Card */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs mb-8">
          {/* Lead Excerpt */}
          {news.excerpt && (
            <div className="border-l-4 border-[#3d73bd] pl-5 py-1 mb-8 bg-blue-50/40 rounded-r-2xl">
              <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed italic">
                &ldquo;{news.excerpt}&rdquo;
              </p>
            </div>
          )}

          {/* Main Featured Image Display */}
          {news.featuredImage && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-[480px]">
              <img
                src={news.featuredImage}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Paragraphs */}
          <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed space-y-6">
            {(news.content || "").split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={index} className="text-slate-700 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 inline-flex items-center gap-1.5">
                <FaTag className="text-[#3d73bd]" /> Tags:
              </span>
              {news.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* External Source Citation */}
          {news.source && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Source: <strong className="text-slate-700">{news.source}</strong></span>
              {news.sourceUrl && (
                <a
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#3d73bd] hover:underline font-semibold"
                >
                  <span>Read Original Report</span>
                  <FaExternalLinkAlt className="text-[10px]" />
                </a>
              )}
            </div>
          )}
        </article>

        {/* Multiple Article Gallery Images */}
        {galleryImages.length > 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-base">
                  <FaImages />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Article Image Gallery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Additional photos, diagrams, and media related to this report
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {galleryImages.length} {galleryImages.length === 1 ? "Photo" : "Photos"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3d73bd] cursor-pointer"
                >
                  <img
                    src={image}
                    alt={`${news.title} image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    <span>Enlarge</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1d3c68] transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to All News</span>
          </Link>
          <Link
            href="/events"
            className="text-sm font-semibold text-[#3d73bd] hover:underline"
          >
            Explore GCCF Events &rarr;
          </Link>
        </div>
      </main>

      {/* Lightbox Modal for Gallery Images */}
      {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors cursor-pointer z-50"
            aria-label="Close"
          >
            <FaTimes />
          </button>

          {/* Previous image */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors cursor-pointer z-50"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* Main lightbox image container adapting to picture size */}
          <div
            className="relative flex flex-col items-center justify-center max-h-[85vh] max-w-[90vw] w-fit pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative inline-flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/20">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="max-h-[80vh] max-w-[85vw] w-auto h-auto object-contain block rounded-2xl select-none"
              />
            </div>
            <div className="mt-3 text-white/90 text-xs font-semibold bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full select-none shadow-lg">
              {selectedImageIndex + 1} of {galleryImages.length}
            </div>
          </div>

          {/* Next image */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors cursor-pointer z-50"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
}