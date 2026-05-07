/// <reference types="vite/client" />

import type { JSX as ReactJSX } from 'react';
import 'react';
import 'react-dom';

/**
 * Vite environment variable types
 * All custom env vars must be prefixed with VITE_
 */
interface ImportMetaEnv {
  // Required environment variables
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_ID: string;

  // Optional environment variables
  readonly VITE_ENABLE_MSW?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENABLE_DEVTOOLS?: string;
  readonly VITE_SENTRY_DSN?: string;

  // DEV ONLY: Force a specific entry to match in draw results
  readonly VITE_TEST_FORCE_MATCH_ENTRY_ID?: string;
  // DEV ONLY: Number of trailing digits to match (3-10)
  readonly VITE_TEST_FORCE_MATCH_DIGITS?: string;

  // Standard Vite env vars
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
  }
}
