/**
 * Auto Logout Hook
 * Logs out user after inactivity timeout (30 minutes default)
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
] as const;

interface UseAutoLogoutOptions {
  timeout?: number;
  onLogout?: () => void;
  enabled?: boolean;
}

export function useAutoLogout(options: UseAutoLogoutOptions = {}): void {
  const { timeout = DEFAULT_TIMEOUT, onLogout, enabled = true } = options;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogout = useCallback(() => {
    logout();
    onLogout?.();
  }, [logout, onLogout]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated && enabled) {
      timeoutRef.current = setTimeout(handleLogout, timeout);
    }
  }, [isAuthenticated, enabled, timeout, handleLogout]);

  useEffect(() => {
    if (!isAuthenticated || !enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Set initial timer
    resetTimer();

    // Add activity listeners
    const handleActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, enabled, resetTimer]);
}
