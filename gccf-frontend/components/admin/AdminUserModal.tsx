"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSpinner,
  FaSave,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
} from "react-icons/fa";
import { AdminUser, CreateAdminUserDto, UpdateAdminUserDto } from "@/lib/api";
import { AVAILABLE_PERMISSIONS } from "./types";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAdmin: AdminUser | null;
  onSubmit: (data: CreateAdminUserDto | UpdateAdminUserDto) => Promise<void>;
  loading: boolean;
}

export default function AdminUserModal({
  isOpen,
  onClose,
  editingAdmin,
  onSubmit,
  loading,
}: AdminUserModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"super_admin" | "admin">("admin");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingAdmin) {
      setUsername(editingAdmin.username);
      setPassword("");
      setRole(editingAdmin.role);
      setIsActive(editingAdmin.isActive ?? true);
      setPermissions(editingAdmin.permissions || []);
      setFormError("");
    } else {
      setUsername("");
      setPassword("");
      setRole("admin");
      setIsActive(true);
      // Default standard permissions: dashboard, news, events
      setPermissions(["dashboard", "news", "events"]);
      setFormError("");
    }
  }, [editingAdmin, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setPermissions(AVAILABLE_PERMISSIONS.map((p) => p.id));
  };

  const handleClearAll = () => {
    setPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!username.trim()) {
      setFormError("Username is required.");
      return;
    }

    if (!editingAdmin && (!password || password.length < 6)) {
      setFormError("Password is required and must be at least 6 characters.");
      return;
    }

    if (editingAdmin && password && password.length < 6) {
      setFormError("New password must be at least 6 characters.");
      return;
    }

    const payload: CreateAdminUserDto | UpdateAdminUserDto = {
      username: username.trim(),
      role,
      isActive,
      permissions: role === "super_admin" ? ["all"] : permissions,
    };

    if (password) {
      payload.password = password;
    }

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setFormError(err.message || "Failed to save admin user.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-user-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 bg-gradient-to-r from-[#1d3c68] via-[#3d73bd] to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg">
              <FaUserShield />
            </div>
            <div>
              <h2 id="admin-user-modal-title" className="font-bold text-lg text-slate-900 leading-tight">
                {editingAdmin ? "Edit Admin Account" : "Add New Admin Account"}
              </h2>
              <p className="text-xs text-slate-500">
                {editingAdmin
                  ? `Update credentials and feature permissions for @${editingAdmin.username}`
                  : "Create an administrator and specify accessible dashboard features"}
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
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
                <FaInfoCircle className="shrink-0 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. content_manager"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                {editingAdmin ? "Change Password (Optional)" : "Password"}{" "}
                {!editingAdmin && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    editingAdmin
                      ? "Leave blank to retain current password"
                      : "Minimum 6 characters"
                  }
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd] focus:border-transparent transition-all"
                  minLength={password ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-sm p-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {editingAdmin && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Only fill this in if you want to reset this admin&apos;s password.
                </p>
              )}
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "super_admin" | "admin")}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd] focus:border-transparent transition-all"
                >
                  <option value="admin">Admin (Restricted Features)</option>
                  <option value="super_admin">Super Admin (Full System Access)</option>
                </select>
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Status
                </label>
                <div className="flex items-center h-[42px] px-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#3d73bd] rounded border-slate-300 focus:ring-[#3d73bd] cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {isActive ? "Active (Can Sign In)" : "Disabled / Locked"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Feature Permissions Checkboxes */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Feature Access Permissions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select the dashboard modules this admin is allowed to access
                  </p>
                </div>

                {role === "admin" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs font-medium text-[#3d73bd] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {role === "super_admin" ? (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-3">
                  <FaInfoCircle className="text-blue-500 text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">
                      Super Admin Privileges
                    </span>
                    This user has unrestricted administrative access to all modules,
                    including Admins &amp; Roles management, Settings, Analytics, and all CMS sections.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = permissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-blue-50/60 border-[#3d73bd]/50 shadow-xs"
                            : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id)}
                          className="mt-0.5 w-4 h-4 text-[#3d73bd] rounded border-slate-300 focus:ring-[#3d73bd] cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`block text-xs font-semibold leading-tight ${
                              isChecked ? "text-[#1d3c68]" : "text-slate-800"
                            }`}
                          >
                            {perm.name}
                          </span>
                          <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                            {perm.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#32609e] rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-xs" />
                  <span>{editingAdmin ? "Update Admin" : "Create Admin"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
