/**
 * Register Page
 * User registration with email/password
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useSignUp } from '../services/auth.service';
import { signUpRequestSchema, type SignUpFormData } from '../types/auth.types';
import { isApiError } from '@/core/network/types/apiError';
import toast from 'react-hot-toast';

export default function RegisterPage(): React.ReactElement {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  usePageTitle(t('register'));

  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpRequestSchema),
  });

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      await signUpMutation.mutateAsync({
        ...data,
        app_id: 'fawz',
      });

      toast.success(t('registerSuccess'));

      // Navigate to OTP verification with email
      navigate('/verify-email', {
        state: { email: data.email },
      });
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 409) {
          setError('email', { message: t('errors.emailExists') });
        } else if (error.isValidationError && error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof SignUpFormData, { message: messages[0] });
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
          {t('createAccount')}
        </h1>
        <p className="text-text-secondary">{t('registerSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('first_name')}
            type="text"
            label={t('firstName')}
            placeholder={t('firstNamePlaceholder')}
            error={errors.first_name?.message}
            leftIcon={<User className="h-5 w-5" />}
            autoComplete="given-name"
          />

          <Input
            {...register('last_name')}
            type="text"
            label={t('lastName')}
            placeholder={t('lastNamePlaceholder')}
            error={errors.last_name?.message}
            autoComplete="family-name"
          />
        </div>

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
          helperText={t('passwordRequirements')}
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
          autoComplete="new-password"
        />

        <Input
          {...register('confirm_password')}
          type={showConfirmPassword ? 'text' : 'password'}
          label={t('confirmPassword')}
          placeholder={t('confirmPasswordPlaceholder')}
          error={errors.confirm_password?.message}
          leftIcon={<Lock className="h-5 w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-text-muted hover:text-text-secondary transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
          dir="ltr"
          autoComplete="new-password"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={signUpMutation.isPending}
        >
          {t('registerButton')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          {t('hasAccount')}{' '}
          <Link
            to="/login"
            className="text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
          >
            {t('loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
