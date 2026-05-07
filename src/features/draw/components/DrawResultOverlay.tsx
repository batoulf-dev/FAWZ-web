/**
 * Draw Result Overlay Component
 * Full-screen page for win/loss/jackpot results
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Share2, Sparkles, Star, X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { cn } from '@/core/utils/cn';
import { formatCurrency } from '@/core/utils/formatters';
import { WinCelebration } from './WinCelebration';

interface DrawResultOverlayProps {
  /** Result type */
  type: 'win' | 'jackpot' | 'loss';
  /** Prize amount (for wins) */
  prizeAmount?: number;
  /** Prize tier label (for wins) */
  tier?: string;
  /** Whether overlay is visible */
  isVisible: boolean;
  /** Handler for share action */
  onShare?: () => void;
  /** Handler for view results action */
  onViewResults?: () => void;
  /** Handler for invite friends action */
  onInviteFriends?: () => void;
  /** Handler for closing overlay */
  onClose?: () => void;
}

function JackpotIcon() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6">
      <div className="absolute inset-0 bg-brand-gold rounded-full animate-pulse-glow" />
      <div className="absolute inset-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
        <Trophy className="h-12 w-12 text-white" />
      </div>
      {/* Orbiting stars */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-4 h-4 text-yellow-300"
          style={{
            animation: `orbit 2s linear infinite`,
            animationDelay: `${i * 0.5}s`,
            top: '50%',
            left: '50%',
          }}
        >
          <Star className="h-4 w-4 fill-current" />
        </div>
      ))}
    </div>
  );
}

function WinIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6">
      <div className="absolute inset-0 bg-brand-gold/30 rounded-full animate-ping" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-gold/30">
        <Sparkles className="h-10 w-10 text-white" />
      </div>
    </div>
  );
}

function LossIcon() {
  return (
    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
      <span className="text-4xl">🍀</span>
    </div>
  );
}

export function DrawResultOverlay({
  type,
  prizeAmount = 0,
  tier,
  isVisible,
  onShare,
  onInviteFriends,
  onClose,
}: DrawResultOverlayProps): JSX.Element | null {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Quick reveal - reduced delays for snappier feel
      const timeout = setTimeout(() => {
        setShowContent(true);
      }, type === 'jackpot' ? 500 : type === 'win' ? 300 : 200);

      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
      return undefined;
    }
  }, [isVisible, type]);

  if (!isVisible) return null;

  // Solid background colors (not transparent)
  const bgColor = {
    jackpot: 'bg-gradient-to-br from-amber-600 via-brand-gold to-yellow-500',
    win: 'bg-gradient-to-br from-brand-gold to-amber-600',
    loss: 'bg-gradient-to-br from-brand-primary to-brand-primary-dark',
  };

  return (
    <>
      {/* Celebration effects for wins */}
      {(type === 'win' || type === 'jackpot') && (
        <WinCelebration
          type={type}
          isActive={isVisible}
        />
      )}

      {/* Full-screen solid background page */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col',
          bgColor[type]
        )}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-3 text-white/80 hover:text-white transition-colors z-10 bg-white/10 rounded-full"
            aria-label={t('common.close')}
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            className={cn(
              'text-center text-white max-w-md w-full',
              'transform transition-all duration-700',
              showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            )}
          >
            {/* Icon */}
            {type === 'jackpot' && <JackpotIcon />}
            {type === 'win' && <WinIcon />}
            {type === 'loss' && <LossIcon />}

            {/* Title */}
            <h1
              className={cn(
                'font-bold mb-4',
                type === 'jackpot' ? 'text-4xl' : 'text-3xl'
              )}
            >
              {type === 'jackpot' && t('challenge.congratulations')}
              {type === 'win' && t('draw.youWon')}
              {type === 'loss' && t('draw.betterLuckNextTime')}
            </h1>

            {/* Prize amount for wins */}
            {(type === 'win' || type === 'jackpot') && prizeAmount > 0 && (
              <div className="mb-8">
                <p className="text-5xl font-bold mb-2">
                  {formatCurrency(prizeAmount, lang)}
                </p>
                {tier && (
                  <p className="text-lg opacity-80">{tier}</p>
                )}
              </div>
            )}

            {/* Encouragement message for losses */}
            {type === 'loss' && (
              <p className="text-lg opacity-90 mb-8">
                {t('draw.keepTrying')}
              </p>
            )}

            {/* Action buttons */}
            <div className="space-y-3 mt-8">
              {(type === 'win' || type === 'jackpot') && onShare && (
                <Button
                  onClick={onShare}
                  className="w-full bg-white text-amber-700 hover:bg-white/90 shadow-lg font-semibold"
                  size="lg"
                >
                  <Share2 className="h-5 w-5 me-2" />
                  {t('draw.shareWin')}
                </Button>
              )}

              {type === 'loss' && onInviteFriends && (
                <Button
                  onClick={onInviteFriends}
                  className="w-full bg-white text-brand-primary hover:bg-white/90 shadow-lg font-semibold"
                  size="lg"
                >
                  <Users className="h-5 w-5 me-2" />
                  {t('draw.inviteFriends')}
                </Button>
              )}

              {onClose && (
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full border-2 border-white text-white hover:bg-white/20 font-semibold"
                  size="lg"
                >
                  {t('common.close')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Orbit animation style */}
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
      `}</style>
    </>
  );
}

export default DrawResultOverlay;
