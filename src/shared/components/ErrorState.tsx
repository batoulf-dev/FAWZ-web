/**
 * Error State Component
 * Displays when an error occurs
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'حدث خطأ',
  message = 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى',
  onRetry,
  retryLabel = 'إعادة المحاولة',
  className,
}: ErrorStateProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-error-light p-4 text-error">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>

      <p className="mb-6 max-w-sm text-sm text-text-secondary">{message}</p>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
