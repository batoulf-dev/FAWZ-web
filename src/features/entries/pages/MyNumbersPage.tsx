/**
 * SCR-006: My Numbers (Entry History)
 * User's Fawz entry history with filters
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Ticket, Trophy, Gift, ChevronLeft, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useInfiniteEntries, useEntrySummary } from '../services/entries.service';
import type { EntrySource, EntryOutcome } from '../types/entries.types';

// Filter type
type FilterType = 'all' | 'transaction' | 'challenge' | 'referral';

// Summary stats card
function EntrySummaryCard({
  weekCount,
  totalCount,
}: {
  weekCount: number;
  totalCount: number;
}) {
  const { t } = useTranslation();

  return (
    <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-gold/10 rounded-xl">
            <Ticket className="h-6 w-6 text-brand-gold" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {weekCount.toLocaleString('ar-IQ')}
            </p>
            <p className="text-sm text-text-secondary">
              {t('entries.thisWeek')} — {totalCount.toLocaleString('ar-IQ')} {t('entries.total')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Entry row component
function EntryRow({
  entryNumber,
  source,
  drawWeek,
  createdAt,
  outcome,
  prizeIqd,
  onTap,
}: {
  entryNumber: string;
  source: EntrySource;
  drawWeek: string;
  createdAt: string;
  outcome?: EntryOutcome;
  prizeIqd?: number;
  onTap?: () => void;
}) {
  const { t } = useTranslation();

  const sourceLabels: Record<EntrySource, string> = {
    transaction: t('entries.sourceTransaction'),
    challenge: t('entries.sourceChallenge'),
    referral: t('entries.sourceReferral'),
    retroactive: t('entries.sourceRetroactive'),
    bonus: t('entries.sourceBonus'),
    onboarding: t('entries.sourceOnboarding'),
  };

  const sourceColors: Record<EntrySource, string> = {
    transaction: 'bg-brand-primary/10 text-brand-primary',
    challenge: 'bg-purple-100 text-purple-600',
    referral: 'bg-green-100 text-green-600',
    retroactive: 'bg-orange-100 text-orange-600',
    bonus: 'bg-pink-100 text-pink-600',
    onboarding: 'bg-blue-100 text-blue-600',
  };

  const formatNumber = (num: string) => {
    // Format as XXXX-XX-XXXX
    if (num.length === 10) {
      return `${num.slice(0, 4)}-${num.slice(4, 6)}-${num.slice(6)}`;
    }
    return num;
  };

  const relativeTime = new Date(createdAt).toLocaleDateString('ar-IQ', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isWinner = outcome === 'won';

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${isWinner ? 'border-brand-gold border-2' : ''}`}
      onClick={onTap}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="font-mono text-lg font-bold text-text-primary">
            {formatNumber(entryNumber)}
          </div>
          {isWinner && (
            <Badge variant="success" className="bg-brand-gold text-white">
              <Trophy className="h-3 w-3 me-1" />
              {t('entries.won')}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge className={sourceColors[source]}>{sourceLabels[source]}</Badge>
          {outcome === 'active' && (
            <Badge className="border border-border-primary bg-transparent">{t('entries.active')}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{relativeTime}</span>
          </div>
          <span>{drawWeek}</span>
        </div>

        {isWinner && prizeIqd && (
          <div className="mt-3 pt-3 border-t border-border-primary">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-brand-gold">
                <Gift className="h-4 w-4" />
                <span className="font-semibold">
                  {prizeIqd.toLocaleString('ar-IQ')} IQD
                </span>
              </div>
              <ChevronLeft className="h-4 w-4 text-text-muted rtl:rotate-180" />
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
    { value: 'transaction', label: t('entries.sourceTransaction') },
    { value: 'challenge', label: t('entries.sourceChallenge') },
    { value: 'referral', label: t('entries.sourceReferral') },
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
function EntryListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-xl" />
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-36 mb-2" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MyNumbersPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const [filter, setFilter] = useState<FilterType>('all');

  usePageTitle(t('entries.myNumbers'));

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useEntrySummary();

  const {
    data: entriesData,
    isLoading: entriesLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteEntries({
    source: filter === 'all' ? undefined : filter,
    page_size: 20,
  });

  const entries = entriesData?.pages.flatMap((page) => page.fawz_entries_list) ?? [];
  const isLoading = summaryLoading || entriesLoading;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleEntryTap = (entry: typeof entries[0]) => {
    if (entry.outcome === 'won' && entry.outcome_draw_id) {
      navigate(`/draws/${entry.outcome_draw_id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('entries.myNumbers')}
          </h1>
          <EntryListSkeleton />
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

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {t('entries.myNumbers')}
          </h1>
          <Ticket className="h-6 w-6 text-brand-gold" />
        </div>

        {/* Summary Card */}
        {summary && (
          <EntrySummaryCard
            weekCount={summary.entries_this_week}
            totalCount={summary.total_entries}
          />
        )}

        {/* Filter Tabs */}
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {/* Entry List */}
        {entries.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-12 w-12" />}
            title={t('entries.noEntriesYet')}
            description={t('entries.startPayingToEarn')}
            actionLabel={t('entries.learnHow')}
            onAction={() => navigate('/challenges')}
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryRow
                key={entry.fawz_entry_id}
                entryNumber={entry.entry_number}
                source={entry.source}
                drawWeek={entry.draw_week ?? ''}
                createdAt={entry.created_at}
                outcome={entry.outcome}
                prizeIqd={entry.prize_iqd}
                onTap={() => handleEntryTap(entry)}
              />
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="w-full py-3 text-center text-brand-primary font-medium"
              >
                {isFetchingNextPage ? t('common.loading') : t('common.loadMore')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
