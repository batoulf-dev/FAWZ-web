/**
 * ConsentPage
 * Route: /profile/consent
 * Shows consent status and allows managing consent settings
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ArrowRight, FileText, Tv, Check, X } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton } from '@/shared/components/Skeleton';
import { useConsentStatus } from '../index';
import { ShariaDisclosureModal } from '../components/ShariaDisclosureModal';
import { MediaConsentModal } from '../components/MediaConsentModal';

export default function ConsentPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Fetch consent status
  const {
    data: consentStatus,
    isLoading,
    isError,
    error,
    refetch,
  } = useConsentStatus();

  // Modal states
  const [showShariaModal, setShowShariaModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  // Handle back navigation
  const handleBack = (): void => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-bg-primary">
        <ConsentHeader onBack={handleBack} />
        <div className="p-4 space-y-4">
          <ConsentSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-bg-primary">
        <ConsentHeader onBack={handleBack} />
        <ErrorState
          title={t('errors.general')}
          message={error instanceof Error ? error.message : t('errors.serverError')}
          onRetry={() => refetch()}
          className="mt-12"
        />
      </div>
    );
  }

  return (
    <div className="bg-bg-primary">
      <ConsentHeader onBack={handleBack} />

      <div className="py-4 space-y-4">
        <p className="text-sm text-text-secondary">
          {isArabic
            ? 'إدارة موافقاتك القانونية'
            : 'Manage your legal consents'}
        </p>

        <Card variant="outlined" padding="none">
          {/* Sharia Disclosure */}
          <ConsentRow
            icon={<FileText className="h-5 w-5 text-brand-primary" />}
            title={t('consent.shariaTitle')}
            description={
              isArabic
                ? 'الموافقة على شروط برنامج فوز'
                : 'Agreement to Fawz program terms'
            }
            isAccepted={consentStatus?.shariaDisclosureAccepted ?? false}
            acceptedAt={consentStatus?.shariaDisclosureAcceptedAt}
            onReview={() => setShowShariaModal(true)}
          />

          {/* Media Consent */}
          <ConsentRow
            icon={<Tv className="h-5 w-5 text-brand-secondary" />}
            title={t('consent.mediaTitle')}
            description={
              isArabic
                ? 'الموافقة على الظهور في البث التلفزيوني'
                : 'Consent for TV broadcast appearance'
            }
            isAccepted={consentStatus?.mediaConsentDecision ?? undefined}
            acceptedAt={consentStatus?.mediaConsentDecisionAt}
            onReview={() => setShowMediaModal(true)}
            showBorder={false}
          />
        </Card>
      </div>

      {/* Modals */}
      <ShariaDisclosureModal
        isOpen={showShariaModal}
        onAccept={() => {
          setShowShariaModal(false);
          refetch();
        }}
        onClose={() => setShowShariaModal(false)}
      />

      <MediaConsentModal
        isOpen={showMediaModal}
        onComplete={() => {
          setShowMediaModal(false);
          refetch();
        }}
        onClose={() => setShowMediaModal(false)}
      />
    </div>
  );
}

// Header component
interface ConsentHeaderProps {
  onBack: () => void;
}

function ConsentHeader({ onBack }: ConsentHeaderProps): JSX.Element {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

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
          {isArabic ? 'الموافقات' : 'Consents'}
        </h1>
      </div>
    </div>
  );
}

// Consent row component
interface ConsentRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAccepted: boolean | undefined;
  acceptedAt?: string;
  onReview: () => void;
  showBorder?: boolean;
}

function ConsentRow({
  icon,
  title,
  description,
  isAccepted,
  acceptedAt,
  onReview,
  showBorder = true,
}: ConsentRowProps): JSX.Element {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Format date
  const formatDate = (dateString?: string): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (): JSX.Element | null => {
    if (isAccepted === undefined) {
      return (
        <Badge variant="warning">
          {isArabic ? 'غير محدد' : 'Not set'}
        </Badge>
      );
    }
    if (isAccepted) {
      return (
        <Badge variant="success">
          <Check className="h-3 w-3 me-1" />
          {isArabic ? 'موافق' : 'Accepted'}
        </Badge>
      );
    }
    return (
      <Badge variant="error">
        <X className="h-3 w-3 me-1" />
        {isArabic ? 'رافض' : 'Declined'}
      </Badge>
    );
  };

  return (
    <button
      type="button"
      onClick={onReview}
      className={cn(
        'w-full flex items-start gap-3 p-4',
        'hover:bg-bg-muted/50 transition-colors text-start',
        showBorder && 'border-b border-border-default',
      )}
    >
      {/* Icon */}
      <div className="shrink-0 mt-1">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-text-primary">{title}</span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-text-muted mt-0.5">{description}</p>
        {acceptedAt && (
          <p className="text-xs text-text-muted mt-1">
            {isArabic ? 'تم في' : 'On'} {formatDate(acceptedAt)}
          </p>
        )}
      </div>
    </button>
  );
}

// Loading skeleton
function ConsentSkeleton(): JSX.Element {
  return (
    <Card variant="outlined" padding="none">
      {[1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'flex items-start gap-3 p-4',
            i === 1 && 'border-b border-border-default',
          )}
        >
          <Skeleton width={40} height={40} rounded="full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton height={16} className="w-32" />
              <Skeleton height={20} className="w-16" rounded="full" />
            </div>
            <Skeleton height={14} className="w-48" />
          </div>
        </div>
      ))}
    </Card>
  );
}
