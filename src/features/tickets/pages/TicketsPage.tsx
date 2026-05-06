/**
 * Tickets Page
 * User's purchased tickets
 */

import { useTranslation } from 'react-i18next';
import { Ticket } from 'lucide-react';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { Card, CardContent } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';

export default function TicketsPage(): JSX.Element {
  const { t } = useTranslation();

  usePageTitle(t('tickets.myTickets'));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">
        {t('tickets.myTickets')}
      </h1>

      <Card>
        <CardContent>
          <EmptyState
            icon={<Ticket className="h-8 w-8" />}
            title={t('tickets.noTickets')}
            description={t('tickets.noTicketsDesc')}
            actionLabel={t('tickets.browseDraws')}
            onAction={() => {
              window.location.href = '/draws';
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
