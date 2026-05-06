/**
 * OtpPage Tests
 * Tests for OTP verification page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OtpPage from './OtpPage';

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
        'auth.otp': 'التحقق من رقم الهاتف',
        'auth.otpSent': `تم إرسال رمز التحقق إلى ${params?.phone || ''}`,
        'auth.otpPlaceholder': 'أدخل رمز التحقق',
        'auth.verifyOtp': 'تحقق',
        'auth.resendOtp': 'إعادة إرسال الرمز',
        'auth.resendOtpIn': `إعادة الإرسال خلال ${params?.seconds || 0} ثانية`,
        'common.back': 'رجوع',
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

describe('OtpPage', () => {
  let queryClient: QueryClient;

  const renderOtpPage = (phone?: string): RenderResult => {
    const initialEntries = phone
      ? [{ pathname: '/otp', state: { phone } }]
      : ['/otp'];

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
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
    it('should redirect to login if no phone in state', () => {
      renderOtpPage();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('rendering with phone', () => {
    it('should render the page when phone is provided', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByText('التحقق من رقم الهاتف')).toBeInTheDocument();
    });

    it('should render OTP heading', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByRole('heading', { name: 'التحقق من رقم الهاتف' })).toBeInTheDocument();
    });

    it('should display phone number in message', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByText(/تم إرسال رمز التحقق إلى/)).toBeInTheDocument();
    });

    it('should have back button', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have OTP input', () => {
      renderOtpPage('+9647701234567');
      const otpInput = screen.getByPlaceholderText('أدخل رمز التحقق');
      expect(otpInput).toBeInTheDocument();
    });

    it('should have OTP input with correct attributes', () => {
      renderOtpPage('+9647701234567');
      const otpInput = screen.getByPlaceholderText('أدخل رمز التحقق');
      expect(otpInput).toHaveAttribute('inputMode', 'numeric');
      expect(otpInput).toHaveAttribute('maxLength', '6');
      expect(otpInput).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('should have submit button', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByRole('button', { name: 'تحقق' })).toBeInTheDocument();
    });

    it('should have resend button with cooldown', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByText(/إعادة الإرسال خلال/)).toBeInTheDocument();
    });
  });

  describe('resend cooldown', () => {
    it('should show cooldown timer initially', () => {
      renderOtpPage('+9647701234567');
      expect(screen.getByText(/إعادة الإرسال خلال/)).toBeInTheDocument();
    });

    it('should disable resend button during cooldown', () => {
      renderOtpPage('+9647701234567');
      const resendButton = screen.getByText(/إعادة الإرسال خلال/);
      expect(resendButton).toBeDisabled();
    });

    it('should enable resend button after cooldown', async () => {
      renderOtpPage('+9647701234567');

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
      renderOtpPage('+9647701234567');
      const otpInput = screen.getByPlaceholderText('أدخل رمز التحقق');
      expect(otpInput).toHaveAttribute('dir', 'ltr');
    });
  });
});
