/**
 * Class Name Utility
 * Combines clsx and tailwind-merge for conditional Tailwind classes
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * @example cn('px-2 py-1', condition && 'px-4', 'text-red-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
