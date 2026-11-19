import { create as createAxios, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AUTH_TOKEN_KEY = 'bizzhuss_auth_token';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://bizzhuss.com/api/v1';

/**
 * Storage helpers for Laravel Sanctum Bearer token:
 * Uses expo-secure-store on iOS/Android, and localStorage on Web.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(AUTH_TOKEN_KEY);
      }
      return null;
    }
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to retrieve auth token:', error);
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return;
    }
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save auth token:', error);
    throw error;
  }
}

export async function removeAuthToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return;
    }
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('Failed to delete auth token:', error);
  }
}

/**
 * Pre-configured Axios instance for Laravel Sanctum REST API v1
 */
export const apiClient = createAxios({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Sanctum Bearer token from SecureStore automatically
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.set('Accept', 'application/json');

    const token = await getAuthToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth expiration (401) & global errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Sanctum token expired or revoked
      await removeAuthToken();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
