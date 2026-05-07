# FAWZ Decisions Log

**Project**: FAWZ React Web Application
**Created**: 2026-05-05

---

All agents append decisions here with timestamp and rationale.

---

## Format

```
### [DECISION-XXX] Title
**Date**: YYYY-MM-DD
**Agent**: Agent N
**Category**: [Architecture | Component | API | Styling | State | Routing | Other]
**Decision**: What was decided
**Rationale**: Why this decision was made
**Alternatives Considered**: What else was considered
**Impact**: What this affects
```

---

## Decisions

### [DECISION-001] TailwindCSS v4 with CSS Logical Properties
**Date**: 2026-05-05
**Agent**: Agent 1
**Category**: Styling
**Decision**: Use TailwindCSS v4 with CSS logical properties (ps-, pe-, ms-, me-, start-, end-) exclusively. No left/right classes allowed.
**Rationale**: Arabic is the primary language (RTL-first). Logical properties automatically flip in RTL/LTR contexts without additional CSS or JavaScript.
**Alternatives Considered**: Separate RTL stylesheet, directional utility classes with manual flipping
**Impact**: All components must use logical properties. Agent 2/3/4 must follow this pattern.

### [DECISION-002] Zustand for Client State with localStorage Persistence
**Date**: 2026-05-05
**Agent**: Agent 1
**Category**: State
**Decision**: Use Zustand v5 with persist middleware for auth and UI stores. Auth persists to `fawz-auth`, UI persists to `fawz-ui`.
**Rationale**: Simple API, minimal boilerplate, built-in persistence. TanStack Query handles server state.
**Alternatives Considered**: Redux Toolkit, Jotai, React Context
**Impact**: All client state goes through Zustand stores. Server state uses TanStack Query only.

### [DECISION-003] TanStack Query Defaults
**Date**: 2026-05-05
**Agent**: Agent 1
**Category**: State
**Decision**: Set staleTime to 5 minutes, gcTime to 10 minutes, retry 2 with exponential backoff.
**Rationale**: Balance between fresh data and reduced API calls. Iraqi 4G connections can be slow.
**Alternatives Considered**: Shorter staleTime (1min), no automatic retry
**Impact**: All API queries use these defaults. Individual queries can override.

### [DECISION-004] API Client Error Handling
**Date**: 2026-05-05
**Agent**: Agent 1
**Category**: API
**Decision**: Axios response interceptor handles: 401 → refresh token → retry, 422 → extract field_errors, 429 → toast rate limit, 500 → toast server error, network error → reject as NetworkError.
**Rationale**: Centralized error handling reduces boilerplate in components. Token refresh is transparent.
**Alternatives Considered**: Error handling in individual components, error boundary only
**Impact**: All API calls go through the configured Axios instance. Components receive typed errors.

### [DECISION-005] Route Structure
**Date**: 2026-05-05
**Agent**: Agent 1
**Category**: Routing
**Decision**: Use React Router v7 with lazy loading for all pages. Routes grouped by layout (AppLayout for consumer, AuthLayout for auth, AdminLayout for admin).
**Rationale**: Code splitting improves initial load. Layout-based grouping simplifies guard logic.
**Alternatives Considered**: File-based routing, no lazy loading
**Impact**: All pages must have default exports for lazy loading.

---

*All agents: append your decisions below this line*
