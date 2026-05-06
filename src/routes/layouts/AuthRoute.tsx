/**
 * Auth Route Wrapper
 * Wraps routes with AuthLayout and GuestGuard
 */

import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { GuestGuard } from '@/routes/guards/GuestGuard';

export function AuthRoute(): JSX.Element {
  return (
    <GuestGuard>
      <AuthLayout />
    </GuestGuard>
  );
}
