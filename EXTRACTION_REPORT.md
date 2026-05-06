# FAWZ Extraction Report

**Generated**: 2026-05-05
**Agent**: AGENT 1 — INFRASTRUCTURE

---

## 1. Full Screen List (SCR-001 to SCR-043)

### Consumer Module (SCR-001 to SCR-011) — Agent 2

| Screen ID | Screen Name | Type | Route |
|-----------|-------------|------|-------|
| SCR-001 | Fawz Tab Home | Dashboard | `/` |
| SCR-002 | Live Draw Screen | Live Event | `/draw/live` |
| SCR-003 | Draw Results List | List | `/draw` |
| SCR-004 | Draw Detail | Detail | `/draw/:id` |
| SCR-005 | Winner Share Screen | Detail | `/winner-share/:drawId` |
| SCR-006 | My Numbers (Entry History) | List | `/tickets` |
| SCR-007 | Challenges Screen | List | `/challenges` |
| SCR-008 | Challenge Detail | Detail | `/challenges/:id` |
| SCR-009 | Referral Screen (Golden Ticket) | Dashboard | `/referral` |
| SCR-010 | Referral History | List | `/referral/history` |
| SCR-011 | Prize History | List | `/prizes` |

### Notifications, Profile, Consent, Disputes (SCR-012 to SCR-018) — Agent 3

| Screen ID | Screen Name | Type | Route |
|-----------|-------------|------|-------|
| SCR-012 | Notification Center | List | `/notifications` |
| SCR-013 | Notification Preferences | Settings | `/notifications/settings` |
| SCR-014 | Fawz Profile | Detail | `/profile` |
| SCR-015 | Sharia Disclosure Modal | Modal | N/A (modal overlay) |
| SCR-016 | Media Consent Form | Modal/Form | N/A (modal overlay) |
| SCR-017 | Dispute Submission Form | Form | `/dispute` |
| SCR-018 | Dispute History | List | `/dispute/history` |

### Merchant Module (SCR-019 to SCR-021) — Agent 3

| Screen ID | Screen Name | Type | Route |
|-----------|-------------|------|-------|
| SCR-019 | Merchant Fawz Home | Dashboard | `/merchant` |
| SCR-020 | Merchant Entry History | List | `/merchant/tickets` |
| SCR-021 | Merchant Prize History | List | `/merchant/prizes` |

### Admin Module (SCR-022 to SCR-043) — Agent 3

| Screen ID | Screen Name | Type | Route |
|-----------|-------------|------|-------|
| SCR-022 | Admin Login | Auth | `/admin/login` |
| SCR-023 | Admin MFA Verification | Auth | `/admin/mfa` |
| SCR-024 | Admin Dashboard | Dashboard | `/admin` |
| SCR-025 | Draw Calendar | Calendar | `/admin/draw` |
| SCR-026 | Create/Edit Draw Form | Form | `/admin/draw/new`, `/admin/draw/:id/edit` |
| SCR-027 | Draw Control Panel | Control | `/admin/draw/:id` |
| SCR-028 | Operator Draw Tablet UI | Tablet | `/operator` |
| SCR-029 | Challenge Calendar | Calendar | `/admin/challenges` |
| SCR-030 | Create/Edit Challenge Form | Form | `/admin/challenges/new` |
| SCR-031 | Channel Multiplier Config | Config | `/admin/config/multipliers` |
| SCR-032 | System Configuration Screen | Config | `/admin/config` |
| SCR-033 | Winner Export Screen | Export | `/admin/export` |
| SCR-034 | Audit Log Viewer | List | `/admin/audit` |
| SCR-035 | Merchant Eligibility Dashboard | Dashboard | `/admin/merchants` |
| SCR-036 | Fraud Review Queue | Queue | `/admin/fraud` |
| SCR-037 | Fraud Case Detail | Detail | `/admin/fraud/:id` |
| SCR-038 | Fraud Case Decision Form | Form | (inline in SCR-037) |
| SCR-039 | Compliance High-Value Queue | Queue | `/admin/compliance` |
| SCR-040 | Account Management Screen | Detail | `/admin/accounts/:id` |
| SCR-041 | Admin Batch Control | Control | `/admin/batch` |
| SCR-042 | Notification Delivery Stats | Dashboard | `/admin/notifications` |
| SCR-043 | Config Change History Modal | Modal | (modal in SCR-032) |

---

## 2. API Endpoints by Service

### backend-fawz-user-management (39 endpoints)
**Base URL**: `/api/v0/fawz_user_management`

| Method | Path | Operation | Access |
|--------|------|-----------|--------|
| POST | `/user/sign_up` | Register new user | PUBLIC |
| PATCH | `/user/verify_user_email` | Verify email with OTP | PUBLIC |
| PATCH | `/user/login_user` | Login and get token | PUBLIC |
| POST | `/user/request_code` | Request verification code | PUBLIC |
| POST | `/user/forgot_password` | Initiate password reset | PUBLIC |
| PATCH | `/user/reset_password_by_user` | Reset password with code | PUBLIC |
| PATCH | `/user/change_password_by_user` | Change own password | OWNER |
| PATCH | `/user/change_password` | Change password via JWT | OWNER |
| PATCH | `/user/update_profile` | Update own profile | OWNER |
| GET | `/user/me` | Get own profile | OWNER |
| POST | `/user/upload_profile_image` | Upload profile image | OWNER |
| POST | `/user/create_user_by_admin` | Create user (admin) | ADMIN |
| GET | `/user/` | List all users | ADMIN |
| GET | `/user/search` | Search users | ADMIN |
| GET | `/user/{user_id}` | Get user by ID | ADMIN |
| GET | `/user/{user_id}/permissions` | Get user permissions | ADMIN |
| PATCH | `/user/{user_id}` | Update user (admin) | ADMIN |
| DELETE | `/user/{user_id}` | Delete user | ADMIN |
| PUT | `/user/{user_id}/role` | Change user role | ADMIN |
| GET | `/role/permissions` | List all permissions | ADMIN |
| POST | `/role` | Create role | ADMIN |
| GET | `/role` | List roles | ADMIN |
| GET | `/role/search` | Search roles | ADMIN |
| GET | `/role/{role_id}` | Get role by ID | ADMIN |
| PATCH | `/role/{role_id}` | Update role | ADMIN |
| DELETE | `/role/{role_id}` | Delete role | ADMIN |
| PATCH | `/role/{role_id}/permissions` | Update role permissions | ADMIN |
| POST | `/tenant` | Create tenant | ADMIN |
| GET | `/tenant` | List tenants | ADMIN |
| GET | `/tenant/search` | Search tenants | ADMIN |
| GET | `/tenant/{tenant_id}` | Get tenant by ID | ADMIN |
| PATCH | `/tenant/{tenant_id}` | Update tenant | ADMIN |
| PATCH | `/tenant/{tenant_id}/status` | Change tenant status | ADMIN |
| DELETE | `/tenant/{tenant_id}` | Delete tenant | ADMIN |
| POST | `/user/{user_id}/suspend` | Suspend user | ADMIN |
| POST | `/user/{user_id}/deactivate` | Deactivate user | ADMIN |
| POST | `/user/{user_id}/reactivate` | Reactivate user | ADMIN |
| POST | `/user/auth/sso/initiate` | Initiate SSO | PUBLIC |
| POST | `/user/auth/sso/callback` | SSO callback | PUBLIC |

### backend-fawz-admin-operations (22 endpoints)
**Base URL**: `/api/v0/fawz_admin_operations`

| Method | Path | Operation | Access |
|--------|------|-----------|--------|
| POST | `/admin_ip_whitelists` | Create IP whitelist | ADMIN |
| GET | `/admin_ip_whitelists/{id}` | Get IP whitelist | ADMIN |
| GET | `/admin_ip_whitelists` | List IP whitelists | ADMIN |
| PATCH | `/admin_ip_whitelists/{id}` | Update IP whitelist | ADMIN |
| DELETE | `/admin_ip_whitelists/{id}` | Delete IP whitelist | ADMIN |
| POST | `/admin_sessions` | Create admin session | ADMIN |
| GET | `/admin_sessions/{id}` | Get admin session | ADMIN |
| GET | `/admin_sessions` | List admin sessions | ADMIN |
| DELETE | `/admin_sessions/{id}` | Delete admin session | ADMIN |
| POST | `/audit_logs` | Create audit log | ADMIN |
| GET | `/audit_logs/{id}` | Get audit log | ADMIN |
| GET | `/audit_logs` | List audit logs | ADMIN |
| POST | `/operator_tokens` | Create operator token | ADMIN |
| GET | `/operator_tokens/{id}` | Get operator token | ADMIN |
| GET | `/operator_tokens` | List operator tokens | ADMIN |
| POST | `/system_configurations` | Create config | ADMIN |
| GET | `/system_configurations/{id}` | Get config | ADMIN |
| GET | `/system_configurations` | List configs | ADMIN |
| PATCH | `/system_configurations/{id}` | Update config | ADMIN |
| POST | `/system_configuration_histories` | Create config history | ADMIN |
| GET | `/system_configuration_histories/{id}` | Get config history | ADMIN |
| GET | `/system_configuration_histories` | List config histories | ADMIN |

### backend-fawz-challenge-system (20 endpoints)
**Base URL**: `/api/v0/fawz_challenge_system`

Handles challenge CRUD, user challenge progress, checkpoint claims, and onboarding challenges.

### backend-fawz-consumer-engagement (16 endpoints)
**Base URL**: `/api/v0/fawz_consumer_engagement`

Handles notifications, notification preferences, consent management.

### backend-fawz-draw-management (23 endpoints)
**Base URL**: `/api/v0/fawz_draw_management`

Handles draws, draw winners, draw results, live draw WebSocket.

### backend-fawz-entry-generation (14 endpoints)
**Base URL**: `/api/v0/fawz_entry_generation`

Handles Fawz entry creation from transactions, entry queries, entry summary.

### backend-fawz-fraud-compliance (14 endpoints)
**Base URL**: `/api/v0/fawz_fraud_compliance`

Handles fraud cases, compliance reviews, account flags, disputes.

### backend-fawz-merchant-management (8 endpoints)
**Base URL**: `/api/v0/fawz_merchant_management`

Handles merchant eligibility, merchant entries, merchant prizes.

### backend-fawz-platform-management (14 endpoints)
**Base URL**: `/api/v0/fawz_platform_management`

Handles channel multipliers, batch controls, system health.

### backend-fawz-prize-payout-management (12 endpoints)
**Base URL**: `/api/v0/fawz_prize_payout_management`

Handles prize payouts, winner exports, payout status updates.

### backend-fawz-referral-system (11 endpoints)
**Base URL**: `/api/v0/fawz_referral_system`

Handles referral links, referral tracking, referral rewards.

---

## 3. Feature Split Recommendation

### Agent 2 — Consumer Features (Auth + Home + Draw + Tickets + Challenges + Referral + Prizes)

**Screens**: SCR-001 through SCR-011
**Features**:
- Authentication (login, register, OTP verification)
- Consumer home dashboard
- Draw list, draw detail, live draw
- Entry/ticket history
- Challenges and challenge detail
- Referral system
- Prize history

**i18n Namespaces**: `auth`, `consumer`

**API Services Used**:
- backend-fawz-user-management (auth endpoints only)
- backend-fawz-draw-management
- backend-fawz-entry-generation
- backend-fawz-challenge-system
- backend-fawz-referral-system
- backend-fawz-prize-payout-management (consumer endpoints)

### Agent 3 — Secondary Features (Notifications + Profile + Merchant + Admin)

**Screens**: SCR-012 through SCR-043
**Features**:
- Notification center and preferences
- User profile
- Consent management (Sharia disclosure, media consent)
- Dispute submission and history
- Merchant features (home, entries, prizes)
- All admin features (dashboard, draws, challenges, fraud, compliance, audit, config)

**i18n Namespaces**: `notifications`, `profile`, `merchant`, `admin`, `settings`

**API Services Used**:
- backend-fawz-consumer-engagement
- backend-fawz-fraud-compliance
- backend-fawz-merchant-management
- backend-fawz-admin-operations
- backend-fawz-platform-management

### Agent 1 — Infrastructure (This Agent)

**Ownership**:
- `src/app/` — App root, providers, router shell
- `src/config/` — Environment, query client, theme
- `src/core/` — Theme tokens, API client, utilities, i18n, types
- `src/shared/` — Components, layouts, hooks
- `src/stores/` — Auth store, UI store
- `src/routes/` — Route definitions, guards

**i18n Namespaces**: `common`, `errors`

---

## 4. i18n Namespace Distribution

| Namespace | Owner | Contents |
|-----------|-------|----------|
| `common` | Agent 1 | Navigation, buttons, loading, empty states, error states, common actions |
| `errors` | Agent 1 | API errors, validation errors, network errors |
| `auth` | Agent 2 | Login, register, OTP, password reset |
| `consumer` | Agent 2 | Home, draw, entries, challenges, referral, prizes |
| `notifications` | Agent 3 | Notification center, preferences |
| `profile` | Agent 3 | Profile, consent |
| `merchant` | Agent 3 | Merchant home, entries, prizes |
| `admin` | Agent 3 | All admin screens |
| `settings` | Agent 3 | App settings |

---

## 5. Infra-Relevant Edge Cases

From `fdd-edge-cases.md`:

### EC-NET (Network)
- Token refresh on 401 → retry original request
- Offline detection → show cached data + banner
- Slow connections → skeleton loading states

### EC-BROWSER (Browser)
- Browser back navigation → respect history
- Page refresh → restore state from URL params
- Multiple tabs → sync auth state via localStorage events
- Window resize → responsive layout adjustments

### EC-STATE (State)
- Cache staleness → staleTime 5min, gcTime 10min
- Concurrent mutations → optimistic updates with rollback
- Tab sync → localStorage events for auth changes

### EC-TIME (Time)
- Countdown timers pause on tab hidden (visibilitychange API)
- Server vs browser time → use server time for draws
- Double-click prevention → debounce/throttle

### EC-URL (URL)
- Deep links → route guards handle auth redirect + intended URL
- Query param encoding → proper URL encoding/decoding
- Special characters → sanitize user input in URLs

---

## 6. Response Contract

All API responses follow this contract:

| Operation | Response Format |
|-----------|-----------------|
| POST (create) | `{"<entity>_id": "uuid", "message": "Entity Created Successfully"}` |
| GET (single) | Entity object directly (no wrapper) |
| GET (list) | `{"<entity>_list": [...], "total_<entities>": N, "page": 1, "page_size": 20}` |
| PATCH (update) | `{"message": "Entity Updated Successfully"}` |
| DELETE | `{"message": "Entity Deleted Successfully"}` |
| Error | `{"detail": "error message"}` |

---

## 7. Roles

| Role ID | Role Name | Description |
|---------|-----------|-------------|
| ROLE-001 | Consumer (Established) | Regular user with transaction history |
| ROLE-002 | Consumer (New) | New user in onboarding |
| ROLE-003 | Merchant (Owner) | Merchant account owner |
| ROLE-004 | Merchant (Staff) | Merchant staff member |
| ROLE-005 | Referrer | User with active referral link |
| ROLE-006 | Admin | Platform administrator |
| ROLE-007 | Reviewer | Fraud/compliance reviewer |
| ROLE-008 | Operator | Draw tablet operator |

---

*End of Extraction Report*
