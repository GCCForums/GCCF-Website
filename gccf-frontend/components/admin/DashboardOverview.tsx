"use client";

import {
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
  FaImages,
  FaArrowUp,
  FaArrowDown,
  FaCheck,
  FaClock,
  FaUserShield,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats, MemberGrowthData, ActivityItem } from "@/lib/api";

interface DashboardOverviewProps {
  stats: {
    totalMembers: number;
    pendingMembers: number;
    activeEvents: number;
    totalNews: number;
    monthGrowth: number;
    weekGrowth: number;
  };
  dashboardStats?: DashboardStats | null;
  newsCount?: number;
  galleryCount?: number;
  membershipsList?: { id?: string; status: string }[];
  growthPeriod: number;
  setGrowthPeriod: (period: number) => void;
  memberGrowthData: MemberGrowthData[];
  recentActivity: ActivityItem[];
}

function getRelativeTime(date: Date | string) {
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
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardOverview({
  stats,
  dashboardStats,
  newsCount = 0,
  galleryCount = 0,
  membershipsList,
  growthPeriod,
  setGrowthPeriod,
  memberGrowthData,
  recentActivity,
}: DashboardOverviewProps) {
  const approvedCount =
    membershipsList && membershipsList.length > 0
      ? membershipsList.filter((m) => m.status === "approved").length
      : dashboardStats?.approvedMembers ??
        Math.max(0, stats.totalMembers - stats.pendingMembers);

  const pendingCount =
    membershipsList && membershipsList.length > 0
      ? membershipsList.filter((m) => m.status === "pending").length
      : dashboardStats?.pendingMembers ?? stats.pendingMembers;

  const declinedCount =
    membershipsList && membershipsList.length > 0
      ? membershipsList.filter((m) => m.status === "declined").length
      : dashboardStats?.declinedMembers ?? 0;

  const totalMemberships = approvedCount + pendingCount + declinedCount;

  const pieData = [
    { name: "Approved", value: approvedCount > 0 ? approvedCount : 1, color: "#10b981" },
    { name: "Pending", value: pendingCount > 0 ? pendingCount : 0, color: "#f59e0b" },
    { name: "Declined", value: declinedCount > 0 ? declinedCount : 0, color: "#f43f5e" },
  ].filter((d) => d.value > 0);

  const statCards = [
    {
      label: "Total Members",
      value: stats.totalMembers.toLocaleString(),
      subText: `${approvedCount} approved`,
      icon: <FaUsers className="text-xl" />,
      accentGradient: "from-blue-600 via-[#3d73bd] to-indigo-500",
      iconGradient: "from-[#1d3c68] to-[#3d73bd]",
      shadowColor: "shadow-blue-500/25",
      badgeText: `${stats.monthGrowth >= 0 ? "+" : ""}${stats.monthGrowth}% month`,
      badgeIcon:
        stats.monthGrowth >= 0 ? (
          <FaArrowUp className="text-[10px]" />
        ) : (
          <FaArrowDown className="text-[10px]" />
        ),
      badgeClasses:
        stats.monthGrowth >= 0
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
          : "bg-rose-50 text-rose-700 border border-rose-200/60",
    },
    {
      label: "Active Events",
      value: stats.activeEvents.toString(),
      subText: "Upcoming & live",
      icon: <FaCalendarAlt className="text-xl" />,
      accentGradient: "from-emerald-500 to-teal-500",
      iconGradient: "from-emerald-600 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
      badgeText: `+${dashboardStats?.newMembersThisWeek || 0} this wk`,
      badgeIcon: <FaCheck className="text-[10px]" />,
      badgeClasses: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    },
    {
      label: "Published Articles",
      value: stats.totalNews.toString(),
      subText: `${newsCount} in newsroom`,
      icon: <FaNewspaper className="text-xl" />,
      accentGradient: "from-amber-500 to-orange-500",
      iconGradient: "from-amber-600 to-orange-500",
      shadowColor: "shadow-amber-500/25",
      badgeText: newsCount > 0 ? `+${newsCount} total` : "0 total",
      badgeIcon: <FaCheck className="text-[10px]" />,
      badgeClasses: "bg-amber-50 text-amber-700 border border-amber-200/60",
    },
    {
      label: "Gallery Items",
      value: galleryCount.toString(),
      subText: `${stats.pendingMembers} pending review`,
      icon: <FaImages className="text-xl" />,
      accentGradient: "from-purple-500 to-indigo-500",
      iconGradient: "from-purple-600 to-indigo-600",
      shadowColor: "shadow-purple-500/25",
      badgeText: `${stats.pendingMembers} pending`,
      badgeIcon: <FaClock className="text-[10px]" />,
      badgeClasses:
        stats.pendingMembers > 0
          ? "bg-purple-50 text-purple-700 border border-purple-200/60"
          : "bg-slate-100 text-slate-600 border border-slate-200/60",
    },
  ];

  return (
    <div className="w-full max-w-[1400px]">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Status
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Welcome back! Monitor real-time community engagement, membership analytics, and system activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-medium text-slate-600 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-2">
            <FaCalendarAlt className="text-slate-400" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="relative group bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Top accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentGradient}`}
            />
            {/* Soft hover glow in corner */}
            <div
              className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${card.accentGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none blur-2xl`}
            />

            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.iconGradient} shadow-md ${card.shadowColor} group-hover:scale-110 transition-transform duration-300`}
              >
                {card.icon}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${card.badgeClasses}`}
              >
                {card.badgeIcon}
                {card.badgeText}
              </span>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600">{card.label}</span>
                <span className="text-xs text-slate-400 font-medium">
                  {card.subText}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Area Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Member Growth</h2>
              <p className="text-xs text-slate-500">
                Community expansion over selected timeline
              </p>
            </div>
            <select
              value={growthPeriod}
              onChange={(e) => setGrowthPeriod(Number(e.target.value))}
              className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3d73bd]/20 focus:border-[#3d73bd] transition-colors cursor-pointer"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          <div className="h-[260px] w-full">
            {memberGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={memberGrowthData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3d73bd" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3d73bd" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.94)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "8px 12px",
                    }}
                    itemStyle={{ color: "#93c5fd", fontWeight: 600 }}
                    labelStyle={{ color: "#e2e8f0", marginBottom: "4px", fontWeight: 500 }}
                    formatter={(value) => [value as number, "Total Members"]}
                    labelFormatter={(label) =>
                      new Date(label as string).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#3d73bd"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#growthGradient)"
                    dot={{ fill: "#3d73bd", stroke: "#ffffff", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 6, fill: "#1d3c68", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No membership data available for this range
              </div>
            )}
          </div>
        </div>

        {/* Membership Status Donut Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <h2 className="text-base font-bold text-slate-900">Membership Status</h2>
              <p className="text-xs text-slate-500">
                Current breakdown of member registration statuses
              </p>
            </div>

            <div className="relative flex items-center justify-center h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.94)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "6px 10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">
                  {totalMemberships}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Apps
                </span>
              </div>
            </div>
          </div>

          {/* Status Breakdown Pills */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="text-center p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-emerald-800">Approved</span>
              </div>
              <div className="text-lg font-bold text-emerald-950">{approvedCount}</div>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-800">Pending</span>
              </div>
              <div className="text-lg font-bold text-amber-950">{pendingCount}</div>
            </div>
            <div className="text-center p-2.5 rounded-xl bg-rose-50/70 border border-rose-100/80">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-800">Declined</span>
              </div>
              <div className="text-lg font-bold text-rose-950">{declinedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Recent Activity Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500">
              Real-time audit log of community and administrative events
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {recentActivity.length} event{recentActivity.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => {
              const isTeam = activity.type === "team";
              const isMember = activity.type === "member";
              const isNews = activity.type === "news";
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0 shadow-xs ${
                        isTeam
                          ? "bg-purple-100 text-purple-700"
                          : isMember
                          ? "bg-blue-100 text-blue-700"
                          : isNews
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isTeam ? (
                        <FaUserShield />
                      ) : isMember ? (
                        <FaUsers />
                      ) : isNews ? (
                        <FaNewspaper />
                      ) : (
                        <FaCalendarAlt />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {activity.title}
                        <span className="font-normal text-slate-500 ml-2">
                          — {activity.action}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 shrink-0 ml-4">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center text-sm text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              No recent activity recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
