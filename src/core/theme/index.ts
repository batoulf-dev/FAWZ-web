/**
 * FAWZ Design System - Theme Export
 */

export { colors } from './colors';
export type { Colors } from './colors';

export { typography } from './typography';
export type { Typography } from './typography';

export {
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
} from './spacing';
export type {
  Spacing,
  BorderRadius,
  Shadows,
  ZIndex,
  Breakpoints,
} from './spacing';

// Combined theme object for convenience
/* eslint-disable @typescript-eslint/no-require-imports */
export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  borderRadius: require('./spacing').borderRadius,
  shadows: require('./spacing').shadows,
  zIndex: require('./spacing').zIndex,
  breakpoints: require('./spacing').breakpoints,
} as const;
/* eslint-enable @typescript-eslint/no-require-imports */
