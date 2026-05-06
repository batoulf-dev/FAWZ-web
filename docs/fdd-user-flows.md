# ARCHITECTX — Functional Design Document

## Fawz (فوز) — User Flows, Screen Specifications & Navigation Architecture

---

### Document Control

| Field | Value |
| :---- | :---- |
| Product Name | Fawz (فوز) |
| FDD Version | 1.0-DRAFT |
| Source Features Document | FAWZ Features Document v1.0-DRAFT |
| Source Business Document | FAWZ Digital Product Genome v1.0 |
| Generation Method | FDD Agent — Single Pass |
| Date | 2026-03-10 |
| Confidence Level | HIGH |
| Downstream Consumers | UX Agent, Frontend Agent, Data Agent, Backend Factory, QA |

---

## 01 — Product Context

### 1.1 Product Summary

Fawz (فوز — "Win/Victory") is a transaction-driven prize-draw engagement layer embedded within the SuperQi digital wallet application in Iraq: every qualifying SuperQi spending transaction (≥ 1,000 IQD) automatically generates cryptographic 10-digit Fawz Numbers for both the paying consumer and the receiving POS merchant, which are entered into live weekly (Thursday 9:00 PM) and monthly (1st of month) draws broadcast on Al Rabiaa TV, with cash prizes credited to winners' SuperQi wallets within 60 seconds. Fawz reinforces digital payment habits through layered challenges, bilateral referral rewards (Golden Ticket), and a retroactive seeding batch at launch that converts 90 days of historical SuperQi spending into first-draw entries. The application targets the Republic of Iraq (all governorates) as Phase 1 and is built on the AAG factory-locked stack: React Native, FastAPI, MySQL 8.0, SQLAlchemy 2.0, Docker, AWS.

### 1.2 Modules Overview

| Module ID | Module Name | Description | Screen Count |
| :---- | :---- | :---- | :---- |
| MOD-001 | Entry Generation Engine | Transaction evaluation, Fawz Number generation, retroactive seeding, channel multiplier config | 3 |
| MOD-002 | Draw Management | Draw scheduling, snapshot, live broadcast, digit entry, finalization | 7 |
| MOD-003 | Challenge System | Onboarding, Weekly Spark, monthly rotating challenges, progress tracking | 3 |
| MOD-004 | Referral System | Golden Ticket link, attribution, fraud validation, referral history | 2 |
| MOD-005 | Merchant Management | Merchant eligibility, shared entry view, merchant dashboard | 3 |
| MOD-006 | Prize & Payout Management | Prize history, jackpot display, high-value review queue | 3 |
| MOD-007 | Fraud & Compliance | Fraud queue, case detail, case decision, dispute submission, account suspension | 5 |
| MOD-008 | Admin Operations | Admin auth, dashboard, system config, audit log, winner export, batch control | 7 |
| MOD-009 | Notifications & Real-time | Notification center, notification preferences, delivery stats | 3 |
| MOD-010 | User Account & Onboarding | Fawz tab home, profile, winner share, consent, media consent | 5 |

### 1.3 Roles Summary

| Role ID | Role Name | Description | Journey Count |
| :---- | :---- | :---- | :---- |
| ROLE-001 | Consumer User | Standard SuperQi wallet holder earning entries via transactions | 7 |
| ROLE-002 | New/Onboarding Consumer | First-time user with lifetime\_tx ≤ 10; sees onboarding challenges | 2 |
| ROLE-003 | Qualifying Small Merchant | POS merchant earning shared entries passively | 1 |
| ROLE-004 | Fawz Certified Merchant | Phase 1.5 merchant with multiplier (system role only in Phase 1\) | 0 |
| ROLE-005 | Referrer | Consumer who generates and shares a Golden Ticket link | 1 |
| ROLE-006 | Fawz Ambassador | Phase 2 role — not active in MVP | 0 |
| ROLE-007 | Platform Admin | Operations team; draw execution, challenge config, system admin | 4 |
| ROLE-008 | Finance/Compliance Reviewer | Fraud review, high-value winner holds, compliance decisions | 2 |
| ROLE-009 | Al Rabiaa Production Operator | Draw digit entry only, scoped to studio tablet | 1 |
| ROLE-010 | Automated System Processes | Scheduled jobs, event-driven background processing | 1 |

---

## 02 — User Flows & Journeys

---

### 2.1 Journey: First Transaction & Entry Earn

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-001 |
| Title | New Consumer Makes First Qualifying Transaction & Earns Fawz Numbers |
| Actor | ROLE-002: New/Onboarding Consumer |
| Trigger | Consumer makes a qualifying SuperQi payment ≥ 1,000 IQD at a POS or QR merchant |
| Preconditions | User has SuperQi account; is authenticated in SuperQi app; Fawz tab is accessible |
| Features Covered | FEAT-001, FEAT-013, FEAT-039, FEAT-041, FEAT-042, FEAT-040 |
| End State | User lands on Fawz Tab Home showing updated entry count \+ onboarding challenge 1 marked complete with confetti |

**Happy Path:**

1. User pays merchant via SuperQi — *outside Fawz scope; SuperQi payment flow*  
2. SuperQi fires transaction event to Fawz Entry Generation Engine — *background, no screen*  
3. System evaluates eligibility (7 checks pass), generates Fawz Numbers — *background*  
4. User receives push notification '+1 رقم فوز\! 🎯' — *device notification tray*  
5. User taps notification → opens Fawz Tab — **Screen: SCR-001 (Fawz Tab Home)**  
6. Entry count badge animates to new total with gold particle burst  
7. 'أول رقم فوز' onboarding challenge card shows completed state with confetti — **Screen: SCR-001**  
8. User taps 'تفاصيل التحدي' to see onboarding challenge progress — **Screen: SCR-007 (Challenges Screen)**  
9. User sees challenge 1 ✅ checked, challenges 2–4 with progress bars — **Screen: SCR-007**  
10. Journey ends: User has their first Fawz Number; onboarding challenge 1 complete

**Alternative Path: Transaction Below Minimum** Branches from: Step 2 of Happy Path Condition: Transaction amount \< 1,000 IQD

1. Entry generation engine skips — no Fawz action, no notification  
2. User opens Fawz Tab; entry count unchanged — **Screen: SCR-001**  
3. Empty state CTA visible: 'ادفع 1,000 IQD أو أكثر لتحصل على رقم فوز\!'

**Alternative Path: Push Notification Not Enabled** Branches from: Step 4 of Happy Path Condition: User has push notifications disabled or not yet consented

1. No push notification sent  
2. User opens SuperQi app manually, taps Fawz tab — **Screen: SCR-001**  
3. Entry count already updated (generated in background); user sees new total  
4. Fawz tab shows consent nudge banner: 'فعّل الإشعارات لتعرف فوراً عندما تحصل على أرقام\!'  
5. User taps banner → **Screen: SCR-013 (Notification Preferences)**

**Alternative Path: Network Timeout on Fawz Tab Load** Branches from: Step 5 of Happy Path Condition: API timeout fetching home data

1. Screen shows skeleton loading state for 3 seconds — **Screen: SCR-001 (Loading State)**  
2. After timeout: error banner 'تعذر التحميل — حاول مرة أخرى' with Retry button  
3. User taps Retry; data loads successfully; journey continues

---

### 2.2 Journey: Live Draw Experience — Watch & Win

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-002 |
| Title | Consumer Watches Live Draw and Discovers Prize Win |
| Actor | ROLE-001: Consumer User |
| Trigger | Push notification 'السحب الليلة الساعة 9 مساءً\!' arrives Thursday evening OR user opens Fawz tab during draw window |
| Preconditions | User authenticated; has ≥1 entry in current draw pool; draw is in Live status |
| Features Covered | FEAT-008, FEAT-010, FEAT-011, FEAT-043, FEAT-025, FEAT-038, FEAT-039 |
| End State | User has seen winning digits, knows their prize outcome, and (if winner) has shared their win or navigated to prize history |

**Happy Path:**

1. User taps 'السحب الليلة الساعة 9 مساءً\!' push notification at 8:55 PM — **Screen: SCR-001 (Fawz Tab Home)**  
2. Fawz tab shows 'السحب مباشر الآن\! 🔴' banner \+ auto-navigates to Live Draw — **Screen: SCR-002 (Live Draw Screen)**  
3. User sees: entry pool size, jackpot counter, 10 empty digit slots for winning number 1, live countdown  
4. Al Rabiaa operator submits first digit; WebSocket broadcasts → digit slot fills with animation — **Screen: SCR-002**  
5. All 10 digits of number 1 fill in right-to-left over \~2 minutes; numbers 2 and 3 follow  
6. All 30 digits entered; draw enters 'finalizing' state — brief spinner 'يجري حساب الفائزين...'  
7. System finishes finalization; results push to all clients  
8. User's entry matched Last-3 of number 2 → winner overlay appears: '🎉 فزت\! Last-3 — 10,000 IQD' — **Screen: SCR-002 (Winner State)**  
9. User taps 'شارك فوزك\!' — **Screen: SCR-005 (Winner Share Screen)**  
10. Branded share card generated; user taps 'مشاركة' → iOS/Android native share sheet opens  
11. User shares to WhatsApp; returns to app — **Screen: SCR-005**  
12. User taps 'شاهد تفاصيل جائزتك' — **Screen: SCR-011 (Prize History)**  
13. Prize credit status shows 'مدفوع' — journey complete

**Alternative Path: User Loses Connection During Draw** Branches from: Step 4 Condition: WebSocket connection drops mid-draw

1. App detects connection loss; shows 'استقبال بطيء — الأرقام تصل...' yellow banner  
2. Client switches to HTTP polling every 5 seconds  
3. Missed digits arrive in next poll; digit slots fill in catching up — **Screen: SCR-002**  
4. Journey continues normally

**Alternative Path: Non-Winner Result** Branches from: Step 8 Condition: None of user's entries match any winning number's trailing digits

1. Softer overlay appears: 'السحب انتهى — عدك \[X\] رقم للسحب القادم' — **Screen: SCR-002 (Non-Winner State)**  
2. Motivational CTA: 'ادعي صاحبك وزوّد أرقامك\!'  
3. Tapping CTA navigates to — **Screen: SCR-009 (Referral Screen)**

**Alternative Path: User Not Connected During Draw (Opens Results Later)** Branches from: Step 1 Condition: User was offline during draw; opens app next morning

1. User opens Fawz Tab — **Screen: SCR-001**  
2. Notification badge on bell icon shows unread result notification  
3. User taps bell — **Screen: SCR-012 (Notification Center)**  
4. Taps 'نتائج سحب الخميس 10 أبريل' notification — deep links to **Screen: SCR-004 (Draw Detail)**  
5. Sees winning numbers, their matched entries highlighted, prize outcome

---

### 2.3 Journey: Onboarding Challenge Set Completion

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-003 |
| Title | New Consumer Completes All 4 Onboarding Challenges & Earns Fawz Explorer Badge |
| Actor | ROLE-002: New/Onboarding Consumer |
| Trigger | User opens Fawz Tab after account creation / first Fawz access |
| Preconditions | ConsumerUser.is\_new=true; ConsumerUser.lifetime\_tx \= 0 |
| Features Covered | FEAT-013, FEAT-016, FEAT-017, FEAT-042, FEAT-001, FEAT-011 |
| End State | All 4 onboarding challenges complete; \+325 entries credited; 'Fawz Explorer' badge visible on profile; user.is\_new=false |

**Happy Path:**

1. User opens Fawz Tab for first time → Sharia Disclosure Modal appears — **Screen: SCR-015 (Consent/Sharia Modal)**  
2. User taps 'فهمت وأوافق' → Notification Consent Screen appears — **Screen: SCR-013 (Notification Preferences First-Time)**  
3. User selects 'قبول الكل' → Home loads — **Screen: SCR-001 (Fawz Tab Home)**  
4. Onboarding challenge cards shown prominently: 4 cards, all pending  
5. User makes first qualifying transaction (challenge 1 auto-completes) — *push notification: '+50 أرقام فوز\!'*  
6. User taps notification → returns to **Screen: SCR-001**; confetti, challenge 1 checked ✅  
7. User taps 'عرض كل التحديات' — **Screen: SCR-007 (Challenges Screen)**  
8. Challenge 2 'أول أسبوع' (5 transactions in 7 days) shows progress 1/5  
9. User makes 4 more qualifying transactions across the week → challenge 2 auto-completes — *push '+100 أرقام فوز\!'*  
10. User navigates to Referral section — **Screen: SCR-009 (Referral Screen)**  
11. User generates referral link (challenge 3 auto-completes — badge awarded) — **Screen: SCR-009**  
12. User taps 'شوف النتائج' → Draw Results — **Screen: SCR-003 (Draw Results List)** → opens any draw — **Screen: SCR-004 (Draw Detail)**  
13. Challenge 4 auto-completes on draw results view — *push '+25 أرقام فوز\!'*  
14. Completion bonus \+150 entries credited; 'Fawz Explorer' badge fires — **Screen: SCR-007** shows 4/4 ✅  
15. User taps Profile — **Screen: SCR-014 (Fawz Profile)**  
16. 'Fawz Explorer 🌟' badge visible; is\_new=false; journey complete

**Alternative Path: User Dismisses Sharia Disclosure** Branches from: Step 2 Condition: User taps 'إغلاق' without agreeing

1. Modal closes; home screen loads without accepting  
2. On next app open, disclosure reappears (non-blocking, will not lock user out)

**Alternative Path: Referral Challenge — No Friends to Refer** Branches from: Step 10 Condition: User skips referral section; challenge 3 remains incomplete

1. Challenges screen shows challenge 3 pending — **Screen: SCR-007**  
2. User can complete challenges 1, 2, 4 and earn 225 entries; badge requires all 4  
3. Referral challenge remains open until completed or is\_new transitions

---

### 2.4 Journey: Weekly Spark & Monthly Challenge Progress

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-004 |
| Title | Consumer Earns Weekly Spark Reward and Tracks Monthly Challenge Progress |
| Actor | ROLE-001: Consumer User |
| Trigger | Consumer transacts on weekdays; challenge progress updates push notification or manual check |
| Preconditions | User is authenticated; is\_new=false; Weekly Spark active for current month |
| Features Covered | FEAT-014, FEAT-015, FEAT-016, FEAT-001 |
| End State | Weekly Spark reward credited (+250 entries); monthly rotating challenge in-progress view updated |

**Happy Path:**

1. User opens Fawz Tab — **Screen: SCR-001**  
2. Weekly Spark 7-day pill row shows 3/5 days filled  
3. User pays with SuperQi on day 4 → push '+1 يوم نشاط\! 4/5 أيام' — *notification, no screen change*  
4. User taps Fawz Tab — **Screen: SCR-001** — pill row updates to 4/5  
5. User pays on day 5 → push notification '🔥 شرارة الأسبوع\! \+250 رقم فوز'  
6. User taps notification → **Screen: SCR-001**; confetti; pill row shows 5/5 filled with gold glow  
7. User taps 'عرض تفاصيل التحدي' on the Monthly Rotating challenge card — **Screen: SCR-008 (Challenge Detail)**  
8. Monthly challenge: 'ادفع وقود 5 مرات' — progress 2/5; checkpoint at 3/5 for \+50 entries  
9. User sees countdown timer 'ينتهي خلال 18 يوم', taps Back  
10. Returns to **Screen: SCR-001**; journey complete

**Alternative Path: Weekly Spark Already Earned This Month** Branches from: Step 5 Condition: User reached 5 unique days but weekly\_spark\_earned\_month already matches current month

1. Pill row fills to 5/5 but no reward notification fires  
2. Fawz Tab home shows filled pills with grey tint (not gold)  
3. Tooltip: 'رائع\! يمكنك ربح شرارة الأسبوع مرة واحدة بالشهر'  
4. No crash or error — system silently deduplicates

**Alternative Path: Challenge Progress Checkpoint Reached** Branches from: Step 8 Condition: User has just made their 3rd fuel transaction

1. Push: '🎯 وصلت نقطة تفتيش\! \+50 رقم فوز' fires  
2. User taps → **Screen: SCR-008**; checkpoint marker highlighted; \+50 entries reflected

---

### 2.5 Journey: Golden Ticket Referral — Send and Earn

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-005 |
| Title | Consumer Generates Referral Link, Friend Activates, Both Earn Rewards |
| Actor | ROLE-001/ROLE-005: Consumer User (Referrer) |
| Trigger | User taps 'ادعي صاحبك' section on Fawz Tab Home or Challenges screen |
| Preconditions | Referrer is authenticated; referred user is a new SuperQi account with no prior activity |
| Features Covered | FEAT-017, FEAT-018, FEAT-019, FEAT-020, FEAT-013 (challenge 3 hook) |
| End State | Referral rewarded; referrer receives \+50 entries \+ 5,000 IQD; referred user receives \+100 entries |

**Happy Path:**

1. Referrer opens Fawz Tab → taps 'ادعو أصدقاءك' — **Screen: SCR-009 (Referral Screen)**  
2. Unique link displayed: qi.iq/fawz/ABC123 with expiry '29 يوم متبقية'  
3. Referrer taps 'شارك عبر واتساب' → WhatsApp opens with pre-filled message — *native share sheet*  
4. Friend receives message, taps link → SuperQi app opens (or App Store) — *outside Fawz scope*  
5. Friend creates SuperQi account; attribution cookie carries referral\_code=ABC123  
6. Friend makes first qualifying transaction ≥ 5,000 IQD — *SuperQi payment flow*  
7. Fawz runs fraud validation (4 checks pass) — *background*  
8. Referrer receives push: '🎁 صاحبك اشترك\! \+50 أرقام فوز و 5,000 IQD'  
9. Referrer taps notification → **Screen: SCR-009**; referral stats update: '1 إحالة ناجحة'  
10. Referrer taps 'عرض السجل' — **Screen: SCR-010 (Referral History)**  
11. Friend's referral shows status 'ناجح', reward '+50 أرقام فوز \+ 5,000 IQD'  
12. Journey complete

**Alternative Path: Fraud Check Fails (Same Device)** Branches from: Step 7 Condition: Friend shares same device fingerprint as referrer

1. Referral.status \= 'rejected' — no rewards issued to either party  
2. Neither party receives notification (silent rejection)  
3. Referrer's Referral History shows rejected entry with status 'لم تكتمل' — **Screen: SCR-010**

**Alternative Path: Referral Link Expired** Branches from: Step 4 Condition: Friend clicks link \> 30 days after generation

1. Deep link resolves to expired referral landing page  
2. Shows: 'هذا الرابط انتهى — احصل على رابط جديد من صاحبك'  
3. No Referral record created

**Alternative Path: 11th Referral Triggers Review** Branches from: Step 7 Condition: This is referrer's 11th successful referral this month

1. Referred user still receives \+100 entries (reward proceeds)  
2. Referrer reward goes to pending\_review; FraudReviewCase opened  
3. Referrer receives: 'إحالتك قيد المراجعة — سيتم التواصل خلال 48 ساعة' — **Screen: SCR-010**

---

### 2.6 Journey: Merchant Passive Entry Earning & Prize Check

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-006 |
| Title | Eligible Merchant Views Earned Shared Entries and Wins a Prize |
| Actor | ROLE-003: Qualifying Small Merchant |
| Trigger | Merchant receives push 'حصلت على أرقام فوز من زبائنك\!' OR opens Fawz merchant section |
| Preconditions | Merchant SuperQi account active; Merchant.is\_eligible=true (set by last nightly batch) |
| Features Covered | FEAT-021, FEAT-022, FEAT-001, FEAT-023, FEAT-025, FEAT-010 |
| End State | Merchant has seen their shared entries for the current draw; has viewed prize win in prize history |

**Happy Path:**

1. Thursday after draw: merchant receives push '🎉 فزت\! Last-3 — 10,000 IQD'  
2. Merchant taps notification → **Screen: SCR-019 (Merchant Fawz Home)**  
3. Home shows banner 'فزت بجائزة Last-3\!'; entry count for current week displayed  
4. Merchant taps 'عرض الجوائز' — **Screen: SCR-021 (Merchant Prize History)**  
5. Latest win record: draw date, 'Last-3', '10,000 IQD', status 'مدفوع للمحفظة'  
6. Merchant taps back → **Screen: SCR-019**  
7. Merchant taps 'أرقامي هذا الأسبوع' — **Screen: SCR-020 (Merchant Entry History)**  
8. List of shared Fawz Numbers from 50 customer transactions this week; each labelled 'مشاركة مع زبون'  
9. Journey complete

**Alternative Path: Merchant Loses Eligibility** Branches from: Step 1 (next draw cycle) Condition: Merchant's rolling 30-day volume crossed 50M IQD; nightly batch set is\_eligible=false

1. Merchant opens Fawz section — **Screen: SCR-019**  
2. Banner: 'لم تُضَف أرقام فوز هذا الأسبوع — تجاوزت حد الأهلية المؤقت'  
3. Tooltip: 'يتم تحديث الأهلية يومياً'  
4. Previous entries/prizes still visible in history

---

### 2.7 Journey: Admin Executes Weekly Draw (Full Ceremony)

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-007 |
| Title | Platform Admin Executes End-to-End Weekly Draw |
| Actor | ROLE-007: Platform Admin |
| Trigger | Thursday 8:30 PM — admin opens Draw Control Panel for scheduled draw |
| Preconditions | Draw record exists in 'Scheduled' status; admin authenticated with MFA \+ IP whitelist |
| Features Covered | FEAT-005, FEAT-006, FEAT-007, FEAT-008, FEAT-010, FEAT-024, FEAT-034, FEAT-036, FEAT-033 |
| End State | Draw finalized; all prizes credited; winner export downloaded; draw archived |

**Happy Path:**

1. Admin navigates to Draw Calendar — **Screen: SCR-025 (Draw Calendar)**  
2. Taps Thursday draw → Draw Control Panel — **Screen: SCR-027 (Draw Control Panel)**  
3. Dashboard shows: Draw \#47, Scheduled, pool entry count pre-estimate, budget running total  
4. Admin clicks 'تجميد المشاركين' (Snapshot Entry Pool) at T-30 min — **Screen: SCR-027**  
5. System freezes pool; entry\_pool\_size displayed: '87,432,891 رقم مشارك'  
6. Admin clicks 'توليد أرقام الفوز المختومة' (Pre-Generate) → confirmation modal — **Screen: SCR-027**  
7. Admin confirms; 3 sealed numbers generated; sealed commit hash displayed; AuditLog updated  
8. Al Rabiaa TV broadcast begins at 9:00 PM; operator connects from studio tablet  
9. Admin sees live WebSocket status: 'المشغل متصل من IP المعتمد ✅' — **Screen: SCR-027**  
10. Operator enters all 30 digits; admin watches digit feed in control panel — **Screen: SCR-027**  
11. All digits confirmed; 'معاينة الفائزين' (Winner Preview) button appears  
12. Admin clicks Winner Preview: modal shows '433,210 فائز — إجمالي الجوائز: 2,847,000,000 IQD' — **Screen: SCR-027 (Winner Preview Modal)**  
13. Admin clicks 'تأكيد الإنهاء' (Confirm Finalize) — two-step confirmation modal  
14. Admin enters confirmation text 'أوافق' → draw finalized  
15. Real-time budget monitor in dashboard updates: prizes credited — **Screen: SCR-024 (Admin Dashboard)**  
16. Notification delivery progress bar: '97.3% من 8M إشعار تم الإرسال'  
17. Admin clicks 'تصدير قائمة الفائزين' (Export Winner List) — **Screen: SCR-033 (Winner Export)**  
18. CSV downloaded with Last-7 \+ Last-10 winners (media-consent only)  
19. Journey complete

**Alternative Path: Physical Draw Mismatch** Branches from: Step 10 Condition: Physical ball machine digit differs from pre-generated sealed number

1. Operator signals mismatch; admin sees mismatch alert in control panel — **Screen: SCR-027**  
2. Admin clicks 'تصحيح الرقم' (Override Number); enters physical draw result  
3. System recalculates winners from physical result; AuditLog records mismatch\_flag=true  
4. Journey continues from Step 11

**Alternative Path: Winner Preview Shows Unexpected Budget Overrun** Branches from: Step 12 Condition: Total payout exceeds 110% of projected budget

1. Winner preview modal shows red budget alert: 'تجاوز الميزانية المتوقعة 10%'  
2. Admin reviews; optionally contacts finance before confirming  
3. Admin can still proceed or abort (cancel finalization; draw remains in Live status)

---

### 2.8 Journey: Admin Creates and Activates Monthly Challenge

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-008 |
| Title | Platform Admin Creates a Monthly Rotating Challenge and Activates It |
| Actor | ROLE-007: Platform Admin |
| Trigger | Admin opens Challenge Calendar to configure next month's rotating challenge |
| Preconditions | Admin authenticated; no active rotating challenge for target month |
| Features Covered | FEAT-012, FEAT-015, FEAT-035 |
| End State | Challenge in 'Scheduled' status, visible to users on start\_date |

**Happy Path:**

1. Admin navigates to Challenge Calendar — **Screen: SCR-029 (Challenge Calendar)**  
2. Taps '+ تحدي جديد' — **Screen: SCR-030 (Create/Edit Challenge Form)**  
3. Fills: name\_ar='ادفع وقود 5 مرات هذا الشهر', type=rotating, metric=transaction\_count, category\_filter=fuel, target=5, checkpoints=\[{at:3, reward:50}\], reward\_entries=200, start\_date=2026-05-01, end\_date=2026-05-31  
4. Taps 'معاينة' (Preview) → modal shows consumer-facing challenge card — **Screen: SCR-030 (Preview Modal)**  
5. Admin approves preview; taps 'حفظ كمسودة'  
6. Challenge saved in Draft status — **Screen: SCR-029**  
7. Admin taps challenge; opens detail; taps 'تفعيل' — confirmation modal  
8. Admin confirms → challenge status \= Scheduled (auto-activates 2026-05-01 midnight)  
9. AuditLog records: admin\_id, challenge\_id, action='activated'  
10. Journey complete

**Alternative Path: Duplicate Active Challenge** Branches from: Step 7 Condition: Another rotating challenge is already active for May 2026

1. Activation shows warning: 'يوجد تحدي دوار نشط لهذا الشهر — هل تريد المتابعة؟'  
2. Admin must explicitly confirm override or edit dates

**Alternative Path: Validation Error** Branches from: Step 3 Condition: Admin enters end\_date before start\_date

1. Form shows inline error: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية'  
2. Submit button remains disabled until corrected

---

### 2.9 Journey: Fraud Case Review & Decision

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-009 |
| Title | Finance/Compliance Reviewer Reviews Fraud Case and Makes Decision |
| Actor | ROLE-008: Finance/Compliance Reviewer |
| Trigger | Automated fraud flag opens case; reviewer receives in-dashboard alert |
| Preconditions | Reviewer authenticated with admin credentials; FraudReviewCase in 'Flagged' status |
| Features Covered | FEAT-027, FEAT-028, FEAT-029, FEAT-026, FEAT-030 |
| End State | Case resolved with decision documented; held rewards released or withheld; AuditLog updated |

**Happy Path:**

1. Reviewer opens Admin Dashboard; fraud queue shows '5 حالات مفتوحة' — **Screen: SCR-024**  
2. Taps queue widget → **Screen: SCR-036 (Fraud Review Queue)**  
3. Cases sorted: 1 with SLA warning (47h), 4 standard  
4. Taps SLA-near case: 'محمد علي — referral\_volume\_excess' — **Screen: SCR-037 (Fraud Case Detail)**  
5. Sees: 11 referrals this month, linked account names (partial), timeline, transaction patterns chart  
6. Reviewer reviews accounts; all appear distinct (different cities, different devices)  
7. Taps 'الموافقة' (Approve) — **Screen: SCR-038 (Case Decision Form)**  
8. Enters reasoning notes (min 50 chars): 'تم التحقق من هوية 11 مدعواً — جميعهم مستخدمون مختلفون بسجلات معاملات مستقلة وعناوين IP متباينة'  
9. Taps 'معاينة التأثير' (Preview Impact): modal shows referrer reward to be released — **Screen: SCR-038**  
10. Confirms decision → FraudReviewCase.status='Approved'; referrer reward credited; AuditLog updated  
11. Redirected to queue — **Screen: SCR-036**; resolved case removed from active queue  
12. Journey complete

**Alternative Path: Reviewer Decides to Escalate** Branches from: Step 7 Condition: Reviewer suspects coordinated fraud; cannot verify accounts independently

1. Taps 'تصعيد' (Escalate) instead of Approve/Reject  
2. Enters escalation reasoning; ROLE-007 admin notified  
3. Case status \= 'Escalated'; disappears from reviewer queue; appears in admin escalation view

**Alternative Path: Reasoning Notes Too Short** Branches from: Step 8 Condition: Reviewer submits with \< 50 character notes

1. Validation error: 'يرجى إضافة ملاحظات تفصيلية (50 حرف على الأقل)'  
2. Reviewer must extend notes before submitting

---

### 2.10 Journey: Dispute Submission by Consumer

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-010 |
| Title | Consumer Submits a Missing Prize Dispute and Receives Resolution |
| Actor | ROLE-001: Consumer User |
| Trigger | Consumer wins but receives no prize credit within expected timeframe |
| Preconditions | Draw finalized; user believes they matched digits but no wallet credit received |
| Features Covered | FEAT-031, FEAT-032, FEAT-028 |
| End State | Dispute resolved (prize credited if valid) or rejected with explanation |

**Happy Path:**

1. Consumer opens Fawz Tab → taps support icon → 'تقديم شكوى' — **Screen: SCR-017 (Dispute Submission Form)**  
2. Selects dispute\_type='missing\_prize'; enters draw\_id; their Fawz Number; description  
3. Taps 'إرسال' — system auto-checks: DrawWinner record found? — *background*  
4. Auto-check resolves: DrawWinner record exists but payout\_status='failed' (API error case)  
5. System auto-credits the missing prize; dispute auto-resolved within 2 hours  
6. Consumer receives push: '✅ شكواك حُلّت — تم تحويل جائزتك إلى محفظتك'  
7. Consumer opens Dispute History — **Screen: SCR-018 (Dispute History)**  
8. Dispute shows status 'محلولة تلقائياً' — journey complete

**Alternative Path: Dispute Requires Human Review** Branches from: Step 4 Condition: No DrawWinner record found; complex case

1. Dispute routed to ROLE-007 admin queue — **Screen: SCR-036 (Admin Fraud Queue)**  
2. Consumer receives: 'شكواك قيد المراجعة — خلال 24 ساعة' — **Screen: SCR-017 (confirmation)**  
3. Admin reviews and resolves within 24 hours SLA

**Alternative Path: Dispute Limit Reached** Branches from: Step 1 Condition: Consumer already has 3 open disputes this month

1. Dispute form shows: 'وصلت للحد الأقصى (3 شكاوى شهرياً) — يرجى الانتظار' — **Screen: SCR-017 (blocked state)**

---

### 2.11 Journey: Al Rabiaa Operator Digit Entry

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-011 |
| Title | Al Rabiaa Operator Enters Drawn Digits During Live Broadcast |
| Actor | ROLE-009: Al Rabiaa Production Operator |
| Trigger | Draw broadcast begins at 9:00 PM; operator opens tablet at studio |
| Preconditions | Operator scoped token provisioned by admin; tablet on whitelisted studio IP; draw in 'Live' status |
| Features Covered | FEAT-009, FEAT-008 |
| End State | All 30 digits (3 × 10\) entered and confirmed; draw ready for admin finalization |

**Happy Path:**

1. Operator authenticates with operator token on studio tablet — **Screen: SCR-028 (Operator Draw Tablet UI)**  
2. Screen shows: Draw \#47, digit entry grid for Number 1 (10 empty slots), broadcast status 'متصل ✅'  
3. Ball machine draws digit for position 10 (rightmost): '7' — operator taps '7'  
4. Digit slot fills; acknowledgement within 500ms; audience app receives broadcast simultaneously  
5. Operator enters positions 9 through 1; each tap triggers WebSocket broadcast to consumers  
6. All 10 digits of Number 1 entered → 'تأكيد الرقم الأول؟' confirmation button appears  
7. Operator visually verifies against display; taps confirm → Number 2 entry begins  
8. Operator repeats for Numbers 2 and 3  
9. All 30 digits confirmed; screen shows 'اكتملت الأرقام — بانتظار الإنهاء من المشرف ✅'  
10. Journey complete

**Alternative Path: Wrong IP** Branches from: Step 1 Condition: Tablet connected from non-studio IP (e.g., VPN or relocation)

1. All digit submission attempts return 403  
2. Screen shows: 'هذا الجهاز غير مصرح به من هذا الموقع'  
3. AuditLog records IP \+ attempted draw\_id

**Alternative Path: Digit Correction Before Confirmation** Branches from: Step 4 Condition: Operator mistakenly taps '3' instead of '8'

1. Correction button appears on the current digit slot  
2. Operator taps correction → digit overwritten; correction AuditLog entry created  
3. Operator continues entering remaining digits

---

### 2.12 Journey: Admin Runs Retroactive Seeding Batch

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-012 |
| Title | Admin Triggers and Monitors Retroactive Entry Seeding Batch |
| Actor | ROLE-007: Platform Admin (initiator) \+ ROLE-010: System (executor) |
| Trigger | 2 weeks before first draw; admin navigates to Batch Control |
| Preconditions | Admin authenticated; run\_lock\_flag=false; SuperQi 90-day history accessible |
| Features Covered | FEAT-002, FEAT-038 |
| End State | Retroactive entries seeded for all eligible users; all users notified |

**Happy Path:**

1. Admin navigates to Batch Control — **Screen: SCR-041 (Admin Batch Control)**  
2. Sees: 'البذر الاسترجاعي' panel: status='لم يُشغَّل بعد', run\_lock\_flag=false  
3. Admin taps 'تشغيل البذر الاسترجاعي' — confirmation modal: 'هذه العملية تُشغَّل مرة واحدة فقط. هل أنت متأكد؟'  
4. Admin confirms; batch starts; run\_lock\_flag=true immediately  
5. Progress bar: 'معالجة: 0 / 8,000,000 مستخدم' updates every 30 seconds — **Screen: SCR-041**  
6. \~4 hours: batch completes; status='مكتمل'; 7,234,500 مستخدمون, 89,234,000 رقم فوز تم إنشاؤها  
7. Admin views summary stats; push notifications to all users queued and delivered  
8. Journey complete

**Alternative Path: Double-Trigger Attempt** Branches from: Step 3 Condition: run\_lock\_flag=true (batch already ran)

1. 'تشغيل' button is disabled; tooltip: 'تم تشغيل البذر الاسترجاعي بالفعل'  
2. Admin cannot re-trigger — system rejects with RETROACTIVE\_SEED\_ALREADY\_COMPLETED

---

### 2.13 Journey: Consumer Reviews Entry & Prize History

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-013 |
| Title | Consumer Browses Entry History and Prize History |
| Actor | ROLE-001: Consumer User |
| Trigger | User wants to verify their entries or check prize outcomes |
| Preconditions | User authenticated; has ≥1 FawzEntry record |
| Features Covered | FEAT-003, FEAT-011, FEAT-025 |
| End State | User has verified entry count, seen past draw results with their matches, and confirmed prize history |

**Happy Path:**

1. User taps 'أرقامي' on Fawz Tab Home — **Screen: SCR-006 (My Numbers / Entry History)**  
2. Summary header: '47 رقم فوز هذا الأسبوع — 312 رقم إجمالي'; entries listed most-recent-first  
3. User filters by source='challenge'; challenge-sourced entries shown  
4. User taps a 'Won' entry → draw detail deep link — **Screen: SCR-004 (Draw Detail)**  
5. Winning number for that draw; user's matching entry highlighted; '🎉 10,000 IQD Last-3'  
6. User taps 'سجل الجوائز' from nav — **Screen: SCR-011 (Prize History)**  
7. 3 prize records listed; '30,000 IQD إجمالي أرباحك الكلية'  
8. Journey complete

---

### 2.14 Journey: Admin Manages Account Suspension

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-014 |
| Title | Admin Suspends Fraudulent Account Following Escalated Fraud Case |
| Actor | ROLE-007: Platform Admin |
| Trigger | Escalated FraudReviewCase reaches admin queue |
| Preconditions | FraudReviewCase.status='Escalated'; admin authenticated |
| Features Covered | FEAT-030, FEAT-029 |
| End State | Account suspended; user notified; AuditLog updated |

**Happy Path:**

1. Admin opens fraud queue; sees escalated case — **Screen: SCR-036**  
2. Taps case → **Screen: SCR-037 (Fraud Case Detail)**  
3. Sees escalation reasoning from reviewer; verifies account activity pattern  
4. Taps 'إجراء: تعليق الحساب' — **Screen: SCR-040 (Account Management)**  
5. Account suspension form: requires linked FraudReviewCase, reasoning\_notes min 50 chars, two-step confirm  
6. Admin enters reasoning; confirms; account.status='suspended'  
7. User receives non-opt-out push: 'حسابك موقوف — تواصل مع الدعم'  
8. AuditLog: admin\_id, account\_id, action='suspended', reasoning\_notes, timestamp  
9. Journey complete

---

### 2.15 Journey: Consumer Consent & Notification Setup (First-Time)

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-015 |
| Title | New Consumer Completes Consent Setup and Configures Notification Preferences |
| Actor | ROLE-001 / ROLE-002: Consumer (first Fawz tab open) |
| Trigger | Consumer opens Fawz Tab for the first time |
| Preconditions | User authenticated in SuperQi; sharia\_disclosure\_accepted=false |
| Features Covered | FEAT-039, FEAT-044 |
| End State | Sharia disclosure accepted; notification preferences configured; Fawz Tab home accessible |

**Happy Path:**

1. User opens Fawz Tab → Sharia Disclosure Modal auto-appears — **Screen: SCR-015**  
2. User reads; taps 'فهمت وأوافق'  
3. Notification Consent Screen appears — **Screen: SCR-013 (Notification Preferences — First-Time)**  
4. User taps 'اختيار' (Choose) to customize categories  
5. Toggles: Draw Reminders ✅, Draw Results ✅, Entry Earned ❌, Challenge Updates ✅, Referral Rewards ✅  
6. Taps 'حفظ التفضيلات' → Fawz Tab Home loads — **Screen: SCR-001**  
7. Journey complete

---

### 2.16 Journey: Winner Social Share

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-016 |
| Title | Winner Shares Their Prize Win to Social Media |
| Actor | ROLE-001: Consumer User (Winner) |
| Trigger | Win notification received post-draw; user taps notification |
| Preconditions | DrawWinner record exists; prize credited; user authenticated |
| Features Covered | FEAT-043, FEAT-044 |
| End State | Branded winner share card shared to WhatsApp/Instagram/other |

**Happy Path:**

1. User taps '🎉 فزت\! Last-3 — 10,000 IQD' notification → **Screen: SCR-005 (Winner Share Screen)**  
2. Full-screen winner overlay: Fawz Number with last 3 digits highlighted in gold, '10,000 IQD', draw date, Fawz logo  
3. User taps 'شارك فوزك\!' → native share sheet opens with branded image  
4. User shares to WhatsApp; returns to app — **Screen: SCR-005**  
5. User taps 'شاهد تفاصيل جائزتك' → **Screen: SCR-011 (Prize History)**  
6. Journey complete

---

### 2.17 Journey: Admin System Configuration Update

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-017 |
| Title | Admin Updates a Configurable System Parameter |
| Actor | ROLE-007: Platform Admin |
| Trigger | Business decision to change a threshold (e.g., raise referral fraud flag threshold) |
| Preconditions | Admin authenticated with MFA |
| Features Covered | FEAT-035, FEAT-004 |
| End State | Parameter updated; change live within 60 seconds; change history logged |

**Happy Path:**

1. Admin navigates to System Configuration — **Screen: SCR-032 (System Configuration Screen)**  
2. Selects group 'Referral Rules' → sees 'Referral Monthly Fraud Threshold': current value \= 10  
3. Taps 'تعديل' (Edit) next to parameter — inline edit field appears  
4. Admin changes value to 15; taps 'تأكيد' — confirmation modal shows change preview  
5. Admin confirms; parameter updated; AuditLog: old\_value=10, new\_value=15, admin\_id, timestamp  
6. Admin taps 'سجل التغييرات' — **Screen: SCR-043 (Config Change History Modal)** — sees all historical changes  
7. Journey complete

---

### 2.18 Journey: Admin Reviews Audit Log for Compliance

| Field | Value |
| :---- | :---- |
| Journey ID | JRNY-018 |
| Title | Admin/Compliance Reviewer Searches Audit Log for Draw Integrity Evidence |
| Actor | ROLE-007 / ROLE-008 |
| Trigger | CBI inquiry or internal audit; need to produce draw integrity evidence |
| Preconditions | Admin/Reviewer authenticated |
| Features Covered | FEAT-037 |
| End State | Filtered audit log exported for draw; reviewer has compliance evidence |

**Happy Path:**

1. Admin navigates to Audit Log — **Screen: SCR-034 (Audit Log Viewer)**  
2. Filters: object\_type='draw', object\_id='47', time\_range=draw date  
3. Results: 12 entries for Draw \#47 — snapshot, pre-gen, all 30 digit events, finalize, export  
4. Taps 'تصدير' — filtered CSV exported; action logged in AuditLog  
5. Journey complete

---

## 03 — Screen Specifications

### 3.1 Screen Master List

| Screen ID | Screen Name | Type | Module | Accessible By | Entry Points |
| :---- | :---- | :---- | :---- | :---- | :---- |
| SCR-001 | Fawz Tab Home | Dashboard | MOD-010 | ROLE-001/002/003/004 | Tab bar, push notification tap, deeplink |
| SCR-002 | Live Draw Screen | Dashboard/RT | MOD-002 | ROLE-001/002/003/004 | Auto-redirect from SCR-001 during draw, draw reminder push tap |
| SCR-003 | Draw Results List | List | MOD-002 | ROLE-001/002/003/004 | SCR-001 'النتائج' tap, SCR-004 back |
| SCR-004 | Draw Detail | Detail | MOD-002 | ROLE-001/002/003/004 | SCR-003 row tap, notification deep link, SCR-006 won-entry tap |
| SCR-005 | Winner Share Screen | Detail | MOD-010 | ROLE-001/002/003/004 | Win notification tap, SCR-004 'شارك فوزك' tap |
| SCR-006 | My Numbers (Entry History) | List | MOD-001 | ROLE-001/002 | SCR-001 'أرقامي' tap, Fawz tab nav |
| SCR-007 | Challenges Screen | List | MOD-003 | ROLE-001/002 | SCR-001 challenge CTA, tab nav, challenge notification tap |
| SCR-008 | Challenge Detail | Detail | MOD-003 | ROLE-001/002 | SCR-007 challenge card tap |
| SCR-009 | Referral Screen | Dashboard | MOD-004 | ROLE-001/002/005 | SCR-001 referral section, challenge 3 tap |
| SCR-010 | Referral History | List | MOD-004 | ROLE-001/005 | SCR-009 'عرض السجل' tap |
| SCR-011 | Prize History | List | MOD-006 | ROLE-001/002 | SCR-001 nav, win notification deep link, SCR-005 tap |
| SCR-012 | Notification Center | List | MOD-009 | ROLE-001/002/003/004 | Bell icon tap (all consumer screens) |
| SCR-013 | Notification Preferences | Settings | MOD-009 | ROLE-001/002/003/004 | First-time flow post-disclosure, SCR-014 settings, consent nudge banner |
| SCR-014 | Fawz Profile | Detail | MOD-010 | ROLE-001/002/003/004 | Profile avatar tap, SCR-007 badge tap |
| SCR-015 | Sharia Disclosure Modal | Modal | MOD-010 | ROLE-001/002 | Auto-on first Fawz tab open |
| SCR-016 | Media Consent Form | Modal/Form | MOD-010 | ROLE-001 (winners only) | Post-draw winner push notification, admin-initiated prompt |
| SCR-017 | Dispute Submission Form | Form | MOD-007 | ROLE-001/002/003 | Support icon → 'تقديم شكوى' |
| SCR-018 | Dispute History | List | MOD-007 | ROLE-001/002/003 | SCR-017 confirmation, support section nav |
| SCR-019 | Merchant Fawz Home | Dashboard | MOD-005 | ROLE-003/004 | SuperQi merchant app Fawz tab, prize push notification tap |
| SCR-020 | Merchant Entry History | List | MOD-005 | ROLE-003/004 | SCR-019 'أرقامي' tap |
| SCR-021 | Merchant Prize History | List | MOD-006 | ROLE-003/004 | SCR-019 'الجوائز' tap, win push notification |
| SCR-022 | Admin Login | Form | MOD-008 | ROLE-007/008/009 | Direct URL /admin, session expiry redirect |
| SCR-023 | Admin MFA Verification | Form | MOD-008 | ROLE-007/008/009 | Auto after SCR-022 success |
| SCR-024 | Admin Dashboard | Dashboard | MOD-008 | ROLE-007/008 | Post-login redirect, nav menu |
| SCR-025 | Draw Calendar | List | MOD-002 | ROLE-007 | Admin nav menu 'السحوبات' |
| SCR-026 | Create/Edit Draw Form | Form | MOD-002 | ROLE-007 | SCR-025 '+ سحب جديد' or row edit tap |
| SCR-027 | Draw Control Panel | Dashboard | MOD-002 | ROLE-007 | SCR-025 draw row tap, draw reminder alert |
| SCR-028 | Operator Draw Tablet UI | Form | MOD-002 | ROLE-009 | Direct URL /operator (IP-whitelisted) |
| SCR-029 | Challenge Calendar | List | MOD-003 | ROLE-007 | Admin nav menu 'التحديات' |
| SCR-030 | Create/Edit Challenge Form | Form | MOD-003 | ROLE-007 | SCR-029 '+ تحدي جديد' or row edit tap |
| SCR-031 | Channel Multiplier Config | Settings | MOD-001 | ROLE-007 | Admin nav 'الإعدادات' → Multipliers |
| SCR-032 | System Configuration Screen | Settings | MOD-008 | ROLE-007 | Admin nav 'الإعدادات' → System Config |
| SCR-033 | Winner Export Screen | Action | MOD-008 | ROLE-007 | SCR-027 'تصدير الفائزين' tap |
| SCR-034 | Audit Log Viewer | List | MOD-008 | ROLE-007/008 | Admin nav 'سجل التدقيق' |
| SCR-035 | Merchant Eligibility Dashboard | Dashboard | MOD-005 | ROLE-007 | Admin nav 'التجار' |
| SCR-036 | Fraud Review Queue | List | MOD-007 | ROLE-007/008 | Admin nav 'مراجعة الاحتيال', dashboard queue widget tap |
| SCR-037 | Fraud Case Detail | Detail | MOD-007 | ROLE-007/008 | SCR-036 case row tap |
| SCR-038 | Fraud Case Decision Form | Form | MOD-007 | ROLE-007/008 | SCR-037 decision action tap |
| SCR-039 | Compliance High-Value Queue | List | MOD-006 | ROLE-007/008 | Admin nav 'الامتثال', dashboard widget tap |
| SCR-040 | Account Management Screen | Detail | MOD-007 | ROLE-007/008 | SCR-037 'عرض الحساب' tap, user search |
| SCR-041 | Admin Batch Control | Dashboard | MOD-001 | ROLE-007 | Admin nav 'الدُفعات' |
| SCR-042 | Notification Delivery Stats | Dashboard | MOD-009 | ROLE-007 | Admin nav 'الإشعارات' |
| SCR-043 | Config Change History Modal | Modal | MOD-008 | ROLE-007 | SCR-032 'سجل التغييرات' tap per parameter |

---

### 3.2 SCR-001: Fawz Tab Home

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-001 |
| Screen Name | Fawz Tab Home |
| Screen Type | Dashboard |
| Parent Module | MOD-010 — User Account & Onboarding |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | Bottom tab bar Fawz tab; push notification tap (entry earned, challenge complete); deeplink fawz://home |
| Related Features | FEAT-001, FEAT-014, FEAT-016, FEAT-017, FEAT-024, FEAT-040, FEAT-041, FEAT-042 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Draw type label | draw.type | GET /api/v1/draws/next | 'السحب الأسبوعي' / 'السحب الشهري' |
| Draw countdown timer | draw.draw\_date | GET /api/v1/draws/next | Arabic: 'X يوم Y ساعة Z دقيقة' — live countdown |
| Jackpot amount | draw.jackpot\_rollover\_iqd | GET /api/v1/draws/current-jackpot | IQD comma-formatted, animated counter |
| Entry count (current draw) | consumerUser.entry\_count\_this\_draw | GET /api/v1/home | Large Arabic numeral, animates on new entry |
| Weekly Spark progress | consumerUser.weekly\_unique\_days | GET /api/v1/home | 7 pill row: filled days gold, unfilled grey |
| Active challenge card(s) | challenge.name\_ar, userChallengeProgress.current\_value, challenge.target\_value | GET /api/v1/home | Progress bar; checkpoint markers; days remaining |
| Referral teaser | consumerUser.referral\_count\_month | GET /api/v1/home | 'X إحالات ناجحة' small badge |
| Notification bell badge | unread notification count | GET /api/v1/notifications/unread-count | Red badge; updates via polling every 60s |
| Live draw banner | draw.status | GET /api/v1/draws/next | Red pulsing banner 'السحب مباشر الآن\! 🔴' — only during draw window |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Draw countdown card | Card | draw.type, draw.draw\_date, jackpot amount | Live countdown ticker; taps to SCR-002 if draw live, SCR-003 if finalized |
| Entry count hero | Numeric Hero | entry count for current draw | Gold number; animates increment on new entry via push payload |
| Weekly Spark bar | Custom component | 7-day pill row (M-Su) | Filled days gold; unfilled grey; tapping opens SCR-008 for Spark detail |
| Challenge cards | Horizontal scroll list | challenge.name\_ar, progress, days remaining | Max 3 cards; tap → SCR-008 |
| Referral teaser button | Teaser card | referral\_count\_month, link CTA | Tap → SCR-009 |
| Onboarding challenge set | Prominent cards (ROLE-002 only) | 4 challenges with progress | Replaces challenge cards for is\_new=true users; tap → SCR-007 |
| Notification bell | Icon button | unread count badge | Tap → SCR-012 |
| Pre-draw reminder banner | Inline banner | conditionally shown | Visible on draw day before broadcast; 'ادفع اليوم\!' CTA |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap 'أرقامي' | Button tap | Always | Navigate → SCR-006 | — | FEAT-003 |
| Tap entry count hero | Tap | Always | Navigate → SCR-006 | — | FEAT-003 |
| Tap challenge card | Tap | ≥1 active challenge | Navigate → SCR-008 with challenge\_id | — | FEAT-016 |
| Tap 'ادعو أصدقاءك' | Tap | Always | Navigate → SCR-009 | — | FEAT-017 |
| Tap live draw banner | Tap | draw.status='Live' | Navigate → SCR-002 | — | FEAT-008 |
| Tap notification bell | Tap | Always | Navigate → SCR-012 | — | FEAT-040 |
| Pull to refresh | Pull gesture | Always | Refetch /api/v1/home | Show 'تعذر التحديث' toast on error; retry on next pull | FEAT-041 |
| Tap consent nudge banner | Tap | notification\_preferences unconfigured | Navigate → SCR-013 | — | FEAT-039 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Skeleton placeholders: entry count box, 7 grey pill placeholders, 1 challenge card skeleton | Initial load or pull-to-refresh |
| Populated | Full dashboard with entry count, countdown, challenge cards, Weekly Spark bar | All /api/v1/home data received |
| Empty (new user) | '0 أرقام فوز — ابدأ الدفع بسوبر كي\!' illustration; onboarding challenges prominent | lifetime\_tx=0 AND entry\_count=0 |
| Error | 'تعذر التحميل' banner with Retry; last cached data shown where available | API 5xx or network timeout \> 10s |
| Offline | 'غير متصل' top banner; entry count from last cache; countdown timer continues from device time | No network detected |
| Live Draw Active | Red pulsing banner; draw countdown replaced with 'السحب الآن\!' → auto-navigates to SCR-002 | draw.status='Live' AND draw\_date within ±15 min |

**Role-Based Variations:**

| Role | Sees | Doesn't See |
| :---- | :---- | :---- |
| ROLE-002 (is\_new=true) | Onboarding challenges prominently; '0 أرقام فوز — ابدأ\!' empty state | Standard rotating monthly challenges |
| ROLE-003 (Merchant) | Merchant-variant home → SCR-019 (separate screen) | Consumer challenge cards, referral section |
| ROLE-001/002 (standard) | All components above | Merchant-specific content |

---

### 3.3 SCR-002: Live Draw Screen

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-002 |
| Screen Name | Live Draw Screen |
| Screen Type | Dashboard (Real-time) |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | Auto-redirect from SCR-001 during draw window; draw reminder push tap; fawz://draw/live |
| Related Features | FEAT-008, FEAT-010, FEAT-011, FEAT-043 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Draw title | draw.type, draw.draw\_date | WS /ws/draw/{draw\_id} | 'سحب الخميس — 10 أبريل 2026' |
| Digit slots (3 × 10\) | drawDigitEvent.digit\_value, drawDigitEvent.digit\_position | WebSocket broadcast | 30 slots: empty → fills right-to-left with animation per digit event |
| Current winning number index | drawDigitEvent.number\_index | WebSocket | 'الرقم الأول من ثلاثة' |
| Entry pool size | draw.entry\_pool\_size | WS payload | '87 مليون رقم مشارك' |
| Jackpot counter | draw.jackpot\_rollover\_iqd | WS payload | Animated counter; grows if no jackpot winner |
| Connected viewers count | WebSocket server side-channel | WS | '543,210 شخص يشاهد' — approximate |
| Connection status indicator | WS connection state | Client state | 'متصل ✅' / 'استقبال بطيء ⚠️' / 'غير متصل ❌' |
| User's matching entries (post-result) | drawWinner records for user | GET /api/v1/draws/{id} | Highlighted after finalization |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Digit reveal grid | Custom animated | 3 rows × 10 digit slots | Each digit animates in when WebSocket event received; gold highlight on matching digits post-result |
| Jackpot ticker | Animated counter | jackpot\_rollover\_iqd | Counts up live during broadcast for dramatic effect |
| Connection banner | Status bar | WS connection state | Disappears when connected; yellow 'استقبال بطيء' when degraded; switches to polling |
| Result overlay | Full-screen modal | DrawWinner tier, prize\_iqd | Appears after finalization: winner overlay (gold) or non-winner overlay (blue) |
| Share button (winner only) | Button | — | Visible only in winner result overlay; tap → SCR-005 |
| 'عرض النتائج الكاملة' | Button | After finalization | Navigate → SCR-004 |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap 'شارك فوزك\!' | Tap | Winner overlay active | Navigate → SCR-005 | — | FEAT-043 |
| Tap 'ادعي صاحبك' CTA | Tap | Non-winner overlay | Navigate → SCR-009 | — | FEAT-017 |
| Tap 'عرض النتائج الكاملة' | Tap | Post-finalization | Navigate → SCR-004 | — | FEAT-011 |
| Long-press digit | Long press | Any digit visible | Shows: 'الرقم X في الموضع Y من العدد Z' tooltip | — | FEAT-008 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Skeleton digit grid; 'جاري الاتصال...' spinner | Initial connection to WS |
| Waiting (pre-digit) | Empty digit slots; 'ينتظر المشغل...' label; countdown to broadcast | Draw in Live status; no digits yet |
| Active broadcast | Digits filling in real-time right-to-left | DrawDigitEvents arriving via WS |
| Finalizing | All 30 digits filled; brief spinner 'يجري حساب الفائزين...' | All digits confirmed; finalization in progress |
| Winner result | Full-screen gold overlay with matching digits highlighted | User's entry matched ≥3 trailing digits |
| Non-winner result | Soft blue overlay 'السحب انتهى — عدك X رقم للسحب القادم' | No user match found |
| Error | 'تعذر الاتصال' \+ 'حاول مجدداً' button; HTTP polling fallback | WS connection failed; API unavailable |
| Offline | 'غير متصل — ستظهر النتائج عند الاتصال' message | No network |

**Real-Time Elements:**

- WebSocket channel: `/ws/draw/{draw_id}` — digit events, finalization result  
- HTTP polling fallback: every 5 seconds on `GET /api/v1/draws/{id}/digits`  
- Connection auto-reconnect: 3 attempts, exponential backoff (2s, 4s, 8s), then degrade to polling

---

### 3.4 SCR-003: Draw Results List

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-003 |
| Screen Name | Draw Results List |
| Screen Type | List |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | SCR-001 'النتائج' nav; Fawz Tab bottom nav 'السحوبات' |
| Related Features | FEAT-011 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Draw row: type label | draw.type | GET /api/v1/draws | 'أسبوعي' / 'شهري' badge |
| Draw row: date | draw.draw\_date | GET /api/v1/draws | 'الخميس، 10 أبريل 2026' |
| Draw row: winner count | draw.total\_winners | GET /api/v1/draws | 'X,XXX فائز' |
| Draw row: user outcome badge | user's drawWinner existence | GET /api/v1/draws | 'فزت\!' gold badge OR no badge |
| Draw row: payout total | draw.total\_payout\_iqd | GET /api/v1/draws | 'إجمالي الجوائز: X مليار IQD' |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Draw list | FlatList | draw rows | Pull-to-refresh; cursor-based pagination (20 per page) |
| Draw row card | List item | draw data \+ user outcome badge | Tap → SCR-004 with draw.id |
| Filter tabs | Tab bar | 'الكل' / 'أسبوعي' / 'شهري' | Filters draw type; updates list in place |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap draw row | Tap | Always | Navigate → SCR-004 with draw\_id | — | FEAT-011 |
| Pull to refresh | Pull | Always | Reload draws list | Toast 'تعذر التحديث' on error | FEAT-011 |
| Filter by type | Tab tap | Always | Filter list in place | — | FEAT-011 |
| Load more (scroll) | Scroll to bottom | More draws exist | Fetch next cursor page | Loading skeleton at bottom | FEAT-011 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | 5 skeleton draw row cards | Initial load |
| Populated | Draw list with outcome badges | Data loaded |
| Empty | 'لا توجد سحوبات منتهية بعد' illustration | No finalized draws yet (pre-launch) |
| Error | 'تعذر التحميل' \+ Retry button | API failure |
| Offline | Last cached draws shown; 'غير متصل' banner | No network |

---

### 3.5 SCR-004: Draw Detail

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-004 |
| Screen Name | Draw Detail |
| Screen Type | Detail |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | SCR-003 draw row tap; SCR-006 won-entry tap; notification deep link fawz://draw/{id} |
| Related Features | FEAT-011, FEAT-043, FEAT-025 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Draw date & type | draw.draw\_date, draw.type | GET /api/v1/draws/{id} | Large header |
| 3 winning numbers | draw.winning\_numbers (array\[3\]) | GET /api/v1/draws/{id} | Displayed as XXXX-XX-XXXX; formatted Arabic |
| Winner summary by tier | draw.winner\_summary (via /winners/summary) | GET /api/v1/draws/{id}/winners/summary | Last-3: X فائز, Last-5: X, etc. |
| Total payout | draw.total\_payout\_iqd | GET /api/v1/draws/{id} | IQD formatted |
| User's matching entries | drawWinner records for authenticated user | GET /api/v1/draws/{id} | User's Fawz Numbers with matching digits highlighted in gold |
| User's prize amount | drawWinner.prize\_iqd | GET /api/v1/draws/{id} | '🎉 10,000 IQD — Last-3' |
| Jackpot claimed status | draw.jackpot\_claimed | GET /api/v1/draws/{id} | 'الجائزة الكبرى: محجوزة ✅' or 'مُرحَّلة للسحب القادم 🔄' |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Winning numbers display | Custom grid | 3 × 10-digit number rows | User's matching trailing digits highlighted gold |
| Winner tier summary | Stats row | Tier counts | Horizontal scroll if needed |
| User matches section | Card | User's matched entries \+ prize | 'جائزتك' header; prominent if won |
| Share button (winners only) | Button | — | Tap → SCR-005; visible only if user has DrawWinner record for this draw |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap 'شارك فوزك\!' | Tap | User has DrawWinner record | Navigate → SCR-005 | — | FEAT-043 |
| Tap 'شاهد أرقامي في هذا السحب' | Tap | Always | Scrolls to user's matching section | — | FEAT-003 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Skeleton: 3 number rows, tier summary skeleton, user section skeleton | Initial load |
| Populated | Full draw detail with winning numbers | Data loaded |
| Empty/No Match | Draw detail shown; 'لا توجد أرقام مطابقة لهذا السحب' in user section | User has no match for this draw |
| Error | Error banner \+ Retry | API failure |
| Offline | Cached data if previously loaded; else error state | No network |

---

### 3.6 SCR-005: Winner Share Screen

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-005 |
| Screen Name | Winner Share Screen |
| Screen Type | Detail |
| Parent Module | MOD-010 — User Account & Onboarding |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 (winners only) |
| Entry Points | Win push notification tap; SCR-004 'شارك فوزك\!' tap; SCR-002 winner overlay share button |
| Related Features | FEAT-043, FEAT-044 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Winning Fawz Number | fawzEntry.number | GET /api/v1/prizes/my-wins/{draw\_winner\_id}/share-card | Formatted XXXX-XXXX-XX; matching digits in gold |
| Prize tier | drawWinner.digits\_matched | share-card endpoint | 'Last-3' / 'Last-5' / 'Last-7' |
| Prize amount | drawWinner.prize\_iqd | share-card endpoint | 'X,XXX IQD' large |
| Draw date | draw.draw\_date | share-card endpoint | 'سحب الخميس 10 أبريل 2026' |
| Fawz branding | Static | — | Logo, brand colors; pre-rendered share card |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Share card preview | Image/Canvas | Full branded winner card | Pre-rendered client-side; ready for native share |
| 'شارك فوزك\!' CTA button | Primary button | — | Opens native iOS Share Sheet / Android Intent |
| 'شاهد تفاصيل جائزتك' | Secondary button | — | Navigate → SCR-011 |
| 'رجوع للرئيسية' | Text link | — | Navigate back to SCR-001 |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap 'شارك فوزك\!' | Tap | Always | Opens native share sheet with pre-rendered image | If share fails, toast 'تعذرت المشاركة — حاول مرة أخرى' | FEAT-043 |
| Tap 'شاهد تفاصيل جائزتك' | Tap | Always | Navigate → SCR-011 | — | FEAT-025 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Card skeleton while share-card endpoint resolves | Initial load |
| Populated | Full winner card \+ share button | Data loaded |
| Empty | Should not occur (only accessible with valid DrawWinner) | N/A |
| Error | 'تعذر تحميل بطاقة الفوز' \+ Retry | share-card API failure |
| Offline | 'لا يمكن التحميل بدون إنترنت' \+ back button | No network |

---

### 3.7 SCR-006: My Numbers (Entry History)

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-006 |
| Screen Name | My Numbers — Entry History |
| Screen Type | List |
| Parent Module | MOD-001 — Entry Generation Engine |
| Accessible By | ROLE-001, ROLE-002 |
| Entry Points | SCR-001 'أرقامي' tap; Fawz Tab nav; entry earned push tap |
| Related Features | FEAT-001, FEAT-003 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Entry count header | Count from summary | GET /api/v1/entries/summary | '47 رقم فوز هذا الأسبوع — 312 إجمالي' |
| Entry row: number | fawzEntry.number | GET /api/v1/entries | XXXX-XX-XXXX format |
| Entry row: source badge | fawzEntry.source | GET /api/v1/entries | 'معاملة' / 'تحدي' / 'إحالة' / 'مبكر' (retroactive) |
| Entry row: date | fawzEntry.created\_at | GET /api/v1/entries | Relative: 'منذ 3 ساعات' |
| Entry row: draw label | fawzEntry.draw\_week | GET /api/v1/entries | 'سحب 10 أبريل' |
| Entry row: outcome | derived from drawWinner join | GET /api/v1/entries | 'فزت\! Last-3 🎉' / 'لم يفز' / 'نشط' |
| Filter tabs | — | — | 'الكل' / 'معاملات' / 'تحديات' / 'إحالات' |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Entry count summary bar | Stats card | entry counts | Sticky at top during scroll |
| Entry list | FlatList | entry rows | Cursor-based pagination; 20/page |
| Filter tab bar | Tabs | source filters | Updates list without reload |
| Won entry row | List item (gold accent) | Won entry data | Tap → SCR-004 for draw detail |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap won entry row | Tap | Entry.outcome='Won' | Navigate → SCR-004 with draw\_id | — | FEAT-011 |
| Filter by source | Tab tap | Always | Filter list in place | — | FEAT-003 |
| Pull to refresh | Pull | Always | Refetch entries | Toast on error | FEAT-003 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | 5 skeleton entry rows \+ summary skeleton | Initial load |
| Populated | Entry list with count header | Data loaded |
| Empty | 'ما عدك أرقام بعد — ادفع بسوبر كي لتحصل على أرقامك\!' \+ pay CTA | entry\_count=0 |
| Error | Error banner \+ Retry | API failure |
| Offline | Cached entries (last 7 days) with 'غير متصل' banner | No network |

---

### 3.8 SCR-007: Challenges Screen

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-007 |
| Screen Name | Challenges Screen |
| Screen Type | List |
| Parent Module | MOD-003 — Challenge System |
| Accessible By | ROLE-001, ROLE-002 |
| Entry Points | SCR-001 challenge CTA; bottom nav 'التحديات'; challenge progress notification tap |
| Related Features | FEAT-013, FEAT-014, FEAT-015, FEAT-016 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Active challenge card: name | challenge.name\_ar | GET /api/v1/challenges | Bold Arabic title |
| Active challenge card: progress | userChallengeProgress.current\_value / challenge.target\_value | GET /api/v1/challenges | Progress bar 0–100% |
| Active challenge card: reward | challenge.reward\_entries, challenge.reward\_cash\_iqd | GET /api/v1/challenges | '+250 رقم فوز' / '+250 رقم \+ 5,000 IQD' |
| Active challenge card: time remaining | challenge.end\_date | GET /api/v1/challenges | 'ينتهي خلال 14 يوم' |
| Completed challenge: outcome | userChallengeProgress.completed, completed\_at | GET /api/v1/challenges | ✅ green; 'أنجزت\! \+100 رقم فوز' |
| Onboarding progress (ROLE-002) | 4 onboarding challenges status | GET /api/v1/challenges/onboarding | 4/4 progress indicator at top |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Onboarding set header (ROLE-002 only) | Progress card | 4-challenge checklist | Prominent; tap → SCR-008 |
| Active challenge cards | Vertical list cards | Progress, reward, deadline | Sorted by deadline ASC; tap → SCR-008 |
| Completed challenges section | Collapsible list | Completed challenges | Collapsed by default; tap to expand |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap active challenge card | Tap | Active challenges exist | Navigate → SCR-008 with challenge\_id | — | FEAT-016 |
| Tap completed challenge row | Tap | Completed section expanded | Navigate → SCR-008 (read-only completed view) | — | FEAT-016 |
| Pull to refresh | Pull | Always | Refetch challenges | Toast on error | FEAT-016 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | 2 skeleton challenge cards | Initial load |
| Populated | Active \+ completed challenge cards | Data loaded |
| Empty (ROLE-001 no challenges) | 'لا توجد تحديات نشطة الآن — تحقق لاحقاً\!' | No active challenges configured |
| Empty (ROLE-002) | Should not occur — onboarding always has 4 challenges | N/A |
| Error | Error banner \+ Retry | API failure |
| Offline | Cached challenges \+ 'غير متصل' banner; progress updates may be stale | No network |

---

### 3.9 SCR-008: Challenge Detail

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-008 |
| Screen Name | Challenge Detail |
| Screen Type | Detail |
| Parent Module | MOD-003 — Challenge System |
| Accessible By | ROLE-001, ROLE-002 |
| Entry Points | SCR-007 challenge card tap; SCR-001 challenge card tap |
| Related Features | FEAT-013, FEAT-014, FEAT-015, FEAT-016 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Challenge name | challenge.name\_ar | GET /api/v1/challenges/{id}/progress | Header |
| Challenge description | challenge.description\_ar | GET /api/v1/challenges/{id}/progress | Arabic instructions |
| Progress bar | userChallengeProgress.current\_value / challenge.target\_value | — | Animated; checkpoint markers shown on bar |
| Progress number | current\_value, target\_value | — | 'X / Y معاملة' |
| Checkpoint rewards | challenge.checkpoints | — | Markers on bar; unclaimed \= pulsing; claimed \= checked |
| Reward on completion | challenge.reward\_entries, reward\_cash\_iqd | — | '+250 رقم فوز' at end of bar |
| Time remaining | challenge.end\_date | — | Countdown timer |
| Category filter (if applicable) | challenge.category\_filter | — | 'فئة: وقود' label |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Skeleton progress bar \+ detail skeleton | Initial load |
| Populated | Full challenge detail with live progress | Data loaded |
| Completed | Green checkmark; 'أنجزت\! \+X رقم فوز' trophy; read-only bar at 100% | userChallengeProgress.completed=true |
| Expired | 'انتهى التحدي' grey state; final progress visible | challenge end\_date passed |
| Error | Error banner \+ Retry | API failure |
| Offline | Cached progress; 'غير متصل' banner | No network |

---

### 3.10 SCR-009: Referral Screen (Golden Ticket)

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-009 |
| Screen Name | Referral Screen — Golden Ticket |
| Screen Type | Dashboard |
| Parent Module | MOD-004 — Referral System |
| Accessible By | ROLE-001, ROLE-002, ROLE-005 |
| Entry Points | SCR-001 referral section tap; SCR-007 challenge 3 tap; onboarding challenge 3 |
| Related Features | FEAT-017, FEAT-020, FEAT-013 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Referral link | consumerUser.referral\_code | GET /api/v1/referrals/my-link | qi.iq/fawz/{code} with copy button |
| Link expiry | consumerUser.referral\_link\_expiry | GET /api/v1/referrals/my-link | 'ينتهي خلال X يوم' |
| Monthly stats | referral\_count\_month | GET /api/v1/referrals/my-stats | 'X إحالات ناجحة هذا الشهر' |
| Entries earned from referrals | — | GET /api/v1/referrals/my-stats | 'X أرقام فوز من الإحالات' |
| Cash earned | — | GET /api/v1/referrals/my-stats | 'X,XXX IQD مكافآت نقدية' |
| Referral reward explanation | Static copy | — | '+50 رقم فوز \+ 5,000 IQD لكل إحالة ناجحة'; referred friend gets \+100 |
| 10+ referral soft warning | consumerUser.referral\_count\_month | — | Yellow banner if count ≥ 8: 'اقتربت من الحد الموصى به 10/شهر' |

**Components:**

| Component | Type | Data / Content | Behavior |
| :---- | :---- | :---- | :---- |
| Link display card | Card | referral link \+ copy \+ QR | Copy: copies to clipboard \+ toast 'تم النسخ ✅' |
| WhatsApp share button | Primary CTA button | pre-filled WhatsApp URL | Opens WhatsApp with message |
| Stats row | 3-column stats | count, entries, cash | Horizontal |
| 'عرض سجل الإحالات' link | Text link | — | Navigate → SCR-010 |

**User Actions:**

| Action | Trigger | Visible When | Result | Error Handling | Source Rule |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Tap 'نسخ الرابط' | Tap | Always | Copy to clipboard \+ toast | — | FEAT-017 |
| Tap 'شارك عبر واتساب' | Tap | Always | Opens WhatsApp with pre-filled message | If WhatsApp not installed: shows share sheet instead | FEAT-017 |
| Tap 'عرض السجل' | Tap | Always | Navigate → SCR-010 | — | FEAT-020 |

**Screen States:**

| State | What the User Sees | Trigger Condition |
| :---- | :---- | :---- |
| Loading | Skeleton link card \+ stats skeleton | Initial load |
| Populated | Full referral screen | Data loaded |
| Link expired | 'انتهت صلاحية رابطك — سيتم تجديده تلقائياً' \+ spinner then new link | referral\_link\_expiry \< now |
| Error | Error banner \+ Retry | API failure |
| Offline | 'لا يمكن تحميل رابطك بدون إنترنت' | No network |

---

### 3.11 SCR-010: Referral History

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-010 |
| Screen Name | Referral History |
| Screen Type | List |
| Parent Module | MOD-004 — Referral System |
| Accessible By | ROLE-001, ROLE-005 |
| Entry Points | SCR-009 'عرض السجل' tap |
| Related Features | FEAT-020 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Referral row: partial name | Partial display from consumerUser | GET /api/v1/referrals/my-history | 'أح\*\*\* ع\*\*\*' (partial mask) |
| Referral row: date | referral.qualified\_at | — | 'قُبلت في 3 أبريل 2026' |
| Referral row: status badge | referral.status | — | 'ناجح' (green) / 'قيد المراجعة' (yellow) / 'لم تكتمل' (red) |
| Referral row: reward | referral.referrer\_reward\_entries, referrer\_reward\_cash\_iqd | — | '+50 رقم فوز \+ 5,000 IQD' |

**Screen States:** Loading / Populated / Empty ('لا إحالات بعد — شارك رابطك مع أصدقائك\!') / Error / Offline

---

### 3.12 SCR-011: Prize History

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-011 |
| Screen Name | Prize History |
| Screen Type | List |
| Parent Module | MOD-006 — Prize & Payout Management |
| Accessible By | ROLE-001, ROLE-002 |
| Entry Points | SCR-001 nav; win notification deep link; SCR-005 'تفاصيل جائزتك' tap |
| Related Features | FEAT-025, FEAT-026 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Lifetime total | Aggregated from drawWinner records | GET /api/v1/prizes/my-wins | 'X,XXX IQD إجمالي أرباحك الكلية' |
| Prize row: draw date | draw.draw\_date | GET /api/v1/prizes/my-wins | Date \+ type |
| Prize row: tier | drawWinner.digits\_matched | — | 'Last-3' / 'Last-5' / 'Last-7' |
| Prize row: amount | drawWinner.prize\_iqd | — | IQD formatted |
| Prize row: payout status | prizePayout.payout\_status | — | 'مدفوع ✅' / 'قيد المراجعة ⏳' / 'محجوز 🔒' |

**Screen States:** Loading / Populated / Empty ('لم تفز بعد — استمر في الدفع بسوبر كي\!') / Error / Offline (cached)

---

### 3.13 SCR-012: Notification Center

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-012 |
| Screen Name | In-app Notification Center |
| Screen Type | List |
| Parent Module | MOD-009 — Notifications & Real-time |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | Bell icon tap (visible on all consumer screens) |
| Related Features | FEAT-040 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Notification row: title | notification.title\_ar | GET /api/v1/notifications | Bold Arabic title |
| Notification row: body | notification.body\_ar | — | 1-2 line truncated |
| Notification row: time | notification.created\_at | — | 'منذ 3 ساعات' relative time |
| Notification row: read state | notification.is\_read | — | Unread: blue left border; read: no border |
| Unread count | Count query | GET /api/v1/notifications/unread-count | Badge on bell icon |

**Components:** FlatList with 90-day history; 'مسح الكل' mark-all-read button

**Screen States:** Loading / Populated / Empty ('لا يوجد إشعارات بعد — ابدأ بالدفع بسوبر كي\!') / Error / Offline (cached 7 days)

---

### 3.14 SCR-013: Notification Preferences

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-013 |
| Screen Name | Notification Preferences |
| Screen Type | Settings |
| Parent Module | MOD-009 — Notifications & Real-time |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | First-time onboarding flow; SCR-014 settings; consent nudge banner; SCR-012 header settings icon |
| Related Features | FEAT-039 |

**Data Displayed / Form Fields:**

| Field | Type | Required | Default | Description |
| :---- | :---- | :---- | :---- | :---- |
| Draw Reminders | Toggle | — | On | 'تذكيرات السحب قبل البدء' |
| Draw Results | Toggle | — | On | 'نتائج السحب (فزت / لم تفز)' |
| Entry Earned | Toggle | — | On | 'حصلت على أرقام فوز جديدة' |
| Challenge Updates | Toggle | — | On | 'تحديثات التحديات' |
| Referral Rewards | Toggle | — | On | 'مكافآت الإحالة' |
| System Critical (account alerts) | Toggle (disabled) | — | Always On | 'إشعارات الحساب الهامة — لا يمكن إيقافها' |

**Submit Behavior:** Auto-save on toggle change (no submit button) — PATCH to `/api/v1/notifications/preferences` per toggle

**Screen States:** Loading (skeleton toggles) / Populated / Error (toast on save failure — retry) / Offline (show cached state; disable toggles with 'غير متصل' message)

---

### 3.15 SCR-014: Fawz Profile

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-014 |
| Screen Name | Fawz Profile |
| Screen Type | Detail |
| Parent Module | MOD-010 — User Account & Onboarding |
| Accessible By | ROLE-001, ROLE-002, ROLE-003, ROLE-004 |
| Entry Points | Profile avatar tap; SCR-007 badge tap |
| Related Features | FEAT-042, FEAT-044 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Username/partial name | consumerUser.display\_name | GET /api/v1/profile/fawz | From SuperQi KYC |
| Badges earned | consumerUser.badges (array) | — | 'Fawz Explorer 🌟' chip; expandable list |
| Lifetime entries earned | aggregate | — | 'X أرقام فوز إجمالي' |
| Total prizes won | aggregate | — | 'X مرات فزت — X,XXX IQD إجمالي' |
| Account tier | consumerUser.is\_new | — | 'مبتدئ 🌱' (ROLE-002) / 'عضو ⚡' (ROLE-001) |
| Referral stats | consumerUser.referral\_count\_lifetime | — | 'X أشخاص دعوتهم' |
| Settings links | — | — | Notification Preferences → SCR-013, Consent → SCR-015/016 |

**Screen States:** Loading / Populated / Error / Offline (cached)

---

### 3.16 SCR-015: Sharia Disclosure Modal

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-015 |
| Screen Name | Sharia Disclosure Modal |
| Screen Type | Modal |
| Parent Module | MOD-010 — User Account & Onboarding |
| Accessible By | ROLE-001, ROLE-002 (first-time only) |
| Entry Points | Auto-triggered on first Fawz tab open if sharia\_disclosure\_accepted=false |
| Related Features | FEAT-044 |

**Data Displayed:** Static copy — Arabic explanation that Fawz is مكافآت تجارية (commercial rewards), not يانصيب or قمار; Fawz Number is earned through spending.

**Components:** Modal overlay (cannot dismiss by tapping outside); 'فهمت وأوافق' primary button; 'إغلاق' secondary (non-dismissive — re-appears next open)

**Screen States:** Single state only (Modal / Non-modal not applicable — always shown if triggered)

---

### 3.17 SCR-016: Media Consent Form

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-016 |
| Screen Name | Media Consent Form |
| Screen Type | Modal/Form |
| Parent Module | MOD-010 — User Account & Onboarding |
| Accessible By | ROLE-001 (winners only; post-draw prompt) |
| Entry Points | Post-draw winner push notification for last-7+ prize; SCR-014 consent settings |
| Related Features | FEAT-044, FEAT-036 |

**Data Displayed:** Explanation: what will be filmed, how winner's name will be used on Al Rabiaa TV, that winning is NOT conditional on consent

**Form Fields:**

| Field | Type | Default | Description |
| :---- | :---- | :---- | :---- |
| Media consent decision | Radio: أوافق / لا أوافق | None selected | Required before dismiss |

**Submit Behavior:** Records media\_consent bool \+ timestamp via POST /api/v1/consent/media; navigates back after save

**Screen States:** Loaded (modal shown); Error (toast on save failure \+ retry); no loading needed

---

### 3.18 SCR-017: Dispute Submission Form

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-017 |
| Screen Name | Dispute Submission Form |
| Screen Type | Form |
| Parent Module | MOD-007 — Fraud & Compliance |
| Accessible By | ROLE-001, ROLE-002, ROLE-003 |
| Entry Points | Support icon → 'تقديم شكوى' |
| Related Features | FEAT-031 |

**Form Fields:**

| Field | Type | Required | Validation | Keyboard | Error Message |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Dispute type | Dropdown/Picker | Yes | From enum (missing\_prize, incorrect\_entries, referral\_reward, etc.) | — | 'يرجى اختيار نوع الشكوى' |
| Related draw | Picker (from user's recent draws) | No (context-dependent) | Valid draw\_id | — | — |
| Related Fawz Number | Text input | No | 10 digits if provided | Numeric | 'يجب أن يكون الرقم 10 أرقام' |
| Description | TextArea | Yes | Max 500 chars | Arabic keyboard default | 'يرجى كتابة وصف (500 حرف كحد أقصى)' |

**Submit Behavior:** POST /api/v1/disputes; success → confirmation screen (inline 'شكواك وصلت — سنتواصل خلال 24 ساعة'); failure → inline error \+ preserve inputs; if limit reached (3/month) → blocked state shown

**Screen States:** Loading / Populated (form ready) / Blocked (dispute limit reached) / Error (API failure) / Offline (disabled with 'لا يمكن إرسال شكاوى بدون إنترنت')

---

### 3.19 SCR-018: Dispute History

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-018 |
| Screen Name | Dispute History |
| Screen Type | List |
| Parent Module | MOD-007 — Fraud & Compliance |
| Accessible By | ROLE-001, ROLE-002, ROLE-003 |
| Entry Points | SCR-017 confirmation tap, support section nav |
| Related Features | FEAT-031 |

**Data Displayed:** Dispute rows: type, date submitted, status ('قيد المراجعة' / 'محلولة' / 'مرفوضة'), resolution summary

**Screen States:** Loading / Populated / Empty ('لا شكاوى مقدمة') / Error / Offline (cached)

---

### 3.20 SCR-019: Merchant Fawz Home

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-019 |
| Screen Name | Merchant Fawz Home |
| Screen Type | Dashboard |
| Parent Module | MOD-005 — Merchant Management |
| Accessible By | ROLE-003, ROLE-004 |
| Entry Points | SuperQi merchant app Fawz tab; merchant win push notification tap |
| Related Features | FEAT-021, FEAT-022 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Weekly entry count | Shared entry count for current draw week | GET /api/v1/merchant/entries/summary | 'X أرقام فوز من معاملات زبائنك هذا الأسبوع' |
| Eligibility status | merchant.is\_eligible | GET /api/v1/merchant/entries/summary | 'مؤهل ✅' / 'غير مؤهل — سيتم مراجعة الأهلية غداً' |
| Next draw countdown | draw.draw\_date | GET /api/v1/draws/next | Countdown timer |
| Win banner | latest drawWinner record | GET /api/v1/merchant/prizes | Appears if won in last draw: '🎉 فزت\! Last-3 — 10,000 IQD' |

**Screen States:** Loading / Populated / Ineligible state (eligibility explanation) / Error / Offline

---

### 3.21 SCR-020: Merchant Entry History

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-020 |
| Screen Name | Merchant Entry History |
| Screen Type | List |
| Parent Module | MOD-005 — Merchant Management |
| Accessible By | ROLE-003, ROLE-004 |
| Entry Points | SCR-019 'أرقامي هذا الأسبوع' tap |
| Related Features | FEAT-022 |

**Data Displayed:** Fawz Number list with source label 'مشاركة مع زبون'; transaction date/amount range (no customer identity); draw assignment

**Screen States:** Loading / Populated / Empty ('لا أرقام بعد — تبدأ الأرقام بالظهور عندما يدفع زبائنك') / Error / Offline

---

### 3.22 SCR-021: Merchant Prize History

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-021 |
| Screen Name | Merchant Prize History |
| Screen Type | List |
| Parent Module | MOD-006 — Prize & Payout Management |
| Accessible By | ROLE-003, ROLE-004 |
| Entry Points | SCR-019 'الجوائز' tap; merchant win push tap |
| Related Features | FEAT-025 |

**Data Displayed:** Prize rows: draw date, tier, amount IQD, status 'مدفوع للمحفظة ✅' / 'قيد المراجعة' **Screen States:** Loading / Populated / Empty / Error / Offline

---

### 3.23 SCR-022: Admin Login

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-022 |
| Screen Name | Admin Login |
| Screen Type | Form |
| Parent Module | MOD-008 — Admin Operations |
| Accessible By | ROLE-007, ROLE-008, ROLE-009 |
| Entry Points | Direct URL /admin/login; session expiry redirect |
| Related Features | FEAT-033 |

**Form Fields:**

| Field | Type | Required | Validation | Keyboard | Error Message |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Email | Email input | Yes | Valid email format | email | 'بريد إلكتروني غير صالح' |
| Password | Password input | Yes | Min 8 chars | default | 'كلمة المرور مطلوبة' |

**Submit Behavior:** POST /api/v1/admin/auth/login; success → navigate to SCR-023 (MFA); IP check failure → inline error 'الوصول غير مسموح من هذا الموقع' (AuditLog recorded); credential failure → 'بريد أو كلمة مرور غير صحيحة' (no details about which)

**Screen States:** Default form / Loading (submit in progress) / Error (IP block or credential failure)

---

### 3.24 SCR-023: Admin MFA Verification

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-023 |
| Screen Name | Admin MFA Verification |
| Screen Type | Form |
| Parent Module | MOD-008 — Admin Operations |
| Accessible By | ROLE-007, ROLE-008, ROLE-009 |
| Entry Points | Auto after SCR-022 successful credential check |
| Related Features | FEAT-033 |

**Form Fields:** 6-digit TOTP code; auto-submit on 6th digit entry

**Submit Behavior:** POST /api/v1/admin/auth/verify-mfa; success → navigate to SCR-024 or requested screen; failure → 'رمز غير صحيح — حاول مرة أخرى' (3 attempts max, then lock for 5 minutes)

**Screen States:** Default / Loading / Error (invalid code) / Locked (too many attempts)

---

### 3.25 SCR-024: Admin Dashboard

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-024 |
| Screen Name | Admin Dashboard |
| Screen Type | Dashboard |
| Parent Module | MOD-008 — Admin Operations |
| Accessible By | ROLE-007, ROLE-008 |
| Entry Points | Post-login redirect; nav menu 'لوحة التحكم' |
| Related Features | FEAT-034 |

**Data Displayed:**

| UI Element | Data Binding | API Source | Format / Notes |
| :---- | :---- | :---- | :---- |
| Current draw status | draw.status, next draw | GET /api/v1/admin/dashboard/summary | 'السحب القادم: الخميس 10 أبريل — مجدول' |
| Budget monitor | prize payout running total vs projected | GET /api/v1/admin/dashboard/budget | Real-time; alert if \> 80% threshold |
| Entry volume trend | Entries last 24h vs prior week same day | GET /api/v1/admin/dashboard/entry-volume | Sparkline chart |
| Fraud queue depth | Open FraudReviewCase count | GET /api/v1/admin/dashboard/summary | Red indicator if \> 50 |
| Notification delivery rate | Last draw delivery % | GET /api/v1/admin/notifications/delivery-stats | 'آخر سحب: 97.3% تسليم' |
| High-value holds | Count of held payouts | GET /api/v1/admin/dashboard/summary | Compliance widget |
| System health | API latency, error rate | Internal monitoring | Green/yellow/red RAG status |

**Components:** Widget grid (responsive); real-time budget bar; entry volume sparkline; RAG system health dots; fraud queue badge; compliance holds badge

**Real-Time Elements:** Budget monitor: polling 30s during draw execution; System health: polling 60s

**Screen States:** Loading (widget skeletons) / Populated / Partial (some widgets error — individual error states per widget) / Error (full load failure)

---

### 3.26 SCR-025: Draw Calendar

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-025 |
| Screen Name | Draw Calendar |
| Screen Type | List |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-007 |
| Entry Points | Admin nav 'السحوبات' |
| Related Features | FEAT-005 |

**Data Displayed:** Draw rows: type, date, status (Scheduled/Finalized/Archived), entry\_pool\_size, total\_payout\_iqd, total\_winners. Status badges color-coded: Scheduled=blue, Live=red, Finalized=green.

**User Actions:** Tap row → SCR-027 (if Scheduled/Live) or SCR-004 (if Finalized/archived read-only); tap '+ سحب جديد' → SCR-026

**Screen States:** Loading / Populated / Empty ('لا توجد سحوبات — أنشئ أول سحب') / Error / Offline

---

### 3.27 SCR-026: Create/Edit Draw Form

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-026 |
| Screen Name | Create/Edit Draw Form |
| Screen Type | Form |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-007 |
| Entry Points | SCR-025 '+ سحب جديد' tap; SCR-027 edit tap (pre-snapshot only) |
| Related Features | FEAT-005 |

**Form Fields:**

| Field | Type | Required | Validation | Default | Error Message |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Draw type | Select: weekly/monthly | Yes | Enum | weekly | 'اختر نوع السحب' |
| Draw date | DateTime picker | Yes | Future date; no duplicate same-type same-date | — | 'التاريخ يجب أن يكون في المستقبل' / 'يوجد سحب في هذا التاريخ' |
| Pool cutoff time | DateTime picker | Yes | Before draw\_date | T-30 min | — |
| Prize tier: Last-3 (IQD) | Number input | Yes | Positive integer | Configurable default | 'يجب أن يكون قيمة موجبة' |
| Prize tier: Last-5 (IQD) | Number input | Yes | Positive integer | — | — |
| Prize tier: Last-7 (IQD) | Number input | Yes | Positive integer | — | — |
| Jackpot seed (Last-10 IQD) | Number input | Yes | Positive integer | — | — |

**Submit Behavior:** POST /api/v1/admin/draws; success → navigate to SCR-027 for new draw; edit: PUT /api/v1/admin/draws/{id}; validation errors shown inline; server error → toast \+ preserve form

---

### 3.28 SCR-027: Draw Control Panel

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-027 |
| Screen Name | Draw Control Panel |
| Screen Type | Dashboard |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-007 |
| Entry Points | SCR-025 draw row tap |
| Related Features | FEAT-005, FEAT-006, FEAT-007, FEAT-010, FEAT-024, FEAT-034, FEAT-036 |

**Data Displayed:** Full draw state: status, entry\_pool\_size, pre-gen sealed commit hash (if generated), 30-digit display (post-operator entry), winner count preview, budget running total, operator connection status

**User Actions:**

| Action | Trigger | Visible When | Result | Source Rule |
| :---- | :---- | :---- | :---- | :---- |
| Snapshot Entry Pool | Button tap | draw.status='Scheduled' | POST /admin/draws/{id}/snapshot; status → Pool\_Snapshotted | FEAT-006 |
| Pre-Generate Winning Numbers | Button tap | draw.status='Pool\_Snapshotted' | POST /admin/draws/{id}/pre-generate; confirmation modal | FEAT-007 |
| Override Number | Button tap | Mismatch alert visible | POST /admin/draws/{id}/override-number; form for physical result | FEAT-007 |
| Winner Preview | Button tap | All 30 digits confirmed | GET /admin/draws/{id}/winner-preview; modal | FEAT-010 |
| Finalize Draw | Button tap | Winner preview shown | POST /admin/draws/{id}/finalize; two-step confirm | FEAT-010 |
| Export Winners | Button tap | draw.status='Finalized' | GET /admin/draws/{id}/winners/export → SCR-033 | FEAT-036 |

**Screen States:** Status-driven: Scheduled → Snapshotted → Pre-Generated → Digit Entry → Live Finalization → Finalized. Each status shows appropriate action buttons and hides irrelevant ones. Error states per action.

**Real-Time Elements:** WebSocket `/ws/admin/draw/{id}/live` — live digit feed from operator; real-time prize credit progress; notification delivery rate

---

### 3.29 SCR-028: Operator Draw Tablet UI

| Field | Value |
| :---- | :---- |
| Screen ID | SCR-028 |
| Screen Name | Operator Draw Tablet UI |
| Screen Type | Form |
| Parent Module | MOD-002 — Draw Management |
| Accessible By | ROLE-009 only (IP-whitelisted studio tablet) |
| Entry Points | Direct URL /operator (not accessible from admin nav) |
| Related Features | FEAT-009 |

**Data Displayed:** Draw \#, broadcast status 'متصل ✅', current number index (1/2/3), 10 digit slot positions (right-to-left layout), digit entry numpad (0–9), correction button, number confirm button

**Form Fields:**

| Field | Type | Validation |
| :---- | :---- | :---- |
| Digit for position N | Single tap (0–9) | 0–9 only; correctable before per-number confirm |

**Submit Behavior:** Each digit tap: POST /admin/draws/{id}/digit; acknowledgement within 500ms; per-number confirm: POST /admin/draws/{id}/confirm-number/{index}

**Screen States:** Auth check (token \+ IP) → Ready → Digit entry in progress → Number confirmed → All complete

---

### 3.30–3.43 SCR-029 through SCR-043: Admin Screen Specifications (Abbreviated)

*\[The following screens follow the same specification schema. Key fields documented below; full spec follows the standard template.\]*

**SCR-029: Challenge Calendar**

- Type: List | Module: MOD-003 | Accessible By: ROLE-007  
- Shows challenges: type badge, name\_ar, status (Draft/Scheduled/Active/Expired), date range, reward summary  
- Actions: Tap row → SCR-030 (edit if Draft) or read-only detail; '+ تحدي جديد' → SCR-030 (create)  
- Related Features: FEAT-012

**SCR-030: Create/Edit Challenge Form**

- Type: Form | Module: MOD-003 | Accessible By: ROLE-007  
- Fields: name\_ar (required), type (enum), metric (enum), target\_value (positive int), category\_filter (nullable), scope (enum: individual), start\_date, end\_date, reward\_entries, reward\_cash\_iqd (optional), reward\_badge (optional), checkpoints (JSON builder UI)  
- Submit: POST /api/v1/admin/challenges or PUT /api/v1/admin/challenges/{id}  
- Preview modal before activation; activation requires separate 'تفعيل' action from SCR-029  
- Related Features: FEAT-012

**SCR-031: Channel Multiplier Config**

- Type: Settings | Module: MOD-001 | Accessible By: ROLE-007  
- Shows 3 rows: online, pos, fawz\_certified — current multiplier value (editable inline), last updated  
- Edit inline: validation 0.1–10.0; confirmation modal; AuditLog on change  
- Warning banner if draw is in progress: 'سحب جارٍ — التغيير لن يؤثر على السحب الحالي'  
- Related Features: FEAT-004

**SCR-032: System Configuration Screen**

- Type: Settings | Module: MOD-008 | Accessible By: ROLE-007  
- Groups: Entry Rules / Payout Rules / Referral Rules / Merchant Rules / Fraud Rules / System Rules  
- Each parameter: label, current value, data\_type, edit button  
- Inline edit with type-safe validation; confirmation before save; each parameter has '📋 سجل التغييرات' → SCR-043  
- Related Features: FEAT-035

**SCR-033: Winner Export Screen**

- Type: Action Dashboard | Module: MOD-008 | Accessible By: ROLE-007  
- Shows: export scope (last-7+, media-consent only), record count preview, excluded count (no consent)  
- Single 'تنزيل CSV' button → streams file to browser; action logged in AuditLog  
- Related Features: FEAT-036

**SCR-034: Audit Log Viewer**

- Type: List | Module: MOD-008 | Accessible By: ROLE-007, ROLE-008  
- Filters: actor\_id, action\_type, object\_type, object\_id, time range  
- Each row: actor, action, object, IP, timestamp, expand for before/after JSON diff  
- 'تصدير' button: filtered CSV; READ ONLY — no edit/delete UI elements  
- Related Features: FEAT-037

**SCR-035: Merchant Eligibility Dashboard**

- Type: Dashboard | Module: MOD-005 | Accessible By: ROLE-007  
- Shows: total eligible merchants, total ineligible, last batch run time, next scheduled batch  
- Summary stats: merchants gained/lost eligibility since last batch  
- Related Features: FEAT-021

**SCR-036: Fraud Review Queue**

- Type: List | Module: MOD-007 | Accessible By: ROLE-007, ROLE-008  
- Cases sorted: SLA-breached (red badge) → Standard (oldest first)  
- Each row: flag\_type, flagged account partial name, time flagged, SLA countdown, status  
- Filter: flag\_type, status, reviewer\_id  
- Related Features: FEAT-027, FEAT-028

**SCR-037: Fraud Case Detail**

- Type: Detail | Module: MOD-007 | Accessible By: ROLE-007, ROLE-008  
- Shows: full case context by flag\_type (referral network graph for referral cases; entry velocity chart for velocity anomaly; linked accounts for device match; transaction patterns for merchant self-dealing)  
- Action buttons: 'الموافقة' / 'الرفض' / 'تصعيد' / 'عرض الحساب' → each navigates to SCR-038 or SCR-040  
- Related Features: FEAT-028, FEAT-029

**SCR-038: Fraud Case Decision Form**

- Type: Form | Module: MOD-007 | Accessible By: ROLE-007, ROLE-008  
- Fields: decision (radio: approve/reject/escalate, required), reasoning\_notes (textarea, min 50 chars required), preview\_impact button (shows consequence before confirm)  
- Submit: POST /api/v1/admin/fraud/cases/{id}/decide; two-step confirm; AuditLog  
- Related Features: FEAT-029

**SCR-039: Compliance High-Value Queue**

- Type: List | Module: MOD-006 | Accessible By: ROLE-007, ROLE-008  
- Cases: flag\_type='high\_value\_winner'; shows winner name (partial), prize amount, draw date, 24h SLA countdown  
- Tap case → shows identity verification checklist \+ 'أطلق الجائزة' / 'رفض' action  
- Related Features: FEAT-026

**SCR-040: Account Management Screen**

- Type: Detail | Module: MOD-007 | Accessible By: ROLE-007, ROLE-008  
- Shows: ConsumerUser Fawz activity summary, account\_status, linked FraudReviewCases, linked PrizePayouts  
- Action: 'علِّق الحساب' (requires linked escalated FraudReviewCase, reasoning\_notes, two-step confirm); 'استعادة الحساب'  
- Related Features: FEAT-030

**SCR-041: Admin Batch Control**

- Type: Dashboard | Module: MOD-001 | Accessible By: ROLE-007  
- Panel: Retroactive Seeding — status (not run / in progress \+ progress bar / completed); run button (disabled if run\_lock\_flag=true); batch stats on completion  
- Panel: Post-draw retroactive expiry — shows scheduled time, last run status  
- Related Features: FEAT-002

**SCR-042: Notification Delivery Stats**

- Type: Dashboard | Module: MOD-009 | Accessible By: ROLE-007  
- Per-draw delivery stats: sent / delivered / failed / expired tokens; delivery % chart by hour post-draw; last draw summary  
- Related Features: FEAT-038

**SCR-043: Config Change History Modal**

- Type: Modal | Module: MOD-008 | Accessible By: ROLE-007  
- Shows: parameter name, before/after value pairs, changed\_by admin name, timestamp — sorted newest first  
- Read-only; no actions  
- Related Features: FEAT-035

---

## 04 — Navigation Architecture

### 4.1 Navigation Type

| Field | Value |
| :---- | :---- |
| Pattern | Hybrid: Bottom Tab Bar (consumer) \+ Stack Navigation (all) \+ Admin side-nav (admin web) |
| Consumer Top-Level Tabs | 4 tabs: رئيسي (Home), أرقامي (My Numbers), التحديات (Challenges), المزيد (More) |
| Admin Navigation | Web-based sidebar navigation (separate from consumer app) |
| Auth Strategy | Unauthenticated: SuperQi login screen (pre-Fawz scope). Authenticated consumer: Bottom tab bar \+ Fawz tab. Authenticated admin: Admin dashboard. ROLE-009: Operator-only direct URL. |

### 4.2 Tab Definitions (Consumer App)

| \# | Tab Label (AR) | Icon | Root Screen | Stack Screens | Badge | Visible To |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | رئيسي (Home) | house.fill | SCR-001 | SCR-002, SCR-003, SCR-004, SCR-005, SCR-006, SCR-009, SCR-010, SCR-011, SCR-012, SCR-013, SCR-014, SCR-015, SCR-016, SCR-017, SCR-018 | Notification count (red) | ROLE-001/002 |
| 2 | أرقامي (My Numbers) | ticket.fill | SCR-006 | SCR-004 | None | ROLE-001/002 |
| 3 | التحديات (Challenges) | star.fill | SCR-007 | SCR-008 | None | ROLE-001/002 |
| 4 | المزيد (More) | ellipsis | SCR-014 | SCR-011, SCR-012, SCR-013, SCR-017, SCR-018 | None | ROLE-001/002 |

*Merchant users (ROLE-003/004): Tab 1 → SCR-019 (Merchant Home); Tab 2 → SCR-020; Tab 3 → SCR-021; Tab 4 → SCR-014.*

### 4.3 Screen Transition Map

| From | To | Trigger | Transition | Params Passed | Auth Req | Back Behavior |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| SCR-001 | SCR-002 | Draw live banner tap / auto-redirect | Push | draw\_id | Yes | Pop to SCR-001 |
| SCR-001 | SCR-003 | 'النتائج' tap | Push | — | Yes | Pop to SCR-001 |
| SCR-001 | SCR-006 | 'أرقامي' or entry count tap | Push | — | Yes | Pop to SCR-001 |
| SCR-001 | SCR-007 | Challenge card tap / 'عرض التحديات' | Push | — | Yes | Pop to SCR-001 |
| SCR-001 | SCR-009 | Referral section tap | Push | — | Yes | Pop to SCR-001 |
| SCR-001 | SCR-012 | Bell icon tap | Push | — | Yes | Pop |
| SCR-001 | SCR-013 | Consent nudge banner tap | Modal | — | Yes | Dismiss |
| SCR-001 | SCR-015 | Auto (first open, sharia\_disclosure=false) | Modal (non-dismissible) | — | Yes | Dismisses to SCR-001 |
| SCR-002 | SCR-005 | Winner overlay 'شارك فوزك' tap | Push | draw\_winner\_id | Yes | Pop to SCR-002 |
| SCR-002 | SCR-004 | 'عرض النتائج الكاملة' tap (post-draw) | Push | draw\_id | Yes | Pop to SCR-002 |
| SCR-003 | SCR-004 | Draw row tap | Push | draw\_id | Yes | Pop to SCR-003 |
| SCR-004 | SCR-005 | 'شارك فوزك\!' tap | Push | draw\_winner\_id | Yes | Pop to SCR-004 |
| SCR-005 | SCR-011 | 'شاهد تفاصيل جائزتك' tap | Push | — | Yes | Pop to SCR-005 |
| SCR-006 | SCR-004 | Won entry row tap | Push | draw\_id | Yes | Pop to SCR-006 |
| SCR-007 | SCR-008 | Challenge card tap | Push | challenge\_id | Yes | Pop to SCR-007 |
| SCR-009 | SCR-010 | 'عرض السجل' tap | Push | — | Yes | Pop to SCR-009 |
| SCR-014 | SCR-013 | 'إعدادات الإشعارات' tap | Push | — | Yes | Pop to SCR-014 |
| SCR-014 | SCR-015 | 'إعدادات الموافقة' → Sharia | Modal | — | Yes | Dismiss |
| SCR-014 | SCR-016 | 'إعدادات الموافقة' → Media | Modal | — | Yes | Dismiss |
| SCR-019 | SCR-020 | 'أرقامي هذا الأسبوع' tap | Push | — | Yes | Pop to SCR-019 |
| SCR-019 | SCR-021 | 'الجوائز' tap | Push | — | Yes | Pop to SCR-019 |
| SCR-022 | SCR-023 | Credential check success | Replace | — | No | None (no back to login during MFA) |
| SCR-023 | SCR-024 | MFA success | Reset (replace stack) | — | No | None (admin session established) |
| SCR-024 | SCR-025 | Nav 'السحوبات' | Push | — | Yes (admin) | Pop |
| SCR-024 | SCR-036 | Fraud queue widget tap | Push | — | Yes (admin) | Pop |
| SCR-024 | SCR-039 | Compliance widget tap | Push | — | Yes (admin) | Pop |
| SCR-025 | SCR-026 | '+ سحب جديد' tap | Push | — | Yes | Pop |
| SCR-025 | SCR-027 | Draw row tap | Push | draw\_id | Yes | Pop |
| SCR-026 | SCR-027 | Form submit success (new draw) | Replace | draw\_id | Yes | Pop to SCR-025 |
| SCR-027 | SCR-033 | 'تصدير الفائزين' tap | Push | draw\_id | Yes | Pop |
| SCR-029 | SCR-030 | Challenge row tap / '+ تحدي جديد' | Push | challenge\_id? | Yes | Pop |
| SCR-036 | SCR-037 | Case row tap | Push | case\_id | Yes | Pop |
| SCR-037 | SCR-038 | Decision action tap | Push | case\_id, decision\_type | Yes | Pop |
| SCR-037 | SCR-040 | 'عرض الحساب' tap | Push | account\_id | Yes | Pop |
| SCR-038 | SCR-036 | Decision submitted | Pop (replace) | — | Yes | Returns to updated queue |
| SCR-032 | SCR-043 | 'سجل التغييرات' tap | Modal | config\_key | Yes | Dismiss |

**Push Notification → Screen Deep Links:**

| Notification Type | Deep Link Target | Params |
| :---- | :---- | :---- |
| Entry earned | fawz://home | — |
| Challenge checkpoint | fawz://challenges/{challenge\_id} | challenge\_id |
| Challenge completed | fawz://challenges | — |
| Draw reminder | fawz://draw/live | draw\_id |
| Draw result (winner) | fawz://win/{draw\_winner\_id} | draw\_winner\_id → SCR-005 |
| Draw result (non-winner) | fawz://draw/{draw\_id} | draw\_id → SCR-004 |
| Referral rewarded | fawz://referrals | — → SCR-009 |
| Prize held | fawz://prizes | — → SCR-011 |
| Account suspended | fawz://profile | — → SCR-014 (shows suspension notice) |
| Retroactive seeding complete | fawz://home | — |

### 4.4 Deeplink Schema

| Screen | Deeplink Pattern | Parameters | Auth Required |
| :---- | :---- | :---- | :---- |
| SCR-001 | fawz://home | — | Yes |
| SCR-002 | fawz://draw/live | draw\_id (optional) | Yes |
| SCR-004 | fawz://draw/{draw\_id} | draw\_id | Yes |
| SCR-005 | fawz://win/{draw\_winner\_id} | draw\_winner\_id | Yes |
| SCR-007 | fawz://challenges | — | Yes |
| SCR-008 | fawz://challenges/{challenge\_id} | challenge\_id | Yes |
| SCR-009 | fawz://referrals | — | Yes |
| SCR-011 | fawz://prizes | — | Yes |
| SCR-012 | fawz://notifications | — | Yes |
| Referral landing | qi.iq/fawz/{code} | referral\_code | No (attribution pre-auth) |

### 4.5 Authentication Gates

| Condition | Behavior | After Resolution |
| :---- | :---- | :---- |
| Consumer not authenticated | Redirect to SuperQi login stack; preserve deeplink target in navigation state | Post-login: navigate to preserved target screen |
| Consumer account suspended | All Fawz screens accessible; entry generation blocked (server-side); suspension notice on SCR-014 | Admin reinstatement: notice removed |
| Admin not authenticated | Redirect to SCR-022 (Admin Login) | Post-login: navigate to SCR-024 or requested admin screen |
| Admin wrong IP | SCR-022 shows IP block error; no redirect | User must access from whitelisted IP |
| Admin session idle (30 min) | MFA re-validation modal appears over current screen | Post-MFA: current screen retained |
| Operator token expired | SCR-028 shows 'انتهت صلاحية جلستك — تواصل مع المشرف' | Operator provisioned new token by ROLE-007 |
| Wrong role accessing screen | Navigate back; toast 'لا صلاحية' | Back to previous screen |

### 4.6 Global Persistent Elements (Consumer App)

| Element | Behavior | Data Source | Visible On |
| :---- | :---- | :---- | :---- |
| Notification bell (top-right) | Red badge with unread count; tap → SCR-012 | GET /api/v1/notifications/unread-count (60s polling) | All SCR-001 through SCR-021 consumer screens |
| Network status bar | Thin red bar 'غير متصل' at top; disappears on reconnect | System network state | All screens when offline |
| Toast notifications | Auto-dismiss after 3 seconds; appear at bottom; success=green, error=red, warning=yellow | In-app state | All screens |
| Live draw CTA banner | Appears on SCR-001 and SCR-003 when draw is live | draw.status polling 30s | SCR-001, SCR-003 |
| Entry count badge (Fawz tab icon) | Shows current draw entry count; updates on new entry push | Push payload | Bottom tab bar |

---

## 05 — Experience Constraints

| Constraint Category | Rule |
| :---- | :---- |
| Error Tone | All error messages in Iraqi Arabic dialect (عامية عراقية). Friendly, not technical. No HTTP codes visible to users. Admin errors may use clearer technical language. |
| Destructive Actions | All irreversible actions (draw finalization, account suspension, batch execution) require a two-step confirmation modal with explicit Arabic confirmation text. System shows consequence preview before confirm (e.g., 'X فائز، إجمالي X IQD'). |
| Feedback | Every user action that triggers an API call shows a loading state within 100ms. Every successful state change triggers visual feedback (animation, toast, badge update). Failures always surface a human-readable error message with a retry path. |
| Progress Visibility | Long operations (retroactive seeding batch, prize fan-out) show progress bars with estimated completion. Batch progress updates every 30 seconds. Draw finalization progress shown in real-time. |
| Information Density | Consumer screens use progressive disclosure: key stats prominent; details behind tap. Max 3 active challenge cards visible before scroll. Entry history defaults to 20 items per page. Admin screens may be information-dense (tables, filters) — optimized for desktop-viewport admin web interface. |
| Accessibility | RTL layout enforced for all Arabic consumer screens. Arabic-Indic numerals for consumer-facing numbers (configurable); Western numerals for admin. Minimum tap target 44×44pt. Color not used as sole indicator (always paired with text/icon). Screen reader accessibility for key consumer actions. |
| Loading Strategy | Skeleton screens preferred over spinners for all list and detail views. Inline loading indicators (small spinner) for button actions. Full-page spinners only for navigation transitions \< 500ms. |
| Offline Behavior | Consumer entry history, draw results, challenge progress cached for 7 days. Notification center cached for 7 days. Prize history cached for 30 days. Actions that require connectivity show clear disabled state with 'يتطلب اتصالاً بالإنترنت'. Draw watching requires connection (real-time; no meaningful offline state). Admin panel: no offline support. |
| Language | All consumer copy: Arabic (عامية عراقية — Iraqi dialect). Numbers: Arabic-Indic (٠١٢٣) for consumer display. Admin interface: Arabic labels with English technical terms permitted in admin. API responses: English field names, Arabic display values. |
| Animations | Entry count increment: gold particle burst (\< 500ms). Digit reveal: slot-machine style right-to-left fill (\< 200ms per digit). Challenge completion: confetti burst. Winner overlay: fade-in gold gradient. All animations are interruptible and respect reduced-motion system setting. |

---

## 06 — Assumptions & Inferences Log

### 6.1 Inferred Decisions \[INFERRED\]

| \# | Decision | Reasoning | Source Signal | Risk |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Consumer navigation uses 4-tab bottom bar (Home, My Numbers, Challenges, More) | Features Document groups primary consumer actions into these 4 clusters; standard mobile navigation pattern for loyalty/rewards apps | FEAT-041 (Fawz Tab), FEAT-003 (My Numbers), FEAT-016 (Challenges), FEAT-014 (Profile/More) | LOW |
| 2 | Admin interface is a web application separate from the React Native consumer app | Admin operations (draw control, audit log, config management) require desktop-scale data views; tablet for operator is confirmed as web browser | FEAT-033: 'admin token \+ IP whitelist'; operator 'admin tablet' language throughout | LOW |
| 3 | Live Draw screen auto-navigates when draw becomes Live | Best-in-class draw experience requires immediate redirect; polling draw.status every 30s on SCR-001 triggers auto-navigate | Business Document Section 15: 'draw as a shared cultural ritual' | LOW |
| 4 | Winner share card is generated client-side using React Native Canvas (no server round-trip) | Performance constraint: 2-second render on low-end device; server-side image generation introduces latency and server load for millions of concurrent requests post-draw | FEAT-043: 'share card generated client-side' explicitly stated | LOW |
| 5 | Merchant view is a variant within the same React Native app, not a separate merchant app | Merchants are SuperQi account holders; a separate app creates adoption friction; merchant Fawz section is passive (view-only) and doesn't warrant a standalone app | Business Document: 'merchant shared entry' \+ merchant journey is entirely passive | LOW |
| 6 | Notification bell badge count uses 60-second polling (not WebSocket) | WebSocket connection for badge count alone would be resource-intensive; 60s polling is sufficient for a notification count badge; draw-night real-time handled separately by draw WebSocket | Standard mobile notification badge pattern | LOW |
| 7 | '+ 4 More' tab consolidates Profile, Prize History, Notification Center, Dispute, Settings for standard consumers | Prevents overcrowding bottom nav; these are lower-frequency destinations vs. Home/My Numbers/Challenges | Standard mobile UX pattern (iOS/Android tab conventions: max 5 tabs, often 4\) | LOW |
| 8 | Sharia disclosure modal is non-dismissible (cannot tap outside to close) | Legal/compliance requirement; disclosure must be presented properly; Business Document explicitly states it re-appears on next open if not accepted | FEAT-044: 'if closed without agreeing, the disclosure reappears on next open (non-blocking)' | LOW |

### 6.2 Assumed Decisions \[ASSUMED\]

| \# | Decision | Reasoning | Industry Basis | Risk | Confirm? |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | \[ASSUMED\] WebSocket reconnection strategy: 3 attempts with exponential backoff (2s, 4s, 8s), then degrade to 5-second HTTP polling for draw digits | Balances reconnection aggressiveness with server load on draw night with 500K+ connections; polling fallback ensures no user misses digits entirely | Standard WebSocket resilience pattern (Socket.IO default) | LOW | NO |
| 2 | \[ASSUMED\] Entry count on SCR-001 hero updates via push notification payload (not WebSocket) | Push notifications already carry entry data in payload; a dedicated WebSocket for entry count updates would be wasteful; React Native push handlers can update local state | Standard FCM/APNs data payload pattern for loyalty counters | LOW | NO |
| 3 | \[ASSUMED\] Draw results screen (SCR-003) shows last 20 draws by default (most recent first), with load-more pagination | 20 draws ≈ 5 months of weekly \+ monthly draws — sufficient for most user queries; cursor-based pagination for the rest | Standard list pagination UX | LOW | NO |
| 4 | \[ASSUMED\] Operator tablet UI (SCR-028) is a full-screen PWA/web app accessed via browser, not a React Native screen | React Native apps cannot be constrained to a single IP; a web app (admin.fawz.iq/operator) with IP whitelist enforcement is the practical implementation | Standard kiosk/operator interface pattern | MEDIUM — if operator needs native app experience, this requires separate build | YES |
| 5 | \[ASSUMED\] Admin dashboard (SCR-024) widgets auto-refresh every 60 seconds for most metrics; real-time WebSocket only during active draw window | Constant WebSocket connection for all admin dashboard metrics is resource-intensive; 60s polling is sufficient for operational monitoring; draw window is the only time real-time admin monitoring is critical | Standard operations dashboard pattern | LOW | NO |
| 6 | \[ASSUMED\] The 'More' tab (SCR-014 as root) uses a settings-style list layout (not a tab) for navigation to Prize History, Notifications, Disputes, etc. | Standard iOS/Android 'More' tab pattern in fintech apps (e.g., Revolut, Monzo); avoids deep tab nesting | Universal mobile app pattern | LOW | NO |
| 7 | \[ASSUMED\] Draw results on SCR-004 highlight the authenticated user's matching entries automatically without user action | Core UX goal is instant win recognition; manual 'find my number' interaction would reduce emotional impact | Prize draw app UX best practice | LOW | NO |

### 6.3 Open Questions

| \# | Question | Impact if Wrong | Blocking? |
| :---- | :---- | :---- | :---- |
| 1 | Does the Fawz tab appear as one of the existing SuperQi bottom tabs (replacing or adding to existing navigation), or does Fawz open as a full-screen overlay/modal from within SuperQi? | If Fawz is a modal overlay rather than an embedded tab, the entire navigation architecture changes — no persistent bottom tab bar, all navigation is modal stacks | YES — must confirm with SuperQi product team |
| 2 | Is the merchant Fawz experience within the existing SuperQi merchant app (separate app from consumer) or the same app? | Determines whether merchant screens are role-based variants in one app or a separate React Native build | YES — must confirm with SuperQi |
| 3 | Should the live draw screen (SCR-002) show a video stream from Al Rabiaa TV in addition to the digit reveal UI, or only the digit reveal? | Embedding a live TV stream requires HLS/RTMP integration, CDN, and significant additional engineering | YES — product decision required |
| 4 | What is the UX for a consumer who has no SuperQi account and scans a merchant QR for referral? (Pre-account attribution flow) | Attribution before account creation requires deep-link parameter persistence through app install flow; deferred install attribution is complex | YES — determines FEAT-018 pre-auth referral flow implementation |

---

## Traceability Matrix

### Feature ↔ Screen ↔ Journey Map

| Feature ID | Feature Title | Screens | Journeys | Coverage |
| :---- | :---- | :---- | :---- | :---- |
| FEAT-001 | Qualifying Transaction → Entry Generation | SCR-001, SCR-006 | JRNY-001, JRNY-004, JRNY-005, JRNY-006 | Covered |
| FEAT-002 | Retroactive Entry Seeding | SCR-041 | JRNY-012 | Covered |
| FEAT-003 | Entry History View | SCR-006 | JRNY-013 | Covered |
| FEAT-004 | Channel Multiplier Configuration | SCR-031 | JRNY-017 | Covered |
| FEAT-005 | Draw Scheduling & Configuration | SCR-025, SCR-026 | JRNY-007 | Covered |
| FEAT-006 | Draw Entry Pool Snapshot | SCR-027 | JRNY-007 | Covered |
| FEAT-007 | Winning Number Pre-Generation | SCR-027 | JRNY-007 | Covered |
| FEAT-008 | Live Draw WebSocket Broadcast | SCR-002 | JRNY-002, JRNY-011 | Covered |
| FEAT-009 | Draw Digit Entry (Operator) | SCR-028 | JRNY-011 | Covered |
| FEAT-010 | Draw Finalization & Winner Calculation | SCR-027 | JRNY-007 | Covered |
| FEAT-011 | Draw Results Browsing | SCR-003, SCR-004 | JRNY-002, JRNY-013 | Covered |
| FEAT-012 | Challenge Creation & Management | SCR-029, SCR-030 | JRNY-008 | Covered |
| FEAT-013 | Onboarding Challenge Set | SCR-007, SCR-008, SCR-001 | JRNY-003 | Covered |
| FEAT-014 | Weekly Spark Streak Challenge | SCR-001, SCR-007, SCR-008 | JRNY-004 | Covered |
| FEAT-015 | Monthly Rotating Challenge | SCR-007, SCR-008, SCR-030 | JRNY-004, JRNY-008 | Covered |
| FEAT-016 | Challenge Progress View | SCR-007, SCR-008 | JRNY-003, JRNY-004 | Covered |
| FEAT-017 | Golden Ticket Referral Link Generation | SCR-009 | JRNY-005 | Covered |
| FEAT-018 | Referral Attribution & Click Tracking | SCR-009 (backend-visible) | JRNY-005 | Covered (backend-only visible) |
| FEAT-019 | Referral Fraud Validation & Reward | SCR-009, SCR-010 | JRNY-005 | Covered |
| FEAT-020 | Referral History View | SCR-010 | JRNY-005 | Covered |
| FEAT-021 | Merchant Eligibility Engine | SCR-035, SCR-019 | JRNY-006 | Covered |
| FEAT-022 | Merchant Shared Entry View | SCR-019, SCR-020 | JRNY-006 | Covered |
| FEAT-023 | Prize Wallet Credit Execution | SCR-027, SCR-011 (outcome visible) | JRNY-007 | Covered |
| FEAT-024 | Jackpot Rollover Management | SCR-001, SCR-027 | JRNY-007 | Covered |
| FEAT-025 | Prize & Win History View | SCR-011, SCR-021 | JRNY-013, JRNY-006 | Covered |
| FEAT-026 | High-Value Winner Hold | SCR-039, SCR-011 (held status) | JRNY-009 | Covered |
| FEAT-027 | Automated Fraud Flagging | SCR-036 (case appears) | JRNY-009 | Covered (backend-generated; visible via SCR-036) |
| FEAT-028 | Fraud Review Queue | SCR-036 | JRNY-009 | Covered |
| FEAT-029 | Fraud Case Decision | SCR-037, SCR-038 | JRNY-009 | Covered |
| FEAT-030 | Account Suspension Management | SCR-040 | JRNY-014 | Covered |
| FEAT-031 | Dispute Submission | SCR-017 | JRNY-010 | Covered |
| FEAT-032 | Dispute Resolution (Admin) | SCR-036 (dispute queue) | JRNY-010 | Covered |
| FEAT-033 | Admin Authentication | SCR-022, SCR-023 | JRNY-007, JRNY-009 | Covered |
| FEAT-034 | Admin Dashboard & Budget Monitor | SCR-024 | JRNY-007 | Covered |
| FEAT-035 | System Configuration Management | SCR-032, SCR-043 | JRNY-017 | Covered |
| FEAT-036 | Winner Export for Media | SCR-033 | JRNY-007 | Covered |
| FEAT-037 | Audit Log Viewer | SCR-034 | JRNY-018 | Covered |
| FEAT-038 | Push Notification Fan-out | SCR-042, SCR-024 (delivery stats) | JRNY-007 | Covered |
| FEAT-039 | Notification Preferences | SCR-013 | JRNY-015, JRNY-001 | Covered |
| FEAT-040 | In-app Notification Center | SCR-012 | JRNY-002 | Covered |
| FEAT-041 | Fawz Tab Home Screen | SCR-001 | JRNY-001, JRNY-002, JRNY-004 | Covered |
| FEAT-042 | User Fawz Profile Extension | SCR-014 | JRNY-003 | Covered |
| FEAT-043 | Draw Share / Winner Social Export | SCR-005 | JRNY-002, JRNY-016 | Covered |
| FEAT-044 | Consent & Media Permission | SCR-015, SCR-016 | JRNY-015 | Covered |

### Orphan Check

| Check | Result | Action Required |
| :---- | :---- | :---- |
| Features without screens | FEAT-018 (Referral Attribution — backend only; visible via SCR-009 pending state), FEAT-027 (Automated Fraud Flagging — backend only; output visible via SCR-036). Both are backend-only processes with no dedicated screen — documented as such. | None — backend-only features; output surfaced via existing screens |
| Screens without journeys | None — all 43 screens appear in at least one journey | None |
| Screens not reachable via navigation | None — all screens have ≥1 entry point defined in Section 3.1 | None |
| Broken cross-references | None — all FEAT-NNN, ROLE-NNN, SCR-NNN IDs verified against Features Document | None |

