# FEATURES DOCUMENT

## Document Control

| Field | Value |
| :---- | :---- |
| Product Name | Fawz (فوز) |
| Version | 1.0-DRAFT |
| Generated From | FAWZ — Digital Product Genome v1.0 |
| Project Specification | FAWZ\_Digital\_Product\_Genome\_v1.0\_EXTRACT.json (schema\_version 1.0) |
| Generation Method | Features Agent V2 — Single Pass (Mode A) |
| Confidence Level | HIGH — Business Document fully populated (92% completeness); 5 TBD items logged |
| Downstream Consumers | FDD Agent, Data Agent V2, Backend Software Factory, Frontend Agent, AI Service Pipeline, DevOps |

---

## 1\. SPEC METADATA

### 1.1 Product Reference

- **Product Name:** Fawz (فوز)  
- **Product Domain:** Transaction Engagement & Prize Draw Loyalty Platform  
- **Industry Vertical:** Fintech / Digital Payments / Consumer Rewards  
- **Target Platform:** React Native (iOS \+ Android) \+ FastAPI Backend  
- **Technology Stack:** Factory-locked — React Native, FastAPI, MySQL 8.0, SQLAlchemy 2.0, Alembic, Pydantic v2, Zod, Docker, AWS

### 1.2 Scope Declaration

Fawz is a transaction-driven prize-draw engagement layer built on top of the SuperQi digital wallet in Iraq: every qualifying SuperQi spending transaction (≥ 1,000 IQD) deterministically generates cryptographic 10-digit entry numbers (Fawz Numbers) for the paying consumer and the receiving POS/QR merchant, which are entered into weekly (Thursday 9:00 PM) and monthly prize draws broadcast live on Al Rabiaa TV. The platform reinforces habitual digital payment through layered challenges, a bilateral referral programme (Golden Ticket), and a retroactive seeding batch at launch that seeds entries from 90 days of historical SuperQi transactions — with all cash prizes credited to winners' SuperQi wallets within 60 seconds of draw completion.

### 1.3 Included Modules (MVP)

| Module | Description | Priority |
| :---- | :---- | :---- |
| MOD-001: Entry Generation Engine | Transaction eligibility evaluation, Fawz Number generation, retroactive seeding, channel multiplier application | MUST-HAVE |
| MOD-002: Draw Management | Draw scheduling, pool snapshot, sealed pre-generation, live digit broadcast, winner calculation, finalization | MUST-HAVE |
| MOD-003: Challenge System | Onboarding challenges, Weekly Spark streak, monthly rotating challenges, challenge progress tracking | MUST-HAVE |
| MOD-004: Referral System | Golden Ticket link generation, attribution tracking, fraud validation, reward crediting | MUST-HAVE |
| MOD-005: Merchant Management | Merchant eligibility nightly refresh, shared entry generation, merchant dashboard | MUST-HAVE |
| MOD-006: Prize & Payout Management | SuperQi wallet prize crediting, jackpot rollover, prize history, high-value winner hold | MUST-HAVE |
| MOD-007: Fraud & Compliance | Rules-based fraud flagging, review queue, case decisions, dispute resolution | MUST-HAVE |
| MOD-008: Admin Operations | Admin auth, budget dashboard, draw controls, winner export, system config management, audit log | MUST-HAVE |
| MOD-009: Notifications & Real-time | Push notification fan-out, WebSocket draw service, notification preferences, in-app notification center | MUST-HAVE |
| MOD-010: User Account & Onboarding | Fawz user profile extension of SuperQi account, Fawz tab home screen, social share for winners | MUST-HAVE |

### 1.4 Excluded Modules (MVP)

| Excluded Item | Reason | Future Phase |
| :---- | :---- | :---- |
| Fawz Certified Merchant Onboarding Program | Requires separate merchant onboarding flow & multiplier management; deferred per Genome v1.0 | Phase 1.5 (Month 2–3) |
| Community Challenges (City/National scope) | Batch reward distribution workflow deferred; requires scale validation | Phase 2 (Month 4–6) |
| Fawz Ambassador Program | Phase 2 role; requires post-draw winner management workflow | Phase 2 (Month 4–6) |
| Golden Receipts (merchant-side referrals) | Phase 1.5 feature; deferred | Phase 1.5 |
| Activity Bands | Phase 2 feature | Phase 2 |
| Champion Streak | Phase 2 feature | Phase 2 |
| Sponsor-funded Prize Tiers | Phase 2; TBD commercial agreements | Phase 2 |
| AI Fraud Detection (ML) | Phase 2; rules-based detection sufficient at launch | Phase 2 (Month 4–6) |
| GCC Market Expansion | Phase 3; requires market-specific regulatory approval | Phase 3 (Year 2+) |
| Public API / Partner API Exposure | Phase 3; platformization deferred | Phase 3 |
| Fawz map listing for merchants | Part of Fawz Certified program; Phase 1.5 | Phase 1.5 |

### 1.5 Explicit Non-Goals

- Fawz will **NOT** allow users to purchase Fawz Numbers — entries are exclusively earned through qualifying SuperQi spending transactions, challenges, or referrals.  
- Fawz will **NOT** operate an independent wallet or payment processor — all wallet credits execute via SuperQi Wallet API.  
- Fawz will **NOT** manage SuperQi user KYC — it inherits KYC from SuperQi; Fawz adds only supplementary identity verification for high-value prize claims.  
- Fawz will **NOT** permit user-to-user messaging, social feeds, or any user-generated content within the application in Phase 1\.  
- Fawz will **NOT** store raw transaction amounts from SuperQi in perpetuity — entry counts are derived and stored; raw amounts are used only transiently for entry calculation.  
- Fawz will **NOT** execute automated account suspensions — all account-level actions require human review and manual execution by a Finance/Compliance Reviewer.  
- Fawz will **NOT** broadcast winning numbers before the live Al Rabiaa TV draw — the sealed pre-generation commit is decrypted only after the physical draw is confirmed.

---

## 2\. DOMAIN GLOSSARY

| Term | Definition | Source |
| :---- | :---- | :---- |
| **Fawz Number** | A cryptographically-random 10-digit integer (0000000000–9999999999) generated as a prize-draw entry. Each Fawz Number is unique within a draw pool and is matched right-to-left against the 3 winning numbers. | Section 2, Section VI-A |
| **Qualifying Transaction** | A SuperQi spending transaction (purchase, bill payment, or mobile top-up) of ≥ 1,000 IQD that is not a self-transfer, P2P transfer, ATM withdrawal, or duplicate within 60 seconds to the same merchant at the same amount. | Section 21, Section VI-A |
| **Entry Generation** | The deterministic process of calculating `MAX(1, FLOOR(amount / 2,500 IQD))` entries per qualifying transaction and generating that many unique Fawz Numbers. | Section VI-A, Section 21 |
| **Shared Entry** | A Fawz Number record owned by a POS/QR merchant that is identical to the consumer entry generated from the same transaction. The merchant earns the same number as their customer. | Section VI-A Step 7, Section III |
| **Draw Pool Snapshot** | A point-in-time freeze of all eligible FawzEntry records taken at T-30 minutes before draw broadcast, defining the exact set of entries eligible for that draw. | Section VI-B Step 1 |
| **Sealed Pre-Generation** | The cryptographic commit record storing 3 winning numbers generated before the Al Rabiaa broadcast begins, sealed in encrypted storage. Physical draw result overrides on confirmed mismatch. | Section VI-B Step 2, Section XIII |
| **Digit-Reveal (Right-to-Left)** | The UI animation synced to Al Rabiaa TV where each winning digit is broadcast via WebSocket as the ball machine draws them, displayed from position 10 (rightmost) to position 1 (leftmost). | Section VI-B Step 4 |
| **Winner Tier** | The match level between a Fawz Number and a winning number: Last-3 (3 matching trailing digits), Last-5, Last-7, Last-10 (jackpot). Each tier carries a distinct prize value. | Section VI-B Step 8 |
| **Jackpot** | The Last-10 prize — full 10-digit match. Rolls over to next draw of same type if unclaimed. Monthly rollover capped at 300,000,000 IQD before redistribution as Last-5 prizes. | Section 21 |
| **Weekly Spark** | A challenge mechanic rewarding users who transact on ≥ 5 unique days in a calendar week, granting 250 bonus entries. Earnable once per calendar month. | Section III, Section VI-C |
| **Onboarding Challenge Set** | 4 preset challenges for users with lifetime\_tx ≤ 10: 'أول رقم فوز', 'أول أسبوع', 'ادعي صاحبك', 'شوف النتائج' — together granting 325 entries and the Fawz Explorer badge. | Section III, Section VII |
| **Golden Ticket** | Consumer-to-consumer referral programme. Referrer earns \+50 entries \+ 5,000 IQD cash; referred user earns \+100 entries on first qualifying tx ≥ 5,000 IQD. | Section VI-E |
| **Channel Multiplier** | A configurable decimal value applied to entry count per payment channel (online, POS, Fawz Certified POS). Phase 1 launch: all \= 1.0×. | Section VII, OBJ-009 |
| **Qualifying Small Merchant** | A SuperQi POS/QR merchant with rolling 30-day receiving volume \< 50,000,000 IQD and ≥ 10 unique customer transactions per month, automatically eligible for shared entries. | Section III, Section 21 |
| **Retroactive Seeding** | One-time launch batch that generates entries for all eligible SuperQi users from 90 days of historical qualifying transactions, capped at 15 entries per user, eligible for the first weekly draw only. | Section VI-D |
| **FraudReviewCase** | A case record opened by automated rules (e.g., referral\_count\_month \> 10\) requiring human review before account action. No automated suspension. | Section XIII, OBJ-013 |
| **PrizePayout** | A financial disbursement record for a wallet credit execution via SuperQi Wallet API, linked to a DrawWinner record. Irreversible once credited. | Section V, OBJ-012 |
| **Budget Monitor** | Real-time admin dashboard widget tracking running prize cost against weekly/monthly projected budget. Alerts at 80% and 100% of projected spend. | Section XVII, DevOps section |
| **Draw Finalize** | The admin-triggered action (POST /admin/draw/{id}/finalize) that executes winner calculation, wallet credits, push notifications, and archives the draw record. Irreversible. | Section VI-B Step 7 |
| **Unique Days** | Distinct calendar days (UTC+3 boundary) within a week or month on which a user made ≥ 1 qualifying transaction. Used as the metric for the Weekly Spark and Monthly Fire challenges. | Section VI-C |
| **SuperQi Wallet API** | The external Qi Group wallet credit API through which all prize payouts are disbursed. Fawz does not manage wallet balances directly. | Section XV, Ecosystem |
| **IQD** | Iraqi Dinar — the sole currency of Fawz Phase 1\. All prize amounts, thresholds, and caps are denominated in IQD. | Section II |
| **مكافآت تجارية** | Arabic: "Commercial Rewards" — the mandatory regulatory framing of Fawz. Must NOT be described as يانصيب (lottery) or قمار (gambling). | Section XIV |

---

## 3\. SYSTEM MODULE BREAKDOWN

### Module: ENTRY GENERATION ENGINE

| Field | Value |
| :---- | :---- |
| Module ID | MOD-001 |
| Description | Handles all aspects of Fawz Number creation: evaluating transaction eligibility from SuperQi event stream, calculating entry counts, applying channel multipliers, generating cryptographic 10-digit numbers, persisting FawzEntry records, triggering merchant shared entry creation, triggering challenge progress hooks, and executing the one-time retroactive seeding batch. This module is the primary value-creation mechanism of Fawz. |
| Domain Events | TransactionEligibilityChecked, FawzEntriesGenerated, SharedMerchantEntriesCreated, ChannelMultiplierApplied, ChallengeHookFired, RetroactiveEntryBatchStarted, RetroactiveEntryBatchCompleted, RetroactiveEntriesExpired |
| Commands | EvaluateTransaction, GenerateFawzNumbers, CreateSharedMerchantEntries, ApplyChannelMultiplier, TriggerChallengeHook, RunRetroactiveSeedingBatch, ExpireRetroactiveEntries, ConfigureChannelMultiplier |
| Core Entities | FawzEntry (OBJ-001), ConsumerUser (OBJ-010), Merchant (OBJ-011), ChannelMultiplierConfig (OBJ-009) |
| Dependencies | MOD-005 (merchant eligibility cache), MOD-003 (challenge hook), MOD-009 (push notifications) |
| External Integrations | SuperQi Transaction System (webhook/event source) |

---

### Module: DRAW MANAGEMENT

| Field | Value |
| :---- | :---- |
| Module ID | MOD-002 |
| Description | Orchestrates the full lifecycle of weekly and monthly prize draws: admin-side draw scheduling and configuration, T-30 min pool snapshot, sealed cryptographic pre-generation of 3 winning numbers, Al Rabiaa operator digit-entry via WebSocket-connected admin tablet, draw mismatch reconciliation, admin finalization, winner calculation with digit-tier matching, jackpot rollover management, and draw record archival. This is the operational heart of Fawz and the highest-risk module for integrity. |
| Domain Events | DrawScheduled, DrawPoolSnapshotted, WinningNumbersPreGenerated, DrawBroadcastStarted, DrawDigitReceived, DrawDigitBroadcast, DrawMismatchDetected, DrawFinalized, WinnersCalculated, JackpotRolledOver, JackpotClaimed, DrawArchived |
| Commands | ScheduleDraw, SnapshotEntryPool, PreGenerateWinningNumbers, StartDrawBroadcast, SubmitDrawDigit, ReconcileDrawMismatch, FinalizeDraw, CalculateWinners, RolloverJackpot |
| Core Entities | Draw (OBJ-002), DrawWinner (OBJ-003), FawzEntry (OBJ-001), DrawDigitEvent (OBJ-014), PrizePayout (OBJ-012) |
| Dependencies | MOD-001 (entry pool), MOD-006 (prize payout), MOD-009 (notifications \+ WebSocket) |
| External Integrations | Al Rabiaa TV Production (admin tablet operator), SuperQi Wallet API (prize credit) |

---

### Module: CHALLENGE SYSTEM

| Field | Value |
| :---- | :---- |
| Module ID | MOD-003 |
| Description | Manages the full lifecycle of Fawz's engagement challenges: admin creation of challenge configs (type, metric, target, dates, rewards), onboarding challenge set auto-activation for new users, real-time progress tracking per user, checkpoint evaluations, weekly/monthly streak resets, Weekly Spark monthly deduplication, and challenge completion reward crediting. Challenges are the variable content layer that prevents draw habituation. |
| Domain Events | ChallengeCreated, ChallengeActivated, ChallengeProgressUpdated, ChallengeCheckpointReached, ChallengeCompleted, ChallengeExpired, WeeklyStreakReset, MonthlyStreakReset, OnboardingChallengeSetUnlocked |
| Commands | CreateChallenge, ActivateChallenge, UpdateChallengeProgress, EvaluateCheckpoints, CompleteChallenge, ResetWeeklyStreak, ResetMonthlyStreak, UnlockOnboardingSet, DeactivateChallenge |
| Core Entities | Challenge (OBJ-004), UserChallengeProgress (OBJ-005), ConsumerUser (OBJ-010), FawzEntry (OBJ-001) |
| Dependencies | MOD-001 (entry crediting for rewards), MOD-009 (challenge completion notifications) |
| External Integrations | None |

---

### Module: REFERRAL SYSTEM

| Field | Value |
| :---- | :---- |
| Module ID | MOD-004 |
| Description | Implements the Golden Ticket consumer-to-consumer referral programme: unique referral link generation with 30-day expiry, first-click attribution tracking, fraud validation (180-day inactivity, Qi Card uniqueness, device fingerprint, qualifying transaction type and amount ≥ 5,000 IQD), reward crediting to both referrer and referred user, referral\_count\_month tracking for abuse detection, and referral history view. |
| Domain Events | ReferralLinkGenerated, ReferralLinkClicked, ReferralAttributed, ReferralQualified, ReferralFraudValidationPassed, ReferralFraudValidationFailed, ReferralRewarded, ReferralPendingReview, ReferralExpired, ReferralRejected |
| Commands | GenerateReferralLink, AttributeReferralClick, ValidateReferralFraud, RewardReferral, FlagReferralForReview, ExpireReferralLink |
| Core Entities | Referral (OBJ-007), ConsumerUser (OBJ-010), FawzEntry (OBJ-001), PrizePayout (OBJ-012) |
| Dependencies | MOD-001 (entry crediting), MOD-006 (cash reward payout), MOD-007 (fraud flagging), MOD-009 (reward notifications) |
| External Integrations | SuperQi Wallet API (5,000 IQD cash reward payout) |

---

### Module: MERCHANT MANAGEMENT

| Field | Value |
| :---- | :---- |
| Module ID | MOD-005 |
| Description | Manages merchant-side Fawz eligibility and passive entry earning: nightly batch recalculation of rolling 30-day receiving volume and unique customer transaction counts, eligibility flag updates (is\_eligible), shared Fawz entry creation at transaction time, merchant push notification delivery, and the merchant-facing view of their entry and prize history. Phase 1 scope only — Fawz Certified merchant onboarding with multiplier management deferred to Phase 1.5. |
| Domain Events | MerchantEligibilityRefreshed, MerchantEligibilityGranted, MerchantEligibilityRevoked, MerchantSharedEntriesCreated, MerchantPrizeWon |
| Commands | RefreshMerchantEligibility, GrantMerchantEligibility, RevokeMerchantEligibility, CreateMerchantSharedEntries |
| Core Entities | Merchant (OBJ-011), FawzEntry (OBJ-001), DrawWinner (OBJ-003) |
| Dependencies | MOD-001 (shared entry creation), MOD-009 (merchant push notifications) |
| External Integrations | SuperQi Merchant KYC (merchant data source) |

---

### Module: PRIZE & PAYOUT MANAGEMENT

| Field | Value |
| :---- | :---- |
| Module ID | MOD-006 |
| Description | Manages the financial disbursement of prizes: SuperQi wallet credit execution for all winners below per-user caps, cap enforcement (1M IQD weekly / 5M IQD monthly), jackpot rollover state management, prize history views for consumers and merchants, automatic hold for high-value winners (\> 5M IQD), and routing held payouts to the compliance review queue. |
| Domain Events | PrizePayoutInitiated, PrizePayoutCredited, PrizePayoutHeld, JackpotRolledOver, JackpotCapReached, PrizePayoutReleased, PrizePayoutRejected |
| Commands | InitiatePrizePayout, CreditPrizeToWallet, HoldPrizeForReview, ReleaseHeldPrize, RejectPrize, RolloverJackpot, RedistributeJackpotCap |
| Core Entities | PrizePayout (OBJ-012), DrawWinner (OBJ-003), Draw (OBJ-002), ConsumerUser (OBJ-010), Merchant (OBJ-011) |
| Dependencies | MOD-002 (winner records), MOD-007 (compliance review for held prizes), MOD-009 (winner notifications) |
| External Integrations | SuperQi Wallet API (prize credit execution) |

---

### Module: FRAUD & COMPLIANCE

| Field | Value |
| :---- | :---- |
| Module ID | MOD-007 |
| Description | Implements Phase 1 rules-based fraud detection and the human-review workflow: automated flagging rules (referral volume \> 10/month, duplicate device fingerprint patterns, merchant self-dealing), FraudReviewCase creation and queue management, reviewer decision actions (approve/reject/escalate), dispute submission and resolution routing, account suspension management (human-only, no automated suspension), and CBI reporting documentation generation. |
| Domain Events | FraudFlagCreated, FraudCaseOpened, FraudCaseAssigned, FraudCaseDecided, FraudCaseEscalated, FraudCaseClosed, AccountSuspended, DisputeSubmitted, DisputeResolved |
| Commands | FlagForFraudReview, OpenFraudCase, DecideFraudCase, EscalateFraudCase, SuspendAccount, ReinstateAccount, SubmitDispute, ResolveDispute |
| Core Entities | FraudReviewCase (OBJ-013), ConsumerUser (OBJ-010), Referral (OBJ-007), PrizePayout (OBJ-012) |
| Dependencies | MOD-004 (referral fraud), MOD-006 (high-value winner review), MOD-008 (admin queue), MOD-009 (outcome notifications) |
| External Integrations | None (Phase 1 — rules-based only) |

---

### Module: ADMIN OPERATIONS

| Field | Value |
| :---- | :---- |
| Module ID | MOD-008 |
| Description | Provides the full admin control plane: secure admin authentication (token \+ IP whitelist \+ MFA), real-time budget monitoring dashboard, draw control panel (snapshot, pre-generate, finalize), challenge calendar management, configurable system parameters (all numeric thresholds stored as config, not hard-coded), winner export for media production, audit log viewer, and fraud review queue interface. All configurable parameters managed here — no hard-coded business logic. |
| Domain Events | AdminLoggedIn, AdminActionAudited, BudgetAlertTriggered, ChallengeConfigUpdated, SystemConfigUpdated, WinnerListExported, AuditLogAccessed |
| Commands | AuthenticateAdmin, UpdateSystemConfig, UpdateChannelMultiplier, UpdateChallengeConfig, ExportWinnerList, ViewAuditLog, TriggerBudgetAlert |
| Core Entities | Draw (OBJ-002), Challenge (OBJ-004), ChannelMultiplierConfig (OBJ-009), FraudReviewCase (OBJ-013), AuditLog |
| Dependencies | All modules (admin is cross-cutting control plane) |
| External Integrations | None |

---

### Module: NOTIFICATIONS & REAL-TIME

| Field | Value |
| :---- | :---- |
| Module ID | MOD-009 |
| Description | Manages all outbound communication: push notification fan-out to consumers and merchants (entry earned, challenge progress, draw reminders, winner/non-winner results), the WebSocket service broadcasting draw digits to all connected clients during draw broadcast (\< 500ms latency, 500K+ concurrent connections), in-app notification center with notification history, and user-configurable notification preferences per notification type. |
| Domain Events | PushNotificationQueued, PushNotificationSent, PushNotificationDelivered, WebSocketConnectionEstablished, DrawDigitBroadcast, InAppNotificationCreated |
| Commands | QueuePushNotification, BroadcastDrawDigit, SendPreDrawReminder, SendWinnerNotification, SendNonWinnerNotification, UpdateNotificationPreferences |
| Core Entities | ConsumerUser (OBJ-010), Merchant (OBJ-011), Draw (OBJ-002), DrawDigitEvent (OBJ-014) |
| Dependencies | MOD-001, MOD-002, MOD-003, MOD-004, MOD-006 (notification triggers) |
| External Integrations | Push Notification Service (Firebase/APNs — TBD vendor) |

---

### Module: USER ACCOUNT & ONBOARDING

| Field | Value |
| :---- | :---- |
| Module ID | MOD-010 |
| Description | Manages the Fawz-specific extension of the SuperQi user account: the Fawz tab home screen (entry count, challenge progress bars, draw countdown, current jackpot), user profile Fawz state (weekly/monthly unique days, streaks, referral code, onboarding status), winner social share screen (branded share card with matching digits highlighted), draw results browsing, and consent management (marketing notifications, winner media consent). |
| Domain Events | FawzTabOpened, DrawResultsViewed, WinShareButtonTapped, UserConsentRecorded |
| Commands | OpenFawzTab, ViewDrawResults, ShareWinResult, RecordConsent, UpdateNotificationPreferences |
| Core Entities | ConsumerUser (OBJ-010), FawzEntry (OBJ-001), Draw (OBJ-002), DrawWinner (OBJ-003) |
| Dependencies | MOD-001 (entry list), MOD-002 (draw results), MOD-003 (challenge progress), MOD-009 (notifications) |
| External Integrations | iOS Share Sheet, Android Share Intent (social sharing) |

---

## 4\. ROLE & PERMISSION MATRIX

### 4.1 Role Definitions

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-001 |
| Role Name | Consumer User |
| Type | end\_user |
| Description | A SuperQi wallet holder who earns Fawz Numbers through qualifying spending transactions, challenges, and referrals, and participates in weekly/monthly draws. The primary revenue-generating and growth-driving user of the platform. |
| Authentication | Inherited from SuperQi (phone OTP \+ Qi Card KYC). Fawz extends with a Fawz-scoped JWT. |
| Default on Signup | Yes — any SuperQi user with ≥1 qualifying transaction |
| Can be assigned by | System (automatic on first qualifying transaction) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-002 |
| Role Name | New/Onboarding Consumer |
| Type | end\_user |
| Description | A consumer in the activation phase (lifetime\_tx ≤ 10). Unlocks the onboarding challenge set and 325-entry welcome package. Automatically transitions to ROLE-001 when lifetime\_tx \> 10\. |
| Authentication | Inherited from SuperQi |
| Default on Signup | Yes — assigned at account creation until lifetime\_tx \> 10 |
| Can be assigned by | System (automatic; revoked by system when lifetime\_tx \> 10\) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-003 |
| Role Name | Qualifying Small Merchant |
| Type | business |
| Description | A POS/QR-accepting SuperQi merchant automatically qualifying for shared Fawz entries based on nightly eligibility recalculation (rolling 30-day receiving volume \< 50M IQD, ≥10 unique customer tx/month). |
| Authentication | Inherited from SuperQi merchant account |
| Default on Signup | No — eligibility determined nightly by batch job |
| Can be assigned by | System (automated nightly batch) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-004 |
| Role Name | Fawz Certified Merchant |
| Type | business |
| Description | Phase 1.5 merchant who has completed formal Fawz Certified onboarding and earns a decaying entry multiplier (3.0× → 1.5× over 19 months). Not active in Phase 1 MVP. |
| Authentication | Inherited from SuperQi merchant account |
| Default on Signup | No — requires Fawz Certified onboarding completion |
| Can be assigned by | Platform Admin (post-onboarding programme completion) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-005 |
| Role Name | Referrer |
| Type | end\_user |
| Description | Any Consumer User who generates and shares a Golden Ticket referral link. A sub-state of ROLE-001 activated by referral link generation — not a separate role. For permission matrix purposes, treated as ROLE-001 with additional referral-scoped CREATE permissions. |
| Authentication | Same as ROLE-001 |
| Default on Signup | No — activated by generating first referral link |
| Can be assigned by | Self-activated (any ROLE-001 can generate referral link) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-006 |
| Role Name | Fawz Ambassador |
| Type | end\_user |
| Description | Phase 2 role. A verified winner selected post-draw to advocate publicly for Fawz in exchange for 500 bonus entries/month. Not active in Phase 1 MVP. |
| Authentication | Same as ROLE-001 |
| Default on Signup | No — selected by Fawz team post-draw |
| Can be assigned by | ROLE-007 (Platform Admin) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-007 |
| Role Name | Platform Admin |
| Type | operational |
| Description | Qi Group / Fawz operations team member responsible for draw execution, challenge configuration, fraud review, system configuration, winner export, and budget monitoring. Highest-privilege non-system role. |
| Authentication | Admin token (separate from consumer auth) \+ IP whitelist \+ MFA (TOTP) |
| Default on Signup | No — manually provisioned |
| Can be assigned by | System Owner (Hasan Hadi) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-008 |
| Role Name | Finance/Compliance Reviewer |
| Type | compliance |
| Description | Internal role with read access to financial records and decision authority over fraud review cases, high-value prize holds, and CBI reporting documentation. Cannot modify draw or challenge configuration. |
| Authentication | Admin token \+ IP whitelist \+ MFA |
| Default on Signup | No — manually provisioned |
| Can be assigned by | ROLE-007 (Platform Admin) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-009 |
| Role Name | Al Rabiaa Production Operator |
| Type | operational |
| Description | External broadcast partner role scoped exclusively to draw digit entry during live Al Rabiaa TV draws. Access limited to IP-whitelisted studio tablet. Cannot access any other system function. |
| Authentication | Scoped admin token \+ IP whitelist restricted to studio IP range only |
| Default on Signup | No — provisioned per draw |
| Can be assigned by | ROLE-007 (Platform Admin) |

| Field | Value |
| :---- | :---- |
| Role ID | ROLE-010 |
| Role Name | Automated System Processes |
| Type | system |
| Description | Scheduled jobs and event-driven processes: nightly merchant eligibility refresh, daily unique-day boundary calculation, weekly/monthly streak resets, retroactive seeding batch, draw pool snapshot, jackpot rollover, post-draw retroactive entry expiry, community challenge reward batch, push notification fan-out. |
| Authentication | Internal service token (not exposed externally) |
| Default on Signup | N/A |
| Can be assigned by | N/A — system-only |

### 4.2 Permission Matrix

| Feature ID | ROLE-001 | ROLE-002 | ROLE-003 | ROLE-004 | ROLE-005 | ROLE-006 | ROLE-007 | ROLE-008 | ROLE-009 | ROLE-010 |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| FEAT-001: Transaction Entry Generation | R | R | R | R | R | R | R | R | — | CX |
| FEAT-002: Retroactive Entry Seeding | R | R | R\* | R\* | R | R\* | RX | R | — | CX |
| FEAT-003: Entry History View | R (own) | R (own) | R (own) | R (own) | R (own) | R (own) | R (all) | R (all) | — | R\* |
| FEAT-004: Channel Multiplier Config | — | — | — | — | — | — | CRUD | R | — | R |
| FEAT-005: Draw Scheduling & Config | — | — | — | — | — | — | CRUD | R | — | R |
| FEAT-006: Draw Entry Pool Snapshot | — | — | — | — | — | — | X | R | — | X\* |
| FEAT-007: Winning Number Pre-Generation | — | — | — | — | — | — | X | R | — | — |
| FEAT-008: Live Draw WebSocket Broadcast | R | R | R | R | R | R | RX | R | — | — |
| FEAT-009: Draw Digit Entry (Operator) | — | — | — | — | — | — | — | — | CX | — |
| FEAT-010: Draw Finalization | — | — | — | — | — | — | X | R | — | X\* |
| FEAT-011: Draw Results Browsing | R | R | R | R | R | R | R | R | — | — |
| FEAT-012: Challenge Creation & Management | — | — | — | — | — | — | CRUD | R | — | R |
| FEAT-013: Onboarding Challenge Set | R | CRX | — | — | R | — | CRUD | R | — | X |
| FEAT-014: Weekly Spark Streak Challenge | CRX | CRX | — | — | CRX | CRX | CRUD | R | — | X |
| FEAT-015: Monthly Rotating Challenge | CRX | — | — | — | CRX | CRX | CRUD | R | — | X |
| FEAT-016: Challenge Progress View | R (own) | R (own) | — | — | R (own) | R (own) | R (all) | R (all) | — | R\* |
| FEAT-017: Referral Link Generation | CX | CX | — | — | CX | CX | R | R | — | — |
| FEAT-018: Referral Attribution & Tracking | R (own) | R (own) | — | — | R (own) | R (own) | R (all) | R (all) | — | CX |
| FEAT-019: Referral Fraud Validation | — | — | — | — | — | — | R | RX | — | X |
| FEAT-020: Referral History View | R (own) | R (own) | — | — | R (own) | R (own) | R (all) | R (all) | — | — |
| FEAT-021: Merchant Eligibility Engine | — | — | R (own) | R (own) | — | — | RX | R | — | X |
| FEAT-022: Merchant Shared Entry View | — | — | R (own) | R (own) | — | — | R (all) | R (all) | — | — |
| FEAT-023: Prize Wallet Credit Execution | R (own) | R (own) | R (own) | R (own) | R (own) | R (own) | RX | RX | — | X |
| FEAT-024: Jackpot Rollover Management | — | — | — | — | — | — | RX | R | — | X |
| FEAT-025: Prize & Win History View | R (own) | R (own) | R (own) | R (own) | R (own) | R (own) | R (all) | R (all) | — | — |
| FEAT-026: High-Value Winner Hold | — | — | — | — | — | — | R | CRUD X | — | X\* |
| FEAT-027: Automated Fraud Flagging | — | — | — | — | — | — | R | R | — | X |
| FEAT-028: Fraud Review Queue | — | — | — | — | — | — | CRUD | CRUD | — | — |
| FEAT-029: Fraud Case Decision | — | — | — | — | — | — | U | CRUD X | — | — |
| FEAT-030: Account Suspension Management | — | — | — | — | — | — | U | U | — | — |
| FEAT-031: Dispute Submission | CX | CX | CX | CX | CX | CX | R | R | — | — |
| FEAT-032: Dispute Resolution | — | — | — | — | — | — | UX | UX | — | — |
| FEAT-033: Admin Authentication | — | — | — | — | — | — | X | X | X | — |
| FEAT-034: Admin Dashboard & Budget Monitor | — | — | — | — | — | — | R | R | — | — |
| FEAT-035: System Configuration Management | — | — | — | — | — | — | CRUD | R | — | — |
| FEAT-036: Winner Export for Media | — | — | — | — | — | — | X | R | — | — |
| FEAT-037: Audit Log Viewer | — | — | — | — | — | — | R | R | — | — |
| FEAT-038: Push Notification Fan-out | — | — | — | — | — | — | X | — | — | X |
| FEAT-039: Notification Preferences | U | U | U | U | U | U | R | — | — | — |
| FEAT-040: In-app Notification Center | R | R | R | R | R | R | R | — | — | — |
| FEAT-041: Fawz Tab Home Screen | R | R | R | R | R | R | — | — | — | — |
| FEAT-042: User Fawz Profile Extension | R U | R U | R | R | R U | R U | R | R | — | RU |
| FEAT-043: Draw Share / Winner Social Export | X | X | X | X | X | X | — | — | — | — |
| FEAT-044: Consent & Media Permission | U | U | U | U | U | U | R | R | — | — |

**Key:** C=Create, R=Read, U=Update, D=Delete, X=Execute, —=No Access, \*=Inferred

### 4.3 Data Visibility Rules

- **ROLE-001/002/005/006 (Consumer variants):** Can see own FawzEntry records, own DrawWinner records, own UserChallengeProgress, own Referral records (sent). Cannot see other users' entry counts or referral networks.  
- **ROLE-003/004 (Merchant variants):** Can see own shared FawzEntry records (owner\_type='merchant'), own DrawWinner records. Cannot see customer identity behind shared entries.  
- **ROLE-007 (Platform Admin):** Can see all records across all entities. PII (phone numbers) are displayed as partial masks in dashboards except for winner export (name, phone, city for last-7+ winners only).  
- **ROLE-008 (Finance/Compliance):** Can see all FraudReviewCase records, all PrizePayout records, all DrawWinner records, all Referral records (full network view). Full PII access for winner identity verification.  
- **ROLE-009 (Operator):** Can see only active draw status, digit entry UI for the current draw in progress.  
- **ROLE-010 (System):** Internal service — reads all entities required for processing; writes to own-created records only.  
- **All Roles:** Draw winning numbers are public after draw finalization. Pre-generated numbers are sealed (ROLE-007-only decrypt, only during draw window).

---

## 5\. FEATURE DEFINITIONS

---

### FEAT-001: Qualifying Transaction → Fawz Entry Generation

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-001 |
| Module | MOD-001 — Entry Generation Engine |
| Priority | MUST-HAVE |
| Source | Section 2 (Operational System Summary), Section VI-A (Workflow: Transaction → Entry Generation), Section 21 (Usage Limits) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I process every SuperQi spending transaction so that eligible consumers and merchants automatically earn Fawz Numbers proportional to their transaction value.

**Description:** When a qualifying spending transaction fires from the SuperQi transaction system, the Entry Generation Engine evaluates it against a 7-check eligibility gate, calculates entry count using `MAX(1, FLOOR(amount / 2,500 IQD))`, applies the channel multiplier from ChannelMultiplierConfig, generates cryptographically-random 10-digit Fawz Numbers, persists FawzEntry records for the consumer, triggers merchant shared entry creation if applicable, fires the challenge progress hook, and queues push notifications. This is the system's primary value-delivery mechanism and must complete in \< 200ms p99.

**Acceptance Criteria:**

```
GIVEN a SuperQi spending transaction of 7,500 IQD at a POS merchant
WHEN the eligibility gate passes all 7 checks
THEN the system generates 3 Fawz Numbers (FLOOR(7500/2500)=3) for the consumer
AND creates 3 identical shared FawzEntry records for the merchant (if merchant is eligible)
AND sends a push notification '+3 أرقام فوز!' to the consumer
AND the entire flow completes within 200ms p99

GIVEN a qualifying transaction of 900 IQD
WHEN the eligibility gate checks the amount
THEN no entries are generated (below 1,000 IQD minimum)
AND the transaction processes normally in SuperQi with no Fawz action
AND no notification is sent

GIVEN the same merchant, same amount (2,500 IQD), within 60 seconds of a prior transaction
WHEN the duplicate detection check fires
THEN the transaction is excluded from entry generation
AND the exclusion reason is logged in AuditLog
AND the consumer sees no new Fawz Number notification

GIVEN a P2P transfer transaction of 10,000 IQD
WHEN the transaction type check fires
THEN no entries are generated (P2P is an excluded type)
AND the exclusion is logged

GIVEN a qualifying transaction during a SuperQi Transaction System outage
WHEN the event cannot be received by Fawz
THEN entries are generated retroactively from SuperQi audit log on system recovery
AND a recovery notification is sent to affected users
```

**Data Requirements:**

- **Entities Involved:** FawzEntry (OBJ-001), ConsumerUser (OBJ-010), Merchant (OBJ-011), ChannelMultiplierConfig (OBJ-009)  
- **Key Fields Written:** id (UUID), owner\_id, owner\_type, number (10-digit int), tx\_id, source ('transaction'), merchant\_id, shared\_entry (bool), source\_user\_id, channel, multiplier, draw\_week, draw\_month, is\_retroactive=false, is\_expired=false, created\_at  
- **Relationships:** FawzEntry belongs\_to ConsumerUser; FawzEntry optionally belongs\_to Merchant (shared\_entry=true)  
- **Validation Rules:** amount ≥ 1,000 IQD; transaction type NOT IN (P2P, ATM, self-transfer); account\_status \= 'active'; duplicate check: same merchant\_id \+ same amount \+ created\_at within 60 seconds; Fawz Number: cryptographic random 0–9,999,999,999, stored as BIGINT UNSIGNED

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/entries/generate | Internal webhook from SuperQi transaction system — triggers eligibility \+ generation |
| GET | /api/v1/entries | Consumer: list own entries, paginated, filterable by draw\_week/draw\_month |
| GET | /api/v1/entries/{id} | Get single entry detail |
| GET | /api/v1/admin/entries | Admin: list all entries with filters |

**Business Rules:**

1. Entry formula is `MAX(1, FLOOR(amount / 2,500 IQD))` — a 1,000 IQD transaction generates exactly 1 entry; a 2,499 IQD transaction generates exactly 1 entry; a 2,500 IQD transaction generates exactly 1 entry; a 5,000 IQD transaction generates exactly 2 entries.  
2. Channel multiplier from ChannelMultiplierConfig is applied after base count: `final_entries = CEIL(base_entries × multiplier)`. Phase 1 multiplier \= 1.0× for all channels.  
3. Merchant shared entries are created atomically with consumer entries — if the consumer entry insert fails, the merchant entry must not be created (transactional integrity).  
4. All numeric thresholds (1,000 IQD minimum, 2,500 IQD divisor) are configurable admin parameters, not hard-coded constants.  
5. Duplicate detection uses a sliding 60-second window per (merchant\_id, amount) pair — not per user. A user who makes two 2,500 IQD transactions at two different merchants in 60 seconds earns entries for both.

**Dependencies:**

- Depends on: FEAT-004 (Channel Multiplier Config lookup), FEAT-021 (Merchant Eligibility Engine — eligibility cache)  
- Blocks: FEAT-008 (draw pool must contain entries generated here), FEAT-013/014/015 (challenge hook fires from here)

**UI Screens (Expected):**

- Entry History Screen (consumer-facing, FEAT-003)  
- Fawz Tab Home Screen (entry count badge update, FEAT-041)

---

### FEAT-002: Retroactive Entry Seeding (Launch-Only Batch)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-002 |
| Module | MOD-001 — Entry Generation Engine |
| Priority | MUST-HAVE |
| Source | Section VI-D (Workflow: Retroactive Entry Seeding), Section 21 (15-entry cap) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I seed Fawz Numbers for all eligible SuperQi users based on their 90-day transaction history so that existing customers feel immediately invested in the first draw.

**Description:** A one-time batch job runs 2 weeks before the first draw. It processes all SuperQi users with ≥1 eligible transaction in the prior 90 days, sums their eligible spending, calculates entries using the standard formula, applies a hard cap of 15 entries per user, generates Fawz Numbers, and pushes a notification to each user. Retroactive entries are eligible for the first weekly draw only and are expired immediately after. The batch is gated by a run-once flag and cannot be re-triggered.

**Acceptance Criteria:**

```
GIVEN 8M eligible SuperQi users with qualifying 90-day transaction history
WHEN the retroactive seeding batch runs
THEN each user receives entries = MIN(15, MAX(1, FLOOR(total_90d_spend / 2,500)))
AND each entry is stored with is_retroactive=true, draw_week=[first_draw_week], is_expired=false
AND each user receives a push notification 'عدك [X] أرقام فوز من معاملاتك السابقة!'
AND the batch completes within 4 hours (engineering SLA)

GIVEN a user with 200,000 IQD in eligible 90-day spend (would generate 80 entries)
WHEN the 15-entry hard cap is applied
THEN user receives exactly 15 entries
AND receives a notification indicating retroactive seeding

GIVEN the retroactive seeding batch has already completed successfully
WHEN a second trigger attempt is made (admin error or test)
THEN the system rejects the trigger with error 'RETROACTIVE_SEED_ALREADY_COMPLETED'
AND logs the attempted double-execution in AuditLog

GIVEN the first weekly draw has been finalized
WHEN the post-draw retroactive expiry job runs
THEN all FawzEntry records with is_retroactive=true and is_expired=false are updated to is_expired=true
AND these entries are excluded from any subsequent draw
```

**Data Requirements:**

- **Entities Involved:** FawzEntry (OBJ-001), ConsumerUser (OBJ-010), RetroactiveSeedBatch (OBJ-008)  
- **Key Fields:** RetroactiveSeedBatch: id, status, started\_at, completed\_at, users\_seeded, total\_entries\_created, run\_lock\_flag (boolean)  
- **Validation Rules:** run\_lock\_flag must be false before batch starts; set to true immediately on start; cap: 15 entries per user; 90-day lookback window from batch run date; only qualifying transaction types included

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/batches/retroactive-seed | Admin-triggered (one-time); checks run\_lock\_flag before executing |
| GET | /api/v1/admin/batches/retroactive-seed/status | Monitor batch progress |
| POST | /api/v1/internal/batches/expire-retroactive | Post-first-draw expiry trigger (system) |

**Business Rules:**

1. The 15-entry cap is a configurable admin parameter.  
2. Retroactive entries use the same Fawz Number generation algorithm as live transactions.  
3. Retroactive entries do NOT count toward challenge progress metrics (challenges begin at Phase 1 live launch date).  
4. Merchant shared entries are NOT created for retroactive entries — only consumer entries.  
5. If the SuperQi 90-day transaction history is unavailable for a subset of users, the batch continues for available users and logs affected user\_ids for manual follow-up.

**Dependencies:**

- Depends on: FEAT-001 (entry generation logic reused)  
- Blocks: FEAT-006 (first draw pool snapshot must include retroactive entries)

**UI Screens (Expected):**

- Admin Batch Control Screen (trigger \+ status monitor)

---

### FEAT-003: Entry History View (My Numbers)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-003 |
| Module | MOD-001 — Entry Generation Engine |
| Priority | MUST-HAVE |
| Source | Section VII-B (WF-S-005: Entry History Browsing), Section XV (UX principles — immediate reward feeling) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to browse all my Fawz Numbers with their source, draw status, and win outcome so that I can verify my entries and track my draw history.

**Description:** A paginated, filterable list of all FawzEntry records owned by the authenticated user, showing each 10-digit Fawz Number, its source (transaction/challenge/referral/retroactive), generation date, applicable draw, and outcome (active/matched/won/not\_won/expired). The list is sorted by created\_at DESC (newest first). An aggregate entry count for the current open draw is prominently displayed at the top.

**Acceptance Criteria:**

```
GIVEN a consumer with 47 active entries in the current draw week
WHEN they open the My Numbers screen
THEN they see '47 أرقام فوز هذا الأسبوع' as the header count
AND a paginated list of entries, most recent first, 20 per page
AND each entry shows: number (formatted as XXXX-XXXX-XX), source badge, date, draw label

GIVEN entries from multiple sources (transaction, challenge, referral)
WHEN the consumer filters by source='challenge'
THEN only challenge-sourced entries are displayed

GIVEN a draw has been finalized and a user's entry matched Last-3
WHEN the user views that entry in history
THEN the entry shows outcome='Won', prize_tier='Last-3', prize_iqd=[amount]
AND a 'شاهد التفاصيل' (View Details) link to the DrawWinner record

GIVEN a user with 0 entries in the current draw
WHEN they open My Numbers
THEN they see an empty state: 'ما عدك أرقام بعد — ادفع بسوبر كي لتحصل على أرقامك!'
AND a CTA button linking to their transaction history
```

**Data Requirements:**

- **Entities Involved:** FawzEntry (OBJ-001), DrawWinner (OBJ-003)  
- **Key Fields:** number, source, created\_at, draw\_week, draw\_month, is\_expired, outcome (derived from DrawWinner join)  
- **Validation Rules:** Pagination: cursor-based, default 20 per page; filter: source, draw\_week, is\_expired; sort: created\_at DESC only

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/entries?draw\_week=\&source=\&cursor= | Paginated entry list for authenticated user |
| GET | /api/v1/entries/summary | Current draw entry count \+ total all-time entry count |

**Business Rules:**

1. Consumers can only view their own entries — owner\_id filter applied server-side, never client-side.  
2. Retroactive entries display with a special badge 'مبكر' (Early) in the source column.  
3. Merchants viewing their shared entries see source as 'مشاركة مع زبونك' (Shared from customer transaction).

**Dependencies:** Depends on: FEAT-001

**UI Screens (Expected):**

- My Numbers Screen (consumer), Merchant Entry History Screen (ROLE-003/004 variant)

---

### FEAT-004: Channel Multiplier Configuration (Admin)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-004 |
| Module | MOD-001 — Entry Generation Engine |
| Priority | MUST-HAVE |
| Source | Section VII (ChannelMultiplierConfig OBJ-009), Section VI-A Step 4 |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to configure entry multipliers per payment channel without code deployment so that the business can incentivize specific payment channels and merchant types.

**Description:** Admin CRUD interface for ChannelMultiplierConfig records. Defines the multiplier value applied to entry count per channel (online, pos, fawz\_certified). Changes take effect on the next transaction processed — not retroactively. Phase 1 launch all values \= 1.0×. History of multiplier changes is maintained for audit.

**Acceptance Criteria:**

```
GIVEN a Platform Admin on the Channel Multiplier Config screen
WHEN they update the 'fawz_certified' multiplier from 1.0 to 3.0 and save
THEN all subsequent fawz_certified channel transactions generate 3× entries
AND the change is logged in AuditLog with before_value=1.0, after_value=3.0, admin_id, timestamp
AND existing entries already generated are NOT retroactively recalculated

GIVEN an admin attempts to set a multiplier to 0 or a negative value
WHEN they submit the form
THEN validation rejects with error 'Multiplier must be between 0.1 and 10.0'

GIVEN an admin changes a multiplier during draw broadcast (between pool snapshot and finalize)
WHEN the change is submitted
THEN the system warns 'Draw in progress — this change will not affect the current draw pool'
AND the change is applied for future transactions only
```

**Data Requirements:**

- **Entities Involved:** ChannelMultiplierConfig (OBJ-009)  
- **Key Fields:** channel (enum: online/pos/fawz\_certified), multiplier (DECIMAL 4,2), is\_active, updated\_at, updated\_by  
- **Validation Rules:** multiplier: min 0.1, max 10.0, 2 decimal places; channel: enum; is\_active: boolean

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/config/multipliers | List all channel multiplier configs |
| PUT | /api/v1/admin/config/multipliers/{channel} | Update multiplier for a channel |

**Business Rules:**

1. Multiplier config changes are effective immediately for new transactions — no cache invalidation delay \> 1 minute.  
2. All multiplier change history is preserved — soft update (previous record updated\_at, new record created).

**Dependencies:** Depends on: FEAT-033 (admin auth)

**UI Screens (Expected):**

- System Configuration Screen (part of MOD-008 admin panel)

---

### FEAT-005: Draw Scheduling & Configuration (Admin)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-005 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B, Section VII (WF-S-002: Draw Schedule Management), Section 21 |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to pre-schedule weekly and monthly draws with full configuration so that draw execution is predictable and the operations team can prepare well in advance.

**Description:** Admin creates Draw records with type (weekly/monthly), scheduled\_date, prize tier values, jackpot\_seed\_iqd, and pool\_cutoff\_time. Weekly draws default to every Thursday 9:00 PM UTC+3. Monthly draws default to 1st of month 9:00 PM UTC+3. Admin can reschedule a draw before its pool snapshot is taken. Prize tier values are configurable per draw.

**Acceptance Criteria:**

```
GIVEN a Platform Admin creating a new weekly draw scheduled for Thursday 2026-04-10 at 21:00 UTC+3
WHEN they complete the draw creation form with all required fields
THEN a Draw record is created with status='Scheduled'
AND the pre-scaling job is auto-configured to trigger at T-30 min (20:30)
AND the pool snapshot job is auto-configured to trigger at T-30 min

GIVEN a Draw in 'Scheduled' status
WHEN admin updates the scheduled_date to the following Thursday
THEN the Draw date is updated and all associated auto-trigger times are recalculated
AND the change is logged in AuditLog

GIVEN a Draw that has reached 'Pool_Snapshotted' status
WHEN admin attempts to reschedule
THEN the system rejects with error 'Draw cannot be rescheduled after pool snapshot — cancel and create new draw'

GIVEN admin attempts to create two weekly draws on the same date
WHEN they submit the form
THEN validation rejects with error 'A weekly draw already exists for this date'
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002)  
- **Key Fields:** id, type (enum: weekly/monthly), draw\_date (datetime UTC+3), status, pool\_cutoff\_time, prize\_tiers\_config (JSON: last\_3\_iqd, last\_5\_iqd, last\_7\_iqd, last\_10\_jackpot\_iqd), jackpot\_seed\_iqd, jackpot\_rollover\_iqd=0, entry\_pool\_size=null, winning\_numbers=null  
- **Validation Rules:** draw\_date: future date required; type: enum; prize\_tiers\_config: all values must be positive integers; no two draws of the same type on the same date

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/draws | Create new draw |
| GET | /api/v1/admin/draws | List draws with status filter |
| GET | /api/v1/admin/draws/{id} | Draw detail |
| PUT | /api/v1/admin/draws/{id} | Update draw config (pre-snapshot only) |
| DELETE | /api/v1/admin/draws/{id} | Cancel draw (pre-snapshot only; soft delete) |

**Business Rules:**

1. All prize tier values are configurable per draw — not hard-coded. Monthly grand draw prize tiers are TBD and will be configured via this interface before the first monthly draw.  
2. Draw cannot be deleted after status reaches Pool\_Snapshotted.  
3. Maximum jackpot rollover cap (default 300,000,000 IQD) is a configurable system parameter, not hard-coded.

**Dependencies:** Depends on: FEAT-033 (admin auth) Blocks: FEAT-006, FEAT-007, FEAT-008, FEAT-009, FEAT-010

**UI Screens (Expected):**

- Draw Calendar Screen, Create/Edit Draw Form

---

### FEAT-006: Draw Entry Pool Snapshot

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-006 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Step 1, Section XIII (sealed pre-generation) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to snapshot the eligible entry pool at T-30 minutes before the draw so that the pool is frozen and the sealed pre-generation can proceed on a deterministic dataset.

**Description:** Admin triggers pool snapshot from draw control panel. System queries all FawzEntry records that are Active (is\_expired=false) and assigned to the current draw\_week/draw\_month, records the pool size, and transitions the Draw to Pool\_Snapshotted status. After snapshot, no new entries are included in this draw (entries generated after snapshot time are assigned to the next draw).

**Acceptance Criteria:**

```
GIVEN a Draw in 'Scheduled' status at T-30 min before draw
WHEN admin clicks 'Snapshot Entry Pool'
THEN the system counts all eligible FawzEntry records for this draw period
AND records Draw.entry_pool_size
AND transitions Draw.status to 'Pool_Snapshotted'
AND the action is logged in AuditLog
AND entries generated after this moment have draw_week/draw_month set to the NEXT draw

GIVEN pool snapshot is triggered while the entry generation service is processing a high-volume burst
WHEN snapshot query runs
THEN the query uses a READ COMMITTED transaction to avoid locking entry generation
AND all entries committed before the snapshot timestamp are included

GIVEN a Draw is already in Pool_Snapshotted or later status
WHEN admin attempts to trigger snapshot again
THEN the system rejects with error 'Pool already snapshotted for this draw'
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002), FawzEntry (OBJ-001)  
- **Key Fields:** Draw.entry\_pool\_size (INT), Draw.pool\_snapshot\_at (datetime)  
- **Validation Rules:** Draw must be in 'Scheduled' status; entry\_pool\_size must be \> 0 (warn if \< expected threshold)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/draws/{id}/snapshot | Trigger pool snapshot |

**Business Rules:**

1. Pool snapshot is triggered manually by Platform Admin — not automated — to allow operational control.  
2. A minimum pool size warning threshold (configurable) alerts admin if the pool is unexpectedly small.

**Dependencies:** Depends on: FEAT-005, FEAT-001 Blocks: FEAT-007

**UI Screens (Expected):**

- Draw Control Panel

---

### FEAT-007: Winning Number Pre-Generation (Sealed Commit)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-007 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Steps 2–3, Section XIII (pre-disclosure threat mitigation) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to pre-generate the 3 winning numbers in a sealed cryptographic commit before the broadcast begins so that no insider can manipulate results after seeing the draw.

**Description:** Admin triggers winning number pre-generation after pool snapshot. System generates 3 cryptographically-random 10-digit numbers (using cryptographically secure RNG), stores them in an encrypted sealed record, pre-calculates all winner records for staged notification, and transitions Draw to a pre-generation complete state. Numbers remain sealed until admin triggers finalization. The sealed commit is timestamped and included in the audit trail.

**Acceptance Criteria:**

```
GIVEN a Draw in 'Pool_Snapshotted' status
WHEN admin clicks 'Pre-Generate Winning Numbers'
THEN 3 cryptographic 10-digit numbers are generated using CSPRNG
AND stored in an encrypted sealed record accessible only to ROLE-007 during finalization
AND all DrawWinner records are pre-calculated and staged (status='staged', not yet published)
AND push notifications are staged but NOT sent
AND AuditLog records: pre_generation timestamp, admin_id, sealed_commit_hash

GIVEN winning numbers have been pre-generated
WHEN any non-admin role or process attempts to read the sealed winning numbers
THEN the request is denied with 403
AND the attempt is logged in AuditLog

GIVEN the physical draw result matches the pre-generated numbers exactly
WHEN admin finalizes the draw
THEN staged winner records are confirmed and promoted to 'active'
AND staged notifications are released

GIVEN the physical draw result DOES NOT match the pre-generated numbers
WHEN admin enters the override number
THEN the system recalculates winners based on the physical number
AND updates AuditLog with mismatch_flag=true and physical_override_number
AND notifications use the physical result
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002), DrawWinner (OBJ-003 — staged)  
- **Key Fields:** Draw.pre\_generated\_numbers\_encrypted (TEXT — AES-256 encrypted JSON), Draw.pre\_gen\_timestamp, DrawWinner.status='staged'  
- **Validation Rules:** Numbers must be generated using OS-level CSPRNG; no predictable seed; sealed record must be timestamped before broadcast begins

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/draws/{id}/pre-generate | Generate and seal winning numbers |
| POST | /api/v1/admin/draws/{id}/override-number | Override with physical draw result on mismatch |

**Business Rules:**

1. Pre-generation MUST occur before any digit entry begins (system enforces order).  
2. The sealed commit hash is published publicly post-draw for cryptographic verification.  
3. Physical draw result always overrides pre-generated numbers on confirmed mismatch — pre-generated numbers are for fraud prevention (insider pre-disclosure), not for enforcing the result.

**Dependencies:** Depends on: FEAT-006 Blocks: FEAT-008 (broadcast can begin), FEAT-010 (finalization requires pre-gen)

**UI Screens (Expected):**

- Draw Control Panel (sealed pre-gen confirmation \+ mismatch override form)

---

### FEAT-008: Live Draw WebSocket Broadcast

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-008 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Steps 4–6, Section XV (scale: 500K+ concurrent connections), Section XV (\< 500ms latency) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to watch each winning digit appear in real time synced to the Al Rabiaa TV broadcast so that I can experience the draw as a live event and verify each digit as it is drawn.

**Description:** A WebSocket service maintains persistent connections from all Fawz app users during the draw window (Thursday 9:00 PM, 1st of month 9:00 PM). When ROLE-009 (Al Rabiaa operator) submits a digit via the admin tablet, the system broadcasts that digit to all connected clients within 500ms. Clients render a digit-reveal animation synced to the TV broadcast. Connections that drop degrade to long-polling at 5-second intervals. The WebSocket service must support 500K+ concurrent connections.

**Acceptance Criteria:**

```
GIVEN 500,000 consumers connected to the WebSocket draw service
WHEN the Al Rabiaa operator submits digit value=7 for position 10 (rightmost)
THEN all 500,000 connected clients receive the digit event within 500ms p95
AND the Fawz app renders the digit reveal animation for position 10

GIVEN a consumer who loses WebSocket connection during the draw
WHEN they reconnect within 5 minutes
THEN they receive all digits broadcast since they disconnected (via event replay from Redis)
AND their in-app display updates to the current state

GIVEN the WebSocket server receives a digit event from an IP NOT in the admin whitelist
WHEN the request hits POST /admin/draw/{id}/digit
THEN it is rejected with 403
AND the attempt is logged in AuditLog with the source IP

GIVEN low-bandwidth conditions (2G equivalent)
WHEN the WebSocket connection cannot be maintained
THEN the app degrades to HTTP polling every 5 seconds
AND the user sees a 'استقبال بطيء — الأرقام تصل...' indicator
```

**Data Requirements:**

- **Entities Involved:** DrawDigitEvent (OBJ-014), Draw (OBJ-002)  
- **Key Fields:** DrawDigitEvent: id, draw\_id, operator\_id, number\_index (1–3), digit\_position (1–10 right-to-left), digit\_value (0–9), timestamp, ip\_address  
- **Validation Rules:** digit\_position: 1–10; digit\_value: 0–9; number\_index: 1–3; operator IP must be in admin whitelist; events must arrive in correct positional sequence

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| WS | /ws/draw/{draw\_id} | WebSocket connection for consumer draw watching |
| POST | /api/v1/admin/draws/{draw\_id}/digit | Operator digit submission (IP-whitelisted) |
| GET | /api/v1/draws/{draw\_id}/digits | HTTP fallback: get all digits submitted so far |

**Business Rules:**

1. WebSocket connections are authenticated with consumer JWT — anonymous connections are not permitted.  
2. Draw broadcast must pre-scale infrastructure (2× normal capacity) from T-60 min before draw.  
3. Digit events are persisted in DrawDigitEvent table regardless of broadcast success, enabling replay.

**Dependencies:** Depends on: FEAT-007, FEAT-009 Blocks: FEAT-010 (finalization occurs after all digits submitted)

**UI Screens (Expected):**

- Live Draw Screen (digit-reveal animation, jackpot ticker, connected-user count)

---

### FEAT-009: Draw Digit Entry (Al Rabiaa Operator Tablet)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-009 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Steps 4–6, Section III (ROLE-009 journey), Section XIII (IP whitelist threat mitigation) |
| Confidence | HIGH |

**User Story:** As a ROLE-009 (Al Rabiaa Production Operator), I want to enter each drawn digit from the physical ball machine on the admin tablet so that the live TV draw is reflected in the Fawz app in real time.

**Description:** A dedicated operator UI — accessible only from the IP-whitelisted studio tablet with a scoped operator token — presents a 10-digit entry grid for each of 3 winning numbers. The operator enters each digit (0–9) for positions 10 through 1 (right-to-left) as the ball machine draws them. Each digit submission triggers the WebSocket broadcast. The UI confirms each digit with visual acknowledgement within 500ms. After all 10 digits for a number are entered, the operator confirms before proceeding to number 2\.

**Acceptance Criteria:**

```
GIVEN the operator tablet connected from the studio IP and authenticated with operator token
WHEN the operator taps digit '4' for position 10 (rightmost) of winning number 1
THEN the digit is submitted via POST /admin/draws/{id}/digit
THEN acknowledgement appears on tablet within 500ms
AND the WebSocket broadcast fires to all connected consumers

GIVEN an operator tablet accessing from a non-whitelisted IP
WHEN they attempt to submit any digit
THEN all requests are rejected with 403
AND the attempt is logged with source IP in AuditLog

GIVEN the operator has entered all 10 digits for winning number 1
WHEN they tap 'تأكيد الرقم الأول' (Confirm Number 1)
THEN the system transitions to digit entry mode for winning number 2
AND displays the full entered 10-digit number for operator visual verification

GIVEN the operator mistypes a digit (enters 3 instead of 8 for position 7)
WHEN they tap the correction button before confirmation
THEN the digit is overwritten (correction allowed before per-number confirmation)
AND a correction event is logged in AuditLog
```

**Data Requirements:**

- **Entities Involved:** DrawDigitEvent (OBJ-014), Draw (OBJ-002)  
- **Key Fields:** As per FEAT-008  
- **Validation Rules:** Operator token must have role='draw\_operator' scope; IP must be in admin.whitelist\_ips config; digit\_value 0–9; digit\_position 1–10

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/draws/{id}/digit | Digit submission (IP-whitelisted operator) |
| POST | /api/v1/admin/draws/{id}/correct-digit | Digit correction before number confirmation |
| POST | /api/v1/admin/draws/{id}/confirm-number/{index} | Confirm all 10 digits for one winning number |

**Business Rules:**

1. Digit corrections are only permitted before per-number confirmation — once number is confirmed, the override flow (FEAT-010 mismatch reconciliation) must be used.  
2. Operator tablet receives pre-draw orientation: verified WebSocket connection, green status indicator, digit entry walkthrough.

**Dependencies:** Depends on: FEAT-007, FEAT-008

**UI Screens (Expected):**

- Operator Draw Tablet UI (minimal — digit grid per number, position indicators, confirmation button)

---

### FEAT-010: Draw Finalization & Winner Calculation

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-010 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Steps 7–12, Section VIII (reversibility: Draw Finalized \= irreversible) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to finalize the draw after all digits are entered so that the system calculates all winners, credits prizes, and delivers results within 60 seconds.

**Description:** Admin triggers draw finalization via the Draw Control Panel. The system executes: winner calculation (modulo trailing-digit index matching across the full entry pool for each of 3 winning numbers), prize tier assignment (Last-3/Last-5/Last-7/Last-10), per-user payout cap enforcement (1M IQD weekly / 5M IQD monthly), wallet credit execution via SuperQi Wallet API, release of all staged push notifications (winner \+ non-winner), jackpot rollover update, and draw record archival. Finalization is irreversible.

**Acceptance Criteria:**

```
GIVEN a finalized draw with 3 winning numbers and 100M eligible entries
WHEN winner calculation runs
THEN all entries matching trailing 3+ digits of any winning number are identified
AND each matching entry is assigned the HIGHEST tier match (Last-10 > Last-7 > Last-5 > Last-3)
AND DrawWinner records are created for all matched entries
AND 95% of winners have prizes credited to SuperQi wallets within 60 seconds

GIVEN a consumer who won Last-7 worth 500,000 IQD and Last-3 worth 10,000 IQD in the same draw
WHEN per-user cap enforcement runs (1M IQD weekly)
THEN the user is credited 510,000 IQD (both prizes, total under cap)

GIVEN a consumer whose total winning amount in the weekly draw exceeds 1,000,000 IQD
WHEN per-user cap enforcement runs
THEN the consumer is credited 1,000,000 IQD
AND excess prize amount is held in PrizePayout.status='held_cap_exceeded'
AND a FraudReviewCase is opened for manual disposition

GIVEN no entry matches all 10 digits of the jackpot number
WHEN jackpot resolution runs
THEN Draw.jackpot_claimed=false
AND jackpot_rollover_iqd incremented by last_10_jackpot_iqd for the next draw of same type

GIVEN admin attempts to finalize a draw that has already been finalized
WHEN they submit the finalize request
THEN the system rejects with 'Draw already finalized — this action is irreversible'
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002), DrawWinner (OBJ-003), FawzEntry (OBJ-001), PrizePayout (OBJ-012)  
- **Key Fields:** DrawWinner: draw\_id, entry\_id, owner\_id, owner\_type, winning\_number\_index, digits\_matched, prize\_iqd, payout\_status; Draw: finalized\_at, total\_payout\_iqd, total\_winners, merchant\_winners, jackpot\_claimed  
- **Validation Rules:** All 3 winning numbers must be confirmed before finalization; payout caps enforced per owner\_id across all 3 winning numbers; finalization is a two-step admin confirmation

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/draws/{id}/finalize | Admin draw finalization (two-step: preview → confirm) |
| GET | /api/v1/admin/draws/{id}/winner-preview | Preview winner count and total payout before finalizing |

**Business Rules:**

1. Finalization requires two-step admin confirmation: preview screen shows winner count and total IQD — admin confirms explicitly.  
2. The winner calculation query must use the trailing-digit modulo index (created at entry generation time) for performance — a full table scan of 100M entries is not acceptable.  
3. Merchant DrawWinner records are created independently from consumer DrawWinner records — merchant prizes credited to merchant SuperQi wallet, consumer prizes credited to consumer wallet.  
4. Finalization is irreversible — audit log captures winning numbers, pool size, total payout, winner breakdown.

**Dependencies:** Depends on: FEAT-007, FEAT-008, FEAT-009 Blocks: FEAT-023 (prize wallet credit), FEAT-038 (notification release)

**UI Screens (Expected):**

- Draw Control Panel (finalize button \+ winner preview \+ confirmation modal)

---

### FEAT-011: Draw Results Browsing

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-011 |
| Module | MOD-002 — Draw Management |
| Priority | MUST-HAVE |
| Source | Section VII-B (WF-S-006: Draw Results Browsing) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to browse past draw results including winning numbers and my matched entries so that I can verify outcomes and track my prize history.

**Description:** A chronological list of all finalized draws with winning numbers, winner counts by tier, and total payout amounts. For each draw, the authenticated user's matching entries are highlighted. The results screen is the destination of the 'شوف النتائج' onboarding challenge and the winner notification deep link.

**Acceptance Criteria:**

```
GIVEN a consumer who won Last-3 in the previous weekly draw
WHEN they open Draw Results and tap the relevant draw
THEN they see: 3 winning numbers, their matching entry highlighted, prize amount '10,000 IQD 🎉'
AND a 'شارك فوزك!' (Share Your Win) button

GIVEN a consumer who won nothing in the last 3 draws
WHEN they view results for those draws
THEN each draw shows their entries with no match highlighted
AND a forward-looking message 'عدك [X] أرقام للسحب القادم'

GIVEN the 'شوف النتائج' onboarding challenge is pending
WHEN the consumer opens any draw results screen
THEN the challenge progress is marked complete
AND the challenge completion notification fires
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002), DrawWinner (OBJ-003), FawzEntry (OBJ-001)  
- **Key Fields:** Draw: type, draw\_date, winning\_numbers, total\_winners, total\_payout\_iqd; DrawWinner: digits\_matched, prize\_iqd (for authenticated user)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/draws | List finalized draws (paginated, newest first) |
| GET | /api/v1/draws/{id} | Draw detail with winning numbers and user's matching entries |
| GET | /api/v1/draws/{id}/winners/summary | Aggregate winner count by tier (public) |

**Business Rules:**

1. Winning numbers are publicly visible for all finalized draws. Pre-generation sealed numbers are never exposed.  
2. User's own matching entries are shown in the draw detail — other users' entries are not shown.

**Dependencies:** Depends on: FEAT-010

**UI Screens (Expected):**

- Draw Results List Screen, Draw Detail Screen (with winning number reveal and user's matching entries)

---

### FEAT-012: Challenge Creation & Management (Admin)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-012 |
| Module | MOD-003 — Challenge System |
| Priority | MUST-HAVE |
| Source | Section VII-B (WF-S-001: Challenge Calendar Management), Section V-B (OBJ-004) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to create, schedule, and manage challenges so that the content layer of Fawz stays fresh and engaging month-over-month.

**Description:** Admin CRUD interface for Challenge configuration: type (streak/rotating/onboarding), name\_ar/name\_en, metric, target\_value, category\_filter, scope, start\_date/end\_date, reward\_entries, reward\_cash\_iqd, reward\_badge, checkpoints JSON. Draft challenges can be edited freely. Active challenges can be deactivated (stops earning; prior rewards not reversed). Expired challenges are archived. Admin can preview how a challenge will render in the consumer app before activating.

**Acceptance Criteria:**

```
GIVEN admin creates a new rotating challenge 'استخدم سوبر كي 10 مرات في أسبوع واحد'
WHEN they set type=rotating, metric=transaction_count, target=10, scope=individual, dates=2026-05-01 to 2026-05-31, reward_entries=150
THEN the challenge is saved in Draft status
AND admin can preview the consumer-facing challenge card

GIVEN a Draft challenge
WHEN admin clicks 'Activate' and start_date is in the future
THEN challenge.status transitions to 'scheduled' (auto-activates on start_date)

GIVEN an Active challenge
WHEN admin clicks 'Deactivate'
THEN challenge.is_active=false; no new progress is recorded
AND existing UserChallengeProgress records remain; already-credited rewards are NOT reversed
AND users receive a push notification 'انتهى التحدي مبكراً'

GIVEN admin attempts to delete an Active challenge
WHEN they submit the deletion request
THEN the system rejects with 'Active challenges cannot be deleted — deactivate first'
```

**Data Requirements:**

- **Entities Involved:** Challenge (OBJ-004)  
- **Key Fields:** id, type (enum: streak/rotating/community/onboarding), name\_ar, name\_en, metric (enum: transaction\_count/unique\_days/specific\_category/referral\_made/draw\_results\_viewed), target\_value, category\_filter (nullable), scope (enum: individual/city/national), start\_date, end\_date, reward\_entries, reward\_cash\_iqd (nullable), reward\_badge (nullable), checkpoints (JSON array: \[{at: int, reward\_entries: int}\]), is\_active, created\_by  
- **Validation Rules:** name\_ar: required, max 120 chars; target\_value: positive integer; end\_date \> start\_date; reward\_entries ≥ 0; checkpoints: at values must be \< target\_value and in ascending order

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/challenges | Create challenge |
| GET | /api/v1/admin/challenges | List with status filter |
| GET | /api/v1/admin/challenges/{id} | Challenge detail |
| PUT | /api/v1/admin/challenges/{id} | Update (Draft only; limited fields for Active) |
| DELETE | /api/v1/admin/challenges/{id} | Soft-delete (Draft only) |
| POST | /api/v1/admin/challenges/{id}/activate | Activate challenge |
| POST | /api/v1/admin/challenges/{id}/deactivate | Deactivate active challenge |

**Business Rules:**

1. Only one 'Weekly Spark' (streak-type) challenge active at a time.  
2. Onboarding challenges cannot be created via this interface — they are seeded at system initialization and updated via config.  
3. Challenge reward\_entries and reward\_cash\_iqd are configurable and stored in the Challenge record — not hard-coded.

**Dependencies:** Depends on: FEAT-033 Blocks: FEAT-013, FEAT-014, FEAT-015

**UI Screens (Expected):**

- Challenge Calendar Screen, Create/Edit Challenge Form, Challenge Preview Modal

---

### FEAT-013: Onboarding Challenge Set

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-013 |
| Module | MOD-003 — Challenge System |
| Priority | MUST-HAVE |
| Source | Section III (ROLE-002 tier: Onboarding Consumer), Section VII (Usage Limits: lifetime\_tx ≤ 10), Section IV journey ROLE-002 |
| Confidence | HIGH |

**User Story:** As a ROLE-002 (New/Onboarding Consumer), I want to complete 4 guided onboarding challenges so that I earn 325 bonus entries, the Fawz Explorer badge, and learn how Fawz works through action.

**Description:** When a user account is created or first enters Fawz with lifetime\_tx \= 0, the system auto-activates 4 onboarding challenges: (1) 'أول رقم فوز' — first qualifying transaction → \+50 entries; (2) 'أول أسبوع' — 5 qualifying transactions in 7 days → \+100 entries; (3) 'ادعي صاحبك' — generate and share a referral link → badge; (4) 'شوف النتائج' — view draw results → \+25 entries. Completing all 4 awards the 'Fawz Explorer' badge and \+150 completion bonus. User transitions to ROLE-001 when lifetime\_tx \> 10 (system-managed flag).

**Acceptance Criteria:**

```
GIVEN a new SuperQi user who opens the Fawz tab for the first time
WHEN lifetime_tx = 0
THEN the 4 onboarding challenges are activated and shown in the Fawz tab
AND a welcome screen explains each challenge in Iraqi Arabic dialect

GIVEN a new user who completes their first qualifying transaction
WHEN 'أول رقم فوز' challenge metric fires
THEN challenge status = Completed; +50 entries credited
AND a confetti animation fires with '🎯 أنجزت أول تحديك!'

GIVEN a user in ROLE-002 who attempts to access rotating monthly challenges
WHEN they tap the rotating challenge card
THEN they see 'أكمل تحدياتك كمبتدئ أولاً!' (Complete your onboarding challenges first!)
AND onboarding challenges are highlighted

GIVEN a user who completes all 4 onboarding challenges
WHEN the final completion fires
THEN total +325 entries are verified in entry history
AND 'Fawz Explorer' badge appears in user profile
AND user.is_new flag = false (transitions to Standard Consumer)
```

**Data Requirements:**

- **Entities Involved:** Challenge (OBJ-004), UserChallengeProgress (OBJ-005), ConsumerUser (OBJ-010), FawzEntry (OBJ-001)  
- **Key Fields:** UserChallengeProgress: user\_id, challenge\_id, current\_value, checkpoints\_claimed, completed, completed\_at; ConsumerUser: is\_new (bool), lifetime\_tx (int), fawz\_explorer\_badge (bool)  
- **Validation Rules:** Onboarding challenges only visible/active when ConsumerUser.is\_new=true; challenge set auto-activates on Fawz tab first open

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/challenges/onboarding | Get onboarding challenge set with user's progress |
| POST | /api/v1/internal/challenges/onboarding/progress | System: update onboarding challenge progress |

**Business Rules:**

1. Onboarding challenges are never shown to users with lifetime\_tx \> 10\.  
2. The 4 challenge reward values (50, 100, 0, 25, 150 completion bonus) are configurable admin parameters.  
3. Referral link generation (challenge 3\) is tracked by the referral system — challenge progress is updated via cross-module event hook.

**Dependencies:** Depends on: FEAT-001 (transaction hook), FEAT-012 (challenge config), FEAT-017 (referral link event hook)

**UI Screens (Expected):**

- Onboarding Challenge Cards (within Fawz Tab Home Screen), Onboarding Welcome Screen

---

### FEAT-014: Weekly Spark Streak Challenge

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-014 |
| Module | MOD-003 — Challenge System |
| Priority | MUST-HAVE |
| Source | Section VI-C (Challenge Progress Workflow, Step 6 — Weekly Spark deduplication), Section 21 (once per calendar month), Section VII |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to earn 250 bonus entries by transacting on ≥5 unique days in a calendar week so that I have a weekly reason to maintain digital payment habits.

**Description:** The Weekly Spark challenge tracks the count of unique calendar days (UTC+3 boundary) within a calendar week on which the user makes ≥1 qualifying transaction. On reaching 5 unique days, 250 bonus entries are awarded — once per calendar month, enforced by ConsumerUser.weekly\_spark\_earned\_month. The day counter resets every Sunday midnight UTC+3. Progress is shown as a 7-day pill row with filled/unfilled day indicators.

**Acceptance Criteria:**

```
GIVEN a consumer who has transacted on Monday, Tuesday, and Wednesday this week
WHEN they make a qualifying transaction on Thursday
THEN their unique_days_this_week count increments to 4
AND the Fawz tab shows 4/5 days filled in the Weekly Spark progress bar

GIVEN a consumer who has completed Weekly Spark once already this calendar month
WHEN they reach 5 unique transaction days in the same month's second week
THEN progress bar shows 5/5 completed but reward is NOT credited
AND UI shows 'رائع! يمكنك ربح شرارة الأسبوع مرة واحدة بالشهر' (Great! Weekly Spark earnable once per month)

GIVEN weekly reset fires at Sunday midnight UTC+3
WHEN the reset job runs
THEN ConsumerUser.weekly_unique_days resets to 0 for all users
AND the next week's Weekly Spark challenge window opens fresh

GIVEN a consumer who makes 3 qualifying transactions on the same Monday
WHEN unique day tracking evaluates
THEN unique_days_this_week increments by exactly 1 (idempotent — same day)
```

**Data Requirements:**

- **Entities Involved:** Challenge (OBJ-004), UserChallengeProgress (OBJ-005), ConsumerUser (OBJ-010)  
- **Key Fields:** ConsumerUser.weekly\_unique\_days (int), ConsumerUser.weekly\_spark\_earned\_month (YYYY-MM string), ConsumerUser.last\_active\_date  
- **Validation Rules:** weekly\_spark\_earned\_month check: if current month matches, do not award; unique days: increment only once per calendar day per user; weekly reset: every Sunday midnight UTC+3

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/challenges/weekly-spark | User's current Weekly Spark progress |
| POST | /api/v1/internal/challenges/weekly-spark/reset | System: Sunday midnight weekly reset |

**Business Rules:**

1. Weekly Spark reward (250 entries) is a configurable admin parameter.  
2. The monthly deduplication guard is enforced server-side — never client-side.

**Dependencies:** Depends on: FEAT-001 (transaction hook fires unique-day increment), FEAT-012

**UI Screens (Expected):**

- Weekly Spark Progress Component (within Fawz Tab, 7-day pill row)

---

### FEAT-015: Monthly Rotating Challenge

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-015 |
| Module | MOD-003 — Challenge System |
| Priority | MUST-HAVE |
| Source | Section IV journey ROLE-001, Section VII-B (WF-S-001), Section XV (UX — seasonal freshness) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to see a new challenge theme each month with fresh targets and rewards so that Fawz remains engaging and doesn't feel repetitive.

**Description:** Monthly rotating challenges are created by admin (FEAT-012) and activated on a monthly cadence. They may target specific transaction categories (e.g., fuel payments, grocery purchases), transaction count thresholds, or special event spending windows (e.g., Eid spending burst). Checkpoints provide progressive reward moments within the challenge. Announced on Fawz Night (1st of month grand draw broadcast). A user's progress toward the monthly rotating challenge is visible in the Fawz tab.

**Acceptance Criteria:**

```
GIVEN an active monthly rotating challenge 'ادفع وقود 5 مرات هذا الشهر' with target=5, category_filter=fuel, reward_entries=200
WHEN a consumer makes a qualifying fuel purchase via SuperQi
THEN challenge progress increments by 1 (category_filter matches)
AND progress bar in Fawz tab shows updated count

GIVEN a consumer who makes 3 grocery purchases during a 'fuel' challenge month
WHEN progress evaluation fires
THEN grocery purchases do NOT increment the fuel challenge counter (category_filter mismatch)

GIVEN a monthly rotating challenge with checkpoint at 3/5 (reward: +50 entries)
WHEN a consumer reaches 3 qualifying transactions in the category
THEN checkpoint reward of +50 entries is immediately credited
AND a push notification '🎯 وصلت نقطة تفتيش! +50 رقم فوز' is sent

GIVEN a rotating challenge whose end_date has passed
WHEN any user checks their progress
THEN the challenge shows 'انتهى التحدي' (Challenge Ended) with final outcome
AND no new progress is recorded
```

**Data Requirements:**

- **Entities Involved:** Challenge (OBJ-004), UserChallengeProgress (OBJ-005)  
- **Key Fields:** Challenge.category\_filter (nullable — maps to SuperQi transaction category codes), Challenge.checkpoints (JSON)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/challenges/current | Active challenges for authenticated user |
| GET | /api/v1/challenges/{id}/progress | User's progress on a specific challenge |

**Business Rules:**

1. Category filter maps to SuperQi merchant category codes (MCC equivalents). The mapping must be configured in the admin system config panel.  
2. At most 1 rotating challenge active per month. Multiple rotating challenges per month require admin confirmation override.

**Dependencies:** Depends on: FEAT-001, FEAT-012

**UI Screens (Expected):**

- Monthly Challenge Card (within Fawz Tab), Challenge Detail Screen (progress bar, checkpoints, countdown)

---

### FEAT-016: Challenge Progress View

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-016 |
| Module | MOD-003 — Challenge System |
| Priority | MUST-HAVE |
| Source | Section XV (UX: complexity hidden behind progress bars), Section VII |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to see all my active challenges and my progress toward each one without needing to understand the underlying rules so that Fawz engagement feels intuitive and motivating.

**Description:** A consolidated view of all challenges the user has an active UserChallengeProgress record for, showing visual progress bars, checkpoint status, reward amounts, and time remaining. Completed challenges show the final outcome and reward received. The view uses progressive disclosure — the tap-to-expand interaction reveals challenge rules; top-level view shows only progress bars and remaining targets.

**Acceptance Criteria:**

```
GIVEN a consumer with 3 active challenges (Weekly Spark, rotating monthly, onboarding #2)
WHEN they open the Challenges screen
THEN they see 3 challenge cards, each with a progress bar, remaining target, and reward
AND the most time-sensitive challenge (fewest days remaining) is shown first

GIVEN a consumer who has completed 'أول رقم فوز' onboarding challenge
WHEN they view challenges
THEN the completed challenge shows a green checkmark, 'أنجزت!' label, and '+50 أرقام فوز'
AND it appears in a 'Completed' section below active challenges

GIVEN a challenge with a checkpoint the user has not yet claimed
WHEN the progress bar crosses the checkpoint threshold
THEN a pulsing indicator on the checkpoint marker alerts the user
AND tapping it shows the checkpoint reward amount
```

**Data Requirements:**

- **Entities Involved:** Challenge (OBJ-004), UserChallengeProgress (OBJ-005)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/challenges | All challenges for user (active \+ completed, paginated) |

**Dependencies:** Depends on: FEAT-013, FEAT-014, FEAT-015

**UI Screens (Expected):**

- Challenges Screen (tab within Fawz Tab), Challenge Detail Screen

---

### FEAT-017: Golden Ticket Referral Link Generation

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-017 |
| Module | MOD-004 — Referral System |
| Priority | MUST-HAVE |
| Source | Section VI-E (WF-P-005: Referral Attribution & Reward), Section 21 |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to generate and share a unique referral link so that I earn bonus entries and cash when friends activate SuperQi via my link.

**Description:** Every consumer has a unique referral code (qi.iq/fawz/{unique\_code}) with a 30-day rolling expiry. The referral section in the Fawz tab displays: the link, a copy button, a WhatsApp pre-populated share button, a count of successful referrals this month, and earnings to date. New links generate automatically if the previous link has expired.

**Acceptance Criteria:**

```
GIVEN a consumer opening the referral section for the first time
WHEN no referral code exists for this user
THEN a unique code is generated (ULID-based, URL-safe)
AND displayed as qi.iq/fawz/{code} with 30-day expiry date shown

GIVEN a consumer whose referral link has expired (> 30 days old)
WHEN they open the referral section
THEN a fresh referral link is generated with a new 30-day expiry
AND old link attribution (any pending referrals from old link) is preserved for 30 days post-expiry

GIVEN a consumer who has 8 successful referrals this month
WHEN they view the referral section
THEN they see '8 إحالات ناجحة هذا الشهر — 🎯 الحد الموصى به 10'
AND a soft warning that more than 10 referrals in a month triggers review

GIVEN a consumer sharing via WhatsApp
WHEN they tap the WhatsApp share button
THEN WhatsApp opens with pre-populated message: 'استخدم سوبر كي وفوز معي! اشترك من هنا: qi.iq/fawz/{code}'
```

**Data Requirements:**

- **Entities Involved:** Referral (OBJ-007), ConsumerUser (OBJ-010)  
- **Key Fields:** ConsumerUser.referral\_code (VARCHAR 12, unique), ConsumerUser.referral\_link\_expiry (datetime), ConsumerUser.referral\_count\_month (int); Referral.referral\_code, Referral.status  
- **Validation Rules:** referral\_code: unique across all users; expiry: 30 days from generation (configurable); referral\_code auto-renewed on expiry

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/referrals/my-link | Get or generate current referral link and stats |
| POST | /api/v1/referrals/generate | Force-generate new link (if expired) |

**Business Rules:**

1. Link expiry period (default 30 days) is a configurable admin parameter.  
2. A consumer cannot refer themselves — same account ID check blocks self-referral at attribution stage.

**Dependencies:** Depends on: FEAT-042 (Fawz Tab — referral section), FEAT-013 (referral link generation triggers onboarding challenge 3\) Blocks: FEAT-018

**UI Screens (Expected):**

- Referral Section (within Fawz Tab), Share Sheet integration

---

### FEAT-018: Referral Attribution & Click Tracking

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-018 |
| Module | MOD-004 — Referral System |
| Priority | MUST-HAVE |
| Source | Section VI-E Steps 2–3, Section IX (reversibility: Referral Pending — auto-cancel on expiry) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to attribute a referral click to the correct referrer and track the referred user's journey so that rewards are credited accurately and fraud can be detected.

**Description:** When a new user clicks a referral link, the system creates a Referral record with status='pending', records first-click attribution (subsequent clicks from the same new user to different referral links are ignored), and tracks the new user's progress to their first qualifying transaction. Attribution is stored in a cookie/deep-link parameter that persists through the SuperQi account creation flow.

**Acceptance Criteria:**

```
GIVEN a new user clicks referral link qi.iq/fawz/ABC123
WHEN the link is clicked
THEN a Referral record is created: referrer_id=[owner of ABC123], referred_id=null (pending KYC), referral_code=ABC123, status='pending', clicked_at=now()

GIVEN the same new user clicks a second different referral link qi.iq/fawz/XYZ789 before completing KYC
WHEN the second click is processed
THEN the first attribution (ABC123) is preserved — first-click wins
AND the second click is logged but does not override

GIVEN a referral link older than 30 days
WHEN a new user clicks the expired link
THEN status is set to 'expired' immediately
AND the new user sees: 'هذا الرابط انتهى — احصل على رابط جديد من صاحبك'
AND no Referral record is created with status='pending'

GIVEN a Referral in 'pending' status where the referred user has not made a qualifying tx within 30 days of click
WHEN the referral link expiry window passes
THEN Referral.status transitions to 'expired'
AND no rewards are issued to referrer or referred user
```

**Data Requirements:**

- **Entities Involved:** Referral (OBJ-007), ConsumerUser (OBJ-010)  
- **Key Fields:** Referral: id, referrer\_id, referred\_user\_id (nullable until KYC), referral\_code, referral\_type='consumer\_to\_consumer', status, clicked\_at, qualified\_at, created\_at  
- **Validation Rules:** First-click attribution only; link expiry checked at click time; referred\_user cannot be an existing SuperQi account with prior transactions (validated at qualification step)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/referrals/click | Record referral link click (unauthenticated — new user) |
| GET | /api/v1/referrals/{id}/status | Check referral status |

**Dependencies:** Depends on: FEAT-017 Blocks: FEAT-019

**UI Screens (Expected):**

- Referral landing page (mobile deep link redirect)

---

### FEAT-019: Referral Fraud Validation & Reward Processing

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-019 |
| Module | MOD-004 — Referral System |
| Priority | MUST-HAVE |
| Source | Section VI-E Steps 5–7, Section XIII (fraud: referral farming), Section 21 (referral\_count\_month \> 10 threshold) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to validate referral eligibility against 4 fraud checks and credit rewards only to genuine new user activations so that the referral programme is not gamed.

**Description:** When a referred user makes their first qualifying transaction ≥ 5,000 IQD, the system runs 4 fraud validation checks: (1) new user has no prior Fawz entries and no SuperQi transactions in last 180 days; (2) different Qi Card from referrer; (3) different device fingerprint from referrer; (4) qualifying transaction type. If all pass: referrer receives \+50 entries \+ 5,000 IQD; referred user receives \+100 entries. If referral\_count\_month \> 10 for the referrer: referral goes to pending\_review, referred user rewards still proceed.

**Acceptance Criteria:**

```
GIVEN a referred user makes their first qualifying tx of 5,000 IQD, 20 days after clicking the referral link
WHEN all 4 fraud checks pass
THEN Referral.status = 'rewarded'
AND referrer credited: +50 FawzEntry records + 5,000 IQD via SuperQi Wallet API
AND referred user credited: +100 FawzEntry records
AND referrer.referral_count_month incremented

GIVEN the referred user's Qi Card is identical to the referrer's Qi Card
WHEN fraud check 2 fires
THEN Referral.status = 'rejected'
AND referrer receives no reward
AND referred user receives no reward (self-referral blocked completely)

GIVEN a referrer who has already made 10 successful referrals this month
WHEN an 11th referral qualifies
THEN referred user receives +100 entries (reward proceeds)
AND referrer reward is held: status='pending_review'
AND FraudReviewCase opened for manual review within 48-hour SLA

GIVEN a referred user's first qualifying transaction is 4,500 IQD (below 5,000 IQD threshold)
WHEN the transaction fires
THEN regular Fawz entries are generated (1,000 IQD+ threshold met)
AND referral reward does NOT trigger (5,000 IQD threshold not met)
AND Referral remains in 'pending' status awaiting a qualifying ≥ 5,000 IQD transaction
```

**Data Requirements:**

- **Entities Involved:** Referral (OBJ-007), ConsumerUser (OBJ-010), FawzEntry (OBJ-001), PrizePayout (OBJ-012), FraudReviewCase (OBJ-013)  
- **Key Fields:** ConsumerUser.device\_fingerprint, ConsumerUser.qi\_card\_number (hashed), ConsumerUser.referral\_count\_month; Referral: qualifying\_tx\_id, referrer\_reward\_entries=50, referrer\_reward\_cash\_iqd=5000, referred\_reward\_entries=100  
- **Validation Rules:** referred\_user: no SuperQi tx in last 180 days (configurable lookback); different qi\_card\_number hash; different device\_fingerprint hash; transaction type: NOT P2P/ATM; amount ≥ 5,000 IQD (configurable)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/referrals/validate-and-reward | System: triggered by qualifying transaction event |

**Business Rules:**

1. All reward amounts (referrer entries, referrer cash, referred entries), the fraud lookback period (180 days), and the fraud flag threshold (10/month) are configurable admin parameters.  
2. Referred user rewards always proceed regardless of referrer fraud status — to protect innocent referred users.  
3. The 5,000 IQD qualifying transaction threshold for referral rewards is separate from (and higher than) the 1,000 IQD entry generation threshold.

**Dependencies:** Depends on: FEAT-001, FEAT-018, FEAT-027 (fraud case creation)

**UI Screens (Expected):**

- Referral reward notification (push), Referral History Screen (FEAT-020)

---

### FEAT-020: Referral History View

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-020 |
| Module | MOD-004 — Referral System |
| Priority | MUST-HAVE |
| Source | Section III (ROLE-005 can\_read: own referral history), Section IV (ROLE-005 journey) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to see a history of all referrals I've sent and received rewards for so that I can track my referral performance and know when friends have activated.

**Description:** A list of Referral records where the authenticated user is the referrer, showing referred user (partial name/phone), referral date, status, and reward received. Aggregate stats at top: total referrals this month, total entries earned from referrals, total cash earned from referrals.

**Acceptance Criteria:**

```
GIVEN a referrer who has made 3 successful referrals and 2 pending
WHEN they view Referral History
THEN they see 5 referral entries with statuses and rewards shown
AND aggregate: '3 إحالات ناجحة هذا الشهر | +150 أرقام فوز | +15,000 IQD'

GIVEN a referral in 'pending_review' status
WHEN the referrer views it
THEN they see status 'قيد المراجعة' with no reward shown yet
AND a note 'سيتم مراجعة هذه الإحالة خلال 48 ساعة'
```

**Data Requirements:**

- **Entities Involved:** Referral (OBJ-007)  
- **Key Fields:** Referral: referred\_user\_id (partial display only), status, qualified\_at, referrer\_reward\_entries, referrer\_reward\_cash\_iqd  
- **Validation Rules:** Only referrer's own referrals shown (server-side filter on referrer\_id)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/referrals/my-history | Paginated referral history for authenticated user |
| GET | /api/v1/referrals/my-stats | Aggregate referral stats for current month |

**Dependencies:** Depends on: FEAT-019

**UI Screens (Expected):**

- Referral History Screen (within Fawz Tab referral section)

---

### FEAT-021: Merchant Eligibility Engine (Nightly Batch)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-021 |
| Module | MOD-005 — Merchant Management |
| Priority | MUST-HAVE |
| Source | Section VI-B (WF-S-003: Merchant Eligibility Refresh), Section III (Qualifying Small Merchant role), Section 21 |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to recalculate merchant eligibility nightly so that the shared-entry system always reflects each merchant's current transaction profile.

**Description:** A nightly batch (2:00 AM UTC+3) recalculates for each SuperQi POS merchant: rolling 30-day receiving volume (IQD) and count of unique customer transactions per month. Updates Merchant.is\_eligible flag. Merchants that fall above the 50M IQD ceiling are ineligible prospectively — no retroactive entry clawback. New merchant eligibility takes effect on the next transaction processed.

**Acceptance Criteria:**

```
GIVEN a merchant with 45M IQD rolling 30-day volume and 25 unique customer tx this month
WHEN the nightly eligibility batch runs
THEN Merchant.is_eligible=true, eligible for shared entries tomorrow

GIVEN a merchant who was eligible last night but crossed 50M IQD volume today
WHEN the nightly batch runs
THEN Merchant.is_eligible=false
AND all entries generated BEFORE this batch run remain valid (no retroactive clawback)
AND entries generated AFTER this batch run are NOT created for this merchant

GIVEN a merchant with 12 unique customer tx but 0 receiving volume
WHEN the batch runs
THEN Merchant.is_eligible=false (volume = 0 fails eligibility even if tx count passes)

GIVEN the nightly batch encounters a database timeout on 10% of merchants
WHEN the batch resumes
THEN it retries only the failed merchants (idempotent — already-processed merchants skipped)
AND an alert is sent to the admin team
```

**Data Requirements:**

- **Entities Involved:** Merchant (OBJ-011)  
- **Key Fields:** Merchant: monthly\_receiving\_volume\_iqd (rolling 30-day), unique\_customer\_tx\_month (rolling 30-day unique customer count), is\_eligible (bool), eligibility\_last\_updated\_at  
- **Validation Rules:** Volume ceiling: \< 50,000,000 IQD (configurable); activity floor: ≥ 10 unique customer tx (configurable); both conditions must be met; self-transactions excluded (merchant\_id \= customer\_id check)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/merchants/refresh-eligibility | System: nightly batch trigger |
| GET | /api/v1/admin/merchants/eligibility-summary | Admin: summary of eligible/ineligible merchant counts |

**Business Rules:**

1. Volume ceiling (50M IQD) and activity floor (10 unique tx) are configurable admin parameters.  
2. Eligibility cache is read by FEAT-001 at entry generation time — cache TTL \= 24 hours.

**Dependencies:** Depends on: FEAT-001 (reads eligibility cache)

**UI Screens (Expected):**

- Admin Merchant Eligibility Dashboard

---

### FEAT-022: Merchant Shared Entry View

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-022 |
| Module | MOD-005 — Merchant Management |
| Priority | MUST-HAVE |
| Source | Section III (ROLE-003 journey steps 4–6), Section VII-B (WF-S-003) |
| Confidence | HIGH |

**User Story:** As a ROLE-003 (Qualifying Small Merchant), I want to see the Fawz Numbers I've earned from customer transactions so that I can verify my participation and check my draw results.

**Description:** Merchant-facing view of shared FawzEntry records (owner\_type='merchant'), showing each entry's number, the draw it's assigned to, and prize outcome. Aggregate count for current draw week. Merchant also sees their prize history from DrawWinner records. The merchant sees which customer transactions generated entries (customer identity is not shown — only transaction date, amount range, and number count).

**Acceptance Criteria:**

```
GIVEN an eligible merchant who processed 50 qualifying customer transactions this week
WHEN they open their Fawz merchant section
THEN they see 'X أرقام فوز هذا الأسبوع من معاملات زبائنك'
AND a list of their shared entry numbers

GIVEN a merchant who won Last-3 from a shared entry
WHEN they view their prize history
THEN they see: draw date, prize tier, prize amount, payout status 'مدفوع'
AND prize credited to their SuperQi wallet
```

**Data Requirements:**

- **Entities Involved:** FawzEntry (OBJ-001), DrawWinner (OBJ-003), Merchant (OBJ-011)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/merchant/entries | Merchant's shared entries, paginated |
| GET | /api/v1/merchant/entries/summary | Entry count for current draw period |
| GET | /api/v1/merchant/prizes | Merchant's prize win history |

**Dependencies:** Depends on: FEAT-001, FEAT-021

**UI Screens (Expected):**

- Merchant Fawz Section (within SuperQi merchant app), Merchant Prize History Screen

---

### FEAT-023: Prize Wallet Credit Execution

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-023 |
| Module | MOD-006 — Prize & Payout Management |
| Priority | MUST-HAVE |
| Source | Section VI-B Step 9, Section IX (reversibility: PrizePayout Credited \= irreversible), Section XV (95% within 60 seconds) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to credit prizes to winners' SuperQi wallets within 60 seconds of draw finalization so that winners experience immediate gratification.

**Description:** Post draw finalization, the system iterates all DrawWinner records with payout\_status='staged', groups by owner\_id to apply per-draw payout caps, calls the SuperQi Wallet API for each creditable winner, updates PrizePayout.payout\_status to 'Credited' on success, and triggers winner notifications. Winners exceeding the per-draw cap are credited up to the cap with excess held. High-value winners (\> 5M IQD) are held pending compliance review before credit.

**Acceptance Criteria:**

```
GIVEN 433,000 DrawWinner records after draw finalization
WHEN prize credit execution runs
THEN 95% of prizes are credited to SuperQi wallets within 60 seconds
AND 99% are credited within 5 minutes
AND PrizePayout.payout_status updated to 'Credited' for each successful credit

GIVEN the SuperQi Wallet API returns an error for 500 winners mid-batch
WHEN the batch continues
THEN already-credited winners are NOT double-credited (idempotent on PrizePayout.id)
AND failed credits are queued for retry (exponential backoff, max 3 retries)
AND failed credits after 3 retries trigger admin alert for manual resolution

GIVEN a prize amount of 8,000,000 IQD for monthly draw (exceeds 5M IQD cap)
WHEN payout processing evaluates this winner
THEN PrizePayout is created with status='held_compliance_review'
AND a FraudReviewCase is opened automatically
AND the winner receives notification 'تهانينا! جائزتك تخضع للمراجعة وستُحوَّل خلال 24 ساعة'
```

**Data Requirements:**

- **Entities Involved:** PrizePayout (OBJ-012), DrawWinner (OBJ-003), ConsumerUser (OBJ-010), Merchant (OBJ-011)  
- **Key Fields:** PrizePayout: id, draw\_winner\_id, owner\_id, owner\_type, amount\_iqd, payout\_status, credited\_at, held\_reason; DrawWinner.payout\_status  
- **Validation Rules:** Idempotency key \= PrizePayout.id; weekly cap 1M IQD per owner\_id; monthly cap 5M IQD per owner\_id; high-value hold threshold: \> 5M IQD (configurable)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/payouts/execute | System: batch payout execution post-finalization |
| GET | /api/v1/admin/payouts/{draw\_id} | Admin: payout status for a draw |
| POST | /api/v1/admin/payouts/{id}/retry | Admin: manual retry for failed payout |

**Business Rules:**

1. All prize caps (weekly 1M IQD, monthly 5M IQD, compliance review threshold 5M IQD) are configurable admin parameters.  
2. Prize credits are idempotent — duplicate credit attempts for the same PrizePayout.id are silently deduplicated by the Wallet API integration layer.  
3. Once credited, PrizePayout.payout\_status is immutable — disputes handled via a new FraudReviewCase, not by modifying the payout record.

**Dependencies:** Depends on: FEAT-010 Blocks: FEAT-038 (winner notifications triggered after successful credit), FEAT-026 (high-value hold triggers)

**UI Screens (Expected):**

- Prize crediting is background process — triggers push notification (FEAT-038)

---

### FEAT-024: Jackpot Rollover Management

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-024 |
| Module | MOD-006 — Prize & Payout Management |
| Priority | MUST-HAVE |
| Source | Section 21 (jackpot rollover cap 300M IQD), Section VI-B Step 11 |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to manage jackpot rollover state so that unclaimed jackpots accumulate across draws and are redistributed when the cap is reached.

**Description:** After each draw finalization, if no 10-digit match was found, the jackpot amount (last\_10\_jackpot\_iqd from prize config) rolls over to the next draw of the same type by incrementing Draw.jackpot\_rollover\_iqd. Monthly draws have a separate rollover from weekly draws. When monthly jackpot\_rollover\_iqd ≥ 300M IQD cap, the excess is redistributed as additional Last-5 prizes in the next monthly draw.

**Acceptance Criteria:**

```
GIVEN a weekly draw where no entry matches all 10 digits
WHEN draw finalization completes
THEN Draw.jackpot_claimed=false
AND the next scheduled weekly Draw.jackpot_rollover_iqd += this_draw.last_10_jackpot_iqd
AND admin dashboard displays the growing jackpot amount

GIVEN a monthly draw where jackpot_rollover_iqd reaches 320,000,000 IQD (above 300M cap)
WHEN post-draw jackpot check runs
THEN 300M IQD is the stated jackpot for the next draw
AND 20M IQD excess is converted to additional Last-5 prizes in the prize config
AND admin is notified via dashboard alert

GIVEN a jackpot draw where 3 entries all match 10 digits
WHEN payout execution runs
THEN jackpot is split equally among 3 matching entries
AND each receives jackpot_rollover_iqd / 3 IQD
AND Draw.jackpot_claimed=true; jackpot_rollover_iqd resets to 0 for next draw
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002)  
- **Key Fields:** Draw.jackpot\_claimed (bool), Draw.jackpot\_rollover\_iqd (BIGINT)  
- **Validation Rules:** Monthly jackpot cap: 300,000,000 IQD (configurable)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/draws/current-jackpot | Current jackpot amounts (weekly and monthly) — public |
| POST | /api/v1/internal/draws/{id}/rollover | System: post-draw jackpot rollover calculation |

**Dependencies:** Depends on: FEAT-010, FEAT-023

**UI Screens (Expected):**

- Jackpot counter on Fawz Tab Home Screen (live updating)

---

### FEAT-025: Prize & Win History View

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-025 |
| Module | MOD-006 — Prize & Payout Management |
| Priority | MUST-HAVE |
| Source | Section III (Consumer and Merchant can\_read: own prize win history) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to view all my prizes won across all draws so that I can track my lifetime winnings and verify each credit.

**Description:** A chronological list of DrawWinner records for the authenticated user, showing draw date, prize tier, prize amount, and payout status. Total lifetime winnings shown at top. For merchants, their shared-entry prize wins appear in a separate merchant-scoped view.

**Acceptance Criteria:**

```
GIVEN a consumer who has won Last-3 prizes in 4 separate draws
WHEN they open Prize History
THEN they see 4 prize records with draw dates, 'Last-3', amounts, and status 'مدفوع'
AND total lifetime winnings displayed at top: '40,000 IQD إجمالي أرباحك'

GIVEN a consumer whose prize is in 'held_compliance_review' status
WHEN they view that prize
THEN they see status 'قيد المراجعة' and 'سيتم التواصل معك خلال 24 ساعة'
```

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/prizes/my-wins | Consumer: own prize win history |
| GET | /api/v1/merchant/prizes | Merchant: own prize win history |

**Dependencies:** Depends on: FEAT-010, FEAT-023

**UI Screens (Expected):**

- Prize History Screen

---

### FEAT-026: High-Value Winner Hold & Compliance Review

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-026 |
| Module | MOD-006 — Prize & Payout Management |
| Priority | MUST-HAVE |
| Source | Section VII (WF-E-002: High-Value Winner Review), Section XIV (CBI reporting), Section XIII (identity verification) |
| Confidence | HIGH |

**User Story:** As a ROLE-008 (Finance/Compliance Reviewer), I want to review and verify high-value winner identities before prize disbursement so that Fawz maintains CBI compliance and prevents prize fraud.

**Description:** Winners whose prize exceeds the compliance review threshold (default 5,000,000 IQD) are automatically held in status='held\_compliance\_review' and a FraudReviewCase is created. A Finance/Compliance Reviewer contacts the winner within 24 hours, verifies identity against SuperQi KYC records, and either releases the prize or escalates. Communication logs are maintained in the case record.

**Acceptance Criteria:**

```
GIVEN a DrawWinner with prize_iqd=7,500,000 IQD
WHEN payout execution evaluates this winner
THEN PrizePayout.status='held_compliance_review'
AND FraudReviewCase.flag_type='high_value_winner' is created automatically
AND the case appears in the Finance/Compliance reviewer queue

GIVEN a reviewer verifies the winner's identity successfully
WHEN they click 'أطلق الجائزة' (Release Prize)
THEN PrizePayout.status transitions to 'Pending' → 'Credited'
AND SuperQi Wallet API credit executes
AND winner receives 'تهانينا! تم تحويل جائزتك'

GIVEN reviewer cannot verify identity within 24-hour SLA
WHEN SLA breach occurs
THEN ROLE-007 admin receives escalation alert
AND case is flagged 'SLA Breached' in the review queue
```

**Data Requirements:**

- **Entities Involved:** PrizePayout (OBJ-012), FraudReviewCase (OBJ-013), DrawWinner (OBJ-003)  
- **Key Fields:** FraudReviewCase: flag\_type='high\_value\_winner', reviewer\_id, decision, reasoning\_notes, reviewed\_at; PrizePayout: held\_reason, payout\_status  
- **Validation Rules:** Hold threshold: 5,000,000 IQD (configurable); 24-hour SLA alert

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/compliance/high-value-queue | List high-value winner holds |
| POST | /api/v1/admin/compliance/payouts/{id}/release | Release held prize |
| POST | /api/v1/admin/compliance/payouts/{id}/reject | Reject held prize |

**Dependencies:** Depends on: FEAT-023, FEAT-028

**UI Screens (Expected):**

- High-Value Winner Review Queue (within Admin Compliance panel)

---

### FEAT-027: Automated Fraud Flagging (Rules Engine)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-027 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section XIII (abuse scenarios \+ fraud scenarios), Section VII (abuse\_prevention), Section XII (AI intent: Phase 1 rules-based only) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to automatically flag suspicious patterns using configurable rules so that the fraud review team is alerted to high-risk accounts without manual monitoring.

**Description:** A rules engine evaluates events against configurable fraud rules and opens FraudReviewCase records when thresholds are exceeded. Phase 1 rules: (1) referral\_count\_month \> 10; (2) entry velocity anomaly (entries \> N× expected in M hours — configurable); (3) multiple accounts sharing device fingerprint; (4) merchant self-dealing (merchant\_id device/address match with customer). No automated account actions — all flags route to the human review queue.

**Acceptance Criteria:**

```
GIVEN a referrer who has made 11 successful referrals in the current calendar month
WHEN the 11th referral qualifies
THEN a FraudReviewCase is created: flag_type='referral_volume_excess', flagged_account_id=referrer_id
AND the referral goes to status='pending_review'
AND the case appears in the admin fraud review queue

GIVEN a user generating 500 entries in a single hour (anomaly vs. expected ~20/hour baseline)
WHEN the velocity check fires
THEN FraudReviewCase.flag_type='entry_velocity_anomaly'
AND no automated account action (entries continue generating — human decides)

GIVEN 3 consumer accounts sharing the same device fingerprint (hashed IDFA/Android ID)
WHEN the device fingerprint check fires
THEN a FraudReviewCase is created for each account pair
AND the reviewer sees all 3 accounts linked

GIVEN a merchant account transacting with a customer account sharing the same device fingerprint
WHEN the self-dealing check fires
THEN FraudReviewCase.flag_type='merchant_self_dealing'
```

**Data Requirements:**

- **Entities Involved:** FraudReviewCase (OBJ-013), ConsumerUser (OBJ-010), Referral (OBJ-007)  
- **Key Fields:** FraudReviewCase: id, flagged\_account\_id, flag\_type (enum), status='Flagged', flagged\_at, auto\_flag\_rule  
- **Validation Rules:** All fraud thresholds (referral\_count=10, velocity multiplier, device match rules) are configurable admin parameters; one open case per flag\_type per account (deduplication)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/fraud/flag | System: create fraud flag (internal service) |

**Business Rules:**

1. All fraud rules and their thresholds are managed in the Admin System Configuration panel (FEAT-035) — not hard-coded.  
2. No automated account suspension — every flag requires human decision.

**Dependencies:** Depends on: FEAT-019 (referral count), FEAT-001 (entry velocity) Blocks: FEAT-028 (flags populate the queue)

**UI Screens (Expected):**

- None (internal system process); results appear in FEAT-028 queue

---

### FEAT-028: Fraud Review Queue

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-028 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section VII (WF-E-001: Fraud Flag escalation), Section III (ROLE-008 journey) |
| Confidence | HIGH |

**User Story:** As a ROLE-008 (Finance/Compliance Reviewer), I want a prioritized queue of fraud cases with full account context so that I can make efficient, informed decisions within the 48-hour SLA.

**Description:** A paginated, filterable list of FraudReviewCase records assigned to the reviewer, sorted by severity and age. Each case shows: flag type, flagged account summary, referral network graph (for referral cases), entry velocity chart (for velocity cases), linked device accounts, and the available decision actions. Cases approaching the 48-hour SLA display a warning indicator.

**Acceptance Criteria:**

```
GIVEN 25 open fraud cases in the queue
WHEN the reviewer opens the Fraud Review Queue
THEN cases are sorted: SLA-breached first, then by flagged_at ASC (oldest first)
AND each case shows: flag_type, flagged_account name (partial), time since flagged, status

GIVEN a referral volume case for account Abu Ali
WHEN the reviewer taps the case
THEN they see: 11 referrals this month, linked account names (partial), devices used, transaction patterns

GIVEN a case that has been in the queue for 47 hours (1 hour from 48-hour SLA breach)
WHEN displayed in queue
THEN it shows a red 'SLA تنبيه' badge
AND ROLE-007 admin has already received an automated alert
```

**Data Requirements:**

- **Entities Involved:** FraudReviewCase (OBJ-013)  
- **Key Fields:** status (enum: Flagged/Under\_Review/Approved/Rejected/Escalated/Closed), reviewer\_id, flagged\_at, reviewed\_at, decision, reasoning\_notes  
- **Validation Rules:** 48-hour SLA; filter by: flag\_type, status, reviewer\_id; sort: SLA proximity, age

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/fraud/queue | Paginated fraud review queue |
| GET | /api/v1/admin/fraud/cases/{id} | Case detail with full account context |
| POST | /api/v1/admin/fraud/cases/{id}/assign | Assign case to reviewer |

**Dependencies:** Depends on: FEAT-027

**UI Screens (Expected):**

- Fraud Review Queue Screen, Case Detail Screen

---

### FEAT-029: Fraud Case Decision

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-029 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section VII (WF-E-001 Steps 4–5), Section XIII (incident philosophy) |
| Confidence | HIGH |

**User Story:** As a ROLE-008 (Finance/Compliance Reviewer), I want to approve, reject, or escalate a fraud case with mandatory reasoning notes so that every decision is documented and auditable.

**Description:** Three decision actions are available for each open FraudReviewCase: APPROVE (release held referral rewards; clear flag), REJECT (withhold rewards; flag maintained), ESCALATE (refer to compliance for account suspension consideration). All decisions require mandatory reasoning\_notes (min 50 characters). Decision is two-step (review → confirm). All decisions logged in AuditLog and the FraudReviewCase record.

**Acceptance Criteria:**

```
GIVEN a reviewer opening a referral_volume_excess case
WHEN they select APPROVE, enter reasoning notes 'All 11 referred accounts verified as distinct individuals with independent transaction histories', and confirm
THEN Referral records 11+ transition from pending_review to rewarded
AND FraudReviewCase.status = 'Approved', decision='approved', reasoning_notes recorded
AND referrer rewards credited
AND AuditLog records: reviewer_id, case_id, decision, reasoning_notes, timestamp

GIVEN a reviewer attempting to submit a decision with reasoning_notes of 15 characters
WHEN they click confirm
THEN validation rejects: 'يرجى إضافة ملاحظات تفصيلية (50 حرف على الأقل)'

GIVEN a reviewer selecting ESCALATE on a merchant_self_dealing case
WHEN they confirm the escalation
THEN FraudReviewCase.status = 'Escalated'
AND the case is routed to the compliance escalation queue with priority flag
AND ROLE-007 Platform Admin receives escalation notification
```

**Data Requirements:**

- **Entities Involved:** FraudReviewCase (OBJ-013)  
- **Key Fields:** decision (enum: approved/rejected/escalated), reasoning\_notes (TEXT, min 50 chars), reviewed\_at, reviewer\_id  
- **Validation Rules:** reasoning\_notes: required, min 50 chars; two-step confirmation; immutable after decision

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/fraud/cases/{id}/decide | Submit case decision (approve/reject/escalate) |
| GET | /api/v1/admin/fraud/cases/{id}/preview-impact | Preview impact of decision before confirmation |

**Dependencies:** Depends on: FEAT-028

**UI Screens (Expected):**

- Case Decision Panel (within Case Detail Screen), Confirmation Modal

---

### FEAT-030: Account Suspension Management

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-030 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section VII (WF-E-005: Account Suspension Appeal), Section XIII (fraud philosophy: no automated suspension) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to manually suspend and reinstate accounts based on fraud review outcomes so that Fawz can protect prize integrity without automated over-enforcement.

**Description:** Account suspension is a manual-only action executed by ROLE-007 or ROLE-008 following escalation from fraud review. Suspension freezes new entry generation, challenge progress, and referral rewards for the account. Existing entries in active draws are NOT voided. Prize credits already issued are NOT reversed. Suspended accounts receive a notification with support contact information.

**Acceptance Criteria:**

```
GIVEN a fraud case escalated for account suspension
WHEN ROLE-007 admin clicks 'علِّق الحساب' (Suspend Account) on the escalated case and confirms
THEN ConsumerUser.account_status = 'suspended'
AND no new entries are generated for this account from this point forward
AND existing draw entries remain valid (no retroactive clawback)
AND user receives notification: 'حسابك موقوف — تواصل مع الدعم'

GIVEN a suspended user who makes a qualifying transaction
WHEN entry generation evaluates eligibility
THEN account_status='suspended' fails the eligibility gate
AND no entries are generated
AND no notification is sent to user

GIVEN a user who appeals their suspension through support
WHEN ROLE-007 admin reinstates the account
THEN ConsumerUser.account_status = 'active'
AND a reinstatement notification is sent
AND the suspension/reinstatement is logged in AuditLog with admin_id and reasoning_notes
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010), FraudReviewCase (OBJ-013)  
- **Key Fields:** ConsumerUser.account\_status (enum: active/suspended/archived), ConsumerUser.suspended\_at, ConsumerUser.suspended\_by  
- **Validation Rules:** Suspension requires linked FraudReviewCase with status='Escalated'; two-step confirmation; reasoning\_notes required

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/accounts/{id}/suspend | Suspend account |
| POST | /api/v1/admin/accounts/{id}/reinstate | Reinstate suspended account |

**Dependencies:** Depends on: FEAT-029, FEAT-033

**UI Screens (Expected):**

- Account Management Screen (within Admin panel), Suspension Confirmation Modal

---

### FEAT-031: Dispute Submission

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-031 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section XXIII (Disputes: types, resolution workflow, SLA) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to submit a dispute about a missing prize, incorrect entry count, or referral reward so that I can get resolution within a defined SLA.

**Description:** A dispute submission form in the Fawz tab allows consumers and merchants to report: missing prize, incorrect entry count, referral reward not received, retroactive seeding error, merchant shared entry missing, draw result dispute, account suspension dispute, or prize cap hold dispute. Submission creates a FraudReviewCase record of type='dispute' and triggers system auto-checks before routing to human review.

**Acceptance Criteria:**

```
GIVEN a consumer who believes they won but received no prize notification
WHEN they submit a 'Missing Prize' dispute with draw_id and their Fawz Number
THEN a FraudReviewCase is created with flag_type='dispute_missing_prize'
AND system auto-checks: does a DrawWinner record exist for this entry in this draw?
AND if found: status auto-resolved with notification; if not found: routed to ROLE-007 queue

GIVEN a dispute submission missing the required draw_id field
WHEN the consumer submits
THEN validation error: 'يرجى تحديد السحب المتعلق بالشكوى'

GIVEN a dispute where system auto-check resolves in consumer's favor (missing DrawWinner found and corrected)
WHEN auto-resolution fires
THEN consumer notified within 2 hours
AND prize credited if warranted
```

**Data Requirements:**

- **Entities Involved:** FraudReviewCase (OBJ-013)  
- **Key Fields:** FraudReviewCase.flag\_type='dispute\_{type}', submitter\_id, dispute\_description, related\_draw\_id (nullable), related\_entry\_id (nullable)  
- **Validation Rules:** dispute\_type: required, from enum; dispute\_description: max 500 chars; at most 3 open disputes per user per calendar month (anti-spam)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/disputes | Submit dispute |
| GET | /api/v1/disputes/my-history | Consumer's dispute history |

**Dependencies:** Depends on: FEAT-028

**UI Screens (Expected):**

- Dispute Submission Form (within Fawz Tab support section)

---

### FEAT-032: Dispute Resolution (Admin)

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-032 |
| Module | MOD-007 — Fraud & Compliance |
| Priority | MUST-HAVE |
| Source | Section XXIII (Disputes: resolution workflow, SLA, communication) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to review and resolve user disputes within defined SLAs so that users receive timely, fair resolution and Fawz maintains trust.

**Description:** Dispute cases appear in the admin fraud review queue (differentiated from fraud flags by flag\_type prefix 'dispute\_'). Admin reviews the auto-check findings, runs additional checks if needed, and resolves with: APPROVE (take corrective action: credit missing entries, release held prize), REJECT (dispute not valid), or ESCALATE (to Finance/Compliance for high-value cases). SLA: 2 hours for auto-resolved, 24 hours for admin review, 48 hours for Finance/Compliance.

**Acceptance Criteria:**

```
GIVEN an open dispute case 'dispute_incorrect_entry_count' for user who made 10,000 IQD transaction
WHEN admin reviews and confirms 4 entries should have been generated but only 2 were
THEN admin approves correction: 2 additional entries credited retroactively
AND case.status='Closed', resolution documented
AND user notified in plain Arabic dialect

GIVEN a dispute SLA of 24 hours exceeded for an admin-review case
WHEN the SLA breach occurs
THEN ROLE-008 Finance/Compliance Reviewer is automatically escalated the case
AND admin receives a dashboard alert
```

**Data Requirements:**

- **Entities Involved:** FraudReviewCase (OBJ-013)  
- **Key Fields:** resolution\_action (text), corrective\_action\_taken (text), sla\_deadline, sla\_breached (bool)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/disputes/{id}/resolve | Resolve dispute with action |

**Dependencies:** Depends on: FEAT-031, FEAT-028

**UI Screens (Expected):**

- Dispute Resolution Panel (within Admin Fraud Review Queue)

---

### FEAT-033: Admin Authentication & Session Control

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-033 |
| Module | MOD-008 — Admin Operations |
| Priority | MUST-HAVE |
| Source | Section XIII (admin security: admin token \+ IP whitelist \+ MFA), Section IV (ROLE-007, ROLE-008, ROLE-009 auth) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to authenticate with MFA and IP-restricted access so that the admin control plane is protected against unauthorized access.

**Description:** Admin authentication is completely separate from consumer authentication (separate token namespace, separate login endpoint, separate session store). Admin login requires: admin email \+ password \+ TOTP MFA code. Admin sessions are IP-whitelisted — sessions from non-whitelisted IPs are rejected even with valid credentials. ROLE-009 (Al Rabiaa operator) uses a scoped operator token valid only for a specific draw's digit entry endpoints and the studio IP range.

**Acceptance Criteria:**

```
GIVEN an admin with valid credentials attempting to log in from a non-whitelisted IP
WHEN they submit the login form
THEN login is rejected with 'الوصول غير مسموح من هذا الموقع'
AND the attempt is logged in AuditLog with source IP

GIVEN a valid admin session that has been idle for 30 minutes
WHEN the admin next interacts with the dashboard
THEN they are prompted to re-enter MFA code (session re-validation — not full re-login)

GIVEN a ROLE-009 operator token provisioned for Draw #47
WHEN the operator uses it to access /api/v1/admin/draws/48/digit
THEN the request is rejected (token scope is draw_id=47 only)

GIVEN admin successfully authenticates
WHEN any admin action is executed
THEN AuditLog records: admin_id, action, IP, timestamp — for every action, not just destructive ones
```

**Data Requirements:**

- **Entities Involved:** AuditLog (implied — no separate entity needed)  
- **Key Fields:** Admin sessions: admin\_id, session\_token, ip\_address, last\_active\_at, expires\_at, mfa\_verified; Operator tokens: scoped to draw\_id \+ endpoint pattern \+ IP range  
- **Validation Rules:** IP whitelist: admin.whitelist\_ips config (admin-managed list); MFA: TOTP RFC 6238; session idle timeout: 30 minutes (configurable); operator token TTL: draw day only

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/admin/auth/login | Admin login (email \+ password) |
| POST | /api/v1/admin/auth/verify-mfa | MFA verification (returns admin JWT) |
| POST | /api/v1/admin/auth/logout | Session invalidation |
| POST | /api/v1/admin/auth/operator-token | Generate scoped operator token for a draw |

**Business Rules:**

1. Admin IP whitelist is managed as a configurable system parameter — admin can add/remove IPs from the admin panel.  
2. Admin tokens and consumer tokens use different signing keys and different JWT audiences.

**Dependencies:** Blocks all other admin features

**UI Screens (Expected):**

- Admin Login Screen, MFA Verification Screen, Admin Dashboard (base layout)

---

### FEAT-034: Admin Dashboard & Budget Monitor

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-034 |
| Module | MOD-008 — Admin Operations |
| Priority | MUST-HAVE |
| Source | Section XVII (analytics KPIs), Section DevOps (observability: real-time draw dashboard, budget monitor) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want a real-time operations dashboard showing draw status, prize costs, entry volumes, and system health so that I can manage operations proactively.

**Description:** The admin dashboard home shows: current draw status (scheduled/live/finalized), real-time prize cost running total vs. weekly/monthly budget, entry volume trend (entries generated last 24h vs. prior week same day), active challenge status, fraud queue depth, notification delivery rate (post-draw), and system health indicators. Budget monitor alerts at 80% and 100% of projected spend.

**Acceptance Criteria:**

```
GIVEN a draw night in progress with prize payout running
WHEN admin views the budget monitor widget
THEN they see: 'إجمالي الجوائز: 1,234,500 IQD / 2,800,000,000 IQD (0.04%)'
AND real-time update every 30 seconds during draw execution

GIVEN total prize payout reaching 80% of projected weekly budget
WHEN the 80% threshold is crossed
THEN admin receives an in-dashboard alert banner: 'تنبيه: 80% من الميزانية المتوقعة'
AND an email notification to the configured admin email addresses

GIVEN the fraud review queue exceeding 50 pending cases
WHEN the queue depth check fires
THEN dashboard shows a red indicator on the Fraud Queue widget
AND a notification is sent to ROLE-008 reviewers
```

**Data Requirements:**

- **Entities Involved:** Draw (OBJ-002), PrizePayout (OBJ-012), FawzEntry (OBJ-001), FraudReviewCase (OBJ-013)  
- **Key Fields:** All aggregate read queries — no write operations from dashboard

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/dashboard/summary | Aggregated dashboard metrics |
| GET | /api/v1/admin/dashboard/budget | Real-time budget monitor |
| GET | /api/v1/admin/dashboard/entry-volume | Entry volume trend |
| WS | /ws/admin/draw/{id}/live | Real-time draw execution dashboard |

**Business Rules:**

1. Budget projected amounts (weekly and monthly) are configurable admin parameters.  
2. Budget alert thresholds (80%, 100%) are configurable.

**Dependencies:** Depends on: FEAT-033 Blocks: nothing (read-only dashboard)

**UI Screens (Expected):**

- Admin Dashboard Home, Real-time Draw Control Panel

---

### FEAT-035: System Configuration Management

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-035 |
| Module | MOD-008 — Admin Operations |
| Priority | MUST-HAVE |
| Source | Critical Reminders \#20: "All numeric thresholds MUST be modeled as configurable parameters in the Admin Panel, not hard-coded" |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to manage all system parameters from the admin panel without code deployment so that business rules can be adjusted rapidly in response to operational needs.

**Description:** A configuration management interface for all business-rule parameters. Organized into groups: Entry Rules (min tx amount, entry divisor, retroactive cap), Payout Rules (weekly cap, monthly cap, compliance review threshold, jackpot monthly cap), Referral Rules (link expiry, min qualifying tx, fraud flag threshold, lookback period, reward amounts), Merchant Rules (volume ceiling, activity floor), Fraud Rules (all thresholds and detection parameters), System Rules (notification thresholds, SLA durations, admin IP whitelist, budget alerts). All changes logged in AuditLog.

**Acceptance Criteria:**

```
GIVEN admin navigating to System Config → Entry Rules
WHEN they update 'Minimum Transaction Amount (IQD)' from 1000 to 1500
THEN the new value takes effect within 60 seconds for all subsequent transactions
AND AuditLog records: admin_id, parameter='min_tx_amount_iqd', old_value=1000, new_value=1500, timestamp

GIVEN admin attempting to set 'Entry Divisor (IQD)' to 0
WHEN they submit
THEN validation rejects: 'Entry divisor must be a positive integer'

GIVEN admin viewing config history for 'Referral Monthly Fraud Threshold'
WHEN they view the change log
THEN they see all historical values with changed_by admin_id, old_value, new_value, timestamp
```

**Data Requirements:**

- **Entities Involved:** SystemConfig (implied — key-value store with versioned history)  
- **Key Fields:** config\_key, config\_value, config\_group, data\_type (int/decimal/string/boolean), updated\_by, updated\_at, previous\_value, effective\_from  
- **Validation Rules:** Type-safe validation per config\_key; min/max bounds defined per parameter; all changes require confirmation

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/config | List all config parameters by group |
| PUT | /api/v1/admin/config/{key} | Update a config parameter |
| GET | /api/v1/admin/config/{key}/history | Change history for a parameter |

**Business Rules:**

1. Configuration changes take effect within 60 seconds — app servers poll config store on this interval.  
2. Some parameters (e.g., draw prize tiers) require a draw-specific override rather than global config — handled via FEAT-005.

**Dependencies:** Depends on: FEAT-033 Used by: All features with configurable thresholds

**UI Screens (Expected):**

- System Configuration Screen (grouped panels), Config Change History Modal

---

### FEAT-036: Winner Export for Media Production

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-036 |
| Module | MOD-008 — Admin Operations |
| Priority | MUST-HAVE |
| Source | Section VII-B (WF-S-007: Winner Story Production), Section IV (ROLE-007 can\_read: winner contact data for last-7+) |
| Confidence | HIGH |

**User Story:** As a ROLE-007 (Platform Admin), I want to export winner contact data for Last-7 and Last-10 tier winners after each draw so that the media production team can contact winners for TV segments.

**Description:** Post-draw finalization, admin exports a CSV/Excel file of all Last-7 and Last-10 tier winners for that draw, containing: partial name (from SuperQi KYC), phone number, city/governorate, prize tier, and prize amount. Export is scoped only to winners who have given media consent (FEAT-044). Export action is logged in AuditLog. File is downloaded directly — not stored.

**Acceptance Criteria:**

```
GIVEN draw #47 finalized with 85 Last-7 winners and 1 Last-10 winner
WHEN admin clicks 'Export Winner List' for this draw
THEN a CSV file is generated with 86 rows (media-consenting last-7+ winners only)
AND each row: partial_name, phone (masked last 4 digits displayed), city, prize_tier, prize_iqd
AND the export action is logged: admin_id, draw_id, export_timestamp, record_count
AND the file is NOT stored server-side — direct stream to admin's browser

GIVEN a Last-7 winner who has not given media consent
WHEN export is generated
THEN that winner is excluded from the export
AND excluded count is shown to admin: '3 winners excluded — no media consent'

GIVEN a non-admin role attempting to access the export endpoint
WHEN the request arrives
THEN it is rejected with 403
```

**Data Requirements:**

- **Entities Involved:** DrawWinner (OBJ-003), ConsumerUser (OBJ-010)  
- **Key Fields:** Export: winner name (partial), phone (SuperQi KYC), city, prize\_tier, prize\_iqd, media\_consent=true filter  
- **Validation Rules:** Draw must be in 'Finalized' status; export scoped to last-7 and last-10 tiers only; media consent filter applied; ROLE-007 only

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/draws/{id}/winners/export?format=csv | Streaming export of winner list |

**Dependencies:** Depends on: FEAT-010, FEAT-044 (consent data)

**UI Screens (Expected):**

- Draw Detail Screen (admin) → Export button

---

### FEAT-037: Audit Log Viewer

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-037 |
| Module | MOD-008 — Admin Operations |
| Priority | MUST-HAVE |
| Source | Section XIII (audit expectations), Section XI (AuditLog: 7-year retention, append-only) |
| Confidence | HIGH |

**User Story:** As a ROLE-007/ROLE-008 (Admin/Compliance Reviewer), I want to search and filter the audit log so that I can investigate specific actions, verify draw integrity, and produce CBI compliance reports.

**Description:** A read-only, filterable view of the AuditLog table. Filters: actor\_id, action\_type, object\_type, object\_id, time range. Sort: timestamp DESC. Each log entry shows: actor name, action type, affected object, before/after state, IP address, timestamp. AuditLog is append-only — no edit or delete capability.

**Acceptance Criteria:**

```
GIVEN admin searching AuditLog for all actions on Draw #47
WHEN they filter by object_type='draw', object_id='47'
THEN all audit entries for that draw appear: snapshot, pre-gen, digit entries, finalize, export

GIVEN an attempt to modify or delete an AuditLog record via any API
WHEN the request reaches the audit service
THEN the request is rejected — AuditLog endpoint supports only INSERT and SELECT
```

**Data Requirements:**

- **Entities Involved:** AuditLog  
- **Key Fields:** actor\_id, actor\_type, action\_type, object\_type, object\_id, before\_state (JSON), after\_state (JSON), ip\_address, timestamp  
- **Validation Rules:** Append-only; INSERT-only database user for AuditLog table; retention 7 years

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/admin/audit-log | Paginated, filterable audit log |
| GET | /api/v1/admin/audit-log/export | Export filtered subset for compliance |

**Dependencies:** Depends on: FEAT-033

**UI Screens (Expected):**

- Audit Log Screen (admin panel)

---

### FEAT-038: Push Notification Fan-out

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-038 |
| Module | MOD-009 — Notifications & Real-time |
| Priority | MUST-HAVE |
| Source | Section XV (scale: 8M notifications within 60 seconds), Section XVII (analytics: notification delivery rate KPI), Section XV (push notification service: TBD vendor — Firebase/APNs) |
| Confidence | HIGH |

**User Story:** As a ROLE-010 (Automated System), I want to deliver push notifications to 8M+ users within 60 seconds of draw finalization so that winners experience immediate, simultaneous gratification.

**Description:** A high-throughput push notification service that queues notifications during draw processing, then fans out to all recipients via the push notification provider (Firebase/APNs — vendor TBD) after finalize triggers. Uses a priority queue: winner notifications (highest priority) → non-winner notifications → challenge completion notifications → other. Delivery rate monitoring with alerting at \< 90% delivery in 10 minutes. Notification templates are admin-managed (copy changes without code deploy).

**Acceptance Criteria:**

```
GIVEN 433,000 winner notifications and 7,567,000 non-winner notifications queued post-finalization
WHEN fan-out executes
THEN winner notifications begin delivering within 5 seconds of finalize
THEN 95% of all notifications delivered within 5 minutes
THEN 99% delivered within 10 minutes
AND notification delivery rate is tracked per batch in the admin dashboard

GIVEN the push notification provider returning errors for 5% of tokens (expired tokens)
WHEN the fan-out batch encounters these errors
THEN expired tokens are marked for removal from the notification target list
AND delivery rate reflects actual deliverable tokens (expired excluded from denominator)

GIVEN a consumer who has disabled 'Draw Results' notifications in their preferences
WHEN draw result notifications are queued
THEN this consumer's device token is excluded from the draw result batch
AND they do NOT receive the winner or non-winner notification
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010), Merchant (OBJ-011)  
- **Key Fields:** ConsumerUser.device\_token (push token), ConsumerUser.notification\_preferences (JSON), notification\_type enum  
- **Validation Rules:** Notification preferences filter applied server-side before queuing; device token validation on each send

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/v1/internal/notifications/queue | Internal: queue notification for delivery |
| POST | /api/v1/internal/notifications/fanout/{batch\_id} | System: trigger fan-out for a staged batch |
| GET | /api/v1/admin/notifications/delivery-stats | Admin: delivery rate dashboard |

**Business Rules:**

1. Push notification vendor (Firebase/APNs) is a configurable integration — vendor selection is a pending TBD item in the spec gaps.  
2. Notification copy (templates) for all notification types are managed via admin config panel — no code deploy needed for copy changes.

**Dependencies:** Depends on: FEAT-010 (draw result trigger), FEAT-001 (entry earned trigger), FEAT-019 (referral reward trigger)

**UI Screens (Expected):**

- Notification Delivery Stats Dashboard (admin)

---

### FEAT-039: Notification Preferences Management

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-039 |
| Module | MOD-009 — Notifications & Real-time |
| Priority | MUST-HAVE |
| Source | Section XIV (consent: explicit opt-in for Fawz push notifications at first Fawz tab launch), Section XV (accessibility) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to control which types of notifications I receive so that I'm not overwhelmed while staying informed about things I care about.

**Description:** At first Fawz tab open, a consent screen requests permission for Fawz push notifications by category. Subsequently manageable in Fawz settings: Draw Reminders (pre-draw countdown), Draw Results (winner/non-winner), Entry Earned, Challenge Updates, Referral Rewards. Each category is a separate opt-in toggle. System-critical notifications (account suspension, compliance review) are not opt-out.

**Acceptance Criteria:**

```
GIVEN a consumer opening the Fawz tab for the first time
WHEN the Fawz notification consent screen appears
THEN they see 5 notification categories with brief Arabic descriptions
AND 'قبول الكل' (Accept All) and 'اختيار' (Choose) options
AND selecting 'اختيار' presents individual toggles

GIVEN a consumer who has disabled 'Entry Earned' notifications
WHEN they make a qualifying transaction
THEN no push notification is sent for this entry generation event
AND the entry is still created in the database and visible in My Numbers

GIVEN a consumer who has all notifications disabled
WHEN their account is suspended
THEN they STILL receive the account suspension notification (system-critical, non-opt-outable)
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010)  
- **Key Fields:** ConsumerUser.notification\_preferences (JSON: {draw\_reminders: bool, draw\_results: bool, entry\_earned: bool, challenge\_updates: bool, referral\_rewards: bool})  
- **Validation Rules:** All preferences default to true on first sign-in; system\_critical notifications cannot be disabled

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/notifications/preferences | Get user's notification preferences |
| PUT | /api/v1/notifications/preferences | Update notification preferences |

**Dependencies:** Depends on: FEAT-038

**UI Screens (Expected):**

- Notification Consent Screen (first-time), Notification Preferences Screen (settings)

---

### FEAT-040: In-app Notification Center

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-040 |
| Module | MOD-009 — Notifications & Real-time |
| Priority | MUST-HAVE |
| Source | Section XV (UX: success feedback; loading states), Section III (Consumer can\_read: draw results, prize history) |
| Confidence | MEDIUM \[INFERRED\] |

**User Story:** As a ROLE-001 (Consumer User), I want to see a history of all my Fawz notifications in-app so that I can review missed notifications and access past events even after clearing push notifications.

**Description:** A chronological notification feed within the Fawz tab showing all system-generated events for the authenticated user: entries earned, challenge progress updates, draw results, referral rewards, prize credits, and compliance communications. Notifications are marked read/unread. Unread count shown as badge on Fawz tab icon.

**Acceptance Criteria:**

```
GIVEN a consumer who missed their draw result push notification
WHEN they open the Fawz Notification Center
THEN they see the draw result notification with prize amount or non-winner message
AND tapping it navigates to the relevant Draw Results screen

GIVEN 0 notifications
WHEN consumer opens Notification Center
THEN they see empty state: 'لا يوجد إشعارات بعد — ابدأ بالدفع بسوبر كي!'

GIVEN the consumer has 5 unread notifications
WHEN they open the Fawz tab
THEN a red badge '5' appears on the notification bell icon
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010) — no separate notification entity needed; notifications derived from event log  
- **Key Fields:** In-app notifications: id, user\_id, type, title\_ar, body\_ar, deep\_link, is\_read, created\_at  
- **Validation Rules:** 90-day retention for in-app notification history; mark-as-read is idempotent

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/notifications | In-app notification history (paginated) |
| PUT | /api/v1/notifications/{id}/read | Mark notification as read |
| PUT | /api/v1/notifications/read-all | Mark all notifications as read |
| GET | /api/v1/notifications/unread-count | Badge count for tab icon |

**Dependencies:** Depends on: FEAT-038

**UI Screens (Expected):**

- In-app Notification Center Screen (bell icon in Fawz Tab header)

---

### FEAT-041: Fawz Tab Home Screen

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-041 |
| Module | MOD-010 — User Account & Onboarding |
| Priority | MUST-HAVE |
| Source | Section XV (UX principles: immediate reward feeling; draw as ritual; challenges as content), Section II (Operational Summary) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want a clear, engaging home screen within the SuperQi app showing my Fawz status so that I can check my entries, challenge progress, and draw countdown at a glance.

**Description:** The Fawz Tab home screen is the primary consumer surface. It displays (top to bottom): current draw type (weekly/monthly) with countdown timer to next draw, current jackpot amount (animated), total entries in current draw period (prominent, animated increment on new entry), the pre-draw reminder 'ادفع اليوم واحصل على أرقام قبل السحب\!', Weekly Spark progress (7-day pill row), active challenge card(s) with progress bars, Referral section teaser (entries earned from referrals), and notification bell. All data updates in real time via WebSocket when draw is live.

**Acceptance Criteria:**

```
GIVEN a consumer with 23 entries in the current weekly draw
WHEN they open the Fawz tab
THEN they see '23 أرقام فوز' with the draw countdown (e.g., '2 يوم و 14 ساعة')
AND the current jackpot amount prominently displayed
AND the Weekly Spark progress bar (e.g., 3/5 days filled)

GIVEN a consumer who just made a qualifying transaction of 5,000 IQD
WHEN the entry generation push notification fires and they open the Fawz tab
THEN the entry count animates from 23 to 25 with a gold particle burst

GIVEN the draw is currently live (Thursday 9:00 PM window)
WHEN the consumer opens the Fawz tab
THEN they are automatically navigated to the Live Draw screen (FEAT-008 WebSocket view)
AND a 'السحب مباشر الآن! 🔴' (Draw Live Now!) banner pulses at the top

GIVEN a new user (ROLE-002) opening Fawz tab for the first time
WHEN lifetime_tx = 0
THEN onboarding challenge cards are shown prominently above the regular content
AND entry count shows '0 أرقام فوز — ابدأ الدفع!'
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010), FawzEntry (OBJ-001), Draw (OBJ-002), Challenge (OBJ-004), UserChallengeProgress (OBJ-005)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/home | Fawz tab home data composite (entry count, draw status, challenges, jackpot) |
| GET | /api/v1/draws/next | Next scheduled draw with countdown |

**Dependencies:** Depends on: FEAT-001, FEAT-011, FEAT-014, FEAT-016, FEAT-017, FEAT-024, FEAT-040

**UI Screens (Expected):**

- Fawz Tab Home Screen (primary consumer surface)

---

### FEAT-042: User Fawz Profile Extension

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-042 |
| Module | MOD-010 — User Account & Onboarding |
| Priority | MUST-HAVE |
| Source | Section V (OBJ-010: ConsumerUser), Section III (user tier system and progression signals) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want my Fawz profile to track my stats, badges, and history so that I can see my participation record and feel a sense of progression.

**Description:** The Fawz-specific extension of the SuperQi user account. Stores and displays: total lifetime entries earned, total prizes won (count and IQD), badges earned (Fawz Explorer, etc.), current streak status, referral code, referral count lifetime, and account tier (Onboarding / Standard). System-managed fields: weekly\_unique\_days, monthly\_unique\_days, weekly\_spark\_earned\_month, lifetime\_tx, is\_new.

**Acceptance Criteria:**

```
GIVEN a consumer who has earned the Fawz Explorer badge and won 2 prizes
WHEN they view their Fawz profile
THEN they see: 'Fawz Explorer 🌟' badge, '2 مرات فزت', total lifetime entries count

GIVEN a consumer whose lifetime_tx crosses 10
WHEN the system updates the account tier
THEN ConsumerUser.is_new transitions to false
AND onboarding challenges no longer appear in the challenge view
AND the account is now treated as Standard Consumer (ROLE-001) not Onboarding (ROLE-002)
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010)  
- **Key Fields:** All ConsumerUser Fawz-specific fields listed in data\_genome  
- **Validation Rules:** is\_new transition: automatic when lifetime\_tx \> 10; badges: non-revocable once earned

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/profile/fawz | User's Fawz profile data |

**Dependencies:** Depends on: FEAT-013, FEAT-019

**UI Screens (Expected):**

- Fawz Profile Screen (accessible from Fawz tab)

---

### FEAT-043: Draw Share / Winner Social Export

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-043 |
| Module | MOD-010 — User Account & Onboarding |
| Priority | MUST-HAVE |
| Source | Section XV (UX: winning designed to be shared; one-tap share; social artefact), Section XVIII (growth: winner organic amplification) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User who won), I want to share my win result as a branded image so that I can celebrate with friends and generate organic word-of-mouth for Fawz.

**Description:** The win notification leads to a full-screen winner overlay showing the matching Fawz Number with winning digits highlighted in gold, the prize amount, the draw date, and a branded Fawz logo. A single 'شارك فوزك\!' (Share Your Win\!) button opens the native share sheet with the screen as a pre-rendered image. Non-winners see a smaller share option: 'عدك \[X\] أرقام للسحب القادم — شاركها\!'

**Acceptance Criteria:**

```
GIVEN a consumer who won Last-3 (10,000 IQD) in the Thursday draw
WHEN they tap the win notification
THEN a full-screen winner overlay renders with their matching number, last 3 digits highlighted gold, '🎉 10,000 IQD' large, draw date
AND 'شارك فوزك!' button is prominent (above the fold)
AND tapping it opens iOS Share Sheet / Android Share Intent with the branded image

GIVEN a non-winner consumer checking results
WHEN they view the results screen
THEN they see a smaller share option: 'عدك 47 رقم للسحب القادم — ادعي صاحبك!'
AND tapping it opens a referral share (FEAT-017)

GIVEN a winner on a low-end device
WHEN the winner overlay renders
THEN it renders within 2 seconds using pre-cached assets
AND the share image is generated client-side (no server round-trip) using React Native canvas
```

**Data Requirements:**

- **Entities Involved:** DrawWinner (OBJ-003), Draw (OBJ-002), FawzEntry (OBJ-001)

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/prizes/my-wins/{draw\_winner\_id}/share-card | Pre-render share card data (winning number, prize, draw info) |

**Dependencies:** Depends on: FEAT-010, FEAT-011

**UI Screens (Expected):**

- Winner Share Overlay Screen, Non-winner Results Share Prompt

---

### FEAT-044: Consent & Media Permission Management

| Field | Value |
| :---- | :---- |
| Feature ID | FEAT-044 |
| Module | MOD-010 — User Account & Onboarding |
| Priority | MUST-HAVE |
| Source | Section XIV (consent requirements: marketing, publishing/media), Section XV (Sharia disclosure) |
| Confidence | HIGH |

**User Story:** As a ROLE-001 (Consumer User), I want to manage my consent for marketing notifications and winner media participation so that Fawz only contacts me in ways I've agreed to.

**Description:** Consent is collected at two points: (1) First Fawz tab open — notification consent (FEAT-039) and a brief Sharia disclosure modal (مكافآت تجارية framing, not يانصيب); (2) Winner notification — explicit media consent form before the user's name/image can be used in Al Rabiaa TV winner segments. All consent records are timestamped with version. Consent can be withdrawn at any time from settings.

**Acceptance Criteria:**

```
GIVEN a consumer opening the Fawz tab for the first time
WHEN the Sharia disclosure modal appears
THEN it presents a clear, plain-Arabic explanation that Fawz is مكافآت تجارية
AND provides 'فهمت وأوافق' (I understand and agree) and 'إغلاق' (Close) options
AND if closed without agreeing, the disclosure reappears on next open (non-blocking)

GIVEN a consumer who has won Last-7 and is being contacted for a TV winner story
WHEN the media consent form is presented (via push notification or in-app prompt)
THEN they see: what will be filmed, how it will be used, that winning is NOT contingent on consent
AND they can accept or decline
AND their consent decision is recorded with timestamp and version

GIVEN a consumer who previously gave media consent but wants to withdraw
WHEN they navigate to Settings → Fawz Consent → Media Consent → withdraw
THEN media_consent=false is recorded
AND the winner export for future draws (FEAT-036) will exclude this user
```

**Data Requirements:**

- **Entities Involved:** ConsumerUser (OBJ-010)  
- **Key Fields:** ConsumerUser.sharia\_disclosure\_accepted (bool), ConsumerUser.sharia\_disclosure\_accepted\_at, ConsumerUser.media\_consent (bool), ConsumerUser.media\_consent\_at, ConsumerUser.media\_consent\_version  
- **Validation Rules:** Consent version tracked — if terms update, re-consent required; media consent withdrawal is immediate

**API Endpoints (Expected):**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/consent | User's current consent records |
| POST | /api/v1/consent/sharia-disclosure | Record sharia disclosure acceptance |
| POST | /api/v1/consent/media | Record media consent decision |
| DELETE | /api/v1/consent/media | Withdraw media consent |

**Dependencies:** Depends on: FEAT-042

**UI Screens (Expected):**

- Sharia Disclosure Modal (first-time), Media Consent Form, Consent Settings Screen

---

## 6\. STATE MACHINE SPECIFICATIONS

### State Machine: FawzEntry

- **Entity:** FawzEntry (OBJ-001)  
- **Module:** MOD-001  
- **Status Field:** derived from `is_expired`, `draw_winner` join, and creation phase — no single status column; computed state  
- **Initial State:** Active  
- **Terminal States:** Won, Not\_Won, Expired, Archived

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Active | Entry exists, assigned to a future draw, eligible for matching | None | Snapshot captures this entry in draw pool |
| Matched | Draw pool snapshot taken; entry in the pool for evaluation | Pool snapshot records entry | Winner calculation evaluates |
| Won | Entry matched a winning number — DrawWinner record created | DrawWinner and PrizePayout records created; push notification queued | Archive (13 months) |
| Not\_Won | Entry in draw pool; no digit match found | Non-winner notification queued | Archive (13 months) |
| Expired | Entry marked is\_expired=true (retroactive expiry OR refunded tx) | None | Archive (13 months) |
| Archived | Entry moved to cold storage; 13 months after creation (except jackpot wins: permanent) | Cold archive executed | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | FawzEntriesGenerated | Active | Eligibility gate passed; CSPRNG number generated | Insert FawzEntry record |
| 2 | Active | DrawPoolSnapshotted | Matched | Entry draw\_week/month matches current draw; is\_expired=false | Entry included in draw pool |
| 3 | Matched | DrawFinalized (digit match found) | Won | Entry number matches winning number digits | CreateDrawWinner, create PrizePayout |
| 4 | Matched | DrawFinalized (no digit match) | Not\_Won | Entry in pool but no digit match | Queue non-winner notification |
| 5 | Active | TransactionRefunded | Expired | Source transaction refunded; entry is\_expired=true set within 24h | is\_expired=true; NOT deleted |
| 6 | Active | RetroactiveExpiryBatchRuns | Expired | is\_retroactive=true AND first draw finalized | Batch sets is\_expired=true |
| 7 | Won/Not\_Won/Expired | ArchiveCycleRuns (13 months) | Archived | created\_at \> 13 months ago; NOT jackpot winner | Cold archive move |
| 8 | Won (jackpot) | — | Won (permanent) | digits\_matched \= 10 | Permanent retention, no archive |

**Cancellation Rules:**

- Cannot be cancelled from any state once generated  
- Exception: is\_expired=true on transaction refund — soft expiry, not deletion  
- Cannot reverse Won or Not\_Won states  
- Retroactive entries expire automatically after first draw

---

### State Machine: Draw

- **Entity:** Draw (OBJ-002)  
- **Module:** MOD-002  
- **Status Field:** `status` (VARCHAR ENUM)  
- **Initial State:** Scheduled  
- **Terminal States:** Archived

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Scheduled | Draw created; awaiting T-30 min snapshot | Pre-scaling job configured | Pool snapshot triggered |
| Pool\_Snapshotted | Entry pool frozen; pre-generation pending | Draw.entry\_pool\_size recorded | Winning numbers sealed |
| Live | Al Rabiaa broadcast started; digit entry in progress | WebSocket draw channel opened | Finalization triggered |
| Finalized | All digits entered; winners calculated; prizes credited | Winners credited; notifications released | Archive scheduled |
| Archived | Draw record fully archived | Draw archived in cold storage | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | DrawScheduled | Scheduled | Admin creates draw with valid future date | Draw record created |
| 2 | Scheduled | AdminCancels (pre-snapshot only) | \[soft-deleted\] | status='Scheduled' | Soft delete; user notification if needed |
| 3 | Scheduled | PoolSnapshotTriggered | Pool\_Snapshotted | Admin triggers at T-30 min | entry\_pool\_size recorded |
| 4 | Pool\_Snapshotted | PreGenerationCompleted | Pool\_Snapshotted (sub-state) | 3 numbers sealed in encrypted commit | Staged winners pre-calculated |
| 5 | Pool\_Snapshotted | DrawBroadcastStarted | Live | First digit submitted by operator | WebSocket draw channel opens |
| 6 | Live | AllDigitsEntered | Live (sub-state) | 30 digits across 3 numbers entered and confirmed | — |
| 7 | Live | DrawFinalized | Finalized | Admin triggers finalize; two-step confirmation | Winners calculated; prizes credited; notifications released |
| 8 | Finalized | ArchiveCycle | Archived | Draw is Finalized AND \> 90 days old | Cold archive |

**Cancellation Rules:**

- Can be cancelled from: Scheduled (before pool snapshot)  
- Cannot be cancelled from: Pool\_Snapshotted, Live, Finalized, Archived  
- On cancellation (Scheduled only): notify affected users if a draw reminder has been sent

---

### State Machine: DrawWinner

- **Entity:** DrawWinner (OBJ-003)  
- **Module:** MOD-002 / MOD-006  
- **Status Field:** `payout_status`  
- **Initial State:** Created (staged — pre-finalization)  
- **Terminal States:** Paid, Rejected

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Staged | Pre-generated based on sealed winning numbers; not yet active | Created during pre-generation | Promoted to Created on finalization |
| Created | DrawWinner confirmed after finalization | Payout processing initiated | Payout executing |
| Pending\_Payout | Payout queued for wallet API call | PrizePayout record created | API call executing |
| Credited | Wallet credit successful | Winner notification sent | — |
| Held\_For\_Review | Payout withheld — cap exceeded or high-value | FraudReviewCase opened | Reviewer decision |
| Paid | All resolution complete | None | Permanent record |
| Rejected | Prize invalidated post-review | User notified with reason | Permanent record |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | WinnersPreCalculated | Staged | Winning numbers sealed; pool snapshotted | Staged DrawWinner records created |
| 2 | Staged | DrawFinalized | Created (active) | Physical draw confirms match | DrawWinner promoted |
| 3 | Staged | DrawFinalized (mismatch override) | Created (active) | Physical result different; admin override | Recalculate winners from override |
| 4 | Staged | DrawFinalized (entry staged but override removes match) | Voided | Mismatch reconciliation | Staged record voided |
| 5 | Created | PayoutInitiated | Pending\_Payout | prize\_iqd ≤ weekly/monthly cap; prize\_iqd ≤ compliance threshold | PrizePayout record created |
| 6 | Created | CapExceededOrHighValue | Held\_For\_Review | prize\_iqd \> cap OR \> compliance review threshold | FraudReviewCase created |
| 7 | Pending\_Payout | WalletCreditSucceeded | Credited | SuperQi Wallet API returns success | credited\_at recorded; winner notification sent |
| 8 | Pending\_Payout | WalletCreditFailed (3 retries) | Held\_For\_Review | Wallet API error after 3 retries | Admin alert; manual retry required |
| 9 | Held\_For\_Review | ReviewerApproves | Pending\_Payout | Reviewer decision \= approved | Release to payout queue |
| 10 | Held\_For\_Review | ReviewerRejects | Rejected | Reviewer decision \= rejected | User notified |
| 11 | Credited | — | Paid | (terminal — no transition; Credited \= Paid in most cases) | — |

**Cancellation Rules:**

- Cannot cancel after status \= Credited  
- Held\_For\_Review: reviewable and releasable or rejectable by Finance/Compliance Reviewer  
- Fraud confirmed post-Credited: account-level action (suspension) used, NOT payout reversal

---

### State Machine: Challenge

- **Entity:** Challenge (OBJ-004)  
- **Module:** MOD-003  
- **Status Field:** `is_active` (bool) \+ `start_date`/`end_date` (derived state)  
- **Initial State:** Draft  
- **Terminal States:** Archived

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Draft | Created by admin; not yet active | None | Admin activates |
| Scheduled | is\_active=true but start\_date in future | — | start\_date reached |
| Active | is\_active=true AND within start\_date/end\_date window | UserChallengeProgress records auto-created | Admin deactivates OR end\_date reached |
| Completed\_By\_User | User has reached target\_value | Reward credited; completion notification | — (challenge remains Active for other users) |
| Expired | end\_date passed OR admin deactivated | No new progress | Archive |
| Archived | Challenge retained for history; no active use | — | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | AdminCreates | Draft | Valid challenge config | Draft record created |
| 2 | Draft | AdminActivates | Scheduled | start\_date \> now | is\_active=true |
| 3 | Draft | AdminActivates (start\_date today/past) | Active | start\_date ≤ now | is\_active=true; progress tracking begins |
| 4 | Scheduled | StartDateReached | Active | Midnight of start\_date UTC+3 | Progress tracking begins |
| 5 | Active | AdminDeactivates | Expired | Admin decision | is\_active=false; users notified |
| 6 | Active | EndDateReached | Expired | Midnight after end\_date UTC+3 | is\_active=false |
| 7 | Expired | ArchiveCycle | Archived | end\_date \+ 90 days | Archive |
| 8 | Draft | AdminDeletes | \[soft-deleted\] | Draft status only | deleted\_at set |

**Cancellation Rules:**

- Draft: deletable  
- Active: can be deactivated (stops earning); not deletable; rewards already credited are permanent  
- Expired/Archived: immutable

---

### State Machine: UserChallengeProgress

- **Entity:** UserChallengeProgress (OBJ-005)  
- **Module:** MOD-003  
- **Status Field:** `completed` (bool) \+ `is_expired` (derived from challenge.end\_date)  
- **Initial State:** Created  
- **Terminal States:** Completed, Expired

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Created | Progress record initialized when challenge activates and user is eligible | current\_value=0 | First qualifying event |
| In\_Progress | current\_value \> 0 and \< target\_value | None | Target reached or challenge expires |
| Checkpoint\_Reached | current\_value ≥ a checkpoint.at AND checkpoint not yet claimed | Checkpoint reward credited; notification sent | Next transaction or completion |
| Completed | current\_value ≥ target\_value | Challenge reward credited; completion notification | Permanent record |
| Expired | Challenge end\_date passed without completion | None | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | ChallengeActivated | Created | User eligible (e.g., is\_new for onboarding) | current\_value=0 record created |
| 2 | Created | QualifyingEventFires | In\_Progress | Metric matches; idempotency checked | current\_value incremented |
| 3 | In\_Progress | QualifyingEventFires | In\_Progress / Checkpoint\_Reached | current\_value incremented; checkpoint check | Checkpoint credit if threshold crossed |
| 4 | In\_Progress / Checkpoint\_Reached | TargetReached | Completed | current\_value ≥ target\_value | Reward credited; completed\_at=now() |
| 5 | Created / In\_Progress | ChallengeExpires | Expired | Challenge end\_date passed | No reward; record retained |
| 6 | Completed | — | Completed | Terminal — irreversible | — |

**Cancellation Rules:**

- Completed state is irreversible — rewards are permanent  
- Expired: no rewards issued; record retained for history

---

### State Machine: Referral

- **Entity:** Referral (OBJ-007)  
- **Module:** MOD-004  
- **Status Field:** `status`  
- **Initial State:** Initiated  
- **Terminal States:** Rewarded, Rejected, Expired, Archived

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Initiated | Referral link generated by referrer | Referral code created | Link clicked by new user |
| Pending | New user clicked link; awaiting KYC \+ qualifying tx | Referral record created with referred\_user attribution | Qualifying tx fired OR expiry |
| Qualified | New user made qualifying tx ≥ 5,000 IQD | Fraud validation triggered | Validation result |
| Rewarded | All fraud checks passed; both parties credited | Rewards credited; referral\_count\_month++ | Archive (12 months) |
| Pending\_Review | referral\_count\_month \> 10; referrer reward held | FraudReviewCase created | Reviewer decision |
| Rejected | Fraud check failed OR reviewer rejected | Referrer reward withheld; referred user reward proceeds | Archive (12 months) |
| Expired | Link expired (\> 30 days) without qualifying tx | None | Archive (12 months) |
| Archived | Referral record past 12-month retention | — | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | ReferralLinkGenerated | Initiated | User generates link | Code stored in ConsumerUser.referral\_code |
| 2 | Initiated | NewUserClicksLink | Pending | Link not expired; first-click attribution | Referral record created |
| 3 | Pending | QualifyingTxFired | Qualified | tx ≥ 5,000 IQD; qualifying type | Fraud validation queued |
| 4 | Qualified | FraudValidationPassed (referral\_count ≤ 10\) | Rewarded | All 4 fraud checks pass | Referrer \+ referred user credited |
| 5 | Qualified | FraudValidationPassed (referral\_count \> 10\) | Pending\_Review | 4 checks pass but count \> 10 | Referrer reward held; referred credited; FraudReviewCase opened |
| 6 | Qualified | FraudValidationFailed | Rejected | Any fraud check fails | No referrer reward; referred reward: check-dependent |
| 7 | Pending | LinkExpires | Expired | 30 days since click without qualifying tx | No rewards |
| 8 | Pending\_Review | ReviewerApproves | Rewarded | Reviewer decision \= approved | Referrer reward released |
| 9 | Pending\_Review | ReviewerRejects | Rejected | Reviewer decision \= rejected | Referrer reward withheld |
| 10 | Rewarded/Rejected/Expired | ArchiveCycle (12 months) | Archived | 12 months since created\_at | Archive |

**Cancellation Rules:**

- Rewarded state: irreversible — fraud confirmed post-reward → account suspension (not reward clawback)  
- Expired state: cannot be reactivated

---

### State Machine: PrizePayout

- **Entity:** PrizePayout (OBJ-012)  
- **Module:** MOD-006  
- **Status Field:** `payout_status`  
- **Initial State:** Pending  
- **Terminal States:** Credited (permanent record), Rejected

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Pending | Payout queued for wallet API execution | PrizePayout record created | Wallet API call |
| Credited | Wallet credit successful; irreversible | credited\_at recorded; winner notification sent | Permanent |
| Held\_For\_Review | Payout withheld — cap exceeded, high-value, or wallet API failure | FraudReviewCase or retry queue | Reviewer decision or retry |
| Paid | Synonym for terminal state (Credited \+ any review cleared) | — | — |
| Rejected | Payout rejected post-review | User notified | Permanent |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | PayoutInitiated | Pending | DrawWinner created post-finalization | PrizePayout record created |
| 2 | Pending | WalletAPISuccess | Credited | SuperQi Wallet API returns 200 | credited\_at=now(); winner push notification |
| 3 | Pending | CapExceeded | Held\_For\_Review | Owner total for draw \> cap | FraudReviewCase opened for excess |
| 4 | Pending | HighValueThreshold | Held\_For\_Review | amount\_iqd \> compliance\_threshold | FraudReviewCase.flag\_type='high\_value\_winner' |
| 5 | Pending | WalletAPIError (3 retries) | Held\_For\_Review | 3 retry failures | Admin alert; manual retry required |
| 6 | Held\_For\_Review | ReviewerApproves | Pending | Reviewer releases hold | Re-queue for wallet API |
| 7 | Held\_For\_Review | ReviewerRejects | Rejected | Reviewer rejects prize | User notified |
| 8 | Credited | — | Credited | Terminal; immutable | Cannot reverse |

**Cancellation Rules:**

- Cannot cancel after status \= Credited — irreversible  
- Pending: can be held (admin action)  
- Post-credit fraud: account suspension only; no payout reversal

---

### State Machine: FraudReviewCase

- **Entity:** FraudReviewCase (OBJ-013)  
- **Module:** MOD-007  
- **Status Field:** `status`  
- **Initial State:** Flagged  
- **Terminal States:** Closed

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Flagged | Auto-created by fraud rules engine or high-value trigger | Case queued in review queue; SLA timer starts | Reviewer assigns |
| Under\_Review | Reviewer has opened the case and is actively reviewing | reviewer\_id assigned | Decision submitted |
| Approved | Reviewer cleared the flag | Held rewards released; FraudCase closed | Closed |
| Rejected | Reviewer confirmed fraud; rewards withheld | Rewards withheld; account action possible | Closed |
| Escalated | Case requires compliance team or account suspension decision | Senior reviewer or ROLE-007 notified | Compliance decision → Closed |
| Closed | Final state after decision is actioned | AuditLog entry; case archived | — |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | — | FraudFlagCreated | Flagged | Rules engine or high-value trigger fires | Case created; queue entry |
| 2 | Flagged | ReviewerAssigns | Under\_Review | Reviewer selects case | reviewer\_id recorded |
| 3 | Under\_Review | ReviewerApproves | Approved | Decision=approved; reasoning\_notes ≥ 50 chars | Release held rewards |
| 4 | Under\_Review | ReviewerRejects | Rejected | Decision=rejected; reasoning\_notes ≥ 50 chars | Withhold rewards |
| 5 | Under\_Review | ReviewerEscalates | Escalated | Decision=escalate | Senior/Compliance notified |
| 6 | Escalated | ComplianceDecides | Approved/Rejected | Compliance makes final decision | Execute decision |
| 7 | Approved/Rejected/Escalated | DecisionActioned | Closed | All downstream actions complete | AuditLog; 3-year retention |

**Cancellation Rules:**

- Cannot cancel after Under\_Review — must proceed to decision  
- Closed state: immutable; 3-year retention

---

### State Machine: Merchant (Fawz eligibility)

- **Entity:** Merchant (OBJ-011) — Fawz eligibility dimension  
- **Module:** MOD-005  
- **Status Field:** `is_eligible` (bool) — simple binary; nightly recalculated  
- **Initial State:** Ineligible (default)  
- **Terminal States:** N/A (continuous nightly evaluation)

**States:**

| State | Description | Entry Action | Exit Action |
| :---- | :---- | :---- | :---- |
| Ineligible | Does not meet volume \+ activity criteria | No shared entries created | Nightly batch |
| Eligible | Meets both volume ceiling and activity floor | Shared entries created for customer transactions | Nightly batch |
| Fawz\_Certified | Phase 1.5 — has completed onboarding; multiplier active | Phase 1.5 feature | Multiplier decay cycle |
| Suspended | Account suspended by admin action | No entries or prizes | Admin reinstatement |

**Transitions:**

| \# | Source State | Event | Target State | Guard Condition | Action |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | Ineligible | NightlyBatchEligible | Eligible | volume \< 50M IQD AND unique\_tx ≥ 10 | is\_eligible=true; effective next transaction |
| 2 | Eligible | NightlyBatchIneligible | Ineligible | volume ≥ 50M IQD OR unique\_tx \< 10 | is\_eligible=false; no retroactive entry clawback |
| 3 | Eligible | AdminSuspends | Suspended | Manual admin action | account\_status=suspended |
| 4 | Suspended | AdminReinstates | Eligible/Ineligible | Admin action | Eligibility re-evaluated at next nightly batch |

---

## 7\. CROSS-CUTTING CONCERNS

### 7.1 Authentication & Authorization

- **Authentication Method:** JWT (JSON Web Tokens) — separate consumer and admin token namespaces  
- **Consumer JWT:** Issued by SuperQi auth; Fawz validates and extends with Fawz-scoped claims (role, is\_new, is\_merchant, fawz\_user\_id)  
- **Admin JWT:** Issued by Fawz admin auth service; requires email \+ password \+ TOTP MFA; IP-whitelisted  
- **Token Strategy:** Consumer: short-lived access token (15 min) \+ long-lived refresh token (30 days). Admin: access token (30 min idle-timeout); no refresh token — re-authenticate on expiry  
- **Operator Token:** Scoped JWT: claims include draw\_id, endpoint\_pattern, valid\_ip\_range; TTL \= draw day only  
- **Session Rules:** Admin idle timeout: 30 min (configurable). Admin re-MFA on re-validation. Consumer sessions: standard SuperQi session management inherited.

### 7.2 Multi-Tenancy

- **Isolation Strategy:** Shared database with tenant\_id column (factory default). Fawz Phase 1 is single-tenant (Qi Group / Iraq only) — tenant\_id \= 'fawz-iq-001' hardcoded. Future GCC expansion will use tenant\_id per market.  
- **Tenant-Scoped Entities:** FawzEntry, Draw, DrawWinner, Challenge, UserChallengeProgress, Referral, Merchant, ConsumerUser (Fawz extension), PrizePayout, FraudReviewCase, DrawDigitEvent  
- **Global Entities:** SystemConfig, ChannelMultiplierConfig, AuditLog (filtered per tenant but physically shared)

### 7.3 Notifications & Events

| Trigger Event | Channel | Recipient Role | Template |
| :---- | :---- | :---- | :---- |
| FawzEntriesGenerated | Push | ROLE-001/002 | '+\[X\] أرقام فوز\! 🎯' |
| SharedMerchantEntriesCreated | Push | ROLE-003/004 | '+\[X\] أرقام فوز من زبونك\!' |
| ChallengeCheckpointReached | Push | ROLE-001/002 | '🎯 وصلت نقطة تفتيش\! \+\[X\] رقم فوز' |
| ChallengeCompleted | Push | ROLE-001/002 | 'أنجزت التحدي\! \+\[X\] أرقام فوز مضافة' |
| DrawReminderPreDraw | Push | ROLE-001/002/003/004 | 'السحب الليلة الساعة 9 مساءً — عدك \[X\] أرقام\!' |
| DrawResultWinner | Push | ROLE-001/002/003/004 | '🎉 فزت\! \[tier\] — \[amount\] IQD' |
| DrawResultNonWinner | Push | ROLE-001/002/003/004 | 'السحب انتهى — عدك \[X\] رقم للسحب القادم' |
| ReferralRewarded | Push | ROLE-005 | '🎁 صاحبك اشترك\! \+50 أرقام فوز و 5,000 IQD' |
| ReferralRewardReceived | Push | ROLE-002 | '🎁 حصلت على 100 رقم فوز كهدية ترحيب\!' |
| PrizeHeldForReview | Push | ROLE-001 | 'تهانينا\! جائزتك تخضع للمراجعة — خلال 24 ساعة' |
| AccountSuspended | Push (non-opt-out) | ROLE-001 | 'حسابك موقوف — تواصل مع الدعم' |
| RetroactiveSeedingComplete | Push | ROLE-001/002 | 'عدك \[X\] أرقام فوز من معاملاتك السابقة\!' |
| BudgetAlert (80%) | Dashboard \+ Email | ROLE-007 | 'تنبيه: 80% من ميزانية الجوائز المتوقعة' |
| FraudQueueDepthAlert | Dashboard | ROLE-007/008 | In-dashboard alert: queue \> 50 cases |
| SLABreachAlert | Dashboard \+ Email | ROLE-007/008 | 'تحذير: انتهت المهلة لحالة مراجعة' |

### 7.4 Audit & Logging

- **Audited Actions:** All entry generation events, all admin actions, all draw digit events, all prize credits, all referral events (click, attribution, reward, rejection), all fraud review decisions, all config changes, all account suspensions, all export operations, all admin logins (success and failure)  
- **Audit Fields:** actor\_id, actor\_type (user/admin/system), action\_type, object\_type, object\_id, before\_state (JSON), after\_state (JSON), ip\_address, timestamp, tenant\_id  
- **Retention:** 7 years — append-only INSERT-only AuditLog table

### 7.5 File Uploads & Media

- **Phase 1:** No file uploads from consumers. Admin winner export is a server-side generated CSV (streamed directly, not stored).  
- **Phase 2 (Ambassador):** Profile photos for winner stories — image/jpeg, image/png, max 5MB, stored in AWS S3 with access control \= admin-read-only

### 7.6 Search & Filtering

| Entity | Search Type | Default Sort |
| :---- | :---- | :---- |
| FawzEntry | Filtered (draw\_week, source, is\_expired) | created\_at DESC |
| Draw | Filtered (status, type, date\_range) | draw\_date DESC |
| Challenge | Filtered (type, is\_active, date\_range) | start\_date DESC |
| FraudReviewCase | Filtered (flag\_type, status, reviewer\_id) | SLA proximity ASC, flagged\_at ASC |
| AuditLog | Filtered (actor\_id, action\_type, object\_type, time\_range) | timestamp DESC |
| PrizePayout | Filtered (payout\_status, draw\_id, owner\_type) | created\_at DESC |

### 7.7 Pagination

- **Strategy:** Cursor-based (using id or created\_at as cursor) for all high-volume lists (FawzEntry, AuditLog, Notifications). Offset-based acceptable for low-volume admin lists (Draw, Challenge, FraudReviewCase).  
- **Default Page Size:** 20  
- **Max Page Size:** 100

### 7.8 Localization

- **Supported Languages:** Arabic (primary — Iraqi dialect عامية عراقية), English (admin interface labels only)  
- **RTL Support:** Yes — React Native RTL layout enabled for all consumer screens  
- **Default Language:** Arabic (ar-IQ locale)  
- **Currency:** IQD (Iraqi Dinar) — all amounts displayed with comma formatting (e.g., 1,000,000 IQD)  
- **Date Format:** Arabic locale date display (e.g., الخميس، ١٠ مارس ٢٠٢٦) for consumer; ISO 8601 for admin and API  
- **Timezone Handling:** All times stored as UTC in database; displayed as UTC+3 (Baghdad time) in all consumer and admin interfaces. All schedule triggers execute in UTC+3 reference.  
- **Number Format:** Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) for Arabic locale consumer display; Western numerals in admin interface

### 7.9 Usage Limits & Rate Limiting

| Limit | Value | Applies To | Enforcement |
| :---- | :---- | :---- | :---- |
| Min qualifying transaction | 1,000 IQD (configurable) | ROLE-001/002/003 | Reject — no entries generated |
| Entry generation rate | MAX(1, FLOOR(amount/2,500)) (configurable divisor) | ROLE-001 | Applied at generation |
| Weekly draw payout cap | 1,000,000 IQD per owner per draw (configurable) | ROLE-001/003 | Credit up to cap; hold excess |
| Monthly draw payout cap | 5,000,000 IQD per owner per draw (configurable) | ROLE-001/003 | Credit up to cap; hold excess |
| Retroactive entry cap | 15 per user (configurable) | ROLE-001/002 | Hard cap at batch time |
| Weekly Spark monthly frequency | 1 per calendar month | ROLE-001/002 | Server-side weekly\_spark\_earned\_month check |
| Referral fraud flag threshold | 10 successful referrals/month (configurable) | ROLE-005 | Referrals 11+ → pending\_review |
| Referral link expiry | 30 days (configurable) | ROLE-005 | Auto-expire at click time |
| Referral qualifying tx minimum | 5,000 IQD (configurable) | ROLE-002 (referred) | Referral reward hold; regular entries still generated |
| Monthly jackpot rollover cap | 300,000,000 IQD (configurable) | Monthly Draw | Redistribute excess as Last-5 prizes |
| Duplicate transaction window | Same merchant \+ same amount \+ 60 seconds | ROLE-001 | Reject entry generation |
| Merchant eligibility volume ceiling | 50,000,000 IQD rolling 30-day (configurable) | ROLE-003 | Nightly ineligibility flag |
| Merchant eligibility activity floor | 10 unique customer tx/month (configurable) | ROLE-003 | Nightly ineligibility flag |
| Compliance review threshold | 5,000,000 IQD prize (configurable) | ROLE-001/003 | Auto-hold PrizePayout |
| Admin session idle timeout | 30 minutes (configurable) | ROLE-007/008/009 | Force re-MFA |
| Open disputes per user per month | 3 (configurable) | ROLE-001 | Reject additional submissions with explanation |
| API rate limiting (consumer) | 100 req/min per authenticated user | ROLE-001/002/003 | HTTP 429 with Retry-After header |
| API rate limiting (admin) | 500 req/min per admin session | ROLE-007/008 | HTTP 429 |
| API rate limiting (internal services) | No limit on internal service token endpoints | ROLE-010 | N/A |

---

## 8\. ASSUMPTIONS & INFERENCES LOG

### 8.1 Inferred Decisions \[INFERRED\]

| \# | Decision | Reasoning | Source Signal | Risk |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Fawz tab is an embedded tab within the existing SuperQi mobile app — not a standalone app | Business Document repeatedly references 'Fawz tab inside the SuperQi mobile application' and operational summary states results delivered via 'Fawz tab inside the SuperQi mobile application' | Section 2: "a Fawz tab inside the SuperQi mobile application" | LOW |
| 2 | In-app notification center (FEAT-040) is needed in addition to push notifications | Consumer experience requires history of missed notifications; device notification tray is ephemeral | UX principle: immediate reward feeling; draw-as-ritual implies users check the app regularly | LOW |
| 3 | Draw pre-scaling is automated, not manual | Operational SLA (500K WebSocket connections, 60-second prize credit) requires automated infrastructure scaling; manual scaling would be error-prone | Section DevOps: "pre-scale WebSocket servers and notification infrastructure 30 min before each draw" | LOW |
| 4 | Trailing-digit index is stored on FawzEntry at creation time (not calculated at draw time) | Winner calculation in \< 30 seconds for 100M entries requires pre-indexed digit patterns — full table scan is not viable | Section DevOps: "Winner calculation query must use trailing-digit modulo index" | LOW |
| 5 | Draw results are public (all winning numbers visible post-finalization) | Trust mechanism relies on public verifiability of results; Al Rabiaa TV broadcast makes numbers public during draw | Section XIII: "trust is earned through transparency and public verification" | LOW |
| 6 | Merchant-facing interface is part of the SuperQi merchant app, not a separate app | Merchant workflow is passive (notifications \+ results view); no evidence of separate merchant-only Fawz app | Section III ROLE-003 description: "accepts SuperQi POS payments" | LOW |
| 7 | Consumer tokens inherit SuperQi session — Fawz doesn't issue its own consumer auth tokens | Fawz is built as a feature within SuperQi; managing a separate consumer auth system would duplicate SuperQi's existing auth infrastructure | Section III: "Authentication inherited from SuperQi" across all consumer roles | MEDIUM — if SuperQi auth interface is unavailable or restricted, Fawz cannot authenticate consumers |
| 8 | Notification template management (copy without code deploy) requires an admin-manageable template system | Business requirement for rapid campaign messaging changes; operational agility | Section XVII: "iteration cadence: notification copy bi-weekly" implies frequent changes | LOW |
| 9 | Retroactive seed batch requires 90-day SuperQi transaction history to be accessible to Fawz | Retroactive seeding from SuperQi historical data requires either a data export from SuperQi core or direct DB access | Section VI-D: "sum all eligible spending transactions from last 90 days" | MEDIUM — if SuperQi historical data is not accessible to Fawz in the required format, retroactive seeding cannot proceed |

### 8.2 Assumed Decisions \[ASSUMED\]

| \# | Decision | Reasoning | Industry Basis | Risk | Needs Confirmation |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | \[ASSUMED\] Admin dashboard is a web application (browser-based), not a mobile app | Admin operations require desktop-scale data views (audit logs, draw control, winner export); tablet for operator is IP-whitelisted, suggesting web browser | Standard enterprise admin panel design; fintech admin dashboards are universally web-based | LOW | NO |
| 2 | \[ASSUMED\] Trailing-digit modulo index: FawzEntry stores 10 pre-computed trailing-digit fields (trailing\_1, trailing\_2, ..., trailing\_5) as separate indexed columns for draw winner calculation | MySQL indexed lookup on trailing digits requires pre-computed fields — MySQL's REVERSE() and SUBSTRING() functions are not indexable for billion-row tables | Standard database indexing practice for pattern-match lookups at scale | HIGH — if data schema differs, winner calculation performance will fail at draw scale | YES |
| 3 | \[ASSUMED\] SuperQi Transaction System sends events to Fawz via a webhook or message queue (Kafka/SQS) rather than Fawz polling SuperQi | Event-driven integration is industry standard for real-time loyalty systems; polling would introduce latency inconsistent with 200ms p99 entry generation target | Standard fintech event streaming integration pattern | MEDIUM — integration interface between SuperQi and Fawz must be confirmed with SuperQi engineering | YES |
| 4 | \[ASSUMED\] Fawz Numbers are globally unique within a draw pool, not just unique per user | Draw matching requires unique Fawz Numbers within each draw period to ensure each win is deterministic; industry-standard for number draw games | Prize draw systems (lotteries, sweepstakes) use pool-unique ticket numbers | MEDIUM — if Fawz Numbers are only user-unique, multiple users with the same number would all win from one draw | YES |
| 5 | \[ASSUMED\] Device fingerprint \= hashed combination of IDFA (iOS) / Android Advertising ID \+ device model for referral fraud detection | Business Document specifies 'device fingerprint' but does not specify technical implementation | Standard mobile fraud detection fingerprinting approach | MEDIUM — IDFA availability is reduced on iOS 14+ (requires ATT permission); fallback fingerprint required | YES |
| 6 | \[ASSUMED\] Push notification delivery for the 8M fan-out uses a batch API (not individual API calls per user) | Individual API calls to Firebase/APNs for 8M users in 60 seconds is not feasible; batch sending APIs are standard | Firebase FCM send\_multicast (max 500 tokens/call) and APNs batch — standard high-volume notification pattern | HIGH — push vendor selection (TBD) directly impacts implementation; BatchAPI availability varies by vendor | YES |
| 7 | \[ASSUMED\] ConsumerUser.qi\_card\_number is stored as a one-way hash (SHA-256 or bcrypt) — not plaintext — in the Fawz data layer | Business Document specifies PII-Regulated classification for Qi Card number; data minimization principle | Standard PII handling for financial identifiers in compliance-regulated environments | LOW | NO |
| 8 | \[ASSUMED\] Draw WebSocket service uses Redis pub/sub for digit event fan-out to all connected WebSocket server instances | 500K concurrent connections cannot be served by a single WebSocket server; Redis pub/sub is the standard inter-server fan-out pattern | Socket.IO with Redis adapter, AWS API Gateway WebSocket, or Centrifugo — all use pub/sub for multi-server fan-out | LOW — implementation detail; Redis is already planned for user state management | NO |
| 9 | \[ASSUMED\] Referral link uses a ULID-based short code rather than sequential IDs to prevent enumeration attacks | Referral links at qi.iq/fawz/{code} should not be guessable; sequential IDs or UUIDs would be either guessable or excessively long | Standard URL shortener / referral link security pattern | LOW | NO |
| 10 | \[ASSUMED\] Community challenges (Phase 2\) will use the same Challenge entity structure with scope='city'/'national' — no separate entity required | Business Document describes community challenges as a challenge type (scope=city/national); the Challenge entity already has a scope field | Data model extensibility pattern — re-use existing entities for scoped variants | LOW | NO |

### 8.3 Conflicts Detected \[CONFLICT\]

| \# | Conflict | Location in Source | Resolution Applied | Needs Confirmation |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Draw status lifecycle: Business Document Section V says Draw states are "Scheduled → Pool\_Snapshotted → Live → Finalized → Archived" but the workflows describe a pre-generation step between Pool\_Snapshotted and Live that may be a distinct state | Section V vs Section VI-B Steps 2–4 | Resolution: Pre-generation is a sub-state of Pool\_Snapshotted, not a separate top-level status. State machine reflects this as a step within Pool\_Snapshotted. | NO — low risk, design-level resolution |
| 2 | ROLE-005 (Referrer) is listed as a distinct role in the JSON but the Genome text describes it as a sub-state of ROLE-001 ("any Consumer User who generates and shares a referral link"). This creates ambiguity about whether it requires separate auth or permissions. | Section III (roles) vs. Genome narrative | Resolution: ROLE-005 is treated as a functional sub-role of ROLE-001 — same authentication, same base permissions, additional CREATE permission for referral links. Permission matrix covers it distinctly for clarity but no separate auth is required. | NO |
| 3 | Section 21 specifies monthly jackpot cap of 300M IQD applies to the "monthly jackpot" but it's ambiguous whether weekly jackpot also has a rollover cap | Section 21: "Monthly jackpot rollover cap: 300,000,000 IQD" | Resolution: Cap applies to monthly draw jackpot only (explicitly stated). Weekly jackpot has no stated cap — implemented as uncapped rollover. This should be confirmed with product owner. | YES — if weekly jackpot has no cap, a multi-year unclaimed jackpot could create material prize liability |
| 4 | The referral reward cash (5,000 IQD) to the referrer goes via "SuperQi Wallet API" but it's unclear whether this is the same wallet credit mechanism as prize payouts or a separate referral bonus payment flow | Section VI-E vs Section VI-B Step 9 | Resolution: Same SuperQi Wallet API endpoint used for both prize credits and referral cash rewards, distinguished by a different transaction\_type tag. Referral cash credits create a PrizePayout record with type='referral\_reward'. | YES — if SuperQi Wallet API has separate flows for prizes vs. bonuses, the integration must be designed accordingly |

### 8.4 Gaps from Project Specification

| \# | Gap (from JSON) | Impact on Features | How Handled |
| :---- | :---- | :---- | :---- |
| 1 | Monthly grand draw prize tier values (TBD) | FEAT-005 cannot define exact prize amounts for monthly draw; FEAT-023 cap calculation needs monthly prize context | Deferred — FEAT-005 allows admin to configure prize tiers per draw; no hard-coded amounts. Must be resolved before first monthly draw. |
| 2 | Push notification service vendor (Firebase/APNs — TBD) | FEAT-038 fan-out implementation and FEAT-009 operator notification architecture depend on vendor API | \[ASSUMED\] Firebase FCM as primary vendor given industry standard; implementation designed to be vendor-swappable via notification service interface. Must be confirmed before staging. |
| 3 | Referral reward expiry (suggested 30 days — TBD) | FEAT-017 referral link expiry and FEAT-019 validation window use this value | Implemented as configurable admin parameter (FEAT-035) with default \= 30 days. No impact on feature design — just the default value. |
| 4 | CBI pre-engagement outcome (pending) | Regulatory framing of all consumer-facing copy; determines if any feature must be modified pre-launch | Noted as launch blocker. All consumer copy uses مكافآت تجارية framing by default. FEAT-044 (Sharia disclosure) and content governance rules are implemented to support this framing. No feature re-design required — only copy adjustment risk. |
| 5 | Community challenge batch reward distribution workflow deferred to Phase 2 | Challenge entity already supports scope='city'/'national'; batch reward distribution mechanism not needed in Phase 1 | CommunityChallengeScoree (OBJ-006) entity preserved in data model for Phase 2; community challenge features excluded from MVP scope. |

### 8.5 Open Questions

| \# | Question | Impact if Wrong | Blocking? |
| :---- | :---- | :---- | :---- |
| 1 | What is the exact technical integration interface between SuperQi Transaction System and Fawz? (Webhook POST, Kafka event stream, direct DB read, polling API?) | Wrong integration model could require significant re-architecture of the Entry Generation Engine (FEAT-001) and Retroactive Seeding (FEAT-002) | YES — must confirm with SuperQi engineering before backend scaffold begins |
| 2 | Are Fawz Numbers required to be unique within a draw pool, or only unique per user within a draw pool? | If pool-unique, generation requires uniqueness check against current pool (expensive at 100M entries). If user-unique, multiple users could share a number — does this mean multiple winners or first-match-wins? | YES — determines winner calculation algorithm and entry generation complexity |
| 3 | Does the weekly jackpot rollover have a cap, or is it uncapped? | An uncapped weekly jackpot creates unbounded prize liability risk over time | YES — needs product owner \+ finance sign-off |
| 4 | Is the referral cash reward (5,000 IQD to referrer) processed through the same SuperQi Wallet API as prize payouts, or through a different internal transfer mechanism? | Different APIs require different integration and compliance treatment | YES — needs SuperQi API documentation review |
| 5 | Can the SuperQi 90-day transaction history be made available to Fawz for retroactive seeding? In what format and through what interface? | If 90-day history is not available, retroactive seeding cannot be executed at launch — this is a critical launch feature | YES — must confirm with SuperQi data/engineering team before launch |
| 6 | What is the exact push notification vendor? Firebase FCM / APNs direct / third-party aggregator? | Architecture of FEAT-038 (8M fan-out in 60 seconds) depends heavily on vendor batch API capabilities and rate limits | YES — must be selected and integrated before draw-night infrastructure testing |
| 7 | Will the Fawz Draw winning numbers need to be certified or independently audited by a third party for regulatory or trust purposes beyond the sealed pre-generation mechanism? | May require additional third-party RNG certification or escrow mechanism not currently in scope | NO — proceed with sealed commit architecture; flag for legal review |

---

## 9\. TRACEABILITY MATRIX

| Feature ID | Feature Title | Source Section | Source Quote/Reference |
| :---- | :---- | :---- | :---- |
| FEAT-001 | Qualifying Transaction → Entry Generation | Section 2, Section VI-A, Section 21 | "monitors qualifying spending transactions... deterministically generates cryptographically-random 10-digit prize-draw entry numbers" |
| FEAT-002 | Retroactive Entry Seeding | Section VI-D, Section 21 | "Retroactive seeding mechanism at launch that converts 90 days of historical SuperQi spending into first-draw entries" |
| FEAT-003 | Entry History View | Section VII-B (WF-S-005) | "User opens Fawz tab → 'My Numbers' section → paginated list of all entries" |
| FEAT-004 | Channel Multiplier Configuration | Section VII OBJ-009, Section VI-A Step 4 | "apply channel multiplier: look up channel in channel\_multipliers config table" |
| FEAT-005 | Draw Scheduling & Configuration | Section VI-B, Section VII WF-S-002 | "Admin pre-schedules weekly and monthly draws in dashboard with auto-trigger configuration" |
| FEAT-006 | Draw Entry Pool Snapshot | Section VI-B Step 1 | "T-30 min: Admin triggers entry pool snapshot" |
| FEAT-007 | Winning Number Pre-Generation | Section VI-B Steps 2–3, Section XIII | "3 cryptographic 10-digit numbers generated and stored in sealed/encrypted commit record" |
| FEAT-008 | Live Draw WebSocket Broadcast | Section VI-B Steps 4–6, Section XV | "WebSocket broadcast each digit... \< 500ms latency" |
| FEAT-009 | Draw Digit Entry (Operator Tablet) | Section VI-B Step 4, ROLE-009 Journey, Section XIII | "Studio operator enters digits right-to-left via admin tablet" |
| FEAT-010 | Draw Finalization & Winner Calculation | Section VI-B Steps 7–12 | "Admin triggers POST /admin/draw/{id}/finalize — system executes winner calculation, credits wallet prizes" |
| FEAT-011 | Draw Results Browsing | Section VII-B WF-S-006 | "User opens 'Results' section → past draws listed with winning numbers, user's matched entries, prizes won" |
| FEAT-012 | Challenge Creation & Management | Section VII-B WF-S-001, OBJ-004 | "Admin creates new challenges via dashboard (Challenge Manager): sets type, metric, target, dates, rewards" |
| FEAT-013 | Onboarding Challenge Set | Section III ROLE-002, Section IV ROLE-002 Journey | "4 onboarding challenges: 'أول رقم فوز', 'أول أسبوع', 'ادعي صاحبك', 'شوف النتائج' — together granting 325 entries" |
| FEAT-014 | Weekly Spark Streak Challenge | Section VI-C Step 6, Section 21 | "Weekly Spark: earnable once per calendar month; 250 bonus entries" |
| FEAT-015 | Monthly Rotating Challenge | Section VII-B WF-S-001, Section XV UX | "Monthly rotating challenge themes prevent engagement fatigue" |
| FEAT-016 | Challenge Progress View | Section XV UX, Section VII | "challenge system uses progressive disclosure (progress bars always visible)" |
| FEAT-017 | Golden Ticket Referral Link Generation | Section VI-E Steps 1–2, Section 21 | "Referrer accesses referral section in Fawz tab. System displays unique referral code with 30-day expiry" |
| FEAT-018 | Referral Attribution & Click Tracking | Section VI-E Steps 2–3, Section IX | "First-click attribution recorded; subsequent links for same user ignored" |
| FEAT-019 | Referral Fraud Validation & Reward | Section VI-E Steps 5–7, Section XIII, Section 21 | "genuinely new (no prior Fawz entries, no SuperQi tx in last 180 days), different Qi Card, different device fingerprint" |
| FEAT-020 | Referral History View | Section III ROLE-005 can\_read | "own referral history, own referral reward status, referral count this month" |
| FEAT-021 | Merchant Eligibility Engine | Section VII-B WF-S-003, Section III ROLE-003 | "Nightly batch job recalculates each merchant's rolling 30-day receiving volume and unique customer transaction count" |
| FEAT-022 | Merchant Shared Entry View | Section III ROLE-003 Journey Steps 4–6 | "Merchant accumulates entries passively across the week" |
| FEAT-023 | Prize Wallet Credit Execution | Section VI-B Step 9, Section IX, Section XV | "automatically crediting cash prizes to winning SuperQi wallets within 60 seconds of draw completion" |
| FEAT-024 | Jackpot Rollover Management | Section 21, Section VI-B Step 11 | "jackpot\_rollover cap: 300,000,000 IQD; redistribute excess as additional last-5 tier prizes" |
| FEAT-025 | Prize & Win History View | Section III Consumer can\_read | "own prize win history" |
| FEAT-026 | High-Value Winner Hold | Section VII WF-E-002, Section XIV | "High-value winners (last-7 match and above) subject to identity verification before payout" |
| FEAT-027 | Automated Fraud Flagging | Section XIII, Section VII abuse\_prevention | "referral\_count\_month \> 10 (referral farming flag)... Entry volume \> 200% of projected per user per day" |
| FEAT-028 | Fraud Review Queue | Section VII WF-E-001, ROLE-008 Journey | "Fraud Review Queue... 48-hour SLA" |
| FEAT-029 | Fraud Case Decision | Section VII WF-E-001 Steps 4–5 | "APPROVE / REJECT / ESCALATE — 48-hour SLA... decision must be logged with reasoning notes" |
| FEAT-030 | Account Suspension Management | Section VII WF-E-005, Section XIII | "account suspension (suspension) used rather than reward clawback" |
| FEAT-031 | Dispute Submission | Section XXIII Disputes | "User initiates dispute via SuperQi support channel" |
| FEAT-032 | Dispute Resolution | Section XXIII Disputes | "Auto-resolved: 2 hours. Platform Admin review: 24 hours" |
| FEAT-033 | Admin Authentication | Section XIII identity\_model, ROLE-007 journey | "Admin token \+ IP whitelist \+ MFA... separate from consumer auth" |
| FEAT-034 | Admin Dashboard & Budget Monitor | Section XVII Analytics, Section DevOps observability | "real-time draw dashboard... Budget monitor: real-time running total of prize costs" |
| FEAT-035 | System Configuration Management | Critical Reminder \#20, Section 21 | "All numeric thresholds MUST be modeled as configurable parameters" |
| FEAT-036 | Winner Export for Media | Section VII-B WF-S-007 | "Admin exports winner contact data (name, phone, city) for last-7+ tier winners after each draw" |
| FEAT-037 | Audit Log Viewer | Section XIII audit\_expectations | "AuditLog table is append-only... 7 years retention" |
| FEAT-038 | Push Notification Fan-out | Section XV scale (8M notifications), Section XVII | "8M push notifications within 60 seconds" |
| FEAT-039 | Notification Preferences | Section XIV consent, Section XV | "Explicit opt-in for Fawz-specific push notifications at first launch of Fawz tab" |
| FEAT-040 | In-app Notification Center | Section XV UX principles | \[INFERRED\] from UX: immediate reward feeling; missed notification recovery |
| FEAT-041 | Fawz Tab Home Screen | Section 2 (Operational Summary), Section XV UX | "results delivered via... a Fawz tab inside the SuperQi mobile application" |
| FEAT-042 | User Fawz Profile Extension | Section V OBJ-010, Section III tier system | "weekly\_unique\_days, monthly\_unique\_days, weekly\_spark\_earned\_month, lifetime\_tx, is\_new" |
| FEAT-043 | Draw Share / Winner Social Export | Section XV UX (winning designed to be shared), Section XVIII growth | "win notification screen is a first-class social artefact with one-tap share button for WhatsApp/Instagram" |
| FEAT-044 | Consent & Media Permission | Section XIV consent\_requirements | "Explicit consent form before any winner's name, image, or story is used in media" |

**Business Document Sections NOT Covered by Any Feature (and Reason):**

| Uncovered Section | Reason |
| :---- | :---- |
| Section XVIII Growth (influencer programme, OOH billboards, EGi management) | Out of scope — marketing campaign management, not a product feature |
| Section XIX Organizational Ownership | Non-functional — staffing/org structure |
| Section XX Ecosystem / Third-party failure scenarios | Covered by DevOps NFRs and FEAT-023 retry logic; not a distinct feature |
| Section XXI Spec Freeze Governance / Approval signatories | Governance process — not a software feature |
| Section XXII AAG Readiness Scores | Governance metadata — not a software feature |
| Section XII AI Intent (Phase 2 fraud ML) | Deferred to Phase 2 — outside MVP scope |
| GCC Phase 3 expansion | Deferred — outside MVP scope |
| Fawz Certified Merchant Program (multiplier onboarding, decay) | Phase 1.5 — excluded from MVP |
| Community Challenges (scope=city/national, batch rewards) | Phase 2 — excluded from MVP |
| Fawz Ambassador Program | Phase 2 — excluded from MVP |
| Golden Receipts / merchant-to-consumer referrals | Phase 1.5 — excluded from MVP |

---

## END OF DOCUMENT

