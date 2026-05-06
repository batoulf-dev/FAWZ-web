/**
 * NotificationSkeleton Component
 * Loading skeleton for notification items
 */

import { Card } from '@/shared/components/Card';
import { Skeleton, SkeletonAvatar } from '@/shared/components/Skeleton';

export function NotificationSkeleton(): JSX.Element {
  return (
    <Card variant="outlined" padding="sm" className="flex items-start gap-3">
      {/* Icon skeleton */}
      <SkeletonAvatar size={40} />

      {/* Content skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton height={16} className="w-3/4" />
        <Skeleton height={14} className="w-full" />
        <Skeleton height={12} className="w-1/4" />
      </div>
    </Card>
  );
}
