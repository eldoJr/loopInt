export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

const API_BASE = 'http://localhost:3000/api';

export const createUser = async (email: string, password: string, name: string): Promise<User> => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Registration failed');
  }
  
  return response.json();
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    if (response.status === 401) return null;
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }
  
  return response.json();
};