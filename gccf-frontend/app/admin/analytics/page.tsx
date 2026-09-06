"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaUsers,
  FaNewspaper,
  FaCalendarAlt,
  FaImages,
  FaDownload,
  FaFilter,
  FaSpinner,
  FaChartLine,
  FaChartBar,
  FaClock,
  FaArrowLeft,
  FaGlobe,
  FaUserShield,
} from "react-icons/fa";
import Link from "next/link";
import { exportToExcel } from "@/lib/excelExport";
import {
  analyticsApi,
  DashboardStats,
  MemberGrowthData,
  ActivityItem,
  EventStats,
  NewsActivity,
  MembershipByRange,
} from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

type DatePreset = "7days" | "30days" | "90days" | "custom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>("30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [exporting, setExporting] = useState<string | null>(null);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [memberGrowthData, setMemberGrowthData] = useState<MemberGrowthData[]>([]);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [newsActivity, setNewsActivity] = useState<NewsActivity | null>(null);
  const [membershipStats, setMembershipStats] = useState<MembershipByRange | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const getDateRange = useCallback(() => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (datePreset) {
      case "7days":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        start = customStartDate ? new Date(customStartDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = customEndDate ? new Date(customEndDate) : now;
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, [datePreset, customStartDate, customEndDate]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();

      const [
        stats,
        memberGrowth,
        eventData,
        newsData,
        membershipData,
        activity,
      ] = await Promise.all([
        analyticsApi.getDashboardStats(),
        analyticsApi.getMemberGrowth(datePreset === "7days" ? 7 : datePreset === "30days" ? 30 : 90),
        analyticsApi.getEventStats(startDate, endDate),
        analyticsApi.getNewsActivity(startDate, endDate),
        analyticsApi.getMembershipByRange(startDate, endDate),
        analyticsApi.getRecentActivity(15),
      ]);

      setDashboardStats(stats);
      setMemberGrowthData(memberGrowth);
      setEventStats(eventData);
      setNewsActivity(newsData);
      setMembershipStats(membershipData);
      setRecentActivity(activity);
    } catch (err) {
      setError("Failed to load analytics. Please check if the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getDateRange, datePreset]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = async (type: "members" | "events" | "news") => {
    setExporting(type);
    try {
      const { startDate, endDate } = getDateRange();
      const rawData = await analyticsApi.exportData(type, startDate, endDate);

      let formattedData: Record<string, unknown>[] = [];

      const rawList = Array.isArray(rawData)
        ? (rawData as Record<string, unknown>[])
        : [];

      if (type === "members") {
        formattedData = rawList.map((m) => ({
          "Member ID": String(m.id || "—"),
          "Full Name": String(
            m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim() || "—"
          ),
          "Email Address": String(m.email || "—"),
          "Phone": String(m.phone || "—"),
          "Organization": String(m.organization || "Independent"),
          "Occupation": String(m.occupation || "—"),
          "Status": m.status ? String(m.status).toUpperCase() : "PENDING",
          "Applied Date": m.createdAt
            ? new Date(String(m.createdAt)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
        }));
      } else if (type === "events") {
        formattedData = rawList.map((e) => ({
          "Event ID": String(e.id || "—"),
          "Title": String(e.title || "—"),
          "Status": e.status ? String(e.status).toUpperCase() : "UPCOMING",
          "Date": e.eventDate
            ? new Date(String(e.eventDate)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
          "Location": String(e.location || "Online"),
          "Attendees": Number(e.attendees || 0),
          "Organizer": String(e.organizer || "GCCF"),
          "Description": String(e.description || ""),
        }));
      } else if (type === "news") {
        formattedData = rawList.map((n) => ({
          "Article ID": String(n.id || "—"),
          "Title": String(n.title || "—"),
          "Category": String(n.category || "General"),
          "Author": String(n.author || "GCCF Newsroom"),
          "Status": n.isPublished ? "PUBLISHED" : "DRAFT",
          "Publication Date": n.createdAt
            ? new Date(String(n.createdAt)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—",
          "Excerpt": String(n.excerpt || ""),
        }));
      } else {
        formattedData = rawList;
      }

      const filename = `GCCF-${type.toUpperCase()}-Analytics-${startDate}-to-${endDate}.xlsx`;
      const sheetName = `${type.charAt(0).toUpperCase() + type.slice(1)} Analytics`;
      exportToExcel(formattedData, filename, sheetName);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString();
  };

  const membershipPieData = membershipStats?.byStatus.map((s) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
  })) || [];

  const eventPieData = eventStats
    ? [
        { name: "Upcoming", value: eventStats.upcoming },
        { name: "Completed", value: eventStats.completed },
      ]
    : [];

  const combinedGrowthData = memberGrowthData.map((m) => ({
    date: m.date,
    members: m.members,
    newMembers: m.newMembers,
  }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <FaSpinner className="animate-spin text-3xl text-sky-600" />
        <p className="text-sm font-medium">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen space-y-6">
      {/* Top Brand Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:px-6 flex items-center justify-between shadow-xs">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <img
            src="/gccf logo.png"
            alt="GCCF Logo"
            className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm sm:text-base leading-tight">GCCF</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3d73bd]">Analytics Portal</span>
          </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#3d73bd] text-slate-700 hover:text-[#3d73bd] transition-all shadow-2xs"
          >
            <FaArrowLeft className="text-xs" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#3d73bd] transition-all shadow-2xs"
          >
            <FaGlobe className="text-xs" />
            <span className="hidden sm:inline">Visit Site</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive insights into your community and content
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            onClick={() => handleExport("members")}
            disabled={!!exporting}
          >
            <FaDownload className="text-emerald-600" />
            {exporting === "members" ? " Exporting..." : " Export Members (.xlsx)"}
          </button>
          <button
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            onClick={() => handleExport("events")}
            disabled={!!exporting}
          >
            <FaDownload className="text-emerald-600" />
            {exporting === "events" ? " Exporting..." : " Export Events (.xlsx)"}
          </button>
          <button
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            onClick={() => handleExport("news")}
            disabled={!!exporting}
          >
            <FaDownload className="text-emerald-600" />
            {exporting === "news" ? " Exporting..." : " Export News (.xlsx)"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Date Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-wrap items-center gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
          <FaFilter className="text-slate-400" />
          <span>Date Range:</span>
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as DatePreset)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        {datePreset === "custom" && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-sm"
            />
            <span>to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-sm"
            />
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FaUsers />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {dashboardStats?.totalMembers || 0}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Total Members</p>
            <span
              className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                (dashboardStats?.monthGrowth || 0) >= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {(dashboardStats?.monthGrowth || 0) >= 0 ? "+" : ""}
              {dashboardStats?.monthGrowth || 0}% this month
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {eventStats?.total || 0}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Total Events</p>
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {eventStats?.upcoming || 0} upcoming
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <FaNewspaper />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {newsActivity?.total || 0}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Articles Published</p>
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {newsActivity?.byCategory.length || 0} categories
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <FaImages />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {dashboardStats?.totalGallery || 0}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Gallery Items</p>
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {dashboardStats?.pendingMembers || 0} pending
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Growth Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-base">
            <FaChartLine className="text-sky-600" />
            <h3>Member Growth</h3>
          </div>
          <div>
            {combinedGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [value as number, "Members"]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#0284c7"
                    fill="#0284c7"
                    fillOpacity={0.15}
                    name="Total Members"
                  />
                  <Area
                    type="monotone"
                    dataKey="newMembers"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                    name="New Members"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No membership data available
              </div>
            )}
          </div>
        </div>

        {/* Membership Status Pie */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-base">
            <FaChartBar className="text-sky-600" />
            <h3>Membership Status</h3>
          </div>
          <div>
            {membershipPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={membershipPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {membershipPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No membership data
              </div>
            )}
          </div>
        </div>

        {/* Event Status Donut */}
        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-base">
            <FaChartBar className="text-sky-600" />
            <h3>Event Status</h3>
          </div>
          <div>
            {eventPieData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={eventPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No event data
              </div>
            )}
          </div>
        </div>

        {/* News by Category Horizontal Bar */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-base">
            <FaChartBar className="text-sky-600" />
            <h3>News by Category</h3>
          </div>
          <div>
            {newsActivity?.byCategory && newsActivity.byCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={newsActivity.byCategory}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                No news data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <FaClock className="text-sky-600" />
          <h3>Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                      activity.type === "team"
                        ? "bg-purple-50 text-purple-600"
                        : activity.type === "member"
                        ? "bg-blue-50 text-blue-600"
                        : activity.type === "news"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {activity.type === "team" ? (
                      <FaUserShield />
                    ) : activity.type === "member" ? (
                      <FaUsers />
                    ) : activity.type === "news" ? (
                      <FaNewspaper />
                    ) : (
                      <FaCalendarAlt />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">{activity.action}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-medium shrink-0">
                  {getRelativeTime(activity.timestamp)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
