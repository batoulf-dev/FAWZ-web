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
  mockDrawWinners,
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
} from '../fixtures';

const API_BASE = 'https://dev.iqarx.com/api/v0';

// ===========================================
// User Management Handlers
// ===========================================

const userManagementHandlers = [
  // Login
  http.patch(`${API_BASE}/fawz_user_management/user/login_user`, async () => {
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
];

// ===========================================
// Draw Management Handlers
// ===========================================

const drawManagementHandlers = [
  // List draws
  http.get(`${API_BASE}/fawz_draw_management/draw`, async () => {
    await delay(100);
    return HttpResponse.json(mockDrawList);
  }),

  // Get draw by ID
  http.get(`${API_BASE}/fawz_draw_management/draw/:draw_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockDraw);
  }),

  // Get draw winners
  http.get(`${API_BASE}/fawz_draw_management/draw_winner`, async () => {
    await delay(100);
    return HttpResponse.json(mockDrawWinners);
  }),

  // Get user's winning history
  http.get(`${API_BASE}/fawz_draw_management/draw_winner/user/:user_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockDrawWinners);
  }),
];

// ===========================================
// Entry Generation Handlers
// ===========================================

const entryGenerationHandlers = [
  // List entries
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entry`, async () => {
    await delay(100);
    return HttpResponse.json(mockEntryList);
  }),

  // Get entry summary
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entry/summary`, async () => {
    await delay(100);
    return HttpResponse.json(mockEntrySummary);
  }),

  // Get entry by ID
  http.get(`${API_BASE}/fawz_entry_generation/fawz_entry/:entry_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockEntryList.fawz_entries_list[0]);
  }),
];

// ===========================================
// Consumer Engagement Handlers (Notifications)
// ===========================================

const consumerEngagementHandlers = [
  // List notifications
  http.get(`${API_BASE}/fawz_consumer_engagement/notification`, async () => {
    await delay(100);
    return HttpResponse.json(mockNotificationList);
  }),

  // Get unread count
  http.get(`${API_BASE}/fawz_consumer_engagement/notification/unread_count`, async () => {
    await delay(100);
    return HttpResponse.json(mockUnreadCount);
  }),

  // Mark notification as read
  http.patch(`${API_BASE}/fawz_consumer_engagement/notification/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Notification Updated Successfully' });
  }),

  // Mark all as read
  http.patch(`${API_BASE}/fawz_consumer_engagement/notification/mark_all_read`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'All Notifications Marked as Read' });
  }),

  // Get notification preferences
  http.get(`${API_BASE}/fawz_consumer_engagement/notification_preference`, async () => {
    await delay(100);
    return HttpResponse.json(mockNotificationPreferences);
  }),

  // Update notification preference
  http.patch(`${API_BASE}/fawz_consumer_engagement/notification_preference/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Preference Updated Successfully' });
  }),

  // Get user consents
  http.get(`${API_BASE}/fawz_consumer_engagement/consent`, async () => {
    await delay(100);
    return HttpResponse.json(mockConsentList);
  }),

  // Update consent
  http.patch(`${API_BASE}/fawz_consumer_engagement/consent/:id`, async () => {
    await delay(100);
    return HttpResponse.json({ message: 'Consent Updated Successfully' });
  }),
];

// ===========================================
// Challenge System Handlers
// ===========================================

const challengeSystemHandlers = [
  // List challenges
  http.get(`${API_BASE}/fawz_challenge_system/challenge`, async () => {
    await delay(100);
    return HttpResponse.json(mockChallengeList);
  }),

  // Get challenge by ID
  http.get(`${API_BASE}/fawz_challenge_system/challenge/:challenge_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockChallengeList.challenges_list[0]);
  }),

  // Get user progress
  http.get(`${API_BASE}/fawz_challenge_system/user_challenge_progress`, async () => {
    await delay(100);
    return HttpResponse.json(mockUserProgressList);
  }),

  // List badges
  http.get(`${API_BASE}/fawz_challenge_system/badge`, async () => {
    await delay(100);
    return HttpResponse.json(mockBadgeList);
  }),

  // Get user badges
  http.get(`${API_BASE}/fawz_challenge_system/user_badge`, async () => {
    await delay(100);
    return HttpResponse.json({ user_badges_list: [], total_user_badges: 0, page: 1, page_size: 20 });
  }),
];

// ===========================================
// Referral System Handlers
// ===========================================

const referralSystemHandlers = [
  // List referrals
  http.get(`${API_BASE}/fawz_referral_system/referral`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralList);
  }),

  // Get referral stats
  http.get(`${API_BASE}/fawz_referral_system/referral/stats`, async () => {
    await delay(100);
    return HttpResponse.json(mockReferralStats);
  }),

  // Get referral link
  http.get(`${API_BASE}/fawz_referral_system/referral_link`, async () => {
    await delay(100);
    return HttpResponse.json({ referral_links_list: [mockReferralLink], total_referral_links: 1, page: 1, page_size: 20 });
  }),

  // Create referral link
  http.post(`${API_BASE}/fawz_referral_system/referral_link`, async () => {
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
  // List disputes
  http.get(`${API_BASE}/fawz_fraud_compliance/dispute`, async () => {
    await delay(100);
    return HttpResponse.json(mockDisputeList);
  }),

  // Get dispute by ID
  http.get(`${API_BASE}/fawz_fraud_compliance/dispute/:dispute_id`, async () => {
    await delay(100);
    return HttpResponse.json(mockDisputeList.disputes_list[0]);
  }),

  // Create dispute
  http.post(`${API_BASE}/fawz_fraud_compliance/dispute`, async () => {
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
  // List prize payouts
  http.get(`${API_BASE}/fawz_prize_payout_management/prize_payout`, async () => {
    await delay(100);
    return HttpResponse.json(mockPrizePayoutList);
  }),

  // Get prize summary
  http.get(`${API_BASE}/fawz_prize_payout_management/prize_payout/summary`, async () => {
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
