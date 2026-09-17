import { News, CreateNewsDto, UpdateNewsDto } from '@/types/news';
import { Event, CreateEventDto, UpdateEventDto } from '@/types/events';
import { Gallery, CreateGalleryDto, UpdateGalleryDto } from '@/types/gallery';
import {
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto,
  MembershipSettings,
} from '@/types/membership';
import { TeamMember, PopupItem } from '@/components/admin/types';
import { getAdminToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Handle empty responses (204 No Content, or explicit content-length: 0)
  if (response.status === 204) {
    return undefined as T;
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    return undefined as T;
  }

  // Try to parse JSON; if body is empty, return undefined
  const text = await response.text();
  if (!text || text.trim().length === 0) {
    return undefined as T;
  }

  return JSON.parse(text);
}

export const newsApi = {
  getAll: () => fetchApi<News[]>('/news'),
  
  getLatest: (limit?: number) => 
    fetchApi<News[]>(`/news/latest${limit ? `?limit=${limit}` : ''}`),
  
  getByCategory: (category: string) => 
    fetchApi<News[]>(`/news/category/${category}`),
  
  getBySlug: (slug: string) => 
    fetchApi<News>(`/news/slug/${slug}`),
  
  getById: (id: string) => 
    fetchApi<News>(`/news/${id}`),
  
  create: (data: CreateNewsDto) => 
    fetchApi<News>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateNewsDto) => 
    fetchApi<News>(`/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    fetchApi<void>(`/news/${id}`, { method: 'DELETE' }),
};

export const eventsApi = {
  getAll: () => fetchApi<Event[]>('/events'),
  
  getCompleted: () => 
    fetchApi<Event[]>('/events/completed'),
  
  getUpcoming: () => 
    fetchApi<Event[]>('/events/upcoming'),
  
  getBySlug: (slug: string) => 
    fetchApi<Event>(`/events/slug/${slug}`),
  
  getById: (id: string) => 
    fetchApi<Event>(`/events/${id}`),
  
  create: (data: CreateEventDto) => 
    fetchApi<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateEventDto) => 
    fetchApi<Event>(`/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    fetchApi<void>(`/events/${id}`, { method: 'DELETE' }),
};

export const galleryApi = {
  getAll: () => fetchApi<Gallery[]>('/gallery'),
  
  getVisible: () => 
    fetchApi<Gallery[]>('/gallery/visible'),
  
  getByCategory: (category: string) => 
    fetchApi<Gallery[]>(`/gallery/category/${category}`),
  
  getById: (id: string) => 
    fetchApi<Gallery>(`/gallery/${id}`),
  
  create: (data: CreateGalleryDto) => 
    fetchApi<Gallery>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateGalleryDto) => 
    fetchApi<Gallery>(`/gallery/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  reorder: (ids: string[]) => 
    fetchApi<Gallery[]>('/gallery/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    }),
  
  delete: (id: string) => 
    fetchApi<void>(`/gallery/${id}`, { method: 'DELETE' }),
};

export const membershipsApi = {
  getAll: () => fetchApi<Membership[]>('/memberships'),
  
  getPending: () => 
    fetchApi<Membership[]>('/memberships/pending'),
  
  getApproved: () => 
    fetchApi<Membership[]>('/memberships/approved'),
  
  getById: (id: string) => 
    fetchApi<Membership>(`/memberships/${id}`),
  
  create: (data: CreateMembershipDto) => 
    fetchApi<Membership>('/memberships', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateMembershipDto) => 
    fetchApi<Membership>(`/memberships/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    fetchApi<void>(`/memberships/${id}`, { method: 'DELETE' }),
};

export const teamApi = {
  getAll: (activeOnly?: boolean) =>
    fetchApi<TeamMember[]>(`/team${activeOnly ? '?activeOnly=true' : ''}`),
  getById: (id: string) =>
    fetchApi<TeamMember>(`/team/${id}`),
  create: (data: Partial<TeamMember>) =>
    fetchApi<TeamMember>('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<TeamMember>) =>
    fetchApi<TeamMember>(`/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/team/${id}`, { method: 'DELETE' }),
  reorder: (ids: string[]) =>
    fetchApi<TeamMember[]>('/team/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids }),
    }),
};

export const popupsApi = {
  getAll: () =>
    fetchApi<PopupItem[]>('/popups'),
  getActive: () =>
    fetchApi<PopupItem | null>('/popups/active'),
  getById: (id: string) =>
    fetchApi<PopupItem>(`/popups/${id}`),
  create: (data: Partial<PopupItem>) =>
    fetchApi<PopupItem>('/popups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<PopupItem>) =>
    fetchApi<PopupItem>(`/popups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  toggle: (id: string, enabled: boolean) =>
    fetchApi<PopupItem>(`/popups/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),
  delete: (id: string) =>
    fetchApi<void>(`/popups/${id}`, { method: 'DELETE' }),
};

export const queryKeys = {
  news: {
    all: ['news'] as const,
    lists: () => [...queryKeys.news.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.news.lists(), { filters }] as const,
    details: () => [...queryKeys.news.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.news.details(), slug] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.events.lists(), { filters }] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.events.details(), slug] as const,
  },
  gallery: {
    all: ['gallery'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.gallery.lists(), { filters }] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },
  memberships: {
    all: ['memberships'] as const,
    lists: () => [...queryKeys.memberships.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.memberships.lists(), { filters }] as const,
    details: () => [...queryKeys.memberships.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.memberships.details(), id] as const,
    pending: () => [...queryKeys.memberships.all, 'pending'] as const,
    approved: () => [...queryKeys.memberships.all, 'approved'] as const,
  },
};

export interface DashboardStats {
  totalMembers: number;
  pendingMembers: number;
  activeEvents: number;
  totalNews: number;
  totalGallery: number;
  approvedMembers: number;
  declinedMembers?: number;
  newMembersThisMonth: number;
  newMembersThisWeek: number;
  monthGrowth: number;
  weekGrowth: number;
}

export interface MemberGrowthData {
  date: string;
  members: number;
  newMembers: number;
  total: number;
}

export interface EventAttendanceData {
  events: Array<{
    id: string;
    title: string;
    date: Date;
    attendees: number;
    location: string;
  }>;
  byType: Array<{
    category: string;
    count: number;
    total: number;
  }>;
}

export interface MembershipStats {
  byStatus: Array<{ status: string; count: number }>;
  byMonth: Array<{ month: string; count: number }>;
}

export interface ActivityItem {
  type: 'member' | 'news' | 'event' | 'team';
  action: string;
  title: string;
  timestamp: Date | string;
}

export interface EventStats {
  upcoming: number;
  completed: number;
  total: number;
  byMonth: Array<{ month: string; count: number }>;
}

export interface NewsActivity {
  total: number;
  byMonth: Array<{ month: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
}

export interface MembershipByRange {
  byStatus: Array<{ status: string; count: number }>;
  byMonth: Array<{ month: string; count: number }>;
}

export interface ComprehensiveAnalytics {
  dateRange: { start: string; end: string };
  dashboardStats: DashboardStats;
  memberGrowth: MemberGrowthData[];
  eventStats: EventStats;
  membershipStats: MembershipByRange;
  newsActivity: NewsActivity;
  recentActivity: ActivityItem[];
}

export const analyticsApi = {
  getDashboardStats: () => fetchApi<DashboardStats>('/analytics/dashboard'),
  
  getMemberGrowth: (days?: number) => 
    fetchApi<MemberGrowthData[]>(`/analytics/member-growth${days ? `?days=${days}` : ''}`),
  
  getEventAttendance: () => fetchApi<EventAttendanceData>('/analytics/event-attendance'),
  
  getMembershipStats: () => fetchApi<MembershipStats>('/analytics/membership-stats'),
  
  getRecentActivity: (limit?: number) => 
    fetchApi<ActivityItem[]>(`/analytics/recent-activity${limit ? `?limit=${limit}` : ''}`),

  getEventStats: (startDate: string, endDate: string) =>
    fetchApi<EventStats>(`/analytics/event-stats?startDate=${startDate}&endDate=${endDate}`),

  getNewsActivity: (startDate: string, endDate: string) =>
    fetchApi<NewsActivity>(`/analytics/news-activity?startDate=${startDate}&endDate=${endDate}`),

  getMembershipByRange: (startDate: string, endDate: string) =>
    fetchApi<MembershipByRange>(`/analytics/membership-by-range?startDate=${startDate}&endDate=${endDate}`),

  getComprehensive: (startDate?: string, endDate?: string) => 
    fetchApi<ComprehensiveAnalytics>(`/analytics/comprehensive${startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : ''}`),

  exportData: (type: 'members' | 'events' | 'news', startDate?: string, endDate?: string) => {
    let url = `/analytics/export?type=${type}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return fetchApi<unknown[]>(url);
  },
};

export interface Settings {
  id: number;
  accountSettings: {
    name?: string;
    email?: string;
  };
  analyticsSettings: {
    realTimeUpdates?: boolean;
    defaultDateRange?: string;
    displayedMetrics?: string[];
    exportFormat?: string;
  };
}

export const settingsApi = {
  getSettings: () => fetchApi<Settings>('/settings'),
  
  updateAccountSettings: (data: Settings['accountSettings']) =>
    fetchApi<Settings>('/settings/account', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  updateAnalyticsSettings: (data: Settings['analyticsSettings']) =>
    fetchApi<Settings>('/settings/analytics', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ success: boolean; message: string }>('/settings/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export const membershipSettingsApi = {
  getSettings: () => fetchApi<MembershipSettings>('/settings/membership'),
  updateSettings: (data: Partial<MembershipSettings>) =>
    fetchApi<MembershipSettings>('/settings/membership', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export interface AdminUser {
  id: number;
  username: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserDto {
  username: string;
  password: string;
  role?: 'super_admin' | 'admin';
  permissions?: string[];
  isActive?: boolean;
}

export interface UpdateAdminUserDto {
  username?: string;
  password?: string;
  role?: 'super_admin' | 'admin';
  permissions?: string[];
  isActive?: boolean;
}

export const adminUsersApi = {
  getAll: () => fetchApi<AdminUser[]>('/admin/users'),
  getById: (id: number) => fetchApi<AdminUser>(`/admin/users/${id}`),
  create: (data: CreateAdminUserDto) =>
    fetchApi<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: UpdateAdminUserDto) =>
    fetchApi<AdminUser>(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchApi<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
};

export interface HeroSectionContent {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface MetricItem {
  number: string;
  label: string;
}

export interface MetricsSectionContent {
  backgroundImage?: string;
  items: MetricItem[];
}

export interface AboutSectionContent {
  badge?: string;
  title?: string;
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionContent {
  badge?: string;
  title?: string;
  items: FaqItem[];
}

export interface ChairpersonMessageContent {
  badge?: string;
  title?: string;
  chairpersonName?: string;
  chairpersonTitle?: string;
  quote?: string;
  message?: string;
  image?: string;
  signatureText?: string;
  isActive?: boolean;
}

export interface ServiceItem {
  icon?: string;
  title: string;
  description: string;
}

export interface ServicesSectionContent {
  badge?: string;
  title?: string;
  items: ServiceItem[];
}

export interface HomepageContent {
  id: number;
  hero: HeroSectionContent;
  metrics: MetricsSectionContent;
  chairpersonMessage?: ChairpersonMessageContent;
  about: AboutSectionContent;
  faq: FaqSectionContent;
  services?: ServicesSectionContent;
  extraSections?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export const homepageApi = {
  get: () => fetchApi<HomepageContent>('/homepage'),
  update: (data: Partial<HomepageContent>) =>
    fetchApi<HomepageContent>('/homepage', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  reset: () =>
    fetchApi<HomepageContent>('/homepage/reset', {
      method: 'POST',
    }),
};

export const uploadApi = {
  uploadImage: async (
    file: File,
    folder?: string,
  ): Promise<{ url: string; public_id: string }> => {
    const token = getAdminToken();
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(err.message || `Upload failed with status ${response.status}`);
    }

    return response.json();
  },
};

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorUsername: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId: string | null;
  changes: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
}

export interface PaginatedAuditLogs {
  items: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const auditLogsApi = {
  getAll: (page: number = 1, limit: number = 25, entity?: string, actor?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (entity) params.append('entity', entity);
    if (actor) params.append('actor', actor);
    return fetchApi<PaginatedAuditLogs>(`/admin/audit-logs?${params.toString()}`);
  },
};



