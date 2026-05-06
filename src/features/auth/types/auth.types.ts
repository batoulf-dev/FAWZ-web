/**
 * Authentication Types and Zod Schemas
 * Based on backend-fawz-user-management API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const GenderEnum = z.enum(['Male', 'Female', 'Others']);
export type Gender = z.infer<typeof GenderEnum>;

export const CodeTypeEnum = z.enum(['EmailVerification', 'ResetCode']);
export type CodeType = z.infer<typeof CodeTypeEnum>;

export const UserStatusEnum = z.enum([
  'Pending',
  'LoggedIn',
  'LoggedOut',
  'Suspended',
  'Deactivated',
  'Active',
]);
export type UserStatus = z.infer<typeof UserStatusEnum>;

// ==========================================
// Validation Schemas
// ==========================================

// Password validation: 6-16 chars, mixed case, digit, special char
export const passwordSchema = z
  .string()
  .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
  .max(16, 'كلمة المرور يجب أن تكون 16 حرف كحد أقصى')
  .regex(/[a-z]/, 'كلمة المرور يجب أن تحتوي على حرف صغير')
  .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
  .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'كلمة المرور يجب أن تحتوي على رمز خاص');

// Email validation
export const emailSchema = z
  .string()
  .email('البريد الإلكتروني غير صالح')
  .min(1, 'البريد الإلكتروني مطلوب');

// OTP validation: 6-digit code
export const otpSchema = z
  .string()
  .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
  .regex(/^\d{6}$/, 'رمز التحقق يجب أن يكون أرقام فقط');

// Phone validation (E.164 format for Iraq)
export const phoneSchema = z
  .string()
  .regex(/^\+964[0-9]{10}$/, 'رقم الهاتف غير صالح')
  .optional();

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'الاسم مطلوب')
  .max(150, 'الاسم يجب أن يكون 150 حرف كحد أقصى');

// ==========================================
// Request Schemas
// ==========================================

// Sign Up Request
export const signUpRequestSchema = z
  .object({
    app_id: z.string().default('fawz'),
    first_name: nameSchema,
    last_name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
    phone_number: phoneSchema,
    gender: GenderEnum.optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    street: z.string().optional(),
    zip_code: z.string().regex(/^\d{5}$/).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirm_password'],
  });

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;

// Login Request
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Verify Email Request
export const verifyEmailRequestSchema = z.object({
  email: emailSchema,
  verify_code: otpSchema,
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

// Request Code
export const requestCodeSchema = z.object({
  email: emailSchema,
  code_type: CodeTypeEnum,
});

export type RequestCodeRequest = z.infer<typeof requestCodeSchema>;

// Forgot Password Request
export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

// Reset Password Request
export const resetPasswordRequestSchema = z
  .object({
    email: emailSchema,
    verify_code: otpSchema,
    new_password: passwordSchema,
    confirm_new_password: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
    code_type: CodeTypeEnum,
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirm_new_password'],
  });

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// Change Password (with old password)
export const changePasswordRequestSchema = z
  .object({
    email: emailSchema,
    old_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    new_password: passwordSchema,
    confirm_new_password: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirm_new_password'],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

// Change Password via JWT
export const changePasswordJwtRequestSchema = z
  .object({
    current_password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    new_password: passwordSchema,
    confirm_new_password: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirm_new_password'],
  });

export type ChangePasswordJwtRequest = z.infer<typeof changePasswordJwtRequestSchema>;

// Update Profile Request
export const updateProfileRequestSchema = z.object({
  first_name: nameSchema.optional(),
  last_name: nameSchema.optional(),
  phone_number: phoneSchema,
  gender: GenderEnum.optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  street: z.string().optional(),
  zip_code: z.string().regex(/^\d{5}$/).optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

// ==========================================
// Response Types
// ==========================================

// User entity from API
export interface User {
  id: string;
  phone: string;
  is_verified: boolean;
  user_id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  gender?: Gender;
  profile_image_url?: string;
  role_id: string;
  role_name?: string;
  user_status: UserStatus;
  country?: string;
  city?: string;
  state?: string;
  street?: string;
  zip_code?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at: string;
  updated_at: string;
}

// Auth response with tokens
export interface AuthResponse {
  message: string;
  encrypted_token: string;
  access_token: string;
  user?: User;
}

// Sign up response
export interface SignUpResponse {
  user_id: string;
  message: string;
}

// Simple message response
export interface MessageResponse {
  message: string;
}

// User profile response (GET /user/me)
export type UserProfileResponse = User;

// ==========================================
// Auth State Types
// ==========================================

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  encryptedToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, encryptedToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

// ==========================================
// Form Types (for React Hook Form)
// ==========================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number?: string;
}

export interface OtpFormData {
  verify_code: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  verify_code: string;
  new_password: string;
  confirm_new_password: string;
}
