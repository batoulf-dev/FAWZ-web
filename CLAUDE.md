# CLAUDE.md — FAWZ React Web Application

> This file is auto-read by Claude Code at every session start. It is the **single source of truth** for the entire build.
> Read this file completely before writing any code.

---

## Mission

Build a **production-ready React Web application** from scratch.
You have access to:
1. **Features Document** — business logic, feature definitions, state machines, workflows
2. **FDD: User Flows** — page-by-page logic flows, navigation maps, page states
3. **FDD: Edge Cases** — boundary conditions, error scenarios, offline behavior, browser quirks
4. **API Documentation** — all backend endpoints, request/response schemas, error codes
5. **Frontend Standards** — IQARX coding standards, architecture patterns, quality gates
6. **Figma Designs** — via MCP server integration for pixel-perfect implementation

Your goal: generate a complete, working, testable codebase that matches the designs exactly, implements all business logic correctly, and is ready for production deployment.

---

## Input Documents

### 1. Features Document
**Location:** `./docs/features.md`
**Contains:** Feature definitions (F-001, F-002...), system processing logic, state machines, workflows, error codes, business rules, audit requirements.

### 2. FDD: User Flows
**Location:** `./docs/fdd-user-flows.md`
**Contains:** Page-by-page Logic Flow Wireframes:
```
## PAGE: [PageName]
Route: /[path]
Access: [public | authenticated | admin]
Params: { param1: type }
Query: ?page=1&sort=created_at

### ON LOAD
Step 1: [Data fetch or state check]
  API: GET /api/v0/{service}/{resource}
  -> Loading: [Skeleton description]
  -> Success (200): [What to render]
  -> Empty (200, data=[]): [Empty state with Arabic message]
  -> Error (500): [Error state with retry]
  -> Offline: [Cached data + banner]

### USER ACTIONS
Action: "Button Text"
  Step 1: Validate [what]
    -> Invalid: Show inline error "Arabic message"
  Step 2: API: POST /api/v0/{service}/{resource}
    -> Success (200): [Navigate to /next/page]
    -> Error (401/422/429/500): [Specific handling]

### RESPONSIVE
Mobile (375px): [layout changes]
Tablet (768px): [layout changes]
Desktop (1280px): [layout changes]

### URL STATE
Params: /resource/:id
Query: ?page=1&status=active&sort=created_at

### NAVIGATION
From: [How user arrives]
Back: [Browser back behavior]
Forward: [Where success navigates]
```

### 3. FDD: Edge Cases
**Location:** `./docs/fdd-edge-cases.md`
**Contains:** Boundary conditions including web-specific categories:
- EC-NET: Network failures, token refresh, slow connections
- EC-BROWSER: Back navigation, page refresh, new tab, resize, multiple tabs
- EC-STATE: Cache staleness, concurrent mutations, tab sync
- EC-INPUT: Mixed bidi text, paste behavior, form submission on Enter
- EC-TIME: Countdown in hidden tab, server vs browser time, double-click
- EC-DATA: Pagination end, 404 images, zero amounts, text overflow
- EC-SEO: Page titles, meta descriptions, OG tags, robots.txt
- EC-URL: Special characters, deep links, query param encoding

### 4. API Documentation -> `./docs/api.md`
### 5. Frontend Standards -> `./docs/frontend-standards.md` **(ABSOLUTE AUTHORITY)**
### 6. Figma Designs -> MCP Server

---

## Project Overview

| Field | Value |
|-------|-------|
| **App Name** | FAWZ |
| **Display Name** | FAWZ |
| **Platform** | React 19 + Vite 6 (SPA) |
| **Language** | TypeScript 5.x (Strict Mode) |
| **Node** | 22 LTS |
| **Package Manager** | npm |
| **Languages** | English (LTR) + Arabic (RTL) |
| **Primary Language** | Arabic (RTL-first) |
| **API Base URL** | https://dev.iqarx.com/api/v0 |
| **Target Users** | 	Iraqi users, desktop/mobile, 4G connection |

---

## Tech Stack

> If `frontend-standards.md` specifies different libraries, follow the standards.

| Category | Library | Version | Purpose |
|----------|---------|---------|---------|
| Framework | react | 19.x | UI framework |
| Build | vite | 6.x | Build tool + HMR |
| Language | typescript | 5.x | Type safety (strict) |
| Routing | react-router | 7.x | Client routing, lazy loading |
| Server State | @tanstack/react-query | 5.x | Fetching, caching, mutations |
| Client State | zustand | 5.x | Global state + localStorage |
| HTTP | axios | 1.x | HTTP client + interceptors |
| Styling | tailwindcss | 4.x | Utility-first CSS, logical properties |
| Forms | react-hook-form + zod | 7.x + 3.x | Form state + validation |
| i18n | i18next + react-i18next | 24.x + 15.x | Multi-language + RTL |
| Icons | lucide-react | 0.469.x | Icon set |
| Toasts | react-hot-toast | 2.x | Notifications |
| Date | date-fns | 4.x | Date formatting |
| CSS Utils | clsx + tailwind-merge | 2.x + 2.x | Class composition |
| Web Vitals | web-vitals | 4.x | Performance metrics |
| Testing | vitest + @testing-library/react + msw | 2.x + 16.x + 2.x | Unit + component + mock |
| E2E | playwright | 1.x | End-to-end |
| Lint | eslint + prettier | 9.x + 3.x | Code quality |

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                          # Root: Providers + Router
│   ├── providers.tsx                    # QueryClient + Store + I18n wrappers
│   └── router.tsx                       # Route definitions + lazy loading
│
├── config/
│   ├── env.ts                           # Typed environment (import.meta.env)
│   ├── queryClient.ts                   # TanStack Query defaults
│   └── theme.ts                         # Re-export design tokens
│
├── core/
│   ├── theme/
│   │   ├── colors.ts                    # Brand colors (from Figma)
│   │   ├── typography.ts                # Font families, sizes, weights
│   │   ├── spacing.ts                   # Spacing scale
│   │   └── index.ts                     # Re-export all tokens
│   │
│   ├── network/
│   │   ├── apiClient.ts                 # Axios + interceptors (auth, error, logging)
│   │   └── types/
│   │       ├── apiResponse.ts           # Generic<T> wrapper
│   │       └── apiError.ts              # Typed errors (AppError, ApiError, NetworkError, ValidationError)
│   │
│   ├── utils/
│   │   ├── cn.ts                        # clsx + twMerge utility
│   │   ├── formatters.ts                # Currency (IQD), dates (Baghdad TZ), countdown
│   │   ├── validators.ts                # Zod schemas (phone, email, OTP)
│   │   ├── helpers.ts                   # Misc utilities
│   │   └── logger.ts                    # Console wrapper (stripped in prod)
│   │
│   ├── i18n/
│   │   ├── index.ts                     # i18next config + RTL direction switching
│   │   ├── en.json                      # English strings (complete)
│   │   └── ar.json                      # Arabic strings (complete)
│   │
│   └── types/
│       ├── api.types.ts                 # ApiResponse<T>, PaginatedResponse<T>, ApiError
│       └── env.d.ts                     # Vite env types
│
├── features/
│   └── [feature_name]/
│       ├── services/
│       │   └── [feature].service.ts     # API functions + TanStack Query hooks
│       ├── types/
│       │   └── [feature].types.ts       # Types + Zod schemas
│       ├── pages/
│       │   └── [Feature]Page.tsx        # Page component (default export for lazy)
│       ├── components/
│       │   └── [Component].tsx          # Feature-specific components
│       ├── hooks/
│       │   └── use[Feature].ts          # Feature hooks
│       └── index.ts                     # Barrel export
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx                   # primary, secondary, outline, ghost, destructive + sizes + loading
│   │   ├── Card.tsx                     # default, elevated, outlined
│   │   ├── Input.tsx                    # label, helper, error, RTL
│   │   ├── Select.tsx                   # Dropdown
│   │   ├── TextArea.tsx                 # Multi-line
│   │   ├── Checkbox.tsx                 # With label
│   │   ├── Switch.tsx                   # Toggle
│   │   ├── Avatar.tsx                   # Image/initials + sizes
│   │   ├── Badge.tsx                    # Status badges
│   │   ├── Skeleton.tsx                 # Shimmer (match layout shape, not spinner)
│   │   ├── Modal.tsx                    # Dialog with focus trap
│   │   ├── EmptyState.tsx              # Icon + title(ar) + subtitle(ar) + CTA
│   │   ├── ErrorState.tsx              # Error icon + message + retry
│   │   ├── OfflineBanner.tsx           # Fixed banner when offline
│   │   ├── LoadingOverlay.tsx          # Fullscreen loading
│   │   ├── Breadcrumbs.tsx             # Navigation breadcrumbs
│   │   ├── Tabs.tsx                     # Segmented tab control
│   │   ├── FileUpload.tsx              # File upload with drag-drop
│   │   └── LazyImage.tsx               # Image + placeholder + lazy
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx                # Sidebar + Header + content area
│   │   ├── AuthLayout.tsx               # Centered card for auth pages
│   │   ├── Sidebar.tsx                  # Collapsible navigation
│   │   └── Header.tsx                   # User menu, notifications, language switcher
│   │
│   └── hooks/
│       ├── useAuth.ts                   # Auth state + login/register/logout
│       ├── useNetworkStatus.ts          # Online/offline (navigator.onLine + events)
│       ├── useDebounce.ts               # Debounced value
│       ├── useThrottle.ts               # Throttled value
│       ├── usePaginatedQuery.ts         # Paginated API data
│       ├── useSearch.ts                 # Search + filter + URL sync
│       ├── usePageTitle.ts              # Document title per route
│       ├── useAutoLogout.ts             # Session timeout (30 min inactivity)
│       └── useReducedMotion.ts          # prefers-reduced-motion
│
├── stores/
│   ├── auth.store.ts                    # Tokens, user, persistence (localStorage)
│   └── ui.store.ts                      # Theme, language, sidebar state (localStorage)
│
├── styles/
│   ├── globals.css                      # @font-face, CSS custom properties, base
│   └── tailwind.css                     # @tailwind + custom utilities
│
├── routes/
│   ├── index.tsx                        # Route definitions with lazy loading
│   ├── guards/
│   │   ├── AuthGuard.tsx                # Redirect to /login if unauthenticated
│   │   └── GuestGuard.tsx               # Redirect to /dashboard if authenticated
│   └── layouts/
│       ├── AppRoute.tsx                 # Wraps with AppLayout
│       └── AuthRoute.tsx                # Wraps with AuthLayout
│
└── main.tsx                             # Entry: createRoot + render

public/
├── robots.txt
├── favicon.svg
└── apple-touch-icon.png

docs/
├── features.md                          # Feature definitions + business rules
├── fdd-user-flows.md                    # Page-by-page logic flows
├── fdd-edge-cases.md                    # Boundary conditions + error scenarios
├── api.md                               # API documentation
└── frontend-standards.md                # Architecture + coding standards
```

---

## Design System

> Fetch actual tokens from Figma MCP. Values below are placeholders.

### Colors -> tailwind.config (@theme in CSS for v4)
### Typography -> @font-face in globals.css + tailwind config
### Spacing -> TailwindCSS scale (or custom from Figma)
### Shadows, Radii -> tailwind config

---

## Code Rules (MUST FOLLOW)

### TypeScript
- Strict mode, no `any`, no `@ts-ignore`, no `as` without justification comment
- Explicit return types on exported functions
- Interface for all component props
- Zod for runtime validation (API responses, forms, env vars)

### Components
- Functional only, one per file, max 250 lines
- Named exports (default only for pages — lazy loading)
- TailwindCSS only — no inline styles, no CSS modules
- `cn()` utility for conditional classes
- All colors from theme tokens, all text from i18n

### Naming
```
Files:        camelCase.ts / PascalCase.tsx
Components:   PascalCase          (Button, DashboardPage)
Hooks:        useCamelCase        (useAuth, usePageTitle)
Services:     feature.service.ts  (auth.service.ts)
Types:        feature.types.ts
Stores:       feature.store.ts
Constants:    UPPER_SNAKE_CASE
Test files:   Name.test.tsx
Feature dirs: snake_case
Pages:        [Feature]Page.tsx
```

### State Management
```
Server state  -> TanStack Query (fetching, caching, mutations)
Client state  -> Zustand (auth, UI, persisted with localStorage)
Form state    -> React Hook Form + Zod
URL state     -> React Router (search params, path params)
Local UI      -> useState/useReducer

RULE: Never duplicate server state in Zustand.
RULE: Persist shareable state in URL params where possible.
```

### Data Fetching Pattern
```typescript
// src/features/[feature]/services/[feature].service.ts
export const entityKeys = {
  all: ['entity'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...entityKeys.lists(), filters] as const,
  details: () => [...entityKeys.all, 'detail'] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
};

export function useEntityList(filters = {}) {
  return useQuery({
    queryKey: entityKeys.list(filters),
    queryFn: () => apiClient.get('/route/resource', { params: filters }).then(r => r.data),
  });
}

export function useCreateEntity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEntityRequest) =>
      apiClient.post('/route/resource', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: entityKeys.lists() }),
  });
}
```

---

## RTL — TailwindCSS v4 Logical Properties

```
TailwindCSS v4 uses CSS logical properties natively:

CORRECT:
  ps-4 pe-2 ms-auto me-0              (padding/margin start/end)
  text-start text-end                   (text-align)
  start-0 end-0                         (inset-inline)
  rounded-s-lg rounded-e-lg             (border-radius)
  border-s border-e                     (border-inline)

WRONG (will not flip in RTL):
  pl-4 pr-2 ml-auto mr-0
  text-left text-right
  left-0 right-0
  rounded-l-lg rounded-r-lg

Direction switching:
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

Directional icons:
  <ChevronRight className="rtl:rotate-180" />
```

---

## Responsive — Mobile First

```
Base   = mobile (375px)
sm:    = 640px
md:    = 768px (tablet)
lg:    = 1024px
xl:    = 1280px (desktop)
2xl:   = 1536px

Example:
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 md:p-6 lg:p-8">

Touch targets: min 44px on mobile (min-h-11 min-w-11)
```

---

## Error Handling

| Status | Action |
|--------|--------|
| 401 | Auto-refresh token -> retry. Fail -> redirect /login |
| 422 | Return field errors -> inline on forms |
| 429 | Toast: rate limit message (Arabic) |
| 500 | Toast: server error message (Arabic) |
| Network | OfflineBanner + cached data |

---

## Page Checklist (every page)

```
States:
  [ ] Loading skeleton (matches layout shape)
  [ ] Data (normal rendering)
  [ ] Empty (icon + Arabic title + subtitle + CTA)
  [ ] Error (icon + Arabic message + retry)
  [ ] Offline (cached data + banner)

Verification:
  [ ] Figma matched (pixel-perfect)
  [ ] i18n keys in en.json + ar.json
  [ ] RTL verified (Arabic)
  [ ] Responsive: 375px, 768px, 1280px
  [ ] FDD user flows: all steps
  [ ] FDD edge cases: all applicable
  [ ] Browser back works
  [ ] Page title updates
  [ ] Form submits on Enter
  [ ] Focus trap in modals
  [ ] Keyboard navigation (tab order)
```

---

## Build Process

```
PHASE 1 — SETUP
  Create Vite + React + TS project
  Install all dependencies
  Configure TS strict + path aliases
  Configure TailwindCSS v4 + theme
  Configure ESLint 9 + Prettier
  Docker + Nginx (security headers, gzip, SPA fallback)

PHASE 2 — INFRASTRUCTURE
  Theme from Figma MCP
  Shared components from Figma MCP
  Zustand stores + localStorage
  TanStack Query client
  Axios + interceptors
  i18n + RTL switching
  Routing (guards, lazy loading, layouts)
  Shared hooks + utilities

PHASE 3 — FEATURES (per feature from FDD)
  For EACH: read FDD flows + edge cases + Figma
  Create types + services + pages + components
  Build order: Auth -> Layout+Dashboard -> Core -> Secondary -> Settings

PHASE 4 — TESTING
  Vitest + Testing Library + MSW
  Playwright E2E for critical flows
  Coverage >80%

PHASE 5 — POLISH + DEPLOY
  RTL audit, responsive audit
  Lighthouse >90, Web Vitals
  Accessibility (keyboard, ARIA, screen reader)
  SEO (meta, OG tags, robots.txt)
  Docker build, CI/CD
```

---

## Quality Gates

```
[ ] npx tsc --noEmit -> zero errors
[ ] npm run lint -> zero warnings
[ ] npm test -> all passing
[ ] No hardcoded strings (i18n)
[ ] No hardcoded colors (theme/Tailwind)
[ ] No inline styles (TailwindCSS only)
[ ] No `any` types
[ ] Max 250 lines per file
[ ] Logical properties only (no left/right)
[ ] All 5 states handled
[ ] Responsive verified (375 + 768 + 1280)
[ ] RTL verified
[ ] Figma matched
[ ] FDD flows + edge cases verified
[ ] Lighthouse >90
```

---

## Critical Reminders

1. **Read FDD user flows BEFORE coding** — every step, every response code
2. **Read FDD edge cases BEFORE done** — check all applicable
3. **Read Figma BEFORE building** — fetch from MCP, never assume
4. **5 states per page** — skeleton, data, empty, error, offline
5. **Responsive required** — test 375px, 768px, 1280px
6. **RTL is primary** — Arabic first, logical properties only
7. **URL is state** — filter/sort/page in query params
8. **Browser back must work** — respect history
9. **Standards wins** — if conflict, follow frontend-standards.md

---

*This CLAUDE.md is the contract. Follow it exactly.*
