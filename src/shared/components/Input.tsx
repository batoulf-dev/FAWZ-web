/**
 * Input Component
 * With label, helper text, and error state
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/core/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              hasError ? 'text-error' : 'text-text-primary',
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              // Base styles
              'w-full rounded-lg border bg-bg-card px-4 py-3 text-base',
              'text-text-primary placeholder:text-text-muted',
              'transition-colors duration-200',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-muted',
              // Error state
              hasError
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-border-default focus:border-brand-primary focus:ring-brand-primary/20',
              // Icons padding
              leftIcon && 'ps-10',
              rightIcon && 'pe-10',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </span>
          )}
        </div>

        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              hasError ? 'text-error' : 'text-text-secondary',
            )}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
