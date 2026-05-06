/**
 * Sidebar Component
 * Collapsible navigation sidebar
 */

import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Ticket,
  Trophy,
  Wallet,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { useUIStore } from '@/stores/ui.store';

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { labelKey: 'navigation.home', href: '/', icon: Home },
  { labelKey: 'navigation.draws', href: '/draws', icon: Trophy },
  { labelKey: 'navigation.myTickets', href: '/tickets', icon: Ticket },
  { labelKey: 'navigation.wallet', href: '/wallet', icon: Wallet },
  { labelKey: 'navigation.profile', href: '/profile', icon: User },
  { labelKey: 'navigation.settings', href: '/settings', icon: Settings },
  { labelKey: 'navigation.help', href: '/help', icon: HelpCircle },
];

export function Sidebar(): JSX.Element {
  const { t } = useTranslation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 start-0 z-40 h-full bg-bg-card border-e border-border-default',
          'transition-all duration-300 ease-in-out',
          // Mobile: slide in/out
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full',
          // Desktop: collapsed/expanded
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile width
          'w-64',
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border-default">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-brand-primary">
              {t('common.appName')}
            </h1>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-bg-muted lg:hidden"
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
                sidebarCollapsed && 'rtl:rotate-180',
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
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
      </aside>
    </>
  );
}
