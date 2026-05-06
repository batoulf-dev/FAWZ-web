/**
 * Paginated Query Hook
 * Wrapper for TanStack Query with pagination support
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useSearchParams } from 'react-router';
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import type { PaginatedResponse } from '@/core/network/types/apiResponse';

interface PaginationState {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

interface UsePaginatedQueryOptions<T>
  extends Omit<UseQueryOptions<PaginatedResponse<T>>, 'queryKey' | 'queryFn'> {
  queryKey: QueryKey;
  queryFn: (params: PaginationState) => Promise<PaginatedResponse<T>>;
  defaultPerPage?: number;
  syncToUrl?: boolean;
}

interface UsePaginatedQueryReturn<T> {
  data: T[];
  meta: PaginatedResponse<T>['meta'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  defaultPerPage = 20,
  syncToUrl = true,
  ...options
}: UsePaginatedQueryOptions<T>): UsePaginatedQueryReturn<T> {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get pagination from URL or defaults
  const page = syncToUrl
    ? parseInt(searchParams.get('page') ?? '1', 10)
    : 1;
  const perPage = syncToUrl
    ? parseInt(searchParams.get('per_page') ?? String(defaultPerPage), 10)
    : defaultPerPage;
  const sortBy = syncToUrl ? searchParams.get('sort_by') ?? undefined : undefined;
  const sortOrder = (
    syncToUrl ? searchParams.get('sort_order') ?? 'desc' : 'desc'
  ) as 'asc' | 'desc';

  const paginationState: PaginationState = {
    page,
    perPage,
    sortBy,
    sortOrder,
  };

  const query = useQuery({
    queryKey: [...queryKey, paginationState],
    queryFn: () => queryFn(paginationState),
    ...options,
  });

  const meta = query.data?.meta;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;

  const updateParams = (updates: Partial<PaginationState>) => {
    if (!syncToUrl) return;

    const newParams = new URLSearchParams(searchParams);

    if (updates.page !== undefined) {
      newParams.set('page', String(updates.page));
    }
    if (updates.perPage !== undefined) {
      newParams.set('per_page', String(updates.perPage));
    }
    if (updates.sortBy !== undefined) {
      newParams.set('sort_by', updates.sortBy);
    }
    if (updates.sortOrder !== undefined) {
      newParams.set('sort_order', updates.sortOrder);
    }

    setSearchParams(newParams, { replace: true });
  };

  return {
    data: query.data?.data ?? [],
    meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    page,
    perPage,
    totalPages,
    total,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    setPage: (newPage: number) => updateParams({ page: newPage }),
    setPerPage: (newPerPage: number) =>
      updateParams({ perPage: newPerPage, page: 1 }),
    nextPage: () => {
      if (page < totalPages) updateParams({ page: page + 1 });
    },
    prevPage: () => {
      if (page > 1) updateParams({ page: page - 1 });
    },
    refetch: query.refetch,
  };
}
