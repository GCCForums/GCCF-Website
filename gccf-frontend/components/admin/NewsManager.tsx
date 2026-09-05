"use client";

import React, { useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaNewspaper, FaCalendarAlt, FaUser } from "react-icons/fa";
import { News } from "@/types/news";
import { DeleteTarget } from "./types";

interface NewsManagerProps {
  newsList: News[];
  onOpenAddModal?: () => void;
  onOpenEditModal?: (news: News) => void;
  onSetDeleteTarget?: (target: DeleteTarget) => void;
  // Legacy / alternate props support
  onAddNew?: () => void;
  onEdit?: (news: News) => void;
  onDelete?: (id: string) => void;
}

export default function NewsManager({
  newsList,
  onOpenAddModal,
  onOpenEditModal,
  onSetDeleteTarget,
  onAddNew,
  onEdit,
  onDelete,
}: NewsManagerProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAdd = onOpenAddModal || onAddNew || (() => {});
  const handleEdit = onOpenEditModal || onEdit || (() => {});
  const handleDelete = (id: string) => {
    if (onSetDeleteTarget) {
      onSetDeleteTarget({ type: "news", id });
    } else if (onDelete) {
      onDelete(id);
    }
  };

  const filteredNews = newsList.filter((news) => {
    const title = news.title || "";
    const excerpt = news.excerpt || "";
    const search = searchFilter || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" &&
        news.publishedDate <= new Date().toISOString()) ||
      (statusFilter === "draft" &&
        news.publishedDate > new Date().toISOString());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            News & Articles Management
          </h1>
          <p className="text-sm text-slate-500">
            Publish, edit, and categorize press releases and community announcements
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, excerpt..."
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
            <option value="all">All Articles</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaNewspaper className="text-[#3d73bd]" />
          <span>{filteredNews.length} articles</span>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Article</th>
                <th className="py-3.5 px-6">Author</th>
                <th className="py-3.5 px-6">Published Date</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredNews.map((news) => (
                <tr
                  key={news.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-4 px-6 max-w-md">
                    <div className="font-semibold text-slate-900 group-hover:text-[#3d73bd] transition-colors line-clamp-1">
                      {news.title}
                    </div>
                    {news.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                        {news.excerpt}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <FaUser className="text-slate-400 text-[10px]" />
                      <span>{news.author || "Editorial Team"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FaCalendarAlt className="text-slate-400 text-[10px]" />
                      <span>
                        {news.publishedDate
                          ? new Date(news.publishedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Unscheduled"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                      {news.category || "General"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        title="Edit Article"
                        onClick={() => handleEdit(news)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        title="Delete Article"
                        onClick={() => handleDelete(news.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNews.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaNewspaper className="text-3xl text-slate-300" />
                      <p className="font-medium text-slate-600">No articles found</p>
                      <p className="text-xs text-slate-400">
                        Try modifying your search or click &quot;Add Article&quot; to create one.
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
}
export { NewsManager };
