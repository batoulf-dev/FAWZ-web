/**
 * BottomTabBar Component
 * Mobile bottom navigation with 4 tabs
 * Only visible on mobile (< lg breakpoint)
 */

import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Sparkles, Ticket, Award, UserRound } from 'lucide-react';
import { cn } from '@/core/utils/cn';

interface TabItem {
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  path: string;
  isActive: (pathname: string) => boolean;
}

const tabs: TabItem[] = [
  {
    icon: Sparkles,
    labelKey: 'navigation.home',
    path: '/',
    isActive: (pathname) => pathname === '/',
  },
  {
    icon: Ticket,
    labelKey: 'tickets.myTickets',
    path: '/entries',
    isActive: (pathname) =>
      pathname.startsWith('/entries') || pathname.startsWith('/tickets'),
  },
  {
    icon: Award,
    labelKey: 'challenge.challenges',
    path: '/challenges',
    isActive: (pathname) => pathname.startsWith('/challenges'),
  },
  {
    icon: UserRound,
    labelKey: 'navigation.profile',
    path: '/profile',
    isActive: (pathname) =>
      pathname.startsWith('/profile') || pathname.startsWith('/settings'),
  },
];

export function BottomTabBar(): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-50 bg-bg-card shadow-[0_-4px_16px_rgba(0,0,0,0.08)] border-t border-border-subtle lg:hidden safe-area-inset-bottom">
      <div className="flex h-20">
        {tabs.map((tab) => {
          const isActive = tab.isActive(location.pathname);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1.5 flex-1 min-h-11 transition-all duration-200"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                'p-2.5 rounded-full transition-all duration-200',
                isActive && 'bg-[#FFC107] shadow-sm'
              )}>
                <Icon className={cn(
                  'h-6 w-6 transition-transform duration-200',
                  isActive
                    ? 'text-brand-primary scale-110'
                    : 'text-text-muted hover:text-text-secondary'
                )} />
              </div>
              <span className={cn(
                'text-xs font-medium transition-all duration-200 text-text-primary',
                isActive && 'font-semibold'
              )}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
