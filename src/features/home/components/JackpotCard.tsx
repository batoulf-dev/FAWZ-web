/**
 * JackpotCard Component
 * Amber-accented card showing weekly jackpot amount and stats
 */

import { useTranslation } from 'react-i18next';
import { Trophy, Users, Sparkles, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatCurrency, formatNumber, formatIQDAbbreviated } from '@/core/utils/formatters';

interface JackpotCardProps {
  jackpotAmount: number;
  entryPoolSize: number;
  lastWinner?: string | null;
  lastWinAmount?: number | null;
  isLoading?: boolean;
  onClick?: () => void;
}

export function JackpotCard({
  jackpotAmount,
  entryPoolSize,
  lastWinner,
  lastWinAmount,
  isLoading = false,
  onClick,
}: JackpotCardProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (isLoading) {
    return (
      <Card className="border-brand-gold/30">
        <CardContent className="p-5 min-h-[200px]">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-12 w-48 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="bg-gradient-to-br from-amber-50 to-orange-50 border-brand-gold/30 cursor-pointer hover:shadow-lg transition-all overflow-hidden"
      onClick={onClick}
    >
      {/* Decorative sparkle elements */}
      <div className="absolute -top-4 -end-4 w-24 h-24 bg-brand-gold/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -start-8 w-32 h-32 bg-orange-300/10 rounded-full blur-3xl" />

      <CardContent className="p-5 relative min-h-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-gold to-amber-500 rounded-xl shadow-lg shadow-brand-gold/30">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">
                {t('home.weeklyJackpot')}
              </p>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-brand-gold" />
                <span className="text-xs text-amber-600">
                  {t('home.couldBeYours')}
                </span>
              </div>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 text-amber-400 rtl:rotate-180" />
        </div>

        {/* Jackpot Amount */}
        <div className="mb-5">
          <p className="text-4xl font-bold text-amber-900 tracking-tight">
            {formatIQDAbbreviated(jackpotAmount, lang)}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Entry Pool */}
          <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{t('home.entryPool')}</span>
            </div>
            <p className="text-lg font-bold text-amber-900">
              {formatNumber(entryPoolSize, lang)}
            </p>
          </div>

          {/* Last Winner (if available) */}
          {lastWinner && lastWinAmount ? (
            <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <Trophy className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('home.lastWinner')}</span>
              </div>
              <p className="text-sm font-semibold text-amber-900 truncate">
                {lastWinner}
              </p>
              <p className="text-xs text-amber-600">
                {formatCurrency(lastWinAmount, lang)}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-gold/20 to-amber-400/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-brand-gold mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('home.beTheFirst')}</span>
              </div>
              <p className="text-sm font-semibold text-amber-800">
                {t('home.winBig')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
