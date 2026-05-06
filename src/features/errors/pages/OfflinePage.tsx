/**
 * OfflinePage
 * Shown when the app detects no internet connection
 */

import { useTranslation } from 'react-i18next';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';

export default function OfflinePage(): JSX.Element {
  const { t } = useTranslation();
  const { isOffline } = useNetworkStatus();

  // Handle retry - check connection and reload if online
  const handleRetry = (): void => {
    // Force refresh to check connection
    window.location.reload();
  };

  // If somehow online, redirect (this is a safety measure)
  if (!isOffline) {
    window.location.href = '/';
    return <></>;
  }

  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-warning/10">
            <WifiOff className="h-16 w-16 text-warning" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {t('offline.title')}
        </h1>

        {/* Description */}
        <p className="text-text-secondary mb-8">
          {t('offline.message')}
        </p>

        {/* Retry Button */}
        <Button
          variant="primary"
          onClick={handleRetry}
          leftIcon={<RefreshCw className="h-5 w-5" />}
        >
          {t('common.retry')}
        </Button>
      </div>
    </div>
  );
}
