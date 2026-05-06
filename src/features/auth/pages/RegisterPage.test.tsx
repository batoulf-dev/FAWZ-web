/**
 * RegisterPage Tests
 * Tests for register page rendering and form structure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterPage from './RegisterPage';

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
        register: 'إنشاء حساب',
        createAccount: 'إنشاء حساب جديد',
        registerSubtitle: 'أنشئ حسابك للبدء',
        firstName: 'الاسم الأول',
        firstNamePlaceholder: 'أدخل اسمك الأول',
        lastName: 'الاسم الأخير',
        lastNamePlaceholder: 'أدخل اسمك الأخير',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        password: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
        passwordRequirements: '8 أحرف على الأقل',
        registerButton: 'إنشاء حساب',
        hasAccount: 'لديك حساب بالفعل؟',
        loginLink: 'تسجيل الدخول',
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

// Mock useSignUp hook
vi.mock('../services/auth.service', () => ({
  useSignUp: () => ({
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

describe('RegisterPage', () => {
  let queryClient: QueryClient;

  const renderRegisterPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RegisterPage />
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
      renderRegisterPage();
      expect(screen.getByText('إنشاء حساب جديد')).toBeInTheDocument();
    });

    it('should render create account heading', () => {
      renderRegisterPage();
      expect(screen.getByRole('heading', { name: 'إنشاء حساب جديد' })).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      renderRegisterPage();
      expect(screen.getByText('أنشئ حسابك للبدء')).toBeInTheDocument();
    });
  });

  describe('form elements', () => {
    it('should have first name input', () => {
      renderRegisterPage();
      expect(screen.getByLabelText('الاسم الأول')).toBeInTheDocument();
    });

    it('should have last name input', () => {
      renderRegisterPage();
      expect(screen.getByLabelText('الاسم الأخير')).toBeInTheDocument();
    });

    it('should have email input', () => {
      renderRegisterPage();
      expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    });

    it('should have password input', () => {
      renderRegisterPage();
      expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
    });

    it('should have confirm password input', () => {
      renderRegisterPage();
      expect(screen.getByLabelText('تأكيد كلمة المرور')).toBeInTheDocument();
    });

    it('should have submit button', () => {
      renderRegisterPage();
      expect(screen.getByRole('button', { name: 'إنشاء حساب' })).toBeInTheDocument();
    });

    it('should have email input with type email', () => {
      renderRegisterPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password input with type password by default', () => {
      renderRegisterPage();
      const passwordInput = screen.getByLabelText('كلمة المرور');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have confirm password input with type password by default', () => {
      renderRegisterPage();
      const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    it('should display password requirements', () => {
      renderRegisterPage();
      expect(screen.getByText('8 أحرف على الأقل')).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should have login link', () => {
      renderRegisterPage();
      const loginLink = screen.getByText('تسجيل الدخول');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });

    it('should display has account message', () => {
      renderRegisterPage();
      expect(screen.getByText(/لديك حساب بالفعل/)).toBeInTheDocument();
    });
  });

  describe('form accessibility', () => {
    it('should have autocomplete for email', () => {
      renderRegisterPage();
      const emailInput = screen.getByLabelText('البريد الإلكتروني');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('should have autocomplete for given-name', () => {
      renderRegisterPage();
      const firstNameInput = screen.getByLabelText('الاسم الأول');
      expect(firstNameInput).toHaveAttribute('autocomplete', 'given-name');
    });

    it('should have autocomplete for family-name', () => {
      renderRegisterPage();
      const lastNameInput = screen.getByLabelText('الاسم الأخير');
      expect(lastNameInput).toHaveAttribute('autocomplete', 'family-name');
    });

    it('should have autocomplete for new-password on password field', () => {
      renderRegisterPage();
      const passwordInput = screen.getByLabelText('كلمة المرور');
      expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should have autocomplete for new-password on confirm password field', () => {
      renderRegisterPage();
      const confirmPasswordInput = screen.getByLabelText('تأكيد كلمة المرور');
      expect(confirmPasswordInput).toHaveAttribute('autocomplete', 'new-password');
    });
  });
});
