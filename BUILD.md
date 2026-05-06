# BUILD.md — Parallel Agent Execution Prompt

> **How it works:** Multiple Claude Code terminals run simultaneously on the same codebase.
> Each agent owns specific files — NO overlap, NO merge conflicts.
>
> **Setup:**
> Terminal 1 (Agent 1): Infrastructure
> Terminal 2 (Agent 2): Features A
> Terminal 3 (Agent 3): Features B
> Terminal 4 (Agent 4): Testing
>
> **Total time: ~5-6 hours (vs 14-18 hours sequential)**

---

# GLOBAL RULES (ALL AGENTS)

1. **Read CLAUDE.md first.** It defines tech stack, architecture, patterns, project config.
2. **Read docs/frontend-standards.md.** It is the ABSOLUTE AUTHORITY — overrides everything.
3. **NEVER modify files outside your ownership.** See File Ownership Map below.
4. **NEVER ask the user.** If ambiguous, choose safest option, log in DECISIONS_LOG.md.
5. **NEVER skip.** No placeholders. No TODOs. No "implement later".
6. **Verify often:** npx tsc --noEmit after every major step.
7. **Commit after completing your assignment.** NEVER push — user pushes manually.
8. **If you need a file another agent owns, WAIT** until it exists, then import it.

---

# FILE OWNERSHIP MAP

AGENT 1 — INFRASTRUCTURE (owns core + shared + navigation + stores)
  src/app/*
  src/config/*
  src/core/*                    (theme, network, storage, utils, i18n, types)
  src/shared/components/*
  src/shared/animations/*
  src/shared/hooks/*
  src/shared/layouts/*          (web only)
  src/stores/*
  src/navigation/*              (RN) or src/routes/* (Web)
  src/styles/*                  (web only)
  src/index.ts / src/main.tsx
  .env.* files
  tsconfig.json, babel.config.js, metro.config.js, tailwind.config.*, etc.
  package.json (ONLY Agent 1 installs packages)

AGENT 2 — FEATURES A (owns auth + first half of feature modules)
  src/features/auth/*
  src/features/[feature-group-1]/*
  src/features/[feature-group-2]/*
  src/features/[feature-group-3]/*
  src/core/i18n/en.json         (APPEND only — own feature keys)
  src/core/i18n/ar.json         (APPEND only — own feature keys)

AGENT 3 — FEATURES B (owns second half + settings/profile)
  src/features/[feature-group-4]/*
  src/features/[feature-group-5]/*
  src/features/[feature-group-6]/*
  src/features/settings/*
  src/features/profile/*
  src/features/notifications/*
  src/core/i18n/en.json         (APPEND only — own feature keys)
  src/core/i18n/ar.json         (APPEND only — own feature keys)

AGENT 4 — TESTING + QUALITY (owns all test files)
  src/test/*
  __tests__/*                   (RN)
  all *.test.ts and *.test.tsx files everywhere
  src/test/mocks/*

Auth ALWAYS goes to Agent 2 (blocks navigation).
Settings/Profile/Notifications ALWAYS go to Agent 3.
Read docs/fdd-user-flows.md to split remaining features evenly.

---

# DEPENDENCY TIMELINE

Hour 0        Hour 1        Hour 2        Hour 3        Hour 4        Hour 5
  |             |             |             |             |             |
  +- AGENT 1 --+-- AGENT 1 --+                                         
  | Ingest +   | Infra:      | DONE (standby for fixes)               
  | Setup      | theme,API,  |                                         
  |            | stores,     |                                         
  |            | components, |                                         
  |            | nav,i18n    |                                         
  |            |             |                                         
  |  BLOCKED   +- AGENT 2 --+-- AGENT 2 ---+-- AGENT 2 -+             
  |            | types +     | Auth screens | Feature    | DONE        
  |            | services    | (P0)         | Group A    |             
  |            | for group A |              | screens    |             
  |            |             |              |            |             
  |  BLOCKED   +- AGENT 3 --+-- AGENT 3 ---+-- AGENT 3 -+             
  |            | types +     | Feature      | Settings + | DONE        
  |            | services    | Group B      | profile +  |             
  |            | for group B | screens      | edge       |             
  |            |             |              |            |             
  |  BLOCKED   |  BLOCKED    +- AGENT 4 ----+-- AGENT 4 -+- AGENT 4 --+
  |            |             | test infra + | test       | quality    |
  |            |             | test shared  | screens as | audit +    |
  |            |             | + stores     | they ship  | report     |

---

# AGENT 1 — INFRASTRUCTURE

Open Terminal 1: claude
Paste this entire block:

---

You are AGENT 1 — INFRASTRUCTURE.
You own: src/app, src/config, src/core, src/shared, src/stores, src/navigation (or src/routes), all config files.

Read CLAUDE.md completely. Read docs/frontend-standards.md completely.

STEP 1: INGEST (15 min)

Read ALL files in docs/:
  features.md -> extract feature list, modules, roles
  fdd-user-flows.md -> extract every screen, route, sidebar defs, nav map, global elements
  fdd-edge-cases.md -> note infra-relevant edge cases
  api.md -> extract base URL, auth pattern, error shapes, pagination

Create EXTRACTION_REPORT.md:
  Screen count, endpoint count, feature count, business rule count
  Screen list grouped by module
  Endpoint list grouped by service
  Feature group split recommendation (which features go to Agent 2 vs Agent 3)

Create DECISIONS_LOG.md (empty header, all agents append).

STEP 2: PROJECT SETUP (30 min)

Initialize project per CLAUDE.md tech stack:
  [RN]: npx @react-native-community/cli init [APP_NAME] --template react-native-template-typescript
  [Web]: npm create vite@latest [app-name] -- --template react-ts

Install ALL dependencies. YOU are the only agent that touches package.json.
Configure: TypeScript strict, path aliases, babel, metro/vite, lint, prettier.
Create .env files. Create COMPLETE folder structure from CLAUDE.md.
VERIFY: npx tsc --noEmit, npm run lint, app starts.

STEP 3: CORE INFRASTRUCTURE (60-90 min)

Build IN ORDER (other agents are waiting for these):

A) Theme: src/core/theme/*.ts (colors, typography, spacing, radii, shadows)
   If Figma MCP: extract tokens. Else: CLAUDE.md placeholders.

B) Shared types: src/core/types/api.types.ts
   ApiResponse<T>, PaginatedResponse<T>, ApiError, PaginationParams

C) API Client: src/core/network/apiClient.ts
   Axios + interceptors (auth token, 401 refresh, error mapping, logging)

D) Storage: secureStorage.ts (Keychain/cookies) + localStorage.ts (MMKV/localStorage)

E) Stores: auth.store.ts + ui.store.ts with persistence

F) Query Client: src/config/queryClient.ts

G) i18n: config + RTL switching + en.json (common+errors) + ar.json (common+errors)

H) Utilities: formatters, validators, helpers, logger

I) ALL Shared Components from CLAUDE.md list:
   Button, Input, Card, Badge, Avatar, Skeleton, EmptyState, ErrorState,
   OfflineBanner, Modal/BottomSheet, Tabs, Switch, ScreenWrapper, LoadingOverlay, Header
   All RTL-safe, all theme tokens, all typed props.

J) ALL Shared Hooks from CLAUDE.md list

K) Navigation/Routing skeleton:
   RootNavigator, AuthNavigator, MainNavigator (tabs from FDD sidebar defs)
   All route params typed. Deep links from FDD. Auth gates from FDD.
   [Web]: AppLayout, AuthLayout, Sidebar, Header, AuthGuard, GuestGuard

L) Global Persistent Elements from FDD (TopBar, NotificationBell, Toast, etc.)

M) App Root: wire everything in App.tsx / providers.tsx

VERIFY: npx tsc --noEmit -> ZERO. App starts, shows login.
Run: git add -A && git commit -m "feat(core): complete infrastructure"

STEP 4: STANDBY for fixes. Remain available for Agent 2/3/4 requests.

---

# AGENT 2 — FEATURES GROUP A (Auth + First Half)

Open Terminal 2: claude
Paste this entire block:

---

You are AGENT 2 — FEATURES GROUP A.
You own: src/features/auth + first half of feature modules from EXTRACTION_REPORT.md.

Read CLAUDE.md. Read docs/frontend-standards.md. Read docs/fdd-user-flows.md. Read docs/api.md.

WAIT until EXTRACTION_REPORT.md exists. Read it for your feature assignments.
WAIT until src/core/network/apiClient.ts exists before writing code.
(Check: ls src/core/network/apiClient.ts — retry every 30 seconds)

PHASE A: TYPES + SERVICES (45-60 min)
For EACH feature you own:
  1. Create types: src/features/[feature]/types/[feature].types.ts
     Entity interfaces, request types, Zod schemas, status enums
  2. Create service: src/features/[feature]/services/[feature].service.ts
     Query key factory, API functions, useQuery hooks, useMutation hooks
VERIFY: npx tsc --noEmit
Run: git add -A && git commit -m "feat(api): types+services for feature group A"

PHASE B: AUTH SCREENS (60-90 min)
Read FDD auth journey. Build every auth screen.
For EACH screen: follow SCREEN BUILD RULES section below.
Wire auth store, navigation.
VERIFY: npx tsc --noEmit
Run: git add -A && git commit -m "feat(auth): complete auth flow"

PHASE C: FEATURE SCREENS (90-120 min)
For EACH feature, for EACH screen:
  Read FDD screen spec. Follow SCREEN BUILD RULES.
  Build screen + components + hooks.
  Add i18n keys to en.json + ar.json (APPEND under your namespace).
After each feature: npx tsc --noEmit
Run: git add -A && git commit -m "feat([feature]): [feature] screens"

---

# AGENT 3 — FEATURES GROUP B (Second Half + Settings)

Open Terminal 3: claude
Paste this entire block:

---

You are AGENT 3 — FEATURES GROUP B.
You own: second half of feature modules + settings + profile + notifications.

Read CLAUDE.md. Read docs/frontend-standards.md. Read docs/fdd-user-flows.md. Read docs/api.md.

WAIT until EXTRACTION_REPORT.md exists. Read it for your feature assignments.
WAIT until src/core/network/apiClient.ts exists before writing code.

PHASE A: TYPES + SERVICES (45-60 min)
Same pattern as Agent 2 for YOUR features.
VERIFY: npx tsc --noEmit
Run: git add -A && git commit -m "feat(api): types+services for feature group B"

PHASE B: FEATURE SCREENS (120-150 min)
For EACH feature, for EACH screen: read FDD, follow SCREEN BUILD RULES.
After each feature: npx tsc --noEmit
Run: git add -A && git commit -m "feat([feature]): [feature] screens"

PHASE C: SETTINGS + EDGE SCREENS (45-60 min)
Build: Profile, Settings (language+RTL switcher), Notification center, 404, Offline screen.
Run: git add -A && git commit -m "feat(settings): profile, preferences, edge screens"

---

# AGENT 4 — TESTING + QUALITY

Open Terminal 4: claude
Paste this entire block:

---

You are AGENT 4 — TESTING + QUALITY.
You own: all *.test.* files, src/test/*, __tests__/*.

Read CLAUDE.md. Read docs/frontend-standards.md (testing section). Read docs/api.md.

WAIT until src/stores/auth.store.ts exists before writing code.

PHASE A: TEST INFRASTRUCTURE (30 min)
1. Create renderWithProviders helper (wraps all providers)
2. Create MSW handlers: ONE per endpoint from docs/api.md (happy + error variants)
3. Create fixtures: mock objects for every entity type
4. Configure jest/vitest with coverage thresholds (80%)
Run: git add -A && git commit -m "test(infra): helpers, MSW handlers, fixtures"

PHASE B: TEST SHARED + STORES (60 min)
Test every Zustand store (state, actions, persistence).
Test every utility function.
Test every shared component (render, variants, interaction, disabled).
Run: git add -A && git commit -m "test(shared): stores, utils, components"

PHASE C: TEST SERVICES (45 min)
WAIT for Agent 2+3 services to exist.
Test every service: query hooks, mutations, cache invalidation, error handling.
Run: git add -A && git commit -m "test(services): all service hooks"

PHASE D: TEST SCREENS (90-120 min, as screens ship)
As Agent 2/3 complete screens, test them:
  Per screen: loading skeleton, data render, empty state, error+retry, primary action, form validation.
Run: git add -A && git commit -m "test([feature]): screen tests"

PHASE E: QUALITY AUDIT (30-45 min, after all agents done)
1. npx tsc --noEmit -> ZERO
2. npm run lint -> ZERO
3. grep for: hardcoded strings, hardcoded colors, RTL violations (left/right), any types
4. npm test -- --coverage -> must be >80%
5. Fix ALL issues
Run: git add -A && git commit -m "chore: quality audit passed"

PHASE F: DELIVERY REPORT
Create DELIVERY_REPORT.md: screens, endpoints, tests, coverage, violations, known issues.
Run: git add -A && git commit -m "docs: delivery report"

---

# SCREEN BUILD RULES (Agent 2 + Agent 3 reference)

FOR EVERY SCREEN:

1. READ FDD screen spec first (docs/fdd-user-flows.md)

2. 5 STATES (mandatory):
   Loading: skeleton matching layout shape (NEVER spinner)
   Populated: normal render
   Empty: EmptyState with i18n title + subtitle
   Error: ErrorState with i18n message + retry
   Offline: cached data + OfflineBanner

3. DATA: use service hooks from services/ file
   Parallel fetching where FDD specifies multiple ON LOAD calls

4. ACTIONS: implement every FDD "User Actions" entry
   Validation -> API -> success/error handling
   Button disabled + loading during API call
   401: interceptor handles. 422: inline errors. 429: rate limit toast. 500: error toast.

5. FORMS: React Hook Form + Zod
   Every field from FDD form behavior table
   Submit behavior matches FDD exactly

6. NAVIGATION: from FDD transition map
   Correct route + params + back behavior

7. RTL: logical properties only (start/end, ps/pe, text-start)

8. i18n: every visible string uses t('feature.key')
   Keys in BOTH en.json and ar.json

9. Max 250 lines per file. Extract sub-components if larger.
   Use shared components. Feature components in features/[name]/components/.

---

# i18n CONFLICT PREVENTION

Agent 1 owns: "common", "errors"
Agent 2 owns: "auth", "[group-1]", "[group-2]", "[group-3]"
Agent 3 owns: "[group-4]", "[group-5]", "[group-6]", "settings", "profile", "notifications"

RULE: Never modify another agent's namespace.

---

# PARALLEL EXECUTION CHECKLIST

HOUR 0:
  Agent 1: START ingest + setup
  Agent 2/3/4: reading docs, waiting

HOUR 1:
  Agent 1: building infrastructure
  Agent 2: START types + services
  Agent 3: START types + services
  Agent 4: waiting for stores

HOUR 2:
  Agent 1: DONE, standby
  Agent 2: auth screens
  Agent 3: feature group B screens
  Agent 4: START test infra + shared tests

HOUR 3:
  Agent 2: feature group A screens
  Agent 3: feature group B screens (continued)
  Agent 4: service tests + screen tests

HOUR 4:
  Agent 2: finishing + i18n
  Agent 3: settings + profile + edge screens
  Agent 4: testing remaining screens

HOUR 5:
  Agent 2: DONE
  Agent 3: DONE
  Agent 4: quality audit + coverage + delivery report

HOUR 5.5: ALL DONE. User reviews DELIVERY_REPORT.md, then git push.
