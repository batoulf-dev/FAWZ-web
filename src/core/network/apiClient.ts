/**
 * Axios API Client
 * Configured with interceptors for auth, error handling, and logging
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { ApiError, NetworkError, TimeoutError } from './types/apiError';

// Token management (will be replaced by auth store)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh?: string): void {
  accessToken = access;
  refreshToken = refresh ?? null;
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Mock token constant for dev testing - only used in development
const MOCK_DEV_TOKEN = env.appEnv === 'development' ? 'mock-token-for-dev' : '';

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth header for mock dev token (let requests pass without auth)
    if (accessToken && accessToken !== MOCK_DEV_TOKEN && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request ID for tracing
    config.headers['X-Request-ID'] = crypto.randomUUID();

    // Log request in dev
    if (env.isDev) {
      // eslint-disable-next-line no-console
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response in dev
    if (env.isDev) {
      // eslint-disable-next-line no-console
      console.log(`[API] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new TimeoutError();
      }
      throw new NetworkError(error.message);
    }

    const { status, data } = error.response;
    const message = data?.message ?? 'An error occurred';
    const errors = data?.errors;

    // Handle 401 - attempt token refresh (skip for mock dev token)
    if (status === 401 && refreshToken && accessToken !== MOCK_DEV_TOKEN && error.config) {
      try {
        const refreshResponse = await axios.post(
          `${env.apiUrl}/auth/refresh`,
          { refresh_token: refreshToken },
        );

        const newAccessToken = refreshResponse.data.data.access_token;
        setTokens(newAccessToken, refreshToken);

        // Retry original request
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        // Refresh failed - clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        throw new ApiError('Session expired', 401);
      }
    }

    // Throw typed API error
    throw new ApiError(message, status, errors);
  },
);

export default apiClient;
