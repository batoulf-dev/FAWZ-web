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
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const DrawListPage = lazy(() => import('@/features/draw/pages/DrawListPage'));
const DrawDetailPage = lazy(() => import('@/features/draw/pages/DrawDetailPage'));
const LiveDrawPage = lazy(() => import('@/features/draw/pages/LiveDrawPage'));
const DrawSimulationPage = lazy(() => import('@/features/draw/pages/DrawSimulationPage'));
const TicketsPage = lazy(() => import('@/features/tickets/pages/TicketsPage'));
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
const HelpPage = lazy(() => import('@/features/help/pages/HelpPage'));

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
      {
        path: '/register',
        element: (
          <LazyPage>
            <RegisterPage />
          </LazyPage>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <LazyPage>
            <ForgotPasswordPage />
          </LazyPage>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <LazyPage>
            <ResetPasswordPage />
          </LazyPage>
        ),
      },
      {
        path: '/verify-email',
        element: (
          <LazyPage>
            <VerifyEmailPage />
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
        // DEV ONLY: /draws/live must be before /draws/:id to avoid 'live' being treated as ID
        path: '/draws/live',
        element: (
          <LazyPage>
            <LiveDrawPage />
          </LazyPage>
        ),
      },
      {
        // /draws/simulation must be before /draws/:id to avoid 'simulation' being treated as ID
        path: '/draws/simulation',
        element: (
          <LazyPage>
            <DrawSimulationPage />
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
        element: <Navigate to="/entries" replace />,
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
      {
        path: '/help',
        element: (
          <LazyPage>
            <HelpPage />
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
