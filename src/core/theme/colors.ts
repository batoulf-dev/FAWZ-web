/**
 * FAWZ Design System - Color Tokens
 * Extracted from design-reference.png
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#6B4EAA',
    primaryLight: '#8B6FC8',
    primaryDark: '#4A3580',
    secondary: '#F5A623',
    secondaryLight: '#FFD270',
    secondaryDark: '#C88500',
  },

  // Background Colors
  background: {
    main: '#F5F2ED',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    muted: '#F0EDE8',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#1A1A1A',
    secondary: '#6B6B6B',
    muted: '#9B9B9B',
    inverse: '#FFFFFF',
    link: '#6B4EAA',
  },

  // Border Colors
  border: {
    default: '#E5E2DD',
    subtle: '#F0EDE8',
    strong: '#D1CEC9',
    focus: '#6B4EAA',
  },

  // Status Colors
  status: {
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

  // Prize Tiers (for draw results)
  prize: {
    jackpot: '#FFD700',
    last10: '#F5A623',
    last7: '#6B4EAA',
    last5: '#3B82F6',
    last3: '#22C55E',
  },

  // Interactive States
  interactive: {
    hover: 'rgba(107, 78, 170, 0.08)',
    pressed: 'rgba(107, 78, 170, 0.12)',
    disabled: '#D1CEC9',
    disabledText: '#9B9B9B',
  },
} as const;

export type Colors = typeof colors;
