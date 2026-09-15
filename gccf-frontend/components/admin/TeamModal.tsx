"use client";

import React from "react";
import { FaTimes, FaSpinner, FaSave, FaUserPlus } from "react-icons/fa";
import { TeamMember, TeamFormData } from "./types";
import { ImageUploadInput } from "./ImageUploadInput";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: TeamMember | null;
  teamForm: TeamFormData;
  setTeamForm: React.Dispatch<React.SetStateAction<TeamFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
  loading: boolean;
}

export default function TeamModal({
  isOpen,
  onClose,
  editingMember,
  teamForm,
  setTeamForm,
  onSubmit,
  loading,
}: TeamModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-base">
              <FaUserPlus />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingMember
                  ? "Update member leadership credentials and affiliations"
                  : "Add leadership, executive, or advisory board member"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Mitchell"
                value={teamForm.name}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, name: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Position / Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Title / Position *
              </label>
              <input
                type="text"
                placeholder="e.g. Founder & CEO / Chief Threat Analyst"
                value={teamForm.title}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, title: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Affiliated Part */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Affiliated Part / Branch *
              </label>
              <input
                type="text"
                placeholder="e.g. Executive Board / Global Advisory / Cyber Response Unit"
                value={teamForm.affiliatedPart}
                onChange={(e) =>
                  setTeamForm({ ...teamForm, affiliatedPart: e.target.value })
                }
                required
                className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
              />
            </div>

            {/* Profile Image (Cloudinary) */}
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <ImageUploadInput
                label="Profile Image"
                value={teamForm.image}
                onChange={(url) => setTeamForm({ ...teamForm, image: url })}
                folder="team"
                placeholder="https://... or upload photo"
                required
                helperText="Upload member photo to Cloudinary, or paste an external image URL"
              />
            </div>

            {/* Row: Email & LinkedIn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="contact@gccf.org"
                  value={teamForm.email}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={teamForm.linkedin}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, linkedin: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors"
                />
              </div>
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
              <span>{editingMember ? "Update Member" : "Add Member"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export { TeamModal };
