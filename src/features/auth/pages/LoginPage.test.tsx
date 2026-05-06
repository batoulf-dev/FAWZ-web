/**
 * LoginPage Tests
 * Tests for login page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './LoginPage';

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
        login: 'تسجيل الدخول',
        welcomeBack: 'مرحباً بعودتك',
        loginSubtitle: 'سجّل دخولك للمتابعة',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        password: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور',
        forgotPassword: 'نسيت كلمة المرور؟',
        loginButton: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        registerLink: 'إنشاء حساب',
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

// Mock useLogin hook
vi.mock('../services/auth.service', () => ({
  useLogin: () => ({
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

describe('LoginPage', () => {
  let queryClient: QueryClient;

  const renderLoginPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
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
      renderLoginPage();
      expect(screen.getByText('مرحباً بعودتك')).toBeInTheDocument();
    });

    it('should render welcome message', () => {
      renderLoginPage();
      expect(screen.getByRole('heading', { name: 'مرحباً بعودتك' })).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      renderLoginPage();
      expect(screen.getByText('سجّل دخولك للمتابعة')).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have email input', () => {
      renderLoginPage();
      expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    });

    it('should have password input', () => {
      renderLoginPage();
      expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderLoginPage();
      expect(screen.getByRole('button', { name: 'تسجيل الدخول' })).toBeInTheDocument();
    });

    it('should have email input with type email', () => {
      renderLoginPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password input with type password by default', () => {
      renderLoginPage();
      const passwordInput = screen.getByLabelText('كلمة المرور');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('navigation links', () => {
    it('should have forgot password link', () => {
      renderLoginPage();
      const forgotLink = screen.getByText('نسيت كلمة المرور؟');
      expect(forgotLink).toBeInTheDocument();
      expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
    });

    it('should have register link', () => {
      renderLoginPage();
      const registerLink = screen.getByText('إنشاء حساب');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    it('should display no account message', () => {
      renderLoginPage();
      expect(screen.getByText(/ليس لديك حساب/)).toBeInTheDocument();
    });
  });

  describe('form accessibility', () => {
    it('should have autocomplete for email', () => {
      renderLoginPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('should have autocomplete for password', () => {
      renderLoginPage();
      const passwordInput = screen.getByLabelText('كلمة المرور');
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });
  });
});
