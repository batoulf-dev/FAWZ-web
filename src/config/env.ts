/**
 * Typed Environment Configuration
 * Access all env vars through this module for type safety
 */

import { z } from 'zod';

// Environment schema with validation
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('https://dev.iqarx.com/api/v0'),
  VITE_APP_NAME: z.string().default('FAWZ'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_SENTRY_DSN: z.string().optional(),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

// Parse and validate environment
function parseEnv(): z.infer<typeof envSchema> {
  const raw = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
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
    console.error('Invalid environment variables:', result.error.flatten());
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

// Parsed environment
const parsedEnv = parseEnv();

// Exported environment config
export const env = {
  apiBaseUrl: parsedEnv.VITE_API_BASE_URL,
  appName: parsedEnv.VITE_APP_NAME,
  appVersion: parsedEnv.VITE_APP_VERSION,
  enableDevtools: parsedEnv.VITE_ENABLE_DEVTOOLS,
  sentryDsn: parsedEnv.VITE_SENTRY_DSN,
  mode: parsedEnv.MODE,
  isDev: parsedEnv.DEV,
  isProd: parsedEnv.PROD,
} as const;

export type Env = typeof env;
