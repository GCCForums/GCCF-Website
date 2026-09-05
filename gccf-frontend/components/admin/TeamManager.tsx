"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaLinkedin,
  FaUserFriends,
  FaBuilding,
} from "react-icons/fa";
import { TeamMember, DeleteTarget } from "./types";

interface TeamManagerProps {
  teamList: TeamMember[];
  onOpenAddModal: () => void;
  onOpenEditModal: (member: TeamMember) => void;
  onSetDeleteTarget: (target: DeleteTarget) => void;
}

export default function TeamManager({
  teamList,
  onOpenAddModal,
  onOpenEditModal,
  onSetDeleteTarget,
}: TeamManagerProps) {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredMembers = teamList.filter((m) => {
    const search = searchFilter.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(search) ||
      (m.title || "").toLowerCase().includes(search) ||
      (m.affiliatedPart || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Team Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage leadership profiles, advisors, and executive team members displayed on <strong>/team</strong>
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, role, or affiliated part..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaUserFriends className="text-[#3d73bd]" />
          <span>{filteredMembers.length} team members</span>
        </div>
      </div>

      {/* Modern Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
          >
            {/* Top subtle blue accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1d3c68] to-[#3d73bd]" />

            <div>
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#3d73bd]/20 shadow-xs bg-slate-100 shrink-0">
                  <img
                    src={member.image || "/api/placeholder/400/500"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base text-slate-900 truncate group-hover:text-[#3d73bd] transition-colors">
                    {member.name}
                  </h3>
                  <span className="inline-block text-xs font-semibold text-[#3d73bd] bg-blue-50/80 px-2 py-0.5 rounded-md mt-0.5">
                    {member.title || "Member"}
                  </span>
                </div>
              </div>

              {/* Affiliated Part Badge */}
              {member.affiliatedPart && (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 mb-4">
                  <FaBuilding className="text-slate-400 text-xs shrink-0" />
                  <span className="text-slate-400 font-normal">Affiliation:</span>
                  <span className="font-semibold text-slate-700 truncate">
                    {member.affiliatedPart}
                  </span>
                </div>
              )}

              {/* Social Channels */}
              <div className="flex items-center gap-2 mb-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email.replace(/^mailto:/, "")}`}
                    title={member.email}
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200/80 flex items-center justify-center text-xs transition-colors"
                  >
                    <FaEnvelope />
                  </a>
                )}
                {member.linkedin && member.linkedin !== "#" && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn Profile"
                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-[#0a66c2] border border-slate-200/80 flex items-center justify-center text-xs transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onOpenEditModal(member)}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <FaEdit className="text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onSetDeleteTarget({ type: "teams", id: member.id })}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
              >
                <FaTrash className="text-rose-500 text-[10px]" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <FaUserFriends className="text-3xl text-slate-300" />
            <p className="font-semibold text-slate-700">No team members found</p>
            <p className="text-xs text-slate-400">
              Click &quot;Add Team Member&quot; to build out your organization leadership.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export { TeamManager };
