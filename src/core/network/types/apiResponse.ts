/**
 * API Response Type Wrappers
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
  meta: PaginationMeta;
  links?: PaginationLinks;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// Empty response for DELETE operations
export interface EmptyResponse {
  success: boolean;
  message?: string;
}

// Wrapper for unwrapping API responses
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  return response.data;
}
