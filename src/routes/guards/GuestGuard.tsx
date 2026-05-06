/**
 * Guest Guard
 * Redirects to home if user is already authenticated
 */

import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): JSX.Element {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Redirect to home (or intended page) if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
