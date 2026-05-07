/**
 * Application Entry Point
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

// Import global styles
import '@/styles/globals.css';

/**
 * Enable MSW mocking in development when VITE_ENABLE_MSW=true
 * This intercepts all API calls and returns fixture data
 */
async function enableMocking(): Promise<void> {
  // Only enable in development mode with MSW flag
  if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // Start the worker with onUnhandledRequest set to warn (not error)
  // so unhandled requests pass through to the real API
  await worker.start({
    onUnhandledRequest: 'warn',
  });

  // eslint-disable-next-line no-console
  console.log('[MSW] Mock Service Worker enabled');
}

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Enable mocking before rendering the app
enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
