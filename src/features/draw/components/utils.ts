/**
 * Draw Utility Functions
 * Helper functions for comparing tickets and determining wins
 */

// Prize tiers and amounts
export const PRIZE_TIERS = {
  last_3: { digits: 3, prize: 10000 },      // 10,000 IQD
  last_5: { digits: 5, prize: 100000 },     // 100,000 IQD
  last_7: { digits: 7, prize: 1000000 },    // 1,000,000 IQD
  last_10: { digits: 10, prize: 10000000 }, // 10,000,000 IQD (Jackpot)
} as const;

export const JACKPOT_PRIZE = 10000000; // 10,000,000 IQD

/**
 * Count matching digits from the end of two numbers
 * @param winningNumber - The winning number to compare against
 * @param userNumber - The user's ticket number
 * @returns Number of matching digits from the end
 */
export function countMatchingDigits(winningNumber: string, userNumber: string): number {
  const win = winningNumber.padStart(10, '0');
  const user = userNumber.padStart(10, '0');

  let matches = 0;
  for (let i = win.length - 1; i >= 0; i--) {
    if (win[i] === user[i]) {
      matches++;
    } else {
      break;
    }
  }
  return matches;
}

/**
 * Determine the prize tier based on matching digits
 * @param matchingDigits - Number of matching digits
 * @returns Prize tier name or null if no win
 */
export function getPrizeTier(matchingDigits: number): keyof typeof PRIZE_TIERS | null {
  if (matchingDigits >= 10) return 'last_10';
  if (matchingDigits >= 7) return 'last_7';
  if (matchingDigits >= 5) return 'last_5';
  if (matchingDigits >= 3) return 'last_3';
  return null;
}

/**
 * Get the prize amount for a given tier
 * @param tier - Prize tier name
 * @returns Prize amount in IQD
 */
export function getPrizeAmount(tier: keyof typeof PRIZE_TIERS | null): number {
  if (!tier) return 0;
  return PRIZE_TIERS[tier].prize;
}

/**
 * Compare user's tickets against winning numbers and determine results
 * @param winningNumbers - Array of winning numbers
 * @param userTickets - Array of user's ticket numbers
 * @returns Object containing result type, matches, and total prize
 */
export function compareTickets(
  winningNumbers: string[],
  userTickets: string[]
): {
  resultType: 'jackpot' | 'win' | 'loss';
  matches: Array<{
    ticketNumber: string;
    winningNumber: string;
    digitsMatched: number;
    tier: keyof typeof PRIZE_TIERS | null;
    prizeIqd: number;
  }>;
  totalPrize: number;
  bestTier: keyof typeof PRIZE_TIERS | null;
} {
  const matches: Array<{
    ticketNumber: string;
    winningNumber: string;
    digitsMatched: number;
    tier: keyof typeof PRIZE_TIERS | null;
    prizeIqd: number;
  }> = [];

  let bestTier: keyof typeof PRIZE_TIERS | null = null;
  let totalPrize = 0;

  // Compare each user ticket against each winning number
  for (const userTicket of userTickets) {
    for (const winningNumber of winningNumbers) {
      const matchingDigits = countMatchingDigits(winningNumber, userTicket);
      const tier = getPrizeTier(matchingDigits);

      if (tier) {
        const prize = getPrizeAmount(tier);
        matches.push({
          ticketNumber: userTicket,
          winningNumber,
          digitsMatched: matchingDigits,
          tier,
          prizeIqd: prize,
        });
        totalPrize += prize;

        // Track best tier
        if (!bestTier || PRIZE_TIERS[tier].digits > PRIZE_TIERS[bestTier].digits) {
          bestTier = tier;
        }
      }
    }
  }

  // Determine result type
  let resultType: 'jackpot' | 'win' | 'loss' = 'loss';
  if (bestTier === 'last_10') {
    resultType = 'jackpot';
  } else if (bestTier) {
    resultType = 'win';
  }

  return {
    resultType,
    matches,
    totalPrize,
    bestTier,
  };
}
