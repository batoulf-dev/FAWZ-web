/**
 * Page Title Hook
 * Updates document title with optional suffix
 */

import { useEffect } from 'react';

const APP_NAME = 'FAWZ';

export function usePageTitle(title?: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
