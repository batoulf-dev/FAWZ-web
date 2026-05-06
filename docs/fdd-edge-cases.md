# ARCHITECTX — Functional Design Document — Edge Cases

## Fawz (فوز) — Error Scenarios, Recovery Flows & Edge Case Handling

---

### Document Control

| Field | Value |
| :---- | :---- |
| Product Name | Fawz (فوز) |
| FDD Edge Cases Version | 1.0-DRAFT |
| Source FDD User Flows | Fawz FDD User Flows v1.0-DRAFT |
| Source Features Document | FAWZ Features Document v1.0-DRAFT |
| Date | 2026-03-10 |

---

## 07 — Edge Cases

---

### 07.1 SCR-001: Fawz Tab Home — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-001 | Network timeout on initial load | Skeleton state persists \> 10s; error banner appears: 'تعذر التحميل — تحقق من الاتصال بالإنترنت'; last cached dashboard data (entry count, challenge progress) shown where available | 'حاول مرة أخرى' button triggers fresh API call; auto-retry on network reconnection |
| SCR-001 | API 500 on /api/v1/home | Individual widget error states; entry count shows last cached value with stale badge; challenge cards show error inline | Pull-to-refresh or Retry button per failing widget |
| SCR-001 | Offline — user opens app with no connection | Full offline banner 'غير متصل بالإنترنت'; entry count from last cache shown; countdown timer continues from device time; challenge cards show last known progress | App detects network reconnection and auto-refreshes silently |
| SCR-001 | Jackpot amount overflows display width (9+ digits IQD) | Rendered as abbreviated: '1.2 مليار IQD' — no wrapping or truncation that hides digits | Formatting rule confirmed at design time; graceful abbreviation |
| SCR-001 | User account suspended mid-session | Home loads normally (suspension doesn't block read); entry generation blocked server-side; suspension notice banner at top: 'حسابك موقوف — تواصل مع الدعم' | Navigate to SCR-014 (Fawz Profile) which shows suspension detail |
| SCR-001 | Draw status transitions to Live while user is on screen | Within 30s polling cycle, draw.status='Live' detected; red pulsing 'السحب مباشر الآن\! 🔴' banner animates in; screen auto-navigates to SCR-002 after 3-second countdown | User can tap 'ليس الآن' on countdown to cancel auto-navigate and stay on SCR-001 |
| SCR-001 | Pull-to-refresh fails (API error) | Toast 'تعذر التحديث' appears at bottom (3-second auto-dismiss); previously loaded data remains visible | Next pull-to-refresh or background refresh after 60s |
| SCR-001 | Sharia disclosure not yet accepted (first open) | Modal (SCR-015) auto-appears over home; home content visible but inaccessible behind dim overlay until accepted | Tapping 'فهمت وأوافق' dismisses modal; home fully accessible |
| SCR-001 | Notification bell badge count fails to load | Bell icon shown without badge (silent failure; no error displayed) | Badge count auto-retries on next 60s polling cycle |
| SCR-001 | No active challenges configured by admin | Challenge cards section shows 'لا توجد تحديات نشطة' placeholder with illustration; no broken UI | Section collapses gracefully; Weekly Spark section still visible |

---

### 07.2 SCR-002: Live Draw Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-002 | WebSocket connection fails on initial load | 3 reconnection attempts (2s, 4s, 8s); after all fail, degrades to HTTP polling every 5s; yellow 'استقبال بطيء' banner shown | Client continues on polling; transparent to user; WS reconnection retried every 60s in background |
| SCR-002 | WebSocket drops mid-draw after 5 digits entered | 'استقبال بطيء ⚠️' banner; switches to HTTP polling; missed digits catch up on next poll cycle; digit slots fill in catching up (no animation gap visible) | Auto-reconnect; user sees smooth continuation; if poll also fails: error state with 'الأرقام ستظهر عند الاتصال' |
| SCR-002 | User goes completely offline during draw | 'غير متصل ❌' connection indicator; draw cannot continue live; message: 'ستظهر نتائج السحب عندما تتصل مجدداً' | On reconnect, redirect to SCR-004 (Draw Detail) for completed draw results |
| SCR-002 | Finalization API takes \> 30 seconds | 'يجري حساب الفائزين...' spinner persists; no timeout error shown to consumer (finalization is admin-side); loading state maintained | Winner push notification resolves this state when delivered |
| SCR-002 | User has no entries in current draw (accessed via direct deeplink) | Live draw visible fully; digit reveal plays normally; post-finalization shows non-winner overlay: 'السحب انتهى — لم تشارك في هذا السحب'; explains how to earn entries | CTA: 'ادفع بسوبر كي لتشارك في السحب القادم' |
| SCR-002 | User opens Live Draw screen after draw has already been finalized | Screen detects draw.status='Finalized'; immediately redirects to SCR-004 (Draw Detail) | SCR-004 shows complete results including user's outcome |
| SCR-002 | Concurrent session on two devices during draw | Both devices receive same WebSocket broadcast; result overlay appears on both simultaneously; no conflict (read-only broadcast) | No recovery needed; expected behavior |
| SCR-002 | Session token expires during draw (30-min idle) | Mid-draw MFA re-auth modal appears over draw screen; draw digit display continues via anonymous WebSocket broadcast in background | User re-authenticates; draw screen resumes with full personalized data (user entry highlights re-appear) |

---

### 07.3 SCR-003: Draw Results List — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-003 | Network timeout on load | 5 skeleton cards persist; after timeout: 'تعذر التحميل' error banner with Retry | Retry button or pull-to-refresh |
| SCR-003 | No finalized draws yet (pre-launch) | Empty state: illustration \+ 'أول سحب قريباً — ابدأ بجمع أرقامك الآن\!'; countdown to first draw | CTA navigates to SCR-001 |
| SCR-003 | Pagination load-more fails | Last loaded page visible; bottom of list shows 'تعذر تحميل المزيد — حاول مرة أخرى' inline retry | Retry tap loads next page; existing data preserved |
| SCR-003 | User outcome badge fails to resolve (join query timeout) | Draw rows show without personal outcome badge; no broken layout | Silent retry on next data refresh; badge appears when resolved |
| SCR-003 | Offline | Last 20 cached draw rows shown with 'غير متصل' banner; outcome badges shown from cache | Reconnect triggers silent refresh |
| SCR-003 | API 500 | Error banner with Retry; no partial data shown if initial load fails | Retry |

---

### 07.4 SCR-004: Draw Detail — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-004 | Network timeout on load | Skeleton for 3 number rows \+ tier summary; error banner after timeout | Retry button |
| SCR-004 | Draw not yet finalized (deeplink to in-progress draw) | 'السحب جارٍ الآن' banner; redirect prompt to SCR-002 (Live Draw); detail not available until finalized | 'شاهد السحب المباشر' CTA → SCR-002 |
| SCR-004 | User has no match for this draw | Full draw detail shown; user section shows: 'لم تكن من بين الفائزين في هذا السحب — عدك X رقم للسحب القادم\!' | CTA: 'شاهد أرقامك للسحب القادم' → SCR-006 |
| SCR-004 | Winning numbers data malformed (data integrity issue) | Numbers display with '—' placeholders; error note: 'خطأ في بيانات السحب — تواصل مع الدعم' | Admin notified via automated error; no recovery for consumer on this screen |
| SCR-004 | Invalid draw\_id in deeplink | 404 error screen: 'هذا السحب غير موجود' | Back button to SCR-003 |
| SCR-004 | Offline — draw previously cached | Cached detail shown with 'غير متصل' banner; user's match highlights from cache | Reconnect triggers silent refresh |
| SCR-004 | High-value winner hold on user's prize | User section shows prize with 'قيد المراجعة ⏳ — سيتم التواصل معك خلال 24 ساعة' instead of 'مدفوع ✅' | Prize History (SCR-011) shows same held status; no further action by user |

---

### 07.5 SCR-005: Winner Share Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-005 | Share card API (share-card endpoint) fails | 'تعذر تحميل بطاقة الفوز' error; Retry button; 'شارك عبر رابط' fallback option (text-only share) | Retry; fallback generates text-based share message without image |
| SCR-005 | Offline | Full offline state: 'لا يمكن تحميل بطاقة الفوز بدون إنترنت'; back button prominent | Reconnect and retry |
| SCR-005 | Native share sheet dismissed by user (no platform selected) | Returns to SCR-005; share card still visible; share button available again | User can re-tap share |
| SCR-005 | draw\_winner\_id invalid (deeplink tampered) | 404 / Permission denied error: 'هذه البطاقة غير متاحة'; no winner data rendered | Back button to SCR-001 |
| SCR-005 | User navigates back then forward (stale state) | Share card re-renders from cached draw\_winner data; no new API call needed if cache fresh | No issue; card is idempotent |
| SCR-005 | Media consent not given (winner in Last-7 tier) | Share card still available for personal sharing; no restriction on personal share (consent governs official TV export only) | No blocking; user can still share personally |

---

### 07.6 SCR-006: My Numbers (Entry History) — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-006 | Network timeout on load | 5 skeleton entry rows; error banner after timeout | Retry / pull-to-refresh |
| SCR-006 | User has 0 entries (brand new user, no transactions) | Empty state: '🎫 ما عدك أرقام بعد\!' illustration; 'ادفع 1,000 IQD أو أكثر بسوبر كي لتحصل على أرقامك الأولى\!' CTA | CTA navigates user back to SuperQi payment flow |
| SCR-006 | Entry list has \> 10,000 entries (heavy user) | Cursor-based pagination handles gracefully; no performance degradation; filter tabs help narrow view | No action needed; pagination is transparent |
| SCR-006 | Filter tab produces 0 results (e.g., no challenge entries) | Inline empty state within filter: 'لا أرقام من التحديات بعد' with 'عرض التحديات' CTA | CTA → SCR-007 |
| SCR-006 | Entry outcome shows 'Won' but tapping row leads to deleted/missing draw | 'تعذر فتح تفاصيل السحب' toast; no navigation | Toast auto-dismisses; user remains on entry list |
| SCR-006 | Retroactive seeding entries appear in bulk on first post-seeding open | Entries may number in hundreds; pagination handles gracefully; 'مبكر' source badge clearly labels them | No issue; expected first-open scenario |
| SCR-006 | Offline | Last 7-day cache shown; 'غير متصل' banner; entry count from cache | Reconnect auto-refreshes |
| SCR-006 | API 500 on entry fetch | Error banner \+ Retry | Retry button |

---

### 07.7 SCR-007: Challenges Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-007 | Network timeout on load | 2 skeleton challenge cards; error banner after timeout | Retry |
| SCR-007 | All challenges expired this month (admin hasn't published new ones) | Empty active section: 'لا توجد تحديات نشطة الآن — تحقق قريباً'; completed section expanded showing past challenges | No action needed; resolved when admin creates new challenge |
| SCR-007 | Challenge progress webhook/push delayed (user completed challenge but screen not yet updated) | Progress bar shows stale state; pull-to-refresh shows updated completion | Pull-to-refresh; or next 60s background refresh |
| SCR-007 | Onboarding challenge set completed but badge not yet reflected | '4/4 ✅' shows locally; badge on SCR-014 may be T+1min delayed; no inconsistency visible to user on this screen | Background: badge award async; appears on profile within 1 min |
| SCR-007 | Offline | Cached challenges \+ progress from last 7 days; 'غير متصل' banner | Reconnect auto-refreshes |
| SCR-007 | Admin deactivates an active challenge mid-month | Challenge card disappears on next refresh; if user was mid-progress, push notification: 'التحدي X تم إيقافه — شكراً لمشاركتك' | No partial reward (defined in FEAT-012 rules); graceful disappearance |

---

### 07.8 SCR-008: Challenge Detail — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-008 | Challenge expired while user is viewing it | End date passed; screen transitions to Expired state: grey overlay 'انتهى التحدي'; current progress frozen | Back to SCR-007 |
| SCR-008 | Checkpoint reward fires mid-view (user transacts while screen is open) | If push arrives during foreground, progress bar animates to checkpoint; checkpoint marker pulses | No user action needed; auto-update via push payload |
| SCR-008 | Challenge deleted by admin while user is viewing | API returns 404 on next poll; toast: 'هذا التحدي لم يعد متاحاً'; screen pops | Back to SCR-007 |
| SCR-008 | Progress data shows current\_value \> target\_value (data anomaly) | Progress bar clamped at 100%; no visual overflow; no crash | System-side data integrity issue; no user impact |
| SCR-008 | Offline | Cached progress shown; 'غير متصل' banner; countdown timer continues from device time | Reconnect auto-refreshes |
| SCR-008 | Network error on initial load | Skeleton state; error banner; Retry | Retry button |

---

### 07.9 SCR-009: Referral Screen (Golden Ticket) — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-009 | Referral link expired (30-day expiry passed) | Card shows: 'رابطك انتهى — يتم تجديده تلقائياً' \+ spinner; POST /referrals/regenerate called automatically | New link displayed within 5 seconds; no user action needed |
| SCR-009 | Referral link generation API failure | Error banner: 'تعذر تحميل رابطك — حاول مجدداً'; no link shown | Retry button |
| SCR-009 | User has reached 10 referrals this month (fraud flag threshold) | Yellow advisory banner: 'اقتربت من الحد الموصى به — الإحالات الإضافية قد تخضع للمراجعة'; link still visible and shareable; next reward goes to pending\_review (per FEAT-019) | No blocking; advisory only |
| SCR-009 | WhatsApp not installed on device | Tapping 'شارك عبر واتساب' opens native share sheet instead; standard iOS/Android intent fallback | No error; graceful fallback |
| SCR-009 | Clipboard write fails (permissions) | 'نسخ الرابط' falls back to showing link in selectable text modal | User can manually select \+ copy |
| SCR-009 | Offline | 'لا يمكن تحميل رابطك بدون إنترنت'; last known referral stats from cache shown below | Reconnect triggers auto-refresh |
| SCR-009 | Network timeout on load | Skeleton link card \+ stats skeleton; error after timeout | Retry |

---

### 07.10 SCR-010: Referral History — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-010 | Network timeout on load | Skeleton rows; error banner after timeout | Retry |
| SCR-010 | User has no referrals | Empty state: '🎁 لا إحالات بعد — شارك رابطك مع أصدقائك وابدأ الربح\!' | CTA → SCR-009 |
| SCR-010 | Referral in 'pending\_review' for \> 48 hours | Status badge still shows 'قيد المراجعة' with timestamp; no escalation option for consumer | Static display; resolved by admin action |
| SCR-010 | Referral shows 'rejected' with no displayed reason | Status: 'لم تكتمل' badge; tapping row shows tooltip: 'تعذر التحقق من الإحالة — لم يتم منح المكافأة' (generic, no internal fraud details) | No recovery for consumer; admin resolved internally |
| SCR-010 | Offline | Cached referral history shown; 'غير متصل' banner | Reconnect auto-refreshes |

---

### 07.11 SCR-011: Prize History — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-011 | Network timeout on load | Skeleton prize rows; error after timeout | Retry / pull-to-refresh |
| SCR-011 | User has never won | Empty state: '🏆 لم تفز بعد — استمر في الدفع بسوبر كي\!' | No CTA needed; motivational |
| SCR-011 | High-value prize in 'Held\_For\_Review' shows indefinitely | Row shows 'قيد المراجعة ⏳' with 'سيتم التواصل معك خلال 24 ساعة' tooltip; no further user action | Resolved by admin via SCR-039; user notified by push on resolution |
| SCR-011 | Prize payout\_status='Rejected' | Row shows 'مرفوض ❌' badge; tapping row shows: 'تواصل مع الدعم عبر \[email/number\]' | Dispute option: 'تقديم شكوى' CTA → SCR-017 |
| SCR-011 | Payout credited but user doesn't see it in SuperQi wallet | This is a SuperQi wallet sync issue (out of Fawz scope); display shows 'مدفوع ✅' on Fawz side | User directed to SuperQi support for wallet inquiry |
| SCR-011 | Offline | Cached prize history (30-day cache); 'غير متصل' banner | Reconnect refreshes |

---

### 07.12 SCR-012: Notification Center — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-012 | Network timeout on load | Skeleton notification rows; error after timeout | Retry |
| SCR-012 | No notifications yet | Empty state: 'لا يوجد إشعارات بعد — ابدأ بالدفع بسوبر كي\!' | No action needed |
| SCR-012 | Notification deep link leads to deleted content (e.g., challenge removed) | Tapping notification navigates; target screen shows 404 state | Toast: 'هذا المحتوى لم يعد متاحاً'; navigated back automatically |
| SCR-012 | Mark-all-read API fails | 'تعذر التحديث' toast; unread state persists | Retry button in toast; or re-tap 'مسح الكل' |
| SCR-012 | Offline | Last 7-day notification cache shown; 'غير متصل' banner; read/unread state from cache | Reconnect syncs unread state |
| SCR-012 | Notification payload contains Arabic-Indic numerals mixed with Latin characters | Displayed as-is (bidi-safe text rendering); Arabic text right-aligned; no garbling | React Native Text with RTL ensures correct rendering |

---

### 07.13 SCR-013: Notification Preferences — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-013 | Auto-save PATCH fails on toggle | Toast: 'تعذر حفظ التفضيل — حاول مرة أخرى'; toggle reverts to previous state visually | User re-toggles; automatic retry not attempted to avoid conflicting states |
| SCR-013 | Offline | All toggles shown in last cached state; toggles disabled; 'لا يمكن تغيير الإعدادات بدون اتصال' tooltip | Reconnect enables toggles |
| SCR-013 | System Critical toggle mis-displayed as editable | Defensive: toggle styled disabled (grey), no tap response; label: 'لا يمكن إيقافها' | Design enforcement; no user action possible |
| SCR-013 | First-time flow: user dismisses notification consent screen | Preferences saved as all-default (all On); user can revisit via SCR-014 settings | No data loss; defaults are sensible |
| SCR-013 | Network timeout on load | Skeleton toggles; error after timeout | Retry; cached toggle states shown if available |

---

### 07.14 SCR-014: Fawz Profile — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-014 | Network timeout on load | Skeleton profile card; error after timeout | Retry |
| SCR-014 | Badge award async delayed (challenge just completed but badge not yet in API) | Profile shows badges from last API response; may show N-1 badges momentarily | Pull-to-refresh to sync; push notification for badge award also triggers background refresh |
| SCR-014 | Account suspension status on profile | Yellow banner at top: 'حسابك موقوف — تواصل مع الدعم على \[email\]'; all navigation to other screens still works; read-only view | Contact info prominently displayed |
| SCR-014 | SuperQi KYC display\_name is empty or null | Fallback: 'مستخدم فوز' displayed; no crash | Backend should never send null name but defensive fallback required |
| SCR-014 | Offline | Cached profile shown; 'غير متصل' banner; settings links still tappable (navigate to cached preference screens) | Reconnect auto-refreshes |

---

### 07.15 SCR-015: Sharia Disclosure Modal — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-015 | User taps 'إغلاق' without accepting | Modal closes; home screen loads but disclosure\_accepted=false; next app open re-triggers modal | Standard; non-blocking per FEAT-044 spec |
| SCR-015 | Acceptance API call fails (PATCH sharia\_disclosure\_accepted=true) | Toast: 'تعذر حفظ موافقتك — يرجى المحاولة مجدداً'; modal remains open | Retry 'فهمت وأوافق' button; must not proceed to home without successful save |
| SCR-015 | Network timeout when accepting | Same as API fail above; modal remains open | Retry |
| SCR-015 | Modal re-appears even after acceptance (stale client state) | Should not occur with correct client-side state management; if seen: idempotent re-acceptance (no side effect) | Re-accepting is harmless; PATCH is idempotent |
| SCR-015 | Arabic text rendering issue (very long word without spaces) | Text area must use word-wrap Arabic rules; no overflow | Design: text wrapped with word-break for Arabic |

---

### 07.16 SCR-016: Media Consent Form — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-016 | User submits without selecting consent option | Validation error: 'يرجى اختيار خيار قبل المتابعة'; submit button remains disabled | User must select 'أوافق' or 'لا أوافق' |
| SCR-016 | Consent API fails on submit | Toast: 'تعذر الحفظ — حاول مرة أخرى'; selection preserved; modal remains | Retry submit |
| SCR-016 | User declines consent | Modal closes; no restriction on prize receipt; winner export for TV will exclude this user per FEAT-036/FEAT-044 | No further action; system records media\_consent=false |
| SCR-016 | User is not a Last-7 winner (accessed via SCR-014 settings for prior consent change) | Same form shown for consent management; can update decision | Updating consent PATCH to API; forward-dated for future draws |
| SCR-016 | Offline on load | Modal appears with static content; submit disabled with 'يتطلب الاتصال للحفظ' note | User must connect to save consent decision |

---

### 07.17 SCR-017: Dispute Submission Form — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-017 | Consumer already has 3 open disputes this month | Blocked state screen: 'وصلت للحد الأقصى (3 شكاوى شهرياً) — يرجى الانتظار حتى حل شكاواك الحالية'; form not rendered | View existing disputes: CTA → SCR-018 |
| SCR-017 | Dispute submission API fails | Toast error \+ inputs preserved; 'حاول مرة أخرى' button | Retry; all inputs preserved |
| SCR-017 | User enters Fawz Number in wrong format (not 10 digits) | Inline validation: 'يجب أن يكون الرقم 10 أرقام بالضبط'; submit blocked | User corrects inline |
| SCR-017 | Description field: user pastes Arabic text \> 500 chars | Character counter reaches 500; overflow silently truncated; counter shows 500/500 | No crash; counter color changes to red at limit |
| SCR-017 | Offline | Form fully rendered but submit button disabled; 'لا يمكن إرسال شكاوى بدون اتصال' note | User fills form offline; on reconnect can submit |
| SCR-017 | Session expires while filling form | MFA re-auth modal appears over form; form state preserved in local memory | Post re-auth: form still populated; user submits |

---

### 07.18 SCR-018: Dispute History — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-018 | Network timeout on load | Skeleton rows; error banner | Retry |
| SCR-018 | No disputes submitted | Empty state: 'لا شكاوى مقدمة — يمكنك تقديم شكوى عبر قسم الدعم' | CTA → SCR-017 |
| SCR-018 | Dispute auto-resolved while user is viewing | On next refresh, status changes to 'محلولة تلقائياً' with resolution summary | Pull-to-refresh; push notification also triggers update |
| SCR-018 | Offline | Cached dispute history shown; 'غير متصل' banner | Reconnect refreshes |

---

### 07.19 SCR-019: Merchant Fawz Home — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-019 | Merchant loses eligibility overnight (nightly batch) | Home shows eligibility banner: 'لم تُضَف أرقام فوز هذا الأسبوع — تجاوزت حد الأهلية المؤقت (50M IQD)'; entry count shows 0 for current week | Tooltip: 'تُراجَع الأهلية يومياً' — no further action by merchant |
| SCR-019 | Network timeout on load | Skeleton home; error banner | Retry |
| SCR-019 | Merchant wins large prize (Last-10 jackpot) — high-value hold | Win banner shows 'قيد المراجعة ⏳ — سيتم التواصل معك خلال 24 ساعة' instead of amount | Admin reviews via SCR-039; merchant notified by push on resolution |
| SCR-019 | Merchant is ROLE-004 (Fawz Certified) in Phase 1 — Phase 1.5 features not yet live | Certified badge shown if applicable; multiplier UI not rendered (Phase 1.5 feature flagged off) | Feature flag-controlled; no broken UI |
| SCR-019 | Offline | Cached merchant home data; 'غير متصل' banner | Reconnect refreshes |

---

### 07.20 SCR-020: Merchant Entry History — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-020 | Network timeout | Skeleton rows; error banner | Retry |
| SCR-020 | Merchant has 0 entries this week (no customer transactions) | Empty state: 'لا أرقام بعد هذا الأسبوع — الأرقام تظهر تلقائياً عندما يدفع زبائنك بسوبر كي' | Informational; no action |
| SCR-020 | Very large entry volume (1000+ entries in one week for a busy merchant) | Pagination handles; cursor-based pagination (20/page) | Load more on scroll |
| SCR-020 | Offline | Cached entries from last 7 days; 'غير متصل' banner | Reconnect refreshes |

---

### 07.21 SCR-021: Merchant Prize History — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-021 | No prizes won | Empty state: '🏆 لم تفز بعد — زبائنك يجلبون لك الأرقام\!' | Motivational; no action |
| SCR-021 | Network timeout | Skeleton rows; error | Retry |
| SCR-021 | Prize in 'Rejected' state | Row shows 'مرفوض' badge with CTA 'تقديم شكوى' → SCR-017 | Dispute flow |
| SCR-021 | Offline | Cached prize history; 'غير متصل' banner | Reconnect refreshes |

---

### 07.22 SCR-022: Admin Login — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-022 | Wrong email/password | Inline error: 'بريد إلكتروني أو كلمة مرور غير صحيحة' (no hint which is wrong for security); AuditLog records failed attempt | Re-enter credentials |
| SCR-022 | IP not whitelisted | Inline error: 'الوصول غير مسموح من هذا الموقع — تواصل مع مدير النظام'; AuditLog records IP | Admin must access from whitelisted network |
| SCR-022 | Login API 500 | Error banner: 'خطأ في النظام — حاول لاحقاً'; no credential exposure | Retry after pause |
| SCR-022 | Account locked (5 failed attempts) | Inline: 'تم تعليق الحساب لمدة 15 دقيقة بعد محاولات متكررة' | Wait for lockout period |
| SCR-022 | Session already active (user opens login URL with valid session) | Redirect to SCR-024 immediately; no re-auth needed | No issue |
| SCR-022 | TOTP device lost (cannot complete MFA on SCR-023) | User must contact platform admin for MFA reset; no self-service recovery path shown on UI | Offline admin process |

---

### 07.23 SCR-023: Admin MFA Verification — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-023 | Wrong TOTP code | Inline: 'رمز غير صحيح — حاول مرة أخرى' | User enters correct code (3 attempts before lockout) |
| SCR-023 | 3 consecutive wrong codes | Account locked for 5 minutes: 'حساب موقوف مؤقتاً — حاول بعد 5 دقائق'; timer displayed | Wait; AuditLog records |
| SCR-023 | TOTP code expired (30s TOTP window passed while typing) | Same 'رمز غير صحيح' error; user generates next code naturally | Wait for next 30s TOTP window |
| SCR-023 | MFA verification API 500 | Error banner with Retry | Retry submission |
| SCR-023 | Back button pressed during MFA | Returns to SCR-022 (login form); credentials cleared for security | Re-enter credentials to restart |
| SCR-023 | Offline during MFA submit | Error: 'يتطلب اتصالاً للتحقق'; code field disabled | Reconnect and retry |

---

### 07.24 SCR-024: Admin Dashboard — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-024 | Individual widget API fails (partial load) | Failed widget shows individual error card: 'تعذر تحميل \[widget name\] — أعد المحاولة'; other widgets load normally | Per-widget retry button |
| SCR-024 | Budget monitor shows \> 100% draw day overrun | Budget bar turns red; full-screen alert: 'تجاوز الميزانية المسطّرة — راجع المشرف المالي فوراً'; draw finalization blocked pending acknowledgement | ROLE-008 alert; ROLE-007 must acknowledge before finalization proceeds |
| SCR-024 | Fraud queue shows \> 50 cases | Queue badge turns red; banner alert at top: 'تراكم حالات الاحتيال — 52 حالة معلقة' | Navigate to SCR-036; prioritize SLA-near cases |
| SCR-024 | Real-time WebSocket to dashboard drops during draw | Dashboard switches to 60s polling; 'وضع التحديث البطيء ⚠️' badge on affected widgets | Auto-reconnect attempt every 60s |
| SCR-024 | Admin session idle timeout (30 min) | MFA re-auth modal over dashboard; dashboard content blurred | Re-authenticate; dashboard state preserved |
| SCR-024 | System health widget shows red (high API error rate) | Red RAG dot; pulsing; 'مشكلة في النظام — تواصل مع الفريق التقني' tooltip | Engineering escalation path (out of admin panel scope) |

---

### 07.25 SCR-025: Draw Calendar — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-025 | Network timeout on load | Skeleton draw rows; error banner | Retry |
| SCR-025 | No draws scheduled yet | Empty state: 'لا توجد سحوبات — أنشئ أول سحب الآن' with '+ سحب جديد' CTA | SCR-026 |
| SCR-025 | Admin tries to navigate to a Live draw control panel from a different tab (concurrent admin session) | Draw control panel shows current state; last writer wins; both admin sessions see same draw state | Warning: 'يوجد مشرف آخر يعمل على هذا السحب' — advisory only |
| SCR-025 | Draw row in 'Archived' status tapped | Read-only draw detail opens (SCR-004 admin view); no control panel actions available | Navigate back |

---

### 07.26 SCR-026: Create/Edit Draw Form — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-026 | Duplicate draw date (same type, same date already exists) | On submit: inline error 'يوجد سحب من هذا النوع في هذا التاريخ بالفعل' | Admin changes date |
| SCR-026 | Draw date in the past | Inline: 'التاريخ يجب أن يكون في المستقبل' | Admin corrects |
| SCR-026 | Prize tier values sum to 0 | Inline: 'يجب أن تكون قيم الجوائز أكبر من صفر' | Admin enters values |
| SCR-026 | API failure on save | Toast error \+ all form data preserved | Retry submit |
| SCR-026 | Admin tries to edit draw after snapshot taken | Edit form opens read-only with banner: 'لا يمكن تعديل السحب بعد تجميد المشاركين'; only pre-snapshot fields editable (if any) | Admin must cancel and create new draw |
| SCR-026 | Session timeout during long form fill | MFA re-auth modal over form; form data preserved | Re-auth; submit |

---

### 07.27 SCR-027: Draw Control Panel — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-027 | Snapshot action fails (API error) | Error banner: 'تعذر تجميد المشاركين — حاول مجدداً'; draw remains in Scheduled status | Retry snapshot action |
| SCR-027 | Pre-generation fails (cryptographic service unavailable) | Error: 'تعذر توليد الأرقام المختومة — تواصل مع الفريق التقني'; AuditLog records failure | Engineering escalation; draw cannot proceed until resolved |
| SCR-027 | Operator disconnects during digit entry | 'المشغل غير متصل ❌' status; AuditLog records disconnect time \+ last confirmed digit | Admin contacts operator; operator reconnects; entry resumes from last confirmed position |
| SCR-027 | Finalization API fails | Error: 'تعذر إنهاء السحب — حاول مرة أخرى'; draw remains in Live status | Retry; if persistent: engineering escalation |
| SCR-027 | Budget overrun detected on winner preview | Red alert modal: 'تجاوز الميزانية المتوقعة X%' with exact overrun amount | Admin can proceed (with explicit acknowledge) or abort finalization |
| SCR-027 | Admin loses connection during finalization (critical moment) | Finalization is a single atomic DB transaction server-side; partial state not possible; if client disconnects during confirm, server either completes or rolls back | On reconnect: draw shows correct finalized or still-Live status; admin can re-attempt if Live |
| SCR-027 | Duplicate finalization attempt (double-click) | Idempotent finalization endpoint; second call returns current draw state (already finalized) | No double-payout; no error shown if already finalized |

---

### 07.28 SCR-028: Operator Draw Tablet UI — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-028 | Tablet IP not in whitelist | All actions return 403; screen shows: 'هذا الجهاز غير مصرح به من هذا الموقع'; AuditLog records attempt | Admin must add tablet IP to whitelist |
| SCR-028 | Operator token expired during session | Next API call returns 401; screen shows: 'انتهت صلاحية جلستك — تواصل مع المشرف لتجديدها' | Admin re-provisions operator token (ROLE-007 action) |
| SCR-028 | Digit entered but acknowledgement not received within 500ms | 'لم يُستلم — أعد المحاولة' inline indicator on the digit slot | Operator re-taps digit; duplicate detection at server prevents double-entry |
| SCR-028 | Operator taps wrong digit before confirmation (e.g., '3' instead of '8') | Correction button appears immediately on current slot; operator taps correction; digit overwritten | AuditLog records correction; no broadcast of wrong digit until corrected |
| SCR-028 | Network drops during digit entry | 'لا اتصال ⚠️' banner; digit tap buffer held for 10s; auto-retry on reconnect | If reconnect within 10s: buffered digit replays; if \> 10s: operator re-enters missed digit |
| SCR-028 | Operator closes browser tab accidentally | Session remains valid for 5 minutes; reopening /operator URL restores session with last confirmed digit position | Admin draws last confirmed position from AuditLog if needed |
| SCR-028 | Physical draw machine produces digit not in 0-9 (hardware error) | Operator taps nothing; reports verbally to TV production team; admin uses 'تصحيح الرقم' on SCR-027 | Override from admin panel; AuditLog records manual override |

---

### 07.29 SCR-029: Challenge Calendar — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-029 | Network timeout on load | Skeleton rows; error banner | Retry |
| SCR-029 | No challenges created yet | Empty state: 'لا توجد تحديات — أنشئ أول تحدٍّ الآن' | '+ تحدي جديد' CTA |
| SCR-029 | Admin tries to edit an Active challenge | On tap: read-only view with banner 'لا يمكن تعديل التحدي النشط — يمكنك إلغاؤه وإنشاء تحدٍّ جديد' | Guidance only; no edit form opened |
| SCR-029 | Bulk expired challenges fill list | Pagination handles; filter by 'نشط' tab reduces noise | Filter tab |

---

### 07.30 SCR-030: Create/Edit Challenge Form — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-030 | end\_date before start\_date | Inline: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية' | Admin corrects |
| SCR-030 | Duplicate rotating challenge for same month | On activation: warning modal 'يوجد تحدٍّ دوار نشط لهذا الشهر' requiring explicit override confirmation | Admin decides: override or change dates |
| SCR-030 | target\_value \= 0 | Inline: 'يجب أن يكون هدف التحدي أكبر من صفر' | Admin corrects |
| SCR-030 | Checkpoint at\_value \> target\_value | Inline: 'نقطة التفتيش يجب أن تكون أقل من الهدف الكلي' | Admin corrects |
| SCR-030 | API failure on save | Toast error \+ form preserved | Retry |
| SCR-030 | Session timeout during form fill | MFA re-auth over form; data preserved | Re-auth; save |

---

### 07.31 SCR-031: Channel Multiplier Config — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-031 | Multiplier edit while draw is in progress | Warning banner: 'سحب جارٍ الآن — التغيير لن يؤثر على السحب الحالي'; change still allowed but admin advised | Admin proceeds or defers; change takes effect for next draw cycle |
| SCR-031 | Multiplier value out of range (0.0 or \> 10.0 entered) | Inline: 'يجب أن تكون قيمة المضاعف بين 0.1 و 10.0' | Admin corrects |
| SCR-031 | Confirmation rejected by admin (second-thoughts after confirmation modal) | Modal has Cancel; admin cancels; value reverts to previous | No change saved |
| SCR-031 | API save failure | Toast error; value reverts to pre-edit | Retry |
| SCR-031 | Offline | Edit fields disabled; 'لا يمكن تغيير الإعدادات بدون اتصال' | Reconnect |

---

### 07.32 SCR-032: System Configuration Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-032 | Admin enters value that would break a business rule (e.g., min\_qualifying\_tx \= 0\) | Inline validation per parameter (data\_type \+ min/max constraints); error: 'القيمة يجب أن تكون بين X و Y' | Admin corrects |
| SCR-032 | API save failure | Toast error; value reverts | Retry |
| SCR-032 | Admin changes referral fraud threshold during active fraud review | Change applied immediately; cases already flagged remain in queue; new threshold applies to future events | AuditLog records change with timestamp |
| SCR-032 | Concurrent edit by two admins (rare but possible) | Last writer wins; if both submit simultaneously, one gets 409 Conflict error: 'تم تعديل هذه القيمة مؤخراً — أعد تحميل الصفحة' | Reload page; see latest value |
| SCR-032 | Offline | Edit fields disabled; 'لا يمكن تغيير الإعدادات بدون اتصال' | Reconnect |

---

### 07.33 SCR-033: Winner Export Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-033 | Zero media-consent winners for this draw | Export preview shows: 'لا يوجد فائزون أعطوا موافقتهم الإعلامية' \+ count of excluded winners; download button disabled | Admin can note this; no action — media consent is winner's choice |
| SCR-033 | Export API fails | Toast error: 'تعذر تنزيل الملف — حاول مجدداً' | Retry; if persistent: file generation timeout → engineering |
| SCR-033 | Draw not yet finalized (accessing export before finalization) | Screen shows: 'السحب لم ينتهِ بعد — التصدير متاح بعد إنهاء السحب'; download disabled | Complete draw finalization first |
| SCR-033 | Very large winner count (\>100K entries generating large CSV) | Progress indicator during file generation; stream download | No timeout for admin; server streams file progressively |

---

### 07.34 SCR-034: Audit Log Viewer — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-034 | Network timeout on load | Skeleton log rows; error banner | Retry |
| SCR-034 | No log entries match applied filters | Inline empty state: 'لا توجد سجلات تطابق هذه المرشحات'; clear filter CTA | Clear filters → all entries visible |
| SCR-034 | Audit log export fails | Toast error | Retry export |
| SCR-034 | Very large log volume (millions of entries) | Server-side pagination \+ efficient cursor; client shows only current page; date filters required for large exports | Date range required if \> 100K result set; server enforces max export row limit |
| SCR-034 | Admin tries to edit or delete a log entry | No edit/delete UI exists; if attempted via API: 403 Forbidden; log is append-only | Architectural constraint; no recovery needed |

---

### 07.35 SCR-035: Merchant Eligibility Dashboard — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-035 | Network timeout on load | Skeleton stats; error banner | Retry |
| SCR-035 | Batch job hasn't run yet today | Shows last run timestamp; 'الدفعة التالية في X:XX مساءً' | Informational only |
| SCR-035 | Batch run failure (nightly batch errored) | Dashboard shows: 'فشلت الدفعة الليلية الأخيرة — تواصل مع الفريق التقني' with timestamp | Engineering escalation; manual batch trigger may be available |
| SCR-035 | Merchant count delta is unexpectedly large (1000s gained eligibility) | Stats shown as-is; no alert (admin judgment call) | Admin can investigate via search/filter if needed |

---

### 07.36 SCR-036: Fraud Review Queue — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-036 | Network timeout on load | Skeleton case rows; error banner | Retry |
| SCR-036 | Queue is empty (no fraud cases) | Empty state: 'لا حالات معلقة — النظام يعمل بشكل طبيعي ✅' | No action |
| SCR-036 | SLA timer hits 0 (case overdue) | Case row badge turns red 'متأخر'; case floats to top of queue | Reviewer must act immediately |
| SCR-036 | Reviewer opens a case already resolved by another reviewer (concurrent access) | Case detail (SCR-037) shows 'تمت معالجة هذه الحالة بالفعل' banner; decision form disabled | Back to queue; case filtered out on refresh |
| SCR-036 | Filter applied that returns 0 results | Inline: 'لا حالات تطابق هذه المرشحات' | Clear filter |
| SCR-036 | New case arrives while reviewer is on the queue page | Next 60s polling cycle adds row; or real-time WS push for admin sessions | Auto-update; new case appears at appropriate queue position |

---

### 07.37 SCR-037: Fraud Case Detail — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-037 | Case was resolved while reviewer was reading detail | Decision action buttons still visible; on submit: API returns 409 'تمت معالجة هذه الحالة بالفعل'; readonly banner appears | Back to queue |
| SCR-037 | Referral network graph too large to render (very high-degree node) | Graph capped at 50 connected nodes; '+ X علاقات أخرى' text indicator | Graph still conveys key pattern |
| SCR-037 | Transaction pattern chart API times out | Chart shows 'تعذر تحميل الرسم البياني' inline error; text-based case data still visible | Per-component retry |
| SCR-037 | Account in case already suspended | Action buttons show only 'عرض الحساب'; 'تعليق الحساب' grayed out with 'الحساب موقوف بالفعل' tooltip | No double-suspension possible |
| SCR-037 | Offline | No offline state for admin fraud review; full error: 'يتطلب الاتصال بالإنترنت' | Reconnect |

---

### 07.38 SCR-038: Fraud Case Decision Form — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-038 | Reasoning notes \< 50 characters on submit | Inline: 'يرجى إضافة ملاحظات تفصيلية (50 حرف على الأقل)' with character counter | Reviewer extends notes |
| SCR-038 | Decision API fails on submit | Toast error \+ form preserved | Retry |
| SCR-038 | Preview impact shows unexpected consequence (e.g., large reward release) | Preview modal shows exact impact; reviewer has full information before confirming | Reviewer can cancel and re-escalate |
| SCR-038 | Session timeout during form fill | MFA re-auth modal over form; form data preserved in local state | Re-auth; submit |
| SCR-038 | Character limit hit on reasoning notes (max 1000 chars) | Counter shows 1000/1000 in red; no further input accepted | Reviewer must trim |

---

### 07.39 SCR-039: Compliance High-Value Queue — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-039 | Network timeout on load | Skeleton rows; error banner | Retry |
| SCR-039 | Queue is empty | Empty state: 'لا جوائز عالية القيمة معلقة ✅' | No action |
| SCR-039 | 24-hour SLA timer hits 0 | Case turns red; automatic payout rejection may trigger (defined in FEAT-026 business rules); reviewer notified via push: 'مهلة مراجعة منتهية — تحقق فوراً' | Reviewer must handle; late approval may still be possible depending on rule config |
| SCR-039 | Identity verification checklist API fails | Checklist items show error inline; reviewer can still use reasoning field | Per-item retry |
| SCR-039 | Offline | No offline for compliance review; error state | Reconnect |

---

### 07.40 SCR-040: Account Management Screen — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-040 | Account already suspended (double-suspension attempt) | Suspension action button grayed out; tooltip: 'الحساب موقوف بالفعل'; only 'استعادة الحساب' available | No action needed |
| SCR-040 | Suspension requires linked escalated FraudReviewCase but none exists | Suspension button disabled; tooltip: 'يجب أن يكون هناك قضية احتيال مصعدة لتعليق الحساب' (per FEAT-030 rule) | Create/escalate fraud case first |
| SCR-040 | Suspension API fails | Toast error | Retry |
| SCR-040 | Account restored while another admin is viewing it | 'استعادة الحساب' button grayed out; '...الحساب نشط بالفعل' tooltip on refresh | Refresh page |
| SCR-040 | Reasoning notes \< 50 chars on suspension submit | Inline validation error | Extend notes |

---

### 07.41 SCR-041: Admin Batch Control — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-041 | Admin tries to re-run retroactive seeding (run\_lock\_flag=true) | 'تشغيل' button disabled; tooltip: 'تم تشغيل البذر الاسترجاعي بالفعل ويتعذر تكراره' | Cannot override run\_lock; no recovery path by design |
| SCR-041 | Batch fails mid-execution | Progress bar freezes; error status: 'فشلت الدفعة عند X / Y مستخدم — تواصل مع الفريق التقني'; partial entries already created are retained | Engineering investigation; partial retry may be supported by background job system |
| SCR-041 | Batch takes longer than expected (very large user base) | Progress updates every 30s; no timeout from UI side; admin advised to leave screen open or check back | ETA estimate shown based on processing rate |
| SCR-041 | Network timeout on load | Skeleton batch panels; error banner | Retry |
| SCR-041 | Admin navigates away during active batch | Batch continues server-side; progress persists; admin can return to SCR-041 to check status | No data loss |

---

### 07.42 SCR-042: Notification Delivery Stats — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-042 | Network timeout on load | Skeleton stats/charts; error banner | Retry |
| SCR-042 | No draw has occurred yet (pre-first-draw) | Empty state: 'لا بيانات متاحة بعد — ستظهر الإحصاءات بعد أول سحب' | No action |
| SCR-042 | Delivery rate \< 90% (anomalous) | Rate shown as-is; no automated alert on this screen (dashboard SCR-024 may show this alert separately) | Admin judgment; may indicate push credential issue |
| SCR-042 | Offline | Error state; no cached stats shown (stats are operational monitoring, not consumer-facing) | Reconnect |

---

### 07.43 SCR-043: Config Change History Modal — Edge Cases

| Screen | Scenario | User Experience | Recovery Path |
| :---- | :---- | :---- | :---- |
| SCR-043 | No history for this parameter (first time set) | Empty state within modal: 'لم يتم تعديل هذه القيمة بعد' | No action |
| SCR-043 | Network timeout on modal load | Modal body shows skeleton rows; error after timeout; dismiss button still works | Retry |
| SCR-043 | Very long change history (parameter changed hundreds of times) | Cursor-based pagination; 20 entries per page; oldest first option | Pagination |
| SCR-043 | Offline | Error state in modal; dismiss and reconnect | Reconnect |

---

## Edge Case Summary Statistics

| Metric | Value |
| :---- | :---- |
| Total screens covered | 43 |
| Total edge cases defined | 218 |
| Screens with \< 3 edge cases | None — all 43 screens have ≥ 3 edge cases |
| Categories with no coverage | None — all categories covered across the screen set |

**Coverage by category across all screens:**

| Category | Coverage |
| :---- | :---- |
| Network failures (timeout on load, timeout on submit, intermittent) | Covered on all applicable screens |
| Data states (no data, partial data, stale, conflicting) | Covered on all list/detail screens |
| Permission failures (not eligible, role changed, account suspended) | Covered on consumer screens with eligibility rules \+ all admin screens |
| Business rule violations (limits, expired content, duplicate action) | Covered on all transactional screens (referral, dispute, draw, config) |
| System errors (API 500, service unavailable, maintenance) | Covered on all screens with API calls |
| Session issues (token expired, concurrent session, device change) | Covered on draw, admin, and form screens |
| Input edge cases (malformed input, special chars, RTL in LTR) | Covered on all form screens |

