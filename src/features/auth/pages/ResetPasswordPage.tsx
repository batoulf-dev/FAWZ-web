/**
 * Reset Password Page
 * Enter reset code and set new password
 */

import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useResetPassword } from '../services/auth.service';
import { passwordSchema } from '../types/auth.types';
import { isApiError } from '@/core/network/types/apiError';
import toast from 'react-hot-toast';

const resetPasswordFormSchema = z
  .object({
    verify_code: z
      .string()
      .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
      .regex(/^\d+$/, 'رمز التحقق يجب أن يكون أرقام فقط'),
    new_password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage(): React.ReactElement {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = (location.state as { email?: string })?.email;

  usePageTitle(t('resetPassword'));

  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  // Redirect if no email in state
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        verify_code: data.verify_code,
        new_password: data.new_password,
        confirm_new_password: data.confirm_password,
        code_type: 'ResetCode',
      });

      toast.success(t('passwordResetSuccess'));

      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      if (isApiError(error)) {
        if (error.status === 400) {
          setError('verify_code', { message: t('errors.invalidResetCode') });
        } else if (error.status === 404) {
          toast.error(t('errors.userNotFound'));
          navigate('/forgot-password');
        } else if (error.status === 410) {
          setError('verify_code', { message: t('errors.codeExpired') });
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
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        {t('common:back')}
      </button>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <KeyRound className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('resetPassword')}
        </h1>
        <p className="text-text-secondary">
          {t('resetPasswordSubtitle', { email })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('verify_code')}
          type="text"
          inputMode="numeric"
          maxLength={6}
          label={t('resetCode')}
          placeholder={t('resetCodePlaceholder')}
          error={errors.verify_code?.message}
          dir="ltr"
          autoComplete="one-time-code"
          className="text-center text-2xl tracking-widest"
        />

        <Input
          {...register('new_password')}
          type={showPassword ? 'text' : 'password'}
          label={t('newPassword')}
          placeholder={t('newPasswordPlaceholder')}
          error={errors.new_password?.message}
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
          label={t('confirmNewPassword')}
          placeholder={t('confirmNewPasswordPlaceholder')}
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
          isLoading={resetPasswordMutation.isPending}
        >
          {t('resetPasswordButton')}
        </Button>
      </form>
    </div>
  );
}
