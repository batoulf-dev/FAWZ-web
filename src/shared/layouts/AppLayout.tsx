/**
 * App Layout
 * Main application layout with sidebar and header
 *
 * Desktop: Fixed 240px sidebar + fluid main content (capped at 1280px)
 * Mobile/Tablet: Bottom tab bar + slide-out drawer
 */

import { Outlet } from 'react-router';
import { cn } from '@/core/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomTabBar } from './BottomTabBar';
import { OfflineBanner } from '@/shared/components/OfflineBanner';

export function AppLayout(): JSX.Element {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-dvh bg-bg-main">
      {/* Sidebar - fixed 240px on desktop, drawer on mobile */}
      <Sidebar />

      {/* Header - adjusts for sidebar width */}
      <Header />

      {/* Main Content Area */}
      <main
        className={cn(
          'transition-all duration-300',
          // Top padding for header on mobile/tablet only
          'pt-16 lg:pt-0',
          // Bottom padding for mobile tab bar, none on desktop
          'pb-24 lg:pb-0',
          // Adjust for sidebar width on desktop (240px expanded, 80px collapsed)
          sidebarCollapsed ? 'lg:ps-20' : 'lg:ps-60',
        )}
      >
        {/* Content container with max-width cap for desktop */}
        <div className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Offline Banner */}
      <OfflineBanner />

      {/* Bottom Tab Bar (mobile/tablet only, hidden lg+) */}
      <BottomTabBar />
    </div>
  );
}
