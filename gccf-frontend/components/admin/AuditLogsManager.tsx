"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FaShieldAlt,
  FaSync,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes,
  FaExclamationTriangle,
  FaUserShield,
} from "react-icons/fa";
import { auditLogsApi, AuditLogItem } from "@/lib/api";

export default function AuditLogsManager() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [actorSearch, setActorSearch] = useState<string>("");

  // Inspect Modal
  const [inspectingLog, setInspectingLog] = useState<AuditLogItem | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditLogsApi.getAll(
        page,
        limit,
        selectedEntity || undefined,
        actorSearch || undefined
      );
      setLogs(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to load audit logs:", err);
      setError(
        err.message ||
          "Failed to load audit logs. Verify you have Super Admin privileges."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedEntity, actorSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && inspectingLog) {
        setInspectingLog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectingLog]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 text-xl shrink-0">
              <FaShieldAlt />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Audit Logs &amp; Governance
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  Super Admin Only
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Immutable, backend-recorded activity history for administrative mutations and security monitoring.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchLogs()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Audit Logs"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by actor username..."
              value={actorSearch}
              onChange={(e) => {
                setActorSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]"
            />
          </div>

          <div className="relative w-full sm:w-60">
            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3d73bd] cursor-pointer"
            >
              <option value="">All Entities</option>
              <option value="news">News</option>
              <option value="events">Events</option>
              <option value="gallery">Gallery</option>
              <option value="memberships">Memberships</option>
              <option value="users">Admin Accounts</option>
              <option value="settings">Settings</option>
              <option value="team">Team</option>
              <option value="popups">Popups</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <FaExclamationTriangle className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FaSync className="animate-spin inline-block mr-2" />
                    Loading audit records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const date = new Date(log.timestamp);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        <span>{formattedDate}</span>{" "}
                        <span className="text-slate-400">{formattedTime}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {log.actorUsername}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            log.actorRole === "super_admin"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded mr-1 font-bold ${
                            log.action.startsWith("POST")
                              ? "bg-emerald-100 text-emerald-800"
                              : log.action.startsWith("PATCH") || log.action.startsWith("PUT")
                              ? "bg-blue-100 text-blue-800"
                              : log.action.startsWith("DELETE")
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {log.action.split(" ")[0]}
                        </span>
                        <span className="text-slate-600">{log.action.split(" ")[1] || ""}</span>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {log.targetEntity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {log.ipAddress || "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectingLog(log)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-[#3d73bd] hover:text-white text-slate-600 rounded-lg font-medium transition-colors cursor-pointer text-[11px]"
                        >
                          <FaEye className="text-xs" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="py-3 px-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-800">{logs.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{total}</span> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-medium">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inspect Modal Dialog */}
      {inspectingLog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-audit-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FaUserShield className="text-[#3d73bd]" />
                <h3 id="inspect-audit-title" className="font-bold text-slate-800 text-sm">
                  Audit Record Details
                </h3>
              </div>
              <button
                onClick={() => setInspectingLog(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">
                    Action
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {inspectingLog.action}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">
                    Actor
                  </span>
                  <span className="font-semibold text-slate-800">
                    {inspectingLog.actorUsername} ({inspectingLog.actorRole})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">
                    Target Entity &amp; ID
                  </span>
                  <span className="text-slate-700">
                    {inspectingLog.targetEntity} {inspectingLog.targetId ? `(#${inspectingLog.targetId})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block">
                    Client IP &amp; Timestamp
                  </span>
                  <span className="text-slate-700 font-mono">
                    {inspectingLog.ipAddress || "Unknown IP"} &bull; {new Date(inspectingLog.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {inspectingLog.userAgent && (
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                    User Agent
                  </span>
                  <p className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl font-mono text-[11px] text-slate-600 break-all">
                    {inspectingLog.userAgent}
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] tracking-wider block mb-1">
                  Changes / Sanitized Payload
                </span>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60">
                  {JSON.stringify(inspectingLog.changes || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectingLog(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
