/**
 * SCR-009: Referral Screen (Golden Ticket)
 * Share referral link with friends
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Users, Copy, Clock, AlertTriangle, ChevronLeft, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useMyReferralLink, useReferralStats, useReferralShareData } from '../services/referrals.service';
import { formatNumber } from '@/core/utils/formatters';
import toast from 'react-hot-toast';

// Stats card component
function StatsCard({
  count,
  entries,
  cash,
}: {
  count: number;
  entries: number;
  cash: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-text-primary">{count}</p>
          <p className="text-xs text-text-secondary">
            {t('referral.successfulCount')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-brand-gold">{entries}</p>
          <p className="text-xs text-text-secondary">
            {t('referral.entriesEarned')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-brand-primary">
            {formatNumber(cash, lang)}
          </p>
          <p className="text-xs text-text-secondary">
            {t('referral.cashEarned')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Link card component
function ReferralLinkCard({
  link,
  expiresAt,
  onCopy,
  onShowQR,
}: {
  link: string;
  expiresAt: string;
  onCopy: () => void;
  onShowQR: () => void;
}) {
  const { t } = useTranslation();

  const daysUntilExpiry = Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10 border-brand-gold/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">
            {t('referral.yourLink')}
          </h3>
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <Clock className="h-4 w-4" />
            <span>{t('referral.expiresIn', { days: daysUntilExpiry })}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 mb-3 flex items-center justify-between">
          <p className="text-brand-primary font-mono text-sm truncate flex-1">
            {link}
          </p>
          <button
            onClick={onCopy}
            className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <Button onClick={onCopy} className="flex-1">
            <Copy className="h-4 w-4 me-2" />
            {t('referral.copyLink')}
          </Button>
          <Button variant="outline" onClick={onShowQR} className="px-4">
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Reward explanation card
function RewardExplanation() {
  const { t } = useTranslation();

  return (
    <Card className="bg-surface-secondary">
      <CardContent className="p-4">
        <h3 className="font-semibold text-text-primary mb-3">
          {t('referral.howItWorks')}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
              ١
            </div>
            <p className="text-text-secondary text-sm">
              {t('referral.step1')}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
              ٢
            </div>
            <p className="text-text-secondary text-sm">
              {t('referral.step2')}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold">
              ٣
            </div>
            <p className="text-text-secondary text-sm">
              <span className="font-semibold text-brand-gold">
                {t('referral.step3')}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function ReferralSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

export default function ReferralPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('referral.goldenTicket'));

  const {
    data: referralLink,
    isLoading: linkLoading,
    error: linkError,
    refetch: refetchLink,
  } = useMyReferralLink();

  const {
    data: stats,
    isLoading: statsLoading,
  } = useReferralStats();

  const { shareData } = useReferralShareData();

  const isLoading = linkLoading || statsLoading;

  const handleCopyLink = async () => {
    if (!referralLink?.short_url) return;

    try {
      await navigator.clipboard.writeText(referralLink.short_url);
      toast.success(t('referral.linkCopied'));
    } catch {
      toast.error(t('referral.copyFailed'));
    }
  };

  const handleWhatsAppShare = () => {
    if (!shareData?.whatsappUrl) return;
    window.open(shareData.whatsappUrl, '_blank');
  };

  const handleShowQR = () => {
    // In production, show QR modal
    toast.success(t('referral.qrFeatureComingSoon'));
  };

  // Check if near monthly limit
  const isNearLimit = (stats?.referral_count_month ?? 0) >= 8;
  const monthlyCount = stats?.referral_count_month ?? 0;

  if (!isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('referral.offlineMessage')}
          onRetry={undefined}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('referral.goldenTicket')}
          </h1>
          <ReferralSkeleton />
        </div>
      </div>
    );
  }

  if (linkError) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetchLink()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {t('referral.goldenTicket')}
          </h1>
          <Users className="h-6 w-6 text-brand-gold" />
        </div>

        {/* Near Limit Warning */}
        {isNearLimit && (
          <Card className="bg-warning/10 border-warning">
            <CardContent className="p-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                {t('referral.nearLimitWarning', { count: monthlyCount })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {stats && (
          <StatsCard
            count={stats.successful_referrals}
            entries={stats.entries_earned}
            cash={stats.cash_earned_iqd}
          />
        )}

        {/* Referral Link */}
        {referralLink && (
          <ReferralLinkCard
            link={referralLink.short_url}
            expiresAt={referralLink.expires_at}
            onCopy={handleCopyLink}
            onShowQR={handleShowQR}
          />
        )}

        {/* WhatsApp Share */}
        <Button
          onClick={handleWhatsAppShare}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <svg className="h-5 w-5 me-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t('referral.shareWhatsApp')}
        </Button>

        {/* How It Works */}
        <RewardExplanation />

        {/* View History Link */}
        <button
          onClick={() => navigate('/referral/history')}
          className="w-full py-3 text-center text-brand-primary font-medium flex items-center justify-center gap-1"
        >
          {t('referral.viewHistory')}
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
