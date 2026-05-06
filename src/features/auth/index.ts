/**
 * Auth Feature Public API
 * Export only what's needed by other features
 */

// Types
export type {
  User,
  AuthResponse,
  SignUpResponse,
  UserProfileResponse,
  MessageResponse,
  AuthState,
  AuthActions,
  LoginFormData,
  SignUpFormData,
  OtpFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  Gender,
  CodeType,
  UserStatus,
} from './types/auth.types';

// Schemas
export {
  loginRequestSchema,
  signUpRequestSchema,
  verifyEmailRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  changePasswordRequestSchema,
  changePasswordJwtRequestSchema,
  updateProfileRequestSchema,
  emailSchema,
  passwordSchema,
  otpSchema,
  phoneSchema,
  GenderEnum,
  CodeTypeEnum,
  UserStatusEnum,
} from './types/auth.types';

// Service hooks
export {
  authKeys,
  useSignUp,
  useVerifyEmail,
  useLogin,
  useRequestCode,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
  useChangePasswordJwt,
  useProfile,
  useUpdateProfile,
  useUploadProfileImage,
  useLogout,
  authApi,
} from './services/auth.service';
