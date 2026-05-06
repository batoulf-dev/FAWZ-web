/**
 * Draw Service Tests
 * Tests for draw service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useDrawList,
  useDraw,
  useNextDraw,
  useCurrentDraw,
  useDrawWinners,
  useUserWins,
  useDrawDigitEvents,
  useShareCardData,
  drawKeys,
} from './draw.service';
import type { ReactNode } from 'react';

describe('draw.service', () => {
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

  describe('drawKeys', () => {
    it('should have correct base key', () => {
      expect(drawKeys.all).toEqual(['draws']);
    });

    it('should have correct lists key', () => {
      expect(drawKeys.lists()).toEqual(['draws', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(drawKeys.list({ page: 1, status: 'scheduled' })).toEqual([
        'draws',
        'list',
        { page: 1, status: 'scheduled' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(drawKeys.detail('draw-123')).toEqual(['draws', 'detail', 'draw-123']);
    });

    it('should have correct next key', () => {
      expect(drawKeys.next()).toEqual(['draws', 'next']);
    });

    it('should have correct current key', () => {
      expect(drawKeys.current()).toEqual(['draws', 'current']);
    });

    it('should have correct winners keys', () => {
      expect(drawKeys.winners()).toEqual(['draws', 'winners']);
      expect(drawKeys.winnerList({ page: 1 })).toEqual([
        'draws',
        'winners',
        'list',
        { page: 1 },
      ]);
      expect(drawKeys.drawWinners('draw-123')).toEqual([
        'draws',
        'winners',
        'draw',
        'draw-123',
      ]);
      expect(drawKeys.userWins('user-123')).toEqual([
        'draws',
        'winners',
        'user',
        'user-123',
      ]);
    });

    it('should have correct digits key', () => {
      expect(drawKeys.digits('draw-123')).toEqual(['draws', 'digits', 'draw-123']);
    });

    it('should have correct shareCard key', () => {
      expect(drawKeys.shareCard('winner-123')).toEqual(['draws', 'shareCard', 'winner-123']);
    });
  });

  describe('useDrawList', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useDrawList(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useDrawList({ page: 2, status: 'finalized' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useDraw', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useDraw('draw-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useDraw(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useDraw('draw-123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useNextDraw', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useNextDraw(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useCurrentDraw', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useCurrentDraw(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useDrawWinners', () => {
    it('should return query object when drawId is provided', () => {
      const { result } = renderHook(() => useDrawWinners('draw-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when drawId is empty', () => {
      const { result } = renderHook(() => useDrawWinners(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useUserWins', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useUserWins(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useUserWins(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useDrawDigitEvents', () => {
    it('should return query object when drawId is provided', () => {
      const { result } = renderHook(() => useDrawDigitEvents('draw-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when drawId is empty', () => {
      const { result } = renderHook(() => useDrawDigitEvents(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useShareCardData', () => {
    it('should return query object when winnerId is provided', () => {
      const { result } = renderHook(() => useShareCardData('winner-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when winnerId is empty', () => {
      const { result } = renderHook(() => useShareCardData(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });
});
