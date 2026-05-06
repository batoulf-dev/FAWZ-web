/**
 * Validation Schemas
 * Zod schemas for form validation and API response validation
 */

import { z } from 'zod';

// Iraqi phone number regex (07XXXXXXXXX - 11 digits starting with 07)
const IRAQI_PHONE_REGEX = /^07[0-9]{9}$/;

// OTP regex (6 digits)
const OTP_REGEX = /^[0-9]{6}$/;

/**
 * Iraqi phone number schema
 */
export const phoneSchema = z
  .string()
  .min(1, 'رقم الهاتف مطلوب')
  .regex(IRAQI_PHONE_REGEX, 'رقم الهاتف غير صالح');

/**
 * OTP code schema
 */
export const otpSchema = z
  .string()
  .min(1, 'رمز التحقق مطلوب')
  .regex(OTP_REGEX, 'رمز التحقق يجب أن يكون 6 أرقام');

/**
 * Email schema
 */
export const emailSchema = z
  .string()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('البريد الإلكتروني غير صالح');

/**
 * Optional email schema
 */
export const optionalEmailSchema = z
  .string()
  .email('البريد الإلكتروني غير صالح')
  .optional()
  .or(z.literal(''));

/**
 * Name schema (Arabic/English, 2-50 chars)
 */
export const nameSchema = z
  .string()
  .min(2, 'الاسم قصير جداً')
  .max(50, 'الاسم طويل جداً')
  .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على حروف فقط');

/**
 * Password schema (min 8 chars)
 */
export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');

/**
 * Login form schema
 */
export const loginSchema = z.object({
  phone: phoneSchema,
});

/**
 * OTP verification schema
 */
export const otpVerificationSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: optionalEmailSchema,
});

/**
 * Pagination params schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * ID param schema
 */
export const idSchema = z.string().uuid('معرف غير صالح');

/**
 * Validate and parse data with a schema
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Get first error message from Zod error
 */
export function getFirstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? 'خطأ في البيانات';
}

/**
 * Transform Zod errors to field-error map
 */
export function getFieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join('.');
    if (path && !errors[path]) {
      errors[path] = issue.message;
    }
  }

  return errors;
}

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpVerificationData = z.infer<typeof otpVerificationSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
