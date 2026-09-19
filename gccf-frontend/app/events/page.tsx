"use client";

import { useState } from "react";
import { useEvents } from "@/lib/hooks";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";
import PageHero from "@/components/public/PageHero";
import { stripHtml } from "@/lib/html-utils";

export default function EventsPage() {
  const { data: eventsList = [], isLoading, error } = useEvents();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1d3c68]" />
        <p className="mt-6 text-slate-500 font-medium">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-red-600 font-medium">Failed to load events. Please try again later.</p>
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

  const filteredEvents = filter === "all" 
    ? eventsList 
    : eventsList.filter(e => e.status === filter);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Brand Grid Hero */}
      <PageHero
        badge="Global Gatherings & Summits"
        titlePrefix="Explore"
        titleHighlight="Events & Workshops"
        subtitle="Discover upcoming and past cybersecurity conferences, technical workshops, webinars, and global community roundtables."
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-10">
        {/* Filter Section */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
              filter === "all"
                ? "border-[#1d3c68] bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] text-white shadow-md shadow-[#3d73bd]/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3d73bd] hover:text-[#1d3c68] shadow-xs"
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
              filter === "upcoming"
                ? "border-[#1d3c68] bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] text-white shadow-md shadow-[#3d73bd]/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3d73bd] hover:text-[#1d3c68] shadow-xs"
            }`}
          >
            Upcoming
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
              filter === "completed"
                ? "border-[#1d3c68] bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] text-white shadow-md shadow-[#3d73bd]/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#3d73bd] hover:text-[#1d3c68] shadow-xs"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-2xl mx-auto mb-4 border border-blue-100">
                <FaCalendarAlt />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Events Found</h3>
              <p className="text-slate-500 text-sm">No events match the selected category filter.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-[#3d73bd]/10 hover:border-[#3d73bd]/30 transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Event Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={event.mainImage}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold capitalize backdrop-blur-md shadow-xs border ${
                      event.status === "upcoming"
                        ? "bg-emerald-500/90 text-white border-emerald-400/40"
                        : "bg-slate-700/80 text-white border-white/20"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                {/* Event Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#1d3c68] transition-colors leading-snug mb-3">
                      {event.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5 font-normal">
                      {stripHtml(event.shortDescription)}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <FaCalendarAlt className="text-[#3d73bd] shrink-0" />
                        <span>
                          {new Date(event.eventDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <FaMapMarkerAlt className="text-[#3d73bd] shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.attendees !== undefined && event.attendees > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <FaUsers className="text-[#3d73bd] shrink-0" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      GCCF Event
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d3c68] group-hover:text-[#3d73bd] transition-colors group-hover:translate-x-1 duration-200">
                      <span>View Details</span>
                      <FaArrowRight className="text-[11px]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}