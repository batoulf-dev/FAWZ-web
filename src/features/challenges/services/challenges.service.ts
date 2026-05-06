/**
 * Challenges Service
 * API functions and TanStack Query hooks for challenge management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  Challenge,
  ChallengeListResponse,
  ChallengeListParams,
  UserChallengeProgress,
  UserChallengeProgressListResponse,
  UserProgressListParams,
  BadgeListResponse,
  UserBadgeListResponse,
  ChallengeWithProgress,
} from '../types/challenges.types';

// ==========================================
// API Base Path
// ==========================================

const CHALLENGE_BASE = '/fawz_challenge_system';

// ==========================================
// Query Keys Factory
// ==========================================

export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (params: ChallengeListParams) => [...challengeKeys.lists(), params] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengeKeys.details(), id] as const,
  active: () => [...challengeKeys.all, 'active'] as const,
  onboarding: () => [...challengeKeys.all, 'onboarding'] as const,
  progress: () => [...challengeKeys.all, 'progress'] as const,
  userProgress: (challengeId: string) => [...challengeKeys.progress(), challengeId] as const,
  allProgress: (params: UserProgressListParams) => [...challengeKeys.progress(), 'all', params] as const,
  badges: () => [...challengeKeys.all, 'badges'] as const,
  badgeList: () => [...challengeKeys.badges(), 'list'] as const,
  userBadges: () => [...challengeKeys.badges(), 'user'] as const,
};

// ==========================================
// API Functions
// ==========================================

// List challenges
async function listChallenges(params: ChallengeListParams = {}): Promise<ChallengeListResponse> {
  const response = await apiClient.get<ChallengeListResponse>(
    `${CHALLENGE_BASE}/challenges`,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        ...params,
      },
    },
  );
  return response.data;
}

// Get challenge by ID
async function getChallengeById(challengeId: string): Promise<Challenge> {
  const response = await apiClient.get<Challenge>(
    `${CHALLENGE_BASE}/challenges/${challengeId}`,
  );
  return response.data;
}

// Get active challenges
async function getActiveChallenges(): Promise<Challenge[]> {
  const response = await apiClient.get<ChallengeListResponse>(
    `${CHALLENGE_BASE}/challenges`,
    {
      params: {
        status: 'active',
        sort_by: 'end_date',
        sort_order: 'asc',
        page_size: 50,
      },
    },
  );
  return response.data.challenges_list;
}

// Get onboarding challenges
async function getOnboardingChallenges(): Promise<Challenge[]> {
  const response = await apiClient.get<ChallengeListResponse>(
    `${CHALLENGE_BASE}/challenges`,
    {
      params: {
        challenge_type: 'onboarding',
        status: 'active',
        sort_by: 'display_order',
        sort_order: 'asc',
      },
    },
  );
  return response.data.challenges_list;
}

// List user challenge progress
async function listUserProgress(
  params: UserProgressListParams = {},
): Promise<UserChallengeProgressListResponse> {
  const response = await apiClient.get<UserChallengeProgressListResponse>(
    `${CHALLENGE_BASE}/user_challenge_progresses`,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 50,
        ...params,
      },
    },
  );
  return response.data;
}

// Get progress for a specific challenge
async function getChallengeProgress(challengeId: string): Promise<UserChallengeProgress | null> {
  const response = await apiClient.get<UserChallengeProgressListResponse>(
    `${CHALLENGE_BASE}/user_challenge_progresses`,
    {
      params: { challenge_id: challengeId },
    },
  );
  return response.data.user_challenge_progresses_list[0] ?? null;
}

// List badges
async function listBadges(): Promise<BadgeListResponse> {
  const response = await apiClient.get<BadgeListResponse>(
    `${CHALLENGE_BASE}/badges`,
    {
      params: {
        is_active: true,
        sort_by: 'display_order',
        sort_order: 'asc',
        page_size: 100,
      },
    },
  );
  return response.data;
}

// List user badges
async function listUserBadges(): Promise<UserBadgeListResponse> {
  const response = await apiClient.get<UserBadgeListResponse>(
    `${CHALLENGE_BASE}/user_badges`,
    {
      params: {
        sort_by: 'earned_at',
        sort_order: 'desc',
        page_size: 100,
      },
    },
  );
  return response.data;
}

// Claim checkpoint reward
async function claimCheckpointReward(
  progressId: string,
  checkpointIndex: number,
): Promise<UserChallengeProgress> {
  const response = await apiClient.patch<UserChallengeProgress>(
    `${CHALLENGE_BASE}/user_challenge_progresses/${progressId}`,
    {
      claim_checkpoint: checkpointIndex,
    },
  );
  return response.data;
}

// ==========================================
// Combined Data Functions
// ==========================================

// Get challenges with user progress
async function getChallengesWithProgress(): Promise<ChallengeWithProgress[]> {
  const [challengesRes, progressRes] = await Promise.all([
    getActiveChallenges(),
    listUserProgress({ page_size: 100 }),
  ]);

  const progressMap = new Map(
    progressRes.user_challenge_progresses_list.map((p) => [p.challenge_id, p]),
  );

  const now = new Date();

  return challengesRes.map((challenge) => {
    const userProgress = progressMap.get(challenge.challenge_id);
    const endDate = new Date(challenge.end_date);
    const daysRemaining = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      ...challenge,
      userProgress,
      isActive: challenge.status === 'active' && daysRemaining > 0,
      isCompleted: userProgress?.status === 'completed',
      daysRemaining,
    };
  });
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// List challenges
export function useChallengeList(params: ChallengeListParams = {}) {
  return useQuery({
    queryKey: challengeKeys.list(params),
    queryFn: () => listChallenges(params),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single challenge
export function useChallenge(challengeId: string, enabled = true) {
  return useQuery({
    queryKey: challengeKeys.detail(challengeId),
    queryFn: () => getChallengeById(challengeId),
    enabled: enabled && !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get active challenges with progress
export function useActiveChallenges() {
  return useQuery({
    queryKey: challengeKeys.active(),
    queryFn: getChallengesWithProgress,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get onboarding challenges
export function useOnboardingChallenges() {
  return useQuery({
    queryKey: challengeKeys.onboarding(),
    queryFn: getOnboardingChallenges,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get user progress for a challenge
export function useChallengeProgress(challengeId: string, enabled = true) {
  return useQuery({
    queryKey: challengeKeys.userProgress(challengeId),
    queryFn: () => getChallengeProgress(challengeId),
    enabled: enabled && !!challengeId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all user progress
export function useAllUserProgress(params: UserProgressListParams = {}) {
  return useQuery({
    queryKey: challengeKeys.allProgress(params),
    queryFn: () => listUserProgress(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all badges
export function useBadges() {
  return useQuery({
    queryKey: challengeKeys.badgeList(),
    queryFn: listBadges,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Get user badges
export function useUserBadges() {
  return useQuery({
    queryKey: challengeKeys.userBadges(),
    queryFn: listUserBadges,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Claim checkpoint reward mutation
export function useClaimCheckpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      progressId,
      checkpointIndex,
    }: {
      progressId: string;
      checkpointIndex: number;
    }) => claimCheckpointReward(progressId, checkpointIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.progress() });
      queryClient.invalidateQueries({ queryKey: challengeKeys.active() });
    },
  });
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const challengeApi = {
  listChallenges,
  getChallengeById,
  getActiveChallenges,
  getOnboardingChallenges,
  listUserProgress,
  getChallengeProgress,
  listBadges,
  listUserBadges,
  claimCheckpointReward,
  getChallengesWithProgress,
};
