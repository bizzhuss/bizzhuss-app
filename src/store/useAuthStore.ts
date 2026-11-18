import { create } from 'zustand';
import { User, AuthResponse, ApiResponse } from '@/types';
import apiClient, { getAuthToken, setAuthToken, removeAuthToken } from '@/api/client';

export interface LoginCredentials {
  email: string;
  password: string;
  device_name?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadUser: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Fetch user profile from Laravel Sanctum /user endpoint
      const response = await apiClient.get<ApiResponse<User> | User>('/user');
      const userData = (response.data as ApiResponse<User>).data ?? (response.data as User);

      set({
        user: userData,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      await removeAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.response?.data?.message || null,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        ...credentials,
        device_name: credentials.device_name || 'mobile_app',
      });

      const { user, token } = response.data;
      await setAuthToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { user, token } = response.data;
      await setAuthToken(token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (get().token) {
        await apiClient.post('/auth/logout').catch(() => {});
      }
    } finally {
      await removeAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  setToken: async (token: string | null) => {
    if (token) {
      await setAuthToken(token);
      set({ token, isAuthenticated: true });
    } else {
      await removeAuthToken();
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
