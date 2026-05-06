/**
 * ResetPasswordPage Tests
 * Tests for reset password page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResetPasswordPage from './ResetPasswordPage';

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
        resetPassword: 'إعادة تعيين كلمة المرور',
        resetPasswordSubtitle: `أدخل رمز الاستعادة المرسل إلى ${params?.email || ''}`,
        resetCode: 'رمز الاستعادة',
        resetCodePlaceholder: 'أدخل رمز الاستعادة',
        newPassword: 'كلمة المرور الجديدة',
        newPasswordPlaceholder: 'أدخل كلمة المرور الجديدة',
        confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
        confirmNewPasswordPlaceholder: 'أعد إدخال كلمة المرور الجديدة',
        passwordRequirements: '8 أحرف على الأقل',
        resetPasswordButton: 'إعادة تعيين كلمة المرور',
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

// Mock useResetPassword hook
vi.mock('../services/auth.service', () => ({
  useResetPassword: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

describe('ResetPasswordPage', () => {
  let queryClient: QueryClient;

  const renderResetPasswordPage = (email?: string): RenderResult => {
    const initialEntries = email
      ? [{ pathname: '/reset-password', state: { email } }]
      : ['/reset-password'];

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
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
  });

  describe('redirect behavior', () => {
    it('should redirect to forgot-password if no email in state', () => {
      renderResetPasswordPage();
      expect(screen.getByText('Forgot Password Page')).toBeInTheDocument();
    });
  });

  describe('rendering with email', () => {
    it('should render the page when email is provided', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByRole('heading', { name: 'إعادة تعيين كلمة المرور' })).toBeInTheDocument();
    });

    it('should render reset password heading', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByRole('heading', { name: 'إعادة تعيين كلمة المرور' })).toBeInTheDocument();
    });

    it('should display email in subtitle', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByText(/أدخل رمز الاستعادة المرسل إلى/)).toBeInTheDocument();
    });

    it('should have back button', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });

    it('should render key icon in circular container', () => {
      renderResetPasswordPage('test@example.com');
      const iconContainer = document.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have reset code input', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByLabelText('رمز الاستعادة')).toBeInTheDocument();
    });

    it('should have new password input', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByLabelText('كلمة المرور الجديدة')).toBeInTheDocument();
    });

    it('should have confirm new password input', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByLabelText('تأكيد كلمة المرور الجديدة')).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByRole('button', { name: 'إعادة تعيين كلمة المرور' })).toBeInTheDocument();
    });

    it('should have reset code input with correct attributes', () => {
      renderResetPasswordPage('test@example.com');
      const resetCodeInput = screen.getByLabelText('رمز الاستعادة');
      expect(resetCodeInput).toHaveAttribute('inputMode', 'numeric');
      expect(resetCodeInput).toHaveAttribute('maxLength', '6');
      expect(resetCodeInput).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('should have new password input with type password by default', () => {
      renderResetPasswordPage('test@example.com');
      const passwordInput = screen.getByLabelText('كلمة المرور الجديدة');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have confirm password input with type password by default', () => {
      renderResetPasswordPage('test@example.com');
      const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور الجديدة');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('should display password requirements', () => {
      renderResetPasswordPage('test@example.com');
      expect(screen.getByText('8 أحرف على الأقل')).toBeInTheDocument();
    });
  });

  describe('form accessibility', () => {
    it('should have autocomplete for new-password on password field', () => {
      renderResetPasswordPage('test@example.com');
      const passwordInput = screen.getByLabelText('كلمة المرور الجديدة');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should have autocomplete for new-password on confirm password field', () => {
      renderResetPasswordPage('test@example.com');
      const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور الجديدة');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should have LTR direction on reset code input', () => {
      renderResetPasswordPage('test@example.com');
      const resetCodeInput = screen.getByLabelText('رمز الاستعادة');
      expect(resetCodeInput).toHaveAttribute('dir', 'ltr');
    });

    it('should have LTR direction on password inputs', () => {
      renderResetPasswordPage('test@example.com');
      const passwordInput = screen.getByLabelText('كلمة المرور الجديدة');
      const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور الجديدة');
      expect(passwordInput).toHaveAttribute('dir', 'ltr');
      expect(confirmPasswordInput).toHaveAttribute('dir', 'ltr');
    });
  });
});
