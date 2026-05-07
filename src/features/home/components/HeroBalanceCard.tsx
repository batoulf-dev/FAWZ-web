/**
 * HeroBalanceCard Component
 * Dark premium card showing user balance, greeting, avatar, monthly spend, tickets earned
 */

import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Avatar } from '@/shared/components/Avatar';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatCurrency, formatNumber } from '@/core/utils/formatters';

interface HeroBalanceCardProps {
  userName: string;
  userAvatar?: string;
  balance: number;
  monthlySpend: number;
  ticketsEarned: number;
  isLoading?: boolean;
}

export function HeroBalanceCard({
  userName,
  userAvatar,
  balance,
  monthlySpend,
  ticketsEarned,
  isLoading = false,
}: HeroBalanceCardProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Get greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full bg-slate-700" />
              <div>
                <Skeleton className="h-4 w-20 mb-2 bg-slate-700" />
                <Skeleton className="h-5 w-24 bg-slate-700" />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Skeleton className="h-4 w-16 mb-2 bg-slate-700" />
            <Skeleton className="h-10 w-40 bg-slate-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 rounded-xl bg-slate-700" />
            <Skeleton className="h-16 rounded-xl bg-slate-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-xl overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      <CardContent className="p-5 relative">
        {/* Header: Avatar + Greeting */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar
              src={userAvatar}
              name={userName}
              size="lg"
              className="ring-2 ring-brand-gold/30"
            />
            <div>
              <p className="text-slate-400 text-sm">{getGreeting()}</p>
              <p className="text-white font-semibold text-lg">{userName}</p>
            </div>
          </div>
        </div>

        {/* Main Balance */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <Wallet className="h-4 w-4" />
            <span>{t('home.yourBalance')}</span>
          </div>
          <p className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(balance, lang)}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Monthly Spend */}
          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>{t('home.monthlySpend')}</span>
            </div>
            <p className="text-white font-semibold text-lg">
              {formatCurrency(monthlySpend, lang)}
            </p>
          </div>

          {/* Tickets Earned */}
          <div className="bg-brand-gold/10 rounded-xl p-3 backdrop-blur-sm border border-brand-gold/20">
            <div className="flex items-center gap-2 text-brand-gold text-xs mb-1">
              <Ticket className="h-3 w-3" />
              <span>{t('home.ticketsEarned')}</span>
            </div>
            <p className="text-brand-gold font-bold text-lg">
              +{formatNumber(ticketsEarned, lang)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
