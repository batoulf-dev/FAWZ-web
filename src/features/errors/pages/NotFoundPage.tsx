/**
 * NotFoundPage
 * 404 Not Found Page
 * Route: * (catch-all)
 */

import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Home, SearchX } from 'lucide-react';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { Button } from '@/shared/components/Button';

export default function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();

  usePageTitle(t('errors.notFound'));

  return (
    <div className="min-h-dvh bg-bg-primary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 rounded-full bg-brand-primary/10">
            <SearchX className="h-16 w-16 text-brand-primary" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-brand-primary mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          {t('errors.notFound')}
        </h2>

        {/* Description */}
        <p className="text-text-secondary mb-8">
          {t('errors.notFoundDesc')}
        </p>

        {/* Back to Home Button */}
        <Link to="/">
          <Button
            variant="primary"
            leftIcon={<Home className="h-5 w-5" />}
          >
            {t('errors.backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
