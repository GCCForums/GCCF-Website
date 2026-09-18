"use client";

import React from "react";
import {
  FaTimes,
  FaSpinner,
  FaSave,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaAward,
  FaBuilding,
  FaGlobe,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import { Event, EventSponsorTier, EventSponsorItem } from "@/types/events";
import { EventFormData, generateSlug } from "./types";
import { ImageUploadInput } from "./ImageUploadInput";
import { uploadApi } from "@/lib/api";
import { RichTextEditor } from "./RichTextEditor";

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

  const sponsorTiers = eventForm.sponsors || [];

  const handleAddTier = (tierTitle?: string) => {
    const newTier: EventSponsorTier = {
      id: "tier_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      tier: tierTitle || "Gold Sponsor",
      sponsors: [
        {
          id: "sp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          name: "",
          logo: "",
          websiteUrl: "",
        },
      ],
    };
    setEventForm((prev) => ({
      ...prev,
      sponsors: [...(prev.sponsors || []), newTier],
    }));
  };

  const handleRemoveTier = (tierIndex: number) => {
    setEventForm((prev) => ({
      ...prev,
      sponsors: (prev.sponsors || []).filter((_, idx) => idx !== tierIndex),
    }));
  };

  const handleUpdateTierTitle = (tierIndex: number, newTitle: string) => {
    setEventForm((prev) => {
      const updated = [...(prev.sponsors || [])];
      if (updated[tierIndex]) {
        updated[tierIndex] = { ...updated[tierIndex], tier: newTitle };
      }
      return { ...prev, sponsors: updated };
    });
  };

  const handleAddSponsorToTier = (tierIndex: number) => {
    setEventForm((prev) => {
      const updated = [...(prev.sponsors || [])];
      if (updated[tierIndex]) {
        const newSponsor: EventSponsorItem = {
          id: "sp_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          name: "",
          logo: "",
          websiteUrl: "",
        };
        updated[tierIndex] = {
          ...updated[tierIndex],
          sponsors: [...(updated[tierIndex].sponsors || []), newSponsor],
        };
      }
      return { ...prev, sponsors: updated };
    });
  };

  const handleUpdateSponsor = (
    tierIndex: number,
    spIndex: number,
    field: keyof EventSponsorItem,
    value: string
  ) => {
    setEventForm((prev) => {
      const updated = [...(prev.sponsors || [])];
      if (updated[tierIndex] && updated[tierIndex].sponsors[spIndex]) {
        const updatedSponsors = [...updated[tierIndex].sponsors];
        updatedSponsors[spIndex] = {
          ...updatedSponsors[spIndex],
          [field]: value,
        };
        updated[tierIndex] = {
          ...updated[tierIndex],
          sponsors: updatedSponsors,
        };
      }
      return { ...prev, sponsors: updated };
    });
  };

  const handleRemoveSponsor = (tierIndex: number, spIndex: number) => {
    setEventForm((prev) => {
      const updated = [...(prev.sponsors || [])];
      if (updated[tierIndex]) {
        updated[tierIndex] = {
          ...updated[tierIndex],
          sponsors: updated[tierIndex].sponsors.filter((_, idx) => idx !== spIndex),
        };
      }
      return { ...prev, sponsors: updated };
    });
  };

  const [uploadingSponsorKey, setUploadingSponsorKey] = React.useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = React.useState(false);

  const handleFileUpload = async (
    tierIndex: number,
    spIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${tierIndex}_${spIndex}`;
    try {
      setUploadingSponsorKey(key);
      const res = await uploadApi.uploadImage(file, 'sponsors');
      if (res?.url) {
        handleUpdateSponsor(tierIndex, spIndex, "logo", res.url);
      }
    } catch (err: any) {
      console.error('Sponsor logo upload error:', err);
      // Fallback to local Data URL preview if offline or error
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          handleUpdateSponsor(tierIndex, spIndex, "logo", reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingSponsorKey(null);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingGallery(true);
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadApi.uploadImage(files[i], 'events/gallery');
        if (res?.url) urls.push(res.url);
      }
      const existing = eventForm.galleryImages
        ? eventForm.galleryImages.split(/[,\n]/).map((u) => u.trim()).filter(Boolean)
        : [];
      setEventForm({
        ...eventForm,
        galleryImages: [...existing, ...urls].join('\n'),
      });
    } catch (err: any) {
      alert(err.message || 'Failed to upload gallery images to Cloudinary');
    } finally {
      setUploadingGallery(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
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
            <RichTextEditor
              label="Short Description"
              value={eventForm.shortDescription}
              onChange={(val) =>
                setEventForm({
                  ...eventForm,
                  shortDescription: val,
                })
              }
              placeholder="Brief summary for event cards..."
              minHeight="100px"
              required
            />

            {/* Full Description */}
            <RichTextEditor
              label="Full Description"
              value={eventForm.description}
              onChange={(val) =>
                setEventForm({ ...eventForm, description: val })
              }
              placeholder="Complete event agenda, keynote topics, and attendance notes..."
              minHeight="200px"
              required
            />

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

            {/* Main Banner Image (Cloudinary) */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <ImageUploadInput
                label="Main Banner Image"
                value={eventForm.mainImage}
                onChange={(url) => setEventForm({ ...eventForm, mainImage: url })}
                folder="events"
                placeholder="https://... or upload image"
                required
                helperText="Upload event flyer or poster to Cloudinary, or paste an external image URL"
              />
            </div>

            {/* Multiple Gallery Images */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Gallery Images
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Upload multiple event highlights to Cloudinary or paste URLs (comma/newline separated)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1d3c68] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer">
                    <FaUpload className="text-[10px]" />
                    <span>{uploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingGallery}
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </label>
                  {eventForm.galleryImages && (
                    <span className="text-[11px] font-semibold text-[#3d73bd] bg-white border border-blue-200 px-2 py-0.5 rounded-full">
                      {eventForm.galleryImages.split(/[,\n]/).map((u) => u.trim()).filter(Boolean).length} image(s)
                    </span>
                  )}
                </div>
              </div>
              <textarea
                placeholder="https://res.cloudinary.com/..., https://res.cloudinary.com/..."
                rows={3}
                value={eventForm.galleryImages}
                onChange={(e) =>
                  setEventForm({ ...eventForm, galleryImages: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
              {eventForm.galleryImages && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {eventForm.galleryImages
                    .split(/[,\n]/)
                    .map((url) => url.trim())
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((url, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white p-0.5 shadow-2xs">
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Event Sponsors & Dynamic Tiers Management */}
            <div className="pt-4 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                    <FaAward />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Event Sponsors & Partners</span>
                      {sponsorTiers.length > 0 && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                          {sponsorTiers.length} {sponsorTiers.length === 1 ? "Tier" : "Tiers"}
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Create dynamic sponsor tiers (e.g. Gold Sponsor, Silver Sponsor) and attach brand logos
                    </p>
                  </div>
                </div>

                {/* Quick Add Tier Presets */}
                <div className="flex items-center flex-wrap gap-1.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleAddTier("Gold Sponsor")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors cursor-pointer"
                  >
                    <FaPlus className="text-[9px]" />
                    <span>+ Gold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTier("Silver Sponsor")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-lg transition-colors cursor-pointer"
                  >
                    <FaPlus className="text-[9px]" />
                    <span>+ Silver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTier("Custom Sponsor")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#1d3c68] bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-colors cursor-pointer"
                  >
                    <FaPlus className="text-[9px]" />
                    <span>+ Custom Tier</span>
                  </button>
                </div>
              </div>

              {/* Tiers List */}
              {sponsorTiers.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-base">
                    <FaAward />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">No Sponsors Added Yet</p>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Easily categorize event backers with dynamic titles like &quot;Gold Sponsor&quot;, &quot;Silver Sponsor&quot;, or &quot;Beverage Partner&quot; and display their logos.
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => handleAddTier("Gold Sponsor")}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FaPlus className="text-[10px]" />
                      <span>Add Gold Sponsor Tier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddTier("Silver Sponsor")}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <FaPlus className="text-[10px]" />
                      <span>Add Silver Sponsor Tier</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sponsorTiers.map((tierItem, tIdx) => {
                    const isGold = tierItem.tier.toLowerCase().includes("gold");
                    const isSilver = tierItem.tier.toLowerCase().includes("silver");
                    const isBronze = tierItem.tier.toLowerCase().includes("bronze");

                    const tierBadgeClass = isGold
                      ? "bg-amber-500/10 text-amber-700 border-amber-300"
                      : isSilver
                      ? "bg-slate-200 text-slate-700 border-slate-300"
                      : isBronze
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : "bg-blue-50 text-[#1d3c68] border-blue-200";

                    return (
                      <div
                        key={tierItem.id || `tier_${tIdx}`}
                        className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
                      >
                        {/* Tier Title Bar */}
                        <div className="p-3.5 bg-slate-50/90 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                            <span
                              className={`w-3 h-3 rounded-full shrink-0 ${
                                isGold
                                  ? "bg-amber-500 shadow-xs shadow-amber-400"
                                  : isSilver
                                  ? "bg-slate-400"
                                  : isBronze
                                  ? "bg-orange-500"
                                  : "bg-[#3d73bd]"
                              }`}
                            />
                            <input
                              type="text"
                              value={tierItem.tier}
                              onChange={(e) => handleUpdateTierTitle(tIdx, e.target.value)}
                              placeholder="e.g. Gold Sponsor, Silver Sponsor, Title Sponsor..."
                              className="font-bold text-xs text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] flex-1"
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${tierBadgeClass} shrink-0`}
                            >
                              {tierItem.sponsors?.length || 0} Logos
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddSponsorToTier(tIdx)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                            >
                              <FaPlus className="text-[10px]" />
                              <span>Add Logo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(tIdx)}
                              className="inline-flex items-center gap-1 p-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete this sponsor tier"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>

                        {/* Sponsors inside this tier */}
                        <div className="p-3.5 space-y-3 bg-white">
                          {(!tierItem.sponsors || tierItem.sponsors.length === 0) ? (
                            <div className="text-center py-4 text-xs text-slate-400 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                              No logos added under &quot;{tierItem.tier}&quot; yet.
                              <button
                                type="button"
                                onClick={() => handleAddSponsorToTier(tIdx)}
                                className="ml-2 font-semibold text-[#3d73bd] hover:underline"
                              >
                                + Add Logo
                              </button>
                            </div>
                          ) : (
                            tierItem.sponsors.map((sp, spIdx) => (
                              <div
                                key={sp.id || `sp_${spIdx}`}
                                className="p-3 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-3"
                              >
                                {/* Logo Preview Box */}
                                <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center p-1 shadow-2xs group">
                                  {sp.logo ? (
                                    <img
                                      src={sp.logo}
                                      alt={sp.name || "Sponsor Logo"}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                      <FaImage className="text-base" />
                                      <span className="text-[9px] text-slate-400 mt-0.5">No Logo</span>
                                    </div>
                                  )}
                                </div>

                                {/* Inputs Grid */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                  {/* Sponsor Name */}
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                      Sponsor / Company Name *
                                    </label>
                                    <div className="relative">
                                      <FaBuilding className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
                                      <input
                                        type="text"
                                        placeholder="e.g. Cisco Systems"
                                        value={sp.name}
                                        onChange={(e) =>
                                          handleUpdateSponsor(tIdx, spIdx, "name", e.target.value)
                                        }
                                        className="w-full pl-7 pr-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                                      />
                                    </div>
                                  </div>

                                  {/* Logo URL or Upload */}
                                  <div>
                                    <div className="flex items-center justify-between mb-0.5">
                                      <label className="text-[10px] font-semibold text-slate-600">
                                        Logo URL / Image *
                                      </label>
                                      <label className="text-[10px] font-semibold text-[#3d73bd] hover:underline cursor-pointer inline-flex items-center gap-1">
                                        <FaUpload className="text-[9px]" />
                                        <span>
                                          {uploadingSponsorKey === `${tIdx}_${spIdx}`
                                            ? "Uploading..."
                                            : "Upload File"}
                                        </span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          disabled={uploadingSponsorKey === `${tIdx}_${spIdx}`}
                                          className="hidden"
                                          onChange={(e) => handleFileUpload(tIdx, spIdx, e)}
                                        />
                                      </label>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="https://... or upload"
                                      value={sp.logo}
                                      onChange={(e) =>
                                        handleUpdateSponsor(tIdx, spIdx, "logo", e.target.value)
                                      }
                                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                                    />
                                  </div>

                                  {/* Website URL */}
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                      Website Link (Optional)
                                    </label>
                                    <div className="relative">
                                      <FaGlobe className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
                                      <input
                                        type="url"
                                        placeholder="https://sponsor.com"
                                        value={sp.websiteUrl || ""}
                                        onChange={(e) =>
                                          handleUpdateSponsor(tIdx, spIdx, "websiteUrl", e.target.value)
                                        }
                                        className="w-full pl-7 pr-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Remove Sponsor Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSponsor(tIdx, spIdx)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer self-end md:self-center shrink-0"
                                  title="Remove sponsor logo"
                                >
                                  <FaTrash className="text-xs" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
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
