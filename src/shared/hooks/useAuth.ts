/**
 * Auth Hook
 * Provides auth state and actions from the auth store
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import type { User, AuthTokens } from '@/core/types/api.types';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = useCallback(
    (user: User, tokens: AuthTokens) => {
      setAuth(user, tokens);
      navigate('/');
    },
    [setAuth, navigate],
  );

  const logout = useCallback(() => {
    logoutStore();
    navigate('/login');
  }, [logoutStore, navigate]);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      updateUser(data);
    },
    [updateUser],
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
  };
}
