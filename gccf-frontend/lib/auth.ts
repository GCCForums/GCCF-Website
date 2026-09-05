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
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem('isAdmin') === 'true' && !!localStorage.getItem('adminToken');
}

export function getAdminToken(): string | null {
  return localStorage.getItem('adminToken');
}

export function logoutAdmin(): void {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('isAdmin');
}
