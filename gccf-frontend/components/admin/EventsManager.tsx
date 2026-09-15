"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaCalendarAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaAward,
} from "react-icons/fa";
import { Event } from "@/types/events";
import { DeleteTarget } from "./types";

interface EventsManagerProps {
  eventsList: Event[];
  onOpenAddModal?: () => void;
  onOpenEditModal?: (event: Event) => void;
  onSetDeleteTarget?: (target: DeleteTarget) => void;
  // Legacy / alternate props support
  onAddNew?: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
}

export default function EventsManager({
  eventsList,
  onOpenAddModal,
  onOpenEditModal,
  onSetDeleteTarget,
  onAddNew,
  onEdit,
  onDelete,
}: EventsManagerProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAdd = onOpenAddModal || onAddNew || (() => {});
  const handleEdit = onOpenEditModal || onEdit || (() => {});
  const handleDelete = (id: string) => {
    if (onSetDeleteTarget) {
      onSetDeleteTarget({ type: "events", id });
    } else if (onDelete) {
      onDelete(id);
    }
  };

  const filteredEvents = eventsList.filter((event) => {
    const title = event.title || "";
    const location = event.location || "";
    const search = searchFilter || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Events Management
          </h1>
          <p className="text-sm text-slate-500">
            Schedule workshops, summits, webinars, and community meetups
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, location..."
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
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaCalendarAlt className="text-[#3d73bd]" />
          <span>{filteredEvents.length} events</span>
        </div>
      </div>

      {/* Modern Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isUpcoming = event.status === "upcoming";
          return (
            <div
              key={event.id}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isUpcoming
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : "bg-slate-300"
                }`}
              />

              <div>
                {/* Status Pill */}
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      isUpcoming
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}
                  >
                    {isUpcoming && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    {event.status}
                  </span>

                  {event.sponsors && event.sponsors.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <FaAward className="text-amber-500 text-xs" />
                      <span>
                        {event.sponsors.length} {event.sponsors.length === 1 ? "Tier" : "Tiers"}
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3d73bd] transition-colors mb-4 line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100">
                    <FaCalendarAlt className="text-[#3d73bd] text-sm shrink-0" />
                    <span>
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date To Be Determined"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 flex-1">
                      <FaUsers className="text-emerald-600 text-sm shrink-0" />
                      <span>{event.attendees || 0} attendees</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 flex-1 truncate">
                      <FaMapMarkerAlt className="text-amber-500 text-xs shrink-0" />
                      <span className="truncate">{event.location || "Online"}</span>
                    </div>
                  </div>

                  {event.sponsors && event.sponsors.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200/60">
                      <FaAward className="text-amber-600 text-sm shrink-0" />
                      <span className="truncate">
                        Sponsors: {event.sponsors.map((t) => t.tier).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <FaEdit className="text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
                >
                  <FaTrash className="text-rose-500 text-[10px]" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <FaCalendarAlt className="text-3xl text-slate-300" />
            <p className="font-semibold text-slate-700">No events found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or schedule a new event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export { EventsManager };
