/**
 * Offline Banner Component
 * Fixed banner displayed when offline
 */

import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/core/utils/cn';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className }: OfflineBannerProps): JSX.Element | null {
  const { isOffline } = useNetworkStatus();
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 safe-area-inset-bottom',
        'bg-warning text-white px-4 py-3',
        'flex items-center justify-center gap-2',
        'animate-in slide-in-from-bottom duration-300',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{t('offline.title')}</span>
    </div>
  );
}
