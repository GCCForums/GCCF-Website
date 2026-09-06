"use client";

import React, { useState } from "react";
import { FaUser, FaChartBar, FaDownload, FaSave, FaCheckCircle, FaLock } from "react-icons/fa";
import { settingsApi } from "@/lib/api";
import { exportToExcel } from "@/lib/excelExport";
import { AdminProfile, AnalyticsSettings } from "./types";

interface SettingsManagerProps {
  adminProfile: AdminProfile;
  setAdminProfile: React.Dispatch<React.SetStateAction<AdminProfile>>;
  analyticsSettings: AnalyticsSettings;
  setAnalyticsSettings: React.Dispatch<React.SetStateAction<AnalyticsSettings>>;
  membersCount: number;
  newsCount: number;
  eventsCount: number;
  galleryCount: number;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  adminProfile,
  setAdminProfile,
  analyticsSettings,
  setAnalyticsSettings,
  membersCount,
  newsCount,
  eventsCount,
  galleryCount,
}) => {
  const [settingsSection, setSettingsSection] = useState<"account" | "analytics">(
    "account"
  );
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const showSaveSuccess = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveAccountSettings = async () => {
    try {
      await settingsApi.updateAccountSettings(adminProfile);

      if (passwordForm.current || passwordForm.new || passwordForm.confirm) {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
          alert(
            "Please fill in all password fields (Current, New, Confirm) to change your password."
          );
          return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
          alert("New passwords do not match!");
          return;
        }
        const res = await settingsApi.changePassword(
          passwordForm.current,
          passwordForm.new
        );
        setPasswordForm({ current: "", new: "", confirm: "" });
        alert(res?.message || "Password changed successfully!");
      }

      showSaveSuccess();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to save account settings";
      alert(errorMsg || "Failed to save account settings");
    }
  };

  const handleSaveAnalyticsSettings = async () => {
    try {
      await settingsApi.updateAnalyticsSettings(analyticsSettings);
      showSaveSuccess();
    } catch {
      alert("Failed to save analytics settings");
    }
  };

  const handleExportAnalytics = (format: string) => {
    if (format === "xlsx") {
      const exportData = [
        { Metric: "Total Memberships", Value: membersCount },
        { Metric: "Published News", Value: newsCount },
        { Metric: "Total Events", Value: eventsCount },
        { Metric: "Gallery Media Items", Value: galleryCount },
        { Metric: "Generated Date", Value: new Date().toLocaleDateString() },
      ];
      exportToExcel(exportData, "GCCF_Community_Metrics", "Metrics");
      return;
    }
    const csvContent = `Metric,Value\nMembers,${membersCount}\nNews,${newsCount}\nEvents,${eventsCount}\nGallery,${galleryCount}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_export.${format}`;
    a.click();
  };

  return (
    <div className="w-full max-w-[1000px]">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
          System Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage administrator account credentials, telemetry preferences, and report exports
        </p>
      </div>

      {/* Success Banner */}
      {settingsSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2.5 text-sm font-semibold shadow-xs animate-fadeIn">
          <FaCheckCircle className="text-emerald-500 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Segmented Tab Navigation */}
      <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl mb-8 border border-slate-200/60 shadow-inner">
        <button
          onClick={() => setSettingsSection("account")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            settingsSection === "account"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FaUser className="text-xs" />
          <span>Account Credentials</span>
        </button>
        <button
          onClick={() => setSettingsSection("analytics")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            settingsSection === "analytics"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FaChartBar className="text-xs" />
          <span>Analytics & Export</span>
        </button>
      </div>

      {/* Account Settings Tab */}
      {settingsSection === "account" && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Profile Information
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Display credentials associated with this administrator seat
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Display Name
                </label>
                <input
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) =>
                    setAdminProfile({ ...adminProfile, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                />
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <FaLock className="text-[#3d73bd] text-xs" />
              <h3 className="text-base font-bold text-slate-900">
                Change Password
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Update password credentials to keep your administrator portal secured
            </p>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.current}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwordForm.new}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, new: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirm}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveAccountSettings}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <FaSave />
            <span>Save Account Changes</span>
          </button>
        </div>
      )}

      {/* Analytics & Export Tab */}
      {settingsSection === "analytics" && (
        <div className="space-y-6">
          {/* Real-time Telemetry Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Real-Time Updates
                </h3>
                <p className="text-xs text-slate-500">
                  Automatically synchronize community metric trends in the background
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsSettings.realTimeUpdates}
                  onChange={(e) =>
                    setAnalyticsSettings({
                      ...analyticsSettings,
                      realTimeUpdates: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3d73bd]"></div>
              </label>
            </div>
          </div>

          {/* Date Range Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Default Reporting Window
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Preferred default span for time-series charts on the overview dashboard
            </p>

            <select
              value={analyticsSettings.defaultDateRange}
              onChange={(e) =>
                setAnalyticsSettings({
                  ...analyticsSettings,
                  defaultDateRange: e.target.value,
                })
              }
              className="w-full max-w-xs text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="14">Last 14 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>

          {/* Export Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Export Community Metrics
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Download live aggregate counts for members ({membersCount}), articles ({newsCount}), events ({eventsCount}), and gallery ({galleryCount})
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExportAnalytics("csv")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <FaDownload className="text-slate-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExportAnalytics("xlsx")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <FaDownload className="text-slate-400" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveAnalyticsSettings}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#1d3c68] to-[#3d73bd] hover:from-[#162f52] hover:to-[#315ea0] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <FaSave />
            <span>Save Analytics Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};
