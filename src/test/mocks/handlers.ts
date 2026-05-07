/**
 * MSW Request Handlers
 * Mock API endpoints for testing
 */

import { http, HttpResponse, delay } from 'msw';
import {
  mockUser,
  mockAuthTokens,
  mockDrawList,
  mockDraw,
  mockDrawWinnersList,
  mockDrawWinnerUserJackpot,
  mockEntryList,
  mockEntrySummary,
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
} from '../fixtures';

const API_BASE = 'https://dev.iqarx.com/api/v0';

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
// ===========================================

// Helper: compute next Thursday 9 PM (draw time)
function getNextThursdayDrawDate(): string {
  const now = new Date();
  const daysUntilThursday = (4 - now.getDay() + 7) % 7 || 7;
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  nextThursday.setHours(21, 0, 0, 0);
  return nextThursday.toISOString();
}

function getNextThursdayDrawDateShort(): string {
  const now = new Date();
  const daysUntilThursday = (4 - now.getDay() + 7) % 7 || 7;
  const nextThursday = new Date(now);
  nextThursday.setDate(now.getDate() + daysUntilThursday);
  return nextThursday.toISOString().split('T')[0];
}

const drawManagementHandlers = [
  // List draws (plural - matches draw.service.ts)
  http.get(`${API_BASE}/fawz_draw_management/draws`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Compute dynamic draw date for scheduled draws
    const nextDrawDate = getNextThursdayDrawDate();
    const nextDrawDateShort = getNextThursdayDrawDateShort();

    // Create dynamic scheduled draw
    const scheduledDraw = {
      ...mockDraw,
      draw_id: '660e8400-e29b-41d4-a716-446655440099',
      draw_number: 44,
      draw_date: nextDrawDateShort,
      status: 'scheduled',
      entry_cutoff_at: nextDrawDate,
      scheduled_broadcast_at: nextDrawDate,
      finalized_at: undefined,
      winning_numbers: undefined,
      winning_number_1: undefined,
      winning_number_2: undefined,
      winning_number_3: undefined,
    };

    // If querying for scheduled draws, return the dynamic scheduled draw
    if (status === 'scheduled') {
      return HttpResponse.json({
        draws_list: [scheduledDraw],
        total_draws: 1,
        page: 1,
        page_size: 20,
      });
    }

    // Get draw_type filter
    const drawType = url.searchParams.get('draw_type');

    // Build the full list with the scheduled draw
    let draws = [...mockDrawList.draws_list, scheduledDraw];

    // Filter by draw_type if specified
    if (drawType && drawType !== 'all') {
      draws = draws.filter((draw) => draw.draw_type === drawType);
    }

    return HttpResponse.json({
      ...mockDrawList,
      draws_list: draws,
      total_draws: draws.length,
    });
  }),

  // Get draw by ID (plural)
  http.get(`${API_BASE}/fawz_draw_management/draws/:draw_id`, async () => {
    await delay(100);
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
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries`, async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const source = url.searchParams.get('source');

    // Filter by source if specified
    let entries = [...mockEntryList.fawz_entries_list];
    if (source && source !== 'all') {
      entries = entries.filter((entry) => entry.source === source);
    }

    return HttpResponse.json({
      ...mockEntryList,
      fawz_entries_list: entries,
      total_fawz_entries: entries.length,
    });
  }),

  // Get entry summary
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries/summary`, async () => {
    await delay(100);
    return HttpResponse.json(mockEntrySummary);
  }),

  // Get entry by ID (plural)
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entries/:entry_id`, async () => {
    await delay(100);
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
