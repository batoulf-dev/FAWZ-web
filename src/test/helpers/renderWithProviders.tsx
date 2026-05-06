/**
 * Test Utility: renderWithProviders
 * Wraps components with all necessary providers for testing
 */
/* eslint-disable react-refresh/only-export-components */

import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router';
import { Toaster } from 'react-hot-toast';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial URL for the router (e.g., '/dashboard') */
  initialRoute?: string;
  /** Initial history entries for MemoryRouter */
  initialEntries?: MemoryRouterProps['initialEntries'];
  /** Whether to use BrowserRouter instead of MemoryRouter */
  useBrowserRouter?: boolean;
  /** Pre-configured QueryClient (optional) */
  queryClient?: QueryClient;
}

/**
 * Creates a fresh QueryClient for testing
 * Disables retries and sets short stale time for predictable tests
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * All providers wrapper for testing
 */
function AllProviders({
  children,
  queryClient,
  routerProps,
  useBrowserRouter = false,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  routerProps?: MemoryRouterProps;
  useBrowserRouter?: boolean;
}): JSX.Element {
  const Router = useBrowserRouter ? BrowserRouter : MemoryRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <Router {...(routerProps || {})}>
        {children}
        <Toaster position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}

/**
 * Render a component with all app providers
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { getByText } = renderWithProviders(<MyComponent />);
 *
 * // With initial route
 * renderWithProviders(<MyComponent />, { initialRoute: '/dashboard' });
 *
 * // With query client pre-populated
 * const queryClient = createTestQueryClient();
 * queryClient.setQueryData(['user'], mockUser);
 * renderWithProviders(<MyComponent />, { queryClient });
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult & { queryClient: QueryClient } {
  const {
    initialRoute,
    initialEntries,
    useBrowserRouter = false,
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  // Build router props
  const routerProps: MemoryRouterProps = {};
  if (initialEntries) {
    routerProps.initialEntries = initialEntries;
  } else if (initialRoute) {
    routerProps.initialEntries = [initialRoute];
  }

  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        queryClient={queryClient}
        routerProps={routerProps}
        useBrowserRouter={useBrowserRouter}
      >
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });

  return {
    ...result,
    queryClient,
  };
}

/**
 * Creates a test QueryClient instance
 */
export { createTestQueryClient };

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
