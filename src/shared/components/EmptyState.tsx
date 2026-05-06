/**
 * Empty State Component
 * Displays when no data is available
 */

import { Inbox } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      <div className="mb-4 rounded-full bg-bg-muted p-4 text-text-muted">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>

      {description && (
        <p className="mb-6 max-w-sm text-sm text-text-secondary">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
