/**
 * Auth Layout
 * Centered card layout for authentication pages
 */

import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

export function AuthLayout(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-bg-main flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-brand-primary">
              {t('common.appName')}
            </h1>
          </div>

          {/* Auth Card */}
          <div className="bg-bg-card rounded-2xl shadow-elevated p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} FAWZ</p>
      </footer>
    </div>
  );
}
