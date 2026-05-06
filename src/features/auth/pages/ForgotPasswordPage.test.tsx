/**
 * ForgotPasswordPage Tests
 * Tests for forgot password page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ForgotPasswordPage from './ForgotPasswordPage';

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
    t: (key: string) => {
      const translations: Record<string, string> = {
        forgotPassword: 'نسيت كلمة المرور',
        forgotPasswordSubtitle: 'أدخل بريدك الإلكتروني لاستعادة كلمة المرور',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        sendResetCode: 'إرسال رمز الاستعادة',
        rememberPassword: 'تذكرت كلمة المرور؟',
        loginLink: 'تسجيل الدخول',
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

// Mock useForgotPassword hook
vi.mock('../services/auth.service', () => ({
  useForgotPassword: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
  };
});

describe('ForgotPasswordPage', () => {
  let queryClient: QueryClient;

  const renderForgotPasswordPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ForgotPasswordPage />
        </BrowserRouter>
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

  describe('rendering', () => {
    it('should render the page', () => {
      renderForgotPasswordPage();
      expect(screen.getByText('نسيت كلمة المرور')).toBeInTheDocument();
    });

    it('should render forgot password heading', () => {
      renderForgotPasswordPage();
      expect(screen.getByRole('heading', { name: 'نسيت كلمة المرور' })).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      renderForgotPasswordPage();
      expect(screen.getByText('أدخل بريدك الإلكتروني لاستعادة كلمة المرور')).toBeInTheDocument();
    });

    it('should have back button', () => {
      renderForgotPasswordPage();
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });

    it('should render key icon in circular container', () => {
      renderForgotPasswordPage();
      const iconContainer = document.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have email input', () => {
      renderForgotPasswordPage();
      expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderForgotPasswordPage();
      expect(screen.getByRole('button', { name: 'إرسال رمز الاستعادة' })).toBeInTheDocument();
    });

    it('should have email input with type email', () => {
      renderForgotPasswordPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have placeholder text on email input', () => {
      renderForgotPasswordPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('placeholder', 'أدخل بريدك الإلكتروني');
    });
  });

  describe('navigation links', () => {
    it('should have login link', () => {
      renderForgotPasswordPage();
      const loginLink = screen.getByText('تسجيل الدخول');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });

    it('should display remember password message', () => {
      renderForgotPasswordPage();
      expect(screen.getByText(/تذكرت كلمة المرور/)).toBeInTheDocument();
    });
  });

  describe('form accessibility', () => {
    it('should have autocomplete for email', () => {
      renderForgotPasswordPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('should have LTR direction on email input', () => {
      renderForgotPasswordPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('dir', 'ltr');
    });
  });
});
