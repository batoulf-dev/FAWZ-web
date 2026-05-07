# REVIEW.md — Figma Polish Agent

> **Usage:** Run after all screen agents are done.
> ```
> claude
> > Read REVIEW.md and begin.
> ```
> **Purpose:** Close the 5% gap between built screens and Figma designs.
> Touch ONLY visual code. Do NOT change logic, API calls, state, or navigation.

---

## Rules

1. **Read CLAUDE.md first** — get the Figma file info and project config.
2. **Style changes ONLY** — spacing, colors, icons, typography, radius, shadows.
3. **NEVER change** logic, API calls, state management, navigation, or component structure.
4. **NEVER restructure** components or files. Only edit style-related properties.
5. **Theme tokens ONLY** — never hardcode hex values. If a token is missing, add it to the theme first.
6. **Logical properties ONLY** — `ps/pe/ms/me/start/end`, never `pl/pr/ml/mr/left/right`.
7. **Commit when done.** `git add -A && git commit -m "style: figma polish pass"`. **NEVER push.**

---

## Process

```
STEP 1: Read EXTRACTION_REPORT.md — get the full screen list.

STEP 2: Connect to Figma MCP.
  Read the "Design System" page first.
  Verify theme tokens match Figma:
    - Colors in tailwind config vs Figma color tokens
    - Typography (font family, sizes, weights) vs Figma text styles
    - Spacing scale vs Figma spacing
    - Border radius vs Figma radii
    - Shadows vs Figma elevation styles
  Fix any token mismatches in theme files BEFORE touching screens.

STEP 3: For EACH screen in EXTRACTION_REPORT.md, do the following:
```

---

## Per-Screen Review (repeat for every screen)

```
1. Open the screen source file.

2. Fetch the matching Figma frame from "UI Screens" page:
   Search by SCR-XXX ID or screen name from CLAUDE.md.

3. Compare and fix each category:

   ICONS
   ─────
   □ Wrong icon name    → replace with correct Lucide icon from Figma
   □ Wrong icon size    → match Figma exactly (12, 16, 20, 24, 32)
   □ Wrong icon color   → use theme token matching Figma hex
   □ Missing icon       → add it
   □ Icon should flip in RTL → add rtl:rotate-180

   SPACING & PADDING
   ─────────────────
   □ Padding (top, bottom, start, end) → match Figma exactly
   □ Margin between elements → match Figma exactly
   □ Gap in flex/grid containers → match Figma exactly
   □ Section spacing (between cards, between sections) → match Figma
   □ Inner card padding → match Figma
   □ Input field padding → match Figma
   □ Button padding → match Figma
   □ ALWAYS use logical: ps, pe, ms, me (never pl, pr, ml, mr)

   TYPOGRAPHY
   ──────────
   □ Font size → match Figma exactly (text-sm, text-base, text-lg, etc.)
   □ Font weight → match Figma (font-normal, font-medium, font-semibold, font-bold)
   □ Line height → match Figma (leading-tight, leading-normal, leading-relaxed)
   □ Letter spacing → match Figma if specified
   □ Text color → use theme token matching Figma hex
   □ Truncation → add truncate or line-clamp if Figma shows ellipsis

   COLORS
   ──────
   □ Background colors → match Figma, use theme tokens
   □ Border colors → match Figma, use theme tokens
   □ Text colors → match Figma, use theme tokens
   □ Icon colors → match Figma, use theme tokens
   □ Hover/active states → match Figma if interactive states designed
   □ Status colors (success, error, warning, info) → match Figma semantic tokens
   □ If a Figma color has no theme token → add token to theme first, then use it

   BORDER RADIUS
   ─────────────
   □ Cards → match Figma (rounded-sm, rounded-md, rounded-lg, rounded-xl)
   □ Buttons → match Figma
   □ Inputs → match Figma
   □ Badges/chips → match Figma
   □ Avatars → match Figma (usually rounded-full)
   □ Modals/sheets → match Figma

   SHADOWS
   ───────
   □ Card shadows → match Figma (shadow-sm, shadow-md, shadow-lg)
   □ Modal/sheet shadows → match Figma
   □ Dropdown shadows → match Figma
   □ If Figma shadow doesn't match a Tailwind preset → add custom shadow to tailwind config

   BORDERS
   ───────
   □ Border width → match Figma (border, border-2)
   □ Border color → match Figma, use theme tokens
   □ Border style → match Figma (solid, dashed)
   □ Divider lines between list items → match Figma

   LAYOUT
   ──────
   □ Element order matches Figma (top to bottom, start to end)
   □ Alignment (items-start, items-center, items-end) → match Figma
   □ Justify (justify-start, justify-between, justify-center) → match Figma
   □ Width constraints (max-w, w-full, fixed widths) → match Figma
   □ Grid columns at each breakpoint → match Figma responsive specs

   IMAGES & AVATARS
   ────────────────
   □ Image aspect ratio → match Figma
   □ Image fit (object-cover, object-contain) → match Figma
   □ Avatar size → match Figma exactly
   □ Placeholder/fallback styling → match Figma empty state

   COMPONENT STATES
   ────────────────
   □ Button disabled state → match Figma (opacity, cursor)
   □ Input focus ring → match Figma (ring color, width)
   □ Input error state → match Figma (border color, error text color)
   □ Selected/active tab → match Figma (bg color, text weight, indicator)
   □ Hover states → match Figma if designed
   □ Badge variants → match Figma colors per status

4. After fixing this screen, move to the next. Do NOT skip any screen.
```

---

## After All Screens

```
STEP 4: Verify shared components match Figma Design System page.
  Check each shared component (Button, Card, Input, Badge, Avatar, Skeleton,
  Modal, Tabs, EmptyState, ErrorState) against Figma component specs.
  Fix any mismatches in src/shared/components/.

STEP 5: Verify layouts match Figma.
  Check AppLayout (sidebar width, header height, content padding).
  Check AuthLayout (card width, centering, background).
  Check Sidebar (item height, icon size, active state, collapsed width).
  Check Header (height, padding, avatar size, notification badge).

STEP 6: Responsive spot-check.
  Pick 5 screens. For each, verify:
    □ 375px (mobile) — layout doesn't overflow, touch targets ≥44px
    □ 768px (tablet) — grid adjusts, sidebar collapses if designed
    □ 1280px (desktop) — full layout, correct max-widths
  Fix any responsive issues found.

STEP 7: RTL spot-check.
  Pick 5 screens. Switch to Arabic. Verify:
    □ Layout mirrors correctly
    □ Icons that indicate direction flip
    □ Text aligns to start (right in Arabic)
    □ No broken overflow
  Fix any RTL issues found.

STEP 8: Final verification.
  npx tsc --noEmit → ZERO errors
  npm run lint → ZERO errors
  npm test → ALL still passing (you should NOT have broken any tests)

STEP 9: Commit.
  git add -A && git commit -m "style: figma polish — icons, spacing, typography, colors aligned"
  NEVER push.
```

---

## What You Must NOT Do

```
✗ Change component props or interfaces
✗ Change API calls or service hooks
✗ Change state management or store logic
✗ Change navigation or routing
✗ Change form validation or business logic
✗ Change test files
✗ Restructure or rename files
✗ Add or remove dependencies
✗ Change i18n keys (only fix if wrong key is used)
✗ Hardcode any hex color (add theme token instead)
✗ Use physical properties (left/right/pl/pr)
```

---

## Priority Order

If short on time, fix in this order (highest impact first):

1. **Icons** — wrong icon is immediately visible
2. **Spacing** — wrong padding/gaps make the screen feel "off"
3. **Typography** — wrong size/weight changes information hierarchy
4. **Colors** — wrong color breaks brand consistency
5. **Border radius** — wrong radius breaks component identity
6. **Shadows** — subtle but affects depth perception
7. **Borders** — least impactful visually
