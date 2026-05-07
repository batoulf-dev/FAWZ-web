/**
 * DisputeStatusPage
 * SCR-018: Dispute History
 * Route: /disputes
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton } from '@/shared/components/Skeleton';
import {
  useDisputes,
  type Dispute,
  type DisputeStatus,
  DISPUTE_TYPE_LABELS_AR,
  DISPUTE_STATUS_LABELS_AR,
} from '../index';

export default function DisputeStatusPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Fetch disputes
  const {
    data: disputesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useDisputes({ sort_by: 'submitted_at', sort_order: 'desc' });

  const disputes = disputesData?.disputes_list ?? [];
  const hasDisputes = disputes.length > 0;

  // Handle back navigation
  const handleBack = (): void => {
    navigate(-1);
  };

  // Handle new dispute
  const handleNewDispute = (): void => {
    navigate('/disputes/new');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-bg-primary">
        <DisputeHistoryHeader onBack={handleBack} onNew={handleNewDispute} />
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <DisputeSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-bg-primary">
        <DisputeHistoryHeader onBack={handleBack} onNew={handleNewDispute} />
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
    <div className="bg-bg-primary pb-20">
      <DisputeHistoryHeader onBack={handleBack} onNew={handleNewDispute} />

      <div className="py-4 space-y-3">
        {!hasDisputes ? (
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title={t('disputes.empty')}
            description={t('disputes.emptyDesc')}
            actionLabel={t('disputes.submit')}
            onAction={handleNewDispute}
          />
        ) : (
          disputes.map((dispute) => (
            <DisputeCard key={dispute.dispute_id} dispute={dispute} isArabic={isArabic} />
          ))
        )}
      </div>
    </div>
  );
}

// Header component
interface DisputeHistoryHeaderProps {
  onBack: () => void;
  onNew: () => void;
}

function DisputeHistoryHeader({ onBack, onNew }: DisputeHistoryHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ArrowRight className="h-5 w-5 ltr:rotate-180" />}
          />
          <h1 className="text-xl font-bold text-text-primary">
            {t('disputes.history')}
          </h1>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onNew}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          {t('disputes.submit')}
        </Button>
      </div>
    </div>
  );
}

// Dispute card component
interface DisputeCardProps {
  dispute: Dispute;
  isArabic: boolean;
}

function DisputeCard({ dispute, isArabic }: DisputeCardProps): JSX.Element {
  const { t } = useTranslation();

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status icon and color
  const getStatusDetails = (status?: DisputeStatus) => {
    switch (status) {
      case 'resolved':
      case 'auto_resolved':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'success' as const,
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          variant: 'error' as const,
        };
      case 'under_review':
      case 'pending_review':
      case 'submitted':
      case 'auto_checking':
        return {
          icon: <Clock className="h-4 w-4" />,
          variant: 'warning' as const,
        };
      case 'escalated':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          variant: 'info' as const,
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          variant: 'default' as const,
        };
    }
  };

  const statusDetails = getStatusDetails(dispute.status);
  const statusLabel = dispute.status
    ? isArabic
      ? DISPUTE_STATUS_LABELS_AR[dispute.status]
      : t(`disputes.status${formatStatusKey(dispute.status)}`)
    : '';

  return (
    <Card variant="outlined" className="space-y-3">
      {/* Header: Type and Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary line-clamp-1">
            {isArabic
              ? DISPUTE_TYPE_LABELS_AR[dispute.dispute_type]
              : formatDisputeType(dispute.dispute_type)}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            {dispute.dispute_number}
          </p>
        </div>
        <Badge variant={statusDetails.variant} className="shrink-0">
          {statusDetails.icon}
          <span className="ms-1">{statusLabel}</span>
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary line-clamp-2">
        {dispute.description}
      </p>

      {/* Footer: Date */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border-default">
        <span>
          {isArabic ? 'تاريخ التقديم' : 'Submitted'}: {formatDate(dispute.submitted_at)}
        </span>
        {dispute.resolved_at && (
          <span>
            {isArabic ? 'تم الحل' : 'Resolved'}: {formatDate(dispute.resolved_at)}
          </span>
        )}
      </div>

      {/* Resolution notes if resolved */}
      {dispute.resolution_notes && (
        <div className="bg-bg-muted rounded-lg p-3">
          <p className="text-xs text-text-muted mb-1">
            {isArabic ? 'ملاحظات القرار' : 'Resolution Notes'}
          </p>
          <p className="text-sm text-text-secondary">{dispute.resolution_notes}</p>
        </div>
      )}
    </Card>
  );
}

// Helper to format status key for i18n
function formatStatusKey(status: DisputeStatus): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Helper to format dispute type for English display
function formatDisputeType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Loading skeleton
function DisputeSkeleton(): JSX.Element {
  return (
    <Card variant="outlined" className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <Skeleton height={16} className="w-48" />
          <Skeleton height={12} className="w-24" />
        </div>
        <Skeleton height={24} className="w-20" rounded="full" />
      </div>
      <Skeleton height={14} className="w-full" />
      <Skeleton height={14} className="w-3/4" />
      <div className="pt-2 border-t border-border-default">
        <Skeleton height={12} className="w-32" />
      </div>
    </Card>
  );
}
