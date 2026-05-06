/**
 * Formatting Utilities
 * Currency (IQD), dates (Baghdad TZ), countdown, numbers
 */

import {
  format,
  formatDistanceToNow,
  differenceInSeconds,
  parseISO,
} from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// IQD currency formatting
const IQD_FORMATTER = new Intl.NumberFormat('ar-IQ', {
  style: 'currency',
  currency: 'IQD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const IQD_FORMATTER_EN = new Intl.NumberFormat('en-IQ', {
  style: 'currency',
  currency: 'IQD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format amount as Iraqi Dinar
 */
export function formatCurrency(
  amount: number,
  locale: 'ar' | 'en' = 'ar',
): string {
  const formatter = locale === 'ar' ? IQD_FORMATTER : IQD_FORMATTER_EN;
  return formatter.format(amount);
}

/**
 * Format number with locale-aware separators
 */
export function formatNumber(
  value: number,
  locale: 'ar' | 'en' = 'ar',
): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-IQ' : 'en-US').format(
    value,
  );
}

/**
 * Format date in Baghdad timezone
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'PPP',
  locale: 'ar' | 'en' = 'ar',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, {
    locale: locale === 'ar' ? ar : enUS,
  });
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: 'ar' | 'en' = 'ar',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locale === 'ar' ? ar : enUS,
  });
}

/**
 * Format time in Baghdad timezone
 */
export function formatTime(
  date: string | Date,
  formatStr: string = 'HH:mm',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format countdown timer (returns HH:MM:SS or MM:SS)
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number): string => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
}

/**
 * Get seconds until a future date
 */
export function getSecondsUntil(futureDate: string | Date): number {
  const dateObj = typeof futureDate === 'string' ? parseISO(futureDate) : futureDate;
  const seconds = differenceInSeconds(dateObj, new Date());
  return Math.max(0, seconds);
}

/**
 * Format phone number (Iraqi format)
 */
export function formatPhoneNumber(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');

  // Format as 07XX XXX XXXX
  if (digits.length === 11 && digits.startsWith('07')) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
