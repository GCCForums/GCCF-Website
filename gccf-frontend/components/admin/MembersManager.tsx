"use client";

import React, { useState, useEffect } from "react";
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
  FaEye,
  FaTimes,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCommentAlt,
  FaCalendarAlt,
  FaSlidersH,
  FaReceipt,
  FaDownload,
  FaPlus,
  FaFilePdf,
  FaIdCard,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Membership, MembershipSettings } from "@/types/membership";
import { DeleteTarget } from "./types";
import { membershipSettingsApi, membershipsApi } from "@/lib/api";
import { hasPermission, isSuperAdmin } from "@/lib/auth";

interface MembersManagerProps {
  membershipsList: Membership[];
  loading: boolean;
  onStatusChange: (id: string, status: "approved" | "declined" | "pending") => Promise<void>;
  onSetDeleteTarget: (target: DeleteTarget) => void;
}

const DEFAULT_MEMBERSHIP_SETTINGS: MembershipSettings = {
  badge: "Join the Movement",
  title: "Become a Member",
  subtitle:
    "Join the GCCF global community and stay connected with our events, research, and cybersecurity initiatives.",
  formTitle: "Membership Application",
  formDescription:
    "Fill out the form below to apply for GCCF membership. Our team will review your application.",
  membershipTypes: [
    "Individual Member",
    "Student Member",
    "Corporate Member",
    "Institutional Member",
    "Lifetime Member",
  ],
  pricingText: "",
  paymentInstructions:
    "Please complete your membership payment and attach your payment receipt, slip, or screenshot below.",
};

export const MembersManager: React.FC<MembersManagerProps> = ({
  membershipsList,
  loading,
  onStatusChange,
  onSetDeleteTarget,
}) => {
  const [mounted, setMounted] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState<Membership | null>(null);

  // Fullscreen Receipt Preview Modal
  const [selectedReceipt, setSelectedReceipt] = useState<{
    url: string;
    memberName: string;
  } | null>(null);

  // Dynamic Form Customization State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formSettings, setFormSettings] = useState<MembershipSettings>(
    DEFAULT_MEMBERSHIP_SETTINGS
  );
  const [newTierInput, setNewTierInput] = useState("");

  // Email Diagnostics State
  const [testingEmail, setTestingEmail] = useState(false);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
  const [emailStatusModal, setEmailStatusModal] = useState<{
    open: boolean;
    success?: boolean;
    provider?: string;
    message?: string;
  } | null>(null);

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const res = await membershipsApi.testSmtp();
      setEmailStatusModal({
        open: true,
        success: res.success,
        provider: (res as any).provider || (res.success ? "Active" : "Unavailable"),
        message: res.message,
      });
    } catch (err: any) {
      setEmailStatusModal({
        open: true,
        success: false,
        provider: "Error",
        message: err.message || "Failed to contact email diagnostics endpoint.",
      });
    } finally {
      setTestingEmail(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    membershipSettingsApi
      .getSettings()
      .then((data) => {
        if (data) {
          setFormSettings((prev) => ({
            ...prev,
            ...data,
            membershipTypes:
              data.membershipTypes && data.membershipTypes.length > 0
                ? data.membershipTypes
                : prev.membershipTypes,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load membership settings:", err);
      });
  }, []);

  const canCustomizeForm = mounted
    ? isSuperAdmin() || hasPermission("members")
    : false;

  const pendingCount = membershipsList.filter((m) => m.status === "pending").length;
  const approvedCount = membershipsList.filter((m) => m.status === "approved").length;
  const declinedCount = membershipsList.filter((m) => m.status === "declined").length;

  const filteredMemberships = membershipsList.filter((m) => {
    const matchesSearch =
      m.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (m.membershipType &&
        m.membershipType.toLowerCase().includes(searchFilter.toLowerCase()));
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

  const handleModalStatusChange = async (
    status: "approved" | "declined" | "pending"
  ) => {
    if (!selectedMember) return;
    await onStatusChange(selectedMember.id, status);
    setSelectedMember((prev) => (prev ? { ...prev, status } : null));
  };

  const handleDownloadReceipt = (dataUrl: string, applicantName: string) => {
    const isPdf = dataUrl.startsWith("data:application/pdf");
    const ext = isPdf ? "pdf" : "png";
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `payment-receipt-${applicantName
      .toLowerCase()
      .replace(/\s+/g, "-")}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTier = () => {
    const trimmed = newTierInput.trim();
    if (!trimmed) return;
    if (formSettings.membershipTypes.includes(trimmed)) return;
    setFormSettings((prev) => ({
      ...prev,
      membershipTypes: [...prev.membershipTypes, trimmed],
    }));
    setNewTierInput("");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsNotice(null);
    try {
      const updated = await membershipSettingsApi.updateSettings(formSettings);
      setFormSettings(updated);
      setSettingsNotice({
        type: "success",
        message: "Membership form settings updated successfully!",
      });
      setTimeout(() => {
        setIsSettingsModalOpen(false);
        setSettingsNotice(null);
      }, 1400);
    } catch (err: any) {
      console.error("Failed to update membership settings:", err);
      setSettingsNotice({
        type: "error",
        message: err.message || "Failed to update form settings.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Membership Management
          </h1>
          <p className="text-sm text-slate-500">
            Review member applications, verify payment attachments, and configure registration tiers
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleTestEmail}
            disabled={testingEmail}
            title="Check live email dispatch status"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {testingEmail ? (
              <FaSpinner className="text-xs animate-spin text-[#3d73bd]" />
            ) : (
              <FaEnvelope className="text-xs text-[#3d73bd]" />
            )}
            <span>{testingEmail ? "Testing Email..." : "Test Email Server"}</span>
          </button>

          {canCustomizeForm && (
            <button
              onClick={() => {
                setSettingsNotice(null);
                setIsSettingsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162e50] hover:to-[#2b5894] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <FaSlidersH className="text-xs" />
              <span>Customize Application Form</span>
            </button>
          )}
        </div>
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
              placeholder="Search by name, email, or tier..."
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
                <th className="py-3.5 px-5">Tier</th>
                <th className="py-3.5 px-5">Payment Receipt</th>
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
                  {/* Applicant Name */}
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

                  {/* Tier Badge */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#1d3c68] border border-blue-200/70">
                      <FaIdCard className="text-[11px] text-[#3d73bd]" />
                      <span>{member.membershipType || "Individual Member"}</span>
                    </span>
                  </td>

                  {/* Payment Receipt */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    {member.paymentAttachment ? (
                      <button
                        onClick={() =>
                          setSelectedReceipt({
                            url: member.paymentAttachment!,
                            memberName: `${member.firstName} ${member.lastName}`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1d3c68] bg-slate-100 hover:bg-blue-50 hover:text-[#3d73bd] border border-slate-200/80 transition-colors cursor-pointer group/rcpt"
                        title="View attached payment receipt"
                      >
                        {member.paymentAttachment.startsWith(
                          "data:application/pdf"
                        ) ? (
                          <FaFilePdf className="text-rose-500 text-xs" />
                        ) : (
                          <FaReceipt className="text-[#3d73bd] text-xs" />
                        )}
                        <span>View Slip</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">None</span>
                    )}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#3d73bd] bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                    >
                      <FaEnvelope className="text-[10px] text-slate-400" />
                      <span>{member.email}</span>
                    </a>
                  </td>

                  {/* Phone */}
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

                  {/* Organization */}
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

                  {/* Status */}
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

                  {/* Date */}
                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap text-xs">
                    {new Date(member.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* View Details Button */}
                      <button
                        title="View Full Application"
                        onClick={() => setSelectedMember(member)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#3d73bd] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <FaEye className="text-xs" />
                      </button>

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

                      {member.status === "approved" && (
                        <button
                          title="Resend Approval Email"
                          onClick={async () => {
                            setResendingEmailId(member.id);
                            try {
                              const res = await membershipsApi.resendApproval(member.id);
                              alert(res?.message || `Approval email resent successfully to ${member.email}!`);
                            } catch (e: any) {
                              alert(`Failed to resend approval email: ${e.message}\n\nTip: On Render Free Tier, SMTP ports 465/587 are blocked. Set RESEND_API_KEY in Render dashboard to send via HTTPS.`);
                            } finally {
                              setResendingEmailId(null);
                            }
                          }}
                          disabled={resendingEmailId === member.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1d3c68] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {resendingEmailId === member.id ? (
                            <FaSpinner className="text-[10px] animate-spin text-[#3d73bd]" />
                          ) : (
                            <FaEnvelope className="text-[10px]" />
                          )}
                          <span>{resendingEmailId === member.id ? "Sending..." : "Resend Email"}</span>
                        </button>
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
                    colSpan={9}
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

      {/* Application Detail Inspection Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] flex items-center justify-center text-white shadow-sm">
                  <FaUsers className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Application Review
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed registration profile, tier selection & payment verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedMember.occupation || "Community Applicant"}
                  </p>
                </div>
                <span
                  className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    selectedMember.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : selectedMember.status === "pending"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedMember.status === "approved"
                        ? "bg-emerald-500"
                        : selectedMember.status === "pending"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                  {selectedMember.status}
                </span>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#3d73bd] uppercase tracking-wider mb-1">
                    <FaIdCard className="text-[#3d73bd]" /> Membership Tier
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedMember.membershipType || "Individual Member"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaEnvelope className="text-[#3d73bd]" /> Email Address
                  </div>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="text-sm font-medium text-slate-800 hover:text-[#3d73bd] break-all"
                  >
                    {selectedMember.email}
                  </a>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaPhone className="text-[#3d73bd]" /> Phone Number
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {selectedMember.phone || "Not provided"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaBuilding className="text-[#3d73bd]" /> Organization / Affiliation
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {selectedMember.organization || "Independent"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaBriefcase className="text-[#3d73bd]" /> Profession / Occupation
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {selectedMember.occupation || "Not specified"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaCalendarAlt className="text-[#3d73bd]" /> Submission Date
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {new Date(selectedMember.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-white sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    <FaMapMarkerAlt className="text-[#3d73bd]" /> Address & Location
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {[
                      selectedMember.address,
                      selectedMember.city,
                      selectedMember.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address provided"}
                  </div>
                </div>
              </div>

              {/* Payment Attachment Review Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <FaMoneyCheckAlt className="text-[#3d73bd] text-sm" /> Proof of Payment Receipt
                  </div>
                  {selectedMember.paymentAttachment && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadReceipt(
                            selectedMember.paymentAttachment!,
                            `${selectedMember.firstName} ${selectedMember.lastName}`
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <FaDownload className="text-[10px]" />
                        <span>Download</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedReceipt({
                            url: selectedMember.paymentAttachment!,
                            memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#3d73bd] hover:bg-[#2b5894] px-2.5 py-1 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <FaEye className="text-[10px]" />
                        <span>Fullscreen</span>
                      </button>
                    </div>
                  )}
                </div>

                {selectedMember.paymentAttachment ? (
                  selectedMember.paymentAttachment.startsWith(
                    "data:application/pdf"
                  ) ? (
                    <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-200/80">
                      <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
                        <FaFilePdf />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          Payment Receipt PDF Document
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Uploaded with application
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white max-h-56 flex items-center justify-center">
                      <img
                        src={selectedMember.paymentAttachment}
                        alt="Payment Receipt Slip"
                        className="max-h-56 w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                        onClick={() =>
                          setSelectedReceipt({
                            url: selectedMember.paymentAttachment!,
                            memberName: `${selectedMember.firstName} ${selectedMember.lastName}`,
                          })
                        }
                      />
                    </div>
                  )
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400 italic">
                      No payment receipt was attached to this application.
                    </p>
                  </div>
                )}
              </div>

              {/* Motivation Message */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <FaCommentAlt className="text-[#3d73bd]" /> Motivation / Message
                </div>
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMember.message || (
                    <span className="italic text-slate-400">
                      No motivation message was provided with this application.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedMember.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleModalStatusChange("approved")}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FaCheck />
                      <span>Approve Member</span>
                    </button>
                    <button
                      onClick={() => handleModalStatusChange("declined")}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FaBan />
                      <span>Decline</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    {selectedMember.status === "approved" && (
                      <button
                        onClick={async () => {
                          try {
                            await membershipsApi.resendApproval(selectedMember.id);
                            alert(`Approval email resent successfully to ${selectedMember.email}!`);
                          } catch (e: any) {
                            alert(`Failed to resend email: ${e.message}`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#3d73bd] hover:bg-[#2b5894] shadow-xs transition-all cursor-pointer"
                      >
                        <FaEnvelope />
                        <span>Resend Approval Email</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleModalStatusChange("pending")}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <FaRedo />
                      <span>Reset to Pending</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Payment Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3d73bd] flex items-center justify-center">
                  <FaReceipt />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Payment Receipt: {selectedReceipt.memberName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Attached verification slip for membership registration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownloadReceipt(
                      selectedReceipt.url,
                      selectedReceipt.memberName
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-100/60 overflow-auto flex-1 flex items-center justify-center min-h-[320px]">
              {selectedReceipt.url.startsWith("data:application/pdf") ? (
                <iframe
                  src={selectedReceipt.url}
                  title="PDF Receipt Document"
                  className="w-full h-[65vh] rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <img
                  src={selectedReceipt.url}
                  alt={`Receipt - ${selectedReceipt.memberName}`}
                  className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200 bg-white"
                />
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ensure payment amount matches designated membership tier rate.
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Form Customization Modal */}
      {isSettingsModalOpen && canCustomizeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d3c68] to-[#3d73bd] flex items-center justify-center text-white shadow-sm">
                  <FaSlidersH className="text-base" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Customize Membership Form
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure public form titles, tier options, and payment instructions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Body / Form */}
            <form
              onSubmit={handleSaveSettings}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {settingsNotice && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      settingsNotice.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {settingsNotice.type === "success" ? (
                      <FaCheckCircle className="text-emerald-600 text-sm shrink-0" />
                    ) : (
                      <FaExclamationCircle className="text-rose-600 text-sm shrink-0" />
                    )}
                    <span>{settingsNotice.message}</span>
                  </div>
                )}

                {/* Section 1: Hero Banner Settings */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Page Header & Titles
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Badge Text
                      </label>
                      <input
                        type="text"
                        value={formSettings.badge}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            badge: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                        placeholder="e.g. Join the Movement"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Main Page Title
                      </label>
                      <input
                        type="text"
                        value={formSettings.title}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                        placeholder="e.g. Become a Member"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Header Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={formSettings.subtitle}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                      placeholder="Subtitle explaining the benefits of joining..."
                    />
                  </div>
                </div>

                {/* Section 2: Form Card Settings */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Application Form Header
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Form Box Title
                    </label>
                    <input
                      type="text"
                      value={formSettings.formTitle}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          formTitle: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                      placeholder="e.g. Membership Application"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Form Box Description
                    </label>
                    <textarea
                      rows={2}
                      value={formSettings.formDescription}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          formDescription: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                      placeholder="Instructions for applicants..."
                    />
                  </div>
                </div>

                {/* Section 3: Membership Tiers */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Selectable Membership Tiers
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        setFormSettings({
                          ...formSettings,
                          membershipTypes:
                            DEFAULT_MEMBERSHIP_SETTINGS.membershipTypes,
                        })
                      }
                      className="text-[11px] text-[#3d73bd] hover:underline cursor-pointer"
                    >
                      Reset to defaults
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {formSettings.membershipTypes.map((tier, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl transition-colors"
                      >
                        <span>{tier}</span>
                        {formSettings.membershipTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormSettings({
                                ...formSettings,
                                membershipTypes:
                                  formSettings.membershipTypes.filter(
                                    (_, i) => i !== idx
                                  ),
                              })
                            }
                            className="text-slate-400 hover:text-rose-500 cursor-pointer"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTierInput}
                      onChange={(e) => setNewTierInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTier();
                        }
                      }}
                      placeholder="Enter new tier name (e.g. Honorary Fellow)..."
                      className="flex-1 px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTier}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      <FaPlus className="text-[10px]" />
                      <span>Add Tier</span>
                    </button>
                  </div>
                </div>

                {/* Section 3.5: Pricing Summary / Badge Text */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pricing Summary / Badge Text
                  </h4>
                  <p className="text-xs text-slate-500">
                    Shown prominently beside the Membership Tier selection on the public application form.
                  </p>
                  <input
                    type="text"
                    value={formSettings.pricingText || ""}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        pricingText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                    placeholder="e.g. Individual: $50/yr • Student: $25/yr • Corporate: $250/yr"
                  />
                </div>

                {/* Section 4: Payment Instructions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Payment & Bank Details Instructions
                  </h4>
                  <p className="text-xs text-slate-500">
                    This will be displayed directly above the payment slip upload
                    box on the public registration page.
                  </p>
                  <textarea
                    rows={3}
                    value={formSettings.paymentInstructions}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        paymentInstructions: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                    placeholder="e.g. Bank: Standard Chartered Bank Nepal, Account No: 1234567890, Account Name: GCCF..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3d73bd] hover:bg-[#2b5894] shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-xs" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Server Diagnostics Modal */}
      {emailStatusModal && emailStatusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    emailStatusModal.success
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-rose-50 text-rose-600 border border-rose-200"
                  }`}
                >
                  {emailStatusModal.success ? (
                    <FaCheckCircle className="text-base" />
                  ) : (
                    <FaExclamationCircle className="text-base" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Email Server Diagnostics
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Provider: {emailStatusModal.provider || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmailStatusModal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>

            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                emailStatusModal.success
                  ? "bg-emerald-50/70 border-emerald-200/80 text-emerald-900"
                  : "bg-rose-50/70 border-rose-200/80 text-rose-900"
              }`}
            >
              <div className="font-semibold mb-1">
                {emailStatusModal.success
                  ? "Email Service Operational"
                  : "Email Delivery Blocked or Failed"}
              </div>
              <p className="text-xs opacity-90 break-words">
                {emailStatusModal.message}
              </p>
            </div>

            {!emailStatusModal.success && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex flex-col gap-1.5">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  How to Fix on Render:
                </div>
                <p className="text-[11px] leading-normal text-slate-500">
                  Render Free Tier blocks ports 25, 465, and 587. To send emails reliably without port blocks:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Get a free API key from <strong>resend.com</strong> (3,000 free emails/mo).</li>
                  <li>In Render Dashboard &rarr; Environment, add <code>RESEND_API_KEY</code>.</li>
                  <li>Emails will dispatch instantly over HTTPS port 443!</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setEmailStatusModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
