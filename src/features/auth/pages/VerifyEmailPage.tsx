/**
 * Verify Email Page
 * OTP verification for email
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useAuthStore } from '@/stores/auth.store';
import { useVerifyEmail, useRequestCode } from '../services/auth.service';
import { verifyEmailRequestSchema, type OtpFormData } from '../types/auth.types';
import { isApiError } from '@/core/network/types/apiError';
import toast from 'react-hot-toast';

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailPage(): React.ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const email = (location.state as { email?: string })?.email;
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);

  usePageTitle(t('verifyEmail'));

  const verifyMutation = useVerifyEmail();
  const resendMutation = useRequestCode();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OtpFormData>({
    resolver: zodResolver(verifyEmailRequestSchema.pick({ verify_code: true })),
  });

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Redirect if no email
  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const onSubmit = async (data: OtpFormData): Promise<void> => {
    try {
      const response = await verifyMutation.mutateAsync({
        email,
        verify_code: data.verify_code,
      });

      toast.success(t('verifySuccess'));

      // Set auth state if tokens returned
      if (response.access_token) {
        setAuth(
          {
            id: '',
            phone: '',
            email,
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            access_token: response.access_token,
            token_type: 'Bearer',
            expires_in: 3600,
          },
        );
      }

      // Navigate to home or login
      navigate('/');
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 400) {
          setError('verify_code', { message: t('errors.invalidOtp') });
        } else if (error.status === 404) {
          toast.error(t('errors.userNotFound'));
          navigate('/register');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(t('errors.networkError'));
      }
    }
  };

  const handleResend = async (): Promise<void> => {
    if (resendCooldown > 0) return;

    try {
      await resendMutation.mutateAsync({
        email,
        code_type: 'EmailVerification',
      });

      toast.success(t('otpResent'));
      setResendCooldown(RESEND_COOLDOWN);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.message);
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
          <Mail className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('verifyEmail')}
        </h1>
        <p className="text-text-secondary">
          {t('otpSentToEmail', { email })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('verify_code')}
          type="text"
          inputMode="numeric"
          maxLength={6}
          label={t('verificationCode')}
          placeholder={t('otpPlaceholder')}
          error={errors.verify_code?.message}
          dir="ltr"
          autoComplete="one-time-code"
          className="text-center text-2xl tracking-widest"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={verifyMutation.isPending}
        >
          {t('verifyButton')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendMutation.isPending}
            className="text-sm text-brand-primary disabled:text-text-muted"
          >
            {resendCooldown > 0
              ? t('resendOtpIn', { seconds: resendCooldown })
              : t('resendOtp')}
          </button>
        </div>
      </form>
    </div>
  );
}
