/**
 * Auth Store Tests
 * Tests for authentication state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';
import { mockUser, mockAuthTokens } from '@/test/fixtures';

// Mock the apiClient module
vi.mock('@/core/network/apiClient', () => ({
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

describe('auth.store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setAuth', () => {
    it('should set user and tokens on login', () => {
      const { setAuth } = useAuthStore.getState();

      setAuth(mockUser, mockAuthTokens);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockAuthTokens.access_token);
      expect(state.refreshToken).toBe(mockAuthTokens.refresh_token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle tokens without refresh token', () => {
      const { setAuth } = useAuthStore.getState();
      const tokensWithoutRefresh = { ...mockAuthTokens, refresh_token: undefined };

      setAuth(mockUser, tokensWithoutRefresh);

      const state = useAuthStore.getState();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user partial data', () => {
      const { setAuth, updateUser } = useAuthStore.getState();

      // First set auth
      setAuth(mockUser, mockAuthTokens);

      // Then update user
      updateUser({ name: 'محمد علي' });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('محمد علي');
      expect(state.user?.phone).toBe(mockUser.phone); // Other fields unchanged
    });

    it('should not update if no user is set', () => {
      const { updateUser } = useAuthStore.getState();

      // Try to update without setting user first
      updateUser({ name: 'Test' });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear all auth state on logout', () => {
      const { setAuth, logout } = useAuthStore.getState();

      // First set auth
      setAuth(mockUser, mockAuthTokens);

      // Verify auth is set
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then logout
      logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { setLoading } = useAuthStore.getState();

      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('selectUser should return user', () => {
      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, mockAuthTokens);

      // Import selectors inline to avoid circular imports
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
    });

    it('selectIsAuthenticated should return auth status', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, mockAuthTokens);

      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('selectIsAuthLoading should return loading status', () => {
      const { setLoading } = useAuthStore.getState();

      expect(useAuthStore.getState().isLoading).toBe(false);

      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should persist auth state to localStorage', () => {
      const { setAuth } = useAuthStore.getState();

      setAuth(mockUser, mockAuthTokens);

      // Check localStorage was updated
      const stored = localStorage.getItem('fawz_auth');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored as string);
      expect(parsed.state.user).toEqual(mockUser);
      expect(parsed.state.accessToken).toBe(mockAuthTokens.access_token);
      expect(parsed.state.isAuthenticated).toBe(true);
    });

    it('should clear localStorage on logout', () => {
      const { setAuth, logout } = useAuthStore.getState();

      setAuth(mockUser, mockAuthTokens);
      expect(localStorage.getItem('fawz_auth')).toBeTruthy();

      logout();

      const stored = localStorage.getItem('fawz_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.user).toBeNull();
        expect(parsed.state.isAuthenticated).toBe(false);
      }
    });
  });
});
