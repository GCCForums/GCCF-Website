"use client";

import Link from "next/link";
import { useCompletedEvents } from "@/lib/hooks";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight, FaHistory } from "react-icons/fa";

export default function EventsSection() {
  const { data: events = [], isLoading, error } = useCompletedEvents();

  // Filter completed events just in case
  const completedEvents = events.filter((e) => e.status === "completed");

  return (
    <section id="events" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3d73bd]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
       <div className="flex flex-col items-center justify-center mb-16 gap-6 text-center">
  <div>
    <span className="text-xs font-bold uppercase tracking-widest text-[#3d73bd] mb-3 block flex items-center gap-2 justify-center">
      Past Events 
    </span>
    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      Our Success Stories
    </h2>
  </div>

  <Link
    href="/events"
    className="inline-flex items-center gap-2 text-sm font-semibold text-[#3d73bd] hover:text-[#1d3c68] transition-colors shrink-0 group"
  >
    <span>View all events</span>
    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
  </Link>
</div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs animate-pulse"
              >
                <div className="h-48 bg-slate-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-white rounded-2xl p-12 text-center border border-red-100 max-w-lg mx-auto shadow-xs">
            <p className="text-red-500 font-medium text-sm mb-2">Unable to load past events right now.</p>
            <p className="text-slate-500 text-xs">Please verify your connection to the backend service.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && completedEvents.length === 0 && (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-xl">
              <FaHistory />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Past Events Yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              As completed events are logged in the platform, they will be showcased here with full event reports and galleries.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#1d3c68] transition-colors"
            >
              Check Upcoming Events
            </Link>
          </div>
        )}

        {/* Dynamic Events Grid from Backend */}
        {!isLoading && !error && completedEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {completedEvents.map((event) => {
              const formattedDate = event.eventDate
                ? new Date(event.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/70 flex flex-col group"
                >
                  <div className="h-52 overflow-hidden bg-slate-100 relative">
                    <img
                      src={event.mainImage || "/images/event1.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback image if remote url fails
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                    {/* Completed Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                        Completed
                      </span>
                    </div>

                    {/* Date on image */}
                    {formattedDate && (
                      <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 flex items-center gap-1.5">
                        <FaCalendarAlt className="text-sky-300 text-[11px]" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#3d73bd] transition-colors leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {event.shortDescription || event.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      {event.location && (
                        <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                          <FaMapMarkerAlt className="text-[#3d73bd] shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </span>
                      )}

                      {event.attendees !== undefined && event.attendees > 0 && (
                        <span className="flex items-center gap-1 shrink-0 ml-auto">
                          <FaUsers className="text-slate-400" />
                          <span>{event.attendees} attendees</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
