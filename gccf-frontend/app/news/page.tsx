"use client";

import { useNews } from "@/lib/hooks";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaArrowRight, FaNewspaper, FaUser } from "react-icons/fa";
import PageHero from "@/components/public/PageHero";
import { stripHtml } from "@/lib/html-utils";

export default function NewsPage() {
  const { data: newsList = [], isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1d3c68]" />
        <p className="mt-6 text-slate-500 font-medium">Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-red-600 font-medium">
            Failed to load news. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] px-6 py-2.5 font-medium text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Brand Grid Hero */}
      <PageHero
        badge="Insights & Announcements"
        titlePrefix="Latest"
        titleHighlight="News & Stories"
        subtitle="Stay updated with the latest news, announcements, threat advisories, and stories from our global cybersecurity community."
      />

      {/* News Grid Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-10">
        {newsList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100">
              <FaNewspaper />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No News Articles</h3>
            <p className="text-slate-500 text-sm">
              Check back soon for the latest publications and event updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-[#3d73bd]/10 hover:border-[#3d73bd]/30 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {news.featuredImage || (news.galleryImages && news.galleryImages.length > 0) ? (
                    <Image
                      src={
                        news.featuredImage ||
                        (Array.isArray(news.galleryImages)
                          ? news.galleryImages[0]
                          : String(news.galleryImages).split(/[,\n]/)[0])
                      }
                      alt={news.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] flex items-center justify-center text-white/40">
                      <FaNewspaper className="text-4xl" />
                    </div>
                  )}
                  {news.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#1d3c68]/85 backdrop-blur-md border border-white/20 shadow-xs">
                      {news.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#1d3c68] transition-colors leading-snug mb-3">
                      {news.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6 font-normal">
                      {stripHtml(news.excerpt)}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <FaCalendarAlt className="text-[#3d73bd]" />
                        {new Date(news.publishedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {news.author && (
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <FaUser className="text-[10px]" /> By {news.author}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d3c68] group-hover:text-[#3d73bd] transition-colors group-hover:translate-x-1 duration-200">
                      <span>Read</span>
                      <FaArrowRight className="text-[11px]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
