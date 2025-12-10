// Authentication API client
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  
  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/user`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

export async function setupAdmin(password) {
  const response = await fetch(`${API_BASE_URL}/auth/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  
  if (!response.ok) {
    throw new Error('Setup failed');
  }
  
  return response.json();
}

export async function getSetupStatus() {
  const response = await fetch(`${API_BASE_URL}/auth/setup-status`);
  if (!response.ok) {
    throw new Error('Failed to fetch setup status');
  }
  return response.json();
}