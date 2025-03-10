import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// User services
export const userService = {
  getAllUsers: async (limit = 10, skip = 0) => {
    const response = await api.get(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },
  
  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  searchUsers: async (query: string) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
};

export default api; 