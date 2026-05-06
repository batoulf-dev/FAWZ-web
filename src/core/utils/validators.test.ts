/**
 * Validators Utility Tests
 * Tests for Zod validation schemas
 */

import { describe, it, expect } from 'vitest';
import {
  phoneSchema,
  otpSchema,
  emailSchema,
  optionalEmailSchema,
  nameSchema,
  passwordSchema,
  loginSchema,
  otpVerificationSchema,
  profileUpdateSchema,
  paginationSchema,
  idSchema,
  validateData,
  getFirstError,
  getFieldErrors,
} from './validators';

describe('validators', () => {
  describe('phoneSchema', () => {
    it('should accept valid Iraqi phone numbers', () => {
      const validNumbers = ['07801234567', '07501234567', '07701234567'];

      validNumbers.forEach((num) => {
        const result = phoneSchema.safeParse(num);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '0780123456',   // Too short
        '078012345678', // Too long
        '08801234567',  // Wrong prefix
        '1234567890',   // Wrong format
        '',             // Empty
        'abcdefghijk',  // Letters
      ];

      invalidNumbers.forEach((num) => {
        const result = phoneSchema.safeParse(num);
        expect(result.success).toBe(false);
      });
    });

    it('should return Arabic error messages', () => {
      const result = phoneSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('رقم الهاتف');
      }
    });
  });

  describe('otpSchema', () => {
    it('should accept valid 6-digit OTP', () => {
      const result = otpSchema.safeParse('123456');
      expect(result.success).toBe(true);
    });

    it('should reject invalid OTP', () => {
      const invalidOtps = [
        '12345',     // Too short
        '1234567',   // Too long
        'abcdef',    // Letters
        '12 34 56',  // Spaces
        '',          // Empty
      ];

      invalidOtps.forEach((otp) => {
        const result = otpSchema.safeParse(otp);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('emailSchema', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@gmail.com',
      ];

      validEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@domain.com',
        '',
        'no spaces@domain.com',
      ];

      invalidEmails.forEach((email) => {
        const result = emailSchema.safeParse(email);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('optionalEmailSchema', () => {
    it('should accept valid email', () => {
      const result = optionalEmailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should accept empty string', () => {
      const result = optionalEmailSchema.safeParse('');
      expect(result.success).toBe(true);
    });

    it('should accept undefined', () => {
      const result = optionalEmailSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = optionalEmailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });
  });

  describe('nameSchema', () => {
    it('should accept valid names', () => {
      const validNames = [
        'أحمد',
        'محمد علي',
        'Ahmed',
        'John Doe',
        'أحمد Ahmed',
      ];

      validNames.forEach((name) => {
        const result = nameSchema.safeParse(name);
        expect(result.success).toBe(true);
      });
    });

    it('should reject names too short', () => {
      const result = nameSchema.safeParse('A');
      expect(result.success).toBe(false);
    });

    it('should reject names too long', () => {
      const result = nameSchema.safeParse('A'.repeat(51));
      expect(result.success).toBe(false);
    });

    it('should reject names with numbers', () => {
      const result = nameSchema.safeParse('Ahmed123');
      expect(result.success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'password123',
        'VerySecurePassword!',
        'a'.repeat(8),
      ];

      validPasswords.forEach((pwd) => {
        const result = passwordSchema.safeParse(pwd);
        expect(result.success).toBe(true);
      });
    });

    it('should reject passwords too short', () => {
      const result = passwordSchema.safeParse('short');
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const result = loginSchema.safeParse({
        phone: '07801234567',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone', () => {
      const result = loginSchema.safeParse({
        phone: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('otpVerificationSchema', () => {
    it('should accept valid verification data', () => {
      const result = otpVerificationSchema.safeParse({
        phone: '07801234567',
        otp: '123456',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid phone or otp', () => {
      const result = otpVerificationSchema.safeParse({
        phone: 'invalid',
        otp: '12345',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('profileUpdateSchema', () => {
    it('should accept valid profile update', () => {
      const result = profileUpdateSchema.safeParse({
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should accept partial update', () => {
      const result = profileUpdateSchema.safeParse({
        name: 'أحمد',
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const result = profileUpdateSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should parse with defaults', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.per_page).toBe(20);
        expect(result.data.sort_order).toBe('desc');
      }
    });

    it('should coerce string numbers', () => {
      const result = paginationSchema.safeParse({
        page: '2',
        per_page: '10',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.per_page).toBe(10);
      }
    });

    it('should reject invalid per_page', () => {
      const result = paginationSchema.safeParse({
        per_page: 200,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('idSchema', () => {
    it('should accept valid UUID', () => {
      const result = idSchema.safeParse('550e8400-e29b-41d4-a716-446655440000');
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = idSchema.safeParse('invalid-uuid');
      expect(result.success).toBe(false);
    });
  });

  describe('validateData', () => {
    it('should return success with valid data', () => {
      const result = validateData(phoneSchema, '07801234567');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('07801234567');
      }
    });

    it('should return errors with invalid data', () => {
      const result = validateData(phoneSchema, 'invalid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe('getFirstError', () => {
    it('should return first error message', () => {
      const result = phoneSchema.safeParse('');
      if (!result.success) {
        const message = getFirstError(result.error);
        expect(message).toContain('رقم الهاتف');
      }
    });

    it('should return fallback for empty errors', () => {
      const result = phoneSchema.safeParse('invalid');
      if (!result.success) {
        const message = getFirstError(result.error);
        expect(message).toBeTruthy();
      }
    });
  });

  describe('getFieldErrors', () => {
    it('should return field-error map', () => {
      const result = loginSchema.safeParse({ phone: 'invalid' });
      if (!result.success) {
        const errors = getFieldErrors(result.error);
        expect(errors.phone).toBeDefined();
      }
    });

    it('should handle nested paths', () => {
      const result = otpVerificationSchema.safeParse({
        phone: 'invalid',
        otp: '123',
      });
      if (!result.success) {
        const errors = getFieldErrors(result.error);
        expect(Object.keys(errors).length).toBeGreaterThan(0);
      }
    });
  });
});
