/**
 * Auth Guard
 * Redirects to login if user is not authenticated
 */

import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): JSX.Element {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
