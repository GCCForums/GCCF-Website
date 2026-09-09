"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  logoutAdmin,
  isSuperAdmin,
  getAdminRole,
  getAdminName,
  syncCurrentUserProfile,
  hasPermission,
} from "@/lib/auth";
import {
  newsApi,
  eventsApi,
  galleryApi,
  membershipsApi,
  analyticsApi,
  settingsApi,
  teamApi,
  DashboardStats,
  MemberGrowthData,
  ActivityItem,
} from "@/lib/api";
import type { News, CreateNewsDto, UpdateNewsDto } from "@/types/news";
import type { Event, CreateEventDto, UpdateEventDto } from "@/types/events";
import type { Gallery, CreateGalleryDto, UpdateGalleryDto } from "@/types/gallery";
import type { Membership } from "@/types/membership";

import {
  AdminTab,
  NewsFormData,
  EventFormData,
  GalleryFormData,
  DeleteTarget,
  generateSlug,
  initialNewsForm,
  initialEventForm,
  initialGalleryForm,
  AdminProfile,
  AnalyticsSettings,
  TeamMember,
  TeamFormData,
  initialTeamForm,
  Testimonial,
  TestimonialFormData,
  initialTestimonialForm,
  defaultInitialTestimonials,
} from "../admin/types";

import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import DashboardOverview from "../admin/DashboardOverview";
import NewsManager from "../admin/NewsManager";
import EventsManager from "../admin/EventsManager";
import { GalleryManager } from "../admin/GalleryManager";
import { MembersManager } from "../admin/MembersManager";
import { SettingsManager } from "../admin/SettingsManager";
import TeamManager from "../admin/TeamManager";
import PopupManager from "../admin/PopupManager";
import TestimonialsManager from "../admin/TestimonialsManager";
import AdminUsersManager from "../admin/AdminUsersManager";
import HomepageContentManager from "../admin/HomepageContentManager";
import { NewsModal } from "../admin/NewsModal";
import { EventModal } from "../admin/EventModal";
import { GalleryModal } from "../admin/GalleryModal";
import TeamModal from "../admin/TeamModal";
import TestimonialModal from "../admin/TestimonialModal";
import { DeleteConfirmModal } from "../admin/DeleteConfirmModal";

const defaultInitialTeams: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Founder & CEO",
    affiliatedPart: "Executive Leadership / Global Chapter",
    image: "",
    email: "sarah@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "2",
    name: "David Chen",
    title: "Director of Operations",
    affiliatedPart: "Operations & Partnerships",
    image: "",
    email: "david@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "3",
    name: "Maya Patel",
    title: "Program Manager",
    affiliatedPart: "Community Initiatives & Standards",
    image: "",
    email: "maya@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "4",
    name: "James Wilson",
    title: "Communications Lead",
    affiliatedPart: "Global Outreach & Public Relations",
    image: "",
    email: "james@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "5",
    name: "Aisha Rahman",
    title: "Community Outreach",
    affiliatedPart: "Regional Chapters & Engagement",
    image: "",
    email: "aisha@gccf.org",
    linkedin: "https://linkedin.com",
  },
  {
    id: "6",
    name: "Michael Torres",
    title: "Finance Director",
    affiliatedPart: "Finance & Resource Governance",
    image: "",
    email: "michael@gccf.org",
    linkedin: "https://linkedin.com",
  },
];

const ADMIN_ACTIVITIES_KEY = "gccf_admin_activities";

const getStoredActivities = (): ActivityItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_ACTIVITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read admin activities", err);
    return [];
  }
};

const recordAdminActivity = (item: ActivityItem) => {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredActivities();
    const updated = [item, ...current].slice(0, 50);
    localStorage.setItem(ADMIN_ACTIVITIES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save admin activity", err);
  }
};

export default function AdminComponent() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newsList, setNewsList] = useState<News[]>([]);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [galleryList, setGalleryList] = useState<Gallery[]>([]);
  const [membershipsList, setMembershipsList] = useState<Membership[]>([]);
  const [teamList, setTeamList] = useState<TeamMember[]>(defaultInitialTeams);

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [memberGrowthData, setMemberGrowthData] = useState<MemberGrowthData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [growthPeriod, setGrowthPeriod] = useState(7);

  // Settings State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: "Admin User",
    email: "admin@gccf.org",
    role: "Admin",
  });

  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>({
    realTimeUpdates: true,
    defaultDateRange: "30",
    displayedMetrics: ["members", "news", "events", "gallery"],
    exportFormat: "csv",
  });

  // Modal State
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newsForm, setNewsForm] = useState<NewsFormData>(initialNewsForm);

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>(initialEventForm);

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [galleryForm, setGalleryForm] = useState<GalleryFormData>(initialGalleryForm);

  // Team Modal State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<TeamFormData>(initialTeamForm);

  // Testimonials State
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(defaultInitialTestimonials);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>(initialTestimonialForm);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<DeleteTarget | null>(null);

  // Load stored teams and backfill recent activities for custom team members
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gccf_team_members");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTeamList(parsed);

            // Backfill any custom team members not yet in admin activities
            const currentActivities = getStoredActivities();
            const newActivities: ActivityItem[] = [];
            parsed.forEach((member: TeamMember) => {
              const isDefault = defaultInitialTeams.some(
                (d) => d.name.toLowerCase() === member.name.toLowerCase()
              );
              const alreadyLogged = currentActivities.some(
                (a) =>
                  a.title.toLowerCase() === member.name.toLowerCase() &&
                  a.type === "team"
              );
              if (!isDefault && !alreadyLogged) {
                const numId = Number(member.id);
                const ts =
                  !isNaN(numId) && numId > 1000000000
                    ? new Date(numId).toISOString()
                    : new Date().toISOString();
                newActivities.push({
                  type: "team",
                  action: "new team member added",
                  title: member.name,
                  timestamp: ts,
                });
              }
            });

            if (newActivities.length > 0) {
              const updatedActivities = [...newActivities, ...currentActivities];
              localStorage.setItem(
                ADMIN_ACTIVITIES_KEY,
                JSON.stringify(updatedActivities)
              );
            }
          }
        } else {
          localStorage.setItem(
            "gccf_team_members",
            JSON.stringify(defaultInitialTeams)
          );
        }
      } catch (err) {
        console.error("Failed to read team members", err);
      }
    }
  }, []);

  // Load stored testimonials
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gccf_testimonials");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTestimonialsList(parsed);
          }
        } else {
          localStorage.setItem("gccf_testimonials", JSON.stringify(defaultInitialTestimonials));
        }
      } catch (err) {
        console.error("Failed to read testimonials", err);
      }
    }
  }, []);

  // Load Auth Profile and Settings
  useEffect(() => {
    const initAuthAndSettings = async () => {
      // Sync user profile from backend
      const user = await syncCurrentUserProfile();
      const currentRole = user?.role || getAdminRole();
      const currentName = user?.username || getAdminName();

      setAdminProfile((prev) => ({
        ...prev,
        name: currentName,
        role: currentRole === "super_admin" ? "Super Admin" : "Admin",
      }));

      // If activeTab is not permitted, select the first permitted tab
      if (currentRole !== "super_admin") {
        const perms = user?.permissions || [];
        const isPermitted = (tab: AdminTab) => {
          if (perms.includes("all")) return true;
          return perms.includes(tab);
        };
        if (!isPermitted("dashboard")) {
          const tabOrder: AdminTab[] = [
            "homepage",
            "news",
            "events",
            "gallery",
            "members",
            "teams",
            "popup",
            "testimonials",
            "settings",
          ];
          const fallback = tabOrder.find((t) => isPermitted(t));
          if (fallback) {
            setActiveTab(fallback);
          }
        }
      }

      try {
        const settings = await settingsApi.getSettings();
        if (settings) {
          if (settings.accountSettings) {
            setAdminProfile((prev) => ({
              ...prev,
              name: settings.accountSettings.name || prev.name,
              email: settings.accountSettings.email || prev.email,
            }));
          }
          if (settings.analyticsSettings) {
            setAnalyticsSettings({
              realTimeUpdates: settings.analyticsSettings.realTimeUpdates ?? true,
              defaultDateRange: settings.analyticsSettings.defaultDateRange || "30",
              displayedMetrics: settings.analyticsSettings.displayedMetrics || [
                "members",
                "news",
                "events",
                "gallery",
              ],
              exportFormat: settings.analyticsSettings.exportFormat || "csv",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    initAuthAndSettings();
  }, []);

  // Fetch Dashboard and CMS Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [news, events, gallery, memberships, stats, growth, activity, team] =
        await Promise.all([
          newsApi.getAll(),
          eventsApi.getAll(),
          galleryApi.getAll(),
          membershipsApi.getAll(),
          analyticsApi.getDashboardStats(),
          analyticsApi.getMemberGrowth(growthPeriod),
          analyticsApi.getRecentActivity(12),
          teamApi.getAll().catch(() => []),
        ]);
      setNewsList(news);
      setEventsList(events);
      setGalleryList(gallery);
      setMembershipsList(memberships);
      if (Array.isArray(team) && team.length > 0) {
        setTeamList(team);
      }
      setDashboardStats(stats);
      setMemberGrowthData(growth);

      // Merge backend activity and local admin activities
      const localActivities = getStoredActivities();
      const combined = [...localActivities, ...activity];
      const seen = new Set<string>();
      const mergedActivities: ActivityItem[] = [];

      for (const item of combined) {
        const tsTime = new Date(item.timestamp).getTime();
        // Round to 1 minute to avoid duplicates across local and backend
        const key = `${item.type}_${item.action}_${item.title}_${Math.floor(tsTime / 60000)}`;
        if (!seen.has(key)) {
          seen.add(key);
          mergedActivities.push({
            ...item,
            timestamp: new Date(item.timestamp),
          });
        }
      }

      mergedActivities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setRecentActivity(mergedActivities.slice(0, 10));
    } catch (err) {
      setError("Failed to load data. Please check if the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [growthPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logout Handler
  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  // News Handlers
  const openAddNews = () => {
    setEditingNews(null);
    setNewsForm(initialNewsForm);
    setShowNewsModal(true);
  };

  const openEditNews = (news: News) => {
    setEditingNews(news);
    setNewsForm({
      title: news.title,
      excerpt: news.excerpt,
      content: news.content,
      author: news.author || "",
      publishedDate: news.publishedDate.split("T")[0],
      category: news.category || "",
      slug: news.slug,
      featuredImage: news.featuredImage,
      galleryImages: news.galleryImages?.join(", ") || "",
      tags: news.tags?.join(", ") || "",
      source: news.source || "",
      sourceUrl: news.sourceUrl || "",
    });
    setShowNewsModal(true);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto: CreateNewsDto | UpdateNewsDto = {
        title: newsForm.title,
        content: newsForm.content,
        excerpt: newsForm.excerpt,
        publishedDate: newsForm.publishedDate,
        author: newsForm.author || undefined,
        category: newsForm.category || undefined,
        slug: newsForm.slug || generateSlug(newsForm.title),
        featuredImage: newsForm.featuredImage,
        galleryImages: newsForm.galleryImages
          ? newsForm.galleryImages.split(",").map((i) => i.trim()).filter(Boolean)
          : undefined,
        tags: newsForm.tags
          ? newsForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        source: newsForm.source || undefined,
        sourceUrl: newsForm.sourceUrl || undefined,
      };

      if (editingNews) {
        await newsApi.update(editingNews.id, dto as UpdateNewsDto);
      } else {
        await newsApi.create(dto as CreateNewsDto);
      }

      await fetchData();
      setShowNewsModal(false);
      setEditingNews(null);
      setNewsForm(initialNewsForm);
    } catch (err) {
      setError("Failed to save news article");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventForm(initialEventForm);
    setShowEventModal(true);
  };

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      eventDate: event.eventDate.split("T")[0],
      location: event.location,
      slug: event.slug,
      status: event.status,
      mainImage: event.mainImage,
      galleryImages: event.galleryImages?.join(", ") || "",
      registrationUrl: event.registrationUrl || "",
      organizer: event.organizer || "",
      attendees: event.attendees?.toString() || "0",
    });
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto: CreateEventDto | UpdateEventDto = {
        title: eventForm.title,
        description: eventForm.description,
        shortDescription: eventForm.shortDescription,
        eventDate: eventForm.eventDate,
        location: eventForm.location,
        slug: eventForm.slug || generateSlug(eventForm.title),
        status: eventForm.status,
        mainImage: eventForm.mainImage,
        galleryImages: eventForm.galleryImages
          ? eventForm.galleryImages.split(",").map((i) => i.trim()).filter(Boolean)
          : undefined,
        registrationUrl: eventForm.registrationUrl || undefined,
        organizer: eventForm.organizer || undefined,
        attendees: eventForm.attendees
          ? parseInt(eventForm.attendees)
          : undefined,
      };

      if (editingEvent) {
        await eventsApi.update(editingEvent.id, dto as UpdateEventDto);
      } else {
        await eventsApi.create(dto as CreateEventDto);
      }

      await fetchData();
      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm(initialEventForm);
    } catch (err) {
      setError("Failed to save event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gallery Handlers
  const openAddGallery = () => {
    setEditingGallery(null);
    setGalleryForm(initialGalleryForm);
    setShowGalleryModal(true);
  };

  const openEditGallery = (item: Gallery) => {
    setEditingGallery(item);
    setGalleryForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      category: item.category || "",
      event: item.event || "",
      tags: item.tags?.join(", ") || "",
      isVisible: item.isVisible,
      order: item.order.toString(),
    });
    setShowGalleryModal(true);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto: CreateGalleryDto | UpdateGalleryDto = {
        title: galleryForm.title,
        description: galleryForm.description || undefined,
        imageUrl: galleryForm.imageUrl,
        category: galleryForm.category || undefined,
        event: galleryForm.event || undefined,
        tags: galleryForm.tags
          ? galleryForm.tags.split(",").map((t) => t.trim())
          : undefined,
        isVisible: galleryForm.isVisible,
        order: galleryForm.order ? parseInt(galleryForm.order) : undefined,
      };

      if (editingGallery) {
        await galleryApi.update(editingGallery.id, dto as UpdateGalleryDto);
      } else {
        await galleryApi.create(dto as CreateGalleryDto);
      }

      await fetchData();
      setShowGalleryModal(false);
      setEditingGallery(null);
      setGalleryForm(initialGalleryForm);
    } catch (err) {
      setError("Failed to save gallery item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Memberships Handlers
  const handleMembershipStatusChange = async (
    id: string,
    status: "approved" | "declined" | "pending"
  ) => {
    setLoading(true);
    try {
      const targetMember = membershipsList.find((m) => m.id === id);
      await membershipsApi.update(id, { status });
      if (targetMember) {
        recordAdminActivity({
          type: "member",
          action:
            status === "pending"
              ? "application reset to pending"
              : `membership ${status}`,
          title: `${targetMember.firstName} ${targetMember.lastName}`,
          timestamp: new Date().toISOString(),
        });
      }
      await fetchData();
    } catch (err) {
      setError("Failed to update membership status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Team Handlers
  const openAddTeam = () => {
    setEditingTeam(null);
    setTeamForm(initialTeamForm);
    setShowTeamModal(true);
  };

  const openEditTeam = (member: TeamMember) => {
    setEditingTeam(member);
    setTeamForm({
      name: member.name,
      title: member.title || "",
      affiliatedPart: member.affiliatedPart || "",
      image: member.image || "",
      email: member.email || "",
      linkedin: member.linkedin || "",
      order: member.order?.toString() || "0",
    });
    setShowTeamModal(true);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updated: TeamMember[];
      const isEditing = !!editingTeam;
      if (editingTeam) {
        try {
          await teamApi.update(editingTeam.id, {
            ...teamForm,
            order: parseInt(teamForm.order) || 0,
          });
        } catch (e) {
          console.warn("Backend team update failed, falling back to local state", e);
        }
        updated = teamList.map((m) =>
          m.id === editingTeam.id
            ? {
                ...m,
                ...teamForm,
                order: parseInt(teamForm.order) || 0,
              }
            : m
        );
      } else {
        let createdMember: TeamMember | null = null;
        try {
          createdMember = await teamApi.create({
            ...teamForm,
            order: parseInt(teamForm.order) || 0,
          });
        } catch (e) {
          console.warn("Backend team create failed, falling back to local state", e);
        }
        const newMember: TeamMember = createdMember || {
          id: Date.now().toString(),
          ...teamForm,
          order: parseInt(teamForm.order) || 0,
        };
        updated = [...teamList, newMember];
      }

      setTeamList(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("gccf_team_members", JSON.stringify(updated));
      }

      recordAdminActivity({
        type: "team",
        action: isEditing ? "team member updated" : "new team member added",
        title: teamForm.name,
        timestamp: new Date().toISOString(),
      });

      setShowTeamModal(false);
      setEditingTeam(null);
      setTeamForm(initialTeamForm);
      await fetchData();
    } catch (err) {
      setError("Failed to save team member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Testimonials Handlers
  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm(initialTestimonialForm);
    setShowTestimonialModal(true);
  };

  const openEditTestimonial = (item: Testimonial) => {
    setEditingTestimonial(item);
    setTestimonialForm({
      name: item.name,
      role: item.role || "",
      feedback: item.feedback,
      avatarUrl: item.avatarUrl || "",
      rating: item.rating || 5,
    });
    setShowTestimonialModal(true);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let updated: Testimonial[];
      if (editingTestimonial) {
        updated = testimonialsList.map((t) =>
          t.id === editingTestimonial.id
            ? {
                ...t,
                ...testimonialForm,
              }
            : t
        );
      } else {
        const newItem: Testimonial = {
          id: Date.now().toString(),
          ...testimonialForm,
        };
        updated = [...testimonialsList, newItem];
      }

      setTestimonialsList(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("gccf_testimonials", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
      }
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      setTestimonialForm(initialTestimonialForm);
    } catch (err) {
      setError("Failed to save testimonial");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setLoading(true);
    try {
      if (showDeleteConfirm.type === "news") {
        await newsApi.delete(showDeleteConfirm.id);
      } else if (showDeleteConfirm.type === "events") {
        await eventsApi.delete(showDeleteConfirm.id);
      } else if (showDeleteConfirm.type === "gallery") {
        await galleryApi.delete(showDeleteConfirm.id);
      } else if (showDeleteConfirm.type === "memberships") {
        await membershipsApi.delete(showDeleteConfirm.id);
      } else if (showDeleteConfirm.type === "teams") {
        try {
          await teamApi.delete(showDeleteConfirm.id);
        } catch (e) {
          console.warn("Backend team delete failed", e);
        }
        const targetMember = teamList.find((m) => m.id === showDeleteConfirm.id);
        const updated = teamList.filter((m) => m.id !== showDeleteConfirm.id);
        setTeamList(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("gccf_team_members", JSON.stringify(updated));
        }
        if (targetMember) {
          recordAdminActivity({
            type: "team",
            action: "team member removed",
            title: targetMember.name,
            timestamp: new Date().toISOString(),
          });
        }
      } else if (showDeleteConfirm.type === "testimonials") {
        const updated = testimonialsList.filter((t) => t.id !== showDeleteConfirm.id);
        setTestimonialsList(updated);
        if (typeof window !== "undefined") {
          localStorage.setItem("gccf_testimonials", JSON.stringify(updated));
          window.dispatchEvent(new Event("storage"));
        }
      }
      await fetchData();
      setShowDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculatedStats = dashboardStats || {
    totalMembers: membershipsList.length,
    pendingMembers: membershipsList.filter((m) => m.status === "pending").length,
    activeEvents: eventsList.filter((e) => e.status === "upcoming").length,
    totalNews: newsList.length,
    monthGrowth: 0,
    weekGrowth: 0,
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <AdminHeader
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          adminName={adminProfile.name}
          adminRole={adminProfile.role}
        />

        <div className="dashboard-body">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <DashboardOverview
              stats={calculatedStats}
              dashboardStats={dashboardStats}
              newsCount={newsList.length}
              galleryCount={galleryList.length}
              memberGrowthData={memberGrowthData}
              recentActivity={recentActivity}
              membershipsList={membershipsList}
              growthPeriod={growthPeriod}
              setGrowthPeriod={setGrowthPeriod}
            />
          )}

          {activeTab === "homepage" && <HomepageContentManager />}

          {activeTab === "news" && (
            <NewsManager
              newsList={newsList}
              onOpenAddModal={openAddNews}
              onOpenEditModal={openEditNews}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "events" && (
            <EventsManager
              eventsList={eventsList}
              onOpenAddModal={openAddEvent}
              onOpenEditModal={openEditEvent}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryManager
              galleryList={galleryList}
              onOpenAddModal={openAddGallery}
              onOpenEditModal={openEditGallery}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "members" && (
            <MembersManager
              membershipsList={membershipsList}
              loading={loading}
              onStatusChange={handleMembershipStatusChange}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "teams" && (
            <TeamManager
              teamList={teamList}
              onOpenAddModal={openAddTeam}
              onOpenEditModal={openEditTeam}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsManager
              testimonialsList={testimonialsList}
              onOpenAddModal={openAddTestimonial}
              onOpenEditModal={openEditTestimonial}
              onSetDeleteTarget={setShowDeleteConfirm}
            />
          )}

          {activeTab === "popup" && <PopupManager />}

          {activeTab === "settings" && (
            <SettingsManager
              adminProfile={adminProfile}
              setAdminProfile={setAdminProfile}
              analyticsSettings={analyticsSettings}
              setAnalyticsSettings={setAnalyticsSettings}
              membersCount={membershipsList.length}
              newsCount={newsList.length}
              eventsCount={eventsList.length}
              galleryCount={galleryList.length}
            />
          )}

          {activeTab === "admins" && (
            <AdminUsersManager currentUsername={adminProfile.name} />
          )}
        </div>
      </main>

      <NewsModal
        isOpen={showNewsModal}
        onClose={() => setShowNewsModal(false)}
        editingNews={editingNews}
        newsForm={newsForm}
        setNewsForm={setNewsForm}
        onSubmit={handleNewsSubmit}
        loading={loading}
      />

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        editingEvent={editingEvent}
        eventForm={eventForm}
        setEventForm={setEventForm}
        onSubmit={handleEventSubmit}
        loading={loading}
      />

      <GalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        editingGallery={editingGallery}
        galleryForm={galleryForm}
        setGalleryForm={setGalleryForm}
        onSubmit={handleGallerySubmit}
        loading={loading}
      />

      <TeamModal
        isOpen={showTeamModal}
        onClose={() => setShowTeamModal(false)}
        editingMember={editingTeam}
        teamForm={teamForm}
        setTeamForm={setTeamForm}
        onSubmit={handleTeamSubmit}
        loading={loading}
      />

      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        editingTestimonial={editingTestimonial}
        testimonialForm={testimonialForm}
        setTestimonialForm={setTestimonialForm}
        onSubmit={handleTestimonialSubmit}
        loading={loading}
      />

      <DeleteConfirmModal
        target={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
export { AdminComponent };
