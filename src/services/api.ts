import axios from 'axios';
import { User, UsersResponse } from '@/types';

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
      const { accessToken } = JSON.parse(user);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  }
  return config;
});

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token from localStorage
        const user = localStorage.getItem('user');
        if (user) {
          const { refreshToken } = JSON.parse(user);
          
          if (refreshToken) {
            // Try to refresh the token
            const refreshResponse = await authService.refreshToken(refreshToken);
            
            // If successful, update the Authorization header and retry the original request
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/user/login', { username, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      
      // Update the stored user data with the new tokens
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          userData.accessToken = response.data.accessToken;
          userData.refreshToken = response.data.refreshToken || userData.refreshToken;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
      
      return response.data;
    } catch (error) {
      // If refresh token is invalid, log the user out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw error;
    }
  },
};

// User services
export const userService = {
  // Get all users with pagination, sorting, and field selection
  getAllUsers: async (params?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params?.select) queryParams.append('select', params.select);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    
    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<UsersResponse>(url);
    return response.data;
  },
  
  // Get a single user by ID
  getUserById: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  
  // Search users by query
  searchUsers: async (query: string) => {
    const response = await api.get<UsersResponse>(`/users/search?q=${query}`);
    return response.data;
  },
  
  // Filter users by key and value
  filterUsers: async (key: string, value: string) => {
    const response = await api.get<UsersResponse>(`/users/filter?key=${key}&value=${value}`);
    return response.data;
  },
  
  // Get user's carts
  getUserCarts: async (userId: number) => {
    const response = await api.get(`/users/${userId}/carts`);
    return response.data;
  },
  
  // Get user's posts
  getUserPosts: async (userId: number) => {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data;
  },
  
  // Get user's todos
  getUserTodos: async (userId: number) => {
    const response = await api.get(`/users/${userId}/todos`);
    return response.data;
  },
  
  // Add a new user
  addUser: async (userData: Partial<User>) => {
    const response = await api.post<User>('/users/add', userData);
    return response.data;
  },
  
  // Update a user
  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },
  
  // Delete a user
  deleteUser: async (id: number) => {
    const response = await api.delete<User & { isDeleted: boolean; deletedOn: string }>(`/users/${id}`);
    return response.data;
  },
};

export default api; 