const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface UserInfo {
  id: number | string;
  username: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  isActive?: boolean;
}

export interface LoginResponse {
  access_token: string;
  user?: UserInfo;
  message?: string;
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
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

    localStorage.setItem('adminToken', data.access_token);
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminName', data.user?.username || username || 'Admin User');
    localStorage.setItem('adminRole', data.user?.role || 'admin');
    localStorage.setItem(
      'adminPermissions',
      JSON.stringify(data.user?.permissions || []),
    );

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('storage'));
    }
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Connection failed. Please ensure the backend server is running.',
    };
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem('isAdmin') === 'true' &&
    !!localStorage.getItem('adminToken')
  );
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
}

export function getAdminName(): string {
  if (typeof window === 'undefined') return 'Admin User';
  return localStorage.getItem('adminName') || 'Admin User';
}

export function getAdminRole(): 'super_admin' | 'admin' {
  if (typeof window === 'undefined') return 'admin';
  return (localStorage.getItem('adminRole') as 'super_admin' | 'admin') || 'admin';
}

export function isSuperAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adminRole') === 'super_admin';
}

export function getAdminPermissions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('adminPermissions');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hasPermission(permissionKey: string): boolean {
  if (typeof window === 'undefined') return false;
  if (isSuperAdmin()) return true;
  const permissions = getAdminPermissions();
  if (permissions.includes('all')) return true;
  return permissions.includes(permissionKey);
}

export async function syncCurrentUserProfile(): Promise<UserInfo | null> {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 401) {
        logoutAdmin();
      }
      return null;
    }
    const user: UserInfo = await res.json();
    localStorage.setItem('adminName', user.username);
    localStorage.setItem('adminRole', user.role);
    localStorage.setItem(
      'adminPermissions',
      JSON.stringify(user.permissions || []),
    );
    return user;
  } catch (err) {
    console.error('Failed to sync profile', err);
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminPermissions');
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
  }
}

