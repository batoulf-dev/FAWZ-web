/**
 * ReferralTeaserCard Component
 * Golden Ticket referral teaser with amber left accent border
 */

import { useTranslation } from 'react-i18next';
import { Gift, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';

interface ReferralTeaserCardProps {
  referralCountMonth: number;
  isLoading?: boolean;
}

export function ReferralTeaserCard({
  referralCountMonth,
  isLoading = false,
}: ReferralTeaserCardProps): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate('/referral');
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-s-4 border-amber-400">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-28 mb-1" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="bg-card border-s-4 border-amber-400 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Gift Icon in Purple Pill Container */}
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Gift className="h-5 w-5 text-primary" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text-primary">
              {t('referral.goldenTicket')}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {t('home.friendsReferredThisMonth', { count: referralCountMonth })}
            </p>
          </div>

          {/* Arrow Chevron */}
          <ChevronLeft className="h-5 w-5 text-primary flex-shrink-0 ltr:rotate-180" />
        </div>
      </CardContent>
    </Card>
  );
}
