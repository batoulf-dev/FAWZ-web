/**
 * cn Utility Tests
 * Tests for class name merging utility
 */

import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  describe('basic class merging', () => {
    it('should merge multiple class strings', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle empty strings', () => {
      const result = cn('class1', '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle single class', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    it('should handle no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('conditional classes', () => {
    it('should include class when condition is true', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('should exclude class when condition is false', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base');
    });

    it('should handle multiple conditionals', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base',
        isActive && 'active',
        isDisabled && 'disabled',
      );
      expect(result).toBe('base active');
    });

    it('should handle null and undefined', () => {
      const result = cn('base', null, undefined, 'valid');
      expect(result).toBe('base valid');
    });
  });

  describe('object syntax', () => {
    it('should include classes with truthy values', () => {
      const result = cn({
        base: true,
        active: true,
        disabled: false,
      });
      expect(result).toBe('base active');
    });

    it('should handle mixed inputs', () => {
      const result = cn(
        'string-class',
        { 'object-class': true },
        ['array-class'],
      );
      expect(result).toBe('string-class object-class array-class');
    });
  });

  describe('array syntax', () => {
    it('should flatten arrays of classes', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toBe('class1 class2');
    });

    it('should handle nested arrays', () => {
      const result = cn(['class1', ['class2', 'class3']]);
      expect(result).toBe('class1 class2 class3');
    });
  });

  describe('Tailwind conflict resolution', () => {
    it('should resolve padding conflicts', () => {
      const result = cn('px-2', 'px-4');
      expect(result).toBe('px-4');
    });

    it('should resolve margin conflicts', () => {
      const result = cn('mt-2', 'mt-4');
      expect(result).toBe('mt-4');
    });

    it('should resolve color conflicts', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should resolve background conflicts', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('should keep non-conflicting classes', () => {
      const result = cn('px-2 py-4', 'mt-2');
      expect(result).toBe('px-2 py-4 mt-2');
    });

    it('should resolve complex conflicts', () => {
      const result = cn(
        'p-4 bg-red-500 text-white',
        'p-2 bg-blue-500',
      );
      expect(result).toBe('text-white p-2 bg-blue-500');
    });

    it('should resolve responsive conflicts', () => {
      const result = cn('md:p-2', 'md:p-4');
      expect(result).toBe('md:p-4');
    });

    it('should not merge different breakpoints', () => {
      const result = cn('sm:p-2', 'md:p-4');
      expect(result).toBe('sm:p-2 md:p-4');
    });

    it('should resolve hover state conflicts', () => {
      const result = cn('hover:bg-red-500', 'hover:bg-blue-500');
      expect(result).toBe('hover:bg-blue-500');
    });
  });

  describe('RTL logical properties', () => {
    it('should handle padding start/end', () => {
      const result = cn('ps-2', 'ps-4');
      expect(result).toBe('ps-4');
    });

    it('should handle margin start/end', () => {
      const result = cn('ms-auto', 'ms-0');
      expect(result).toBe('ms-0');
    });

    it('should handle text alignment', () => {
      const result = cn('text-start', 'text-end');
      expect(result).toBe('text-end');
    });
  });

  describe('real-world usage', () => {
    it('should handle button variant example', () => {
      const variant: string = 'primary';
      const size: string = 'md';
      const isLoading = true;
      const isDisabled = false;

      const result = cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        variant === 'primary' && 'bg-brand-primary text-white',
        variant === 'secondary' && 'bg-brand-secondary text-white',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-base',
        isLoading && 'cursor-wait opacity-70',
        isDisabled && 'cursor-not-allowed opacity-50',
      );

      expect(result).toContain('inline-flex');
      expect(result).toContain('bg-brand-primary');
      expect(result).toContain('h-11');
      expect(result).toContain('cursor-wait');
      expect(result).not.toContain('cursor-not-allowed');
    });

    it('should handle input state example', () => {
      const hasError = true;
      const isDisabled = false;

      const result = cn(
        'w-full rounded-lg border px-4 py-3',
        hasError
          ? 'border-error focus:ring-error/20'
          : 'border-border-default focus:ring-brand-primary/20',
        isDisabled && 'opacity-50 cursor-not-allowed',
      );

      expect(result).toContain('border-error');
      expect(result).toContain('focus:ring-error/20');
      expect(result).not.toContain('border-border-default');
    });
  });
});
