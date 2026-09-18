"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaClock,
  FaImage,
  FaSave,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { PopupItem } from "./types";
import { popupsApi } from "@/lib/api";
import { ImageUploadInput } from "./ImageUploadInput";

const defaultPopups: PopupItem[] = [
  {
    id: "1",
    name: "GCCF Annual Cyber Summit Announcement",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    enabled: true,
    delaySeconds: 3,
    createdAt: new Date().toISOString(),
  },
];

export default function PopupManager() {
  const [popups, setPopups] = useState<PopupItem[]>(() => {
    if (typeof window === "undefined") return defaultPopups;
    try {
      const stored = localStorage.getItem("gccf_popups_list");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to read popups", err);
    }
    return defaultPopups;
  });
  const [searchFilter, setSearchFilter] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formDelaySeconds, setFormDelaySeconds] = useState(3);
  const [formEnabled, setFormEnabled] = useState(true);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const syncActivePopupToPublic = useCallback((list: PopupItem[]) => {
    if (typeof window === "undefined") return;
    const activeItem = list.find((p) => p.enabled);
    if (activeItem) {
      localStorage.setItem(
        "gccf_website_popup_config",
        JSON.stringify({
          enabled: true,
          name: activeItem.name,
          imageUrl: activeItem.imageUrl,
          delaySeconds: activeItem.delaySeconds,
        })
      );
    } else {
      localStorage.setItem(
        "gccf_website_popup_config",
        JSON.stringify({
          enabled: false,
          name: "",
          imageUrl: "",
          delaySeconds: 3,
        })
      );
    }
    window.dispatchEvent(new Event("storage"));
  }, []);

  // Initialize and fetch from backend
  useEffect(() => {
    let isMounted = true;
    popupsApi
      .getAll()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setPopups(data);
          syncActivePopupToPublic(data);
        }
      })
      .catch((err) => {
        console.warn("Backend popupsApi unavailable, using local state", err);
      });

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gccf_popups_list");
        if (!stored) {
          localStorage.setItem(
            "gccf_popups_list",
            JSON.stringify(defaultPopups)
          );
          syncActivePopupToPublic(defaultPopups);
        }
      } catch (err) {
        console.error("Failed to initialize popups", err);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [syncActivePopupToPublic]);

  const showSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const openAddModal = () => {
    setEditingPopup(null);
    setFormName("");
    setFormImageUrl("");
    setFormDelaySeconds(3);
    setFormEnabled(true);
    setModalOpen(true);
  };

  const openEditModal = (popup: PopupItem) => {
    setEditingPopup(popup);
    setFormName(popup.name);
    setFormImageUrl(popup.imageUrl);
    setFormDelaySeconds(popup.delaySeconds);
    setFormEnabled(popup.enabled);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updated: PopupItem[];

    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (editingPopup) {
      if (isUUID(editingPopup.id)) {
        try {
          await popupsApi.update(editingPopup.id, {
            name: formName,
            imageUrl: formImageUrl,
            delaySeconds: formDelaySeconds,
            enabled: formEnabled,
          });
        } catch (err) {
          console.warn("Backend update popup failed, updating local state", err);
        }
      }
      updated = popups.map((p) => {
        if (p.id === editingPopup.id) {
          return {
            ...p,
            name: formName,
            imageUrl: formImageUrl,
            delaySeconds: formDelaySeconds,
            enabled: formEnabled,
          };
        }
        return formEnabled ? { ...p, enabled: false } : p;
      });
    } else {
      let created: PopupItem | null = null;
      try {
        created = await popupsApi.create({
          name: formName,
          imageUrl: formImageUrl,
          delaySeconds: formDelaySeconds,
          enabled: formEnabled,
        });
      } catch (err) {
        console.warn("Backend create popup failed, updating local state", err);
      }
      const newPopup: PopupItem = created || {
        id: Date.now().toString(),
        name: formName,
        imageUrl: formImageUrl,
        delaySeconds: formDelaySeconds,
        enabled: formEnabled,
        createdAt: new Date().toISOString(),
      };
      updated = formEnabled
        ? [...popups.map((p) => ({ ...p, enabled: false })), newPopup]
        : [...popups, newPopup];
    }

    setPopups(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gccf_popups_list", JSON.stringify(updated));
      syncActivePopupToPublic(updated);
    }
    setModalOpen(false);
    showSaveNotice();
  };

  const handleToggleActive = async (id: string) => {
    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    const target = popups.find((p) => p.id === id);
    if (target && isUUID(id)) {
      try {
        await popupsApi.toggle(id, !target.enabled);
      } catch (err) {
        console.warn("Backend toggle popup failed, updating local state", err);
      }
    }
    const updated = popups.map((p) => {
      if (p.id === id) {
        return { ...p, enabled: !p.enabled };
      }
      return { ...p, enabled: false };
    });

    setPopups(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gccf_popups_list", JSON.stringify(updated));
      syncActivePopupToPublic(updated);
    }
    showSaveNotice();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

    if (isUUID(deleteTargetId)) {
      try {
        await popupsApi.delete(deleteTargetId);
      } catch (err) {
        console.warn("Backend delete popup failed, updating local state", err);
      }
    }
    const updated = popups.filter((p) => p.id !== deleteTargetId);
    setPopups(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("gccf_popups_list", JSON.stringify(updated));
      syncActivePopupToPublic(updated);
    }
    setDeleteTargetId(null);
    showSaveNotice();
  };

  const filteredPopups = popups.filter((p) =>
    (p.name || "").toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Website Pop-Up Management
          </h1>
          <p className="text-sm text-slate-500">
            Control promotional posters and important event notices shown to site visitors
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add Pop-Up</span>
        </button>
      </div>

      {/* Save Success Notice */}
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2.5 text-sm font-semibold shadow-xs animate-fadeIn">
          <FaCheckCircle className="text-emerald-500 shrink-0" />
          <span>Pop-up configuration updated successfully! Active pop-up is live on the public site.</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search popups by name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          <FaImage className="text-[#3d73bd]" />
          <span>{filteredPopups.length} pop-ups</span>
        </div>
      </div>

      {/* Modern Popups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPopups.map((popup) => (
          <div
            key={popup.id}
            className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between ${
              popup.enabled
                ? "border-[#3d73bd] shadow-md shadow-blue-500/10 ring-1 ring-[#3d73bd]"
                : "border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300"
            }`}
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                {popup.imageUrl ? (
                  <img
                    src={popup.imageUrl}
                    alt={popup.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80";
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 gap-2 text-xs">
                    <FaImage className="text-lg" />
                    <span>No image set</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      popup.enabled
                        ? "bg-emerald-600/90 text-white border border-emerald-400/40"
                        : "bg-slate-900/75 text-slate-300 border border-slate-700/50"
                    }`}
                  >
                    {popup.enabled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                    {popup.enabled ? "Active on Website" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Info Details */}
              <div className="p-5">
                <h3 className="font-bold text-base text-slate-900 mb-2 truncate group-hover:text-[#3d73bd] transition-colors">
                  {popup.name}
                </h3>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <FaClock className="text-[#3d73bd] text-xs shrink-0" />
                  <span className="text-slate-500">Delay:</span>
                  <span className="font-semibold text-slate-800">
                    {popup.delaySeconds} second{popup.delaySeconds === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={popup.enabled}
                  onChange={() => handleToggleActive(popup.id)}
                  className="w-4 h-4 rounded text-[#3d73bd] focus:ring-[#3d73bd] cursor-pointer"
                />
                <span
                  className={popup.enabled ? "text-emerald-700" : "text-slate-500"}
                >
                  {popup.enabled ? "Active" : "Disabled"}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(popup)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <FaEdit className="text-slate-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTargetId(popup.id)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-colors cursor-pointer"
                >
                  <FaTrash className="text-rose-500 text-[10px]" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPopups.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <FaImage className="text-3xl text-slate-300" />
            <p className="font-semibold text-slate-700">No pop-ups found</p>
            <p className="text-xs text-slate-400">
              {searchFilter
                ? `No pop-up matching "${searchFilter}"`
                : "Click \"Add Pop-Up\" above to configure an image poster."}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Pop-Up Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">
                {editingPopup ? "Edit Pop-Up" : "Add New Pop-Up"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pop-Up Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Summit 2026 Poster"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                />
              </div>

              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <ImageUploadInput
                  label="Popup Image / Graphic"
                  value={formImageUrl}
                  onChange={(url) => setFormImageUrl(url)}
                  folder="popups"
                  placeholder="https://... or upload flyer"
                  required
                  helperText="The pop-up will display this promotional graphic directly to visitors."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Appearance Delay (seconds) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={formDelaySeconds}
                  onChange={(e) =>
                    setFormDelaySeconds(parseInt(e.target.value) || 0)
                  }
                  required
                  className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Seconds to wait before this pop-up appears on the website.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3d73bd] focus:ring-[#3d73bd] cursor-pointer"
                  />
                  <span>Activate immediately on the live website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <FaSave />
                  <span>{editingPopup ? "Update Pop-Up" : "Save Pop-Up"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setDeleteTargetId(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this pop-up banner? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
              >
                <FaTrash className="text-[10px]" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { PopupManager };
