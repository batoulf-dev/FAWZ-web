/**
 * Consent Service
 * API functions and TanStack Query hooks for user consent
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  UserConsent,
  UserConsentsListResponse,
  CreateUserConsentRequest,
  UpdateUserConsentRequest,
  ConsentType,
  ConsentStatus,
  ConsentListParams,
} from '../types/consent.types';

// API base path
const BASE_PATH = '/fawz_consumer_engagement';

// Current consent versions
export const CONSENT_VERSIONS = {
  sharia_disclosure: '1.0',
  media_participation: '1.0',
} as const;

// Query key factory
export const consentKeys = {
  all: ['consent'] as const,
  lists: () => [...consentKeys.all, 'list'] as const,
  list: (params: ConsentListParams) => [...consentKeys.lists(), params] as const,
  details: () => [...consentKeys.all, 'detail'] as const,
  detail: (id: string) => [...consentKeys.details(), id] as const,
  byType: (type: ConsentType) => [...consentKeys.all, 'type', type] as const,
  status: () => [...consentKeys.all, 'status'] as const,
};

// API functions
async function fetchConsents(params: ConsentListParams = {}): Promise<UserConsentsListResponse> {
  const response = await apiClient.get<UserConsentsListResponse>(
    `${BASE_PATH}/user_consents`,
    { params },
  );
  return response.data;
}

async function fetchConsentById(id: string): Promise<UserConsent> {
  const response = await apiClient.get<UserConsent>(`${BASE_PATH}/user_consents/${id}`);
  return response.data;
}

async function createConsent(
  data: CreateUserConsentRequest,
): Promise<{ user_consent_id: string; message: string }> {
  const response = await apiClient.post<{ user_consent_id: string; message: string }>(
    `${BASE_PATH}/user_consents`,
    data,
  );
  return response.data;
}

async function updateConsent(
  id: string,
  data: UpdateUserConsentRequest,
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(
    `${BASE_PATH}/user_consents/${id}`,
    data,
  );
  return response.data;
}

// Query hooks

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Fetch all user consents
 */
export function useConsents(params: ConsentListParams = {}) {
  return useQuery({
    queryKey: consentKeys.list(params),
    queryFn: () => fetchConsents(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch consent by ID
 */
export function useConsent(id: string) {
  return useQuery({
    queryKey: consentKeys.detail(id),
    queryFn: () => fetchConsentById(id),
    enabled: Boolean(id),
  });
}

/**
 * Fetch consent by type
 */
export function useConsentByType(type: ConsentType) {
  return useQuery({
    queryKey: consentKeys.byType(type),
    queryFn: async (): Promise<UserConsent | null> => {
      const response = await fetchConsents({ consent_type: type, page_size: 1 });
      return response.user_consents_list[0] ?? null;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch overall consent status
 */
export function useConsentStatus() {
  return useQuery({
    queryKey: consentKeys.status(),
    queryFn: async (): Promise<ConsentStatus> => {
      const response = await fetchConsents({ page_size: 100 });
      const consents = response.user_consents_list;

      const shariaConsent = consents.find((c) => c.consent_type === 'sharia_disclosure');
      const mediaConsent = consents.find((c) => c.consent_type === 'media_participation');

      return {
        shariaDisclosureAccepted: shariaConsent?.consented ?? false,
        shariaDisclosureAcceptedAt: shariaConsent?.consented_at ?? undefined,
        mediaConsentDecision: mediaConsent?.consented,
        mediaConsentDecisionAt: mediaConsent?.consented_at ?? undefined,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Check if sharia disclosure is accepted
 */
export function useShariaDisclosureAccepted() {
  return useQuery({
    queryKey: [...consentKeys.byType('sharia_disclosure'), 'accepted'],
    queryFn: async (): Promise<boolean> => {
      const response = await fetchConsents({
        consent_type: 'sharia_disclosure',
        consented: true,
        page_size: 1,
      });
      return response.user_consents_list.length > 0;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Accept sharia disclosure mutation
 */
export function useAcceptShariaDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Check if consent already exists
      const existingResponse = await fetchConsents({
        consent_type: 'sharia_disclosure',
        page_size: 1,
      });

      const existingConsent = existingResponse.user_consents_list[0];

      if (existingConsent) {
        // Update existing consent
        return updateConsent(existingConsent.user_consent_id, {
          consented: true,
          consented_at: new Date().toISOString(),
          consent_version: CONSENT_VERSIONS.sharia_disclosure,
        });
      } else {
        // Create new consent
        return createConsent({
          consent_type: 'sharia_disclosure',
          consent_version: CONSENT_VERSIONS.sharia_disclosure,
          consented: true,
          consented_at: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consentKeys.all });
    },
  });
}

/**
 * Submit media consent mutation
 */
export function useSubmitMediaConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consented: boolean) => {
      // Check if consent already exists
      const existingResponse = await fetchConsents({
        consent_type: 'media_participation',
        page_size: 1,
      });

      const existingConsent = existingResponse.user_consents_list[0];

      if (existingConsent) {
        // Update existing consent
        return updateConsent(existingConsent.user_consent_id, {
          consented,
          consented_at: new Date().toISOString(),
          consent_version: CONSENT_VERSIONS.media_participation,
        });
      } else {
        // Create new consent
        return createConsent({
          consent_type: 'media_participation',
          consent_version: CONSENT_VERSIONS.media_participation,
          consented,
          consented_at: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consentKeys.all });
    },
  });
}

/**
 * Create or update consent mutation (generic)
 */
export function useUpsertConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, consented }: { type: ConsentType; consented: boolean }) => {
      // Check if consent already exists
      const existingResponse = await fetchConsents({
        consent_type: type,
        page_size: 1,
      });

      const existingConsent = existingResponse.user_consents_list[0];
      const version =
        type === 'sharia_disclosure'
          ? CONSENT_VERSIONS.sharia_disclosure
          : CONSENT_VERSIONS.media_participation;

      if (existingConsent) {
        return updateConsent(existingConsent.user_consent_id, {
          consented,
          consented_at: new Date().toISOString(),
          consent_version: version,
        });
      } else {
        return createConsent({
          consent_type: type,
          consent_version: version,
          consented,
          consented_at: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consentKeys.all });
    },
  });
}
