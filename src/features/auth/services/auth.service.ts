/**
 * Auth Service
 * API functions and TanStack Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setTokens, clearTokens } from '@/core/network/apiClient';
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  AuthResponse,
  VerifyEmailRequest,
  RequestCodeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordJwtRequest,
  UpdateProfileRequest,
  UserProfileResponse,
  MessageResponse,
} from '../types/auth.types';

// ==========================================
// API Base Path
// ==========================================

const AUTH_BASE = '/fawz_user_management/user';

// ==========================================
// Query Keys Factory
// ==========================================

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  user: (userId: string) => [...authKeys.all, 'user', userId] as const,
};

// ==========================================
// API Functions
// ==========================================

// Sign up new user
async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  const response = await apiClient.post<SignUpResponse>(`${AUTH_BASE}/sign_up`, {
    ...data,
    app_id: data.app_id || 'fawz',
  });
  return response.data;
}

// Verify email with OTP
async function verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
  const response = await apiClient.patch<AuthResponse>(`${AUTH_BASE}/verify_user_email`, data);

  // Set tokens on successful verification
  if (response.data.access_token) {
    setTokens(response.data.access_token);
  }

  return response.data;
}

// Login user
async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(`${AUTH_BASE}/login_user`, data);

  // Set tokens on successful login
  if (response.data.access_token) {
    setTokens(response.data.access_token);
  }

  return response.data;
}

// Request verification/reset code
async function requestCode(data: RequestCodeRequest): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(`${AUTH_BASE}/request_code`, data);
  return response.data;
}

// Forgot password (initiate reset flow)
async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(`${AUTH_BASE}/forgot_password`, data);
  return response.data;
}

// Reset password with code
async function resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
  const response = await apiClient.patch<AuthResponse>(`${AUTH_BASE}/reset_password_by_user`, data);

  // Set tokens on successful reset
  if (response.data.access_token) {
    setTokens(response.data.access_token);
  }

  return response.data;
}

// Change password (with old password)
async function changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
  const response = await apiClient.patch<AuthResponse>(
    `${AUTH_BASE}/change_password_by_user`,
    data
  );

  // Update tokens on successful change
  if (response.data.access_token) {
    setTokens(response.data.access_token);
  }

  return response.data;
}

// Change password via JWT
async function changePasswordJwt(data: ChangePasswordJwtRequest): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(`${AUTH_BASE}/change_password`, data);
  return response.data;
}

// Get current user profile
async function getProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>(`${AUTH_BASE}/me`);
  return response.data;
}

// Update user profile
async function updateProfile(data: UpdateProfileRequest): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(`${AUTH_BASE}/update_profile`, data);
  return response.data;
}

// Upload profile image
async function uploadProfileImage(file: File): Promise<MessageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<MessageResponse>(
    `${AUTH_BASE}/upload_profile_image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

// Logout (client-side only - clear tokens)
function logout(): void {
  clearTokens();
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// Sign Up mutation
export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}

// Verify Email mutation
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Request Code mutation
export function useRequestCode() {
  return useMutation({
    mutationFn: requestCode,
  });
}

// Forgot Password mutation
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

// Reset Password mutation
export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Change Password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}

// Change Password via JWT mutation
export function useChangePasswordJwt() {
  return useMutation({
    mutationFn: changePasswordJwt,
  });
}

// Get Profile query
export function useProfile(enabled = true) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: getProfile,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Update Profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Upload Profile Image mutation
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

// Logout mutation (doesn't need TanStack Query, but kept for consistency)
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const authApi = {
  signUp,
  verifyEmail,
  login,
  requestCode,
  forgotPassword,
  resetPassword,
  changePassword,
  changePasswordJwt,
  getProfile,
  updateProfile,
  uploadProfileImage,
  logout,
};
