/**
 * ProfilePage
 * SCR-014: Fawz Profile
 * Route: /profile
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  Bell,
  Shield,
  ChevronLeft,
  Zap,
  Gift,
  Users,
} from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/Card';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton, SkeletonAvatar } from '@/shared/components/Skeleton';
import { Avatar } from '@/shared/components/Avatar';
import { Badge } from '@/shared/components/Badge';
import { useProfileSummary } from '../index';

export default function ProfilePage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Fetch profile summary
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfileSummary();

  // Navigation handlers
  const handleNotificationSettings = (): void => {
    navigate('/notifications/settings');
  };

  const handleConsentSettings = (): void => {
    navigate('/profile/consent');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-bg-primary">
        <ProfileHeader />
        <div className="p-4 space-y-4">
          <ProfileHeaderSkeleton />
          <StatsSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-bg-primary">
        <ProfileHeader />
        <ErrorState
          title={t('errors.general')}
          message={error instanceof Error ? error.message : t('errors.serverError')}
          onRetry={() => refetch()}
          className="mt-12"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-bg-primary">
        <ProfileHeader />
        <ErrorState
          title={t('errors.notFound')}
          onRetry={() => refetch()}
          className="mt-12"
        />
      </div>
    );
  }

  // Format tier label
  const getTierLabel = (): string => {
    switch (profile.accountTier) {
      case 'new':
        return t('profilePage.tierNew');
      case 'established':
        return t('profilePage.tierEstablished');
      case 'ambassador':
        return t('profilePage.tierAmbassador');
      default:
        return t('profilePage.tierNew');
    }
  };

  // Format member since date
  const formatMemberSince = (): string => {
    const date = new Date(profile.memberSince);
    return date.toLocaleDateString(isArabic ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="bg-bg-primary pb-20">
      <ProfileHeader />

      <div className="py-4 space-y-4">
        {/* Profile Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-brand-primary/10 to-transparent" />

          <div className="relative pt-4">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center text-center">
              <Avatar
                name={profile.displayName}
                size="xl"
                className="ring-4 ring-bg-card"
              />
              <h2 className="mt-3 text-xl font-bold text-text-primary">
                {profile.displayName}
              </h2>
              <Badge variant="info" className="mt-1">
                {getTierLabel()}
              </Badge>
              <p className="mt-2 text-sm text-text-secondary">
                {t('profilePage.memberSince')} {formatMemberSince()}
              </p>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border-default pt-4">
              <StatItem
                icon={<Zap className="h-5 w-5" />}
                value={profile.totalEntriesEarned}
                label={isArabic ? 'أرقام فوز' : 'Fawz Numbers'}
              />
              <StatItem
                icon={<Gift className="h-5 w-5" />}
                value={profile.totalPrizesWon}
                label={isArabic ? 'جوائز' : 'Prizes'}
              />
              <StatItem
                icon={<Users className="h-5 w-5" />}
                value={profile.referralCount}
                label={isArabic ? 'إحالات' : 'Referrals'}
              />
            </div>
          </div>
        </Card>

        {/* Stats Details Card */}
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>{t('profilePage.stats')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatRow
              icon={<Zap className="h-5 w-5 text-brand-secondary" />}
              label={isArabic ? 'إجمالي أرقام الفوز' : 'Total Fawz Numbers'}
              value={t('profilePage.totalEntries', { count: profile.totalEntriesEarned })}
            />
            <StatRow
              icon={<Gift className="h-5 w-5 text-success" />}
              label={isArabic ? 'إجمالي الجوائز' : 'Total Prizes'}
              value={t('profilePage.totalPrizes', {
                count: profile.totalPrizesWon,
                amount: profile.totalPrizesWonIqd.toLocaleString(),
              })}
            />
            <StatRow
              icon={<Users className="h-5 w-5 text-brand-primary" />}
              label={isArabic ? 'الإحالات' : 'Referrals'}
              value={t('profilePage.referralCount', { count: profile.referralCount })}
            />
          </CardContent>
        </Card>

        {/* Settings Links */}
        <Card variant="outlined" padding="none">
          <SettingsLink
            icon={<Bell className="h-5 w-5 text-text-muted" />}
            label={t('profilePage.notificationSettings')}
            onClick={handleNotificationSettings}
          />
          <SettingsLink
            icon={<Shield className="h-5 w-5 text-text-muted" />}
            label={t('profilePage.consentSettings')}
            onClick={handleConsentSettings}
            showBorder={false}
          />
        </Card>
      </div>
    </div>
  );
}

// Header component
function ProfileHeader(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center justify-center px-4 py-3">
        <h1 className="text-xl font-bold text-text-primary">
          {t('profilePage.title')}
        </h1>
      </div>
    </div>
  );
}

// Stat item for grid
interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps): JSX.Element {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-brand-primary mb-1">{icon}</div>
      <span className="text-xl font-bold text-text-primary">{value}</span>
      <span className="text-xs text-text-muted">{label}</span>
    </div>
  );
}

// Stat row for detailed list
interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatRow({ icon, label, value }: StatRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}

// Settings link button
interface SettingsLinkProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  showBorder?: boolean;
}

function SettingsLink({
  icon,
  label,
  onClick,
  showBorder = true,
}: SettingsLinkProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full px-4 py-4',
        'hover:bg-bg-muted/50 transition-colors',
        showBorder && 'border-b border-border-default',
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-text-primary">{label}</span>
      </div>
      <ChevronLeft className="h-5 w-5 text-text-muted ltr:rotate-180" />
    </button>
  );
}

// Loading skeletons
function ProfileHeaderSkeleton(): JSX.Element {
  return (
    <Card variant="elevated">
      <div className="flex flex-col items-center">
        <SkeletonAvatar size={80} />
        <Skeleton height={24} className="w-32 mt-3" />
        <Skeleton height={20} className="w-20 mt-2" />
        <Skeleton height={16} className="w-40 mt-2" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border-default pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton width={40} height={40} rounded="full" />
            <Skeleton height={20} className="w-12 mt-2" />
            <Skeleton height={12} className="w-16 mt-1" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatsSkeleton(): JSX.Element {
  return (
    <Card variant="outlined">
      <Skeleton height={20} className="w-24 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton width={40} height={40} rounded="full" />
            <div className="flex-1">
              <Skeleton height={14} className="w-24 mb-1" />
              <Skeleton height={16} className="w-32" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
