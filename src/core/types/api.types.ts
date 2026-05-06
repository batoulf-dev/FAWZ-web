/**
 * API Response Types
 * Standard wrappers for all API responses
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

// API error response from server
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error_code?: string;
}

// Validation error structure
export interface ValidationErrors {
  [field: string]: string[];
}

// Generic list params for paginated endpoints
export interface ListParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// Auth token structure
export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

// User type (basic structure, extend per feature)
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
