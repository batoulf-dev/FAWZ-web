/**
 * MSW Browser Worker
 * Intercepts API requests in the browser during development
 */

import { setupWorker } from 'msw/browser';
import { handlers } from '@/test/mocks/handlers';

// Create browser worker with existing handlers
export const worker = setupWorker(...handlers);
