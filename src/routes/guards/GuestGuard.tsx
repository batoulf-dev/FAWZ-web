/**
 * Guest Guard
 * Redirects to home if user is already authenticated
 */

import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): JSX.Element {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Always redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
