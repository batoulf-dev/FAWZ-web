/**
 * Card Component
 * Variants: default, elevated, outlined
 * Interactive cards get hover/focus states for desktop UX
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/core/utils/cn';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Adds hover/focus states for clickable cards */
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-bg-card shadow-card',
  elevated: 'bg-bg-elevated shadow-elevated',
  outlined: 'bg-bg-card border border-border-default',
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variantStyles[variant],
          paddingStyles[padding],
          // Interactive hover states for desktop
          interactive && [
            'cursor-pointer transition-all duration-200',
            'hover:shadow-lg hover:scale-[1.01] hover:border-brand-primary/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          ],
          className,
        )}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// Card Header
type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      />
    );
  },
);

CardHeader.displayName = 'CardHeader';

// Card Title
type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold text-text-primary', className)}
        {...props}
      />
    );
  },
);

CardTitle.displayName = 'CardTitle';

// Card Content
type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      />
    );
  },
);

CardContent.displayName = 'CardContent';

// Card Footer
type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-4 flex items-center gap-2', className)}
        {...props}
      />
    );
  },
);

CardFooter.displayName = 'CardFooter';
