"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEventBySlug } from "@/lib/hooks";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaUser,
  FaArrowLeft,
  FaClock,
  FaExternalLinkAlt,
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaShareAlt,
  FaCheck,
  FaAward,
} from "react-icons/fa";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: event, isLoading, error } = useEventBySlug(params.slug as string);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (event?.title) {
      document.title = `${event.title} | Global Cybersecurity Community Forums`;
    }
  }, [event?.title]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-[#1d3c68] animate-spin" />
        <p className="mt-4 text-sm font-medium text-slate-500">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl mx-auto mb-4 border border-rose-100">
            <FaCalendarAlt />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Event Not Found</h1>
          <p className="text-sm text-slate-500 mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Events</span>
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const galleryImages = event.galleryImages || [];
  const sponsorTiers = (event.sponsors || []).filter(
    (t) => t.sponsors && t.sponsors.length > 0
  );

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
      {/* Hero Banner Section */}
      <section className="relative w-full min-h-[460px] md:min-h-[520px] bg-slate-950 overflow-hidden flex items-end">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.mainImage}
            alt={event.title}
            className="w-full h-full object-cover object-center opacity-40 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pb-12 pt-28 w-full">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-all"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>All Events</span>
            </Link>

            <span
              className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                event.status === "upcoming"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-700/50 text-slate-300 border-white/10"
              }`}
            >
              {event.status === "upcoming" ? "Upcoming Event" : "Completed Event"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {event.title}
          </h1>

          {event.shortDescription && (
            <p className="text-base sm:text-lg text-slate-200/90 max-w-3xl leading-relaxed mb-6 font-normal">
              {event.shortDescription}
            </p>
          )}

          {/* Quick Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <FaCalendarAlt className="text-[#60a5fa] shrink-0" />
              <span>
                {eventDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <FaClock className="text-[#60a5fa] shrink-0" />
              <span>
                {eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <FaMapMarkerAlt className="text-[#60a5fa] shrink-0" />
              <span>{event.location}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-white transition-colors cursor-pointer ml-auto"
              title="Share event link"
            >
              {copied ? <FaCheck className="text-emerald-400 text-xs" /> : <FaShareAlt className="text-xs text-blue-200" />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 -mt-6 relative z-20">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg shrink-0 border border-blue-100">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</p>
              <p className="text-sm font-bold text-slate-800">
                {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg shrink-0 border border-blue-100">
              <FaClock />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time</p>
              <p className="text-sm font-bold text-slate-800">
                {eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg shrink-0 border border-blue-100">
              <FaMapMarkerAlt />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</p>
              <p className="text-sm font-bold text-slate-800 truncate" title={event.location}>
                {event.location}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg shrink-0 border border-blue-100">
              <FaUsers />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {event.attendees && event.attendees > 0 ? "Attendees" : "Audience"}
              </p>
              <p className="text-sm font-bold text-slate-800 truncate">
                {event.attendees && event.attendees > 0
                  ? `${event.attendees} People`
                  : "Open to Community"}
              </p>
            </div>
          </div>
        </div>

        {/* Registration CTA Banner (Driven by Dashboard registrationUrl) */}
        {event.registrationUrl && (
          <div className="mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1d3c68] via-[#2a528a] to-[#3d73bd] p-8 text-white shadow-xl shadow-blue-900/15 border border-blue-400/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 mb-3">
                Registration Open
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                Reserve Your Seat for this Event
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Click below to complete registration on our official registration portal or partner form.
              </p>
            </div>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
            >
              <span>Register for Event</span>
              <FaExternalLinkAlt className="text-xs text-[#1d3c68]" />
            </a>
          </div>
        )}

        {/* Main Event Article Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="border-b border-slate-100 pb-5 mb-8 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              About This Event
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {event.status === "upcoming" ? "GCCF Upcoming Summit" : "GCCF Archive"}
            </span>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed space-y-4">
            {event.description.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              return (
                <p key={index} className="text-slate-700 leading-relaxed text-base">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>

        {/* Multiple Images Gallery */}
        {galleryImages.length > 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-base">
                  <FaImages />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Event Photo Gallery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Snapshots, highlights, and keynote moments from this gathering
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
                    alt={`${event.title} photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    <span>View Image</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Event Sponsors & Partners Showcase */}
   {sponsorTiers.length > 0 && (
  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
    {/* Header */}
    <div className="border-b border-slate-100 pb-5 mb-8 flex flex-col items-center text-center gap-3">
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Event Sponsors &amp; Partners
        </h3>
        <p className="text-xs text-slate-500">
          Distinguished sponsors supporting this event and our community mission
        </p>
      </div>
    </div>

    {/* Tiers */}
    <div className="space-y-8">
      {sponsorTiers.map((tierItem, idx) => (
        <div key={tierItem.id || idx} className="space-y-4">
          {/* Tier label — centered */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
              {tierItem.tier}
            </span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          {/* Sponsors — centered */}
          <div className="flex flex-wrap justify-center gap-4">
            {tierItem.sponsors.map((sp, spIdx) => {
              const Wrapper = sp.websiteUrl ? "a" : "div";
              const linkProps = sp.websiteUrl
                ? {
                    href: sp.websiteUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    title: `Visit ${sp.name || "sponsor"} website`,
                  }
                : {};

              return (
                <Wrapper
                  key={sp.id || spIdx}
                  {...linkProps}
                  className={`group bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200/70 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col items-center justify-between text-center min-h-[130px] w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] ${
                    sp.websiteUrl ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="w-full flex-1 flex items-center justify-center py-2">
                    {sp.logo ? (
                      <img
                        src={sp.logo}
                        alt={sp.name || "Sponsor Logo"}
                        className="max-h-14 max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                        {sp.name ? sp.name.charAt(0) : "S"}
                      </div>
                    )}
                  </div>

                  {sp.name && (
                    <p className="w-full text-xs font-semibold text-slate-700 truncate mt-2">
                      {sp.name}
                    </p>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1d3c68] transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to All Events</span>
          </Link>
          <Link
            href="/news"
            className="text-sm font-semibold text-[#3d73bd] hover:underline"
          >
            Read Latest GCCF News &rarr;
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