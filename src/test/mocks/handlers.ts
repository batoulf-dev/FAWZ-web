/**
 * MSW Request Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse, delay } from 'msw';
import {
  mockUser,
  mockAuthTokens,
  mockDraw,
  mockDrawWinnersList,
  mockDrawWinnerUserJackpot,
  mockEntryList,
  mockNotificationList,
  mockUnreadCount,
  mockNotificationPreferences,
  mockChallengeList,
  mockUserProgressList,
  mockBadgeList,
  mockReferralList,
  mockReferralStats,
  mockReferralLink,
  mockDisputeList,
  mockPrizePayoutList,
  mockPrizeSummary,
  mockConsentList,
  mockConsumerUser,
  mockConsumerUserList,
  // DEV ONLY: Session-based dynamic fixtures
  SESSION,
  sessionActiveEntries,
  sessionNextDraw,
  sessionPastDraws,
  sessionWonEntries,
  isDrawFinalized,
  getNextDrawTime,
  randomInt,
} from '../fixtures';

const API_BASE = 'https://dev.iqarx.com/api/v0';

// ===========================================
// DEV ONLY: 10-Second Finalization Timer
// Uses MODULE_LOAD_TIME from fixtures for consistent timing
// ===========================================

/** DEV ONLY: Check if draw is finalized (10 seconds after module load) */
function isFinalized(): boolean {
  return isDrawFinalized();
}

/** DEV ONLY: Get the draw time ISO string */
function getDrawTimeISO(): string {
  return new Date(getNextDrawTime()).toISOString();
}

// ===========================================
// User Management Handlers
// ===========================================

const userManagementHandlers = [
  // Login - POST method (matches auth.service.ts)
  http.post(`${API_BASE}/fawz_user_management/user/login_user`, async () => {
    await delay(100);
    return HttpResponse.json({
      message: 'User Logged In Successfully',
      encrypted_token: mockAuthTokens.access_token,
      access_token: mockAuthTokens.access_token,
      user: mockUser,
    });
  }),

  // Sign up
  http.post(`${API_BASE}/fawz_user_management/user/sign_up`, async () => {
    await delay(100);
    return HttpResponse.json(
      { user_id: mockUser.id, message: 'User Created Successfully' },
      { status: 201 },
    );
  }),

  // Verify email
  http.patch(`${API_BASE}/fawz_user_management/user/verify_user_email`, async () => {
    await delay(100);
    return HttpResponse.json({
      message: 'User Verified Successfully',
      encrypted_token: mockAuthTokens.access_token,
      access_token: mockAuthTokens.access_token,
    });
  }),

  // Request code
  http.post(`${API_BASE}/fawz_user_management/user/request_code`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Code Sent Successfully' });
  }),

  // Forgot password
  http.post(`${API_BASE}/fawz_user_management/user/forgot_password`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Code Sent Successfully' });
  }),

  // Reset password
  http.patch(`${API_BASE}/fawz_user_management/user/reset_password_by_user`, async () => {
    await delay(100);
    return HttpResponse.json({
      message: 'Password Reset Successfully',
      encrypted_token: mockAuthTokens.access_token,
      access_token: mockAuthTokens.access_token,
    });
  }),

  // Change password by user
  http.patch(`${API_BASE}/fawz_user_management/user/change_password_by_user`, async () => {
    await delay(100);
    return HttpResponse.json({
      message: 'Password Changed Successfully',
      encrypted_token: mockAuthTokens.access_token,
      access_token: mockAuthTokens.access_token,
    });
  }),

  // Change password via JWT
  http.patch(`${API_BASE}/fawz_user_management/user/change_password`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Password Changed Successfully' });
  }),

  // Get current user
  http.get(`${API_BASE}/fawz_user_management/user/me`, async () => {
    await delay(100);
    return HttpResponse.json(mockUser);
  }),

  // Update profile
  http.patch(`${API_BASE}/fawz_user_management/user/update_profile`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Profile Updated Successfully' });
  }),

  // Upload profile image
  http.post(`${API_BASE}/fawz_user_management/user/upload_profile_image`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Profile Image Uploaded Successfully' });
  }),
];

// ===========================================
// Draw Management Handlers
// DEV ONLY: Uses SESSION-based mock data with 10s finalization timer
// ===========================================

const drawManagementHandlers = [
  // DEV ONLY: Get next draw (special endpoint)
  // Always returns the scheduled draw with draw_date = MODULE_LOAD_TIME + 10s
  http.get(`${API_BASE}/fawz_draw_management/draws/next`, async () => {
    await delay(100);
    const drawTimeISO = getDrawTimeISO();
    // DEV ONLY: Return draw_date as full ISO timestamp for countdown to work
    // (home.service.ts uses draw_date for nextDrawDate which feeds the countdown)
    const nextDrawCopy = {
      ...sessionNextDraw,
      draw_date: drawTimeISO, // DEV ONLY: Full ISO for countdown
      entry_cutoff_at: drawTimeISO,
      scheduled_broadcast_at: drawTimeISO,
    };
    return HttpResponse.json(nextDrawCopy);
  }),

  // List draws (plural - matches draw.service.ts)
  // DEV ONLY: Returns only PAST finalized draws, NOT the next draw
  http.get(`${API_BASE}/fawz_draw_management/draws`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const drawType = url.searchParams.get('draw_type');
    const drawTimeISO = getDrawTimeISO();

    // DEV ONLY: If querying for scheduled draws, return session next draw
    if (status === 'scheduled') {
      if (isFinalized()) {
        // After 10s, no scheduled draws - return empty
        return HttpResponse.json({
          draws_list: [],
          total_draws: 0,
          page: 1,
          page_size: 20,
        });
      }

      return HttpResponse.json({
        draws_list: [{
          ...sessionNextDraw,
          draw_date: drawTimeISO, // DEV ONLY: Full ISO for countdown
          entry_cutoff_at: drawTimeISO,
          scheduled_broadcast_at: drawTimeISO,
        }],
        total_draws: 1,
        page: 1,
        page_size: 20,
      });
    }

    // DEV ONLY: If querying for live draws, return the finalized draw as "live" if it's within the display window
    if (status === 'live') {
      if (isFinalized()) {
        // Return the just-finalized draw as if it's currently live
        const totalWinners = randomInt(400000, 900000);
        const totalPayoutIqd = randomInt(50000000, 150000000);
        return HttpResponse.json({
          draws_list: [{
            ...sessionNextDraw,
            status: 'finalized', // DEV ONLY: Actually finalized but shown on live page
            draw_date: drawTimeISO,
            winning_numbers: SESSION.winningNumbers[0],
            winning_number_1: parseInt(SESSION.winningNumbers[0], 10),
            winning_number_2: parseInt(SESSION.winningNumbers[1], 10),
            winning_number_3: parseInt(SESSION.winningNumbers[2], 10),
            finalized_at: drawTimeISO,
            total_winners: totalWinners,
            total_payout_iqd: totalPayoutIqd,
          }],
          total_draws: 1,
          page: 1,
          page_size: 20,
        });
      }
      // Before finalization, no live draw yet
      return HttpResponse.json({
        draws_list: [],
        total_draws: 0,
        page: 1,
        page_size: 20,
      });
    }

    // DEV ONLY: Return only past finalized draws (never next-draw)
    let draws = [...sessionPastDraws];

    // Filter by draw_type if specified
    if (drawType && drawType !== 'all') {
      draws = draws.filter((draw) => draw.draw_type === drawType);
    }

    // Filter by status if specified (other than scheduled)
    if (status && status !== 'scheduled') {
      draws = draws.filter((draw) => draw.status === status);
    }

    return HttpResponse.json({
      draws_list: draws,
      total_draws: draws.length,
      page: 1,
      page_size: 20,
    });
  }),

  // Get draw by ID (plural)
  // DEV ONLY: Handles 'next-draw' specially with 10s timer
  http.get(`${API_BASE}/fawz_draw_management/draws/:draw_id`, async ({ params }) => {
    await delay(100);
    const { draw_id } = params;
    const drawTimeISO = getDrawTimeISO();

    // DEV ONLY: Handle 'next-draw' with 10-second finalization simulation
    if (draw_id === 'next-draw') {
      if (isFinalized()) {
        // DEV ONLY: Return finalized draw with winning numbers and payouts
        const totalWinners = randomInt(400000, 900000); // 400K-900K winners per spec
        const totalPayoutIqd = randomInt(50000000, 150000000); // 50M-150M IQD
        return HttpResponse.json({
          ...sessionNextDraw,
          status: 'finalized',
          draw_date: drawTimeISO, // DEV ONLY: Full ISO
          winning_numbers: SESSION.winningNumbers[0],
          winning_number_1: parseInt(SESSION.winningNumbers[0], 10),
          winning_number_2: parseInt(SESSION.winningNumbers[1], 10),
          winning_number_3: parseInt(SESSION.winningNumbers[2], 10),
          finalized_at: drawTimeISO,
          total_winners: totalWinners,
          total_payout_iqd: totalPayoutIqd,
          consumer_winners: Math.floor(totalWinners * 0.8),
          consumer_payout_iqd: Math.floor(totalPayoutIqd * 0.8),
          merchant_winners: Math.floor(totalWinners * 0.2),
          merchant_payout_iqd: Math.floor(totalPayoutIqd * 0.2),
          jackpot_claimed: Math.random() > 0.8,
        });
      } else {
        // DEV ONLY: Return scheduled draw (not yet finalized)
        return HttpResponse.json({
          ...sessionNextDraw,
          draw_date: drawTimeISO, // DEV ONLY: Full ISO for countdown
          entry_cutoff_at: drawTimeISO,
          scheduled_broadcast_at: drawTimeISO,
        });
      }
    }

    // DEV ONLY: Check if it's a past draw ID
    const pastDraw = sessionPastDraws.find((d) => d.draw_id === draw_id);
    if (pastDraw) {
      return HttpResponse.json(pastDraw);
    }

    // Fallback to legacy mock draw for backwards compatibility
    return HttpResponse.json(mockDraw);
  }),

  // Get draw winners (plural - matches draw.service.ts)
  // Supports filtering by draw_id, consumer_user_id, payout_status, winning_number_index
  http.get(`${API_BASE}/fawz_draw_management/draw_winners`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const drawId = url.searchParams.get('draw_id');
    const consumerId = url.searchParams.get('consumer_user_id');
    const payoutStatus = url.searchParams.get('payout_status');
    const winningNumberIndex = url.searchParams.get('winning_number_index');

    let winners = [...mockDrawWinnersList];

    // Filter by draw_id if specified
    if (drawId) {
      winners = winners.filter((w) => w.draw_id === drawId);
    }

    // Filter by consumer_user_id if specified
    if (consumerId) {
      winners = winners.filter((w) => w.consumer_user_id === consumerId);
    }

    // Filter by payout_status if specified
    if (payoutStatus) {
      winners = winners.filter((w) => w.payout_status === payoutStatus);
    }

    // Filter by winning_number_index if specified
    if (winningNumberIndex) {
      winners = winners.filter(
        (w) => w.winning_number_index === parseInt(winningNumberIndex, 10),
      );
    }

    return HttpResponse.json({
      draw_winners_list: winners,
      total_draw_winners: winners.length,
      page: 1,
      page_size: 20,
    });
  }),

  // Get draw winner by ID
  http.get(`${API_BASE}/fawz_draw_management/draw_winners/:winner_id`, async ({ params }) => {
    await delay(100);
    const { winner_id } = params;
    const winner = mockDrawWinnersList.find((w) => w.draw_winner_id === winner_id);
    if (winner) {
      return HttpResponse.json(winner);
    }
    // Default to user's jackpot winner if not found
    return HttpResponse.json(mockDrawWinnerUserJackpot);
  }),

  // Get draw digit events
  http.get(`${API_BASE}/fawz_draw_management/draw_digit_events`, async () => {
    await delay(100);
    return HttpResponse.json({
      draw_digit_events_list: [
        {
          draw_digit_event_id: '1',
          draw_id: mockDraw.draw_id,
          digit_position: 1,
          digit_value: 1,
          revealed_at: '2024-03-21T20:05:00Z',
        },
        {
          draw_digit_event_id: '2',
          draw_id: mockDraw.draw_id,
          digit_position: 2,
          digit_value: 2,
          revealed_at: '2024-03-21T20:06:00Z',
        },
        {
          draw_digit_event_id: '3',
          draw_id: mockDraw.draw_id,
          digit_position: 3,
          digit_value: 3,
          revealed_at: '2024-03-21T20:07:00Z',
        },
      ],
      total_draw_digit_events: 3,
      page: 1,
      page_size: 20,
    });
  }),
];

// ===========================================
// Entry Generation Handlers
// ===========================================

const entryGenerationHandlers = [
  // List entries (plural - matches entries.service.ts)
  // DEV ONLY: Returns SESSION active entries + won entries
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const source = url.searchParams.get('source');
    const outcome = url.searchParams.get('outcome');
    const consumerId = url.searchParams.get('consumer_user_id');

    // DEV ONLY: Combine session active entries + won entries
    const allSessionEntries = [...sessionActiveEntries, ...sessionWonEntries];

    // Filter by consumer_user_id - default to authenticated user (mockUser.id)
    const userId = consumerId || mockUser.id;
    let entries = allSessionEntries.filter(
      (entry) => entry.consumer_user_id === userId,
    );

    // Filter by outcome if specified (ignore 'all', 'undefined', or empty string)
    if (outcome && outcome !== 'all' && outcome !== 'undefined' && outcome !== '') {
      entries = entries.filter((entry) => entry.outcome === outcome);
    }

    // Filter by source if specified (ignore 'all', 'undefined', or empty string)
    if (source && source !== 'all' && source !== 'undefined' && source !== '') {
      entries = entries.filter((entry) => entry.source === source);
    }

    return HttpResponse.json({
      fawz_entries_list: entries,
      total_fawz_entries: entries.length,
      page: 1,
      page_size: 20,
    });
  }),

  // Get entry summary
  // DEV ONLY: Returns SESSION-based summary
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries/summary`, async () => {
    await delay(100);
    // DEV ONLY: Calculate summary from SESSION data
    const activeCount = sessionActiveEntries.length;
    const wonCount = sessionWonEntries.length;
    const totalPrizes = sessionWonEntries.reduce((sum, e) => sum + (e.prize_iqd ?? 0), 0);

    // Count entries by source
    const allEntries = [...sessionActiveEntries, ...sessionWonEntries];
    const entriesBySource = {
      transaction: allEntries.filter((e) => e.source === 'transaction').length,
      challenge: allEntries.filter((e) => e.source === 'challenge').length,
      referral: allEntries.filter((e) => e.source === 'referral').length,
      retroactive: 0,
      bonus: 0,
      onboarding: 0,
    };

    return HttpResponse.json({
      total_entries: allEntries.length,
      entries_this_week: activeCount,
      entries_this_month: allEntries.length,
      entries_by_source: entriesBySource,
      active_entries: activeCount,
      won_entries: wonCount,
      total_prizes_iqd: totalPrizes,
      current_draw_count: activeCount, // DEV ONLY: SESSION.ticketCount
      lifetime_count: allEntries.length + 30, // Add some history
      weekly_unique_days: SESSION.weeklySpark.current,
    });
  }),

  // Get entry by ID (plural)
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries/:entry_id`, async ({ params }) => {
    await delay(100);
    const { entry_id } = params;

    // DEV ONLY: Search in session entries first
    const allSessionEntries = [...sessionActiveEntries, ...sessionWonEntries];
    const sessionEntry = allSessionEntries.find((e) => e.fawz_entry_id === entry_id);
    if (sessionEntry) {
      return HttpResponse.json(sessionEntry);
    }

    // Fallback to legacy mock entry
    return HttpResponse.json(mockEntryList.fawz_entries_list[0]);
  }),
];

// ===========================================
// Consumer Engagement Handlers (Notifications)
// ===========================================

const consumerEngagementHandlers = [
  // List notifications (plural - matches notifications.service.ts)
  http.get(`${API_BASE}/fawz_consumer_engagement/notifications`, async () => {
    await delay(100);
    return HttpResponse.json(mockNotificationList);
  }),

  // Get notification by ID
  http.get(`${API_BASE}/fawz_consumer_engagement/notifications/:id`, async () => {
    await delay(100);
    return HttpResponse.json(mockNotificationList.notifications_list[0]);
  }),

  // Get unread count
  http.get(`${API_BASE}/fawz_consumer_engagement/notifications/unread_count`, async () => {
    await delay(100);
    return HttpResponse.json(mockUnreadCount);
  }),

  // Mark notification as read
  http.patch(`${API_BASE}/fawz_consumer_engagement/notifications/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Notification Updated Successfully' });
  }),

  // Mark all as read
  http.patch(`${API_BASE}/fawz_consumer_engagement/notifications/mark_all_read`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'All Notifications Marked as Read' });
  }),

  // Get notification preferences (plural - matches notifications.service.ts)
  http.get(`${API_BASE}/fawz_consumer_engagement/notification_preferences`, async () => {
    await delay(100);
    return HttpResponse.json(mockNotificationPreferences);
  }),

  // Update notification preference
  http.patch(`${API_BASE}/fawz_consumer_engagement/notification_preferences/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Preference Updated Successfully' });
  }),

  // Get user consents (matches consent.service.ts)
  http.get(`${API_BASE}/fawz_consumer_engagement/user_consents`, async () => {
    await delay(100);
    return HttpResponse.json(mockConsentList);
  }),

  // Get user consent by ID
  http.get(`${API_BASE}/fawz_consumer_engagement/user_consents/:id`, async () => {
    await delay(100);
    return HttpResponse.json(mockConsentList.user_consents_list?.[0] ?? {});
  }),

  // Create user consent
  http.post(`${API_BASE}/fawz_consumer_engagement/user_consents`, async () => {
    await delay(100);
    return HttpResponse.json(
      { user_consent_id: 'consent-mock-id', message: 'Consent Created Successfully' },
      { status: 201 },
    );
  }),

  // Update user consent
  http.patch(`${API_BASE}/fawz_consumer_engagement/user_consents/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Consent Updated Successfully' });
  }),

  // Consumer Users (Profile)
  // List consumer users (current user's profile)
  http.get(`${API_BASE}/fawz_consumer_engagement/consumer_users`, async () => {
    await delay(100);
    return HttpResponse.json(mockConsumerUserList);
  }),

  // Get consumer user by ID
  http.get(`${API_BASE}/fawz_consumer_engagement/consumer_users/:id`, async () => {
    await delay(100);
    return HttpResponse.json(mockConsumerUser);
  }),

  // Update consumer user
  http.patch(`${API_BASE}/fawz_consumer_engagement/consumer_users/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Profile Updated Successfully' });
  }),
];

// ===========================================
// Challenge System Handlers
// ===========================================

const challengeSystemHandlers = [
  // List challenges (plural - matches challenges.service.ts)
  http.get(`${API_BASE}/fawz_challenge_system/challenges`, async () => {
    await delay(100);
    return HttpResponse.json(mockChallengeList);
  }),

  // Get challenge by ID (plural)
  http.get(`${API_BASE}/fawz_challenge_system/challenges/:challenge_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockChallengeList.challenges_list[0]);
  }),

  // Get user progress (plural - matches challenges.service.ts)
  http.get(`${API_BASE}/fawz_challenge_system/user_challenge_progresses`, async () => {
    await delay(100);
    return HttpResponse.json(mockUserProgressList);
  }),

  // Update user challenge progress (for claim checkpoint)
  http.patch(`${API_BASE}/fawz_challenge_system/user_challenge_progresses/:progress_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockUserProgressList.user_challenge_progresses_list[0]);
  }),

  // List badges (plural - matches challenges.service.ts)
  http.get(`${API_BASE}/fawz_challenge_system/badges`, async () => {
    await delay(100);
    return HttpResponse.json(mockBadgeList);
  }),

  // Get user badges (plural - matches challenges.service.ts)
  http.get(`${API_BASE}/fawz_challenge_system/user_badges`, async () => {
    await delay(100);
    return HttpResponse.json({ user_badges_list: [], total_user_badges: 0, page: 1, page_size: 20 });
  }),
];

// ===========================================
// Referral System Handlers
// ===========================================

const referralSystemHandlers = [
  // List referrals (plural - matches referrals.service.ts)
  http.get(`${API_BASE}/fawz_referral_system/referrals`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralList);
  }),

  // Get referral by ID
  http.get(`${API_BASE}/fawz_referral_system/referrals/:referral_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralList.referrals_list[0]);
  }),

  // Get referral stats
  http.get(`${API_BASE}/fawz_referral_system/referrals/stats`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralStats);
  }),

  // Get referral links (plural - matches referrals.service.ts)
  http.get(`${API_BASE}/fawz_referral_system/referral_links`, async () => {
    await delay(100);
    return HttpResponse.json({
      referral_links_list: [mockReferralLink],
      total_referral_links: 1,
      page: 1,
      page_size: 20,
    });
  }),

  // Get referral link by ID
  http.get(`${API_BASE}/fawz_referral_system/referral_links/:link_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralLink);
  }),

  // Create referral link
  http.post(`${API_BASE}/fawz_referral_system/referral_links`, async () => {
    await delay(100);
    return HttpResponse.json(
      { referral_link_id: mockReferralLink.referral_link_id, message: 'Referral Link Created Successfully' },
      { status: 201 },
    );
  }),
];

// ===========================================
// Fraud & Compliance Handlers (Disputes)
// ===========================================

const fraudComplianceHandlers = [
  // List disputes (plural - for disputes.service.ts)
  http.get(`${API_BASE}/fawz_fraud_compliance/disputes`, async () => {
    await delay(100);
    return HttpResponse.json(mockDisputeList);
  }),

  // Get dispute by ID
  http.get(`${API_BASE}/fawz_fraud_compliance/disputes/:dispute_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockDisputeList.disputes_list[0]);
  }),

  // Create dispute
  http.post(`${API_BASE}/fawz_fraud_compliance/disputes`, async () => {
    await delay(100);
    return HttpResponse.json(
      { dispute_id: mockDisputeList.disputes_list[0].dispute_id, message: 'Dispute Created Successfully' },
      { status: 201 },
    );
  }),
];

// ===========================================
// Prize Payout Management Handlers
// ===========================================

const prizePayoutHandlers = [
  // List prize payouts (plural - for prizes.service.ts)
  http.get(`${API_BASE}/fawz_prize_payout_management/prize_payouts`, async () => {
    await delay(100);
    return HttpResponse.json(mockPrizePayoutList);
  }),

  // Get prize payout by ID
  http.get(`${API_BASE}/fawz_prize_payout_management/prize_payouts/:payout_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockPrizePayoutList.prize_payouts_list[0]);
  }),

  // Get prize summary
  http.get(`${API_BASE}/fawz_prize_payout_management/prize_payouts/summary`, async () => {
    await delay(100);
    return HttpResponse.json(mockPrizeSummary);
  }),
];

// ===========================================
// Error Handlers (for testing error scenarios)
// ===========================================

export const errorHandlers = {
  // 401 Unauthorized
  unauthorized: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.json({ detail: 'Invalid or expired token' }, { status: 401 });
  }),

  // 422 Validation Error
  validationError: http.post(`${API_BASE}/*`, () => {
    return HttpResponse.json(
      { detail: 'Validation Error', errors: { email: ['Invalid email format'] } },
      { status: 422 },
    );
  }),

  // 429 Rate Limit
  rateLimited: http.all(`${API_BASE}/*`, () => {
    return HttpResponse.json({ detail: 'Too many requests. Please try again later.' }, { status: 429 });
  }),

  // 500 Server Error
  serverError: http.all(`${API_BASE}/*`, () => {
    return HttpResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }),

  // Network Error
  networkError: http.all(`${API_BASE}/*`, () => {
    return HttpResponse.error();
  }),
};

// ===========================================
// Combined Handlers Export
// ===========================================

export const handlers = [
  ...userManagementHandlers,
  ...drawManagementHandlers,
  ...entryGenerationHandlers,
  ...consumerEngagementHandlers,
  ...challengeSystemHandlers,
  ...referralSystemHandlers,
  ...fraudComplianceHandlers,
  ...prizePayoutHandlers,
];
