/**
 * SCR-003: Draw Results List
 * List of past draws with user outcome badges
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trophy, ChevronLeft, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useDrawList } from '../services/draw.service';
import { formatCurrency } from '@/core/utils/formatters';
import type { DrawType } from '../types/draw.types';

// Filter tabs
type FilterType = 'all' | 'weekly' | 'monthly';

interface DrawRowProps {
  drawType: DrawType;
  drawDate: string;
  totalWinners: number;
  totalPayout: number;
  userWon?: boolean;
  userPrize?: number;
  onTap: () => void;
}

function DrawRow({
  drawType,
  drawDate,
  totalWinners,
  totalPayout,
  userWon = false,
  userPrize,
  onTap,
}: DrawRowProps) {
  const { t } = useTranslation();

  const formattedDate = new Date(drawDate).toLocaleDateString('ar-IQ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${userWon ? 'border-brand-gold border-2' : ''}`}
      onClick={onTap}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={drawType === 'weekly' ? 'default' : 'secondary'}>
              {drawType === 'weekly' ? t('draw.weekly') : t('draw.monthly')}
            </Badge>
            {userWon && (
              <Badge variant="success" className="bg-brand-gold text-white">
                {t('draw.youWon')}
              </Badge>
            )}
          </div>
          <ChevronLeft className="h-5 w-5 text-text-muted rtl:rotate-180" />
        </div>

        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {totalWinners.toLocaleString('ar-IQ')} {t('draw.winners')}
            </span>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-muted">{t('draw.totalPayout')}</p>
            <p className="font-semibold text-text-primary">
              {formatCurrency(totalPayout)}
            </p>
          </div>
        </div>

        {userWon && userPrize && (
          <div className="mt-3 pt-3 border-t border-border-primary">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{t('draw.yourPrize')}</span>
              <span className="font-bold text-brand-gold">
                {formatCurrency(userPrize)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Filter tabs component
function FilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}) {
  const { t } = useTranslation();
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: t('filter.all') },
    { value: 'weekly', label: t('draw.weekly') },
    { value: 'monthly', label: t('draw.monthly') },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${activeFilter === filter.value
              ? 'bg-brand-primary text-white'
              : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

// Loading skeleton
function DrawListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48 mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DrawListPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const [filter, setFilter] = useState<FilterType>('all');

  usePageTitle(t('draw.results'));

  const {
    data: drawsData,
    isLoading,
    error,
    refetch,
  } = useDrawList({
    status: 'finalized',
    draw_type: filter === 'all' ? undefined : filter,
    page_size: 20,
  });

  const draws = drawsData?.draws_list ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('draw.results')}
          </h1>
          <div className="mb-4">
            <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
          </div>
          <DrawListSkeleton />
        </div>
      </div>
    );
  }

  if (error && isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-text-primary">
            {t('draw.results')}
          </h1>
          <Trophy className="h-6 w-6 text-brand-primary" />
        </div>

        {/* Filter Tabs */}
        <div className="mb-4">
          <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* Draw List */}
        {draws.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-12 w-12" />}
            title={t('draw.noDrawsYet')}
            description={t('draw.noDrawsDescription')}
          />
        ) : (
          <div className="space-y-4">
            {draws.map((draw) => (
              <DrawRow
                key={draw.draw_id}
                drawType={draw.draw_type}
                drawDate={draw.draw_date}
                totalWinners={draw.total_winners ?? 0}
                totalPayout={draw.total_payout_iqd ?? 0}
                onTap={() => navigate(`/draws/${draw.draw_id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
