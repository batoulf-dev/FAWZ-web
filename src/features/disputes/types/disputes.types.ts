/**
 * Disputes Types
 * Types and Zod schemas for dispute feature
 */

import { z } from 'zod';

// Dispute type enum
export const DisputeTypeEnum = z.enum([
  'account_suspension_dispute',
  'draw_result_dispute',
  'incorrect_entry_count',
  'merchant_shared_entry_missing',
  'missing_prize',
  'prize_cap_hold_dispute',
  'referral_reward_not_received',
  'retroactive_seeding_error',
]);

export type DisputeType = z.infer<typeof DisputeTypeEnum>;

// Dispute status enum
export const DisputeStatusEnum = z.enum([
  'auto_checking',
  'auto_resolved',
  'closed',
  'escalated',
  'pending_review',
  'rejected',
  'resolved',
  'submitted',
  'under_review',
]);

export type DisputeStatus = z.infer<typeof DisputeStatusEnum>;

// Resolution type enum
export const ResolutionTypeEnum = z.enum([
  'account_reinstated',
  'cash_credited',
  'entries_credited',
  'no_action',
  'prize_released',
  'rejected',
]);

export type ResolutionType = z.infer<typeof ResolutionTypeEnum>;

// Submitter type enum
export const SubmitterTypeEnum = z.enum(['consumer', 'merchant']);
export type SubmitterType = z.infer<typeof SubmitterTypeEnum>;

// Dispute entity schema
export const DisputeSchema = z.object({
  dispute_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  dispute_number: z.string(),
  dispute_type: DisputeTypeEnum,
  status: DisputeStatusEnum.optional(),
  description: z.string(),
  claimed_fawz_number: z.string().optional().nullable(),
  claimed_amount_iqd: z.number().int().optional().nullable(),
  submitter_id: z.string().uuid().optional(),
  submitter_type: SubmitterTypeEnum,
  submitted_by_type: z.enum(['merchant', 'user']).optional().nullable(),
  submitted_at: z.string().datetime(),
  sla_deadline_at: z.string().datetime(),
  assigned_to: z.string().optional().nullable(),
  assigned_at: z.string().datetime().optional().nullable(),
  related_draw_id: z.string().uuid().optional().nullable(),
  related_entry_id: z.string().uuid().optional().nullable(),
  related_entry_number: z.number().int().optional().nullable(),
  related_transaction_id: z.string().uuid().optional().nullable(),
  related_referral_id: z.string().uuid().optional().nullable(),
  fraud_case_id: z.string().uuid().optional().nullable(),
  evidence_urls: z.string().optional().nullable(), // JSON array of URLs
  evidence_data: z.string().optional().nullable(), // JSON evidence data
  auto_check_result: z.string().optional().nullable(), // JSON auto-check results
  auto_resolved_at: z.string().datetime().optional().nullable(),
  resolution_type: ResolutionTypeEnum.optional().nullable(),
  resolution_notes: z.string().optional().nullable(),
  resolution_action: z.string().optional().nullable(),
  resolution_entries_credited: z.number().int().optional().nullable(),
  resolution_cash_credited_iqd: z.number().int().optional().nullable(),
  resolved_by: z.string().optional().nullable(),
  resolved_at: z.string().datetime().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
});

export type Dispute = z.infer<typeof DisputeSchema>;

// Dispute list response
export const DisputeListResponseSchema = z.object({
  disputes_list: z.array(DisputeSchema),
  total_disputes: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type DisputeListResponse = z.infer<typeof DisputeListResponseSchema>;

// Create dispute request
export const CreateDisputeRequestSchema = z.object({
  dispute_type: DisputeTypeEnum,
  description: z.string().min(10).max(500),
  claimed_fawz_number: z.string().regex(/^\d{10}$/).optional().nullable(),
  claimed_amount_iqd: z.number().int().min(0).optional().nullable(),
  related_draw_id: z.string().uuid().optional().nullable(),
  related_entry_id: z.string().uuid().optional().nullable(),
  related_transaction_id: z.string().uuid().optional().nullable(),
  related_referral_id: z.string().uuid().optional().nullable(),
  evidence_urls: z.string().optional().nullable(),
});

export type CreateDisputeRequest = z.infer<typeof CreateDisputeRequestSchema>;

// Submit dispute form values (for React Hook Form)
export const DisputeFormSchema = z.object({
  disputeType: DisputeTypeEnum,
  description: z
    .string()
    .min(10, 'يرجى كتابة وصف أطول (10 أحرف على الأقل)')
    .max(500, 'يرجى كتابة وصف (500 حرف كحد أقصى)'),
  claimedFawzNumber: z
    .string()
    .regex(/^\d{10}$/, 'يجب أن يكون الرقم 10 أرقام')
    .optional()
    .or(z.literal('')),
  claimedAmountIqd: z.number().int().min(0).optional().nullable(),
  relatedDrawId: z.string().uuid().optional().nullable(),
  evidenceUrls: z.array(z.string().url()).optional(),
});

export type DisputeFormValues = z.infer<typeof DisputeFormSchema>;

// List params for disputes
export interface DisputeListParams {
  page?: number;
  page_size?: number;
  dispute_type?: DisputeType;
  status?: DisputeStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Display labels for dispute types (Arabic)
export const DISPUTE_TYPE_LABELS_AR: Record<DisputeType, string> = {
  account_suspension_dispute: 'اعتراض على تعليق الحساب',
  draw_result_dispute: 'اعتراض على نتيجة السحب',
  incorrect_entry_count: 'خطأ في عدد الأرقام',
  merchant_shared_entry_missing: 'أرقام التاجر المشتركة مفقودة',
  missing_prize: 'جائزة مفقودة',
  prize_cap_hold_dispute: 'اعتراض على تعليق الجائزة',
  referral_reward_not_received: 'مكافأة الإحالة لم تصل',
  retroactive_seeding_error: 'خطأ في الأرقام السابقة',
};

// Display labels for dispute status (Arabic)
export const DISPUTE_STATUS_LABELS_AR: Record<DisputeStatus, string> = {
  auto_checking: 'قيد الفحص التلقائي',
  auto_resolved: 'محلولة تلقائياً',
  closed: 'مغلقة',
  escalated: 'تم تصعيدها',
  pending_review: 'بانتظار المراجعة',
  rejected: 'مرفوضة',
  resolved: 'محلولة',
  submitted: 'مقدمة',
  under_review: 'قيد المراجعة',
};

// Display labels for resolution types (Arabic)
export const RESOLUTION_TYPE_LABELS_AR: Record<ResolutionType, string> = {
  account_reinstated: 'تم إعادة تفعيل الحساب',
  cash_credited: 'تم إضافة المبلغ النقدي',
  entries_credited: 'تم إضافة الأرقام',
  no_action: 'لا إجراء مطلوب',
  prize_released: 'تم صرف الجائزة',
  rejected: 'مرفوضة',
};
