/**
 * Profile Service
 * API functions and TanStack Query hooks for user profile
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  ConsumerUser,
  UpdateConsumerUserRequest,
  WinnerCardData,
  ProfileSummary,
  ProfileStats,
} from '../types/profile.types';

// API base path
const BASE_PATH = '/fawz_consumer_engagement';

// Query key factory
export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  detail: (id: string) => [...profileKeys.all, 'detail', id] as const,
  summary: () => [...profileKeys.all, 'summary'] as const,
  stats: () => [...profileKeys.all, 'stats'] as const,
  winnerCard: (drawId: string, userId: string) => [...profileKeys.all, 'winner-card', drawId, userId] as const,
};

// API functions
async function fetchMyProfile(): Promise<ConsumerUser> {
  // Get the current user's consumer profile
  // The API uses the JWT token to identify the user
  const response = await apiClient.get<{ consumer_users_list: ConsumerUser[] }>(
    `${BASE_PATH}/consumer_users`,
    { params: { page_size: 1 } },
  );

  // Return first (and only) user - this is the current user
  if (response.data.consumer_users_list.length === 0) {
    throw new Error('Profile not found');
  }

  return response.data.consumer_users_list[0];
}

async function fetchProfileById(id: string): Promise<ConsumerUser> {
  const response = await apiClient.get<ConsumerUser>(`${BASE_PATH}/consumer_users/${id}`);
  return response.data;
}

async function updateProfile(
  id: string,
  data: UpdateConsumerUserRequest,
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(
    `${BASE_PATH}/consumer_users/${id}`,
    data,
  );
  return response.data;
}

// Transform consumer user to profile summary
function toProfileSummary(user: ConsumerUser): ProfileSummary {
  return {
    displayName: user.display_name ?? 'Fawz User',
    memberSince: user.created_at,
    accountTier: user.is_ambassador ? 'ambassador' : user.is_new ? 'new' : 'established',
    totalEntriesEarned: user.total_entries_earned,
    totalPrizesWon: 0, // Will be calculated from prizes API
    totalPrizesWonIqd: user.total_prizes_won_iqd,
    referralCount: user.referral_count_month,
    badges: [], // Will be fetched from badges API
    isAmbassador: user.is_ambassador,
    city: user.city ?? undefined,
    governorate: user.governorate ?? undefined,
  };
}

// Query hooks

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Fetch current user's profile
 */
export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchMyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch profile by ID
 */
export function useProfile(id: string) {
  return useQuery({
    queryKey: profileKeys.detail(id),
    queryFn: () => fetchProfileById(id),
    enabled: Boolean(id),
  });
}

/**
 * Fetch profile summary (transformed for display)
 */
export function useProfileSummary() {
  return useQuery({
    queryKey: profileKeys.summary(),
    queryFn: async (): Promise<ProfileSummary> => {
      const profile = await fetchMyProfile();
      return toProfileSummary(profile);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsumerUserRequest }) =>
      updateProfile(id, data),
    onSuccess: () => {
      // Invalidate all profile queries
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Fetch winner card data for sharing
 */
export function useWinnerCard(drawId: string, userId: string) {
  return useQuery({
    queryKey: profileKeys.winnerCard(drawId, userId),
    queryFn: async (): Promise<WinnerCardData> => {
      // This would fetch from a winner card endpoint
      // For now, construct from draw and user data
      const profile = await fetchProfileById(userId);

      // In production, this would fetch from a dedicated endpoint
      return {
        userId,
        drawId,
        drawName: `Weekly Draw`, // Would come from draws API
        drawNameAr: `السحب الأسبوعي`,
        winnerName: profile.display_name ?? 'Fawz Winner',
        prizeAmount: 0, // Would come from prizes API
        prizeTier: 'Last-3',
        prizeTierAr: 'آخر ٣ أرقام',
        winningNumber: '',
        drawDate: new Date().toISOString(),
        shareUrl: `${window.location.origin}/winner/${drawId}/share`,
      };
    },
    enabled: Boolean(drawId) && Boolean(userId),
  });
}

/**
 * Fetch profile stats
 */
export function useProfileStats() {
  return useQuery({
    queryKey: profileKeys.stats(),
    queryFn: async (): Promise<ProfileStats> => {
      // Fetch profile for lifetime stats context
      await fetchMyProfile();

      // In production, these would be calculated from various APIs
      return {
        totalDrawsEntered: 0, // From entries API
        totalEntriesThisWeek: 0, // From entries API
        lastDrawEntryCount: 0, // From entries API
        winStreak: 0, // From prizes API
        challengesCompleted: 0, // From challenges API
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
