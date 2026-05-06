/**
 * Login Page
 * Email/password authentication
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useAuthStore } from '@/stores/auth.store';
import { useLogin } from '../services/auth.service';
import { loginRequestSchema, type LoginFormData } from '../types/auth.types';
import { isApiError } from '@/core/network/types/apiError';
import toast from 'react-hot-toast';

export default function LoginPage(): React.ReactElement {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: string })?.from ?? '/';

  usePageTitle(t('login'));

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginRequestSchema),
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await loginMutation.mutateAsync(data);

      // Set auth state
      if (response.user && response.access_token) {
        setAuth(response.user, {
          access_token: response.access_token,
          token_type: 'Bearer',
          expires_in: 3600,
        });
      }

      // Navigate to intended destination
      navigate(from, { replace: true });
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 401) {
          setError('password', { message: t('errors.invalidCredentials') });
        } else if (error.status === 404) {
          setError('email', { message: t('errors.userNotFound') });
        } else if (error.isValidationError && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof LoginFormData, { message: messages[0] });
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(t('errors.networkError'));
      }
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('welcomeBack')}
        </h1>
        <p className="text-text-secondary">{t('loginSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label={t('email')}
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
          leftIcon={<Mail className="h-5 w-5" />}
          dir="ltr"
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label={t('password')}
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          leftIcon={<Lock className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
          dir="ltr"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={loginMutation.isPending}
        >
          {t('loginButton')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          {t('noAccount')}{' '}
          <Link
            to="/register"
            className="text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
          >
            {t('registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
