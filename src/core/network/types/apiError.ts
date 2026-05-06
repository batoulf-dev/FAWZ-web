/**
 * API Error Types
 * Typed error classes for different error scenarios
 */

// Base application error
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'APP_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// API error from server responses
export class ApiError extends AppError {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
    code?: string,
  ) {
    super(message, code ?? `API_ERROR_${status}`);
    this.name = 'ApiError';
  }

  // Check if this is a validation error (422)
  get isValidationError(): boolean {
    return this.status === 422;
  }

  // Check if this is an auth error (401)
  get isAuthError(): boolean {
    return this.status === 401;
  }

  // Check if this is a rate limit error (429)
  get isRateLimitError(): boolean {
    return this.status === 429;
  }

  // Check if this is a server error (5xx)
  get isServerError(): boolean {
    return this.status >= 500;
  }

  // Get first error for a field
  getFieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }
}

// Network connectivity error
export class NetworkError extends AppError {
  constructor(message: string = 'Network connection error') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

// Validation error (client-side)
export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Timeout error
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

// Type guard for ApiError
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// Type guard for NetworkError
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

// Type guard for any app error
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
