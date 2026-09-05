"use client";

import React from "react";
import { FaTimes, FaSpinner, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { DeleteTarget } from "./types";

interface DeleteConfirmModalProps {
  target: DeleteTarget | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  target,
  onClose,
  onConfirm,
  loading,
}) => {
  if (!target) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
            <FaExclamationTriangle />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <h3 className="font-bold text-base text-slate-900 mb-1.5">
          Confirm Deletion
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to permanently delete this {target.type.slice(0, -1) || "item"}? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <FaSpinner className="animate-spin text-xs" />
            ) : (
              <FaTrash className="text-xs" />
            )}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
