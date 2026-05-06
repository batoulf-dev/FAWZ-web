/**
 * Consent Service Tests
 * Tests for consent service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useConsents,
  useConsent,
  useConsentByType,
  useConsentStatus,
  useShariaDisclosureAccepted,
  useAcceptShariaDisclosure,
  useSubmitMediaConsent,
  useUpsertConsent,
  consentKeys,
  CONSENT_VERSIONS,
} from './consent.service';
import type { ReactNode } from 'react';

describe('consent.service', () => {
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

  describe('constants', () => {
    it('should have correct consent versions', () => {
      expect(CONSENT_VERSIONS.sharia_disclosure).toBe('1.0');
      expect(CONSENT_VERSIONS.media_participation).toBe('1.0');
    });
  });

  describe('consentKeys', () => {
    it('should have correct base key', () => {
      expect(consentKeys.all).toEqual(['consent']);
    });

    it('should have correct lists key', () => {
      expect(consentKeys.lists()).toEqual(['consent', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(consentKeys.list({ consent_type: 'sharia_disclosure' })).toEqual([
        'consent',
        'list',
        { consent_type: 'sharia_disclosure' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(consentKeys.detail('consent-123')).toEqual([
        'consent',
        'detail',
        'consent-123',
      ]);
    });

    it('should have correct byType key', () => {
      expect(consentKeys.byType('sharia_disclosure')).toEqual([
        'consent',
        'type',
        'sharia_disclosure',
      ]);
      expect(consentKeys.byType('media_participation')).toEqual([
        'consent',
        'type',
        'media_participation',
      ]);
    });

    it('should have correct status key', () => {
      expect(consentKeys.status()).toEqual(['consent', 'status']);
    });
  });

  describe('useConsents', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useConsents(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(
        () => useConsents({ consent_type: 'sharia_disclosure' }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useConsent', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useConsent('consent-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useConsent(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useConsentByType', () => {
    it('should return query object for sharia_disclosure', () => {
      const { result } = renderHook(() => useConsentByType('sharia_disclosure'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should return query object for media_participation', () => {
      const { result } = renderHook(() => useConsentByType('media_participation'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useConsentStatus', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useConsentStatus(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useShariaDisclosureAccepted', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useShariaDisclosureAccepted(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useAcceptShariaDisclosure', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useAcceptShariaDisclosure(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useSubmitMediaConsent', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useSubmitMediaConsent(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useUpsertConsent', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useUpsertConsent(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });
});
