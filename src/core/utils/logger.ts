/**
 * Logger Utility
 * Console wrapper that is stripped in production
 */

import { env } from '@/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// No-op function for production
const noop = (): void => {};

// Create log function that respects environment
function createLogFn(
  level: LogLevel,
  consoleFn: (...args: unknown[]) => void,
): (message: string, data?: unknown) => void {
  if (env.isProd) {
    return noop;
  }

  return (message: string, data?: unknown): void => {
    const prefix = `[${level.toUpperCase()}]`;

    if (data !== undefined) {
      consoleFn(prefix, message, data);
    } else {
      consoleFn(prefix, message);
    }

    // Could send to external logging service here
    if (level === 'error' && env.sentryDsn) {
      // Sentry.captureMessage(message, { extra: { data } });
    }
  };
}

/* eslint-disable no-console */
export const logger = {
  debug: createLogFn('debug', console.debug),
  info: createLogFn('info', console.info),
  warn: createLogFn('warn', console.warn),
  error: createLogFn('error', console.error),

  // Group logging (collapsible in console)
  group: env.isProd ? noop : console.group,
  groupEnd: env.isProd ? noop : console.groupEnd,

  // Table logging for arrays/objects
  table: env.isProd ? noop : console.table,

  // Time tracking
  time: env.isProd ? noop : console.time,
  timeEnd: env.isProd ? noop : console.timeEnd,
};
/* eslint-enable no-console */

export default logger;
