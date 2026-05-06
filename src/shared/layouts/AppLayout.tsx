/**
 * App Layout
 * Main application layout with sidebar and header
 */

import { Outlet } from 'react-router';
import { cn } from '@/core/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OfflineBanner } from '@/shared/components/OfflineBanner';

export function AppLayout(): JSX.Element {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-dvh bg-bg-main">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-dvh transition-all duration-300',
          // Adjust for sidebar width
          sidebarCollapsed ? 'lg:ps-20' : 'lg:ps-64',
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Offline Banner */}
      <OfflineBanner />
    </div>
  );
}
