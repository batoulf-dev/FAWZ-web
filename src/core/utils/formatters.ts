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

/**
 * Get the full locale string based on language code
 */
export function getLocaleString(lang: string): string {
  return lang === 'ar' || lang.startsWith('ar-') ? 'ar-IQ' : 'en-US';
}

// IQD currency formatting with Eastern Arabic numerals (٠-٩)
const IQD_FORMATTER = new Intl.NumberFormat('ar-u-nu-arab', {
  style: 'currency',
  currency: 'IQD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const IQD_FORMATTER_EN = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IQD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Normalize language code to 'ar' or 'en'
 */
function normalizeLocale(locale: string): 'ar' | 'en' {
  return locale === 'ar' || locale.startsWith('ar-') ? 'ar' : 'en';
}

/**
 * Eastern Arabic numerals mapping (٠١٢٣٤٥٦٧٨٩)
 */
const ARABIC_NUMERALS: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

/**
 * Convert Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export function toArabicNumerals(str: string | number): string {
  return String(str).replace(/[0-9]/g, (digit) => ARABIC_NUMERALS[digit]);
}

/**
 * Format amount as Iraqi Dinar
 */
export function formatCurrency(
  amount: number,
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  const formatter = normalized === 'ar' ? IQD_FORMATTER : IQD_FORMATTER_EN;
  return formatter.format(amount);
}

/**
 * Format number with locale-aware separators and Eastern Arabic numerals for Arabic
 */
export function formatNumber(
  value: number,
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  // Use ar-u-nu-arab to force Eastern Arabic numerals (٠-٩)
  return new Intl.NumberFormat(normalized === 'ar' ? 'ar-u-nu-arab' : 'en-US').format(
    value,
  );
}

/**
 * Format date in Baghdad timezone
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'PPP',
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, {
    locale: normalized === 'ar' ? ar : enUS,
  });
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date,
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: normalized === 'ar' ? ar : enUS,
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
 * Format countdown timer
 * - More than 24 hours: "Xd Yh Zm" (e.g., "7d 8h 30m" / "٧ي ٨س ٣٠د")
 * - Less than 24 hours: "Xh Ym Zs" (e.g., "23h 45m 30s" / "٢٣س ٤٥د ٣٠ث")
 * - Less than 1 hour: "MM:SS" (e.g., "45:30" / "٤٥:٣٠")
 */
export function formatCountdown(seconds: number, locale: string = 'ar'): string {
  const isArabic = normalizeLocale(locale) === 'ar';

  if (seconds <= 0) return isArabic ? '٠٠:٠٠' : '00:00';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number): string => n.toString().padStart(2, '0');
  const formatNum = (n: number | string): string => isArabic ? toArabicNumerals(n) : String(n);

  // Arabic time unit abbreviations
  const units = isArabic
    ? { d: 'ي', h: 'س', m: 'د', s: 'ث' }
    : { d: 'd', h: 'h', m: 'm', s: 's' };

  // More than 24 hours: show days, hours, and minutes
  if (days > 0) {
    return `${formatNum(days)}${units.d} ${formatNum(hours)}${units.h} ${formatNum(minutes)}${units.m}`;
  }

  // Less than 24 hours: show hours, minutes, and seconds
  if (hours > 0) {
    return `${formatNum(hours)}${units.h} ${formatNum(minutes)}${units.m} ${formatNum(secs)}${units.s}`;
  }

  // Less than 1 hour: show MM:SS
  return `${formatNum(pad(minutes))}:${formatNum(pad(secs))}`;
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

/**
 * Format date using native toLocaleDateString with dynamic locale
 * Use this for simple date formatting without date-fns
 * Uses Eastern Arabic numerals (٠-٩) for Arabic locale
 */
export function formatLocalizedDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions,
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Use ar-u-nu-arab to force Eastern Arabic numerals
  const localeStr = normalized === 'ar' ? 'ar-u-nu-arab' : 'en-US';
  return dateObj.toLocaleDateString(localeStr, options);
}

/**
 * Format IQD amount with abbreviations for large numbers
 * >= 1 billion: "X.X مليار د.ع" (٫٥ مليار) / "X.X billion IQD"
 * >= 1 million: "X.X مليون د.ع" (٫٥ مليون) / "X.X million IQD"
 * Otherwise: comma-formatted
 */
export function formatIQDAbbreviated(
  amount: number,
  locale: string = 'ar',
): string {
  const normalized = normalizeLocale(locale);
  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (amount >= billion) {
    const value = amount / billion;
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return normalized === 'ar'
      ? `${toArabicNumerals(formatted)} مليار د.ع`
      : `${formatted} billion IQD`;
  }

  if (amount >= million) {
    const value = amount / million;
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return normalized === 'ar'
      ? `${toArabicNumerals(formatted)} مليون د.ع`
      : `${formatted} million IQD`;
  }

  return formatCurrency(amount, locale);
}

/**
 * Common date format presets for convenience
 */
export const DATE_FORMAT_PRESETS = {
  /** e.g., "الخميس، 21 مارس 2024" or "Thursday, March 21, 2024" */
  full: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  /** e.g., "21 مارس 2024" or "March 21, 2024" */
  long: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
  /** e.g., "21 مارس" or "March 21" */
  medium: {
    day: 'numeric',
    month: 'long',
  } as Intl.DateTimeFormatOptions,
  /** e.g., "21/03/2024" or "03/21/2024" */
  short: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as Intl.DateTimeFormatOptions,
} as const;
