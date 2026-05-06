/**
 * Notification Types
 * Types and Zod schemas for notification feature
 */

import { z } from 'zod';

// Notification type enum
export const NotificationTypeEnum = z.enum([
  'account_reinstated',
  'account_suspended',
  'budget_alert',
  'challenge_checkpoint',
  'challenge_completed',
  'challenge_progress',
  'dispute_update',
  'draw_reminder',
  'draw_result_non_winner',
  'draw_result_winner',
  'entry_earned',
  'fraud_queue_alert',
  'prize_credited',
  'prize_held',
  'prize_held_for_review',
  'referral_reward',
  'referral_reward_received',
  'referral_rewarded',
  'referral_success',
  'retroactive_seeding_complete',
  'shared_merchant_entries',
  'sla_breach_alert',
  'system_announcement',
  'system_critical',
]);

export type NotificationType = z.infer<typeof NotificationTypeEnum>;

// Notification priority enum
export const NotificationPriorityEnum = z.enum(['critical', 'high', 'normal', 'low']);
export type NotificationPriority = z.infer<typeof NotificationPriorityEnum>;

// Notification status enum
export const NotificationStatusEnum = z.enum(['pending', 'sent', 'delivered', 'read', 'failed']);
export type NotificationStatus = z.infer<typeof NotificationStatusEnum>;

// Recipient type enum
export const RecipientTypeEnum = z.enum(['admin', 'consumer', 'merchant', 'user']);
export type RecipientType = z.infer<typeof RecipientTypeEnum>;

// Notification entity schema
export const NotificationSchema = z.object({
  notification_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  title: z.string(),
  title_ar: z.string(),
  title_en: z.string().optional(),
  body: z.string().optional(),
  body_ar: z.string(),
  body_en: z.string().optional(),
  notification_type: NotificationTypeEnum.optional(),
  priority: NotificationPriorityEnum.optional(),
  status: NotificationStatusEnum.optional(),
  recipient_type: RecipientTypeEnum,
  is_read: z.boolean().default(false),
  is_pushed: z.boolean().default(false),
  is_system_critical: z.boolean().default(false),
  read_at: z.string().datetime().optional().nullable(),
  sent_at: z.string().datetime().optional().nullable(),
  delivered_at: z.string().datetime().optional().nullable(),
  deep_link: z.string().optional().nullable(),
  data_payload: z.string().optional().nullable(),
  related_draw_id: z.string().uuid().optional().nullable(),
  related_entry_id: z.string().uuid().optional().nullable(),
  related_challenge_id: z.string().uuid().optional().nullable(),
  related_referral_id: z.string().uuid().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;

// List response
export const NotificationListResponseSchema = z.object({
  notifications_list: z.array(NotificationSchema),
  total_notifications: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;

// Mark as read request
export const MarkNotificationReadRequestSchema = z.object({
  is_read: z.literal(true),
  read_at: z.string().datetime().optional(),
});

export type MarkNotificationReadRequest = z.infer<typeof MarkNotificationReadRequestSchema>;

// Notification preference category enum
export const NotificationCategoryEnum = z.enum([
  'draw_reminders',
  'draw_results',
  'entry_earned',
  'challenge_updates',
  'referral_rewards',
  'system_critical',
]);

export type NotificationCategory = z.infer<typeof NotificationCategoryEnum>;

// Notification preference entity
export const NotificationPreferenceSchema = z.object({
  notification_preference_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  category: NotificationCategoryEnum,
  is_enabled: z.boolean(),
  push_enabled: z.boolean().default(true),
  in_app_enabled: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type NotificationPreference = z.infer<typeof NotificationPreferenceSchema>;

// Notification preferences list response
export const NotificationPreferencesListResponseSchema = z.object({
  notification_preferences_list: z.array(NotificationPreferenceSchema),
  total_notification_preferences: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type NotificationPreferencesListResponse = z.infer<typeof NotificationPreferencesListResponseSchema>;

// Update preference request
export const UpdateNotificationPreferenceRequestSchema = z.object({
  is_enabled: z.boolean().optional(),
  push_enabled: z.boolean().optional(),
  in_app_enabled: z.boolean().optional(),
});

export type UpdateNotificationPreferenceRequest = z.infer<typeof UpdateNotificationPreferenceRequestSchema>;

// List params for notifications
export interface NotificationListParams {
  page?: number;
  page_size?: number;
  is_read?: boolean;
  notification_type?: NotificationType;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Unread count response
export interface UnreadNotificationCount {
  count: number;
}
