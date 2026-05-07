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
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const DrawListPage = lazy(() => import('@/features/draw/pages/DrawListPage'));
const DrawDetailPage = lazy(() => import('@/features/draw/pages/DrawDetailPage'));
const LiveDrawPage = lazy(() => import('@/features/draw/pages/LiveDrawPage'));
const TicketsPage = lazy(() => import('@/features/tickets/pages/TicketsPage'));
const WalletPage = lazy(() => import('@/features/wallet/pages/WalletPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/features/errors/pages/NotFoundPage'));
const ChallengesPage = lazy(() => import('@/features/challenges/pages/ChallengesPage'));
const ChallengeDetailPage = lazy(() => import('@/features/challenges/pages/ChallengeDetailPage'));
const MyNumbersPage = lazy(() => import('@/features/entries/pages/MyNumbersPage'));
const ReferralPage = lazy(() => import('@/features/referrals/pages/ReferralPage'));
const ReferralHistoryPage = lazy(() => import('@/features/referrals/pages/ReferralHistoryPage'));
const PrizeHistoryPage = lazy(() => import('@/features/prizes/pages/PrizeHistoryPage'));
const WinnerSharePage = lazy(() => import('@/features/prizes/pages/WinnerSharePage'));
const NotificationCenterPage = lazy(() => import('@/features/notifications/pages/NotificationCenterPage'));
const NotificationPreferencesPage = lazy(() => import('@/features/notifications/pages/NotificationPreferencesPage'));
const DisputeSubmissionPage = lazy(() => import('@/features/disputes/pages/DisputeSubmissionPage'));
const DisputeStatusPage = lazy(() => import('@/features/disputes/pages/DisputeStatusPage'));
const ConsentPage = lazy(() => import('@/features/consent/pages/ConsentPage'));

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
            <HomePage />
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
      {
        path: '/challenges',
        element: (
          <LazyPage>
            <ChallengesPage />
          </LazyPage>
        ),
      },
      {
        path: '/challenges/:id',
        element: (
          <LazyPage>
            <ChallengeDetailPage />
          </LazyPage>
        ),
      },
      {
        path: '/entries',
        element: (
          <LazyPage>
            <MyNumbersPage />
          </LazyPage>
        ),
      },
      {
        path: '/referral',
        element: (
          <LazyPage>
            <ReferralPage />
          </LazyPage>
        ),
      },
      {
        path: '/referral/history',
        element: (
          <LazyPage>
            <ReferralHistoryPage />
          </LazyPage>
        ),
      },
      {
        path: '/prizes',
        element: (
          <LazyPage>
            <PrizeHistoryPage />
          </LazyPage>
        ),
      },
      {
        path: '/prizes/share/:id',
        element: (
          <LazyPage>
            <WinnerSharePage />
          </LazyPage>
        ),
      },
      {
        path: '/draws/live',
        element: (
          <LazyPage>
            <LiveDrawPage />
          </LazyPage>
        ),
      },
      {
        path: '/notifications',
        element: (
          <LazyPage>
            <NotificationCenterPage />
          </LazyPage>
        ),
      },
      {
        path: '/notifications/settings',
        element: (
          <LazyPage>
            <NotificationPreferencesPage />
          </LazyPage>
        ),
      },
      {
        path: '/disputes',
        element: (
          <LazyPage>
            <DisputeSubmissionPage />
          </LazyPage>
        ),
      },
      {
        path: '/disputes/new',
        element: (
          <LazyPage>
            <DisputeSubmissionPage />
          </LazyPage>
        ),
      },
      {
        path: '/disputes/:id',
        element: (
          <LazyPage>
            <DisputeStatusPage />
          </LazyPage>
        ),
      },
      {
        path: '/profile/consent',
        element: (
          <LazyPage>
            <ConsentPage />
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
