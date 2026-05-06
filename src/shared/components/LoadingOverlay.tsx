/**
 * Loading Overlay Component
 * Full screen loading state
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message,
  fullScreen = true,
  className,
}: LoadingOverlayProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-bg-main/80 backdrop-blur-sm',
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
      {message && (
        <p className="mt-4 text-sm text-text-secondary">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
