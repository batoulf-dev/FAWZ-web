/**
 * UI Store
 * Manages UI state with localStorage persistence
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Language, changeLanguage, DEFAULT_LANGUAGE } from '@/core/i18n';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  // State
  language: Language;
  theme: Theme;
  sidebarCollapsed: boolean;
  sidebarOpen: boolean; // Mobile sidebar

  // Actions
  setLanguage: (lang: Language) => Promise<void>;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      language: DEFAULT_LANGUAGE,
      theme: 'light',
      sidebarCollapsed: false,
      sidebarOpen: false,

      // Change language
      setLanguage: async (lang) => {
        await changeLanguage(lang);
        set({ language: lang });
      },

      // Change theme
      setTheme: (theme) => {
        set({ theme });

        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      // Toggle sidebar collapsed state (desktop)
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      // Set sidebar collapsed (desktop)
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Set sidebar open (mobile)
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
    }),
    {
      name: 'fawz_ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.theme) {
          const root = document.documentElement;
          root.classList.remove('light', 'dark');

          if (state.theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
              .matches
              ? 'dark'
              : 'light';
            root.classList.add(systemTheme);
          } else {
            root.classList.add(state.theme);
          }
        }
      },
    },
  ),
);

// Selectors
export const selectLanguage = (state: UIState) => state.language;
export const selectTheme = (state: UIState) => state.theme;
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
