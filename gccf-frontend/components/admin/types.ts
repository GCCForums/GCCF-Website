export type AdminTab =
  | "dashboard"
  | "homepage"
  | "news"
  | "events"
  | "gallery"
  | "members"
  | "teams"
  | "popup"
  | "testimonials"
  | "settings"
  | "admins"
  | "audit";

export interface FeaturePermission {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_PERMISSIONS: FeaturePermission[] = [
  { id: "dashboard", name: "Dashboard", description: "View dashboard analytics and statistics" },
  { id: "homepage", name: "Homepage Content", description: "Edit Hero, Metrics, About Us, and FAQ sections" },
  { id: "news", name: "News Management", description: "Create, publish, edit, and delete news posts" },
  { id: "events", name: "Events Management", description: "Create, manage events, registration links & images" },
  { id: "gallery", name: "Gallery Media", description: "Upload and manage photos in public gallery" },
  { id: "members", name: "Members & Applications", description: "Manage member directory and membership applications" },
  { id: "teams", name: "Team Members", description: "Manage board, leadership, and team profiles" },
  { id: "popup", name: "Announcement Popups", description: "Configure website popups and banner announcements" },
  { id: "testimonials", name: "Testimonials", description: "Manage community reviews and testimonials" },
  { id: "settings", name: "Settings", description: "Configure dashboard profile and account settings" },
];

export type NewsFormData = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  slug: string;
  featuredImage: string;
  galleryImages: string;
  tags: string;
  source: string;
  sourceUrl: string;
};

import { EventSponsorTier } from "@/types/events";

export type EventFormData = {
  title: string;
  shortDescription: string;
  description: string;
  eventDate: string;
  location: string;
  slug: string;
  status: "upcoming" | "completed";
  mainImage: string;
  galleryImages: string;
  registrationUrl: string;
  organizer: string;
  attendees: string;
  sponsors: EventSponsorTier[];
};

export type GalleryFormData = {
  title: string;
  description: string;
  imageUrl: string;
  images: string;
  isVisible: boolean;
  order: string;
};

export type DeleteTarget = {
  type: "news" | "events" | "gallery" | "memberships" | "teams" | "testimonials";
  id: string;
};

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const initialNewsForm: NewsFormData = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  publishedDate: new Date().toISOString().split("T")[0],
  category: "",
  slug: "",
  featuredImage: "",
  galleryImages: "",
  tags: "",
  source: "",
  sourceUrl: "",
};

export const initialEventForm: EventFormData = {
  title: "",
  shortDescription: "",
  description: "",
  eventDate: new Date().toISOString().split("T")[0],
  location: "",
  slug: "",
  status: "upcoming",
  mainImage: "",
  galleryImages: "",
  registrationUrl: "",
  organizer: "",
  attendees: "0",
  sponsors: [],
};

export const initialGalleryForm: GalleryFormData = {
  title: "",
  description: "",
  imageUrl: "",
  images: "",
  isVisible: true,
  order: "0",
};

export interface AdminProfile {
  name: string;
  email: string;
  role?: string;
}


export interface AnalyticsSettings {
  realTimeUpdates: boolean;
  defaultDateRange: string;
  displayedMetrics: string[];
  exportFormat: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  affiliatedPart: string;
  image: string;
  email?: string;
  linkedin?: string;
  order?: number;
}

export type TeamFormData = {
  name: string;
  title: string;
  affiliatedPart: string;
  image: string;
  email: string;
  linkedin: string;
  order: string;
};

export const initialTeamForm: TeamFormData = {
  name: "",
  title: "",
  affiliatedPart: "",
  image: "",
  email: "",
  linkedin: "",
  order: "0",
};

export interface PopupItem {
  id: string;
  name: string;
  imageUrl: string;
  enabled: boolean;
  delaySeconds: number;
  createdAt?: string;
}

export type PopupFormData = {
  name: string;
  imageUrl: string;
  enabled: boolean;
  delaySeconds: number;
};

export const initialPopupForm: PopupFormData = {
  name: "",
  imageUrl: "",
  enabled: true,
  delaySeconds: 3,
};

export interface WebsitePopupConfig {
  enabled: boolean;
  name: string;
  imageUrl: string;
  delaySeconds: number;
}

export const initialPopupConfig: WebsitePopupConfig = {
  enabled: false,
  name: "Main Announcement Popup",
  imageUrl: "",
  delaySeconds: 3,
};

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  rating?: number;
  avatarUrl?: string;
  createdAt?: string;
}

export type TestimonialFormData = {
  name: string;
  role: string;
  feedback: string;
  rating: number;
  avatarUrl: string;
};

export const initialTestimonialForm: TestimonialFormData = {
  name: "",
  role: "",
  feedback: "",
  rating: 5,
  avatarUrl: "",
};

export const defaultInitialTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Security Architect, TechCorp",
    feedback:
      "GCCF has been instrumental in my career growth. The community support and learning opportunities are unparalleled.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Penetration Tester, SecureNet",
    feedback:
      "The workshops and events organized by GCCF are world-class. I've learned so much and made valuable connections.",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "CISO, FinanceGuard",
    feedback:
      "Being part of GCCF means being at the forefront of cybersecurity innovation. Highly recommend joining!",
    rating: 5,
  },
];
