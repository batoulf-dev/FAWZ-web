/**
 * Disputes Service
 * API functions and TanStack Query hooks for disputes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  Dispute,
  DisputeListResponse,
  DisputeListParams,
  CreateDisputeRequest,
  DisputeFormValues,
} from '../types/disputes.types';

// API base path
const BASE_PATH = '/fawz_fraud_compliance';

// Max disputes per month limit
export const MAX_DISPUTES_PER_MONTH = 3;

// Query key factory
export const disputeKeys = {
  all: ['disputes'] as const,
  lists: () => [...disputeKeys.all, 'list'] as const,
  list: (params: DisputeListParams) => [...disputeKeys.lists(), params] as const,
  details: () => [...disputeKeys.all, 'detail'] as const,
  detail: (id: string) => [...disputeKeys.details(), id] as const,
  monthlyCount: () => [...disputeKeys.all, 'monthly-count'] as const,
};

// API functions
async function fetchDisputes(params: DisputeListParams = {}): Promise<DisputeListResponse> {
  const response = await apiClient.get<DisputeListResponse>(`${BASE_PATH}/disputes`, { params });
  return response.data;
}

async function fetchDisputeById(id: string): Promise<Dispute> {
  const response = await apiClient.get<Dispute>(`${BASE_PATH}/disputes/${id}`);
  return response.data;
}

async function createDispute(
  data: CreateDisputeRequest,
): Promise<{ dispute_id: string; message: string }> {
  // Generate dispute number (timestamp-based)
  const disputeNumber = `DSP-${Date.now().toString(36).toUpperCase()}`;

  const response = await apiClient.post<{ dispute_id: string; message: string }>(
    `${BASE_PATH}/disputes`,
    {
      ...data,
      dispute_number: disputeNumber,
      submitter_type: 'consumer',
      submitted_at: new Date().toISOString(),
      sla_deadline_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours SLA
      status: 'submitted',
    },
  );
  return response.data;
}

// Transform form values to API request
function transformFormToRequest(values: DisputeFormValues): CreateDisputeRequest {
  return {
    dispute_type: values.disputeType,
    description: values.description,
    claimed_fawz_number: values.claimedFawzNumber || null,
    claimed_amount_iqd: values.claimedAmountIqd ?? null,
    related_draw_id: values.relatedDrawId ?? null,
    evidence_urls: values.evidenceUrls?.length ? JSON.stringify(values.evidenceUrls) : null,
  };
}

// Query hooks

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Fetch disputes list
 */
export function useDisputes(params: DisputeListParams = {}) {
  return useQuery({
    queryKey: disputeKeys.list(params),
    queryFn: () => fetchDisputes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single dispute by ID
 */
export function useDispute(id: string) {
  return useQuery({
    queryKey: disputeKeys.detail(id),
    queryFn: () => fetchDisputeById(id),
    enabled: Boolean(id),
  });
}

/**
 * Fetch monthly dispute count for limit checking
 */
export function useMonthlyDisputeCount() {
  return useQuery({
    queryKey: disputeKeys.monthlyCount(),
    queryFn: async (): Promise<{ count: number; limit: number; canSubmit: boolean }> => {
      // Get disputes submitted this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch all disputes and filter by date
      const response = await fetchDisputes({ page_size: 100 });

      const thisMonthDisputes = response.disputes_list.filter((d) => {
        const submittedDate = new Date(d.submitted_at);
        return submittedDate >= startOfMonth;
      });

      return {
        count: thisMonthDisputes.length,
        limit: MAX_DISPUTES_PER_MONTH,
        canSubmit: thisMonthDisputes.length < MAX_DISPUTES_PER_MONTH,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Check if user can submit dispute
 */
export function useCanSubmitDispute() {
  const { data, isLoading } = useMonthlyDisputeCount();

  return {
    canSubmit: data?.canSubmit ?? false,
    remainingDisputes: data ? data.limit - data.count : 0,
    isLoading,
  };
}

/**
 * Submit dispute mutation
 */
export function useSubmitDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: DisputeFormValues) => {
      // Check limit first
      const countResponse = await queryClient.fetchQuery({
        queryKey: disputeKeys.monthlyCount(),
        queryFn: async () => {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const response = await fetchDisputes({ page_size: 100 });
          const thisMonthDisputes = response.disputes_list.filter((d) => {
            const submittedDate = new Date(d.submitted_at);
            return submittedDate >= startOfMonth;
          });
          return {
            count: thisMonthDisputes.length,
            limit: MAX_DISPUTES_PER_MONTH,
            canSubmit: thisMonthDisputes.length < MAX_DISPUTES_PER_MONTH,
          };
        },
      });

      if (!countResponse.canSubmit) {
        throw new Error('تم الوصول للحد الأقصى للشكاوى هذا الشهر (3 شكاوى)');
      }

      const request = transformFormToRequest(values);
      return createDispute(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: disputeKeys.monthlyCount() });
    },
  });
}

/**
 * Get recent disputes for quick access
 */
export function useRecentDisputes(limit = 5) {
  return useQuery({
    queryKey: [...disputeKeys.lists(), 'recent', limit],
    queryFn: async () => {
      const response = await fetchDisputes({
        page_size: limit,
        sort_by: 'submitted_at',
        sort_order: 'desc',
      });
      return response.disputes_list;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get pending disputes count
 */
export function usePendingDisputesCount() {
  return useQuery({
    queryKey: [...disputeKeys.lists(), 'pending-count'],
    queryFn: async () => {
      const response = await fetchDisputes({
        status: 'under_review',
        page_size: 1,
      });
      return response.total_disputes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
