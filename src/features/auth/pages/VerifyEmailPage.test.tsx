/**
 * VerifyEmailPage Tests
 * Tests for email verification page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VerifyEmailPage from './VerifyEmailPage';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        verifyEmail: 'التحقق من البريد الإلكتروني',
        otpSentToEmail: `تم إرسال رمز التحقق إلى ${params?.email || ''}`,
        verificationCode: 'رمز التحقق',
        otpPlaceholder: 'أدخل رمز التحقق',
        verifyButton: 'تحقق',
        resendOtp: 'إعادة إرسال الرمز',
        resendOtpIn: `إعادة الإرسال خلال ${params?.seconds || 0} ثانية`,
        'common:back': 'رجوع',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock usePageTitle
vi.mock('@/shared/hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

// Mock auth store
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    setAuth: vi.fn(),
    user: null,
  }),
}));

// Mock auth service
vi.mock('../services/auth.service', () => ({
  useVerifyEmail: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
  useRequestCode: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

describe('VerifyEmailPage', () => {
  let queryClient: QueryClient;

  const renderVerifyEmailPage = (email?: string): RenderResult => {
    const initialEntries = email
      ? [{ pathname: '/verify-email', state: { email } }]
      : ['/verify-email'];

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/register" element={<div>Register Page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('redirect behavior', () => {
    it('should redirect to register if no email in state', () => {
      renderVerifyEmailPage();
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });
  });

  describe('rendering with email', () => {
    it('should render the page when email is provided', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByText('التحقق من البريد الإلكتروني')).toBeInTheDocument();
    });

    it('should render verify email heading', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByRole('heading', { name: 'التحقق من البريد الإلكتروني' })).toBeInTheDocument();
    });

    it('should display email in message', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByText(/تم إرسال رمز التحقق إلى/)).toBeInTheDocument();
    });

    it('should have back button', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });

    it('should render email icon', () => {
      renderVerifyEmailPage('test@example.com');
      // Icon is in a circular container
      const iconContainer = document.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have OTP input with label', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByLabelText('رمز التحقق')).toBeInTheDocument();
    });

    it('should have OTP input with correct attributes', () => {
      renderVerifyEmailPage('test@example.com');
      const otpInput = screen.getByLabelText('رمز التحقق');
      expect(otpInput).toHaveAttribute('inputMode', 'numeric');
      expect(otpInput).toHaveAttribute('maxLength', '6');
      expect(otpInput).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('should have submit button', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByRole('button', { name: 'تحقق' })).toBeInTheDocument();
    });

    it('should have resend button', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByText(/إعادة الإرسال خلال/)).toBeInTheDocument();
    });
  });

  describe('resend cooldown', () => {
    it('should show cooldown timer initially', () => {
      renderVerifyEmailPage('test@example.com');
      expect(screen.getByText(/إعادة الإرسال خلال/)).toBeInTheDocument();
    });

    it('should disable resend button during cooldown', () => {
      renderVerifyEmailPage('test@example.com');
      const resendButton = screen.getByText(/إعادة الإرسال خلال/);
      expect(resendButton).toBeDisabled();
    });

    it('should enable resend button after cooldown', async () => {
      renderVerifyEmailPage('test@example.com');

      // Fast-forward 60 seconds
      await act(async () => {
        vi.advanceTimersByTime(60000);
      });

      const resendButton = screen.getByText('إعادة إرسال الرمز');
      expect(resendButton).not.toBeDisabled();
    });
  });

  describe('form accessibility', () => {
    it('should have LTR direction on OTP input', () => {
      renderVerifyEmailPage('test@example.com');
      const otpInput = screen.getByLabelText('رمز التحقق');
      expect(otpInput).toHaveAttribute('dir', 'ltr');
    });
  });
});
