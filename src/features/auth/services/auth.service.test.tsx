/**
 * Auth Service Tests
 * Tests for authentication service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useSignUp,
  useVerifyEmail,
  useLogin,
  useRequestCode,
  useForgotPassword,
  useResetPassword,
  useProfile,
  useUpdateProfile,
  useLogout,
  authKeys,
} from './auth.service';
import type { ReactNode } from 'react';

describe('auth.service', () => {
  let queryClient: QueryClient;

  const createWrapper = (): React.FC<{ children: ReactNode }> =>
    function Wrapper({ children }: { children: ReactNode }): JSX.Element {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe('authKeys', () => {
    it('should have correct base key', () => {
      expect(authKeys.all).toEqual(['auth']);
    });

    it('should have correct profile key', () => {
      expect(authKeys.profile()).toEqual(['auth', 'profile']);
    });

    it('should have correct user key with id', () => {
      expect(authKeys.user('123')).toEqual(['auth', 'user', '123']);
    });
  });

  describe('useSignUp', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useVerifyEmail', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useVerifyEmail(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useLogin', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useRequestCode', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useRequestCode(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useForgotPassword', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useForgotPassword(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useResetPassword', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useResetPassword(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useProfile', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useProfile(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should use correct query key', () => {
      renderHook(() => useProfile(), {
        wrapper: createWrapper(),
      });

      const queries = queryClient.getQueryCache().findAll();
      const hasCorrectKey = queries.some(
        (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'auth' &&
          q.queryKey[1] === 'profile',
      );
      expect(hasCorrectKey).toBe(true);
    });
  });

  describe('useUpdateProfile', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useUpdateProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useLogout', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });
});
