/**
 * SCR-008: Challenge Detail
 * Detailed view of a specific challenge with progress
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Trophy, Clock, Gift, CheckCircle2, Target } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useChallenge, useChallengeProgress, useClaimCheckpoint } from '../services/challenges.service';
import toast from 'react-hot-toast';

// Progress bar with checkpoints
function ProgressBarWithCheckpoints({
  progress,
  target,
  checkpoints,
  claimedCheckpoints,
  onClaimCheckpoint,
  isClaimingLoading,
}: {
  progress: number;
  target: number;
  checkpoints: Array<{ target_value: number; reward_entries: number; reward_cash_iqd: number }>;
  claimedCheckpoints: number[];
  onClaimCheckpoint: (index: number) => void;
  isClaimingLoading: boolean;
}) {
  const progressPercent = Math.min((progress / target) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Progress Text */}
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-text-primary">
          {progress} / {target}
        </span>
        <span className="text-lg font-semibold text-brand-primary">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-surface-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-gold rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Checkpoint Markers */}
        {checkpoints.map((checkpoint, idx) => {
          const position = (checkpoint.target_value / target) * 100;
          const isReached = progress >= checkpoint.target_value;
          const isClaimed = claimedCheckpoints.includes(idx);
          const canClaim = isReached && !isClaimed;

          return (
            <button
              key={idx}
              disabled={!canClaim || isClaimingLoading}
              onClick={() => canClaim && onClaimCheckpoint(idx)}
              className={`
                absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${isClaimed
                  ? 'bg-success text-white'
                  : canClaim
                    ? 'bg-brand-gold text-white animate-pulse cursor-pointer'
                    : isReached
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface-tertiary text-text-muted'
                }
              `}
              style={{ left: `calc(${position}% - 12px)` }}
            >
              {isClaimed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Gift className="h-3 w-3" />
              )}
            </button>
          );
        })}
      </div>

      {/* Checkpoint Details */}
      {checkpoints.length > 0 && (
        <div className="flex justify-between text-xs text-text-secondary">
          {checkpoints.map((checkpoint, idx) => (
            <div key={idx} className="text-center">
              <p>{checkpoint.target_value}</p>
              <p className="text-brand-gold">+{checkpoint.reward_entries}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Loading skeleton
function ChallengeDetailSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export default function ChallengeDetailPage(): React.ReactElement {
  const { t } = useTranslation('consumer');
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const isOnline = useNetworkStatus();

  usePageTitle(t('challenge.challengeDetail'));

  const {
    data: challenge,
    isLoading: challengeLoading,
    error,
    refetch,
  } = useChallenge(challengeId ?? '', !!challengeId);

  const {
    data: progress,
    isLoading: progressLoading,
  } = useChallengeProgress(challengeId ?? '', !!challengeId);

  const claimMutation = useClaimCheckpoint();

  const isLoading = challengeLoading || progressLoading;

  const handleClaimCheckpoint = async (checkpointIndex: number) => {
    if (!progress?.user_challenge_progress_id) return;

    try {
      await claimMutation.mutateAsync({
        progressId: progress.user_challenge_progress_id,
        checkpointIndex,
      });
      toast.success(t('challenge.checkpointClaimed'));
    } catch {
      toast.error(t('errors.claimFailed'));
    }
  };

  if (isLoading) {
    return <ChallengeDetailSkeleton />;
  }

  if (error && isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4">
        <ErrorState message={t('challenge.notFound')} />
      </div>
    );
  }

  const currentProgress = progress?.current_value ?? 0;
  const isCompleted = progress?.status === 'completed';
  const isExpired = new Date(challenge.end_date) < new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  // Mock checkpoints if not provided
  const checkpoints = challenge.checkpoints ?? [];
  const claimedCheckpoints = progress?.checkpoints_claimed ?? [];

  return (
    <div className="min-h-screen bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            {t('common:back')}
          </button>
          {isCompleted && (
            <Badge variant="success" className="bg-success text-white">
              <CheckCircle2 className="h-3 w-3 me-1" />
              {t('challenge.completed')}
            </Badge>
          )}
          {isExpired && !isCompleted && (
            <Badge variant="error">{t('challenge.expired')}</Badge>
          )}
        </div>

        {/* Challenge Header Card */}
        <Card
          className={
            isCompleted
              ? 'bg-success/10 border-success'
              : 'bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white'
          }
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`p-3 rounded-xl ${
                  isCompleted ? 'bg-success/10' : 'bg-white/20'
                }`}
              >
                {isCompleted ? (
                  <Trophy className="h-6 w-6 text-success" />
                ) : (
                  <Target className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isCompleted ? 'text-text-primary' : ''
                  }`}
                >
                  {challenge.name_ar}
                </h1>
                {challenge.target_category_filter && (
                  <Badge
                    className={isCompleted ? 'border border-white/30 text-white bg-transparent' : 'border border-white/30 text-white bg-transparent'}
                  >
                    {t('challenge.category')}: {challenge.target_category_filter}
                  </Badge>
                )}
              </div>
            </div>

            {/* Time Remaining */}
            {!isCompleted && !isExpired && (
              <div
                className={`flex items-center gap-2 ${
                  isCompleted ? 'text-text-secondary' : 'opacity-80'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {t('challenge.endsIn', { days: daysRemaining })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <div>
          <h2 className="font-semibold text-text-primary mb-2">
            {t('challenge.howToComplete')}
          </h2>
          <p className="text-text-secondary">{challenge.description_ar}</p>
        </div>

        {/* Progress Section */}
        <div>
          <h2 className="font-semibold text-text-primary mb-4">
            {t('challenge.yourProgress')}
          </h2>
          {isCompleted ? (
            <Card className="bg-success/10 border-success">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-2" />
                <p className="font-bold text-text-primary text-lg mb-1">
                  {t('challenge.congratulations')}
                </p>
                <p className="text-text-secondary">
                  {t('challenge.completedDescription')}
                </p>
              </CardContent>
            </Card>
          ) : isExpired ? (
            <Card className="bg-surface-secondary">
              <CardContent className="p-4 text-center">
                <p className="text-text-secondary">
                  {t('challenge.expiredDescription', { progress: currentProgress, target: challenge.target_value })}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ProgressBarWithCheckpoints
              progress={currentProgress}
              target={challenge.target_value}
              checkpoints={checkpoints}
              claimedCheckpoints={claimedCheckpoints}
              onClaimCheckpoint={handleClaimCheckpoint}
              isClaimingLoading={claimMutation.isPending}
            />
          )}
        </div>

        {/* Reward Section */}
        <Card className="bg-brand-gold/10 border-brand-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <Gift className="h-5 w-5 text-brand-gold" />
              </div>
              <h2 className="font-semibold text-text-primary">
                {t('challenge.reward')}
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                {challenge.reward_entries > 0 && (
                  <p className="text-lg font-bold text-brand-gold">
                    +{challenge.reward_entries} {t('entries.numbers')}
                  </p>
                )}
                {challenge.reward_cash_iqd > 0 && (
                  <p className="text-lg font-bold text-brand-gold">
                    +{challenge.reward_cash_iqd.toLocaleString('ar-IQ')} IQD
                  </p>
                )}
              </div>
              {isCompleted && (
                <Badge variant="success">{t('challenge.rewardClaimed')}</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        {!isCompleted && !isExpired && (
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            {t('challenge.startNow')}
          </Button>
        )}
      </div>
    </div>
  );
}
