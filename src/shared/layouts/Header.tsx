/**
 * Header Component
 * Top navigation bar with user menu and language switcher
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { Avatar } from '@/shared/components/Avatar';
import { type Language, LANGUAGES } from '@/core/i18n';

export function Header(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 end-0 z-30 h-16 bg-bg-card border-b border-border-default',
        'transition-all duration-300',
        // Adjust for sidebar width
        sidebarCollapsed ? 'lg:start-20' : 'lg:start-64',
        'start-0',
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Left side - Menu, Language, Notifications */}
        <div className="flex items-center gap-2 flex-1">
          {/* Tablet menu button - hidden on mobile (<768px) and desktop (>=1024px), visible on tablet only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden md:block lg:hidden p-2 rounded-lg hover:bg-bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-bg-muted transition-colors"
              aria-label="Change language"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">{LANGUAGES[language].name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute start-0 top-full mt-1 z-20 w-40 bg-bg-card rounded-lg shadow-elevated border border-border-default overflow-hidden">
                  {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES.ar][]).map(
                    ([code, { name }]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={cn(
                          'w-full px-4 py-2.5 text-start text-sm hover:bg-bg-muted transition-colors',
                          language === code && 'bg-brand-primary/10 text-brand-primary font-medium',
                        )}
                      >
                        {name}
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-lg hover:bg-bg-muted transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-error" />
          </button>
        </div>

        {/* Center - Logo */}
        <div className="flex items-center justify-center">
          <img
            src="/fawz-logo.png"
            alt="Fawz"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Right side - Profile only */}
        <div className="flex items-center justify-end flex-1">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-muted transition-colors"
            >
              <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
              <ChevronDown className="h-4 w-4 hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute end-0 top-full mt-1 z-20 w-48 bg-bg-card rounded-lg shadow-elevated border border-border-default overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border-default">
                    <p className="font-medium text-text-primary truncate">
                      {user?.name ?? t('navigation.profile')}
                    </p>
                    <p className="text-sm text-text-muted truncate">{user?.phone}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-bg-muted transition-colors"
                    >
                      <User className="h-4 w-4" />
                      {t('navigation.profile')}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('auth.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
