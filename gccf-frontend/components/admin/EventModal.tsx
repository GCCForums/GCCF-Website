"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaCalendarAlt } from "react-icons/fa";
import { Event } from "@/types/events";
import { EventFormData, generateSlug } from "./types";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent: Event | null;
  eventForm: EventFormData;
  setEventForm: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  editingEvent,
  eventForm,
  setEventForm,
  onSubmit,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#3d73bd] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
              <FaCalendarAlt />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingEvent ? "Edit Event" : "Add New Event"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingEvent
                  ? "Modify event schedule, location, and guest capacity"
                  : "Schedule a community summit, conference, or workshop"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                placeholder="e.g. GCCF Global Cyber Defense Workshop 2026"
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Description *
              </label>
              <textarea
                placeholder="Brief summary for event cards..."
                rows={2}
                value={eventForm.shortDescription}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    shortDescription: e.target.value,
                  })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors resize-none"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Description *
              </label>
              <textarea
                placeholder="Complete event agenda, keynote topics, and attendance notes..."
                rows={5}
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({ ...eventForm, description: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Row: Date & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, eventDate: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Status *
                </label>
                <select
                  value={eventForm.status}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      status: e.target.value as "upcoming" | "completed",
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors cursor-pointer"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Row: Location & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kathmandu, Nepal / Hybrid / Zoom"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Organizer
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCCF Steering Committee"
                  value={eventForm.organizer}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, organizer: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
            </div>

            {/* Row: Slug & Attendees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="url-friendly-slug"
                  value={eventForm.slug}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={eventForm.attendees}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, attendees: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
            </div>

            {/* Registration URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registration Link / Form URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://forms.gle/... or https://eventbrite.com/..."
                value={eventForm.registrationUrl || ""}
                onChange={(e) =>
                  setEventForm({ ...eventForm, registrationUrl: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Attendees will click &quot;Register for Event&quot; on the event page to visit this link.
              </p>
            </div>

            {/* Main Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Main Banner Image URL *
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... or /event.jpg"
                value={eventForm.mainImage}
                onChange={(e) =>
                  setEventForm({ ...eventForm, mainImage: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
              {eventForm.mainImage && (
                <div className="mt-2 h-24 w-full max-w-xs rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={eventForm.mainImage}
                    alt="Main preview"
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Multiple Gallery Images */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Gallery Images (Multiple Image URLs, comma or newline separated)
                </label>
                {eventForm.galleryImages && (
                  <span className="text-[11px] font-semibold text-[#3d73bd] bg-blue-50 px-2 py-0.5 rounded-full">
                    {eventForm.galleryImages.split(/[,\n]/).map((u) => u.trim()).filter(Boolean).length} image(s)
                  </span>
                )}
              </div>
              <textarea
                placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                rows={3}
                value={eventForm.galleryImages}
                onChange={(e) =>
                  setEventForm({ ...eventForm, galleryImages: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
              {eventForm.galleryImages && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {eventForm.galleryImages
                    .split(/[,\n]/)
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((url, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaSave className="text-xs" />
              )}
              <span>{editingEvent ? "Update Event" : "Create Event"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
