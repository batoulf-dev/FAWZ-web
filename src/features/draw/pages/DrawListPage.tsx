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
import { useDrawList, useUserWins } from '../services/draw.service';
import { formatCurrency, formatLocalizedDate, formatNumber, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
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
  winningNumbers?: [string, string, string] | null;
  onTap: () => void;
}

function DrawRow({
  drawType,
  drawDate,
  totalWinners,
  totalPayout,
  userWon = false,
  userPrize,
  winningNumbers,
  onTap,
}: DrawRowProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const formattedDate = formatLocalizedDate(drawDate, DATE_FORMAT_PRESETS.full, lang);

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
            {/* User outcome badge - gold if won, grey if not */}
            {userWon ? (
              <Badge variant="success" className="bg-brand-gold text-white">
                {t('draw.youWonBadge')}
              </Badge>
            ) : (
              <Badge variant="default" className="bg-gray-200 text-gray-600">
                {t('draw.didNotWinBadge')}
              </Badge>
            )}
          </div>
          <ChevronLeft className="h-5 w-5 text-text-muted ltr:rotate-180" />
        </div>

        <div className="flex items-center gap-2 text-text-secondary mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        {/* Winning numbers display */}
        {winningNumbers && (
          <div className="mb-3">
            <p className="text-xs text-text-muted mb-1">{t('draw.winningTickets')}</p>
            <div className="flex gap-2 flex-wrap">
              {winningNumbers.map((num, idx) => (
                <span
                  key={idx}
                  className="font-mono text-sm bg-surface-secondary px-2 py-1 rounded"
                >
                  {String(num).padStart(10, '0')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              {formatNumber(totalWinners, lang)} {t('draw.winnersCount')}
            </span>
          </div>
          <div className="text-end">
            <p className="text-xs text-text-muted">{t('draw.totalPayout')}</p>
            <p className="font-semibold text-text-primary">
              {formatCurrency(totalPayout, lang)}
            </p>
          </div>
        </div>

        {userWon && userPrize && (
          <div className="mt-3 pt-3 border-t border-border-primary">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{t('draw.yourPrize')}</span>
              <span className="font-bold text-brand-gold">
                {formatCurrency(userPrize, lang)}
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
              ? 'bg-[#FFC107] text-zinc-900'
              : 'bg-bg-muted text-text-secondary hover:bg-bg-muted/80'
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

  // Fetch user wins to show outcome badges
  const { data: userWins } = useUserWins(true);

  // Create a map of draw_id -> user's prize for that draw
  const userWinsMap = new Map<string, number>();
  if (userWins) {
    for (const win of userWins) {
      const existing = userWinsMap.get(win.draw_id) ?? 0;
      userWinsMap.set(win.draw_id, existing + (win.prize_iqd ?? 0));
    }
  }

  const draws = drawsData?.draws_list ?? [];

  if (isLoading) {
    return (
      <div className="bg-surface-primary">
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
    <div className="bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-text-primary">
            {t('draw.results')}
          </h1>
          <Trophy className="h-6 w-6 text-[#FFC107]" />
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
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {draws.map((draw) => {
              const userPrize = userWinsMap.get(draw.draw_id);
              const userWon = userPrize !== undefined && userPrize > 0;

              // Build winning numbers array
              const winningNumbers: [string, string, string] | null =
                draw.winning_number_1 && draw.winning_number_2 && draw.winning_number_3
                  ? [
                      String(draw.winning_number_1).padStart(10, '0'),
                      String(draw.winning_number_2).padStart(10, '0'),
                      String(draw.winning_number_3).padStart(10, '0'),
                    ]
                  : null;

              return (
                <DrawRow
                  key={draw.draw_id}
                  drawType={draw.draw_type}
                  drawDate={draw.draw_date}
                  totalWinners={draw.total_winners ?? 0}
                  totalPayout={draw.total_payout_iqd ?? 0}
                  userWon={userWon}
                  userPrize={userPrize}
                  winningNumbers={winningNumbers}
                  onTap={() => navigate(`/draws/${draw.draw_id}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
