/**
 * UI Store Tests
 * Tests for UI state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUIStore } from './ui.store';

// Mock the i18n module
vi.mock('@/core/i18n', () => ({
  changeLanguage: vi.fn().mockResolvedValue(undefined),
  DEFAULT_LANGUAGE: 'ar',
  LANGUAGES: {
    ar: { name: 'العربية', dir: 'rtl' },
    en: { name: 'English', dir: 'ltr' },
  },
}));

describe('ui.store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      language: 'ar',
      theme: 'light',
      sidebarCollapsed: false,
      sidebarOpen: false,
    });
    localStorage.clear();

    // Reset document.documentElement mocks
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useUIStore.getState();

      expect(state.language).toBe('ar');
      expect(state.theme).toBe('light');
      expect(state.sidebarCollapsed).toBe(false);
      expect(state.sidebarOpen).toBe(false);
    });
  });

  describe('setLanguage', () => {
    it('should change language to English', async () => {
      const { setLanguage } = useUIStore.getState();

      await setLanguage('en');

      const state = useUIStore.getState();
      expect(state.language).toBe('en');
    });

    it('should change language to Arabic', async () => {
      // First set to English
      useUIStore.setState({ language: 'en' });

      const { setLanguage } = useUIStore.getState();
      await setLanguage('ar');

      const state = useUIStore.getState();
      expect(state.language).toBe('ar');
    });
  });

  describe('setTheme', () => {
    it('should set light theme', () => {
      const { setTheme } = useUIStore.getState();

      setTheme('light');

      const state = useUIStore.getState();
      expect(state.theme).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('should set dark theme', () => {
      const { setTheme } = useUIStore.getState();

      setTheme('dark');

      const state = useUIStore.getState();
      expect(state.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should handle system theme preference', () => {
      const { setTheme } = useUIStore.getState();

      // Mock matchMedia to return 'prefers dark'
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      setTheme('system');

      const state = useUIStore.getState();
      expect(state.theme).toBe('system');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove previous theme class before adding new one', () => {
      const { setTheme } = useUIStore.getState();

      setTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      setTheme('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  describe('sidebar state', () => {
    describe('toggleSidebar', () => {
      it('should toggle sidebar collapsed state', () => {
        const { toggleSidebar } = useUIStore.getState();

        expect(useUIStore.getState().sidebarCollapsed).toBe(false);

        toggleSidebar();
        expect(useUIStore.getState().sidebarCollapsed).toBe(true);

        toggleSidebar();
        expect(useUIStore.getState().sidebarCollapsed).toBe(false);
      });
    });

    describe('setSidebarCollapsed', () => {
      it('should set sidebar collapsed state directly', () => {
        const { setSidebarCollapsed } = useUIStore.getState();

        setSidebarCollapsed(true);
        expect(useUIStore.getState().sidebarCollapsed).toBe(true);

        setSidebarCollapsed(false);
        expect(useUIStore.getState().sidebarCollapsed).toBe(false);
      });
    });

    describe('setSidebarOpen', () => {
      it('should set mobile sidebar open state', () => {
        const { setSidebarOpen } = useUIStore.getState();

        setSidebarOpen(true);
        expect(useUIStore.getState().sidebarOpen).toBe(true);

        setSidebarOpen(false);
        expect(useUIStore.getState().sidebarOpen).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    it('selectLanguage should return current language', () => {
      const state = useUIStore.getState();
      expect(state.language).toBe('ar');
    });

    it('selectTheme should return current theme', () => {
      useUIStore.setState({ theme: 'dark' });
      const state = useUIStore.getState();
      expect(state.theme).toBe('dark');
    });

    it('selectSidebarCollapsed should return sidebar state', () => {
      useUIStore.setState({ sidebarCollapsed: true });
      const state = useUIStore.getState();
      expect(state.sidebarCollapsed).toBe(true);
    });

    it('selectSidebarOpen should return mobile sidebar state', () => {
      useUIStore.setState({ sidebarOpen: true });
      const state = useUIStore.getState();
      expect(state.sidebarOpen).toBe(true);
    });
  });

  describe('persistence', () => {
    it('should persist UI state to localStorage', async () => {
      const { setLanguage, setTheme, setSidebarCollapsed } = useUIStore.getState();

      await setLanguage('en');
      setTheme('dark');
      setSidebarCollapsed(true);

      // Check localStorage was updated
      const stored = localStorage.getItem('fawz_ui');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored as string);
      expect(parsed.state.language).toBe('en');
      expect(parsed.state.theme).toBe('dark');
      expect(parsed.state.sidebarCollapsed).toBe(true);
    });

    it('should not persist sidebarOpen (mobile only state)', async () => {
      const { setSidebarOpen } = useUIStore.getState();

      setSidebarOpen(true);

      const stored = localStorage.getItem('fawz_ui');
      if (stored) {
        const parsed = JSON.parse(stored);
        // sidebarOpen should not be in persisted state
        expect(parsed.state.sidebarOpen).toBeUndefined();
      }
    });
  });
});
