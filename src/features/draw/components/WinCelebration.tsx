/**
 * Win Celebration Component
 * Confetti and particle effects for win states
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/core/utils/cn';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
  type: 'confetti' | 'sparkle' | 'star';
}

interface WinCelebrationProps {
  /** Type of celebration animation */
  type: 'win' | 'jackpot' | 'loss';
  /** Whether animation is active */
  isActive: boolean;
  /** Number of particles (default varies by type) */
  particleCount?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
}

const COLORS = {
  win: ['#FFD700', '#FFA500', '#FF6B35', '#4CAF50', '#2196F3'],
  jackpot: ['#FFD700', '#FFC107', '#FF9800', '#FF5722', '#E91E63', '#9C27B0', '#673AB7'],
  loss: ['#64748B', '#94A3B8', '#CBD5E1'],
};

function ConfettiPiece({ particle }: { particle: Particle }) {
  const style = useMemo(() => ({
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: `${particle.size}px`,
    height: `${particle.size * (particle.type === 'confetti' ? 2.5 : 1)}px`,
    backgroundColor: particle.color,
    transform: `rotate(${particle.rotation}deg)`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${particle.duration}s`,
  }), [particle]);

  return (
    <div
      className={cn(
        'absolute rounded-sm animate-confetti-fall',
        particle.type === 'sparkle' && 'rounded-full animate-sparkle',
        particle.type === 'star' && 'animate-star-burst'
      )}
      style={style}
    />
  );
}

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      className="absolute w-2 h-2 bg-brand-gold rounded-full animate-ping"
      style={{ // dynamic — cannot use Tailwind for computed positions and delays
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: '1s',
      }}
    />
  );
}

function GlowRing({ delay, size }: { delay: number; size: number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ animationDelay: `${delay}s` }} // dynamic — cannot use Tailwind
    >
      <div
        className="rounded-full border-4 border-brand-gold/30 animate-ping"
        style={{ // dynamic — cannot use Tailwind for computed sizes and delays
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: '1.5s',
        }}
      />
    </div>
  );
}

export function WinCelebration({
  type,
  isActive,
  particleCount,
  onComplete,
}: WinCelebrationProps): JSX.Element | null {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showGlow, setShowGlow] = useState(false);

  const defaultParticleCount = type === 'jackpot' ? 100 : type === 'win' ? 50 : 10;
  const count = particleCount ?? defaultParticleCount;

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      setShowGlow(false);
      return;
    }

    const colors = COLORS[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const types: Array<'confetti' | 'sparkle' | 'star'> =
        type === 'jackpot' ? ['confetti', 'sparkle', 'star'] : ['confetti', 'sparkle'];

      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: type === 'loss' ? 4 + Math.random() * 4 : 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * (type === 'jackpot' ? 1 : 0.5),
        duration: 2 + Math.random() * 2,
        type: types[Math.floor(Math.random() * types.length)],
      });
    }

    setParticles(newParticles);

    if (type !== 'loss') {
      setShowGlow(true);
    }

    // Animation complete callback
    const timeout = setTimeout(() => {
      onComplete?.();
    }, type === 'jackpot' ? 4000 : 3000);

    return () => clearTimeout(timeout);
  }, [isActive, type, count, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Glow rings for wins */}
      {showGlow && type === 'jackpot' && (
        <>
          <GlowRing delay={0} size={200} />
          <GlowRing delay={0.3} size={300} />
          <GlowRing delay={0.6} size={400} />
        </>
      )}

      {showGlow && type === 'win' && (
        <>
          <GlowRing delay={0} size={150} />
          <GlowRing delay={0.4} size={250} />
        </>
      )}

      {/* Confetti particles */}
      {particles.map((particle) => (
        <ConfettiPiece key={particle.id} particle={particle} />
      ))}

      {/* Extra sparkles for jackpot */}
      {type === 'jackpot' && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <Sparkle
              key={`sparkle-${i}`}
              x={10 + Math.random() * 80}
              y={20 + Math.random() * 60}
              delay={Math.random() * 2}
            />
          ))}
        </>
      )}

      {/* Radial gradient overlay for jackpot */}
      {type === 'jackpot' && (
        <div className="absolute inset-0 bg-gradient-radial from-brand-gold/20 via-transparent to-transparent animate-pulse" />
      )}
    </div>
  );
}

export default WinCelebration;
