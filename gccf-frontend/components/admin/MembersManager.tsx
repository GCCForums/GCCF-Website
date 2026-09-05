"use client";

import React, { useState } from "react";
import {
  FaSearch,
  FaUsers,
  FaCheck,
  FaBan,
  FaEnvelope,
  FaTrash,
  FaPhone,
  FaBuilding,
  FaRedo,
} from "react-icons/fa";
import { Membership } from "@/types/membership";
import { DeleteTarget } from "./types";

interface MembersManagerProps {
  membershipsList: Membership[];
  loading: boolean;
  onStatusChange: (id: string, status: "approved" | "declined" | "pending") => Promise<void>;
  onSetDeleteTarget: (target: DeleteTarget) => void;
}

export const MembersManager: React.FC<MembersManagerProps> = ({
  membershipsList,
  loading,
  onStatusChange,
  onSetDeleteTarget,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pendingCount = membershipsList.filter((m) => m.status === "pending").length;
  const approvedCount = membershipsList.filter((m) => m.status === "approved").length;
  const declinedCount = membershipsList.filter((m) => m.status === "declined").length;

  const filteredMemberships = membershipsList.filter((m) => {
    const matchesSearch =
      m.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.email.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const memberStats = [
    {
      label: "Pending Applications",
      count: pendingCount,
      subText: "Requires administrative review",
      icon: <FaUsers className="text-lg" />,
      accentGradient: "from-amber-500 to-orange-500",
      iconGradient: "from-amber-500 to-orange-500",
      badgeClasses: "bg-amber-50 text-amber-800 border-amber-200/60",
    },
    {
      label: "Approved Members",
      count: approvedCount,
      subText: "Active community participants",
      icon: <FaCheck className="text-lg" />,
      accentGradient: "from-emerald-500 to-teal-500",
      iconGradient: "from-emerald-500 to-teal-500",
      badgeClasses: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
    },
    {
      label: "Declined Applications",
      count: declinedCount,
      subText: "Rejected or archived entries",
      icon: <FaBan className="text-lg" />,
      accentGradient: "from-rose-500 to-red-500",
      iconGradient: "from-rose-500 to-red-500",
      badgeClasses: "bg-rose-50 text-rose-800 border-rose-200/60",
    },
  ];

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
          Membership Management
        </h1>
        <p className="text-sm text-slate-500">
          Review, approve, or decline community registration applications
        </p>
      </div>

      {/* Modern Status Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {memberStats.map((stat, idx) => (
          <div
            key={idx}
            className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accentGradient}`}
            />
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${stat.iconGradient} shadow-md shadow-slate-200`}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {stat.label}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {stat.count}
            </div>
            <p className="text-xs text-slate-500 font-medium">{stat.subText}</p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaUsers className="text-[#3d73bd]" />
          <span>{filteredMemberships.length} applications</span>
        </div>
      </div>

      {/* Modern Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Applicant Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Contact / Phone</th>
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date Applied</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMemberships.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 group-hover:text-[#3d73bd] transition-colors">
                      {member.firstName} {member.lastName}
                    </div>
                    {member.occupation && (
                      <span className="text-xs text-slate-400 font-normal">
                        {member.occupation}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#3d73bd] bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                    >
                      <FaEnvelope className="text-[10px] text-slate-400" />
                      <span>{member.email}</span>
                    </a>
                  </td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap text-xs">
                    {member.phone ? (
                      <div className="flex items-center gap-1.5">
                        <FaPhone className="text-slate-400 text-[10px]" />
                        <span>{member.phone}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap text-xs">
                    {member.organization ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <FaBuilding className="text-slate-400 text-[10px]" />
                        <span>{member.organization}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Independent</span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        member.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : member.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap text-xs">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {member.status === "pending" && (
                        <>
                          <button
                            title="Approve Member"
                            onClick={() => onStatusChange(member.id, "approved")}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <FaCheck className="text-[10px]" />
                            <span>Approve</span>
                          </button>
                          <button
                            title="Decline Member"
                            onClick={() => onStatusChange(member.id, "declined")}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <FaBan className="text-[10px]" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {member.status !== "pending" && (
                        <button
                          title="Reset to Pending"
                          onClick={() => onStatusChange(member.id, "pending")}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <FaRedo className="text-[10px]" />
                          <span>Reset</span>
                        </button>
                      )}

                      <button
                        title="Delete Entry"
                        onClick={() =>
                          onSetDeleteTarget({ type: "memberships", id: member.id })
                        }
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMemberships.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaUsers className="text-3xl text-slate-300" />
                      <p className="font-semibold text-slate-700">
                        No membership applications found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try changing your search terms or filter selection.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
