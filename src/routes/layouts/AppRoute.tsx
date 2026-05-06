/**
 * App Route Wrapper
 * Wraps routes with AppLayout and AuthGuard
 */

import { AppLayout } from '@/shared/layouts/AppLayout';
import { AuthGuard } from '@/routes/guards/AuthGuard';

export function AppRoute(): JSX.Element {
  return (
    <AuthGuard>
      <AppLayout />
    </AuthGuard>
  );
}
