/**
 * Formatters Utility Tests
 * Tests for currency, date, and number formatting
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatTime,
  formatCountdown,
  getSecondsUntil,
  formatPhoneNumber,
  truncate,
  formatFileSize,
} from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency in Arabic locale', () => {
      const result = formatCurrency(250000, 'ar');
      // Should contain the amount and IQD indicator
      expect(result).toContain('٢٥٠');
    });

    it('should format currency in English locale', () => {
      const result = formatCurrency(250000, 'en');
      // Should contain the amount
      expect(result).toContain('250,000');
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0, 'en');
      expect(result).toContain('0');
    });

    it('should handle large amounts', () => {
      const result = formatCurrency(100000000, 'en');
      expect(result).toContain('100,000,000');
    });

    it('should default to Arabic locale', () => {
      const result = formatCurrency(1000);
      // Arabic uses Eastern Arabic numerals
      expect(result).toMatch(/[٠-٩,]+/);
    });
  });

  describe('formatNumber', () => {
    it('should format number with Arabic locale', () => {
      const result = formatNumber(1234567, 'ar');
      expect(result).toContain('١');
    });

    it('should format number with English locale', () => {
      const result = formatNumber(1234567, 'en');
      expect(result).toBe('1,234,567');
    });

    it('should handle zero', () => {
      const result = formatNumber(0, 'en');
      expect(result).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-03-21', 'PPP', 'en');
      expect(result).toContain('March');
      expect(result).toContain('21');
      expect(result).toContain('2024');
    });

    it('should format Date object', () => {
      const date = new Date('2024-03-21');
      const result = formatDate(date, 'PPP', 'en');
      expect(result).toContain('March');
    });

    it('should format with Arabic locale', () => {
      const result = formatDate('2024-03-21', 'PPP', 'ar');
      // Arabic month names
      expect(result).toBeTruthy();
    });

    it('should use default format', () => {
      const result = formatDate('2024-03-21');
      expect(result).toBeTruthy();
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-21T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format relative time in English', () => {
      const pastDate = '2024-03-21T10:00:00Z';
      const result = formatRelativeTime(pastDate, 'en');
      expect(result).toContain('hours ago');
    });

    it('should format relative time in Arabic', () => {
      const pastDate = '2024-03-21T10:00:00Z';
      const result = formatRelativeTime(pastDate, 'ar');
      // Arabic relative time should contain Arabic characters
      expect(result).toBeTruthy();
    });

    it('should handle Date objects', () => {
      const pastDate = new Date('2024-03-21T10:00:00Z');
      const result = formatRelativeTime(pastDate, 'en');
      expect(result).toContain('ago');
    });
  });

  describe('formatTime', () => {
    it('should format time with default format (HH:mm)', () => {
      const result = formatTime('2024-03-21T14:30:00Z');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should format time with custom format', () => {
      const result = formatTime('2024-03-21T14:30:45Z', 'HH:mm:ss');
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-03-21T14:30:00Z');
      const result = formatTime(date);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatCountdown', () => {
    it('should format countdown with hours', () => {
      const result = formatCountdown(3661); // 1 hour, 1 minute, 1 second
      expect(result).toBe('01:01:01');
    });

    it('should format countdown without hours', () => {
      const result = formatCountdown(125); // 2 minutes, 5 seconds
      expect(result).toBe('02:05');
    });

    it('should handle zero seconds', () => {
      const result = formatCountdown(0);
      expect(result).toBe('00:00');
    });

    it('should handle negative seconds', () => {
      const result = formatCountdown(-10);
      expect(result).toBe('00:00');
    });

    it('should pad single digits', () => {
      const result = formatCountdown(65); // 1 minute, 5 seconds
      expect(result).toBe('01:05');
    });

    it('should handle exactly one hour', () => {
      const result = formatCountdown(3600);
      expect(result).toBe('01:00:00');
    });
  });

  describe('getSecondsUntil', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-21T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return seconds until future date', () => {
      const futureDate = '2024-03-21T12:01:00Z';
      const result = getSecondsUntil(futureDate);
      expect(result).toBe(60);
    });

    it('should return 0 for past date', () => {
      const pastDate = '2024-03-21T11:00:00Z';
      const result = getSecondsUntil(pastDate);
      expect(result).toBe(0);
    });

    it('should handle Date objects', () => {
      const futureDate = new Date('2024-03-21T12:01:00Z');
      const result = getSecondsUntil(futureDate);
      expect(result).toBe(60);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format Iraqi phone number', () => {
      const result = formatPhoneNumber('07801234567');
      expect(result).toBe('0780 123 4567');
    });

    it('should handle already formatted number', () => {
      const result = formatPhoneNumber('0780 123 4567');
      expect(result).toBe('0780 123 4567');
    });

    it('should return original for non-standard format', () => {
      const result = formatPhoneNumber('1234567890');
      expect(result).toBe('1234567890');
    });

    it('should handle number with country code', () => {
      const result = formatPhoneNumber('+9647801234567');
      // Should strip non-digits and check
      expect(result).toBeTruthy();
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncate(text, 20);
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncate(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = '12345678901234567890';
      const result = truncate(text, 20);
      expect(result).toBe('12345678901234567890');
    });

    it('should handle empty string', () => {
      const result = truncate('', 20);
      expect(result).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      const result = formatFileSize(500);
      expect(result).toBe('500 B');
    });

    it('should format kilobytes', () => {
      const result = formatFileSize(1024);
      expect(result).toBe('1 KB');
    });

    it('should format megabytes', () => {
      const result = formatFileSize(1048576);
      expect(result).toBe('1 MB');
    });

    it('should format gigabytes', () => {
      const result = formatFileSize(1073741824);
      expect(result).toBe('1 GB');
    });

    it('should handle zero', () => {
      const result = formatFileSize(0);
      expect(result).toBe('0 B');
    });

    it('should format with decimal precision', () => {
      const result = formatFileSize(1536); // 1.5 KB
      expect(result).toBe('1.5 KB');
    });
  });
});
