import { Task, Project, UserProfile } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL !== undefined
  ? process.env.NEXT_PUBLIC_API_URL
  : (typeof window !== 'undefined' ? '/api' : 'http://localhost:3001/api');

export async function fetchTasks(search?: string, priority?: string, status?: string): Promise<Task[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (priority && priority !== 'All') params.append('priority', priority);
    if (status && status !== 'All') params.append('status', status);

    const res = await fetch(`${API_BASE}/tasks?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  } catch (error) {
    console.warn('Backend API unavailable, using local state:', error);
    return [];
  }
}

export async function createTaskApi(taskData: Partial<Task>): Promise<Task | null> {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  } catch (error) {
    console.warn('Backend API error:', error);
    return null;
  }
}

export async function updateTaskApi(id: string, updates: Partial<Task>): Promise<Task | null> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  } catch (error) {
    console.warn('Backend API error:', error);
    return null;
  }
}

export async function loginAsGuestApi(): Promise<{ token: string; user: UserProfile } | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Guest login failed');
    return await res.json();
  } catch (error) {
    console.warn('Backend Auth API error:', error);
    return null;
  }
}
