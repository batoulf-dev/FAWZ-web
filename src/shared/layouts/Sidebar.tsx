/**
 * Sidebar Component
 * Collapsible navigation sidebar with user menu (desktop)
 */

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Ticket,
  Trophy,
  Award,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  X,
  Bell,
  Globe,
  LogOut,
} from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { Avatar } from '@/shared/components/Avatar';
import { type Language, LANGUAGES } from '@/core/i18n';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { labelKey: 'navigation.home', href: '/', icon: Home },
  { labelKey: 'navigation.draws', href: '/draws', icon: Trophy },
  { labelKey: 'navigation.myTickets', href: '/entries', icon: Ticket },
  { labelKey: 'challenge.challenges', href: '/challenges', icon: Award },
  { labelKey: 'navigation.profile', href: '/profile', icon: User },
  { labelKey: 'navigation.settings', href: '/settings', icon: Settings },
  { labelKey: 'navigation.help', href: '/help', icon: HelpCircle },
];

export function Sidebar(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLanguageChange = async (lang: Language): Promise<void> => {
    await setLanguage(lang);
    setShowLangMenu(false);
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 start-0 z-40 h-full bg-bg-card border-e border-border-default',
          'flex flex-col',
          'transition-all duration-300 ease-in-out',
          // Mobile (<lg): hidden by default, slides in when open
          sidebarOpen
            ? 'translate-x-0'
            : 'max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full',
          // Desktop (lg+): always visible
          'lg:translate-x-0',
          // Desktop: collapsed (80px) / expanded (240px)
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-60',
          // Mobile drawer width
          'w-64',
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border-default">
          {!sidebarCollapsed && (
            <img
              src="/fawz-logo.png"
              alt="Fawz"
              className="h-10 w-auto object-contain"
            />
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-bg-muted xl:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'hidden lg:flex p-2 rounded-lg hover:bg-bg-muted transition-colors',
              sidebarCollapsed && 'mx-auto',
            )}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight
              className={cn(
                'h-5 w-5 transition-transform',
                !sidebarCollapsed && 'rotate-180 rtl:rotate-0',
                sidebarCollapsed && 'ltr:rotate-180',
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  'hover:bg-bg-muted',
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary font-medium'
                    : 'text-text-secondary',
                  sidebarCollapsed && 'lg:justify-center lg:px-2',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="lg:block">{t(item.labelKey)}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer - User & Actions (desktop only) */}
        <div className="hidden lg:block border-t border-border-default p-4 space-y-2">
          {/* Quick Actions Row */}
          <div className={cn(
            'flex items-center gap-1',
            sidebarCollapsed ? 'flex-col' : 'justify-between'
          )}>
            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-lg hover:bg-bg-muted transition-colors relative"
              aria-label={t('navigation.notifications')}
            >
              <Bell className="h-5 w-5 text-text-secondary" />
              <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-error" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2 rounded-lg hover:bg-bg-muted transition-colors"
                aria-label={t('settings.language')}
              >
                <Globe className="h-5 w-5 text-text-secondary" />
              </button>

              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute bottom-full mb-1 start-0 z-20 w-32 bg-bg-card rounded-lg shadow-elevated border border-border-default overflow-hidden">
                    {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES.ar][]).map(
                      ([code, { name }]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageChange(code)}
                          className={cn(
                            'w-full px-3 py-2 text-start text-sm hover:bg-bg-muted transition-colors',
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

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-error/10 transition-colors"
              aria-label={t('auth.logout')}
            >
              <LogOut className="h-5 w-5 text-error" />
            </button>
          </div>

          {/* User Info */}
          {!sidebarCollapsed && user && (
            <NavLink
              to="/profile"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-muted transition-colors"
            >
              <Avatar src={user.avatar_url} name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-muted truncate">{user.phone}</p>
              </div>
            </NavLink>
          )}

          {/* Collapsed user avatar */}
          {sidebarCollapsed && user && (
            <NavLink
              to="/profile"
              className="flex justify-center p-2 rounded-lg hover:bg-bg-muted transition-colors"
            >
              <Avatar src={user.avatar_url} name={user.name} size="sm" />
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
