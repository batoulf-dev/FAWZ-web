/**
 * Auth Store
 * Manages authentication state with localStorage persistence
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthTokens } from '@/core/types/api.types';
import { setTokens, clearTokens } from '@/core/network/apiClient';
import { mockUser as fixtureUser, mockAuthTokens } from '@/test/fixtures';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  mockLogin: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true, // Start loading until hydration complete

      // Set auth after login
      setAuth: (user, tokens) => {
        setTokens(tokens.access_token, tokens.refresh_token);
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? null,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Update user profile
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // Logout
      logout: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Mock login for development testing only
      mockLogin: () => {
        if (import.meta.env.VITE_APP_ENV !== 'development') {
          throw new Error('[FAWZ] mockLogin is only available in development');
        }
        setTokens(mockAuthTokens.access_token, mockAuthTokens.refresh_token);
        set({
          user: fixtureUser,
          accessToken: mockAuthTokens.access_token,
          refreshToken: mockAuthTokens.refresh_token ?? null,
          isAuthenticated: true,
          isLoading: false,
        });
      },
    }),
    {
      name: 'fawz_auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore tokens to apiClient after hydration
        if (state?.accessToken) {
          setTokens(state.accessToken, state.refreshToken ?? undefined);
        }
        state?.setLoading(false);
      },
    },
  ),
);

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsAuthLoading = (state: AuthState) => state.isLoading;
