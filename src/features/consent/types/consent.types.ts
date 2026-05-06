/**
 * Consent Types
 * Types and Zod schemas for user consent feature
 */

import { z } from 'zod';

// Consent type enum
export const ConsentTypeEnum = z.enum([
  'media_participation',
  'notification_challenge_updates',
  'notification_draw_reminders',
  'notification_draw_results',
  'notification_entry_earned',
  'notification_referral_rewards',
  'sharia_disclosure',
]);

export type ConsentType = z.infer<typeof ConsentTypeEnum>;

// User consent entity schema
export const UserConsentSchema = z.object({
  user_consent_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  consent_type: ConsentTypeEnum,
  consent_version: z.string(),
  consented: z.boolean(),
  consented_at: z.string().datetime().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
});

export type UserConsent = z.infer<typeof UserConsentSchema>;

// User consents list response
export const UserConsentsListResponseSchema = z.object({
  user_consents_list: z.array(UserConsentSchema),
  total_user_consents: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type UserConsentsListResponse = z.infer<typeof UserConsentsListResponseSchema>;

// Create consent request
export const CreateUserConsentRequestSchema = z.object({
  consent_type: ConsentTypeEnum,
  consent_version: z.string(),
  consented: z.boolean(),
  consented_at: z.string().datetime().optional(),
});

export type CreateUserConsentRequest = z.infer<typeof CreateUserConsentRequestSchema>;

// Update consent request
export const UpdateUserConsentRequestSchema = z.object({
  consent_type: ConsentTypeEnum.optional(),
  consent_version: z.string().optional(),
  consented: z.boolean().optional(),
  consented_at: z.string().datetime().optional(),
});

export type UpdateUserConsentRequest = z.infer<typeof UpdateUserConsentRequestSchema>;

// Sharia disclosure content (static)
export interface ShariaDisclosureContent {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  version: string;
}

// Media consent content
export interface MediaConsentContent {
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  version: string;
  drawId?: string;
  prizeTier?: string;
}

// Consent status for UI display
export interface ConsentStatus {
  shariaDisclosureAccepted: boolean;
  shariaDisclosureAcceptedAt?: string;
  mediaConsentDecision?: boolean;
  mediaConsentDecisionAt?: string;
}

// List params for consents
export interface ConsentListParams {
  page?: number;
  page_size?: number;
  consent_type?: ConsentType;
  consented?: boolean;
}
