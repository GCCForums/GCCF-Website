const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gccf-website.onrender.com';

export interface UserInfo {
  id: number | string;
  username: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  isActive?: boolean;
}

export interface LoginResponse {
  access_token?: string;
  user?: UserInfo;
  message?: string;
}

// In-memory user state with localStorage fallback
let inMemoryUser: UserInfo | null = null;
let profileSyncPromise: Promise<UserInfo | null> | null = null;

function getStoredUser(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('gccf_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ success: boolean; message?: string; user?: UserInfo }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Ensures HttpOnly cookie is set by browser
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Invalid username or password.',
      };
    }

    inMemoryUser = data.user || {
      id: 'admin',
      username,
      role: 'admin',
      permissions: [],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('gccf_admin_user', JSON.stringify(inMemoryUser));
      if (data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
      }
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminPermissions');

      window.dispatchEvent(new Event('authChange'));
    }

    return { success: true, user: inMemoryUser || undefined };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Connection failed. Please ensure the backend server is running.',
    };
  }
}

export function getCurrentUser(): UserInfo | null {
  return inMemoryUser || getStoredUser();
}

export function isAdminLoggedIn(): boolean {
  return inMemoryUser !== null || getStoredUser() !== null;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
}

export function getAdminName(): string {
  return inMemoryUser?.username || getStoredUser()?.username || 'Admin User';
}

export function getAdminRole(): 'super_admin' | 'admin' {
  return inMemoryUser?.role || getStoredUser()?.role || 'admin';
}

export function isSuperAdmin(): boolean {
  return getAdminRole() === 'super_admin';
}

export function getAdminPermissions(): string[] {
  return inMemoryUser?.permissions || getStoredUser()?.permissions || [];
}

export function hasPermission(permissionKey: string): boolean {
  if (isSuperAdmin()) return true;
  const permissions = getAdminPermissions();
  if (permissions.includes('all')) return true;
  return permissions.includes(permissionKey);
}

export async function syncCurrentUserProfile(): Promise<UserInfo | null> {
  // Deduplicate concurrent requests
  if (profileSyncPromise) {
    return profileSyncPromise;
  }

  profileSyncPromise = (async () => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        inMemoryUser = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gccf_admin_user');
          window.dispatchEvent(new Event('authChange'));
        }
        return null;
      }
      const user: UserInfo = await res.json();
      inMemoryUser = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gccf_admin_user', JSON.stringify(user));
        window.dispatchEvent(new Event('authChange'));
      }
      return user;
    } catch (err) {
      console.error('Failed to sync profile', err);
      return inMemoryUser || getStoredUser();
    } finally {
      profileSyncPromise = null;
    }
  })();

  return profileSyncPromise;
}

export async function logoutAdmin(): Promise<void> {
  try {
    const token = getAdminToken();
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error('Failed to call backend logout endpoint', err);
  } finally {
    inMemoryUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gccf_admin_user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminPermissions');

      window.dispatchEvent(new Event('authChange'));
    }
  }
}
