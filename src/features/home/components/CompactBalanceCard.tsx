/**
 * CompactBalanceCard Component
 * Demoted balance card - compact horizontal design at bottom of home page
 */

import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatCurrency } from '@/core/utils/formatters';

interface CompactBalanceCardProps {
  balance: number;
  monthlySpend: number;
  isLoading?: boolean;
}

export function CompactBalanceCard({
  balance,
  monthlySpend,
  isLoading = false,
}: CompactBalanceCardProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (isLoading) {
    return (
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
            <div className="text-end">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left: Wallet icon + Balance */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t('home.yourBalance')}
              </p>
              <p className="text-xl font-medium text-text-primary">
                {formatCurrency(balance, lang)}
              </p>
            </div>
          </div>

          {/* Right: This Month spend */}
          <div className="text-end">
            <p className="text-xs text-muted-foreground">
              {t('home.monthlySpend')}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(monthlySpend, lang)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
