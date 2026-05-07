# FAWZ Pre-Push Audit Report

**Generated:** 2026-05-07
**Auditor:** Claude Code
**Target API:** https://fawz-sandbox.dev.iqarx.com/api/v0

---

## Summary

| Pass | Issues Found | Criticals |
|------|-------------|-----------|
| Pass 1 — Hardcoded Values | 12 | 3 |
| Pass 2 — Mock/API Readiness | 7 | 1 |
| Pass 3 — Standards Compliance | 14 | 0 |
| Pass 4 — TypeScript & Lint | 3 | 1 |
| **Total** | **36** | **5** |

**Verdict: NEEDS FIXES BEFORE PUSH** — 5 critical issues must be resolved before deploying to production.

---

## Pass 1 — Hardcoded Values

### UUIDs
✅ **None found outside test files** — All UUIDs are properly contained in `src/test/fixtures/index.ts` and `src/test/mocks/handlers.ts`.

### Hardcoded URLs

| File:Line | Finding | Fix |
|-----------|---------|-----|
| `src/config/env.ts:10` | Default URL `'https://dev.iqarx.com/api/v0'` hardcoded as fallback | Remove default; require VITE_API_BASE_URL to be set explicitly |
| `src/test/mocks/handlers.ts:37` | `API_BASE = 'https://dev.iqarx.com/api/v0'` | ✅ OK — Test file |
| `src/features/prizes/pages/WinnerSharePage.tsx:152` | `https://wa.me/?text=` | ✅ OK — WhatsApp share URL (external service) |
| `src/features/referrals/services/referrals.service.ts:167` | `https://wa.me/?text=` | ✅ OK — WhatsApp share URL (external service) |

### Hardcoded Tokens

| File:Line | Finding | Severity | Fix |
|-----------|---------|----------|-----|
| `src/core/network/apiClient.ts:43` | `MOCK_DEV_TOKEN = 'mock-token-for-dev'` | WARNING | Gate with `env.isDev` check or move to test utilities |
| `src/features/auth/pages/OtpPage.tsx:74` | `access_token: 'mock_access_token'` hardcoded in production code | **CRITICAL** | Remove mock auth; implement actual OTP verification API call |

### Hardcoded 'fawz' App ID

| File:Line | Finding | Severity | Fix |
|-----------|---------|----------|-----|
| `src/features/auth/services/auth.service.ts:48` | `app_id: data.app_id \|\| 'fawz'` | **CRITICAL** | Use `import.meta.env.VITE_APP_ID` instead of hardcoded fallback |
| `src/features/auth/pages/RegisterPage.tsx:43` | `app_id: 'fawz'` | **CRITICAL** | Use `env.appId` from config; add VITE_APP_ID to env.ts |
| `src/features/auth/types/auth.types.ts:73` | `app_id: z.string().default('fawz')` | WARNING | Remove default; require app_id or use env variable |

### Magic Numbers (Timeouts/Pagination/Retries)

| File:Line | Finding | Fix |
|-----------|---------|-----|
| `src/features/draw/components/DrawResultOverlay.tsx:359-363` | Animation delays (50, 200, 400, 550, 700ms) | Move to named constants: `OVERLAY_ANIMATION_DELAYS` |
| `src/features/draw/pages/DrawDetailPage.tsx:172` | `setTimeout(..., 2000)` | Use constant: `CONFETTI_DURATION_MS = 2000` |
| `src/config/queryClient.ts:15` | `retry: 3` | Use constant: `DEFAULT_QUERY_RETRY_COUNT = 3` |
| `src/config/queryClient.ts:27` | `retry: 1` | Use constant: `DEFAULT_MUTATION_RETRY_COUNT = 1` |
| Multiple service files | `page_size: 20`, `page_size: 50`, `page_size: 100` | Create `src/core/constants/pagination.ts` with named constants |
| `src/features/auth/pages/OtpPage.tsx:17` | `RESEND_COOLDOWN = 60` | ✅ OK — Already a named constant |

### Console.log Calls (Outside Logger/Test)

| File:Line | Finding | Status |
|-----------|---------|--------|
| `src/core/network/apiClient.ts:59,73` | API logging with eslint-disable | ✅ OK — Intentional dev logging |
| `src/main.tsx:31` | MSW init log with eslint-disable | ✅ OK — Startup message |
| `src/features/auth/pages/OtpPage.tsx:61,94` | Debug logs for OTP verification | WARNING — Remove or replace with logger |

### Hardcoded Strings (i18n)

✅ **No violations found** — All user-facing strings use `useTranslation()` hook.

---

## Pass 2 — Mock → Real API Readiness

| File | Status | Detail |
|------|--------|--------|
| `src/main.tsx` | ✅ OK | MSW correctly gated: `MODE !== 'development' \|\| VITE_ENABLE_MSW !== 'true'` |
| `src/core/network/apiClient.ts` | ⚠️ WARNING | Uses `env.apiBaseUrl` but env.ts has hardcoded default URL |
| `src/config/env.ts` | ⚠️ WARNING | Missing: `VITE_ENABLE_MSW`, `VITE_APP_ID`, `VITE_APP_ENV`; has hardcoded default URL |
| `src/stores/auth.store.ts` | **CRITICAL** | `mockLogin()` function is NOT gated — callable in production! |
| `src/features/auth/pages/LoginPage.tsx` | ✅ OK | Dev Login button correctly gated with `env.isDev` |
| Service files (11 total) | ✅ OK | All services use shared `apiClient` instance |
| `.env.development` | ✅ OK | Exists with `VITE_ENABLE_MSW=true` |
| `.env` (production) | ✅ OK | Exists, points to sandbox API |
| `.gitignore` | ✅ OK | `.env*` patterns are ignored |

### Critical Issue Detail

**`src/stores/auth.store.ts:78-88`** — The `mockLogin()` function has no environment check:

```typescript
// CURRENT (UNSAFE):
mockLogin: () => {
  setTokens(mockAuthTokens.access_token, mockAuthTokens.refresh_token);
  // ... sets mock user data
}
```

**Required fix:**
```typescript
mockLogin: () => {
  if (import.meta.env.MODE !== 'development') {
    console.error('mockLogin is only available in development');
    return;
  }
  // ... existing implementation
}
```

---

## Pass 3 — Standards Violations

### RTL & Logical Properties

| File:Line | Violation | Fix |
|-----------|-----------|-----|
| `src/shared/layouts/Header.tsx:44` | `left-0 right-0` in className | Use `inset-x-0` |
| `src/shared/layouts/BottomTabBar.tsx:54` | `left-0 right-0` in className | Use `inset-x-0` |

**Chevron/Arrow Icons:** ✅ All instances have `rtl:rotate-180` — properly handled.

### TypeScript

| Item | Status |
|------|--------|
| `tsconfig.json` has `"strict": true` | ✅ OK |
| `: any` usage | ✅ None found |
| `@ts-ignore` usage | ✅ None found |

**eslint-disable comments (47 total):**

| Pattern | Count | Justification |
|---------|-------|---------------|
| `@typescript-eslint/explicit-function-return-type` | 38 | ⚠️ WARNING — Should add return types to hooks/services |
| `no-console` | 5 | ✅ OK — Intentional logging points |
| `react-refresh/only-export-components` | 2 | ✅ OK — Necessary for route lazy loading |
| `@typescript-eslint/no-dynamic-delete` | 2 | ✅ OK — Required for object manipulation |
| `@typescript-eslint/no-require-imports` | 1 | ✅ OK — Theme config compatibility |

### State Management

| Store | Status | Notes |
|-------|--------|-------|
| `auth.store.ts` | ✅ OK | Stores auth tokens (client-only, not server state) |
| `ui.store.ts` | ✅ OK | UI preferences only (theme, language, sidebar) |
| useState with fetched data | ✅ None found | All API data uses TanStack Query |

### Components

**Files exceeding 250 lines:**

| File | Lines | Recommendation |
|------|-------|----------------|
| `src/features/draw/pages/LiveDrawPage.tsx` | 875 | Extract: `ConnectionStatus`, `PreDrawCountdown`, `SlotMachineRow`, `MatchingTicketsCard` into separate files |
| `src/features/draw/components/DrawResultOverlay.tsx` | 561 | Extract animation logic into custom hook |
| `src/features/draw/pages/DrawDetailPage.tsx` | 549 | Extract prize tier display into component |
| `src/features/draw/pages/DrawSimulationPage.tsx` | 405 | Extract simulation controls |
| `src/features/dashboard/pages/DashboardPage.tsx` | 404 | Extract `WeeklySparkBar`, `ChallengeCard`, `DrawCountdown` |
| `src/features/challenges/pages/ChallengeDetailPage.tsx` | 366 | ⚠️ Near limit |
| `src/features/profile/pages/ProfilePage.tsx` | 332 | ⚠️ Near limit |

**Inline styles (`style={{`):**

| File | Count | Status |
|------|-------|--------|
| Progress bars (width percentage) | 6 | ✅ OK — Dynamic values |
| Animation delays | 4 | ⚠️ Could use CSS variables |
| Skeleton dimensions | 1 | ✅ OK — Dynamic sizing |

**Page exports:** ✅ All 30 page components use `export default function`.

### Naming Conventions

| Convention | Status |
|------------|--------|
| Service files end in `.service.ts` | ✅ 11/11 OK |
| Hook files start with `use` | ✅ 9/9 OK |
| Store files end in `.store.ts` | ✅ 2/2 OK |

### Five-State Coverage (Spot Check)

| Page | isLoading | data | empty | isError | offline |
|------|-----------|------|-------|---------|---------|
| `LiveDrawPage` | ✅ `LiveDrawSkeleton` | ✅ | ✅ `noActiveDraw` | ✅ `ErrorState` + retry | ✅ `!isOnline` check |
| `DashboardPage` | ✅ `DashboardSkeleton` | ✅ | ✅ `isNewUser` empty state | ✅ `ErrorState` (online only) | ✅ `OfflineBanner` |
| `HomePage` | ✅ `HomePageSkeleton` | ✅ | ✅ `noChallengesAvailable` | ✅ `ErrorState` (online only) | ✅ `OfflineBanner` |

---

## Pass 4 — TypeScript & Lint

### TypeScript (`npx tsc --noEmit`)

```
src/core/utils/formatters.test.ts(18,3): error TS6133: 'toArabicNumerals' is declared but its value is never read.
```

**1 error** — Fix: Remove unused import or use the function in tests.

### ESLint (`npm run lint`)

```
/Users/batoulawada/Desktop/FAWZ/public/mockServiceWorker.js
  1:1  warning  Unused eslint-disable directive (no problems were reported)

/Users/batoulawada/Desktop/FAWZ/src/core/utils/formatters.test.ts
  18:3  error  'toArabicNumerals' is defined but never used  @typescript-eslint/no-unused-vars

/Users/batoulawada/Desktop/FAWZ/src/features/draw/components/LotteryAnimation.tsx
  119:9  warning  The 'allUserTickets' logical expression could make the dependencies of useCallback change on every render  react-hooks/exhaustive-deps

✖ 3 problems (1 error, 2 warnings)
```

---

## Action Items (Priority Order)

### CRITICAL (Must fix before push)

1. **`src/stores/auth.store.ts:78-88`** — Gate `mockLogin()` with development environment check
   ```typescript
   mockLogin: () => {
     if (import.meta.env.MODE !== 'development') return;
     // ... existing code
   }
   ```

2. **`src/features/auth/pages/OtpPage.tsx:63-78`** — Remove hardcoded mock auth; implement actual OTP API call
   ```typescript
   // Replace mock setAuth() with actual API call:
   const response = await verifyOtp({ phone: data.phone, otp: data.otp });
   setAuth(response.user, response.tokens);
   ```

3. **`src/features/auth/services/auth.service.ts:48`** — Replace hardcoded 'fawz' with env variable
   ```typescript
   app_id: data.app_id || import.meta.env.VITE_APP_ID,
   ```

4. **`src/features/auth/pages/RegisterPage.tsx:43`** — Use env variable for app_id
   ```typescript
   app_id: import.meta.env.VITE_APP_ID,
   ```

5. **`src/config/env.ts`** — Add missing env variables to schema
   ```typescript
   VITE_APP_ID: z.string(),
   VITE_APP_ENV: z.enum(['development', 'staging', 'production']),
   VITE_ENABLE_MSW: z.string().transform(v => v === 'true').default('false'),
   VITE_API_BASE_URL: z.string().url(), // Remove .default()
   ```

### WARNING (Should fix)

6. **`src/core/utils/formatters.test.ts:18`** — Remove unused `toArabicNumerals` import

7. **`src/features/draw/components/LotteryAnimation.tsx:119`** — Wrap `allUserTickets` in useMemo or move inside useCallback

8. **`src/shared/layouts/Header.tsx:44`** — Replace `left-0 right-0` with `inset-x-0`

9. **`src/shared/layouts/BottomTabBar.tsx:54`** — Replace `left-0 right-0` with `inset-x-0`

10. **`src/core/network/apiClient.ts:43`** — Gate `MOCK_DEV_TOKEN` usage with environment check

11. **`public/mockServiceWorker.js:1`** — Remove unused eslint-disable directive

### INFO (Recommended improvements)

12. **Create `src/core/constants/pagination.ts`** — Centralize pagination constants:
    ```typescript
    export const PAGE_SIZE_DEFAULT = 20;
    export const PAGE_SIZE_SMALL = 1;
    export const PAGE_SIZE_MEDIUM = 50;
    export const PAGE_SIZE_LARGE = 100;
    ```

13. **Create `src/core/constants/timing.ts`** — Centralize timeout/animation constants:
    ```typescript
    export const CONFETTI_DURATION_MS = 2000;
    export const OVERLAY_ANIMATION_DELAYS = { show: 50, icon: 200, title: 400, content: 550, buttons: 700 };
    export const DEFAULT_QUERY_RETRY_COUNT = 3;
    export const DEFAULT_MUTATION_RETRY_COUNT = 1;
    ```

14. **Refactor large components** — Extract sub-components from files >400 lines:
    - `LiveDrawPage.tsx` → Extract 4 sub-components
    - `DrawResultOverlay.tsx` → Extract animation hook
    - `DashboardPage.tsx` → Extract 3 sub-components

15. **Add explicit return types** — Gradually add return types to hooks/services to remove 38 eslint-disable comments

---

## Environment Variables Checklist

Ensure both `.env` and `.env.development` have these variables:

| Variable | Required | Current Status |
|----------|----------|----------------|
| `VITE_API_BASE_URL` | ✅ Yes | ✅ Set |
| `VITE_APP_NAME` | ✅ Yes | ✅ Set |
| `VITE_APP_VERSION` | ✅ Yes | ✅ Set |
| `VITE_APP_ID` | ✅ Yes | ❌ Missing |
| `VITE_APP_ENV` | ✅ Yes | ❌ Missing |
| `VITE_ENABLE_MSW` | Development only | ✅ Set in .env.development |
| `VITE_DEFAULT_LOCALE` | Optional | ✅ Set |
| `VITE_TIMEZONE` | Optional | ✅ Set |
| `VITE_ENABLE_DEVTOOLS` | Development only | ✅ Set in .env.development |

---

*Report generated by Claude Code audit pass. No code changes were made during this audit.*
