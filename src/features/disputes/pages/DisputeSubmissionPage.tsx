/**
 * DisputeSubmissionPage
 * SCR-017: Dispute Submission Form
 * Route: /disputes/new
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, AlertCircle, Send } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Skeleton } from '@/shared/components/Skeleton';
import {
  useCanSubmitDispute,
  useSubmitDispute,
  DisputeFormSchema,
  type DisputeFormValues,
  type DisputeType,
  DISPUTE_TYPE_LABELS_AR,
} from '../index';
import toast from 'react-hot-toast';

// Dispute type options
const DISPUTE_TYPES: DisputeType[] = [
  'missing_prize',
  'incorrect_entry_count',
  'draw_result_dispute',
  'referral_reward_not_received',
  'account_suspension_dispute',
  'prize_cap_hold_dispute',
  'merchant_shared_entry_missing',
  'retroactive_seeding_error',
];

export default function DisputeSubmissionPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Check if user can submit
  const { canSubmit, remainingDisputes, isLoading: isCheckingLimit } = useCanSubmitDispute();

  // Submit mutation
  const submitMutation = useSubmitDispute();

  // Form setup
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DisputeFormValues>({
    resolver: zodResolver(DisputeFormSchema),
    defaultValues: {
      disputeType: undefined,
      description: '',
      claimedFawzNumber: '',
      relatedDrawId: null,
    },
  });

  // Handle back navigation
  const handleBack = (): void => {
    navigate(-1);
  };

  // Handle form submission
  const onSubmit = (data: DisputeFormValues): void => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('disputes.success'));
        reset();
        navigate('/disputes');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t('errors.general'));
      },
    });
  };

  // Loading state
  if (isCheckingLimit) {
    return (
      <div className="bg-bg-primary">
        <DisputeHeader onBack={handleBack} />
        <div className="p-4">
          <DisputeFormSkeleton />
        </div>
      </div>
    );
  }

  // Blocked state (limit reached)
  if (!canSubmit) {
    return (
      <div className="bg-bg-primary">
        <DisputeHeader onBack={handleBack} />
        <div className="p-4">
          <Card variant="outlined" className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-warning-light text-warning">
                <AlertCircle className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {t('disputes.limitReached')}
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              {isArabic
                ? 'يمكنك تقديم 3 شكاوى شهرياً فقط'
                : 'You can only submit 3 disputes per month'}
            </p>
            <Button variant="outline" onClick={() => navigate('/disputes')}>
              {t('disputes.history')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary pb-20">
      <DisputeHeader onBack={handleBack} />

      <form onSubmit={handleSubmit(onSubmit)} className="py-4 space-y-4">
        {/* Remaining disputes indicator */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <AlertCircle className="h-4 w-4" />
          <span>
            {isArabic
              ? `${remainingDisputes} شكاوى متبقية هذا الشهر`
              : `${remainingDisputes} disputes remaining this month`}
          </span>
        </div>

        {/* Dispute Type Select */}
        <Card variant="outlined">
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('disputes.typeLabel')} *
          </label>
          <Controller
            name="disputeType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border bg-bg-card text-text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
                  errors.disputeType ? 'border-error' : 'border-border-default',
                )}
              >
                <option value="">{t('disputes.typePlaceholder')}</option>
                {DISPUTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {isArabic ? DISPUTE_TYPE_LABELS_AR[type] : t(`disputes.type${formatTypeKey(type)}`)}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.disputeType && (
            <p className="mt-1 text-sm text-error">{t('disputes.typePlaceholder')}</p>
          )}
        </Card>

        {/* Description */}
        <Card variant="outlined">
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('disputes.descriptionLabel')} *
          </label>
          <textarea
            {...register('description')}
            placeholder={t('disputes.descriptionPlaceholder')}
            rows={5}
            maxLength={500}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-bg-card text-text-primary resize-none',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
              'placeholder:text-text-muted',
              errors.description ? 'border-error' : 'border-border-default',
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description.message}</p>
          )}
        </Card>

        {/* Fawz Number (Optional) */}
        <Card variant="outlined">
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('disputes.fawzNumberLabel')}
          </label>
          <Input
            {...register('claimedFawzNumber')}
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder={t('disputes.fawzNumberPlaceholder')}
            error={errors.claimedFawzNumber?.message}
            dir="ltr"
          />
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={submitMutation.isPending || isSubmitting}
          leftIcon={<Send className="h-5 w-5" />}
        >
          {t('disputes.submitButton')}
        </Button>
      </form>
    </div>
  );
}

// Header component
interface DisputeHeaderProps {
  onBack: () => void;
}

function DisputeHeader({ onBack }: DisputeHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowRight className="h-5 w-5 ltr:rotate-180" />}
        />
        <h1 className="text-xl font-bold text-text-primary">
          {t('disputes.submit')}
        </h1>
      </div>
    </div>
  );
}

// Helper to format type key for i18n
function formatTypeKey(type: DisputeType): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Loading skeleton
function DisputeFormSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      <Skeleton height={16} className="w-48" />
      <Card variant="outlined">
        <Skeleton height={16} className="w-24 mb-2" />
        <Skeleton height={48} className="w-full" rounded="lg" />
      </Card>
      <Card variant="outlined">
        <Skeleton height={16} className="w-24 mb-2" />
        <Skeleton height={120} className="w-full" rounded="lg" />
      </Card>
      <Card variant="outlined">
        <Skeleton height={16} className="w-32 mb-2" />
        <Skeleton height={48} className="w-full" rounded="lg" />
      </Card>
      <Skeleton height={48} className="w-full" rounded="lg" />
    </div>
  );
}
