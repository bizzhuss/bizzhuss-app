import { create } from 'zustand';
import { User, Order } from '@/types';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/api/client';
import { login as apiLogin, register as apiRegister, getProfile as apiGetProfile, logout as apiLogout } from '@/api/auth';
import { getMyOrders } from '@/api/orders';
import { MOCK_ORDERS } from '@/data/mockData';

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
  orders: Order[];

  // Actions
  loadUser: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  clearError: () => void;
  placeOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  orders: MOCK_ORDERS,

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Fetch user profile from Laravel Sanctum API
      const user = await apiGetProfile();
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Load user's recent orders
      await get().fetchOrders();
    } catch {
      await removeAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await apiLogin(credentials);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      await get().fetchOrders();
    } catch (err: any) {
      const message = err.message || 'Login failed. Please check your credentials.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await apiRegister(data);
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiLogout();
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

  fetchOrders: async () => {
    try {
      const orders = await getMyOrders();
      set({ orders });
    } catch (err) {
      console.log('[Store:Auth] Error fetching orders:', err);
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

  placeOrder: (order: Order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },
}));

export default useAuthStore;
