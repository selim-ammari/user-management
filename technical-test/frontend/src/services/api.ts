import { User } from '../types/User';

const API_BASE_URL = (process.env.REACT_APP_API_URL as string | undefined) || window.location.origin;

async function handleJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export const api = {
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    return handleJson<User[]>(res);
  },

  async saveUser(userData: Pick<User, 'lastname' | 'firstname'>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleJson(res);
  },

  async updateUser(id: string, userData: Pick<User, 'lastname' | 'firstname'>): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleJson(res);
  },

  async updateUserRole(id: string, role: 'user' | 'admin'): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return handleJson(res);
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
    return handleJson(res);
  },
};

export const { getUsers, saveUser, updateUser, deleteUser, updateUserRole } = api;


