const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface LoginResponse {
  access_token: string;
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return false;
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem('adminToken', data.access_token);
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminName', username || 'Admin User');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('storage'));
    }
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdmin') === 'true' && !!localStorage.getItem('adminToken');
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
}

export function getAdminName(): string {
  if (typeof window === 'undefined') return 'Admin User';
  return localStorage.getItem('adminName') || 'Admin User';
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
  }
}
