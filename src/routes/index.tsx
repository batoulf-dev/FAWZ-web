/**
 * Route Definitions
 * Lazy loaded routes with code splitting
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AppRoute } from './layouts/AppRoute';
import { AuthRoute } from './layouts/AuthRoute';

// Lazy load pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const OtpPage = lazy(() => import('@/features/auth/pages/OtpPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const DrawListPage = lazy(() => import('@/features/draw/pages/DrawListPage'));
const DrawDetailPage = lazy(() => import('@/features/draw/pages/DrawDetailPage'));
const TicketsPage = lazy(() => import('@/features/tickets/pages/TicketsPage'));
const WalletPage = lazy(() => import('@/features/wallet/pages/WalletPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/features/errors/pages/NotFoundPage'));

// Suspense wrapper for lazy components
// eslint-disable-next-line react-refresh/only-export-components
function LazyPage({ children }: { children: React.ReactNode }): JSX.Element {
  return <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>;
}

// Router configuration
export const router = createBrowserRouter([
  // Auth routes (guest only)
  {
    element: <AuthRoute />,
    children: [
      {
        path: '/login',
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: '/otp',
        element: (
          <LazyPage>
            <OtpPage />
          </LazyPage>
        ),
      },
    ],
  },

  // App routes (authenticated)
  {
    element: <AppRoute />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: '/draws',
        element: (
          <LazyPage>
            <DrawListPage />
          </LazyPage>
        ),
      },
      {
        path: '/draws/:id',
        element: (
          <LazyPage>
            <DrawDetailPage />
          </LazyPage>
        ),
      },
      {
        path: '/tickets',
        element: (
          <LazyPage>
            <TicketsPage />
          </LazyPage>
        ),
      },
      {
        path: '/wallet',
        element: (
          <LazyPage>
            <WalletPage />
          </LazyPage>
        ),
      },
      {
        path: '/profile',
        element: (
          <LazyPage>
            <ProfilePage />
          </LazyPage>
        ),
      },
      {
        path: '/settings',
        element: (
          <LazyPage>
            <SettingsPage />
          </LazyPage>
        ),
      },
    ],
  },

  // 404
  {
    path: '/404',
    element: (
      <LazyPage>
        <NotFoundPage />
      </LazyPage>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
