/**
 * SCR-006: My Numbers (Entry History)
 * User's Fawz entry history with filters
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { TicketCheck, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useInfiniteEntries, useEntrySummary } from '../services/entries.service';
import { formatNumber, formatLocalizedDate } from '@/core/utils/formatters';
import type { EntrySource } from '../types/entries.types';

// Filter type
type FilterType = 'all' | 'transaction' | 'challenge' | 'referral';

// Summary stats card
function EntrySummaryCard({
  weekCount,
  activeCount,
}: {
  weekCount: number;
  activeCount: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* This Week */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold/10 rounded-xl">
              <Calendar className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">
                {formatNumber(weekCount, lang)}
              </p>
              <p className="text-xs text-text-secondary">
                {t('entries.thisWeek')}
              </p>
            </div>
          </div>

          {/* Active Tickets */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-primary/10 rounded-xl">
              <TicketCheck className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">
                {formatNumber(activeCount, lang)}
              </p>
              <p className="text-xs text-text-secondary">
                {t('entries.activeTickets')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Entry row component (non-interactive display card for active tickets)
function EntryRow({
  entryNumber,
  source,
  createdAt,
}: {
  entryNumber: string;
  source: EntrySource;
  createdAt: string;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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

  const formatEntryNumber = (num: string) => {
    // Format as XXXX-XX-XXXX
    if (num.length === 10) {
      return `${num.slice(0, 4)}-${num.slice(4, 6)}-${num.slice(6)}`;
    }
    return num;
  };

  const relativeTime = formatLocalizedDate(createdAt, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }, lang);

  return (
    <Card className="pointer-events-none select-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="font-mono text-lg font-bold text-text-primary">
            {formatEntryNumber(entryNumber)}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge className={sourceColors[source]}>{sourceLabels[source]}</Badge>
        </div>

        <div className="flex items-center text-sm text-text-secondary">
          <Calendar className="h-3 w-3 me-1" />
          <span>{relativeTime}</span>
        </div>
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

  usePageTitle(t('tickets.myTickets'));

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
    ...(filter !== 'all' ? { source: filter } : {}),
    outcome: 'active',
    page_size: 20,
  });

  const entries = entriesData?.pages.flatMap((page) => page.fawz_entries_list) ?? [];
  const isLoading = summaryLoading || entriesLoading;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('tickets.myTickets')}
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
            {t('tickets.myTickets')}
          </h1>
          <TicketCheck className="h-6 w-6 text-brand-gold" />
        </div>

        {/* Summary Card */}
        {summary && (
          <EntrySummaryCard
            weekCount={summary.entries_this_week}
            activeCount={summary.active_entries}
          />
        )}

        {/* Filter Tabs */}
        <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

        {/* Entry List */}
        {entries.length === 0 ? (
          <EmptyState
            icon={<TicketCheck className="h-12 w-12" />}
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
                createdAt={entry.created_at}
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
