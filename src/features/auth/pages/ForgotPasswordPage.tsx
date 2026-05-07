/**
 * Forgot Password Page
 * Request password reset code via email
 */

import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Mail, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useForgotPassword } from '../services/auth.service';
import { isApiError } from '@/core/network/types/apiError';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();

  usePageTitle(t('forgotPassword'));

  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      await forgotPasswordMutation.mutateAsync({
        email: data.email,
      });

      toast.success(t('resetCodeSent'));

      // Navigate to reset password page with email
      navigate('/reset-password', {
        state: { email: data.email },
      });
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 404) {
          setError('email', { message: t('errors.userNotFound') });
        } else if (error.status === 429) {
          toast.error(t('errors.tooManyRequests'));
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
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowRight className="h-4 w-4 ltr:rotate-180" />
        {t('common:back')}
      </button>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <KeyRound className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('forgotPassword')}
        </h1>
        <p className="text-text-secondary">
          {t('forgotPasswordSubtitle')}
        </p>
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

        <Button
          type="submit"
          fullWidth
          isLoading={forgotPasswordMutation.isPending}
        >
          {t('sendResetCode')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-text-secondary">
          {t('rememberPassword')}{' '}
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
