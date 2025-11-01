// src/service/api.js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postService = {
  getAllPosts: async (page = 1, limit = 10, category = null, q = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    const res = await api.get(url);
    return res.data;
  },

  getPost: async (idOrSlug) => {
    const res = await api.get(`/posts/${idOrSlug}`);
    return res.data;
  },

  createPost: async (postData) => {
    // postData should be FormData when including file
    const headers = {};
    if (postData instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
    const res = await api.post('/posts', postData, { headers });
    return res.data;
  },

  updatePost: async (id, postData) => {
    const headers = {};
    if (postData instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
    const res = await api.put(`/posts/${id}`, postData, { headers });
    return res.data;
  },

  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  addComment: async (postId, commentData) => {
    const res = await api.post(`/posts/${postId}/comments`, commentData);
    return res.data;
  },

  searchPosts: async (query) => {
    const res = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
    return res.data;
  }
};

export const categoryService = {
  getAllCategories: async () => {
    const res = await api.get('/categories');
    return res.data;
  },
  createCategory: async (categoryData) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  }
};

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.token || res.data?.token) {
      const token = res.data?.data?.token || res.data?.token;
      const user = res.data?.data?.user || res.data?.user;
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
};

export default api;