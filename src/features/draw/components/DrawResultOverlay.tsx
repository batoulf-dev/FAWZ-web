/**
 * Draw Result Overlay Component
 * Full-screen overlay for win/loss/jackpot results
 * - White background with confetti for regular wins
 * - Yellow/gold background with fireworks for jackpot
 * - Black background for losses
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Share2, Star, X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { cn } from '@/core/utils/cn';
import { formatCurrency } from '@/core/utils/formatters';

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

// Confetti colors for regular wins
const CONFETTI_COLORS = ['#FFD700', '#FFC107', '#FF9800', '#4CAF50', '#2196F3', '#E91E63'];

// Firework colors for jackpot
const FIREWORK_COLORS = ['#FFD700', '#FFC107', '#FF5722', '#E91E63', '#9C27B0', '#00BCD4'];

// Confetti particle component
function ConfettiParticle({
  color,
  startX,
  delay,
  duration
}: {
  color: string;
  startX: number;
  delay: number;
  duration: number;
}) {
  const style = useMemo(() => ({
    '--confetti-x': `${(Math.random() - 0.5) * 200}px`,
    '--confetti-y': `${window.innerHeight + 100}px`,
    '--confetti-rotate': `${Math.random() * 720}deg`,
    left: `${startX}%`,
    top: '-20px',
    backgroundColor: color,
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
  } as React.CSSProperties), [color, startX, delay, duration]);

  return (
    <div
      className="confetti-particle"
      style={{ // dynamic — cannot use Tailwind for computed particle animations
        ...style,
        width: Math.random() * 8 + 6,
        height: Math.random() * 8 + 6,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      }}
    />
  );
}

// Confetti burst for regular wins
function ConfettiBurst({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    color: string;
    startX: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Generate ~60 confetti particles
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      startX: Math.random() * 100,
      delay: Math.random() * 500,
      duration: 2500 + Math.random() * 1000,
    }));

    setParticles(newParticles);

    // Clean up after animation
    const cleanup = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(cleanup);
  }, [isActive]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          color={p.color}
          startX={p.startX}
          delay={p.delay}
          duration={p.duration}
        />
      ))}
    </div>
  );
}

// Firework burst particle
function FireworkParticle({
  centerX,
  centerY,
  angle,
  distance,
  color,
  delay,
  size,
}: {
  centerX: number;
  centerY: number;
  angle: number;
  distance: number;
  color: string;
  delay: number;
  size: number;
}) {
  const endX = Math.cos(angle) * distance;
  const endY = Math.sin(angle) * distance;

  return (
    <div
      className="absolute rounded-full"
      style={{ // dynamic — cannot use Tailwind for computed firework particle animations
        left: centerX,
        top: centerY,
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        animation: `firework-particle 1s ease-out ${delay}ms forwards`,
        '--end-x': `${endX}px`,
        '--end-y': `${endY}px`,
      } as React.CSSProperties}
    />
  );
}

// Single firework explosion
function FireworkExplosion({
  x,
  y,
  delay,
  particleCount = 24,
}: {
  x: number;
  y: number;
  delay: number;
  particleCount?: number;
}) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (i / particleCount) * Math.PI * 2,
      distance: 60 + Math.random() * 80,
      color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
      size: 4 + Math.random() * 4,
    }));
  }, [particleCount]);

  return (
    <>
      {particles.map((p) => (
        <FireworkParticle
          key={p.id}
          centerX={x}
          centerY={y}
          angle={p.angle}
          distance={p.distance}
          color={p.color}
          delay={delay}
          size={p.size}
        />
      ))}
    </>
  );
}

// Fireworks animation for jackpot
function FireworksBurst({ isActive }: { isActive: boolean }) {
  const [explosions, setExplosions] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setExplosions([]);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Generate multiple firework explosions
    const newExplosions = [
      { id: 0, x: window.innerWidth * 0.3, y: window.innerHeight * 0.3, delay: 0 },
      { id: 1, x: window.innerWidth * 0.7, y: window.innerHeight * 0.25, delay: 300 },
      { id: 2, x: window.innerWidth * 0.5, y: window.innerHeight * 0.4, delay: 600 },
      { id: 3, x: window.innerWidth * 0.2, y: window.innerHeight * 0.5, delay: 900 },
      { id: 4, x: window.innerWidth * 0.8, y: window.innerHeight * 0.45, delay: 1200 },
      { id: 5, x: window.innerWidth * 0.4, y: window.innerHeight * 0.2, delay: 1500 },
      { id: 6, x: window.innerWidth * 0.6, y: window.innerHeight * 0.55, delay: 1800 },
    ];

    setExplosions(newExplosions);

    // Clean up after animation
    const cleanup = setTimeout(() => {
      setExplosions([]);
    }, 4000);

    return () => clearTimeout(cleanup);
  }, [isActive]);

  if (explosions.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {explosions.map((e) => (
        <FireworkExplosion
          key={e.id}
          x={e.x}
          y={e.y}
          delay={e.delay}
        />
      ))}
    </div>
  );
}

function JackpotIcon({ animate }: { animate: boolean }) {
  return (
    <div
      className={cn(
        'relative w-28 h-28 mx-auto mb-8',
        'transition-all duration-700 ease-out',
        animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      )}
    >
      <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse-glow" />
      <div className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-amber-400 rounded-full flex items-center justify-center shadow-2xl">
        <Trophy className="h-14 w-14 text-amber-700 drop-shadow-lg" />
      </div>
      {/* Orbiting stars */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute w-5 h-5 text-white"
          style={{ // dynamic — cannot use Tailwind for computed animation delays
            animation: `orbit 2.5s linear infinite`,
            animationDelay: `${i * 0.625}s`,
            top: '50%',
            left: '50%',
          }}
        >
          <Star className="h-5 w-5 fill-current drop-shadow-lg" />
        </div>
      ))}
    </div>
  );
}

function WinIcon({ animate }: { animate: boolean }) {
  return (
    <div
      className={cn(
        'relative w-24 h-24 mx-auto mb-8',
        'transition-all duration-700 ease-out',
        animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      )}
    >
      <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-ping" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-brand-gold/40">
        <Star className="h-12 w-12 text-white drop-shadow-lg" />
      </div>
    </div>
  );
}

function LossIcon({ animate }: { animate: boolean }) {
  return (
    <div
      className={cn(
        'relative w-24 h-24 mx-auto mb-8',
        'transition-all duration-700 ease-out delay-100',
        animate ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      )}
    >
      {/* Soft glow behind */}
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl" />
      {/* Icon container */}
      <div className="relative w-24 h-24 bg-gradient-to-br from-white/15 to-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
        <span className="text-5xl">🍀</span>
      </div>
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
  const [showOverlay, setShowOverlay] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Staggered animation sequence for smooth reveal
      const timers: NodeJS.Timeout[] = [];

      timers.push(setTimeout(() => setShowOverlay(true), 50));
      timers.push(setTimeout(() => setShowIcon(true), 200));
      timers.push(setTimeout(() => setShowTitle(true), 400));
      timers.push(setTimeout(() => setShowContent(true), 550));
      timers.push(setTimeout(() => setShowButtons(true), 700));

      return () => timers.forEach(clearTimeout);
    } else {
      setShowOverlay(false);
      setShowIcon(false);
      setShowTitle(false);
      setShowContent(false);
      setShowButtons(false);
      return undefined;
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // Background colors: white for win, yellow/gold for jackpot, black for loss
  const bgColor = {
    jackpot: 'bg-gradient-to-b from-yellow-400 via-amber-400 to-yellow-500',
    win: 'bg-white',
    loss: 'bg-gradient-to-b from-zinc-900 via-neutral-900 to-black',
  };

  // Text colors based on background
  const textColor = {
    jackpot: 'text-amber-900',
    win: 'text-gray-900',
    loss: 'text-white',
  };

  const secondaryTextColor = {
    jackpot: 'text-amber-800/80',
    win: 'text-gray-600',
    loss: 'text-white/70',
  };

  return (
    <>
      {/* Full-screen overlay with fade-in */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex flex-col',
          'transition-opacity duration-500 ease-out',
          bgColor[type],
          showOverlay ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Confetti for regular wins */}
        {type === 'win' && <ConfettiBurst isActive={showOverlay} />}

        {/* Fireworks for jackpot */}
        {type === 'jackpot' && <FireworksBurst isActive={showOverlay} />}

        {/* Subtle animated background pattern for loss */}
        {type === 'loss' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/4 -start-1/4 w-1/2 h-1/2 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/4 -end-1/4 w-1/2 h-1/2 bg-brand-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} /> {/* dynamic — cannot use Tailwind */}
          </div>
        )}

        {/* Close button with smooth entrance */}
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 end-4 p-3 transition-all duration-300 z-20',
              'rounded-full backdrop-blur-sm',
              'transform',
              type === 'loss'
                ? 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
                : 'text-gray-500 hover:text-gray-700 bg-black/5 hover:bg-black/10',
              showOverlay ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            )}
            aria-label={t('common.close')}
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* Content container */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className={cn('text-center max-w-md w-full', textColor[type])}>
            {/* Icon with scale animation */}
            {type === 'jackpot' && <JackpotIcon animate={showIcon} />}
            {type === 'win' && <WinIcon animate={showIcon} />}
            {type === 'loss' && <LossIcon animate={showIcon} />}

            {/* Title with slide-up animation */}
            <h1
              className={cn(
                'font-bold mb-4',
                'transition-all duration-500 ease-out',
                type === 'jackpot' ? 'text-4xl' : 'text-3xl',
                showTitle ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
            >
              {type === 'jackpot' && t('draw.jackpotWin')}
              {type === 'win' && t('draw.youWon')}
              {type === 'loss' && t('draw.betterLuckNextTime')}
            </h1>

            {/* Prize amount for wins with fade-in */}
            {(type === 'win' || type === 'jackpot') && prizeAmount > 0 && (
              <div
                className={cn(
                  'mb-8',
                  'transition-all duration-500 ease-out delay-100',
                  showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
              >
                <p className="text-5xl font-bold mb-2 drop-shadow-sm">
                  {formatCurrency(prizeAmount, lang)}
                </p>
                {tier && (
                  <p className={cn('text-lg', secondaryTextColor[type])}>{tier}</p>
                )}
              </div>
            )}

            {/* Encouragement message for losses with fade-in */}
            {type === 'loss' && (
              <p
                className={cn(
                  'text-lg mb-8',
                  secondaryTextColor[type],
                  'transition-all duration-500 ease-out delay-100',
                  showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                )}
              >
                {t('draw.keepTrying')}
              </p>
            )}

            {/* Action buttons with staggered entrance */}
            <div
              className={cn(
                'space-y-3 mt-8',
                'transition-all duration-500 ease-out',
                showButtons ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
            >
              {(type === 'win' || type === 'jackpot') && onShare && (
                <Button
                  onClick={onShare}
                  className={cn(
                    'w-full shadow-xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]',
                    type === 'jackpot'
                      ? 'bg-amber-900 text-white hover:bg-amber-800'
                      : 'bg-brand-gold text-white hover:bg-brand-gold/90'
                  )}
                  size="lg"
                >
                  <Share2 className="h-5 w-5 me-2" />
                  {t('draw.shareWin')}
                </Button>
              )}

              {type === 'loss' && onInviteFriends && (
                <Button
                  onClick={onInviteFriends}
                  className="w-full bg-white text-zinc-900 hover:bg-white/90 shadow-xl font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  <Users className="h-5 w-5 me-2" />
                  {t('draw.inviteFriends')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }

        @keyframes firework-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

export default DrawResultOverlay;
