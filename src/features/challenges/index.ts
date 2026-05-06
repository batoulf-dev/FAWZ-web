/**
 * Challenges Feature Public API
 */

// Types
export type {
  Challenge,
  ChallengeCheckpoint,
  UserChallengeProgress,
  Badge,
  UserBadge,
  CommunityChallengeScore,
  ChallengeListResponse,
  UserChallengeProgressListResponse,
  BadgeListResponse,
  UserBadgeListResponse,
  ChallengeListParams,
  UserProgressListParams,
  ChallengeWithProgress,
  ChallengeCardData,
  WeeklySparkState,
  OnboardingProgressState,
  ChallengeType,
  ChallengeStatus,
  ProgressStatus,
  BadgeType,
} from './types/challenges.types';

// Enums
export {
  ChallengeTypeEnum,
  ChallengeStatusEnum,
  ProgressStatusEnum,
  BadgeTypeEnum,
} from './types/challenges.types';

// Service hooks
export {
  challengeKeys,
  useChallengeList,
  useChallenge,
  useActiveChallenges,
  useOnboardingChallenges,
  useChallengeProgress,
  useAllUserProgress,
  useBadges,
  useUserBadges,
  useClaimCheckpoint,
  challengeApi,
} from './services/challenges.service';
