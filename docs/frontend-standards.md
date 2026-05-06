# IQARX Frontend Development Standards & Guidelines

**React • React Native • TypeScript • MVVM**

**Version 1.0 | Official Release**

---

## Document Control

### Version History

| Version | Date | Changes | Author |
|---|---|---|---|
| 1.0 | 3 Feb 2026 | Initial standards document | Mohamad Al Massri |

© 2026 IQARX | All Rights Reserved.

---

## Table of Contents

1. Executive Summary
2. Scope & Applicability
3. Technology Stack
4. Architecture Standards
5. Project Structure
6. MVVM Architecture (Mobile)
7. State Management
8. Naming Conventions
9. Coding Standards
10. API Integration
11. Performance Standards
12. Security Standards
13. Error Handling & Logging
14. Testing Standards
15. Accessibility Standards
16. Documentation Requirements
17. Git Workflow & Version Control
18. Code Review Process
19. Deployment Guidelines
20. Monitoring & Analytics
21. Compliance & Enforcement
22. Appendix

---

## 1. Executive Summary

This document establishes the official Frontend Development Standards for IQARX, applicable to all web and mobile application development. These standards are mandatory for all frontend projects and are designed to ensure consistency, scalability, security, and maintainability across our product portfolio.

### 1.1 Key Objectives

- Establish unified coding standards and architectural patterns
- Ensure application security and data protection
- Optimize performance for the Iraqi market (low bandwidth, varied devices)
- Enable rapid onboarding and efficient team collaboration
- Maintain high code quality through standardized practices
- Support RTL (Arabic) and internationalization requirements

### 1.2 Compliance Requirements

🔴 **MANDATORY:** All new development must comply with these standards effective immediately.

🔴 **MANDATORY:** Non-compliance will result in PR rejection and code review failures.

---

## 2. Scope & Applicability

### 2.1 In Scope

- All React web applications
- All React Native mobile applications (iOS and Android)
- Shared component libraries
- Internal tools and admin dashboards
- Client-facing applications
- Third-party integrations (frontend components)

### 2.3 Exceptions

Exceptions to these standards require written approval from the Technical Coach.

For initial client demos or proof-of-concept prototypes requiring rapid delivery, development may proceed without full standards compliance. However, the project must be refactored to meet all standards before moving to production development.

---

## 3. Technology Stack

### 3.1 Approved Technologies

| Category | Technology | Version / Notes |
|---|---|---|
| Language | TypeScript | 5.x (Strict mode mandatory) |
| Web Framework | React + Next.js | React 18+, Next.js 14+ |
| Mobile Framework | React Native (Bare) | 0.73+ (New Architecture) |
| State (Global) | Zustand, Redux | Latest stable |
| State (Server) | TanStack Query | v5+ |
| Forms | React Hook Form + Zod | Latest stable |
| Navigation (Web) | React Router / Next.js | v6+ |
| Navigation (Mobile) | React Navigation | v6+ |
| Styling (Web) | Tailwind CSS | v3+ |
| Styling (Mobile) | NativeWind / StyleSheet | v4+ |
| Testing | Jest + RTL + Detox | Latest stable |
| HTTP Client | Axios | v1+ |
| Validation | Zod | v3+ |

### 3.2.1 Mobile Development Options

| Technology | When to Consider | Use Cases |
|---|---|---|
| React Native | Cross-platform, shared web codebase | MakinTech, DallaTech, Rental Apps… (Current Standard) |
| Flutter | High-performance UI, single codebase | New projects with complex animations, custom UI |
| Native iOS (Swift) | iOS-specific features, Apple ecosystem | ARKit, HealthKit, deep Apple integrations |
| Native Android (Kotlin) | Android-specific features, performance | Custom hardware, background services, ML Kit |

### 3.2.2 Web Development Options

| Technology | When to Consider | Use Cases |
|---|---|---|
| React + Next.js | SSR, SEO, full-stack capabilities | Customer-facing apps, marketing sites (Current Standard) |
| React (Vite) | SPA, admin dashboards, internal tools | Admin panels, internal dashboards |
| Flutter Web | Unified mobile + web from single codebase | Apps requiring identical mobile/web experience |

### 3.2.3 Project-Technology Recommendations

*Native modules for AR features with React Native shell, or full native if AR is core functionality.*

### 3.2.4 Flutter Adoption Path (Future)

If Flutter is adopted for future projects, the following standards will apply:

- Architecture: Clean Architecture with BLoC/Riverpod for state management
- Language: Dart with null safety enabled
- Structure: Feature-first folder organization
- Testing: Unit tests (90%), Widget tests (80%), Integration tests
- Separate Flutter Standards Document will be created upon adoption

### 3.2.5 Native Development Standards (Future)

If native iOS or Android development is required:

- iOS: Swift 5+, SwiftUI preferred, UIKit when necessary, MVVM architecture
- Android: Kotlin, Jetpack Compose preferred, MVVM with ViewModel
- Both platforms must follow platform-specific Human Interface Guidelines
- Separate Native Standards Documents will be created upon adoption

⚠️ Technology decisions for new projects must be approved by Technical Coach based on project requirements, team capabilities, and long-term maintenance considerations.

### 3.3 Prohibited Technologies

🔴 **MANDATORY**

- Expo (managed workflow) - Use Bare React Native instead
- JavaScript (.js files) - TypeScript only
- jQuery or legacy libraries
- Class components - Functional components only
- Any state management not listed above

---

## 4. Architecture Standards

### 4.1 Architecture by Platform

| Platform | Architecture Pattern |
|---|---|
| React Web | Feature-Based Modular with Public API |
| React Native Mobile | MVVM Model-View-ViewModel |

### 4.2 Core Principles

- **Separation of Concerns:** Each layer has distinct responsibilities
- **Single Responsibility:** One component/function = one job
- **Dependency Injection:** Enable testability through abstraction
- **Unidirectional Data Flow:** Predictable state management
- **Encapsulation:** Features expose public API only via index.ts

---

## 5. Project Structure

### 5.1 React Web Structure

```
src/
├── app/                    # App configuration
│   ├── providers/          # Context providers
│   ├── routes/             # Route definitions
│   └── App.tsx
├── features/               # Feature modules
│   ├── auth/
│   │   ├── api/            # API calls
│   │   ├── components/     # Feature components
│   │   ├── hooks/          # Feature hooks
│   │   ├── store/          # Zustand store
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Feature utilities
│   │   └── index.ts        # Public API exports
│   └── [other-features]/
├── shared/                 # Shared code
│   ├── components/         # Reusable UI
│   ├── hooks/              # Shared hooks
│   ├── utils/              # Utilities
│   ├── constants/          # App constants
│   ├── types/              # Shared types
│   └── services/           # API client
├── assets/                 # Static assets
└── styles/                 # Global styles
```

### 5.2 React Native MVVM Structure

```
src/
├── app/                    # App configuration
│   ├── navigation/         # Navigation setup
│   ├── providers/          # App providers
│   └── App.tsx
├── features/               # Feature modules (MVVM)
│   ├── auth/
│   │   ├── models/         # Data models, Zod schemas
│   │   ├── views/
│   │   │   ├── screens/    # Screen components
│   │   │   └── components/ # Feature UI components
│   │   ├── viewmodels/     # useXxxViewModel hooks
│   │   ├── repositories/   # Data coordination
│   │   ├── services/       # API calls
│   │   ├── types/          # Additional types
│   │   └── index.ts        # Public API
│   └── [other-features]/
├── core/                   # Shared code
│   ├── components/         # Shared UI
│   ├── hooks/              # Shared hooks
│   ├── services/           # API client, storage
│   ├── utils/              # Utilities
│   └── types/              # Shared types
├── assets/                 # Static assets
└── theme/                  # Theme configuration
```

---

## 6. MVVM Architecture (Mobile)

### 6.1 Layer Responsibilities

| Layer | Responsibility | Implementation |
|---|---|---|
| Model | Data structures, validation schemas | Zod schemas, TypeScript interfaces |
| View | UI rendering only, no business logic | React Native components, screens |
| ViewModel | Business logic, state, validation | useXxxViewModel custom hooks |
| Repository | Data coordination, caching | Repository classes/functions |
| Service | API communication | Service modules with Axios |

### 6.2 Data Flow

Data flows unidirectionally through the MVVM layers:

```
User Action → View → ViewModel → Repository → Service → API
      ↑                                                    ↓
      Re-render ← State Update ← Data Response ←──────────┘
```

### 6.3 Critical Rules

🔴 **MANDATORY:** Views must contain ZERO business logic.

🔴 **MANDATORY:** Each screen must have its own ViewModel (`useXxxViewModel`).

🔴 **MANDATORY:** ViewModels must not import View components.

🔴 **MANDATORY:** Services must not manage state.

---

## 7. State Management

### 7.1 State Categories

| Type | Tool | Use Case |
|---|---|---|
| Server State | TanStack Query | API data, caching, background sync, pagination |
| Global State | Zustand, Redux | Auth, theme, user preferences, app settings |
| Feature State | ViewModel hooks | Screen-specific business logic |
| Form State | React Hook Form | Complex forms with validation |
| Local UI State | useState | Toggles, modals, simple inputs |

### 7.2 Rules

🔴 **MANDATORY:** Never store server data in Zustand. Use TanStack Query.

✅ Keep Zustand stores small and focused.

✅ Use TanStack Query's caching instead of manual cache.

---

## 8. Naming Conventions

### 8.1 File Naming

| Type | Convention | Example |
|---|---|---|
| Screens | PascalCase + Screen | `LoginScreen.tsx` |
| Components | PascalCase | `UserCard.tsx` |
| ViewModels | use + Name + ViewModel | `useLoginViewModel.ts` |
| Hooks | use + Name | `useAuth.ts` |
| Services | camelCase + .service | `auth.service.ts` |
| Repositories | camelCase + .repository | `auth.repository.ts` |
| Models | PascalCase + .model | `User.model.ts` |
| Types | camelCase + .types | `auth.types.ts` |
| Utils | camelCase + .utils | `date.utils.ts` |
| Constants | camelCase + .constants | `api.constants.ts` |
| Tests | source + .test | `useLoginViewModel.test.ts` |
| Styles | source + .styles | `LoginScreen.styles.ts` |

### 8.2 Folder Naming

🔴 **MANDATORY:** Use kebab-case (lowercase with hyphens) for folders.

```typescript
// ✅ CORRECT
features/user-profile/
features/order-management/

// ❌ FORBIDDEN
features/UserProfile/
features/user_profile/
```

### 8.3 Code Naming

- **Variables/Functions:** camelCase (`getUserById`, `isLoading`)
- **Constants (global):** SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces:** PascalCase (`User`, `LoginFormProps`)
- **Components:** PascalCase (`LoginForm`, `UserCard`)
- **Event handlers:** handle + Event (`handleSubmit`, `handlePress`)

---

## 9. Coding Standards

### 9.1 TypeScript Rules

🔴 **MANDATORY:** No `any` type. Use `unknown` if type is truly unknown.

🔴 **MANDATORY:** Explicit return types for all functions.

🔴 **MANDATORY:** No `@ts-ignore` or `@ts-nocheck` without approval.

✅ Use const assertions for literal types.

✅ Prefer type inference for simple cases.

### 9.2 Component Rules

🔴 **MANDATORY:** Functional components only. No class components.

🔴 **MANDATORY:** Maximum 200 lines per component file.

🔴 **MANDATORY:** Single responsibility - one component, one job.

✅ Extract logic to custom hooks.

✅ Use composition over prop drilling.

### 9.3 Hooks Rules

🔴 **MANDATORY:** Hooks at top level only (not in conditions/loops).

🔴 **MANDATORY:** Use exhaustive-deps ESLint rule.

✅ `useMemo` for expensive computations.

✅ `useCallback` for functions passed to children.

✅ Custom hooks for reusable logic.

### 9.4 Import Order

```typescript
// 1. React and core libraries
import { FC, useState } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal features
import { useAuth } from '@/features/auth';

// 4. Shared modules
import { Button } from '@/shared/components/ui';

// 5. Relative imports
import { styles } from './Component.styles';
```

---

## 10. API Integration

### 10.1 HTTP Client

🔴 **MANDATORY:** Use Axios for all HTTP requests.

🔴 **MANDATORY:** Centralized API client with interceptors.

```typescript
// core/services/api.client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);
```

### 10.2 Request Cancellation

🔴 **MANDATORY:** Cancel pending requests on component unmount.

```typescript
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, []);
```

### 10.3 Error Handling

🔴 **MANDATORY:** Use centralized ApiError class.

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}
```

---

## 11. Performance Standards

### 11.1 Performance Targets

| Metric | Web Target | Mobile Target |
|---|---|---|
| First Contentful Paint (FCP) | < 2s | < 2.5s |
| Time to Interactive (TTI) | < 3.5s | < 3s |
| Bundle Size (initial) | < 200KB | < 50MB APK |
| List Scroll (60fps) | Required | Required |
| Memory Usage | Monitor | < 300MB |

### 11.2 React Native Performance Rules

🔴 **MANDATORY:** Use `FlatList` for dynamic lists. Never `ScrollView`.

🔴 **MANDATORY:** Implement `getItemLayout` for fixed-height items.

🔴 **MANDATORY:** Use `React.memo` for pure components that render often.

🔴 **MANDATORY:** Avoid inline functions and styles in render.

✅ Use Reanimated 3 for animations.

✅ Optimize images (WebP, proper sizing, caching).

### 11.3 Web Performance Rules

🔴 **MANDATORY:** Implement code splitting and lazy loading.

🔴 **MANDATORY:** Optimize images (`next/image`, WebP, lazy load).

✅ Use dynamic imports for large components.

✅ Implement proper caching strategies.

### 11.4 Iraqi Market Considerations

⚠️ Optimize for low bandwidth and varied device capabilities common in Iraq.

- Minimize bundle size aggressively
- Implement offline-first where possible
- Use progressive loading for images
- Test on mid-range Android devices

---

## 12. Security Standards

### 12.1 Authentication & Authorization

🔴 **MANDATORY:** Store tokens in secure storage (Keychain/Keystore), never AsyncStorage.

🔴 **MANDATORY:** Implement token refresh mechanism.

🔴 **MANDATORY:** Clear all sensitive data on logout.

🔴 **MANDATORY:** Implement session timeout (configurable, default 30 min).

### 12.2 Data Protection

🔴 **MANDATORY:** Never log sensitive data (tokens, passwords, PII).

🔴 **MANDATORY:** Sanitize all user inputs before API calls.

🔴 **MANDATORY:** Use HTTPS for all API communication.

🔴 **MANDATORY:** Implement certificate pinning for sensitive apps.

### 12.3 Code Security

🔴 **MANDATORY:** No secrets/API keys in code. Use environment variables.

🔴 **MANDATORY:** Enable code obfuscation for production builds.

🔴 **MANDATORY:** Keep dependencies updated (security patches).

✅ Run `npm audit` regularly.

### 12.4 Forbidden Practices

🔴 **MANDATORY:** Never store passwords in plain text.

🔴 **MANDATORY:** Never disable SSL verification.

🔴 **MANDATORY:** Never expose internal APIs to client.

🔴 **MANDATORY:** Never commit `.env` files to repository.

---

## 13. Error Handling & Logging

### 13.1 Error Boundaries

🔴 **MANDATORY:** Implement Error Boundaries for all feature sections.

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <FeatureComponent />
</ErrorBoundary>
```

### 13.2 API Error Handling

🔴 **MANDATORY:** Handle all API errors gracefully.

🔴 **MANDATORY:** Show user-friendly error messages.

🔴 **MANDATORY:** Log errors to monitoring service.

### 13.3 Logging Rules

🔴 **MANDATORY:** No `console.log` in production code.

🔴 **MANDATORY:** Use structured logging service.

🔴 **MANDATORY:** Never log sensitive information.

✅ Include context (screen, action, user) in logs.

---

## 14. Testing Standards

### 14.1 Coverage Requirements

| Type | Tool | Coverage | Required |
|---|---|---|---|
| Unit Tests | Jest | 80% | ✅ Yes |
| Component Tests | RTL / RNTL | 80% | ✅ Yes |
| Integration Tests | Jest + MSW | 70% | ✅ Yes |
| E2E Tests | Detox, Playwright | Critical paths | ✅ Yes |

### 14.2 What to Test

🔴 **MANDATORY:** All ViewModels must have unit tests.

🔴 **MANDATORY:** All utility functions must have unit tests.

🔴 **MANDATORY:** All API services must have tests with mocked responses.

🔴 **MANDATORY:** Critical user flows must have E2E tests.

---

## 15. Accessibility Standards

### 15.1 Requirements

🔴 **MANDATORY:** All interactive elements must have `accessibilityLabel`.

🔴 **MANDATORY:** Minimum touch target size: 44x44 points.

🔴 **MANDATORY:** Support dynamic type (font scaling).

### 15.2 RTL Support (Arabic)

🔴 **MANDATORY:** Use RTL-aware properties (`paddingStart`, `marginEnd`).

🔴 **MANDATORY:** Test all screens in RTL mode.

---

## 16. Documentation Requirements

### 16.1 Required Documentation

🔴 **MANDATORY:** `README.md` in every project root.

🔴 **MANDATORY:** JSDoc comments for all public functions/components.

🔴 **MANDATORY:** API documentation for all services.

🔴 **MANDATORY:** Architecture Decision Records (ADRs) for major decisions.

### 16.2 Code Comments

```typescript
/**
 * Authenticates user with email and password.
 * @param credentials - User login credentials
 * @returns Promise resolving to authenticated user
 * @throws {ApiError} When authentication fails
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
```

### 16.3 README Template

- Project overview and purpose
- Setup and installation instructions
- Available scripts
- Environment variables
- Architecture overview

---

## 19. Deployment Guidelines

### 19.1 Environments

| Environment | Branch | Purpose |
|---|---|---|
| Development | develop | Integration testing |
| Staging | release/* | QA and UAT |
| Production | main | Live users |

### 19.2 Pre-Deployment Checklist

🔴 **MANDATORY:** All tests passing

🔴 **MANDATORY:** No critical/high security vulnerabilities

🔴 **MANDATORY:** Performance benchmarks met

🔴 **MANDATORY:** Staging QA sign-off

🔴 **MANDATORY:** Release notes prepared

### 19.3 Mobile Release Process

1. Create release branch from develop
2. Update version numbers
3. Run full test suite
4. Build release APK/IPA
5. QA testing on staging
6. Submit to App Store / Play Store
7. Merge to main and tag release

### 19.4 Rollback Plan

🔴 **MANDATORY:** Every deployment must have a documented rollback plan.

- **Web:** Revert to previous deployment
- **Mobile:** Use CodePush for OTA rollback (minor issues)
- **Mobile:** Expedited store review for critical issues

---

## 20. Monitoring & Analytics

### 20.1 Required Monitoring

🔴 **MANDATORY:** Crash reporting (Sentry / Crashlytics)

🔴 **MANDATORY:** Performance monitoring

🔴 **MANDATORY:** Error tracking and alerting

✅ User analytics (privacy-compliant)

### 20.2 Key Metrics

- Crash-free rate (target: > 98%)
- App start time
- API response times
- Error rates by endpoint
- User engagement metrics

### 20.3 Alerting

🔴 **MANDATORY:** Configure alerts for crash rate spikes.

🔴 **MANDATORY:** Configure alerts for API error rate > 1%.

✅ Daily performance reports to dev team.

---

## 21. Compliance & Enforcement

### 21.1 Enforcement

🔴 **MANDATORY:** PRs violating these standards will be rejected.

🔴 **MANDATORY:** CI pipeline will enforce linting and testing rules.

🔴 **MANDATORY:** Regular code audits will assess compliance.

### 21.2 Standards Updates

These standards will be reviewed quarterly. Proposed changes should be submitted to the Frontend Leadership Team for evaluation.

---

## 22. Appendix

### 22.1 ESLint Configuration

```json
{
  "extends": [
    "@react-native",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error",
    "no-console": "error"
  }
}
```

### 22.2 Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 22.3 Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin
- React Native Tools
- GitLens
- Error Lens

### 22.4 Useful Resources

- React Documentation: https://react.dev
- React Native: https://reactnative.dev
- TypeScript: https://typescriptlang.org
- TanStack Query: https://tanstack.com/query
- Zustand: https://zustand-demo.pmnd.rs

---

## Approval Signatures

By signing below, I acknowledge that I have read, understood, and agreed to enforce the IQARX Frontend Development Standards V1.0.

_____________________________________________
**CEO** Name & Signature — Date: _______________

_____________________________________________
**Technical Coach** — Date: _______________

---

*End of Document*

*IQARX Frontend Development Standards V1.0*

*© 2026 IQARX. All Rights Reserved.*
