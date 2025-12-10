// Articles API client
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchArticles(searchParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (searchParams.search) queryParams.append('search', searchParams.search);
  if (searchParams.category) queryParams.append('category', searchParams.category);
  if (searchParams.tag) queryParams.append('tag', searchParams.tag);
  
  const url = queryParams.toString() 
    ? `${API_BASE_URL}/articles?${queryParams.toString()}`
    : `${API_BASE_URL}/articles`;
    
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
}

export async function fetchArticle(id) {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  return response.json();
}

export async function generateArticle() {
  const response = await fetch(`${API_BASE_URL}/articles/generate`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate article');
  }
  
  return response.json();
}

export async function updateArticle(id, data) {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update article');
  }
  
  return response.json();
}

export async function deleteArticle(id) {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete article');
  }
  
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function fetchTags() {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
}