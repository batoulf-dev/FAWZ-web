/**
 * OTP Verification Page
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { otpVerificationSchema, type OtpVerificationData } from '@/core/utils/validators';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useAuthStore } from '@/stores/auth.store';

const RESEND_COOLDOWN = 60; // seconds

export default function OtpPage(): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const phone = (location.state as { phone?: string })?.phone;
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);

  usePageTitle(t('auth.otp'));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpVerificationData>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { phone: phone ?? '' },
  });

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Redirect if no phone number
  if (!phone) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (data: OtpVerificationData): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: Call API to verify OTP
      // eslint-disable-next-line no-console
      console.log('Verifying OTP:', data);

      // Mock successful auth
      setAuth(
        {
          id: '1',
          phone: data.phone,
          name: 'Test User',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          access_token: 'mock_access_token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      );

      navigate('/');
    } catch (error) {
      console.error('OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    if (resendCooldown > 0) return;

    try {
      // TODO: Call API to resend OTP
      // eslint-disable-next-line no-console
      console.log('Resending OTP to:', phone);
      setResendCooldown(RESEND_COOLDOWN);
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        {t('common.back')}
      </button>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          {t('auth.otp')}
        </h2>
        <p className="text-text-secondary">
          {t('auth.otpSent', { phone })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('phone')} />

        <Input
          {...register('otp')}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder={t('auth.otpPlaceholder')}
          error={errors.otp?.message}
          dir="ltr"
          autoComplete="one-time-code"
          className="text-center text-2xl tracking-widest"
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          {t('auth.verifyOtp')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-brand-primary disabled:text-text-muted"
          >
            {resendCooldown > 0
              ? t('auth.resendOtpIn', { seconds: resendCooldown })
              : t('auth.resendOtp')}
          </button>
        </div>
      </form>
    </div>
  );
}
