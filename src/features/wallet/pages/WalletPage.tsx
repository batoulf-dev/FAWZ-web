/**
 * Wallet Page
 * User's balance and transactions
 */

import { useTranslation } from 'react-i18next';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { formatCurrency } from '@/core/utils/formatters';

export default function WalletPage(): JSX.Element {
  const { t } = useTranslation();

  usePageTitle(t('navigation.wallet'));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">
        {t('navigation.wallet')}
      </h1>

      {/* Balance Card */}
      <Card className="bg-brand-primary text-white">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">{t('wallet.balance')}</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(0)}</p>
            </div>
            <Wallet className="h-12 w-12 opacity-50" />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              leftIcon={<Plus className="h-4 w-4" />}
              className="flex-1"
            >
              {t('wallet.deposit')}
            </Button>
            <Button
              variant="outline"
              leftIcon={<ArrowUpRight className="h-4 w-4" />}
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              {t('wallet.withdraw')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('wallet.transactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<ArrowDownLeft className="h-8 w-8" />}
            title={t('wallet.noTransactions')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
