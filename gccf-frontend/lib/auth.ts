const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

// In-memory user state (NOT persisted in localStorage)
let inMemoryUser: UserInfo | null = null;
let profileSyncPromise: Promise<UserInfo | null> | null = null;

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

    // Clean up any legacy localStorage entries from prior implementations
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
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
  return inMemoryUser;
}

export function isAdminLoggedIn(): boolean {
  return inMemoryUser !== null;
}

export function getAdminToken(): string | null {
  // Return null because authentication token is encapsulated in HttpOnly cookie
  return null;
}

export function getAdminName(): string {
  return inMemoryUser?.username || 'Admin User';
}

export function getAdminRole(): 'super_admin' | 'admin' {
  return inMemoryUser?.role || 'admin';
}

export function isSuperAdmin(): boolean {
  return inMemoryUser?.role === 'super_admin';
}

export function getAdminPermissions(): string[] {
  return inMemoryUser?.permissions || [];
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
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      if (!res.ok) {
        inMemoryUser = null;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authChange'));
        }
        return null;
      }
      const user: UserInfo = await res.json();
      inMemoryUser = user;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authChange'));
      }
      return user;
    } catch (err) {
      console.error('Failed to sync profile', err);
      return null;
    } finally {
      profileSyncPromise = null;
    }
  })();

  return profileSyncPromise;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Failed to call backend logout endpoint', err);
  } finally {
    inMemoryUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminPermissions');

      window.dispatchEvent(new Event('authChange'));
    }
  }
}
