/**
 * MediaConsentModal
 * SCR-016: Media Consent Form
 * Shown to winners for media participation consent
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tv, Check, X } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { useSubmitMediaConsent } from '../index';
import toast from 'react-hot-toast';

interface MediaConsentModalProps {
  isOpen: boolean;
  onComplete: (consented: boolean) => void;
  onClose: () => void;
  drawId?: string;
  prizeTier?: string;
}

export function MediaConsentModal({
  isOpen,
  onComplete,
  onClose,
  drawId: _drawId,
  prizeTier,
}: MediaConsentModalProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [selection, setSelection] = useState<boolean | null>(null);
  const submitMutation = useSubmitMediaConsent();

  const handleSubmit = (): void => {
    if (selection === null) {
      toast.error(t('consent.required'));
      return;
    }

    submitMutation.mutate(selection, {
      onSuccess: () => {
        onComplete(selection);
      },
      onError: () => {
        toast.error(t('errors.general'));
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('consent.mediaTitle')}
      size="md"
      closeOnOverlayClick={false}
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-brand-secondary/10 text-brand-secondary">
            <Tv className="h-10 w-10" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <p className="text-text-primary text-lg font-medium">
            {isArabic ? 'الموافقة على الظهور الإعلامي' : 'Media Consent'}
          </p>

          <div className="bg-bg-muted rounded-lg p-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              {t('consent.mediaBody')}
            </p>
          </div>

          {/* Prize context if available */}
          {prizeTier && (
            <p className="text-sm text-brand-primary font-medium">
              {isArabic
                ? `تهانينا! لقد فزت بجائزة ${prizeTier}`
                : `Congratulations! You won a ${prizeTier} prize`}
            </p>
          )}
        </div>

        {/* Selection */}
        <div className="space-y-3">
          <RadioOption
            selected={selection === true}
            onSelect={() => setSelection(true)}
            label={t('consent.mediaAccept')}
            icon={<Check className="h-5 w-5" />}
            variant="accept"
          />
          <RadioOption
            selected={selection === false}
            onSelect={() => setSelection(false)}
            label={t('consent.mediaDecline')}
            icon={<X className="h-5 w-5" />}
            variant="decline"
          />
        </div>

        {/* Submit button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          isLoading={submitMutation.isPending}
          disabled={selection === null}
        >
          {t('common.confirm')}
        </Button>

        {/* Note */}
        <p className="text-xs text-text-muted text-center">
          {isArabic
            ? 'يمكنك تغيير قرارك لاحقاً من إعدادات الملف الشخصي'
            : 'You can change your decision later from profile settings'}
        </p>
      </div>
    </Modal>
  );
}

// Radio option component
interface RadioOptionProps {
  selected: boolean;
  onSelect: () => void;
  label: string;
  icon: React.ReactNode;
  variant: 'accept' | 'decline';
}

function RadioOption({
  selected,
  onSelect,
  label,
  icon,
  variant,
}: RadioOptionProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all',
        'hover:bg-bg-muted/50',
        selected
          ? variant === 'accept'
            ? 'border-success bg-success/5'
            : 'border-error bg-error/5'
          : 'border-border-default',
      )}
    >
      {/* Radio circle */}
      <div
        className={cn(
          'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
          selected
            ? variant === 'accept'
              ? 'border-success bg-success text-white'
              : 'border-error bg-error text-white'
            : 'border-border-default',
        )}
      >
        {selected && icon}
      </div>

      {/* Label */}
      <span
        className={cn(
          'text-sm font-medium',
          selected
            ? variant === 'accept'
              ? 'text-success'
              : 'text-error'
            : 'text-text-primary',
        )}
      >
        {label}
      </span>
    </button>
  );
}
