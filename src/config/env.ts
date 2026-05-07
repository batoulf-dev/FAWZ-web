/**
 * Typed Environment Configuration
 * Access all env vars through this module for type safety
 *
 * IMPORTANT: This module validates ALL required environment variables at startup.
 * If any required variable is missing, the app will fail immediately with a clear error.
 * Never add hardcoded fallbacks for required variables.
 */

import { z } from 'zod';

// Environment schema with strict validation
const envSchema = z.object({
  // Required: API base URL - must be explicitly set
  VITE_API_URL: z.string().url({
    message: 'VITE_API_URL must be a valid URL (e.g., https://api.example.com/v1)',
  }),

  // Required: Application environment
  VITE_APP_ENV: z.enum(['development', 'staging', 'production'], {
    errorMap: () => ({ message: 'VITE_APP_ENV must be one of: development, staging, production' }),
  }),

  // Required: Application ID for API calls
  VITE_APP_ID: z.string().min(1, {
    message: 'VITE_APP_ID is required and cannot be empty',
  }),

  // Optional: Enable MSW mocking (defaults to disabled)
  VITE_ENABLE_MSW: z
    .string()
    .transform((val) => val === 'true' || val === '1')
    .default('0'),

  // Optional app metadata with defaults
  VITE_APP_NAME: z.string().default('FAWZ'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_SENTRY_DSN: z.string().optional(),

  // Vite built-in env vars
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),
});

// Parse and validate environment variables
function parseEnv(): z.infer<typeof envSchema> {
  const raw = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_APP_ID: import.meta.env.VITE_APP_ID,
    VITE_ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const missingVars = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    console.error(
      '\n[FAWZ] Missing or invalid environment variables:\n' +
      missingVars +
      '\n\nPlease check your .env file and ensure all required variables are set.\n'
    );
    throw new Error('Invalid environment configuration. See console for details.');
  }

  return result.data;
}

// Parsed and validated environment
const parsedEnv = parseEnv();

// Exported environment config with friendly property names
export const env = {
  // API Configuration
  apiUrl: parsedEnv.VITE_API_URL,
  appId: parsedEnv.VITE_APP_ID,
  appEnv: parsedEnv.VITE_APP_ENV,

  // Feature flags
  enableMsw: parsedEnv.VITE_ENABLE_MSW,
  enableDevtools: parsedEnv.VITE_ENABLE_DEVTOOLS,

  // App metadata
  appName: parsedEnv.VITE_APP_NAME,
  appVersion: parsedEnv.VITE_APP_VERSION,
  sentryDsn: parsedEnv.VITE_SENTRY_DSN,

  // Vite mode
  mode: parsedEnv.MODE,
  isDev: parsedEnv.DEV,
  isProd: parsedEnv.PROD,
} as const;

export type Env = typeof env;
