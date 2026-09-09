"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaUserShield,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaShieldAlt,
  FaUsers,
  FaKey,
} from "react-icons/fa";
import {
  adminUsersApi,
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "@/lib/api";
import { AVAILABLE_PERMISSIONS } from "./types";
import AdminUserModal from "./AdminUserModal";

interface AdminUsersManagerProps {
  currentUsername?: string;
}

export default function AdminUsersManager({
  currentUsername,
}: AdminUsersManagerProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminUsersApi.getAll();
      setAdmins(data);
    } catch (err: any) {
      console.error("Failed to load admin users:", err);
      setError(err.message || "Failed to load admin accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (
    payload: CreateAdminUserDto | UpdateAdminUserDto
  ) => {
    setModalLoading(true);
    try {
      if (editingAdmin) {
        await adminUsersApi.update(editingAdmin.id, payload);
      } else {
        await adminUsersApi.create(payload as CreateAdminUserDto);
      }
      setIsModalOpen(false);
      setEditingAdmin(null);
      await fetchAdmins();
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminUsersApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchAdmins();
    } catch (err: any) {
      setError(err.message || "Failed to delete admin.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      admin.username.toLowerCase().includes(query) ||
      admin.role.toLowerCase().includes(query)
    );
  });

  const superAdminCount = admins.filter((a) => a.role === "super_admin").length;
  const activeCount = admins.filter((a) => a.isActive !== false).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-lg">
              <FaUserShield />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Admins &amp; Role Access Control
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create administrators, assign Super Admin privileges, and selectively enable module features.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3d73bd] hover:bg-[#32609e] text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <FaUserPlus className="text-xs" />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center text-xl shrink-0">
            <FaUsers />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{admins.length}</div>
            <div className="text-xs font-medium text-slate-500">Total Administrators</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <FaShieldAlt />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{superAdminCount}</div>
            <div className="text-xs font-medium text-slate-500">Super Admins</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
            <div className="text-xs font-medium text-slate-500">Active Accounts</div>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold text-red-800 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <FaSearch className="text-slate-400 text-sm ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by username or role..."
          className="w-full bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Admins Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading && admins.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-[#3d73bd] rounded-full animate-spin mx-auto mb-3" />
            Loading admin accounts...
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            {searchQuery ? "No admin accounts found matching your search." : "No administrator accounts registered."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Enabled Features</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredAdmins.map((admin) => {
                  const isSuper = admin.role === "super_admin";
                  const isSelf = Boolean(currentUsername && admin.username === currentUsername);
                  const perms = admin.permissions || [];

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* User Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isSuper
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-[#3d73bd]"
                            }`}
                          >
                            {admin.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>@{admin.username}</span>
                              {isSelf && (
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Added {new Date(admin.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSuper ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <FaShieldAlt className="text-[10px]" />
                            Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <FaKey className="text-[10px] text-slate-400" />
                            Admin
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.isActive !== false ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Enabled Features Column */}
                      <td className="px-6 py-4">
                        {isSuper ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Full Access (All Modules)
                          </span>
                        ) : perms.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">
                            No features assigned
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {perms.map((p) => {
                              const found = AVAILABLE_PERMISSIONS.find((item) => item.id === p);
                              return (
                                <span
                                  key={p}
                                  className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                                >
                                  {found ? found.name : p}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(admin)}
                            className="p-2 text-slate-500 hover:text-[#3d73bd] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Admin"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(admin)}
                            disabled={admin.username === "admin" || isSelf}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              admin.username === "admin" || isSelf
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                            title={
                              admin.username === "admin"
                                ? "Primary root admin cannot be deleted"
                                : isSelf
                                ? "You cannot delete your own account"
                                : "Delete Admin"
                            }
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin User Add / Edit Modal */}
      <AdminUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
        }}
        editingAdmin={editingAdmin}
        onSubmit={handleSubmitModal}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaTrash />
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              Delete Administrator Account?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-800">@{deleteTarget.username}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
